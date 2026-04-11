import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user || !user.password) {
      // No account or Google-only account — silently succeed
      return NextResponse.json({ success: true })
    }

    const token = randomBytes(32).toString("hex")
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { email: user.email },
      data: { passwordResetToken: token, passwordResetExpiry: expiry },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vidivicihospitalitygroup.com"
    const resetLink = `${appUrl}/reset-password?token=${token}`

    await sendEmail({
      to: user.email,
      subject: "Reset your Vidi Vici password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Reset Your Password</h2>
          <p>Hi ${user.name || "there"},</p>
          <p>We received a request to reset the password for your Vidi Vici account. Click the button below to set a new password.</p>
          <p style="margin: 28px 0;">
            <a href="${resetLink}" style="background: #1a1a1a; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">This link expires in <strong>1 hour</strong>.</p>
          <p style="color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
          <p style="color: #bbb; font-size: 12px; margin-top: 24px;">Or copy this link into your browser:<br/><a href="${resetLink}" style="color: #888;">${resetLink}</a></p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
