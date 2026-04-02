"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { Calendar, Phone, User, Mail, MapPin, Car, FileText, MoreHorizontal } from "lucide-react"

interface BookingDetail {
  id: string
  bookingNumber?: string
  bookingType: string
  itemName: string
  status: string
  paymentStatus: string
  documentStatus?: string
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
  // Car specific
  car?: { name: string; brand: { name: string }; images?: { url: string }[] }
  // Villa specific
  villa?: { name: string; images?: { url: string }[] }
  // Event specific
  event?: { name: string } | null
  // Customer
  user?: { name: string | null; email: string; phone: string | null }
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  // Event fields
  guestsTotal?: string
  budget?: string
  clubVenue?: string
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminNotes, setAdminNotes] = useState("")

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
      toast.success(`${field === "status" ? "Status" : field === "paymentStatus" ? "Payment" : field === "documentStatus" ? "Document status" : "Notes"} updated`)
      fetchBooking()
    } catch {
      toast.error("Failed to update")
    }
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
            <Link href="/admin/bookings" className="text-mist-400 hover:text-mist-700 text-sm">← Bookings</Link>
          </div>
          <h1 className="text-2xl font-bold text-mist-900">Booking Details</h1>
          <p className="text-sm text-mist-500">#{bNum} · Booking ID: {booking.id.slice(0, 16)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-3 py-1.5 rounded-full border font-medium ${statusColors[booking.status] || statusColors.PENDING}`}>
            Status: {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
          </span>
          <span className="text-xs text-mist-400">Created {formatDate(booking.createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => updateBooking("documentStatus", "VERIFIED")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-2">
          ✓ Verify Documents
        </button>
        <button disabled className="bg-mist-200 text-mist-500 text-sm font-medium px-4 py-2 rounded flex items-center gap-2 cursor-not-allowed">
          📄 Send Contract
        </button>
        <button disabled className="bg-mist-200 text-mist-500 text-sm font-medium px-4 py-2 rounded flex items-center gap-2 cursor-not-allowed">
          $ Capture Payment
        </button>
        <button onClick={() => updateBooking("status", "CANCELLED")} className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded border border-red-200 flex items-center gap-2">
          Cancel Booking
        </button>
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
                  <div className="flex justify-between"><span className="text-mist-600">Driver Cost <span className="text-xs text-mist-400">$45/hr × {booking.driverHours || 6} hours</span></span><span className="font-medium">${booking.driverCost?.toLocaleString() || "0"}</span></div>
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
                <span className="text-mist-600">{booking.documentStatus === "VERIFIED" ? "Verified" : "Pending Verification"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${booking.status === "CONFIRMED" ? "bg-green-400" : "bg-mist-300"}`} />
                <span className="text-mist-600">{booking.status === "CONFIRMED" ? "Confirmed" : booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}</span>
              </div>
            </div>
          </div>

          {/* Payment & Status Controls */}
          <div className="bg-white border border-mist-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-mist-900">Payment</h3>
              <MoreHorizontal size={16} className="text-mist-400" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-mist-500">Payment Status:</span>
                <span className="font-medium">{booking.paymentStatus === "PAID" ? "Paid" : booking.paymentStatus === "REFUNDED" ? "Refunded" : "Not Sent"}</span>
              </div>
              <div className="flex gap-2">
                <button disabled className="flex-1 bg-mist-100 text-mist-500 text-xs py-2 rounded font-medium cursor-not-allowed">Create Contract</button>
                <button disabled className="flex-1 bg-mist-100 text-mist-500 text-xs py-2 rounded font-medium cursor-not-allowed">View Contract</button>
              </div>
            </div>
          </div>

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
                  <option value="UNPAID">Unpaid</option><option value="PAID">Paid</option><option value="REFUNDED">Refunded</option>
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
