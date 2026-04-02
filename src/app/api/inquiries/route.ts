import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const where: any = {}
    if (category) where.category = category

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
    const { source, category, name, email, phone, subject, message, data } = body

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

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
