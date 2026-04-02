import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
        user: { select: { name: true, email: true, phone: true } },
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
        user: { select: { name: true, email: true, phone: true } },
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
    const { bookingType, status, paymentStatus, documentStatus, adminNotes, notes } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (documentStatus) updateData.documentStatus = documentStatus
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (notes !== undefined) updateData.notes = notes

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
