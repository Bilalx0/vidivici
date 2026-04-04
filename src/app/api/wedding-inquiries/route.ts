import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyAdmin } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, eventType, eventDate, guestCount, addOns, specialRequests } = body

    if (!firstName || !email || !eventType || !eventDate) {
      return NextResponse.json({ error: 'First name, email, event type and event date are required' }, { status: 400 })
    }

    const inquiry = await prisma.weddingInquiry.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        phone: phone || null,
        eventType,
        eventDate: new Date(eventDate),
        guestCount: parseInt(guestCount) || 50,
        addOns: addOns || null,
        specialRequests: specialRequests || null,
      },
    })

    notifyAdmin(
      `New Wedding/Event Inquiry`,
      `<h2>New Wedding/Event Inquiry</h2>
      <p><strong>Name:</strong> ${firstName}${lastName ? ` ${lastName}` : ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      <p><strong>Event Type:</strong> ${eventType}</p>
      <p><strong>Event Date:</strong> ${eventDate}</p>
      <p><strong>Guests:</strong> ${guestCount || "N/A"}</p>
      ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ""}
      <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/messages">View in Admin →</a></p>`
    )

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
