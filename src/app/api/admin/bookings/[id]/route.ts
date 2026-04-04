import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { voidPayPalAuthorization } from '@/lib/paypal'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try car booking first
    const carBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: { include: { brand: true, images: { take: 1, orderBy: { isPrimary: 'desc' } } } },
        user: { select: { name: true, email: true, phone: true, id: true, driverLicense: true, driverLicenseStatus: true, insurance: true, insuranceStatus: true, passport: true, passportStatus: true } },
      },
    })
    if (carBooking) {
      return NextResponse.json({ ...carBooking, bookingType: 'car', itemName: `${carBooking.car.brand.name} ${carBooking.car.name}` })
    }

    // Try villa booking
    const villaBooking = await prisma.villaBooking.findUnique({
      where: { id },
      include: {
        villa: { include: { images: { take: 1, orderBy: { isPrimary: 'desc' } } } },
        user: { select: { name: true, email: true, phone: true, id: true, driverLicense: true, driverLicenseStatus: true, insurance: true, insuranceStatus: true, passport: true, passportStatus: true } },
      },
    })
    if (villaBooking) {
      return NextResponse.json({ ...villaBooking, bookingType: 'villa', itemName: villaBooking.villa.name, startDate: villaBooking.checkIn, endDate: villaBooking.checkOut })
    }

    // Try event booking
    const eventBooking = await prisma.eventBooking.findUnique({
      where: { id },
      include: { event: { select: { name: true, slug: true } } },
    })
    if (eventBooking) {
      return NextResponse.json({
        ...eventBooking,
        bookingType: 'event',
        itemName: eventBooking.event?.name || 'Custom Event',
        customerName: eventBooking.firstName + (eventBooking.lastName ? ` ${eventBooking.lastName}` : ''),
        customerEmail: eventBooking.email,
        customerPhone: eventBooking.phone,
        startDate: eventBooking.bookingDate,
        endDate: eventBooking.bookingDate,
      })
    }

    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { bookingType, status, paymentStatus, documentStatus, contractStatus, adminNotes, notes } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (documentStatus) updateData.documentStatus = documentStatus
    if (contractStatus) updateData.contractStatus = contractStatus
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (notes !== undefined) updateData.notes = notes

    // Void PayPal authorization when cancelling
    if (status === 'CANCELLED') {
      try {
        let authId: string | null = null
        let currentPaymentStatus: string | null = null
        if (bookingType === 'car') {
          const b = await prisma.booking.findUnique({ where: { id }, select: { paypalAuthorizationId: true, paymentStatus: true } })
          authId = b?.paypalAuthorizationId || null
          currentPaymentStatus = b?.paymentStatus || null
        } else if (bookingType === 'villa') {
          const b = await prisma.villaBooking.findUnique({ where: { id }, select: { paypalAuthorizationId: true, paymentStatus: true } })
          authId = b?.paypalAuthorizationId || null
          currentPaymentStatus = b?.paymentStatus || null
        } else if (bookingType === 'event') {
          const b = await prisma.eventBooking.findUnique({ where: { id }, select: { paypalAuthorizationId: true, paymentStatus: true } })
          authId = b?.paypalAuthorizationId || null
          currentPaymentStatus = b?.paymentStatus || null
        }
        if (authId && currentPaymentStatus === 'AUTHORIZED') {
          await voidPayPalAuthorization(authId)
          updateData.paymentStatus = 'UNPAID'
        }
      } catch (voidErr) {
        console.error('Failed to void PayPal authorization:', voidErr)
      }
    }

    if (bookingType === 'villa') {
      const booking = await prisma.villaBooking.update({
        where: { id },
        data: updateData,
        include: { villa: true, user: { select: { name: true, email: true, phone: true } } },
      })
      return NextResponse.json({ ...booking, bookingType: 'villa' })
    }

    if (bookingType === 'event') {
      const eventUpdate: any = {}
      if (status) eventUpdate.status = status
      if (paymentStatus) eventUpdate.paymentStatus = paymentStatus
      if (documentStatus) eventUpdate.documentStatus = documentStatus
      if (contractStatus) eventUpdate.contractStatus = contractStatus
      if (adminNotes !== undefined) eventUpdate.adminNotes = adminNotes
      if (notes !== undefined) eventUpdate.specialRequests = notes
      const booking = await prisma.eventBooking.update({
        where: { id },
        data: eventUpdate,
        include: { event: true },
      })
      return NextResponse.json({ ...booking, bookingType: 'event' })
    }

    // Default: car
    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { car: { include: { brand: true, images: { take: 1, orderBy: { isPrimary: 'desc' } } } }, user: { select: { name: true, email: true, phone: true } } },
    })
    return NextResponse.json({ ...booking, bookingType: 'car' })
  } catch (error) {
    console.error('Failed to update booking:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
