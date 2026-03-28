import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { id: true, name: true, email: true, phone: true, image: true, dateOfBirth: true, company: true, address: true, country: true, city: true, state: true, zipCode: true, createdAt: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, phone, dateOfBirth, company, address, country, city, state, zipCode } = await request.json()

    const user = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { name, phone, dateOfBirth, company, address, country, city, state, zipCode },
      select: { id: true, name: true, email: true, phone: true, image: true, dateOfBirth: true, company: true, address: true, country: true, city: true, state: true, zipCode: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
