import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.booking.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only admins or the booking owner can update
    const isAdmin = (session.user as any).role === 'ADMIN'
    const isOwner = existing.userId === (session.user as any).id
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Non-admins can only cancel their own bookings
    if (!isAdmin) {
      if (body.status && body.status !== 'CANCELLED') {
        return NextResponse.json({ error: 'You can only cancel your booking' }, { status: 403 })
      }
      // Only allow status update for non-admins
      const booking = await prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: { car: { include: { brand: true } }, user: { select: { name: true, email: true } } },
      })
      return NextResponse.json(booking)
    }

    // Admins can update status and paymentStatus
    const updateData: any = {}
    if (body.status) updateData.status = body.status
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus
    if (body.notes !== undefined) updateData.notes = body.notes

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { car: { include: { brand: true } }, user: { select: { name: true, email: true, phone: true } } },
    })

    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.booking.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only admins can hard-delete bookings
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.booking.delete({ where: { id } })

    return NextResponse.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
