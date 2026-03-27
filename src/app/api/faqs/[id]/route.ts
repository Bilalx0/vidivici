import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 })
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(faq)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.fAQ.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 })
    }

    await prisma.fAQ.delete({ where: { id } })

    return NextResponse.json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 })
  }
}
