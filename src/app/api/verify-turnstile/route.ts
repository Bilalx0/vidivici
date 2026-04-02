import { NextRequest, NextResponse } from "next/server"
import { verifyTurnstile } from "@/lib/turnstile"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const valid = await verifyTurnstile(token)
    if (!valid) {
      return NextResponse.json({ error: "Bot verification failed" }, { status: 403 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
