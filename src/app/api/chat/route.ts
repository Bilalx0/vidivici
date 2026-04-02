import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const GROQ_API_KEY = process.env.GROQ_API_KEY!
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

const SYSTEM_PROMPT = `You are Mark, the friendly and knowledgeable concierge assistant for VIDI VICI — a luxury rental marketplace in Los Angeles and Miami offering exotic cars, luxury villas, and exclusive events.

Your personality:
- Warm, professional, and conversational
- You know luxury lifestyle well
- You guide customers naturally through finding what they want
- You ask follow-up questions to narrow down their needs before searching
- You're helpful but concise — no walls of text

When a customer asks about cars, villas, or events:
1. Ask clarifying questions (budget, dates, location, preferences, group size, etc.)
2. Once you have enough info, use the search tools to find matching options
3. Present results naturally with links (format: [Name](/cars/slug) or [Name](/villas/slug) or [Name](/events/slug))
4. Ask if they'd like you to book it for them
5. If they want to book, collect the necessary details and use the booking tools

Important rules:
- Always format links as markdown: [Item Name](/type/slug)
- When presenting search results, show name, key details, and price
- For car bookings you need: carId, startDate, endDate, pickupLocation
- For villa bookings you need: villaId, checkIn, checkOut, guests
- For event bookings you need: firstName, email, bookingDate, and optionally eventId, phone, guestsTotal, budget
- When booking, let the user know it's been booked and they'll hear from the team
- Keep responses concise and luxury-feeling
- If you don't find results, suggest alternatives or ask them to adjust criteria
- You can search multiple times with different criteria if needed`

const tools = [
  {
    type: "function",
    function: {
      name: "search_cars",
      description: "Search for available luxury cars. Use this when the customer wants to find or browse cars.",
      parameters: {
        type: "object",
        properties: {
          search: { type: "string", description: "Search term for car name or brand (e.g. 'Lamborghini', 'Ferrari', 'SUV')" },
          location: { type: "string", description: "City/location filter (e.g. 'Los Angeles', 'Miami')" },
          minPrice: { type: "number", description: "Minimum daily price in USD" },
          maxPrice: { type: "number", description: "Maximum daily price in USD" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_villas",
      description: "Search for available luxury villas. Use this when the customer wants to find villas or properties.",
      parameters: {
        type: "object",
        properties: {
          search: { type: "string", description: "Search term for villa name or area" },
          location: { type: "string", description: "City/location filter" },
          minBedrooms: { type: "number", description: "Minimum number of bedrooms" },
          minGuests: { type: "number", description: "Minimum guest capacity" },
          minPrice: { type: "number", description: "Minimum nightly price" },
          maxPrice: { type: "number", description: "Maximum nightly price" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_events",
      description: "Search for available events and venues. Use this when the customer wants to find events, clubs, or venues.",
      parameters: {
        type: "object",
        properties: {
          search: { type: "string", description: "Search term for event name or venue" },
          location: { type: "string", description: "City/location filter" },
          category: { type: "string", description: "Event category (e.g. 'Nightlife', 'Private')" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_car",
      description: "Book a car rental for the customer. Use this when the customer confirms they want to book a specific car.",
      parameters: {
        type: "object",
        properties: {
          carId: { type: "string", description: "The car ID to book" },
          startDate: { type: "string", description: "Rental start date (YYYY-MM-DD)" },
          endDate: { type: "string", description: "Rental end date (YYYY-MM-DD)" },
          pickupLocation: { type: "string", description: "Pickup location/address" },
          customerName: { type: "string", description: "Customer's name" },
          customerEmail: { type: "string", description: "Customer's email" },
          notes: { type: "string", description: "Any special requests" },
        },
        required: ["carId", "startDate", "endDate", "pickupLocation"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_villa",
      description: "Book a villa stay for the customer. Use this when the customer confirms they want to book a specific villa.",
      parameters: {
        type: "object",
        properties: {
          villaId: { type: "string", description: "The villa ID to book" },
          checkIn: { type: "string", description: "Check-in date (YYYY-MM-DD)" },
          checkOut: { type: "string", description: "Check-out date (YYYY-MM-DD)" },
          guests: { type: "number", description: "Number of guests" },
          customerName: { type: "string", description: "Customer's name" },
          customerEmail: { type: "string", description: "Customer's email" },
          notes: { type: "string", description: "Any special requests" },
        },
        required: ["villaId", "checkIn", "checkOut"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "book_event",
      description: "Book an event/venue for the customer. Use this when the customer confirms they want to book an event.",
      parameters: {
        type: "object",
        properties: {
          eventId: { type: "string", description: "The event ID (optional)" },
          firstName: { type: "string", description: "Customer's first name" },
          lastName: { type: "string", description: "Customer's last name" },
          email: { type: "string", description: "Customer's email" },
          phone: { type: "string", description: "Customer's phone" },
          bookingDate: { type: "string", description: "Event date (YYYY-MM-DD)" },
          guestsTotal: { type: "string", description: "Number of guests" },
          budget: { type: "string", description: "Budget range" },
          clubVenue: { type: "string", description: "Venue name" },
          specialRequests: { type: "string", description: "Any special requests" },
        },
        required: ["firstName", "email", "bookingDate"],
      },
    },
  },
]

// Tool execution functions
async function searchCars(params: any) {
  const where: any = { isAvailable: true }
  if (params.location) where.location = { contains: params.location, mode: "insensitive" }
  if (params.minPrice || params.maxPrice) {
    where.pricePerDay = {}
    if (params.minPrice) where.pricePerDay.gte = params.minPrice
    if (params.maxPrice) where.pricePerDay.lte = params.maxPrice
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { brand: { name: { contains: params.search, mode: "insensitive" } } },
      { category: { name: { contains: params.search, mode: "insensitive" } } },
    ]
  }

  const cars = await prisma.car.findMany({
    where,
    include: { brand: true, category: true, images: { where: { isPrimary: true }, take: 1 } },
    take: 5,
    orderBy: { isFeatured: "desc" },
  })

  return cars.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    brand: c.brand.name,
    category: c.category.name,
    pricePerDay: c.pricePerDay,
    year: c.year,
    seats: c.seats,
    transmission: c.transmission,
    location: c.location,
    minRentalDays: c.minRentalDays,
  }))
}

async function searchVillas(params: any) {
  const where: any = { isAvailable: true }
  if (params.location) where.location = { contains: params.location, mode: "insensitive" }
  if (params.minBedrooms) where.bedrooms = { gte: params.minBedrooms }
  if (params.minGuests) where.guests = { gte: params.minGuests }
  if (params.minPrice || params.maxPrice) {
    where.pricePerNight = {}
    if (params.minPrice) where.pricePerNight.gte = params.minPrice
    if (params.maxPrice) where.pricePerNight.lte = params.maxPrice
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { location: { contains: params.search, mode: "insensitive" } },
    ]
  }

  const villas = await prisma.villa.findMany({
    where,
    include: { images: { where: { isPrimary: true }, take: 1 } },
    take: 5,
    orderBy: { isFeatured: "desc" },
  })

  return villas.map((v) => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    location: v.location,
    bedrooms: v.bedrooms,
    bathrooms: v.bathrooms,
    guests: v.guests,
    sqft: v.sqft,
    pricePerNight: v.pricePerNight,
  }))
}

async function searchEvents(params: any) {
  const where: any = { isAvailable: true }
  if (params.location) where.location = { contains: params.location, mode: "insensitive" }
  if (params.category) where.category = { contains: params.category, mode: "insensitive" }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { venueName: { contains: params.search, mode: "insensitive" } },
      { location: { contains: params.search, mode: "insensitive" } },
    ]
  }

  const events = await prisma.event.findMany({
    where,
    include: { images: { where: { isPrimary: true }, take: 1 } },
    take: 5,
    orderBy: { isFeatured: "desc" },
  })

  return events.map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    location: e.location,
    category: e.category,
    venueName: e.venueName,
    capacity: e.capacity,
    priceRange: e.priceRange,
  }))
}

async function bookCar(params: any) {
  const car = await prisma.car.findUnique({ where: { id: params.carId } })
  if (!car) return { error: "Car not found" }

  const start = new Date(params.startDate)
  const end = new Date(params.endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (days < car.minRentalDays) return { error: `Minimum rental is ${car.minRentalDays} days` }

  let discount = 0
  if (days >= 28) discount = 0.4
  else if (days >= 7) discount = 0.15
  const totalPrice = car.pricePerDay * days * (1 - discount)

  // Find or create a placeholder user for Mark bookings
  let user = await prisma.user.findFirst({ where: { email: "mark-ai@vidivici.com" } })
  if (!user) {
    user = await prisma.user.create({
      data: { email: "mark-ai@vidivici.com", name: "Mark AI Assistant", password: "not-a-real-login", role: "USER" },
    })
  }

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      carId: params.carId,
      startDate: start,
      endDate: end,
      pickupLocation: params.pickupLocation,
      dropoffLocation: params.pickupLocation,
      totalPrice,
      notes: `Booked by MARK | Customer: ${params.customerName || "N/A"} | Email: ${params.customerEmail || "N/A"} | ${params.notes || ""}`.trim(),
    },
    include: { car: { include: { brand: true } } },
  })

  return {
    success: true,
    bookingId: booking.id,
    bookingNumber: booking.bookingNumber,
    car: `${booking.car.brand.name} ${booking.car.name}`,
    dates: `${params.startDate} to ${params.endDate}`,
    totalPrice,
    days,
    discount: discount > 0 ? `${Math.round(discount * 100)}% off` : "none",
  }
}

async function bookVilla(params: any) {
  const villa = await prisma.villa.findUnique({ where: { id: params.villaId } })
  if (!villa) return { error: "Villa not found" }

  const start = new Date(params.checkIn)
  const end = new Date(params.checkOut)
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  const nightsTotal = villa.pricePerNight * nights
  const subtotal = nightsTotal + villa.cleaningFee
  const tax = subtotal * 0.14
  const totalPrice = subtotal + tax + villa.securityDeposit

  let user = await prisma.user.findFirst({ where: { email: "mark-ai@vidivici.com" } })
  if (!user) {
    user = await prisma.user.create({
      data: { email: "mark-ai@vidivici.com", name: "Mark AI Assistant", password: "not-a-real-login", role: "USER" },
    })
  }

  const booking = await prisma.villaBooking.create({
    data: {
      userId: user.id,
      villaId: params.villaId,
      checkIn: start,
      checkOut: end,
      guests: params.guests || 1,
      totalPrice,
      notes: `Booked by MARK | Customer: ${params.customerName || "N/A"} | Email: ${params.customerEmail || "N/A"} | ${params.notes || ""}`.trim(),
    },
    include: { villa: true },
  })

  return {
    success: true,
    bookingId: booking.id,
    bookingNumber: booking.bookingNumber,
    villa: booking.villa.name,
    dates: `${params.checkIn} to ${params.checkOut}`,
    nights,
    totalPrice,
  }
}

async function bookEvent(params: any) {
  const booking = await prisma.eventBooking.create({
    data: {
      eventId: params.eventId || null,
      firstName: params.firstName,
      lastName: params.lastName || null,
      email: params.email,
      phone: params.phone || null,
      clubVenue: params.clubVenue || null,
      bookingDate: new Date(params.bookingDate),
      guestsTotal: params.guestsTotal || null,
      budget: params.budget || null,
      specialRequests: params.specialRequests
        ? `Booked by MARK | ${params.specialRequests}`
        : "Booked by MARK",
    },
    include: { event: true },
  })

  return {
    success: true,
    bookingId: booking.id,
    event: booking.event?.name || params.clubVenue || "Custom Event",
    date: params.bookingDate,
  }
}

async function executeTool(name: string, args: any) {
  switch (name) {
    case "search_cars": return await searchCars(args)
    case "search_villas": return await searchVillas(args)
    case "search_events": return await searchEvents(args)
    case "book_car": return await bookCar(args)
    case "book_villa": return await bookVilla(args)
    case "book_event": return await bookEvent(args)
    default: return { error: "Unknown tool" }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId, visitorId } = await request.json()

    // Get or create session
    let session: any = null
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
    }
    if (!session) {
      session = await prisma.chatSession.create({
        data: { visitorId: visitorId || `visitor-${Date.now()}` },
      })
    }

    // Save the user's latest message
    const latestUserMsg = messages[messages.length - 1]
    if (latestUserMsg && latestUserMsg.role === "user") {
      await prisma.chatMessage.create({
        data: { sessionId: session.id, role: "user", content: latestUserMsg.content },
      })
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { lastMessage: latestUserMsg.content, updatedAt: new Date() },
      })
    }

    // If session is paused (admin took over), don't call AI
    if (session.isPaused) {
      // Check for any new admin messages
      const adminMsgs = await prisma.chatMessage.findMany({
        where: { sessionId: session.id, role: "admin" },
        orderBy: { createdAt: "desc" },
        take: 1,
      })
      return NextResponse.json({
        sessionId: session.id,
        content: null,
        paused: true,
        adminMessages: adminMsgs,
      })
    }

    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role === "admin" ? "assistant" : m.role, content: m.content })),
    ]

    // First call to Groq
    let res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        tools,
        tool_choice: "auto",
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Groq error:", err)
      return NextResponse.json({ error: "AI service error" }, { status: 500 })
    }

    let data = await res.json()
    let assistantMessage = data.choices[0].message

    // Handle tool calls (may need multiple rounds)
    let rounds = 0
    while (assistantMessage.tool_calls && rounds < 3) {
      rounds++
      const toolResults = []

      for (const toolCall of assistantMessage.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments)
        const result = await executeTool(toolCall.function.name, args)
        toolResults.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        })
      }

      // Send tool results back to Groq
      groqMessages.push(assistantMessage)
      groqMessages.push(...toolResults)

      res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          tools,
          tool_choice: "auto",
          temperature: 0.7,
          max_tokens: 1024,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        console.error("Groq tool follow-up error:", err)
        break
      }

      data = await res.json()
      assistantMessage = data.choices[0].message
    }

    const aiContent = assistantMessage.content || "I encountered an issue. Please try again."

    // Save AI response to DB
    await prisma.chatMessage.create({
      data: { sessionId: session.id, role: "assistant", content: aiContent },
    })
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { lastMessage: aiContent, updatedAt: new Date() },
    })

    return NextResponse.json({
      sessionId: session.id,
      content: aiContent,
      paused: false,
    })
  } catch (error: any) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
