import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: (session.user as any).id },
      include: {
        car: {
          include: {
            brand: true,
            images: { orderBy: { isPrimary: 'desc' }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { carId } = await request.json()
    if (!carId) {
      return NextResponse.json({ error: 'carId is required' }, { status: 400 })
    }

    const userId = (session.user as any).id

    const existing = await prisma.wishlist.findUnique({
      where: { userId_carId: { userId, carId } },
    })

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } })
      return NextResponse.json({ wishlisted: false })
    }

    await prisma.wishlist.create({ data: { userId, carId } })
    return NextResponse.json({ wishlisted: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle wishlist' }, { status: 500 })
  }
}
