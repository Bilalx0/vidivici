import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { notifyAdmin } from "@/lib/email"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// GET /api/contract/upload?token=TOKEN — return booking info for display
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })

  const carBooking = await prisma.booking.findUnique({
    where: { contractUploadToken: token },
    select: { id: true, bookingNumber: true, contractStatus: true, signedContractUrl: true, car: { select: { name: true, brand: { select: { name: true } } } } },
  })
  if (carBooking) {
    return NextResponse.json({
      bookingType: "car",
      bookingNumber: carBooking.bookingNumber,
      itemName: `${carBooking.car.brand.name} ${carBooking.car.name}`,
      contractStatus: carBooking.contractStatus,
      alreadyUploaded: !!carBooking.signedContractUrl,
    })
  }

  const villaBooking = await prisma.villaBooking.findUnique({
    where: { contractUploadToken: token },
    select: { id: true, bookingNumber: true, contractStatus: true, signedContractUrl: true, villa: { select: { name: true } } },
  })
  if (villaBooking) {
    return NextResponse.json({
      bookingType: "villa",
      bookingNumber: villaBooking.bookingNumber,
      itemName: villaBooking.villa.name,
      contractStatus: villaBooking.contractStatus,
      alreadyUploaded: !!villaBooking.signedContractUrl,
    })
  }

  const eventBooking = await prisma.eventBooking.findUnique({
    where: { contractUploadToken: token },
    select: { id: true, bookingNumber: true, contractStatus: true, signedContractUrl: true, event: { select: { name: true } }, clubVenue: true },
  })
  if (eventBooking) {
    return NextResponse.json({
      bookingType: "event",
      bookingNumber: eventBooking.bookingNumber,
      itemName: eventBooking.event?.name || eventBooking.clubVenue || "Event",
      contractStatus: eventBooking.contractStatus,
      alreadyUploaded: !!eventBooking.signedContractUrl,
    })
  }

  return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 })
}

// POST /api/contract/upload — customer uploads signed contract
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const token = formData.get("token") as string
    const file = formData.get("file") as File | null

    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF, JPG, or PNG files are accepted" }, { status: 400 })
    }
    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 10MB" }, { status: 400 })
    }

    // Save file
    const uploadDir = path.join(process.cwd(), "public", "uploads", "contracts")
    await mkdir(uploadDir, { recursive: true })
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf"
    const uniqueName = `signed-contract-${token.slice(0, 16)}-${Date.now()}.${ext}`
    const filePath = path.join(uploadDir, uniqueName)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))
    const signedContractUrl = `/uploads/contracts/${uniqueName}`

    // Find booking and update
    let bookingNumber = ""
    let itemName = ""
    let customerEmail = ""

    // Stores the signed file but does NOT mark contract as signed automatically —
    // admin reviews the document and manually marks it as signed.
    let bookingId = ""
    const carBooking = await prisma.booking.findUnique({ where: { contractUploadToken: token }, include: { user: { select: { email: true } }, car: { select: { name: true, brand: { select: { name: true } } } } } })
    if (carBooking) {
      await prisma.booking.update({
        where: { contractUploadToken: token },
        data: { signedContractUrl },
      })
      bookingId = carBooking.id
      bookingNumber = carBooking.bookingNumber
      itemName = `${carBooking.car.brand.name} ${carBooking.car.name}`
      customerEmail = carBooking.user.email
    } else {
      const villaBooking = await prisma.villaBooking.findUnique({ where: { contractUploadToken: token }, include: { user: { select: { email: true } }, villa: { select: { name: true } } } })
      if (villaBooking) {
        await prisma.villaBooking.update({
          where: { contractUploadToken: token },
          data: { signedContractUrl },
        })
        bookingId = villaBooking.id
        bookingNumber = villaBooking.bookingNumber
        itemName = villaBooking.villa.name
        customerEmail = villaBooking.user.email
      } else {
        const eventBooking = await prisma.eventBooking.findUnique({ where: { contractUploadToken: token }, include: { event: { select: { name: true } } } })
        if (eventBooking) {
          await prisma.eventBooking.update({
            where: { contractUploadToken: token },
            data: { signedContractUrl },
          })
          bookingId = eventBooking.id
          bookingNumber = eventBooking.bookingNumber || eventBooking.id.slice(0, 8)
          itemName = eventBooking.event?.name || eventBooking.clubVenue || "Event"
          customerEmail = eventBooking.email
        } else {
          return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 })
        }
      }
    }

    // Notify admin
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vidivicihospitalitygroup.com"
    const bookingUrl = `${appUrl}/admin/bookings/${bookingId}`
    await notifyAdmin(
      `Signed Contract Received — Booking #${bookingNumber}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Signed Contract Received</h2>
          <p>A customer has uploaded their signed contract. Please review it and manually mark it as signed once verified.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 8px; border: 1px solid #eee; color: #555;">Booking #</td><td style="padding: 8px; border: 1px solid #eee;"><strong>${bookingNumber}</strong></td></tr>
            <tr><td style="padding: 8px; border: 1px solid #eee; color: #555;">Item</td><td style="padding: 8px; border: 1px solid #eee;">${itemName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #eee; color: #555;">Customer</td><td style="padding: 8px; border: 1px solid #eee;">${customerEmail}</td></tr>
          </table>
          <p style="margin-top: 24px;">
            <a href="${bookingUrl}" style="background: #1a1a1a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">View Booking &amp; Signed Contract</a>
          </p>
        </div>
      `
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Contract upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
