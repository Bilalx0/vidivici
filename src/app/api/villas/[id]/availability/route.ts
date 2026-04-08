import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const bookings = await prisma.villaBooking.findMany({
    where: {
      villaId: id,
      status: { notIn: ["CANCELLED"] },
    },
    select: { checkIn: true, checkOut: true },
  })

  const bookedRanges = bookings.map((b) => ({
    start: b.checkIn.toISOString().split("T")[0],
    end: b.checkOut.toISOString().split("T")[0],
  }))

  return NextResponse.json({ bookedRanges })
}
