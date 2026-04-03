import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { docType, status } = await request.json()

    if (!['DRIVING_LICENSE', 'INSURANCE_POLICY', 'PASSPORT_ID'].includes(docType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }
    if (!['VERIFIED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const data =
      docType === 'DRIVING_LICENSE'
        ? { driverLicenseStatus: status }
        : docType === 'INSURANCE_POLICY'
        ? { insuranceStatus: status }
        : { passportStatus: status }

    await prisma.user.update({ where: { id }, data })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update document status' }, { status: 500 })
  }
}
