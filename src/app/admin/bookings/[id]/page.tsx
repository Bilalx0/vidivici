"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { Calendar, Phone, User, Mail, MapPin, Car, FileText, MoreHorizontal, AlertTriangle } from "lucide-react"

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
  guestsTotal?: string
  budget?: string
  clubVenue?: string
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
        <div className="bg-white border border-mist-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-mist-700 mb-4">Booking Flow</h3>
          <div className="flex items-center gap-0">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${i <= currentStep ? "bg-emerald-500 text-white" : "bg-mist-200 text-mist-400"}`}>
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1.5 text-center leading-tight ${i <= currentStep ? "text-emerald-600 font-medium" : "text-mist-400"}`}>
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
      <div className="flex flex-wrap gap-3 mb-8">
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
      </div>

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
          {/* Booking Info (Center) */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-mist-900">Booking Info <span className="text-mist-400 font-normal text-sm">#{bNum}</span></h3>
              <MoreHorizontal size={16} className="text-mist-400" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-mist-500">Type:</span><span className="font-medium text-mist-900">{typeBadge}</span></div>
              <p className="font-medium text-mist-900">{booking.itemName}</p>
              <div className="flex items-center gap-2"><Calendar size={14} className="text-mist-400" /><span>{formatDate(booking.startDate)} {formatTime(booking.startTime)}</span></div>
              <div className="flex items-center gap-2"><Calendar size={14} className="text-mist-400" /><span>{formatDate(booking.endDate)} {formatTime(booking.endTime)}</span></div>
            </div>
          </div>

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
