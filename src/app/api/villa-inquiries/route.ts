import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notifyAdmin } from "@/lib/email"

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

    notifyAdmin(
      `Villa Inquiry: ${subject}`,
      `<h2>${subject}</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      <p><strong>Type:</strong> ${type === "event" ? "Event" : "Production"}</p>
      <p><strong>Villa:</strong> ${villaName || villaSlug}</p>
      ${rest.specialRequests ? `<p><strong>Details:</strong> ${rest.specialRequests}</p>` : ""}
      <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/inquiries">View in Admin →</a></p>`
    )

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}
