import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { isPrimary: 'desc' } },
      },
    })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.car.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    // Regenerate slug if name changed
    if (body.name && body.name !== existing.name) {
      body.slug = body.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
    }

    const car = await prisma.car.update({
      where: { id },
      data: body,
      include: { brand: true, category: true, images: true },
    })

    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.car.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    // Images cascade delete via schema, but bookings do not
    // Delete related bookings first, then the car
    await prisma.booking.deleteMany({ where: { carId: id } })
    await prisma.car.delete({ where: { id } })

    return NextResponse.json({ message: 'Car deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 })
  }
}
