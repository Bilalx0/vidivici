import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateContractPdf } from "@/lib/contract-pdf"
import { sendEmail } from "@/lib/email"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { bookingType } = await request.json()

    let customerEmail = ""
    let customerName = ""
    let bookingNumber = ""
    let itemName = ""
    let startDate = ""
    let endDate = ""
    let totalPrice = 0
    let pickupLocation: string | undefined
    let guests: number | undefined

    if (bookingType === "car") {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          car: { include: { brand: true } },
          user: { select: { name: true, email: true } },
        },
      })
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      if (booking.status !== "CONFIRMED") {
        return NextResponse.json({ error: "Booking must be confirmed before sending contract" }, { status: 400 })
      }

      customerEmail = booking.user.email
      customerName = booking.user.name || "Customer"
      bookingNumber = booking.bookingNumber
      itemName = `${booking.car.brand.name} ${booking.car.name}`
      startDate = booking.startDate.toISOString()
      endDate = booking.endDate.toISOString()
      totalPrice = booking.totalPrice
      pickupLocation = booking.pickupLocation

      await prisma.booking.update({
        where: { id },
        data: { contractStatus: "SENT", contractSentAt: new Date() },
      })
    } else if (bookingType === "villa") {
      const booking = await prisma.villaBooking.findUnique({
        where: { id },
        include: {
          villa: true,
          user: { select: { name: true, email: true } },
        },
      })
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      if (booking.status !== "CONFIRMED") {
        return NextResponse.json({ error: "Booking must be confirmed before sending contract" }, { status: 400 })
      }

      customerEmail = booking.user.email
      customerName = booking.user.name || "Customer"
      bookingNumber = booking.bookingNumber
      itemName = booking.villa.name
      startDate = booking.checkIn.toISOString()
      endDate = booking.checkOut.toISOString()
      totalPrice = booking.totalPrice
      guests = booking.guests

      await prisma.villaBooking.update({
        where: { id },
        data: { contractStatus: "SENT", contractSentAt: new Date() },
      })
    } else if (bookingType === "event") {
      const booking = await prisma.eventBooking.findUnique({
        where: { id },
        include: { event: true },
      })
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      if (booking.status !== "CONFIRMED") {
        return NextResponse.json({ error: "Booking must be confirmed before sending contract" }, { status: 400 })
      }

      customerEmail = booking.email
      customerName = `${booking.firstName} ${booking.lastName || ""}`.trim()
      bookingNumber = booking.bookingNumber || booking.id.slice(0, 8)
      itemName = booking.event?.name || booking.clubVenue || "Event"
      startDate = booking.bookingDate.toISOString()
      endDate = booking.bookingDate.toISOString()
      totalPrice = booking.totalPrice

      await prisma.eventBooking.update({
        where: { id },
        data: { contractStatus: "SENT", contractSentAt: new Date().toISOString() },
      })
    } else {
      return NextResponse.json({ error: "Invalid booking type" }, { status: 400 })
    }

    // Generate PDF
    const pdfBuffer = generateContractPdf({
      bookingNumber,
      customerName,
      customerEmail,
      itemName,
      bookingType,
      startDate,
      endDate,
      totalPrice,
      pickupLocation,
      guests,
    })

    // Send email
    await sendEmail({
      to: customerEmail,
      subject: `Your Vidi Vici Rental Agreement - Booking #${bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Your Rental Agreement</h2>
          <p>Dear ${customerName},</p>
          <p>Thank you for your booking with Vidi Vici. Please find your rental agreement attached.</p>
          <p><strong>Booking Reference:</strong> ${bookingNumber}</p>
          <p><strong>Item:</strong> ${itemName}</p>
          <p><strong>Total:</strong> $${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p>Please review, sign, and reply to this email with the signed contract attached. Once we receive your signed contract, we will finalize your booking and process the payment.</p>
          <br/>
          <p>Best regards,<br/>The Vidi Vici Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `contract-${bookingNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Send contract error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send contract" },
      { status: 500 }
    )
  }
}
