import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const bookings = await prisma.booking.findMany({
    where: {
      carId: id,
      status: { notIn: ["CANCELLED"] },
    },
    select: { startDate: true, endDate: true },
  })

  const bookedRanges = bookings.map((b) => ({
    start: b.startDate.toISOString().split("T")[0],
    end: b.endDate.toISOString().split("T")[0],
  }))

  return NextResponse.json({ bookedRanges })
}
