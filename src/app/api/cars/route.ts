import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Single car by slug
    const slug = searchParams.get('slug')
    if (slug) {
      const car = await prisma.car.findUnique({
        where: { slug },
        include: { brand: true, category: true, images: { orderBy: { isPrimary: 'desc' } } },
      })
      if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })
      return NextResponse.json(car)
    }

    const brand = searchParams.get('brand')
    const make = searchParams.get('make')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const all = searchParams.get('all')
    const search = searchParams.get('search')
    const where: any = all === 'true' ? {} : { isAvailable: true }
    if (brand) where.brand = { slug: brand }
    else if (make) where.brand = { name: { equals: make, mode: 'insensitive' } }
    if (category) where.category = { OR: [{ slug: category }, { name: { equals: category, mode: 'insensitive' } }] }
    if (location) where.location = location
    if (minPrice) where.pricePerDay = { ...where.pricePerDay, gte: parseFloat(minPrice) }
    if (maxPrice) where.pricePerDay = { ...where.pricePerDay, lte: parseFloat(maxPrice) }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: { brand: true, category: true, images: { orderBy: { isPrimary: 'desc' }, take: 1 } },
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
    const { images, ...carData } = body
    const slug = carData.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')

    const car = await prisma.car.create({
      data: {
        ...carData,
        slug,
        ...(images && images.length > 0 && {
          images: {
            create: (images as string[]).map((url: string, i: number) => ({
              url,
              isPrimary: i === 0,
            })),
          },
        }),
      },
      include: { brand: true, category: true, images: true },
    })
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    console.error('Failed to create car:', error)
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}
