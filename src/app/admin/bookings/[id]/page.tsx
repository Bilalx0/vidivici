"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { Calendar, Phone, User, Mail, MapPin, Car, FileText, MoreHorizontal, AlertTriangle, MessageSquare, Send, X } from "lucide-react"

interface BookingDetail {
  id: string
  bookingNumber?: string
  bookingType: string
  itemName: string
  status: string
  paymentStatus: string
  documentStatus?: string
  contractStatus?: string
  contractSentAt?: string
  signedContractUrl?: string
  paypalOrderId?: string
  paypalAuthorizationId?: string
  totalPrice: number
  basePrice?: number
  discount?: number
  tax?: number
  addOnsTotal?: number
  deliveryFee?: number
  driverCost?: number
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  pickupLocation?: string
  dropoffLocation?: string
  deliveryType?: string
  deliveryAddress?: string
  returnAddress?: string
  isOneWay?: boolean
  needsDriver?: boolean
  driverHours?: number
  driverDays?: number
  guests?: number
  notes?: string
  adminNotes?: string
  documents?: string
  specialRequests?: string
  createdAt: string
  car?: { name: string; brand: { name: string }; images?: { url: string }[] }
  villa?: { name: string; images?: { url: string }[] }
  event?: { name: string } | null
  user?: {
    name: string | null
    email: string
    phone: string | null
    id?: string
    driverLicense?: string | null
    driverLicenseStatus?: string
    insurance?: string | null
    insuranceStatus?: string
    passport?: string | null
    passportStatus?: string
  }
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  guestsTotal?: string
  budget?: string
  clubVenue?: string
  addOns?: string
  /* Event partner fields */
  partnerName?: string
  partnerStatus?: string
  bookingFlow?: string
  activityLog?: string
}

const FLOW_STEPS = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "contract_sent", label: "Contract Sent" },
  { key: "contract_signed", label: "Contract Signed" },
  { key: "paid", label: "Payment Captured" },
]

function getFlowStep(booking: BookingDetail): number {
  if (booking.paymentStatus === "PAID") return 4
  if (booking.contractStatus === "SIGNED") return 3
  if (booking.contractStatus === "SENT") return 2
  if (booking.status === "CONFIRMED") return 1
  return 0
}

function getAuthDaysRemaining(createdAt: string): number {
  const created = new Date(createdAt)
  const now = new Date()
  const daysSince = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, 29 - daysSince)
}

interface DocEntry { url: string | null; number: string | null; expiry: string | null }
function parseDoc(raw: string | null | undefined): DocEntry | null {
  if (!raw) return null
  try { return JSON.parse(raw) as DocEntry }
  catch { return { url: raw, number: null, expiry: null } }
}

const USER_DOC_STATUS_COLORS: Record<string, string> = {
  VERIFIED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  REJECTED: "bg-red-100 text-red-600",
  NONE: "bg-mist-100 text-mist-500",
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminNotes, setAdminNotes] = useState("")
  const [actionLoading, setActionLoading] = useState("")
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    pickupLocation: "",
    dropoffLocation: "",
    totalPrice: 0,
    guests: 1,
  })

  /* ---- Messaging state ---- */
  const [showMessaging, setShowMessaging] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [messageType, setMessageType] = useState<"confirmation" | "alternative">("confirmation")
  const [alternativeVehicle, setAlternativeVehicle] = useState("")
  const [generatingMessage, setGeneratingMessage] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)

  /* ---- Quick coupon state (for alternative offer) ---- */
  const [quickCouponCode, setQuickCouponCode] = useState("")
  const [quickCouponDiscount, setQuickCouponDiscount] = useState("10")
  const [creatingCoupon, setCreatingCoupon] = useState(false)
  const [createdCoupon, setCreatedCoupon] = useState<{ code: string; discountPercent: number } | null>(null)

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBooking(data)
      setAdminNotes(data.adminNotes || "")
    } catch {
      toast.error("Failed to load booking")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooking() }, [id])

  const startEditing = () => {
    if (!booking) return
    setEditForm({
      startDate: booking.startDate?.split("T")[0] || "",
      endDate: booking.endDate?.split("T")[0] || "",
      startTime: booking.startTime || "",
      endTime: booking.endTime || "",
      pickupLocation: booking.pickupLocation || "",
      dropoffLocation: booking.dropoffLocation || "",
      totalPrice: booking.totalPrice || 0,
      guests: booking.guests || 1,
    })
    setEditing(true)
  }

  const saveEdits = async () => {
    if (!booking) return
    setActionLoading("edit")
    try {
      const payload: Record<string, unknown> = { bookingType: booking.bookingType }
      if (editForm.startDate) payload.startDate = editForm.startDate
      if (editForm.endDate) payload.endDate = editForm.endDate
      payload.startTime = editForm.startTime
      payload.endTime = editForm.endTime
      if (booking.bookingType === "car") {
        payload.pickupLocation = editForm.pickupLocation
        payload.dropoffLocation = editForm.dropoffLocation
      }
      if (booking.bookingType === "villa") {
        payload.guests = editForm.guests
      }
      payload.totalPrice = editForm.totalPrice

      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success("Booking details updated")
      setEditing(false)
      fetchBooking()
    } catch {
      toast.error("Failed to update booking")
    } finally {
      setActionLoading("")
    }
  }

  const updateBooking = async (field: string, value: string) => {
    if (!booking) return
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingType: booking.bookingType, [field]: value }),
      })
      if (!res.ok) throw new Error()
      toast.success(`${field === "status" ? "Status" : field === "paymentStatus" ? "Payment" : field === "documentStatus" ? "Document status" : field === "contractStatus" ? "Contract status" : "Notes"} updated`)
      fetchBooking()
    } catch {
      toast.error("Failed to update")
    }
  }

  const confirmBooking = async () => {
    setActionLoading("confirm")
    await updateBooking("status", "CONFIRMED")
    setActionLoading("")
  }

  const sendContract = async () => {
    if (!booking) return
    setActionLoading("contract")
    try {
      const res = await fetch(`/api/admin/bookings/${id}/send-contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingType: booking.bookingType }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to send contract")
      }
      toast.success("Contract sent to customer's email")
      fetchBooking()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setActionLoading("")
    }
  }

  const markContractSigned = async () => {
    setActionLoading("signed")
    await updateBooking("contractStatus", "SIGNED")
    setActionLoading("")
  }

  const capturePayment = async () => {
    if (!booking) return
    setActionLoading("capture")
    try {
      const res = await fetch("/api/paypal/capture-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, bookingType: booking.bookingType }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to capture payment")
      }
      toast.success("Payment captured successfully")
      fetchBooking()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setActionLoading("")
    }
  }

  const cancelBooking = async () => {
    setActionLoading("cancel")
    await updateBooking("status", "CANCELLED")
    setActionLoading("")
  }

  const saveAdminNotes = () => updateBooking("adminNotes", adminNotes)

  const generateMessage = async () => {
    setGeneratingMessage(true)
    try {
      const res = await fetch(`/api/admin/bookings/${id}/generate-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageType,
          alternativeVehicle: messageType === "alternative" ? alternativeVehicle : undefined,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to generate")
      const data = await res.json()
      setMessageText(data.message)
      setEmailSubject(data.emailSubject)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGeneratingMessage(false)
    }
  }

  const autoGenerateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    return `VIDI${rand}`
  }

  const createQuickCoupon = async () => {
    const code = quickCouponCode.trim() || autoGenerateCouponCode()
    const discount = parseFloat(quickCouponDiscount)
    if (!discount || discount <= 0 || discount > 100) {
      toast.error("Discount must be between 1 and 100")
      return
    }
    setCreatingCoupon(true)
    try {
      const scope = booking?.bookingType === "villa" ? "all_villas" : "all_cars"
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountPercent: discount,
          maxUses: 1,
          scope,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create coupon")
      setCreatedCoupon({ code: data.code, discountPercent: data.discountPercent })
      setQuickCouponCode("")
      toast.success(`Coupon ${data.code} created`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setCreatingCoupon(false)
    }
  }

  const sendEmailToCustomer = async () => {
    if (!booking) return
    const to = booking.user?.email || booking.customerEmail || ""
    if (!to) { toast.error("No customer email found"); return }
    setSendingEmail(true)
    try {
      const res = await fetch(`/api/admin/bookings/${id}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject: emailSubject, message: messageText }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to send")
      toast.success("Email sent to " + to)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSendingEmail(false)
    }
  }

  const openWhatsApp = () => {
    if (!booking) return
    const phone = (booking.user?.phone || booking.customerPhone || "").replace(/[^0-9]/g, "")
    if (!phone) { toast.error("No customer phone number found"); return }
    const encodedMessage = encodeURIComponent(messageText)
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank")
  }

  if (loading) return <div className="p-10"><p className="text-mist-400">Loading booking...</p></div>
  if (!booking) return <div className="p-10"><p className="text-mist-400">Booking not found</p></div>

  const custName = booking.user?.name || booking.customerName || "N/A"
  const custEmail = booking.user?.email || booking.customerEmail || ""
  const custPhone = booking.user?.phone || booking.customerPhone || ""
  const bNum = booking.bookingNumber || booking.id.slice(0, 12)
  const image = booking.car?.images?.[0]?.url || booking.villa?.images?.[0]?.url || null
  const typeBadge = booking.bookingType === "car" ? "Car" : booking.bookingType === "villa" ? "Villa" : "Event"

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
  const formatTime = (t?: string) => t || "10:00 AM"

  const currentStep = getFlowStep(booking)
  const isCancelled = booking.status === "CANCELLED"
  const isAuthorized = booking.paymentStatus === "AUTHORIZED"
  const authDaysLeft = isAuthorized ? getAuthDaysRemaining(booking.createdAt) : null

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    COMPLETED: "bg-mist-100 text-mist-700 border-mist-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  }
  const docColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    VERIFIED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  }

  if (booking.bookingType === "event") {
    return (
      <EventBookingDetail
        booking={booking}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        fetchBooking={fetchBooking}
        id={id}
      />
    )
  }

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/bookings" className="text-mist-400 hover:text-mist-700 text-sm">&larr; Bookings</Link>
          </div>
          <h1 className="text-2xl font-bold text-mist-900">Booking Details</h1>
          <p className="text-sm text-mist-500">#{bNum} &middot; Booking ID: {booking.id.slice(0, 16)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${statusColors[booking.status] || statusColors.PENDING}`}>
            Status: {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
          </span>
          <span className="text-xs text-mist-400">Created {formatDate(booking.createdAt)}</span>
        </div>
      </div>

      {/* Booking Flow Stepper */}
      {!isCancelled && (
        <div className="bg-white border border-mist-200 rounded-xl p-4 sm:p-5 mb-6 overflow-x-auto">
          <h3 className="text-sm font-semibold text-mist-700 mb-4">Booking Flow</h3>
          <div className="flex items-center gap-0 min-w-[400px]">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${i <= currentStep ? "bg-emerald-500 text-white" : "bg-mist-200 text-mist-400"}`}>
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] mt-1.5 text-center leading-tight ${i <= currentStep ? "text-emerald-600 font-medium" : "text-mist-400"}`}>
                    {step.label}
                  </span>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-4 ${i < currentStep ? "bg-emerald-400" : "bg-mist-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Authorization Expiry Warning */}
      {isAuthorized && authDaysLeft !== null && authDaysLeft <= 10 && !isCancelled && (
        <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${authDaysLeft <= 3 ? "bg-red-50 border border-red-200" : "bg-yellow-50 border border-yellow-200"}`}>
          <AlertTriangle size={18} className={authDaysLeft <= 3 ? "text-red-500" : "text-yellow-500"} />
          <div>
            <p className={`text-sm font-medium ${authDaysLeft <= 3 ? "text-red-700" : "text-yellow-700"}`}>
              PayPal authorization expires in {authDaysLeft} day{authDaysLeft !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-mist-500">Capture the payment before the authorization expires, or the customer will need to re-authorize.</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
        {!isCancelled && (
          <button
            onClick={editing ? saveEdits : startEditing}
            disabled={actionLoading === "edit"}
            className={`text-sm font-medium px-4 py-2 rounded flex items-center gap-2 ${editing ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-mist-900 hover:bg-mist-800 text-white"}`}
          >
            {actionLoading === "edit" ? "Saving..." : editing ? "✓ Save Changes" : "✎ Edit Details"}
          </button>
        )}
        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="text-sm font-medium px-4 py-2 rounded bg-mist-100 text-mist-600 hover:bg-mist-200"
          >
            Cancel Edit
          </button>
        )}
        {booking.status === "PENDING" && !isCancelled && (
          <button
            onClick={confirmBooking}
            disabled={actionLoading === "confirm"}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            {actionLoading === "confirm" ? "..." : "✓ Confirm Booking"}
          </button>
        )}
        <button
          onClick={() => updateBooking("documentStatus", "VERIFIED")}
          disabled={booking.documentStatus === "VERIFIED"}
          className={`text-sm font-medium px-4 py-2 rounded flex items-center gap-2 ${booking.documentStatus === "VERIFIED" ? "bg-mist-100 text-mist-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
        >
          ✓ Verify Documents
        </button>
        <button
          onClick={sendContract}
          disabled={booking.status !== "CONFIRMED" || booking.contractStatus === "SIGNED" || actionLoading === "contract"}
          className={`text-sm font-medium px-4 py-2 rounded flex items-center gap-2 ${
            booking.status === "CONFIRMED" && booking.contractStatus !== "SIGNED"
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-mist-200 text-mist-500 cursor-not-allowed"
          }`}
        >
          {actionLoading === "contract" ? "Sending..." : booking.contractStatus === "SENT" ? "📄 Resend Contract" : "📄 Send Contract"}
        </button>
        <button
          onClick={markContractSigned}
          disabled={booking.contractStatus !== "SENT" || actionLoading === "signed"}
          className={`text-sm font-medium px-4 py-2 rounded flex items-center gap-2 ${
            booking.contractStatus === "SENT"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-mist-200 text-mist-500 cursor-not-allowed"
          }`}
        >
          {actionLoading === "signed" ? "..." : "✓ Mark Contract Signed"}
        </button>
        <button
          onClick={capturePayment}
          disabled={booking.contractStatus !== "SIGNED" || booking.paymentStatus !== "AUTHORIZED" || actionLoading === "capture"}
          className={`text-sm font-medium px-4 py-2 rounded flex items-center gap-2 ${
            booking.contractStatus === "SIGNED" && booking.paymentStatus === "AUTHORIZED"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-mist-200 text-mist-500 cursor-not-allowed"
          }`}
        >
          {actionLoading === "capture" ? "Capturing..." : "$ Capture Payment"}
        </button>
        {!isCancelled && (
          <button
            onClick={cancelBooking}
            disabled={actionLoading === "cancel"}
            className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded border border-red-200 flex items-center gap-2 disabled:opacity-50"
          >
            Cancel Booking
          </button>
        )}
        <button
          onClick={() => { setShowMessaging(!showMessaging); if (!showMessaging && !messageText) generateMessage() }}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-2 rounded border border-emerald-200 flex items-center gap-2"
        >
          <MessageSquare size={14} /> Send Message
        </button>
      </div>

      {/* Messaging Panel */}
      {showMessaging && (
        <div className="bg-white border border-mist-200 rounded-xl p-4 sm:p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-mist-900 flex items-center gap-2"><MessageSquare size={16} /> Message Customer</h3>
            <button onClick={() => setShowMessaging(false)} className="text-mist-400 hover:text-mist-600"><X size={18} /></button>
          </div>

          {/* Message Type Selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setMessageType("confirmation")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${messageType === "confirmation" ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-mist-200 text-mist-500 hover:border-mist-300"}`}
            >
              Booking Confirmation
            </button>
            <button
              onClick={() => setMessageType("alternative")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${messageType === "alternative" ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-white border-mist-200 text-mist-500 hover:border-mist-300"}`}
            >
              Offer Alternative
            </button>
          </div>

          {/* Alternative Vehicle Input */}
          {messageType === "alternative" && (
            <div className="mb-4 space-y-4">
              <div>
                <label className="text-xs text-mist-500 block mb-1">Alternative Vehicle / Villa Name</label>
                <input
                  type="text"
                  value={alternativeVehicle}
                  onChange={e => setAlternativeVehicle(e.target.value)}
                  placeholder="e.g. Range Rover Sport, Malibu Beach Villa..."
                  className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none"
                />
              </div>

              {/* Quick Coupon for Alternative Offer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-amber-800 mb-3">Create Discount Coupon for Customer</h4>
                {createdCoupon ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-700 font-medium">✓ Coupon created:</span>
                    <span className="font-mono font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded">{createdCoupon.code}</span>
                    <span className="text-green-600">({createdCoupon.discountPercent}% off)</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[140px]">
                      <label className="text-xs text-amber-700 block mb-1">Coupon Code</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={quickCouponCode}
                          onChange={e => setQuickCouponCode(e.target.value.toUpperCase())}
                          placeholder="Auto-generate"
                          className="flex-1 bg-white border border-amber-200 text-sm px-2.5 py-1.5 rounded focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQuickCouponCode(autoGenerateCouponCode())}
                          className="px-2 py-1.5 bg-white border border-amber-200 text-amber-600 rounded text-xs hover:bg-amber-100"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-amber-700 block mb-1">Discount %</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={quickCouponDiscount}
                        onChange={e => setQuickCouponDiscount(e.target.value)}
                        className="w-full bg-white border border-amber-200 text-sm px-2.5 py-1.5 rounded focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={createQuickCoupon}
                      disabled={creatingCoupon}
                      className="px-4 py-1.5 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 disabled:opacity-50"
                    >
                      {creatingCoupon ? "Creating..." : "Create Coupon"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateMessage}
            disabled={generatingMessage || (messageType === "alternative" && !alternativeVehicle.trim())}
            className="text-xs font-medium px-4 py-2 rounded bg-mist-900 text-white hover:bg-mist-800 disabled:opacity-40 disabled:cursor-not-allowed mb-4"
          >
            {generatingMessage ? "Generating with AI..." : "✨ Generate Message"}
          </button>

          {/* Email Subject */}
          {messageText && (
            <div className="mb-3">
              <label className="text-xs text-mist-500 block mb-1">Email Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none"
              />
            </div>
          )}

          {/* Message Preview / Editor */}
          <div className="mb-4">
            <label className="text-xs text-mist-500 block mb-1">Message</label>
            <textarea
              rows={8}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder={generatingMessage ? "Generating message..." : "Click 'Generate Message' to create a message, or type your own..."}
              className="w-full bg-mist-50 border border-mist-200 text-sm text-mist-700 px-3 py-3 rounded focus:border-black focus:outline-none resize-y"
            />
          </div>

          {/* Send Buttons */}
          {messageText && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={sendEmailToCustomer}
                disabled={sendingEmail}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                <Mail size={14} /> {sendingEmail ? "Sending..." : "Send via Email"}
              </button>
              <button
                onClick={openWhatsApp}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded bg-green-600 hover:bg-green-700 text-white"
              >
                <Send size={14} /> Send via WhatsApp
              </button>
              <span className="text-xs text-mist-400 self-center">
                To: {booking.user?.email || booking.customerEmail || "—"} / {booking.user?.phone || booking.customerPhone || "—"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-mist-900">Customer Info</h3>
              <MoreHorizontal size={16} className="text-mist-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><User size={16} className="text-mist-400" /><span className="text-sm text-mist-900 font-medium">{custName}</span></div>
              <div className="flex items-center gap-3"><Mail size={16} className="text-mist-400" /><span className="text-sm text-mist-600">{custEmail}</span></div>
              {custPhone && <div className="flex items-center gap-3"><Phone size={16} className="text-mist-400" /><span className="text-sm text-mist-600">{custPhone}</span></div>}
            </div>
          </div>

          {/* Booking Info (Left card) */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-mist-900">Booking Info</h3>
              <MoreHorizontal size={16} className="text-mist-400" />
            </div>
            {editing ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><span className="text-mist-500">Type:</span><span className="bg-mist-100 text-mist-700 px-2 py-0.5 rounded text-xs font-medium">{typeBadge}</span></div>
                <p className="font-medium text-mist-900">{booking.itemName}</p>
                <div>
                  <label className="text-xs text-mist-500 block mb-1">Start Date</label>
                  <input type="date" value={editForm.startDate} onChange={e => setEditForm(f => ({ ...f, startDate: e.target.value }))} className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-mist-500 block mb-1">End Date</label>
                  <input type="date" value={editForm.endDate} onChange={e => setEditForm(f => ({ ...f, endDate: e.target.value }))} className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-mist-500 block mb-1">Start Time</label>
                  <input type="time" value={editForm.startTime} onChange={e => setEditForm(f => ({ ...f, startTime: e.target.value }))} className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-mist-500 block mb-1">End Time</label>
                  <input type="time" value={editForm.endTime} onChange={e => setEditForm(f => ({ ...f, endTime: e.target.value }))} className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                </div>
                {booking.bookingType === "car" && (
                  <>
                    <div>
                      <label className="text-xs text-mist-500 block mb-1">Pickup Location</label>
                      <input type="text" value={editForm.pickupLocation} onChange={e => setEditForm(f => ({ ...f, pickupLocation: e.target.value }))} className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-mist-500 block mb-1">Dropoff Location</label>
                      <input type="text" value={editForm.dropoffLocation} onChange={e => setEditForm(f => ({ ...f, dropoffLocation: e.target.value }))} className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                    </div>
                  </>
                )}
                {booking.bookingType === "villa" && (
                  <div>
                    <label className="text-xs text-mist-500 block mb-1">Guests</label>
                    <input type="number" min={1} value={editForm.guests} onChange={e => setEditForm(f => ({ ...f, guests: Number(e.target.value) }))} className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                  </div>
                )}
                <div>
                  <label className="text-xs text-mist-500 block mb-1">Total Price ($)</label>
                  <input type="number" step="0.01" value={editForm.totalPrice} onChange={e => setEditForm(f => ({ ...f, totalPrice: Number(e.target.value) }))} className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none" />
                </div>
              </div>
            ) : (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><span className="text-mist-500">Type:</span><span className="bg-mist-100 text-mist-700 px-2 py-0.5 rounded text-xs font-medium">{typeBadge}</span></div>
              <p className="font-medium text-mist-900">{booking.itemName}</p>
              <p className="text-mist-500">#{bNum}</p>
              <div className="flex items-center gap-2"><Calendar size={14} className="text-mist-400" /><span className="text-mist-700">{formatDate(booking.startDate)} {formatTime(booking.startTime)}</span></div>
              <div className="flex items-center gap-2"><Calendar size={14} className="text-mist-400" /><span className="text-mist-700">{formatDate(booking.endDate)} {formatTime(booking.endTime)}</span></div>
              {booking.bookingType === "car" && (
                <>
                  {booking.needsDriver && <div className="text-mist-600"><span className="font-medium">Driver Required</span><p className="text-xs text-mist-400">{booking.driverHours || 6} Hours/Day</p></div>}
                  {booking.pickupLocation && <div className="flex items-center gap-2"><MapPin size={14} className="text-mist-400" /><span className="text-mist-600">{booking.pickupLocation}</span></div>}
                  {booking.isOneWay && <span className="text-xs bg-mist-100 text-mist-600 px-2 py-0.5 rounded">One-way rental</span>}
                </>
              )}
              {booking.bookingType === "villa" && booking.guests && (
                <div className="text-mist-600"><span className="font-medium">Guests:</span> {booking.guests}</div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-mist-500">Document Status:</span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${docColors[booking.documentStatus || "PENDING"] || docColors.PENDING}`}>{booking.documentStatus || "Pending"}</span>
              </div>
            </div>
            )}
          </div>

          {/* Add-Ons (Car only) */}
          {booking.bookingType === "car" && (
            <div className="bg-white border border-mist-200 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-mist-900">Add-Ons</h3>
                <MoreHorizontal size={16} className="text-mist-400" />
              </div>
              <div className="space-y-2 text-sm">
                {booking.needsDriver && (
                  <div className="flex justify-between"><span className="text-mist-600">Driver Cost <span className="text-xs text-mist-400">$45/hr &times; {booking.driverHours || 6} hours</span></span><span className="font-medium">${booking.driverCost?.toLocaleString() || "0"}</span></div>
                )}
                {(booking.deliveryFee || 0) > 0 && (
                  <div className="flex justify-between"><span className="text-mist-600">Delivery Fee</span><span className="font-medium">${booking.deliveryFee?.toLocaleString()}</span></div>
                )}
                {!booking.needsDriver && !(booking.deliveryFee || 0) && <p className="text-mist-400 text-xs">No add-ons</p>}
              </div>
            </div>
          )}
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pricing */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-mist-900">Pricing</h3>
              <MoreHorizontal size={16} className="text-mist-400" />
            </div>
            <div className="space-y-2 text-sm">
              {(booking.basePrice || 0) > 0 && <div className="flex justify-between"><span className="text-mist-600">Base Price</span><span>${booking.basePrice?.toLocaleString()}</span></div>}
              {(booking.discount || 0) > 0 && <div className="flex justify-between"><span className="text-mist-600">Discount</span><span className="text-red-500">-${booking.discount?.toLocaleString()}</span></div>}
              {(booking.driverCost || 0) > 0 && <div className="flex justify-between"><span className="text-mist-600">Add-ons Price</span><span>${((booking.driverCost || 0) + (booking.deliveryFee || 0)).toLocaleString()}</span></div>}
              {(booking.tax || 0) > 0 && <div className="flex justify-between"><span className="text-mist-600">Tax</span><span>${booking.tax?.toLocaleString()}</span></div>}
              <div className="h-px bg-mist-200 my-2" />
              <div className="flex justify-between text-base font-bold"><span>Total</span><span>${booking.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-mist-900">Notes</h3>
              <MoreHorizontal size={16} className="text-mist-400" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-mist-400 mb-1">Customer Notes</p>
                <p className="text-sm text-mist-700 bg-mist-50 p-3 rounded">{booking.notes || booking.specialRequests || "No notes"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Item Image */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-3">{booking.itemName}</h3>
            {image ? (
              <img src={image} alt={booking.itemName} className="w-full h-40 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-40 bg-mist-100 rounded-lg flex items-center justify-center"><Car size={32} className="text-mist-300" /></div>
            )}
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-mist-900 font-medium">{custName}</p>
              <p className="text-mist-500">{custEmail}</p>
              {custPhone && <div className="flex items-center gap-2"><Phone size={14} className="text-mist-400" /><span className="text-mist-600">{custPhone}</span></div>}
            </div>
            {/* Status indicators */}
            <div className="mt-4 space-y-2 text-sm">
              {booking.isOneWay && <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-mist-400" /><span className="text-mist-600">One-way rental</span></div>}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${booking.documentStatus === "VERIFIED" ? "bg-green-400" : "bg-yellow-400"}`} />
                <span className="text-mist-600">{booking.documentStatus === "VERIFIED" ? "Documents Verified" : "Documents Pending"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${booking.status === "CONFIRMED" || booking.status === "ACTIVE" ? "bg-green-400" : "bg-mist-300"}`} />
                <span className="text-mist-600">{booking.status === "CONFIRMED" ? "Confirmed" : booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}</span>
              </div>
            </div>
          </div>

          {/* Payment & Contract Status */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-mist-900">Payment & Contract</h3>
              <MoreHorizontal size={16} className="text-mist-400" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-mist-500">Payment:</span>
                <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                  booking.paymentStatus === "PAID" ? "bg-green-100 text-green-700"
                  : booking.paymentStatus === "AUTHORIZED" ? "bg-blue-100 text-blue-700"
                  : booking.paymentStatus === "REFUNDED" ? "bg-mist-100 text-mist-600"
                  : "bg-yellow-100 text-yellow-700"
                }`}>
                  {booking.paymentStatus === "AUTHORIZED" ? "Authorized (Held)" : booking.paymentStatus === "PAID" ? "Paid" : booking.paymentStatus === "REFUNDED" ? "Refunded" : "Unpaid"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mist-500">Contract:</span>
                <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                  booking.contractStatus === "SIGNED" ? "bg-green-100 text-green-700"
                  : booking.contractStatus === "SENT" ? "bg-blue-100 text-blue-700"
                  : "bg-mist-100 text-mist-500"
                }`}>
                  {booking.contractStatus === "SIGNED" ? "Signed" : booking.contractStatus === "SENT" ? "Sent" : "Not Sent"}
                </span>
              </div>
              {booking.contractSentAt && (
                <p className="text-xs text-mist-400">Contract sent: {formatDate(booking.contractSentAt)}</p>
              )}
              {booking.signedContractUrl && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-semibold text-green-700 mb-1">✅ Signed Contract Received</p>
                  <a
                    href={booking.signedContractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-700 underline hover:text-green-900 break-all"
                  >
                    Download Signed Contract
                  </a>
                </div>
              )}
              {booking.paypalOrderId && (
                <p className="text-xs text-mist-400">PayPal Order: {booking.paypalOrderId.slice(0, 16)}...</p>
              )}
            </div>
          </div>

          {/* Customer Documents */}
          {booking.user && (
            <div className="bg-white border border-mist-200 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-mist-900">Customer Documents</h3>
                {booking.user.id && (
                  <a href={`/admin/customers/${booking.user.id}`} className="text-xs text-blue-600 hover:underline">View Profile</a>
                )}
              </div>
              <div className="space-y-4">
                {[
                  { label: "Driver's License", doc: parseDoc(booking.user.driverLicense), status: booking.user.driverLicenseStatus || "NONE" },
                  { label: "Insurance", doc: parseDoc(booking.user.insurance), status: booking.user.insuranceStatus || "NONE" },
                  { label: "Passport / ID", doc: parseDoc(booking.user.passport), status: booking.user.passportStatus || "NONE" },
                ].map(({ label, doc, status }) => (
                  <div key={label} className="border border-mist-100 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 border-b border-mist-100 flex items-center justify-between bg-mist-50">
                      <span className="text-xs font-semibold text-mist-600 uppercase tracking-wide">{label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${USER_DOC_STATUS_COLORS[status] ?? USER_DOC_STATUS_COLORS.NONE}`}>
                        {status === "NONE" ? "Not submitted" : status}
                      </span>
                    </div>
                    {doc?.url ? (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block bg-mist-50 p-2">
                        {doc.url.toLowerCase().endsWith(".pdf") ? (
                          <div className="flex items-center justify-center h-20">
                            <FileText size={20} className="text-blue-500 mr-2" />
                            <span className="text-xs text-blue-600 underline">View PDF</span>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={doc.url} alt={label} className="max-h-28 mx-auto object-contain rounded" />
                        )}
                      </a>
                    ) : (
                      <p className="text-xs text-mist-400 p-3 text-center">{status === "NONE" ? "Not submitted" : "No file"}</p>
                    )}
                    {doc?.number && <p className="text-[10px] text-mist-500 px-3 py-1">#{doc.number}{doc.expiry ? ` • Exp: ${doc.expiry}` : ""}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-3">Admin Notes</h3>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full bg-mist-50 border border-mist-200 text-mist-700 text-sm px-3 py-2 rounded focus:border-black focus:outline-none resize-none"
              placeholder="Enter internal notes here..."
            />
            <button onClick={saveAdminNotes} className="mt-2 text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-mist-800">Save Notes</button>
          </div>

          {/* Update Controls */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-3">Update Status</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-mist-500 block mb-1">Booking Status</label>
                <select value={booking.status} onChange={e => updateBooking("status", e.target.value)}
                  className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
                  <option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option><option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-mist-500 block mb-1">Payment Status</label>
                <select value={booking.paymentStatus} onChange={e => updateBooking("paymentStatus", e.target.value)}
                  className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
                  <option value="UNPAID">Unpaid</option><option value="AUTHORIZED">Authorized</option><option value="PAID">Paid</option><option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-mist-500 block mb-1">Document Status</label>
                <select value={booking.documentStatus || "PENDING"} onChange={e => updateBooking("documentStatus", e.target.value)}
                  className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
                  <option value="PENDING">Pending</option><option value="VERIFIED">Verified</option><option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Event Booking Detail                                               */
/* ================================================================== */

const EVENT_FLOW_STEPS = [
  { key: "pending_review", label: "Pending Review" },
  { key: "pending_partner_confirmation", label: "Sent to Partner" },
  { key: "confirmed", label: "Partner Confirmed" },
  { key: "fee_captured", label: "Fee Captured" },
  { key: "completed", label: "Completed" },
]

function getEventFlowIndex(flow: string): number {
  const idx = EVENT_FLOW_STEPS.findIndex(s => s.key === flow)
  return idx >= 0 ? idx : 0
}

const PARTNER_STATUS_COLORS: Record<string, string> = {
  none: "bg-mist-100 text-mist-500",
  waiting: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
}

function EventBookingDetail({
  booking, adminNotes, setAdminNotes, fetchBooking, id,
}: {
  booking: BookingDetail
  adminNotes: string
  setAdminNotes: (v: string) => void
  fetchBooking: () => Promise<void>
  id: string
}) {
  const [actionLoading, setActionLoading] = useState("")
  const [partnerInput, setPartnerInput] = useState(booking.partnerName || "")
  const [showMessaging, setShowMessaging] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [generatingMessage, setGeneratingMessage] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)

  const custName = booking.customerName || `${booking.firstName || ""}${booking.lastName ? ` ${booking.lastName}` : ""}`.trim() || "N/A"
  const custEmail = booking.customerEmail || booking.email || ""
  const custPhone = booking.customerPhone || booking.phone || ""
  const bNum = booking.bookingNumber || `EVT-${booking.id.slice(-4).toUpperCase()}`
  const currentFlow = booking.bookingFlow || "pending_review"
  const currentStep = getEventFlowIndex(currentFlow)
  const pStatus = booking.partnerStatus || "none"

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    COMPLETED: "bg-mist-100 text-mist-700 border-mist-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  }

  const updateEvent = async (fields: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingType: "event", ...fields }),
      })
      if (!res.ok) throw new Error()
      toast.success("Updated")
      await fetchBooking()
    } catch {
      toast.error("Failed to update")
    }
  }

  const addLogEntry = (entry: string) => {
    const ts = new Date().toISOString()
    const existing = booking.activityLog || ""
    return (existing ? existing + "\n" : "") + `[${ts}] ${entry}`
  }

  const sendToPartner = async () => {
    if (!partnerInput.trim()) { toast.error("Enter a partner name first"); return }
    setActionLoading("partner")
    await updateEvent({
      partnerName: partnerInput.trim(),
      partnerStatus: "waiting",
      bookingFlow: "pending_partner_confirmation",
      activityLog: addLogEntry(`Sent to partner: ${partnerInput.trim()}`),
    })
    setActionLoading("")
  }

  const markPartnerConfirmed = async () => {
    setActionLoading("partner_confirm")
    await updateEvent({
      partnerStatus: "confirmed",
      bookingFlow: "confirmed",
      status: "CONFIRMED",
      activityLog: addLogEntry(`Partner confirmed: ${booking.partnerName}`),
    })
    setActionLoading("")
  }

  const markPartnerDeclined = async () => {
    setActionLoading("partner_decline")
    await updateEvent({
      partnerStatus: "declined",
      bookingFlow: "pending_review",
      activityLog: addLogEntry(`Partner declined: ${booking.partnerName}`),
    })
    setActionLoading("")
  }

  const captureEventFee = async () => {
    setActionLoading("capture")
    try {
      const res = await fetch("/api/paypal/capture-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, bookingType: "event" }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to capture")
      }
      await updateEvent({
        bookingFlow: "fee_captured",
        activityLog: addLogEntry("$100 service fee captured"),
      })
      toast.success("Fee captured")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setActionLoading("")
    }
  }

  const voidEventFee = async () => {
    if (!booking.paypalAuthorizationId) { toast.error("No authorization to void"); return }
    setActionLoading("void")
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingType: "event", status: "CANCELLED" }),
      })
      if (!res.ok) throw new Error()
      await updateEvent({
        bookingFlow: "rejected",
        activityLog: addLogEntry("Authorization voided, booking cancelled"),
      })
      toast.success("Authorization voided")
    } catch {
      toast.error("Failed to void")
    } finally {
      setActionLoading("")
    }
  }

  const markCompleted = async () => {
    setActionLoading("complete")
    await updateEvent({
      status: "COMPLETED",
      bookingFlow: "completed",
      activityLog: addLogEntry("Booking marked complete"),
    })
    setActionLoading("")
  }

  const saveAdminNotes = () => updateEvent({ adminNotes })

  const generateMessage = async () => {
    setGeneratingMessage(true)
    try {
      const res = await fetch(`/api/admin/bookings/${id}/generate-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageType: "confirmation" }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed")
      const data = await res.json()
      setMessageText(data.message)
      setEmailSubject(data.emailSubject)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGeneratingMessage(false)
    }
  }

  const sendEmailToCustomer = async () => {
    if (!custEmail) { toast.error("No customer email"); return }
    setSendingEmail(true)
    try {
      const res = await fetch(`/api/admin/bookings/${id}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: custEmail, subject: emailSubject, message: messageText }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed")
      toast.success("Email sent")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSendingEmail(false)
    }
  }

  const openWhatsApp = () => {
    const phone = custPhone.replace(/[^0-9]/g, "")
    if (!phone) { toast.error("No phone number"); return }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`, "_blank")
  }

  // Parse activity log
  const logEntries = (booking.activityLog || "").split("\n").filter(Boolean).reverse()

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/bookings" className="text-mist-400 hover:text-mist-700 text-sm">&larr; Bookings</Link>
          </div>
          <h1 className="text-2xl font-bold text-mist-900">Event Booking Details</h1>
          <p className="text-sm text-mist-500">#{bNum} &middot; Created {formatDate(booking.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${statusColors[booking.status] || statusColors.PENDING}`}>
            {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
          </span>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${PARTNER_STATUS_COLORS[pStatus]}`}>
            Partner: {pStatus.charAt(0).toUpperCase() + pStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Flow Stepper */}
      {booking.status !== "CANCELLED" && (
        <div className="bg-white border border-mist-200 rounded-xl p-4 sm:p-5 mb-6 overflow-x-auto">
          <h3 className="text-sm font-semibold text-mist-700 mb-4">Booking Flow</h3>
          <div className="flex items-center gap-0 min-w-[500px]">
            {EVENT_FLOW_STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${i <= currentStep ? "bg-emerald-500 text-white" : "bg-mist-200 text-mist-400"}`}>
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] mt-1.5 text-center leading-tight ${i <= currentStep ? "text-emerald-600 font-medium" : "text-mist-400"}`}>
                    {step.label}
                  </span>
                </div>
                {i < EVENT_FLOW_STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-4 ${i < currentStep ? "bg-emerald-400" : "bg-mist-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        {currentFlow === "pending_review" && (
          <button
            onClick={sendToPartner}
            disabled={actionLoading === "partner" || !partnerInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded disabled:opacity-50"
          >
            {actionLoading === "partner" ? "Sending..." : "Send to Partner"}
          </button>
        )}
        {pStatus === "waiting" && (
          <>
            <button
              onClick={markPartnerConfirmed}
              disabled={actionLoading === "partner_confirm"}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded disabled:opacity-50"
            >
              {actionLoading === "partner_confirm" ? "..." : "✓ Partner Confirmed"}
            </button>
            <button
              onClick={markPartnerDeclined}
              disabled={actionLoading === "partner_decline"}
              className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded border border-red-200 disabled:opacity-50"
            >
              {actionLoading === "partner_decline" ? "..." : "✗ Partner Declined"}
            </button>
          </>
        )}
        {(currentFlow === "confirmed" || (currentFlow === "fee_captured" && booking.paymentStatus !== "PAID")) && booking.paymentStatus === "AUTHORIZED" && (
          <button
            onClick={captureEventFee}
            disabled={actionLoading === "capture"}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded disabled:opacity-50"
          >
            {actionLoading === "capture" ? "Capturing..." : "$ Capture $100 Fee"}
          </button>
        )}
        {booking.paymentStatus === "AUTHORIZED" && booking.status !== "CANCELLED" && (
          <button
            onClick={voidEventFee}
            disabled={actionLoading === "void"}
            className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded border border-red-200 disabled:opacity-50"
          >
            {actionLoading === "void" ? "Voiding..." : "Void Authorization"}
          </button>
        )}
        {(currentFlow === "fee_captured" || (booking.paymentStatus === "PAID" && currentFlow !== "completed")) && (
          <button
            onClick={markCompleted}
            disabled={actionLoading === "complete"}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded disabled:opacity-50"
          >
            {actionLoading === "complete" ? "..." : "✓ Mark Completed"}
          </button>
        )}
        {booking.status !== "CANCELLED" && currentFlow !== "completed" && (
          <button
            onClick={() => updateEvent({ status: "CANCELLED", bookingFlow: "rejected", activityLog: addLogEntry("Booking cancelled by admin") })}
            className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded border border-red-200"
          >
            Cancel Booking
          </button>
        )}
        <button
          onClick={() => { setShowMessaging(!showMessaging); if (!showMessaging && !messageText) generateMessage() }}
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-2 rounded border border-emerald-200 flex items-center gap-2"
        >
          <MessageSquare size={14} /> Send Message
        </button>
      </div>

      {/* Messaging Panel */}
      {showMessaging && (
        <div className="bg-white border border-mist-200 rounded-xl p-4 sm:p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-mist-900 flex items-center gap-2"><MessageSquare size={16} /> Message Customer</h3>
            <button onClick={() => setShowMessaging(false)} className="text-mist-400 hover:text-mist-600"><X size={18} /></button>
          </div>
          <button
            onClick={generateMessage}
            disabled={generatingMessage}
            className="text-xs font-medium px-4 py-2 rounded bg-mist-900 text-white hover:bg-mist-800 disabled:opacity-40 mb-4"
          >
            {generatingMessage ? "Generating with AI..." : "✨ Generate Message"}
          </button>
          {messageText && (
            <div className="mb-3">
              <label className="text-xs text-mist-500 block mb-1">Email Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
                className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="text-xs text-mist-500 block mb-1">Message</label>
            <textarea
              rows={6}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder={generatingMessage ? "Generating..." : "Type or generate a message..."}
              className="w-full bg-mist-50 border border-mist-200 text-sm text-mist-700 px-3 py-3 rounded focus:border-black focus:outline-none resize-y"
            />
          </div>
          {messageText && (
            <div className="flex flex-wrap gap-3">
              <button onClick={sendEmailToCustomer} disabled={sendingEmail}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                <Mail size={14} /> {sendingEmail ? "Sending..." : "Send via Email"}
              </button>
              <button onClick={openWhatsApp}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded bg-green-600 hover:bg-green-700 text-white">
                <Send size={14} /> Send via WhatsApp
              </button>
              <span className="text-xs text-mist-400 self-center">To: {custEmail} / {custPhone || "—"}</span>
            </div>
          )}
        </div>
      )}

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Customer + Booking Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-4">Customer Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><User size={16} className="text-mist-400" /><span className="text-sm text-mist-900 font-medium">{custName}</span></div>
              <div className="flex items-center gap-3"><Mail size={16} className="text-mist-400" /><span className="text-sm text-mist-600">{custEmail}</span></div>
              {custPhone && <div className="flex items-center gap-3"><Phone size={16} className="text-mist-400" /><span className="text-sm text-mist-600">{custPhone}</span></div>}
            </div>
          </div>

          {/* Booking Info */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-4">Booking Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-mist-500">Type:</span>
                <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-xs font-medium">Event</span>
              </div>
              <p className="font-medium text-mist-900">{booking.itemName}</p>
              <p className="text-mist-500">#{bNum}</p>
              <div className="flex items-center gap-2"><Calendar size={14} className="text-mist-400" /><span className="text-mist-700">Event Date: {formatDate(booking.startDate)}</span></div>
              {booking.guestsTotal && <div className="text-mist-600"><span className="font-medium">Total Guests:</span> {booking.guestsTotal}</div>}
              {booking.clubVenue && <div className="text-mist-600"><span className="font-medium">Club/Venue:</span> {booking.clubVenue}</div>}
              {booking.budget && <div className="text-mist-600"><span className="font-medium">Budget:</span> {booking.budget}</div>}
              {booking.addOns && <div className="text-mist-600"><span className="font-medium">Add-Ons:</span> {booking.addOns}</div>}
              {(booking.specialRequests || booking.notes) && (
                <div>
                  <p className="font-medium text-mist-600 mb-1">Special Requests:</p>
                  <p className="text-mist-500 bg-mist-50 p-3 rounded text-xs">{booking.specialRequests || booking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Partner + Fee + Admin Notes */}
        <div className="space-y-6">
          {/* Partner Info */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-4">Partner Management</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-mist-500 block mb-1">Partner / Vendor Name</label>
                <input
                  type="text"
                  value={partnerInput}
                  onChange={e => setPartnerInput(e.target.value)}
                  placeholder="e.g. DJ Mike, Catering Co..."
                  className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-mist-500">Status:</span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${PARTNER_STATUS_COLORS[pStatus]}`}>
                  {pStatus.charAt(0).toUpperCase() + pStatus.slice(1)}
                </span>
              </div>
              {booking.partnerName && booking.partnerName !== partnerInput && (
                <button
                  onClick={() => updateEvent({ partnerName: partnerInput.trim() })}
                  className="text-xs bg-mist-900 text-white px-3 py-1.5 rounded hover:bg-mist-800"
                >
                  Update Partner Name
                </button>
              )}
            </div>
          </div>

          {/* Service Fee */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-4">Service Fee</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-mist-600">Event Service Fee</span>
                <span className="font-semibold text-mist-900">$100.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mist-500">Payment:</span>
                <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                  booking.paymentStatus === "PAID" ? "bg-green-100 text-green-700"
                  : booking.paymentStatus === "AUTHORIZED" ? "bg-blue-100 text-blue-700"
                  : booking.paymentStatus === "REFUNDED" ? "bg-mist-100 text-mist-600"
                  : "bg-yellow-100 text-yellow-700"
                }`}>
                  {booking.paymentStatus === "AUTHORIZED" ? "Authorized (Held)"
                    : booking.paymentStatus === "PAID" ? "Captured"
                    : booking.paymentStatus === "REFUNDED" ? "Refunded"
                    : "Unpaid"}
                </span>
              </div>
              {booking.paypalOrderId && (
                <p className="text-xs text-mist-400">PayPal: {booking.paypalOrderId.slice(0, 20)}...</p>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-3">Admin Notes</h3>
            <textarea
              rows={4}
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              className="w-full bg-mist-50 border border-mist-200 text-mist-700 text-sm px-3 py-2 rounded focus:border-black focus:outline-none resize-none"
              placeholder="Internal notes..."
            />
            <button onClick={saveAdminNotes} className="mt-2 text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-mist-800">Save Notes</button>
          </div>

          {/* Update Controls */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-3">Manual Overrides</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-mist-500 block mb-1">Booking Status</label>
                <select value={booking.status} onChange={e => updateEvent({ status: e.target.value })}
                  className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-mist-500 block mb-1">Payment Status</label>
                <select value={booking.paymentStatus} onChange={e => updateEvent({ paymentStatus: e.target.value })}
                  className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
                  <option value="UNPAID">Unpaid</option>
                  <option value="AUTHORIZED">Authorized</option>
                  <option value="PAID">Paid</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-mist-500 block mb-1">Booking Flow</label>
                <select value={currentFlow} onChange={e => updateEvent({ bookingFlow: e.target.value })}
                  className="w-full bg-white border border-mist-200 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
                  <option value="pending_review">Pending Review</option>
                  <option value="pending_partner_confirmation">Pending Partner Confirmation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="fee_captured">Fee Captured</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Service Fee Summary + Activity Log */}
        <div className="space-y-6">
          {/* Quick Summary Card */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-mist-500">Event</span><span className="font-medium text-mist-900">{booking.itemName}</span></div>
              <div className="flex justify-between"><span className="text-mist-500">Customer</span><span className="font-medium text-mist-900">{custName}</span></div>
              <div className="flex justify-between"><span className="text-mist-500">Date</span><span className="text-mist-700">{formatDate(booking.startDate)}</span></div>
              {booking.guestsTotal && <div className="flex justify-between"><span className="text-mist-500">Guests</span><span className="text-mist-700">{booking.guestsTotal}</span></div>}
              <hr className="border-mist-100" />
              <div className="flex justify-between font-bold text-base">
                <span>Service Fee</span>
                <span>${(booking.totalPrice || 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <h3 className="font-semibold text-mist-900 mb-4">Activity Log</h3>
            {logEntries.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {logEntries.map((entry, i) => {
                  const match = entry.match(/^\[(.+?)\]\s(.+)$/)
                  const ts = match ? new Date(match[1]).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : ""
                  const msg = match ? match[2] : entry
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        {i < logEntries.length - 1 && <div className="w-px flex-1 bg-mist-200 mt-1" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm text-mist-700">{msg}</p>
                        {ts && <p className="text-[10px] text-mist-400">{ts}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-mist-400">No activity recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
