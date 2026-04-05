import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notifyAdmin } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const source = searchParams.get("source")

    const where: any = {}
    if (category) where.category = category
    if (source) where.source = source

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, category, name, email, phone, subject, message, data, turnstileToken } = body

    const { verifyTurnstile } = await import('@/lib/turnstile')
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) {
      return NextResponse.json({ error: "Bot verification failed" }, { status: 403 })
    }

    if (!name || !email || !source || !category) {
      return NextResponse.json({ error: "Name, email, source and category are required" }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        source,
        category,
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message: message || null,
        data: data ? JSON.stringify(data) : null,
      },
    })

    notifyAdmin(
      `New Inquiry: ${subject || category || "Contact Form"}`,
      `<h2>New Inquiry Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      <p><strong>Category:</strong> ${category}</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
      ${message ? `<p><strong>Message:</strong></p><blockquote style="border-left:3px solid #dbb241;padding-left:12px;color:#555;">${message}</blockquote>` : ""}
      ${data ? `<p><strong>Details:</strong> ${JSON.stringify(data)}</p>` : ""}
      <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/inquiries">View in Admin →</a></p>`
    )

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
