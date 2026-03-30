import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, firstName, lastName, email, phone, clubVenue, bookingDate, guestsTotal, budget, addOns, specialRequests } = body

    if (!firstName || !email || !bookingDate || !eventId) {
      return NextResponse.json({ error: 'First name, email, booking date and event are required' }, { status: 400 })
    }

    const booking = await prisma.eventBooking.create({
      data: {
        eventId,
        firstName,
        lastName: lastName || null,
        email,
        phone: phone || null,
        clubVenue: clubVenue || null,
        bookingDate: new Date(bookingDate),
        guestsTotal: guestsTotal || null,
        budget: budget || null,
        addOns: addOns || null,
        specialRequests: specialRequests || null,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Failed to create event booking:', error)
    return NextResponse.json({ error: 'Failed to submit booking request' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')

    const bookings = await prisma.eventBooking.findMany({
      include: { event: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event bookings' }, { status: 500 })
  }
}
