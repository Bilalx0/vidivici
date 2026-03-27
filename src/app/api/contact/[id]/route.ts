import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: body.isRead },
    })

    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.contactMessage.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    await prisma.contactMessage.delete({ where: { id } })

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
