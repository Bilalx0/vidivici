import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const userId = (session.user as any).id

    // Create a completely new chat session for this user
    const newChatSession = await prisma.chatSession.create({
      data: {
        userId,
        visitorId: `user-${userId}-${Date.now()}`,
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: newChatSession.id
    })
  } catch (error) {
    console.error('New session error:', error)
    return NextResponse.json({ success: false, error: 'Failed to start new session' }, { status: 500 })
  }
}