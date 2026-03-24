import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(faqs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const faq = await prisma.fAQ.create({ data: body })
    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}
