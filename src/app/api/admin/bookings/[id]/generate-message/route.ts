import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { messageType, alternativeVehicle } = body
    // messageType: "confirmation" | "alternative" | "custom"

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ AI not configured" }, { status: 500 })
    }

    // Try car booking first, then villa, then event
    let bookingData: any = null
    let bookingKind = ""

    const carBooking = await prisma.booking.findUnique({
      where: { id },
      include: { car: { include: { brand: true } }, user: { select: { name: true, email: true, phone: true } } },
    })

    if (carBooking) {
      bookingData = carBooking
      bookingKind = "car"
    } else {
      const villaBooking = await prisma.villaBooking.findUnique({
        where: { id },
        include: { villa: true, user: { select: { name: true, email: true, phone: true } } },
      })
      if (villaBooking) {
        bookingData = villaBooking
        bookingKind = "villa"
      } else {
        const eventBooking = await prisma.eventBooking.findUnique({ where: { id } })
        if (eventBooking) {
          bookingData = eventBooking
          bookingKind = "event"
        }
      }
    }

    if (!bookingData) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const custName = bookingData.user?.name || bookingData.customerName || bookingData.firstName || "Customer"
    const custEmail = bookingData.user?.email || bookingData.customerEmail || bookingData.email || ""
    const custPhone = bookingData.user?.phone || bookingData.customerPhone || bookingData.phone || ""

    let itemName = ""
    let dates = ""
    let price = ""
    let details = ""

    if (bookingKind === "car") {
      itemName = `${bookingData.car?.brand?.name || ""} ${bookingData.car?.name || ""}`.trim()
      const start = new Date(bookingData.startDate)
      const end = new Date(bookingData.endDate)
      dates = `${start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} to ${end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
      price = `$${bookingData.totalPrice?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      details = `Pickup: ${bookingData.pickupLocation || "TBD"}, Dropoff: ${bookingData.dropoffLocation || "TBD"}`
      if (bookingData.notes) details += `\nNotes: ${bookingData.notes}`
    } else if (bookingKind === "villa") {
      itemName = bookingData.villa?.name || "Villa"
      const start = new Date(bookingData.checkIn)
      const end = new Date(bookingData.checkOut)
      dates = `${start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} to ${end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
      price = `$${bookingData.totalPrice?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      details = `Guests: ${bookingData.guests || 1}`
      if (bookingData.notes) details += `\nNotes: ${bookingData.notes}`
    } else if (bookingKind === "event") {
      itemName = bookingData.event?.name || "Event Booking"
      dates = new Date(bookingData.bookingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      price = `$${bookingData.totalPrice?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      details = `Guests: ${bookingData.guestsTotal || "N/A"}, Venue: ${bookingData.clubVenue || "N/A"}`
    }

    let systemPrompt = ""

    if (messageType === "confirmation") {
      systemPrompt = `You are a luxury concierge assistant for VIDI VICI, a premium car and villa rental company in Los Angeles and Miami.
Write a professional, warm booking confirmation message for a customer. Keep it concise (under 200 words) and elegant.
Include: greeting with their name, confirmation of what they booked, dates, total price, and a warm closing. 
Sign off as "VIDI VICI Reservations Team".
Do NOT use markdown formatting - write plain text suitable for both email and WhatsApp.`
    } else if (messageType === "alternative") {
      systemPrompt = `You are a luxury concierge assistant for VIDI VICI, a premium car and villa rental company in Los Angeles and Miami.
The customer originally requested "${itemName}" but it is not available for their dates. 
We'd like to offer them "${alternativeVehicle || "an alternative vehicle"}" instead.
Write a professional, apologetic, and warm message suggesting this alternative. Keep it concise (under 200 words).
Include: greeting with their name, explanation that the requested vehicle isn't available, the alternative suggestion, their original dates, and ask if this would work for them.
Sign off as "VIDI VICI Reservations Team".
Do NOT use markdown formatting - write plain text suitable for both email and WhatsApp.`
    } else {
      systemPrompt = `You are a luxury concierge assistant for VIDI VICI, a premium car and villa rental company in Los Angeles and Miami.
Write a professional message to the customer regarding their booking. Keep it concise and elegant.
Sign off as "VIDI VICI Reservations Team".
Do NOT use markdown formatting - write plain text suitable for both email and WhatsApp.`
    }

    const userPrompt = `Booking details:
- Customer Name: ${custName}
- Customer Email: ${custEmail}
- Customer Phone: ${custPhone}
- Item: ${itemName}
- Type: ${bookingKind}
- Dates: ${dates}
- Total Price: ${price}
- Status: ${bookingData.status || bookingData.paymentStatus || "PENDING"}
- Details: ${details}
${alternativeVehicle ? `- Alternative Vehicle Offered: ${alternativeVehicle}` : ""}`

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("GROQ error:", err)
      return NextResponse.json({ error: "Failed to generate message" }, { status: 500 })
    }

    const data = await res.json()
    const message = data.choices?.[0]?.message?.content || ""

    const emailSubject = messageType === "confirmation"
      ? `Booking Confirmation — ${itemName}`
      : messageType === "alternative"
        ? `Regarding Your ${itemName} Reservation — Alternative Available`
        : `Update on Your VIDI VICI Booking`

    return NextResponse.json({
      message,
      emailSubject,
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      itemName,
      bookingKind,
    })
  } catch (error: any) {
    console.error("Generate message error:", error)
    return NextResponse.json({ error: "Failed to generate message" }, { status: 500 })
  }
}
