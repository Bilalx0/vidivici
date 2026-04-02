import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { capturePayPalAuthorization } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    const { bookingId, bookingType } = await request.json()

    if (!bookingId || !bookingType) {
      return NextResponse.json({ error: "Missing bookingId or bookingType" }, { status: 400 })
    }

    let authorizationId: string | null = null
    let contractStatus: string | null = null
    let paymentStatus: string | null = null

    if (bookingType === "car") {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      authorizationId = booking.paypalAuthorizationId
      contractStatus = booking.contractStatus
      paymentStatus = booking.paymentStatus
    } else if (bookingType === "villa") {
      const booking = await prisma.villaBooking.findUnique({ where: { id: bookingId } })
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      authorizationId = booking.paypalAuthorizationId
      contractStatus = booking.contractStatus
      paymentStatus = booking.paymentStatus
    } else if (bookingType === "event") {
      const booking = await prisma.eventBooking.findUnique({ where: { id: bookingId } })
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      authorizationId = booking.paypalAuthorizationId
      contractStatus = booking.contractStatus
      paymentStatus = booking.paymentStatus
    } else {
      return NextResponse.json({ error: "Invalid booking type" }, { status: 400 })
    }

    if (contractStatus !== "SIGNED") {
      return NextResponse.json({ error: "Contract must be signed before capturing payment" }, { status: 400 })
    }

    if (paymentStatus !== "AUTHORIZED") {
      return NextResponse.json({ error: "Payment is not in authorized state" }, { status: 400 })
    }

    if (!authorizationId) {
      return NextResponse.json({ error: "No PayPal authorization found" }, { status: 400 })
    }

    const capture = await capturePayPalAuthorization(authorizationId)

    // Update booking payment status to PAID
    if (bookingType === "car") {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "PAID", paymentIntentId: capture.id },
      })
    } else if (bookingType === "villa") {
      await prisma.villaBooking.update({
        where: { id: bookingId },
        data: { paymentStatus: "PAID" },
      })
    } else if (bookingType === "event") {
      await prisma.eventBooking.update({
        where: { id: bookingId },
        data: { paymentStatus: "PAID" },
      })
    }

    return NextResponse.json({ success: true, captureId: capture.id })
  } catch (error: any) {
    console.error("PayPal capture error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to capture payment" },
      { status: 500 }
    )
  }
}
