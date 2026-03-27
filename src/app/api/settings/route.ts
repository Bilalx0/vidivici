import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany()

    const result: Record<string, string> = {}
    for (const setting of settings) {
      result[setting.key] = setting.value
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const updates = Object.entries(body).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )

    await Promise.all(updates)

    // Return the updated settings
    const settings = await prisma.siteSettings.findMany()
    const result: Record<string, string> = {}
    for (const setting of settings) {
      result[setting.key] = setting.value
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
