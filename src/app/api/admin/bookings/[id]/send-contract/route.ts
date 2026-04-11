import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateContractPdf } from "@/lib/contract-pdf"
import { sendEmail } from "@/lib/email"
import { randomUUID } from "crypto"

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
    let uploadToken = randomUUID()

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
        data: { contractStatus: "SENT", contractSentAt: new Date(), contractUploadToken: uploadToken },
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
        data: { contractStatus: "SENT", contractSentAt: new Date(), contractUploadToken: uploadToken },
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
        data: { contractStatus: "SENT", contractSentAt: new Date(), contractUploadToken: uploadToken },
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
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vidivicihospitalitygroup.com"
    const uploadLink = `${appUrl}/contract/upload?token=${uploadToken}`

    await sendEmail({
      to: customerEmail,
      subject: `Your Vidi Vici Rental Agreement - Booking #${bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Your Rental Agreement</h2>
          <p>Dear ${customerName},</p>
          <p>Thank you for your booking with Vidi Vici. Please find your rental agreement attached to this email.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 8px; border: 1px solid #eee; color: #555;">Booking #</td><td style="padding: 8px; border: 1px solid #eee;"><strong>${bookingNumber}</strong></td></tr>
            <tr><td style="padding: 8px; border: 1px solid #eee; color: #555;">Item</td><td style="padding: 8px; border: 1px solid #eee;">${itemName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #eee; color: #555;">Total</td><td style="padding: 8px; border: 1px solid #eee;">$${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td></tr>
          </table>
          <p><strong>Next Steps:</strong></p>
          <ol style="color: #444; line-height: 1.8;">
            <li>Download and review the attached contract PDF.</li>
            <li>Print, sign, and scan it — or sign it digitally.</li>
            <li>Click the button below to upload your signed contract securely.</li>
          </ol>
          <p style="margin: 24px 0;">
            <a href="${uploadLink}" style="background: #1a1a1a; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Upload Signed Contract
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">Or copy this link into your browser:<br/><a href="${uploadLink}" style="color: #555;">${uploadLink}</a></p>
          <p style="color: #888; font-size: 12px; margin-top: 24px;">Once we receive your signed contract, we will confirm your booking and process payment. If you have any questions, please contact us.</p>
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
