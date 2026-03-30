import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Single event by slug
    const slug = searchParams.get('slug')
    if (slug) {
      const event = await prisma.event.findUnique({
        where: { slug },
        include: { images: { orderBy: { isPrimary: 'desc' } } },
      })
      if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
      return NextResponse.json(event)
    }

    const location = searchParams.get('location')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const all = searchParams.get('all')

    const where: any = all === 'true' ? {} : { isAvailable: true }

    if (location) where.location = { contains: location, mode: 'insensitive' }
    if (category) where.category = { contains: category, mode: 'insensitive' }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { venueName: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { images: { orderBy: { isPrimary: 'desc' }, take: 1 } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({ events, total, pages: Math.ceil(total / limit), page })
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { images, ...eventData } = body
    const slug = eventData.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')

    const event = await prisma.event.create({
      data: {
        ...eventData,
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
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
