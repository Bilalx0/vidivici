import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { carId, customerName, customerEmail, customerPhone, startDate, endDate, pickupLocation, dropoffLocation, totalPrice, status, paymentStatus, notes } = body

    if (!carId || !customerEmail || !startDate || !endDate) {
      return NextResponse.json({ error: 'Car, email, start date, and end date are required' }, { status: 400 })
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({ where: { email: customerEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: customerEmail,
          name: customerName || null,
          phone: customerPhone || null,
          password: '',
        },
      })
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        pickupLocation: pickupLocation || 'Office',
        dropoffLocation: dropoffLocation || pickupLocation || 'Office',
        totalPrice: totalPrice ? parseFloat(totalPrice) : 0,
        status: status || 'CONFIRMED',
        paymentStatus: paymentStatus || 'UNPAID',
        notes: notes || null,
      },
      include: { car: { include: { brand: true } }, user: { select: { name: true, email: true } } },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Failed to create manual booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
