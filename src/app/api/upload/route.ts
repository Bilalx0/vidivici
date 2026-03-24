import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const urls: string[] = []
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const filePath = path.join(uploadDir, uniqueName)
      await writeFile(filePath, buffer)
      urls.push(`/uploads/${uniqueName}`)
    }

    return NextResponse.json({ urls }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
}
