import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { messages: true } } },
    })
    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
