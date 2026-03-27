import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    await prisma.testimonial.delete({ where: { id } })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
