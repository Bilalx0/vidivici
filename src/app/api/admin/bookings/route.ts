import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyAdmin } from '@/lib/email'

function generateBookingNumber(type: string) {
  const prefix = type === 'villa' ? 'VL' : type === 'event' ? 'EV' : 'CR'
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${num}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type = 'car',
      carId, startDate, endDate, startTime, endTime,
      pickupLocation, dropoffLocation, deliveryType,
      deliveryAddress, returnAddress, isOneWay,
      needsDriver, driverHours, driverDays, deliveryFee, driverCost,
      villaId, checkIn, checkOut, guests,
      eventId, bookingDate, guestsTotal, budget, clubVenue,
      customerName, customerEmail, customerPhone,
      totalPrice, basePrice, discount, addOnsTotal, tax,
      status, paymentStatus, notes, adminNotes,
      docUrls,
    } = body

    if (!customerEmail) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 })
    }

    let user = await prisma.user.findUnique({ where: { email: customerEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: customerEmail,
          name: customerName || null,
          phone: customerPhone || null,
          password: '',
        },
      })
    } else if (customerName || customerPhone) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(customerName && !user.name && { name: customerName }),
          ...(customerPhone && !user.phone && { phone: customerPhone }),
        },
      })
    }

    // Save uploaded documents to the user's profile
    if (docUrls && typeof docUrls === 'object') {
      const docUpdate: Record<string, string> = {}
      if (docUrls.driverLicense) {
        docUpdate.driverLicense = JSON.stringify({ url: docUrls.driverLicense })
        docUpdate.driverLicenseStatus = 'PENDING'
      }
      if (docUrls.insurance) {
        docUpdate.insurance = JSON.stringify({ url: docUrls.insurance })
        docUpdate.insuranceStatus = 'PENDING'
      }
      if (docUrls.passport) {
        docUpdate.passport = JSON.stringify({ url: docUrls.passport })
        docUpdate.passportStatus = 'PENDING'
      }
      if (Object.keys(docUpdate).length > 0) {
        await prisma.user.update({ where: { id: user.id }, data: docUpdate })
      }
    }

    const documentsJson = docUrls ? JSON.stringify(docUrls) : null

    // Check if user docs are already verified
    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { driverLicenseStatus: true, insuranceStatus: true },
    })
    const docsVerified = freshUser &&
      freshUser.driverLicenseStatus === "VERIFIED" &&
      freshUser.insuranceStatus === "VERIFIED"

    if (type === 'villa') {
      if (!villaId || !checkIn || !checkOut) {
        return NextResponse.json({ error: 'Villa, check-in, and check-out are required' }, { status: 400 })
      }
      const booking = await prisma.villaBooking.create({
        data: {
          bookingNumber: generateBookingNumber('villa'),
          userId: user.id,
          villaId,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          guests: guests ? parseInt(String(guests)) : 1,
          totalPrice: totalPrice ? parseFloat(String(totalPrice)) : 0,
          status: status || 'PENDING',
          paymentStatus: paymentStatus || 'UNPAID',
          notes: notes || null,
          adminNotes: adminNotes || null,
          documents: documentsJson,
          source: 'manual',
          documentStatus: docsVerified ? "VERIFIED" : "PENDING",
        },
        include: { villa: true, user: { select: { name: true, email: true, phone: true } } },
      })
      return NextResponse.json({ ...booking, bookingType: 'villa' }, { status: 201 })
    }

    if (type === 'event') {
      if (!bookingDate) {
        return NextResponse.json({ error: 'Booking date is required' }, { status: 400 })
      }
      const booking = await prisma.eventBooking.create({
        data: {
          bookingNumber: generateBookingNumber('event'),
          eventId: eventId || null,
          firstName: customerName || '',
          email: customerEmail,
          phone: customerPhone || null,
          clubVenue: clubVenue || null,
          bookingDate: new Date(bookingDate),
          guestsTotal: guestsTotal || null,
          budget: budget || null,
          totalPrice: totalPrice ? parseFloat(String(totalPrice)) : 0,
          status: status || 'PENDING',
          paymentStatus: paymentStatus || 'UNPAID',
          adminNotes: adminNotes || null,
          specialRequests: notes || null,
          documents: documentsJson,
          source: 'manual',
          documentStatus: docsVerified ? "VERIFIED" : "PENDING",
        },
        include: { event: true },
      })
      return NextResponse.json({ ...booking, bookingType: 'event' }, { status: 201 })
    }

    // Default: car booking
    if (!carId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Car, start date, and end date are required' }, { status: 400 })
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber('car'),
        userId: user.id,
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        startTime: startTime || null,
        endTime: endTime || null,
        pickupLocation: pickupLocation || 'Office',
        dropoffLocation: dropoffLocation || pickupLocation || 'Office',
        deliveryType: deliveryType || 'pickup',
        deliveryAddress: deliveryAddress || null,
        returnAddress: returnAddress || null,
        isOneWay: isOneWay || false,
        needsDriver: needsDriver || false,
        driverHours: driverHours ? parseInt(String(driverHours)) : null,
        driverDays: driverDays ? parseInt(String(driverDays)) : null,
        deliveryFee: deliveryFee ? parseFloat(String(deliveryFee)) : 0,
        driverCost: driverCost ? parseFloat(String(driverCost)) : 0,
        basePrice: basePrice ? parseFloat(String(basePrice)) : 0,
        discount: discount ? parseFloat(String(discount)) : 0,
        addOnsTotal: addOnsTotal ? parseFloat(String(addOnsTotal)) : 0,
        tax: tax ? parseFloat(String(tax)) : 0,
        totalPrice: totalPrice ? parseFloat(String(totalPrice)) : 0,
        status: status || 'PENDING',
        paymentStatus: paymentStatus || 'UNPAID',
        notes: notes || null,
        adminNotes: adminNotes || null,
        documents: documentsJson,
        source: 'manual',
        documentStatus: docsVerified ? "VERIFIED" : "PENDING",
      },
      include: { car: { include: { brand: true, images: { take: 1, orderBy: { isPrimary: 'desc' } } } }, user: { select: { name: true, email: true, phone: true } } },
    })

    return NextResponse.json({ ...booking, bookingType: 'car' }, { status: 201 })
  } catch (error) {
    console.error('Failed to create manual booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const [carResult, villaResult, eventResult] = await Promise.allSettled([
      prisma.booking.findMany({
        include: {
          car: { include: { brand: true, images: { take: 1, orderBy: { isPrimary: 'desc' } } } },
          user: { select: { name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.villaBooking.findMany({
        include: {
          villa: { include: { images: { take: 1, orderBy: { isPrimary: 'desc' } } } },
          user: { select: { name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.eventBooking.findMany({
        include: { event: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    if (carResult.status === 'rejected') console.error('Car bookings fetch failed:', carResult.reason)
    if (villaResult.status === 'rejected') console.error('Villa bookings fetch failed:', villaResult.reason)
    if (eventResult.status === 'rejected') console.error('Event bookings fetch failed:', eventResult.reason)

    const carBookings = carResult.status === 'fulfilled' ? carResult.value : []
    const villaBookings = villaResult.status === 'fulfilled' ? villaResult.value : []
    const eventBookings = eventResult.status === 'fulfilled' ? eventResult.value : []

    const all = [
      ...carBookings.map((b: any) => ({ ...b, bookingType: 'car', itemName: b.car ? `${b.car.brand?.name || ''} ${b.car.name}`.trim() : 'Unknown Car', customerName: b.user?.name, customerEmail: b.user?.email || '', customerPhone: b.user?.phone, source: b.source || 'website' })),
      ...villaBookings.map((b: any) => ({ ...b, bookingType: 'villa', itemName: b.villa?.name || 'Unknown Villa', customerName: b.user?.name, customerEmail: b.user?.email || '', customerPhone: b.user?.phone, startDate: b.checkIn, endDate: b.checkOut, source: b.source || 'website' })),
      ...eventBookings.map((b: any) => ({ ...b, bookingType: 'event', itemName: b.event?.name || 'Custom Event', customerName: b.firstName + (b.lastName ? ` ${b.lastName}` : ''), customerEmail: b.email, customerPhone: b.phone, startDate: b.bookingDate, endDate: b.bookingDate, source: b.source || 'website' })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(all)
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
