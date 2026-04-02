import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { role, content } = await request.json()

    if (!role || !content) {
      return NextResponse.json({ error: "Role and content required" }, { status: 400 })
    }

    const message = await prisma.chatMessage.create({
      data: { sessionId: id, role, content },
    })

    await prisma.chatSession.update({
      where: { id },
      data: { lastMessage: content, updatedAt: new Date() },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
