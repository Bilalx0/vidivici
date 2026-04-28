# Mark AI Booking Workflow

This document explains the new Mark AI booking system — a 7-step concierge workflow that is **completely separate** from the existing website booking flow.

---

## Overview

Mark (the AI concierge chatbot) can now create bookings through chat conversations. These bookings follow a manual concierge workflow with deposit payment, owner confirmation, and wire transfer for the remaining balance.

**Important:** The existing booking system (website car/villa/event bookings via PayPal) is completely untouched. Mark bookings use a separate `MarkBooking` database model and separate admin pages.

---

## The 7-Step Workflow

### Step 1: Customer Chats with Mark
Mark gathers from the customer:
- Which car, villa, or event they want
- Dates
- Number of guests (for villas/events)
- Budget and special requests
- Agrees on total price and deposit amount

Mark checks availability, then creates the booking → Status: **booking_ready**

### Step 2: Customer Pays Deposit
Mark shares a deposit payment link with the customer. The customer visits the link and pays via PayPal (immediate capture).
→ Status: **deposit_paid**

### Step 3: Admin Sends to Owner
After seeing the deposit payment in the admin dashboard, staff clicks "Send to Owner for Confirmation".
→ Status: **awaiting_owner**

### Step 4: Owner Confirms (or Declines)
Admin contacts the property owner/partner manually. Once the owner approves, admin clicks "Owner Confirmed".
→ Status: **owner_confirmed**

### Step 5: Send Confirmation + Wire Instructions
Admin sets a balance due date, then clicks "Send Confirmation + Wire Instructions". The system sends a branded email to the customer with:
- Booking confirmed notification
- Deposit received amount
- Remaining balance amount and due date
- Bank wire transfer instructions (from Settings)
- Link to upload wire proof

→ Status: **balance_info_sent**

### Step 6: Customer Uploads Wire Proof
Customer receives the email and wires the remaining balance. They upload proof (bank receipt, SWIFT confirmation, or screenshot) via the upload portal.
→ Status: **proof_uploaded**

### Step 7: Associate Closes Booking
Admin reviews the wire proof, verifies everything is in order, and clicks "Close Booking".
→ Status: **closed**

At any point, admin can cancel the booking → Status: **cancelled**

---

## What Mark Can Do Now

### Search & Browse
- **Search cars** by name, brand, location, price range
- **Search villas** by name, location, bedrooms, guests, price range
- **Search events** by name, location, category

### Check Availability
- Checks both existing website bookings AND Mark bookings for date conflicts
- Works for cars, villas, and events

### Create Bookings
- Collects customer name, email, phone
- Agrees on total price and deposit
- Creates a `MarkBooking` record with payment tokens
- Shares the deposit payment link in the chat
- Notifies admin via email

### Multi-Language Support
- Mark detects and responds in the customer's language (English, French, Spanish, Arabic, etc.)

---

## Admin Dashboard

### Mark Bookings List (`/admin/mark-bookings`)
- View all Mark bookings with status, customer, item, pricing
- Filter by status, item type
- Search by customer name/email, booking number
- Stats: total bookings, active bookings, deposits received, total value

### Mark Booking Detail (`/admin/mark-bookings/[id]`)
- **7-step workflow stepper** showing current progress
- **Customer info**: name, email, phone
- **Booking details**: item, type, dates, guests, notes
- **Pricing**: total, deposit (paid/pending), balance due
- **Action buttons** (context-sensitive based on current step):
  - Booking Ready: shows deposit payment link to share
  - Deposit Paid: "Send to Owner for Confirmation"
  - Awaiting Owner: "Owner Confirmed" / "Owner Declined"
  - Owner Confirmed: set balance due date + "Send Confirmation + Wire Instructions"
  - Balance Info Sent: shows wire proof upload link
  - Proof Uploaded: view/download proof + "Close Booking"
- **Admin notes**: editable text area
- **Activity log**: timestamped history of all actions
- **Cancel Booking**: available at any step

### Settings (`/admin/settings`)
New "Wire Transfer Instructions" section:
- Bank Name
- Account Number
- Routing Number
- SWIFT Code
- Bank Address

These are included in the confirmation email sent to customers.

---

## Customer-Facing Pages

### Deposit Payment (`/mark/pay?token=TOKEN`)
- Token-based, no login required
- Shows booking summary (item, dates, deposit amount)
- PayPal button for immediate deposit payment
- Success/already-paid states

### Wire Proof Upload (`/mark/upload-proof?token=TOKEN`)
- Token-based, no login required
- Shows booking summary and balance due
- File upload (PDF, JPG, PNG, max 10MB)
- Files saved to `public/uploads/wire-proofs/`
- Success/already-uploaded states

---

## Email Notifications

| Event | Recipients | Content |
|-------|-----------|---------|
| Booking created by Mark | Admin | Customer info, item, dates, pricing, admin link |
| Deposit paid | Admin | Payment confirmation, remaining balance, admin link |
| Wire proof uploaded | Admin | Proof received, admin link |
| Booking confirmed (Step 5) | Customer | Booking confirmation, deposit received, balance due, wire instructions, upload link |

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/mark-bookings` | List all Mark bookings |
| GET | `/api/admin/mark-bookings/[id]` | Get booking detail |
| PUT | `/api/admin/mark-bookings/[id]` | Update status/notes |
| POST | `/api/admin/mark-bookings/[id]/send-confirmation` | Send confirmation email |
| GET | `/api/mark/pay?token=TOKEN` | Get booking info for payment page |
| POST | `/api/mark/pay` | Capture deposit payment |
| GET | `/api/mark/upload-proof?token=TOKEN` | Get booking info for upload page |
| POST | `/api/mark/upload-proof` | Upload wire proof file |

---

## Database

New model: `MarkBooking` (in `prisma/schema.prisma`)

Key fields:
- `bookingNumber`: Unique, format `MK-XXXX`
- `itemType`: "car", "villa", or "event"
- `workflowStatus`: booking_ready → deposit_paid → awaiting_owner → owner_confirmed → balance_info_sent → proof_uploaded → closed
- `depositPaymentToken`: UUID for deposit payment page access
- `wireProofToken`: UUID for wire proof upload page access
- Links to existing `Car`, `Villa`, `Event` models via optional foreign keys

**No changes to existing Booking, VillaBooking, or EventBooking models.**

---

## Deployment Notes

After deploying, run the database migration:
```bash
npx prisma db push --accept-data-loss
npx prisma generate
```

Make sure these environment variables are set:
- `OPENAI_API_KEY` — for Mark AI
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` / `PAYPAL_MODE` — for deposit payments
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — for client-side PayPal buttons
- `NEXTAUTH_URL` — for generating correct links in emails
- `SMTP_*` / `ADMIN_EMAIL` — for email notifications

Configure wire transfer instructions in Admin > Settings before using Step 5.

---

## About the "Table Booking" Feature

The client mentioned Mark should "check availability with partners and confirm table bookings." Mark can now:
1. Search events/venues via `search_events`
2. Check availability via `check_availability`
3. Create event bookings via `create_mark_booking` with `itemType: "event"`

The owner/partner confirmation step (Step 4) handles the manual coordination with venue partners. If the client means something different (e.g., real-time partner API integration), clarification is needed.
