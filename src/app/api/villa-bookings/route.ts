import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notifyAdmin } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { villaId, checkIn, checkOut, guests, notes } = body

    if (!villaId || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const villa = await prisma.villa.findUnique({ where: { id: villaId } })
    if (!villa) return NextResponse.json({ error: "Villa not found" }, { status: 404 })

    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

    const nightsTotal = villa.pricePerNight * nights
    const subtotal = nightsTotal + villa.cleaningFee
    const tax = subtotal * 0.14
    const totalPrice = subtotal + tax + villa.securityDeposit

    // Check if user docs are verified
    const userId = (session.user as any).id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, driverLicenseStatus: true, insuranceStatus: true },
    })
    const docsVerified = user &&
      user.driverLicenseStatus === "VERIFIED" &&
      user.insuranceStatus === "VERIFIED"

    const booking = await prisma.villaBooking.create({
      data: {
        userId,
        villaId,
        checkIn: start,
        checkOut: end,
        guests: guests || 1,
        totalPrice,
        notes,
        documentStatus: docsVerified ? "VERIFIED" : "PENDING",
      },
      include: { villa: true },
    })

    notifyAdmin(
      `New Villa Booking #${booking.bookingNumber}`,
      `<h2>New Villa Booking</h2>
      <p><strong>Customer:</strong> ${user?.name || user?.email || "Unknown"}</p>
      <p><strong>Villa:</strong> ${villa.name}</p>
      <p><strong>Dates:</strong> ${start.toLocaleDateString()} – ${end.toLocaleDateString()} (${nights} nights)</p>
      <p><strong>Total:</strong> $${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      <p><a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/bookings/${booking.id}">View Booking →</a></p>`
    )

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create villa booking" }, { status: 500 })
  }
}
