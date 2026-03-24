import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { cars: true } } },
    })
    return NextResponse.json(brands)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const slug = body.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
    const brand = await prisma.brand.create({ data: { ...body, slug } })
    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 })
  }
}
