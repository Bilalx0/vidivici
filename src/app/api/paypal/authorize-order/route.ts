import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { authorizePayPalOrder, capturePayPalAuthorization } from "@/lib/paypal"
import { notifyAdmin } from "@/lib/email"
import { DEFAULT_VILLA_TAX } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, bookingType, bookingData } = body

    if (!orderId || !bookingType || !bookingData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Authorize the PayPal order
    const { authorizationId } = await authorizePayPalOrder(orderId)

    if (!authorizationId) {
      return NextResponse.json({ error: "Failed to get authorization ID" }, { status: 500 })
    }

    let booking: any

    if (bookingType === "car") {
      const session = await auth()
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const car = await prisma.car.findUnique({ where: { id: bookingData.carId } })
      if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 })

      const start = new Date(bookingData.startDate)
      const end = new Date(bookingData.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      if (days < car.minRentalDays) {
        return NextResponse.json({ error: `Minimum rental is ${car.minRentalDays} days` }, { status: 400 })
      }

      let discount = 0
      if (days >= 28) discount = 0.4
      else if (days >= 7) discount = 0.15
      const totalPrice = car.pricePerDay * days * (1 - discount)

      // Immediately capture the $2,000 booking deposit (partial capture)
      const bookingDeposit = 2000
      let depositCaptureId: string | null = null
      try {
        const captureResult = await capturePayPalAuthorization(
          authorizationId,
          { currency_code: "USD", value: bookingDeposit.toFixed(2) },
          false // not final capture — keep $5K auth for security hold
        )
        depositCaptureId = captureResult.id || null
      } catch (captureErr: any) {
        console.error("Deposit capture failed:", captureErr)
        // Authorization still valid; proceed with booking creation
      }

      booking = await prisma.booking.create({
        data: {
          userId: (session.user as any).id,
          carId: bookingData.carId,
          startDate: start,
          endDate: end,
          pickupLocation: bookingData.pickupLocation || "",
          dropoffLocation: bookingData.dropoffLocation || bookingData.pickupLocation || "",
          deliveryType: bookingData.deliveryType || "pickup",
          isOneWay: bookingData.isOneWay || false,
          notes: bookingData.notes || null,
          totalPrice,
          basePrice: bookingDeposit,
          paymentStatus: "AUTHORIZED",
          paypalOrderId: orderId,
          paypalAuthorizationId: authorizationId,
          paymentIntentId: depositCaptureId,
        },
        include: { car: { include: { brand: true } }, user: true },
      })

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const carName = `${booking.car.brand?.name ?? ""} ${booking.car.name}`.trim()
      const securityHold = 5000
      await notifyAdmin(
        `New Car Booking #${booking.id} — ${carName}`,
        `<h2>New Car Booking Received</h2>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Customer:</strong> ${booking.user?.name ?? "N/A"} (${booking.user?.email ?? "N/A"})</p>
        <p><strong>Car:</strong> ${carName}</p>
        <p><strong>Pickup:</strong> ${start.toDateString()}</p>
        <p><strong>Return:</strong> ${end.toDateString()}</p>
        <p><strong>Duration:</strong> ${days} day${days !== 1 ? "s" : ""}</p>
        <p><strong>Rental Total:</strong> $${totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Booking Deposit:</strong> $${bookingDeposit.toLocaleString()} (Captured${depositCaptureId ? "" : " — FAILED"})</p>
        <p><strong>Security Hold:</strong> $${securityHold.toLocaleString()} (Authorized)</p>
        <p><strong>Due at Pickup:</strong> $${Math.max(0, totalPrice - bookingDeposit).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><a href="${baseUrl}/admin/bookings/${booking.id}">View Booking in Admin</a></p>`
      ).catch(console.error)
    } else if (bookingType === "villa") {
      const session = await auth()
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const villa = await prisma.villa.findUnique({ where: { id: bookingData.villaId } })
      if (!villa) return NextResponse.json({ error: "Villa not found" }, { status: 404 })

      const start = new Date(bookingData.checkIn)
      const end = new Date(bookingData.checkOut)
      const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

      const nightsTotal = villa.pricePerNight * nights
      const subtotal = nightsTotal + villa.cleaningFee
      const taxSetting = await prisma.siteSettings.findUnique({ where: { key: "villaTaxPercent" } })
      const villaTaxRate = (parseFloat(taxSetting?.value ?? "") || DEFAULT_VILLA_TAX) / 100
      const tax = subtotal * villaTaxRate
      const totalPrice = subtotal + tax + villa.securityDeposit

      booking = await prisma.villaBooking.create({
        data: {
          userId: (session.user as any).id,
          villaId: bookingData.villaId,
          checkIn: start,
          checkOut: end,
          guests: bookingData.guests || 1,
          totalPrice,
          notes: bookingData.notes || null,
          paymentStatus: "AUTHORIZED",
          paypalOrderId: orderId,
          paypalAuthorizationId: authorizationId,
        },
        include: { villa: true, user: true },
      })

      const villaBaseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      await notifyAdmin(
        `New Villa Booking #${booking.id} — ${booking.villa.name}`,
        `<h2>New Villa Booking Received</h2>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Customer:</strong> ${booking.user?.name ?? "N/A"} (${booking.user?.email ?? "N/A"})</p>
        <p><strong>Villa:</strong> ${booking.villa.name}</p>
        <p><strong>Check-in:</strong> ${start.toDateString()}</p>
        <p><strong>Check-out:</strong> ${end.toDateString()}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Guests:</strong> ${bookingData.guests || 1}</p>
        <p><strong>Total:</strong> $${totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Payment Status:</strong> AUTHORIZED (PayPal)</p>
        <p><a href="${villaBaseUrl}/admin/bookings/${booking.id}">View Booking in Admin</a></p>`
      ).catch(console.error)
    } else if (bookingType === "event") {
      booking = await prisma.eventBooking.create({
        data: {
          eventId: bookingData.eventId || null,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName || null,
          email: bookingData.email,
          phone: bookingData.phone || null,
          clubVenue: bookingData.clubVenue || null,
          bookingDate: new Date(bookingData.bookingDate),
          guestsTotal: bookingData.guestsTotal || null,
          budget: bookingData.budget || null,
          addOns: bookingData.addOns || null,
          specialRequests: bookingData.specialRequests || null,
          totalPrice: bookingData.totalPrice || 0,
          paymentStatus: "AUTHORIZED",
          paypalOrderId: orderId,
          paypalAuthorizationId: authorizationId,
        },
      })
    } else {
      return NextResponse.json({ error: "Invalid booking type" }, { status: 400 })
    }

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 })
  } catch (error: any) {
    console.error("PayPal authorize error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to authorize payment" },
      { status: 500 }
    )
  }
}
