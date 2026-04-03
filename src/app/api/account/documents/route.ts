import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = (session.user as any).id

    const formData = await request.formData()
    const type = formData.get('type') as string
    const number = formData.get('number') as string
    const expiration = formData.get('expiration') as string
    const file = formData.get('file') as File | null

    if (!type || !['DRIVING_LICENSE', 'INSURANCE_POLICY', 'PASSPORT_ID'].includes(type)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }

    let fileUrl: string | null = null
    if (file && file.size > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
      await writeFile(path.join(uploadDir, uniqueName), buffer)
      fileUrl = `/uploads/${uniqueName}`
    }

    const docData = JSON.stringify({ url: fileUrl, number: number || null, expiry: expiration || null })

    if (type === 'DRIVING_LICENSE') {
      await prisma.user.update({
        where: { id: userId },
        data: { driverLicense: docData, driverLicenseStatus: 'PENDING' },
      })
    } else if (type === 'INSURANCE_POLICY') {
      await prisma.user.update({
        where: { id: userId },
        data: { insurance: docData, insuranceStatus: 'PENDING' },
      })
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { passport: docData, passportStatus: 'PENDING' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 })
  }
}
