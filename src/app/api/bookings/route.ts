import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notifyAdmin } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const where: any = {}
    if ((session.user as any).role !== 'ADMIN') {
      where.userId = (session.user as any).id
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { car: { include: { brand: true, images: { where: { isPrimary: true }, take: 1 } } }, user: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { carId, startDate, endDate, pickupLocation, dropoffLocation, deliveryType, deliveryAddress, returnAddress, isOneWay, notes } = body

    const car = await prisma.car.findUnique({ where: { id: carId } })
    if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days < car.minRentalDays) {
      return NextResponse.json({ error: `Minimum rental is ${car.minRentalDays} days` }, { status: 400 })
    }

    let discount = 0
    if (days >= 28) discount = 0.4
    else if (days >= 7) discount = 0.15
    const totalPrice = car.pricePerDay * days * (1 - discount)

    // Check if user's documents are already verified
    const userId = (session.user as any).id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, driverLicenseStatus: true, insuranceStatus: true, passportStatus: true },
    })
    const docsVerified = user &&
      user.driverLicenseStatus === "VERIFIED" &&
      user.insuranceStatus === "VERIFIED"

    const booking = await prisma.booking.create({
      data: {
        userId,
        carId,
        startDate: start,
        endDate: end,
        pickupLocation,
        dropoffLocation: dropoffLocation || pickupLocation,
        deliveryType: deliveryType || 'pickup',
        deliveryAddress: deliveryAddress || null,
        returnAddress: returnAddress || null,
        isOneWay: isOneWay || false,
        totalPrice,
        notes,
        documentStatus: docsVerified ? "VERIFIED" : "PENDING",
      },
      include: { car: { include: { brand: true } } },
    })

    // Notify admin
    notifyAdmin(
      `New Car Booking #${booking.bookingNumber}`,
      `<h2>New Car Booking</h2>
      <p><strong>Customer:</strong> ${user?.name || user?.email || "Unknown"}</p>
      <p><strong>Car:</strong> ${booking.car.brand.name} ${booking.car.name}</p>
      <p><strong>Dates:</strong> ${start.toLocaleDateString()} – ${end.toLocaleDateString()}</p>
      <p><strong>Total:</strong> $${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      <p><strong>Documents:</strong> ${docsVerified ? "Pre-verified ✓" : "Pending review"}</p>
      <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/bookings/${booking.id}">View Booking →</a></p>`
    )

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
