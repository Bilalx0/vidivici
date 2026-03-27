import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const all = searchParams.get('all')
    const where: any = all === 'true' ? {} : { isAvailable: true }
    if (brand) where.brand = { slug: brand }
    if (category) where.category = { slug: category }
    if (location) where.location = location
    if (minPrice) where.pricePerDay = { ...where.pricePerDay, gte: parseFloat(minPrice) }
    if (maxPrice) where.pricePerDay = { ...where.pricePerDay, lte: parseFloat(maxPrice) }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: { brand: true, category: true, images: { where: { isPrimary: true }, take: 1 } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.car.count({ where }),
    ])

    return NextResponse.json({ cars, total, pages: Math.ceil(total / limit), page })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const slug = body.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')

    const car = await prisma.car.create({
      data: { ...body, slug },
      include: { brand: true, category: true },
    })
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}
