# Booking & Payment Setup Guide

## Admin Dashboard Access

The admin dashboard is protected with hardcoded credentials:

- **URL:** `/admin/dashboard`
- **Username:** `admin`
- **Password:** `vidivici2024`

---

## Environment Variables

Add these to your `.env` file:

```env
# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="Vidi Vici <your-email@gmail.com>"

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## PayPal Sandbox Setup

1. Go to [developer.paypal.com](https://developer.paypal.com/)
2. Log in with your PayPal account (or create one)
3. Go to **Apps & Credentials** > **Sandbox** tab
4. Click **Create App**
   - App Name: `Vidi Vici`
   - App Type: Merchant
5. Copy the **Client ID** → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
6. Copy the **Secret** → `PAYPAL_CLIENT_SECRET`
7. Set `PAYPAL_MODE=sandbox`

### Sandbox Test Accounts

PayPal auto-creates sandbox buyer/seller accounts:
- Go to **Sandbox** > **Accounts** in the developer dashboard
- Use the **Personal (Buyer)** account email/password to test the PayPal popup
- Default password for sandbox accounts is usually shown in account details

### Testing the Flow

1. Book a car or villa on the site
2. Click the PayPal button → log in with the sandbox buyer account
3. Authorize the payment (funds held, not charged)
4. Go to admin dashboard → see the booking as PENDING / AUTHORIZED
5. Confirm the booking
6. Send the contract (email will be sent)
7. Mark contract as signed
8. Capture the payment

### Going Live

When ready for production:
1. Switch to **Live** tab in PayPal developer dashboard
2. Create a new Live app and get Live credentials
3. Set `PAYPAL_MODE=live` in your `.env`

---

## Gmail SMTP Setup (for sending contracts)

1. Go to [myaccount.google.com](https://myaccount.google.com/)
2. Enable **2-Step Verification** (required for app passwords)
3. Go to **Security** > **2-Step Verification** > **App passwords**
4. Create an app password (select "Mail" and your device)
5. Copy the 16-character password → `SMTP_PASS`
6. Set `SMTP_USER` to your Gmail address
7. Set `SMTP_HOST=smtp.gmail.com` and `SMTP_PORT=587`

### Important Notes

- The "from" address in `SMTP_FROM` should match your `SMTP_USER`
- Gmail has a daily sending limit of ~500 emails for personal accounts
- For higher volume, consider using a transactional email service (SendGrid, Resend, etc.)

---

## Database Migration

After setting up your `.env`, run the Prisma migration:

```bash
npx prisma migrate dev --name add-paypal-contract-inquiries
```

This adds:
- `AUTHORIZED` payment status
- PayPal fields (`paypalOrderId`, `paypalAuthorizationId`) to all booking models
- Contract fields (`contractStatus`, `contractSentAt`) to all booking models
- `Inquiry` model for form submissions

---

## Booking Flow Summary

```
Customer books + authorizes PayPal → PENDING / AUTHORIZED
  → Admin confirms availability     → CONFIRMED / AUTHORIZED
    → Admin sends contract email    → contract: SENT
      → Customer signs & emails back
        → Admin marks signed        → contract: SIGNED
          → Admin captures payment  → PAID
```

**PayPal authorization expires after 29 days.** The admin dashboard shows a warning when approaching expiry.

---

## Inquiries

All customer form submissions (contact page, partner applications, venue bookings, film/TV production inquiries) are collected in the **Inquiries** page in the admin dashboard, separated by category tabs: Car, Villa, Event, General.
