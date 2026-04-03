import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        dateOfBirth: true,
        company: true,
        address: true,
        country: true,
        city: true,
        state: true,
        zipCode: true,
        driverLicense: true,
        driverLicenseStatus: true,
        insurance: true,
        insuranceStatus: true,
        passport: true,
        passportStatus: true,
        createdAt: true,
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: {
            car: {
              select: {
                name: true,
                slug: true,
                images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
                brand: { select: { name: true } },
              },
            },
          },
        },
        villaBookings: {
          orderBy: { createdAt: 'desc' },
          include: {
            villa: {
              select: {
                name: true,
                slug: true,
                images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
              },
            },
          },
        },
        _count: { select: { wishlist: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}
