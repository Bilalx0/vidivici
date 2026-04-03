import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, villaName, villaSlug, firstName, lastName, email, phone, ...rest } = body

    if (!firstName || !email || !type || !villaSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const name = [firstName, lastName].filter(Boolean).join(" ")
    const source = type === "event" ? "villa-event" : "villa-production"
    const subject = type === "event"
      ? `Event Inquiry — ${villaName || villaSlug}`
      : `Production Inquiry — ${villaName || villaSlug}`

    await prisma.inquiry.create({
      data: {
        source,
        category: "Villa",
        name,
        email,
        phone: phone || null,
        subject,
        message: rest.specialRequests || null,
        data: JSON.stringify({ villaSlug, villaName, ...rest }),
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}
