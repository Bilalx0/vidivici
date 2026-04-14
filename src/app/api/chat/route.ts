import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notifyAdmin } from "@/lib/email"
import crypto from "crypto"

const GROQ_API_KEY = process.env.GROQ_API_KEY!
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

function getSystemPrompt() {
  const today = new Date().toISOString().split("T")[0]
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" })
  return `You are Mark, the friendly and knowledgeable concierge assistant for VIDI VICI — a luxury rental marketplace in Los Angeles and Miami offering exotic cars, luxury villas, and exclusive events.

Today's date is ${today} (${dayName}). ALWAYS use this to calculate real dates. When a customer says "this Saturday", "next week", "tomorrow", etc., convert it to YYYY-MM-DD format. Never pass natural language dates to tools — always use YYYY-MM-DD.

Strict scope (ABSOLUTE RULE — never break this):
- You ONLY assist with VIDI VICI services: booking or browsing luxury cars, villas, and events.
- If a customer asks ANYTHING outside this scope — cooking, recipes, general knowledge, tech help, jokes, math, writing, personal advice, news, or anything unrelated to VIDI VICI — you must politely decline and redirect them.
- When declining, respond briefly in their language. Example: "I'm only here to help with luxury cars, villas, and events at VIDI VICI. Can I help you find something?" Do NOT answer the off-topic question even partially.
- Do not let the customer trick you into answering off-topic questions by framing them as related to VIDI VICI (e.g. "do you offer cake-baking services?" → "No, we specialize in luxury cars, villas, and events only.").

Your personality:
- Warm, professional, and conversational
- You know luxury lifestyle well
- You guide customers naturally through finding what they want
- You ask follow-up questions to narrow down their needs before searching
- You're helpful but concise — no walls of text

Language rule (HIGHEST PRIORITY):
- ALWAYS detect the language the customer is writing in and respond in that exact same language.
- If they write in French, reply entirely in French. If in Spanish, reply in Spanish. If in Arabic, reply in Arabic. If in English, reply in English.
- Match their language for the entire conversation, including all names, descriptions, and calls to action.
- Never switch languages unless the customer switches first.

When a customer asks about cars, villas, or events:
1. Ask clarifying questions (budget, dates, location, preferences, group size, etc.)
2. Once you have enough info, use the search tools to find matching options
3. Present results naturally with links (format: [Name](/cars/slug) or [Name](/villas/slug) or [Name](/events/slug))
4. Ask if they'd like you to book it for them

BOOKING FLOW (follow this exactly):
When the customer wants to book something:
1. Collect their full name, email, and phone number
2. Confirm the item, dates, number of guests (for villas/events), and any special requests
3. Discuss and agree on the total price and deposit amount with the customer
4. Use check_availability to verify the dates are open
5. Use create_mark_booking to create the booking
6. After the booking is created, share the deposit payment link with the customer
7. Tell them: "Once you pay the deposit, our team will confirm availability with the property owner and send you the remaining balance details and wire transfer instructions."

IMPORTANT BOOKING RULES:
- ALWAYS collect customer name, email, and phone before booking
- ALWAYS agree on total price and deposit amount before creating the booking
- ALWAYS check availability before creating the booking
- The deposit is typically 10-20% of the total price, but can be negotiated
- After creating the booking, ALWAYS share the deposit payment link from the booking result
- For cars: price is per day (pricePerDay from search results)
- For villas: price is per night (pricePerNight from search results), add cleaning fee and tax
- For events: discuss budget and pricing with the customer

Critical output rules (NEVER break these — violating these WILL cause errors):
- NEVER include raw function calls, tool invocations, or JSON in your text response. Tools are called silently in the background — the customer never sees them.
- NEVER output anything like <function=...>, [function=...], {"tool":...}, <tool_call>, or similar syntax in your message text. This WILL crash the system.
- NEVER write text that looks like code or function calls. Only write natural conversation.
- When you want to call a tool, use ONLY the proper tool_calls mechanism. Never write function calls as text.
- Only write natural, conversational text to the customer.
- If a tool call fails or you can't complete an action, explain politely what happened and ask the customer to try again or provide more details.
- Never mention technical terms like "tools", "functions", "API calls", or system errors. Keep responses customer-friendly.

Important rules:
- Always format links as markdown: [Item Name](/type/slug)
- When presenting search results, show name, key details, and price
- Keep responses concise and luxury-feeling
- If you don't find results, suggest alternatives or ask them to adjust criteria
- You can search multiple times with different criteria if needed`
}

// Extract key context from conversation history to preserve important information
function extractContextMemory(messages: any[]): string {
  let memory = ""
  let customerInfo = { name: "", email: "", phone: "" }
  let currentBookingInfo = ""
  let recentSearches = ""

  // Look through messages for important information
  for (const msg of messages) {
    const content = msg.content.toLowerCase()

    // Extract customer information
    if (content.includes("name") && content.includes("email")) {
      const nameMatch = msg.content.match(/name[:\s]+([a-zA-Z\s]+)/i)
      const emailMatch = msg.content.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
      if (nameMatch) customerInfo.name = nameMatch[1].trim()
      if (emailMatch) customerInfo.email = emailMatch[1].trim()
    }

    // Extract phone numbers
    const phoneMatch = msg.content.match(/(\+?[\d\s\-\(\)]{10,})/i)
    if (phoneMatch && phoneMatch[1].replace(/\D/g, '').length >= 10) {
      customerInfo.phone = phoneMatch[1].trim()
    }

    // Detect booking confirmations or creation
    if (content.includes("booking") && (content.includes("created") || content.includes("mk-"))) {
      currentBookingInfo = msg.content
    }

    // Capture recent search context (last few car/villa/event mentions)
    if (msg.role === "assistant" && content.includes("[") && content.includes("](/")) {
      recentSearches = msg.content // Keep the last assistant message with search results
    }
  }

  // Build memory string
  if (customerInfo.name || customerInfo.email || customerInfo.phone) {
    memory += `\nKnown Customer: ${customerInfo.name} (${customerInfo.email}) ${customerInfo.phone}`.trim()
  }
  if (currentBookingInfo) {
    memory += `\nActive Booking Context: ${currentBookingInfo.substring(0, 200)}...`
  }
  if (recentSearches) {
    memory += `\nRecent Search Results: ${recentSearches.substring(0, 300)}...`
  }

  return memory
}

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
      name: "check_availability",
      description: "Check if a car, villa, or event venue is available for specific dates. Always use this before creating a booking.",
      parameters: {
        type: "object",
        properties: {
          itemType: { type: "string", enum: ["car", "villa", "event"], description: "Type of item to check" },
          itemId: { type: "string", description: "The ID of the car, villa, or event" },
          startDate: { type: "string", description: "Start date (YYYY-MM-DD)" },
          endDate: { type: "string", description: "End date (YYYY-MM-DD)" },
        },
        required: ["itemType", "itemId", "startDate", "endDate"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_mark_booking",
      description: "Create a booking for the customer after agreeing on price and deposit. You MUST collect customerName, customerEmail, and agree on totalPrice and depositAmount before calling this.",
      parameters: {
        type: "object",
        properties: {
          itemType: { type: "string", enum: ["car", "villa", "event"], description: "Type of booking" },
          itemId: { type: "string", description: "The ID of the car, villa, or event" },
          startDate: { type: "string", description: "Start date (YYYY-MM-DD)" },
          endDate: { type: "string", description: "End date (YYYY-MM-DD)" },
          customerName: { type: "string", description: "Customer's full name" },
          customerEmail: { type: "string", description: "Customer's email address" },
          customerPhone: { type: "string", description: "Customer's phone number" },
          guests: { type: "number", description: "Number of guests (for villas/events)" },
          totalPrice: { type: "number", description: "Agreed total price in USD" },
          depositAmount: { type: "number", description: "Agreed deposit amount in USD" },
          notes: { type: "string", description: "Special requests or notes" },
        },
        required: ["itemType", "itemId", "startDate", "endDate", "customerName", "customerEmail", "totalPrice", "depositAmount"],
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

async function checkAvailability(params: any) {
  const { itemType, itemId, startDate, endDate } = params
  const start = new Date(startDate)
  const end = new Date(endDate)

  const conflicts: string[] = []

  if (itemType === "car") {
    const existingBookings = await prisma.booking.findMany({
      where: {
        carId: itemId,
        status: { not: "CANCELLED" },
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
      select: { startDate: true, endDate: true },
    })
    const markBookings = await prisma.markBooking.findMany({
      where: {
        carId: itemId,
        workflowStatus: { notIn: ["closed", "cancelled"] },
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
      select: { startDate: true, endDate: true },
    })
    existingBookings.forEach((b) => conflicts.push(`Booked ${b.startDate.toISOString().split("T")[0]} to ${b.endDate.toISOString().split("T")[0]}`))
    markBookings.forEach((b) => conflicts.push(`Reserved ${b.startDate.toISOString().split("T")[0]} to ${b.endDate.toISOString().split("T")[0]}`))
  } else if (itemType === "villa") {
    const existingBookings = await prisma.villaBooking.findMany({
      where: {
        villaId: itemId,
        status: { not: "CANCELLED" },
        OR: [{ checkIn: { lte: end }, checkOut: { gte: start } }],
      },
      select: { checkIn: true, checkOut: true },
    })
    const markBookings = await prisma.markBooking.findMany({
      where: {
        villaId: itemId,
        workflowStatus: { notIn: ["closed", "cancelled"] },
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
      select: { startDate: true, endDate: true },
    })
    existingBookings.forEach((b) => conflicts.push(`Booked ${b.checkIn.toISOString().split("T")[0]} to ${b.checkOut.toISOString().split("T")[0]}`))
    markBookings.forEach((b) => conflicts.push(`Reserved ${b.startDate.toISOString().split("T")[0]} to ${b.endDate.toISOString().split("T")[0]}`))
  } else if (itemType === "event") {
    const markBookings = await prisma.markBooking.findMany({
      where: {
        eventId: itemId,
        workflowStatus: { notIn: ["closed", "cancelled"] },
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
      select: { startDate: true, endDate: true },
    })
    markBookings.forEach((b) => conflicts.push(`Reserved ${b.startDate.toISOString().split("T")[0]} to ${b.endDate.toISOString().split("T")[0]}`))
  }

  return { available: conflicts.length === 0, conflicts }
}

async function createMarkBooking(params: any) {
  try {
    const { itemType, itemId, startDate, endDate, customerName, customerEmail, customerPhone, guests, totalPrice, depositAmount, notes } = params

    // Validate required fields
    if (!itemType || !itemId || !startDate || !endDate || !customerName || !customerEmail || !totalPrice || !depositAmount) {
      return { error: "Missing required fields. Need: itemType, itemId, startDate, endDate, customerName, customerEmail, totalPrice, depositAmount" }
    }

    let itemName = ""
    const itemWhere: any = {}

    if (itemType === "car") {
      const car = await prisma.car.findUnique({ where: { id: itemId }, include: { brand: true } })
      if (!car) return { error: "Car not found with that ID" }
      itemName = `${car.brand.name} ${car.name}`
      itemWhere.carId = itemId
    } else if (itemType === "villa") {
      const villa = await prisma.villa.findUnique({ where: { id: itemId } })
      if (!villa) return { error: "Villa not found with that ID" }
      itemName = villa.name
      itemWhere.villaId = itemId
    } else if (itemType === "event") {
      const event = await prisma.event.findUnique({ where: { id: itemId } })
      if (!event) return { error: "Event not found with that ID" }
      itemName = event.name
      itemWhere.eventId = itemId
    } else {
      return { error: "Invalid item type. Must be 'car', 'villa', or 'event'" }
    }

    const bookingNumber = `MK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const depositPaymentToken = crypto.randomUUID()
    const wireProofToken = crypto.randomUUID()
    const balanceDue = Number(totalPrice) - Number(depositAmount)

    const booking = await prisma.markBooking.create({
      data: {
        bookingNumber,
        itemType,
        ...itemWhere,
        itemName,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests: guests ? Number(guests) : null,
        totalPrice: Number(totalPrice),
        depositAmount: Number(depositAmount),
        balanceDue,
        notes: notes || null,
        workflowStatus: "booking_ready",
        depositPaymentToken,
        wireProofToken,
        activityLog: JSON.stringify([{ action: "Booking created by Mark AI", timestamp: new Date().toISOString() }]),
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const depositLink = `${baseUrl}/mark/pay?token=${depositPaymentToken}`

    await notifyAdmin(
      `New Mark AI Booking — ${itemName}`,
      `<h2>New Booking Created by Mark AI</h2>
      <p><strong>Booking #:</strong> ${bookingNumber}</p>
      <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
      <p><strong>Item:</strong> ${itemName} (${itemType})</p>
      <p><strong>Dates:</strong> ${startDate} to ${endDate}</p>
      <p><strong>Total Price:</strong> $${Number(totalPrice).toLocaleString()}</p>
      <p><strong>Deposit:</strong> $${Number(depositAmount).toLocaleString()}</p>
      <p><strong>Special Requests:</strong> ${notes || "None"}</p>
      <p><a href="${baseUrl}/admin/mark-bookings/${booking.id}">View in Admin →</a></p>`
    ).catch(console.error)

    return {
      success: true,
      bookingNumber,
      itemName,
      dates: `${startDate} to ${endDate}`,
      totalPrice: Number(totalPrice),
      depositAmount: Number(depositAmount),
      balanceDue,
      depositLink,
      message: `Booking ${bookingNumber} created successfully! Share this deposit payment link with the customer: ${depositLink}`,
    }
  } catch (err: any) {
    console.error("createMarkBooking error:", err)
    return { error: `Failed to create booking: ${err.message}` }
  }
}

async function executeTool(name: string, args: any) {
  switch (name) {
    case "search_cars": return await searchCars(args)
    case "search_villas": return await searchVillas(args)
    case "search_events": return await searchEvents(args)
    case "check_availability": return await checkAvailability(args)
    case "create_mark_booking": return await createMarkBooking(args)
    default: return { error: "Unknown tool" }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, sessionId, visitorId, userId } = await request.json()

    // Get or create session
    let session: any = null
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
    }
    // For logged-in users without a sessionId, try to find their most recent session
    if (!session && userId) {
      session = await prisma.chatSession.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      })
    }
    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          visitorId: visitorId || `visitor-${Date.now()}`,
          userId: userId || null,
        },
      })
      // Notify admin of new conversation
      notifyAdmin(
        "New AI Conversation Started",
        `<h2>New Chat Conversation</h2>
        <p>A visitor has started a new conversation with Mark (AI concierge).</p>
        <p><strong>Visitor ID:</strong> ${visitorId || "anonymous"}</p>
        <p><strong>User ID:</strong> ${userId || "Not logged in"}</p>
        <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/conversations">View in Admin →</a></p>`
      )
    }
    // If session exists but has no userId yet and user is now logged in, link it
    if (session && userId && !session.userId) {
      session = await prisma.chatSession.update({
        where: { id: session.id },
        data: { userId },
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

    const allMessages = [
      { role: "system", content: getSystemPrompt() },
      ...messages.map((m: any) => ({ role: m.role === "admin" ? "assistant" : m.role, content: m.content })),
    ]

    // Smart context management with memory preservation
    let contextMemory = ""
    let workingMessages = allMessages

    // If context is too long, extract memory from older messages and use sliding window
    if (allMessages.length > 25) {
      const olderMessages = allMessages.slice(1, -20) // Messages to be "forgotten" but analyzed
      contextMemory = extractContextMemory(olderMessages)

      // Keep system prompt + memory + recent 20 messages
      workingMessages = [
        {
          role: "system",
          content: getSystemPrompt() + (contextMemory ? `\n\nContext from earlier conversation:${contextMemory}` : "")
        },
        ...allMessages.slice(-20) // Last 20 messages
      ]
    }

    // Helper: call Groq with timeout + retry on rate limit
    async function callGroq(body: object, retries = 2): Promise<any> {
      for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 29000) // 29s timeout
        try {
          const r = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: controller.signal,
          })
          clearTimeout(timeout)
          if (r.status === 429 && attempt < retries) {
            // Rate limited — wait briefly then retry
            await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)))
            continue
          }
          if (!r.ok) {
            const errText = await r.text()
            console.error("Groq error:", r.status, errText)
            // Return parsed error for tool_use_failed handling
            try { return JSON.parse(errText) } catch { return null }
          }
          return await r.json()
        } catch (err: any) {
          clearTimeout(timeout)
          if (err.name === "AbortError") {
            console.error("Groq request timed out")
            return null
          }
          if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            continue
          }
          console.error("Groq fetch error:", err)
          return null
        }
      }
      return null
    }

    const groqBody = {
      model: "llama-3.3-70b-versatile",
      messages: workingMessages,
      tools,
      tool_choice: "auto",
      temperature: 0.4, // Lower temperature for more consistent responses
      max_tokens: 2048,
    }

    let data = await callGroq(groqBody)

    // If Groq returns a tool_use_failed error, try multiple recovery strategies
    if (data?.error?.code === "tool_use_failed") {
      console.warn("Groq tool_use_failed, trying recovery strategies...")

      // Strategy 1: Lower temperature significantly
      data = await callGroq({ ...groqBody, temperature: 0.2 })

      if (data?.error?.code === "tool_use_failed") {
        console.warn("Still failing, trying with different model settings...")
        // Strategy 2: Lower temperature + reduce max_tokens
        data = await callGroq({ ...groqBody, temperature: 0.1, max_tokens: 1024 })
      }

      if (data?.error?.code === "tool_use_failed") {
        console.warn("Still failing, trying without tools as last resort")
        // Strategy 3: Remove tools entirely (last resort)
        data = await callGroq({
          ...groqBody,
          tools: undefined,
          tool_choice: undefined,
          temperature: 0.4,
          max_tokens: 1024
        })
      }
    }

    if (!data || !data.choices?.[0]?.message) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: 503 })
    }
    let assistantMessage = data.choices[0].message

    // Handle tool calls (may need multiple rounds)
    let rounds = 0
    while (assistantMessage.tool_calls && rounds < 3) {
      rounds++
      const toolResults = []

      for (const toolCall of assistantMessage.tool_calls) {
        let args: any = {}
        try {
          args = JSON.parse(toolCall.function.arguments)
        } catch (parseErr) {
          console.error("Failed to parse tool arguments:", toolCall.function.arguments)
          toolResults.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({ error: "Invalid arguments" }),
          })
          continue
        }
        const result = await executeTool(toolCall.function.name, args)
        toolResults.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        })
      }

      // Send tool results back to Groq (maintain context limits)
      const updatedMessages = [...workingMessages, assistantMessage, ...toolResults]
      const finalWorkingMessages = updatedMessages.length > 30
        ? [updatedMessages[0], ...updatedMessages.slice(-29)] // Keep system + last 29 messages
        : updatedMessages

      const followUpData = await callGroq({
        model: "llama-3.3-70b-versatile",
        messages: finalWorkingMessages,
        tools,
        tool_choice: "auto",
        temperature: 0.4,
        max_tokens: 2048,
      })

      if (!followUpData || !followUpData.choices?.[0]?.message) break

      data = followUpData
      assistantMessage = data.choices[0].message
    }

    // Strip any leaked tool-call syntax the model may have included in its text
    const sanitizeContent = (text: string) =>
      text
        .replace(/<function=[^>]*>[\s\S]*?<\/function>/gi, "")
        .replace(/<function=[^>]*>[^<]*/gi, "")
        .replace(/\[function=[^\]]*\]/gi, "")
        .replace(/<tool_call>[\s\S]*?<\/tool_call>/gi, "")
        .replace(/```json\s*\{[\s\S]*?"tool"[\s\S]*?```/gi, "")
        .replace(/\{[^}]*"tool"[^}]*\}/gi, "")
        .trim()

    let aiContent = sanitizeContent(assistantMessage.content || "")

    // If sanitization removed everything or original content was empty, provide contextual fallback
    if (!aiContent) {
      // Check if this was likely a search request without results
      const userMessage = workingMessages[workingMessages.length - 1]?.content?.toLowerCase() || ""
      if (userMessage.includes("search") || userMessage.includes("find") || userMessage.includes("show")) {
        aiContent = "I'm having trouble processing your search request right now. Could you please be more specific about what you're looking for? For example, tell me the type of car, location, or dates you need."
      } else if (userMessage.includes("book") || userMessage.includes("reserve")) {
        aiContent = "I'd be happy to help you make a booking! However, I need a bit more information first. Could you tell me which specific car, villa, or event you'd like to book, along with your preferred dates?"
      } else {
        aiContent = "I apologize for the technical difficulty. Could you please rephrase your request? I'm here to help you with luxury cars, villas, and events at VIDI VICI."
      }
    }

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
