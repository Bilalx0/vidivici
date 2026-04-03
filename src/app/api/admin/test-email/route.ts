import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { generateContractPdf } from '@/lib/contract-pdf'

export async function GET() {
  try {
    const pdfBuffer = generateContractPdf({
      bookingNumber: 'TEST-001',
      customerName: 'Asad Ali',
      customerEmail: 'asadaliabbasi787@gmail.com',
      itemName: 'Lamborghini Huracán EVO',
      bookingType: 'car',
      startDate: 'Apr 5, 2026',
      endDate: 'Apr 8, 2026',
      totalPrice: 4500,
      pickupLocation: 'Los Angeles, CA',
    })

    await sendEmail({
      to: 'abrishjutt162@gmail.com, sabaynanoor@gmail.com',
      subject: 'Test Contract — Vidi Vici Rental Agreement',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; border-bottom: 2px solid #dbb241; padding-bottom: 12px;">VIDI VICI</h1>
          <p style="color: #555;">Hi Asad,</p>
          <p style="color: #555;">This is a <strong>test email</strong> from your Vidi Vici platform. Your SMTP/Resend integration is working correctly!</p>
          <p style="color: #555;">Attached is a sample rental agreement PDF so you can see exactly what your customers will receive when you send a contract.</p>
          <div style="background: #f9f7f0; border-left: 4px solid #dbb241; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #333;"><strong>Booking:</strong> TEST-001</p>
            <p style="margin: 4px 0 0; color: #333;"><strong>Vehicle:</strong> Lamborghini Huracán EVO</p>
            <p style="margin: 4px 0 0; color: #333;"><strong>Dates:</strong> Apr 5 – Apr 8, 2026</p>
            <p style="margin: 4px 0 0; color: #333;"><strong>Total:</strong> $4,500</p>
          </div>
          <p style="color: #555;">Please review the attached contract and reply with your signed copy.</p>
          <p style="color: #888; font-size: 12px; margin-top: 32px;">Vidi Vici Luxury Rentals · Los Angeles & Miami</p>
        </div>
      `,
      attachments: [
        {
          filename: 'contract-TEST-001.pdf',
          content: pdfBuffer,
        },
      ],
    })

    return NextResponse.json({ success: true, message: 'Test email sent to asadaliabbasi787@gmail.com' })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Failed to send test email' }, { status: 500 })
  }
}
