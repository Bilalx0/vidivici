import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const brand = await prisma.brand.findUnique({ where: { id }, include: { _count: { select: { cars: true } } } })
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const slug = body.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')
    const brand = await prisma.brand.update({ where: { id }, data: { ...body, slug } })
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.brand.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 })
  }
}
