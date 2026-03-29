import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const villa = await prisma.villa.findUnique({
      where: { id },
      include: { images: { orderBy: { isPrimary: 'desc' } } },
    })

    if (!villa) {
      return NextResponse.json({ error: 'Villa not found' }, { status: 404 })
    }

    return NextResponse.json(villa)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch villa' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.villa.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Villa not found' }, { status: 404 })
    }

    const { images, ...villaData } = body

    if (villaData.name && villaData.name !== existing.name) {
      villaData.slug = villaData.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
    }

    if (images && images.length > 0) {
      await prisma.villaImage.deleteMany({ where: { villaId: id } })
      await prisma.villaImage.createMany({
        data: (images as string[]).map((url: string, i: number) => ({
          url,
          isPrimary: i === 0,
          villaId: id,
        })),
      })
    }

    const villa = await prisma.villa.update({
      where: { id },
      data: villaData,
      include: { images: true },
    })

    return NextResponse.json(villa)
  } catch (error) {
    console.error('Failed to update villa:', error)
    return NextResponse.json({ error: 'Failed to update villa' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.villa.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Villa not found' }, { status: 404 })
    }

    await prisma.villaBooking.deleteMany({ where: { villaId: id } })
    await prisma.villa.delete({ where: { id } })

    return NextResponse.json({ message: 'Villa deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete villa' }, { status: 500 })
  }
}
