import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyAdmin } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, firstName, lastName, email, phone, clubVenue, bookingDate, guestsTotal, budget, addOns, specialRequests } = body

    if (!firstName || !email || !bookingDate) {
      return NextResponse.json({ error: 'First name, email and booking date are required' }, { status: 400 })
    }

    const booking = await prisma.eventBooking.create({
      data: {
        eventId: eventId || null,
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

    notifyAdmin(
      `New Event Booking`,
      `<h2>New Event Booking</h2>
      <p><strong>Name:</strong> ${firstName}${lastName ? ` ${lastName}` : ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${clubVenue ? `<p><strong>Venue:</strong> ${clubVenue}</p>` : ""}
      <p><strong>Date:</strong> ${bookingDate}</p>
      ${guestsTotal ? `<p><strong>Guests:</strong> ${guestsTotal}</p>` : ""}
      ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ""}
      ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ""}
      <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/bookings">View in Admin →</a></p>`
    )

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
