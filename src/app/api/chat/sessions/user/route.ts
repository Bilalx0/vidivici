import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ session: null })
    }

    const userId = (session.user as any).id

    // Get the most recent chat session for this user, with recent messages only
    const chatSession = await prisma.chatSession.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 15, // Only load last 15 messages for frontend display
        },
      },
    })

    // Reverse messages to get chronological order after limiting
    if (chatSession?.messages) {
      chatSession.messages.reverse()
    }

    return NextResponse.json({ session: chatSession })
  } catch (error) {
    return NextResponse.json({ session: null })
  }
}
