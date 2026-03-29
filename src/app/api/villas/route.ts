import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Single villa by slug
    const slug = searchParams.get('slug')
    if (slug) {
      const villa = await prisma.villa.findUnique({
        where: { slug },
        include: { images: { orderBy: { isPrimary: 'desc' } } },
      })
      if (!villa) return NextResponse.json({ error: 'Villa not found' }, { status: 404 })
      return NextResponse.json(villa)
    }

    const location = searchParams.get('location')
    const minBedrooms = searchParams.get('minBedrooms')
    const minGuests = searchParams.get('minGuests')
    const minSqft = searchParams.get('minSqft')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const all = searchParams.get('all')

    const where: any = all === 'true' ? {} : { isAvailable: true }

    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (minBedrooms) where.bedrooms = { gte: parseInt(minBedrooms) }
    if (minGuests) where.guests = { gte: parseInt(minGuests) }
    if (minSqft) where.sqft = { gte: parseInt(minSqft) }
    if (minPrice) where.pricePerNight = { ...where.pricePerNight, gte: parseFloat(minPrice) }
    if (maxPrice) where.pricePerNight = { ...where.pricePerNight, lte: parseFloat(maxPrice) }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [villas, total] = await Promise.all([
      prisma.villa.findMany({
        where,
        include: { images: { orderBy: { isPrimary: 'desc' }, take: 1 } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.villa.count({ where }),
    ])

    return NextResponse.json({ villas, total, pages: Math.ceil(total / limit), page })
  } catch (error) {
    console.error('Failed to fetch villas:', error)
    return NextResponse.json({ error: 'Failed to fetch villas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { images, ...villaData } = body
    const slug = villaData.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')

    const villa = await prisma.villa.create({
      data: {
        ...villaData,
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
      include: { images: true },
    })
    return NextResponse.json(villa, { status: 201 })
  } catch (error) {
    console.error('Failed to create villa:', error)
    return NextResponse.json({ error: 'Failed to create villa' }, { status: 500 })
  }
}
