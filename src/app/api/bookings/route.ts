import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const where: any = {}
    if ((session.user as any).role !== 'ADMIN') {
      where.userId = (session.user as any).id
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { car: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } }, user: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { carId, startDate, endDate, pickupLocation, dropoffLocation, notes } = body

    const car = await prisma.car.findUnique({ where: { id: carId } })
    if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days < car.minRentalDays) {
      return NextResponse.json({ error: `Minimum rental is ${car.minRentalDays} days` }, { status: 400 })
    }

    let discount = 0
    if (days >= 28) discount = 0.4
    else if (days >= 7) discount = 0.15
    const totalPrice = car.pricePerDay * days * (1 - discount)

    const booking = await prisma.booking.create({
      data: {
        userId: (session.user as any).id,
        carId,
        startDate: start,
        endDate: end,
        pickupLocation,
        dropoffLocation: dropoffLocation || pickupLocation,
        totalPrice,
        notes,
      },
      include: { car: { include: { brand: true } } },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
