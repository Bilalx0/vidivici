import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  attachments?: { filename: string; content: Buffer }[]
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailOptions) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    attachments,
  })
}

export async function notifyAdmin(subject: string, html: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured, skipping admin notification")
    return
  }
  try {
    await sendEmail({ to: adminEmail, subject: `[Vidi Vici] ${subject}`, html })
  } catch (err) {
    console.error("Failed to send admin notification:", err)
  }
}
