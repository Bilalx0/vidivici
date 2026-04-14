import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('New session error:', error)
    return NextResponse.json({ success: false, error: 'Failed to start new session' }, { status: 500 })
  }
}