import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { driverLicenseStatus: 'PENDING' },
          { insuranceStatus: 'PENDING' },
          { passportStatus: 'PENDING' },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        driverLicenseStatus: true,
        insuranceStatus: true,
        passportStatus: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Flatten into individual notification items per-document
    const notifications = users.flatMap((u) => {
      const items = []
      if (u.driverLicenseStatus === 'PENDING') {
        items.push({
          userId: u.id,
          name: u.name,
          email: u.email,
          image: u.image,
          docType: 'DRIVING_LICENSE',
          docLabel: "Driver's License",
          updatedAt: u.updatedAt,
        })
      }
      if (u.insuranceStatus === 'PENDING') {
        items.push({
          userId: u.id,
          name: u.name,
          email: u.email,
          image: u.image,
          docType: 'INSURANCE_POLICY',
          docLabel: 'Insurance Policy',
          updatedAt: u.updatedAt,
        })
      }
      if (u.passportStatus === 'PENDING') {
        items.push({
          userId: u.id,
          name: u.name,
          email: u.email,
          image: u.image,
          docType: 'PASSPORT_ID',
          docLabel: 'Passport / ID',
          updatedAt: u.updatedAt,
        })
      }
      return items
    })

    return NextResponse.json({ notifications, count: notifications.length })
  } catch (error) {
    return NextResponse.json({ notifications: [], count: 0 })
  }
}
