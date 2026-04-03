"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { Search, Car, Home, PartyPopper, Plus, Globe, UserPlus, Eye } from "lucide-react"

interface Booking {
  id: string
  bookingNumber?: string
  bookingType: string
  itemName: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  paymentStatus: string
  documentStatus?: string
  source?: string
  notes: string | null
  customerName: string | null
  customerEmail: string
  customerPhone: string | null
}

const typeIcon = (t: string) => {
  if (t === "car") return <Car size={14} />
  if (t === "villa") return <Home size={14} />
  return <PartyPopper size={14} />
}

const typeColors: Record<string, string> = {
  car: "bg-blue-50 text-blue-600",
  villa: "bg-purple-50 text-purple-600",
  event: "bg-orange-50 text-orange-600",
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-600",
  CONFIRMED: "bg-blue-50 text-blue-600",
  ACTIVE: "bg-green-50 text-green-600",
  COMPLETED: "bg-mist-100 text-mist-600",
  CANCELLED: "bg-red-50 text-red-600",
  CONTRACT_SENT: "bg-indigo-50 text-indigo-600",
}

const payColors: Record<string, string> = {
  PAID: "bg-green-50 text-green-600",
  AUTHORIZED: "bg-green-50 text-green-600",
  REFUNDED: "bg-purple-50 text-purple-600",
  UNPAID: "bg-yellow-50 text-yellow-600",
}

const docColors: Record<string, string> = {
  VERIFIED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-600",
  PENDING: "bg-yellow-50 text-yellow-600",
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [payFilter, setPayFilter] = useState("All Payments")

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then(r => r.ok ? r.json() : [])
      .then(setBookings)
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false))
  }, [])

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const label = (s: string) => s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ") : "N/A"

  const filtered = bookings.filter(b => {
    if (statusFilter !== "All Statuses" && b.status !== statusFilter.toUpperCase()) return false
    if (typeFilter !== "All Types" && b.bookingType !== typeFilter.toLowerCase()) return false
    if (payFilter !== "All Payments" && b.paymentStatus !== payFilter.toUpperCase()) return false
    if (search) {
      const q = search.toLowerCase()
      const match = (b.customerName?.toLowerCase().includes(q)) ||
        b.customerEmail.toLowerCase().includes(q) ||
        (b.bookingNumber?.toLowerCase().includes(q)) ||
        b.itemName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-mist-900">Manage Bookings</h1>
        <Link href="/admin/bookings/new" className="flex items-center gap-2 bg-black text-white text-sm px-4 py-2.5 rounded-lg hover:bg-mist-800 transition-colors">
          <Plus size={14} /> Create Booking
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
          <input type="text" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-mist-200 rounded-lg text-sm text-mist-900 placeholder:text-mist-400 outline-none focus:border-black transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-lg focus:border-black outline-none">
            <option>All Types</option><option>Car</option><option>Villa</option><option>Event</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-lg focus:border-black outline-none">
            <option>All Statuses</option><option>Pending</option><option>Confirmed</option><option>Active</option><option>Completed</option><option>Cancelled</option>
          </select>
          <select value={payFilter} onChange={e => setPayFilter(e.target.value)}
            className="bg-white border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-lg focus:border-black outline-none">
            <option>All Payments</option><option>Unpaid</option><option>Paid</option><option>Authorized</option><option>Refunded</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-mist-100 rounded-xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-mist-400 text-sm">No bookings found</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border border-mist-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-mist-500 border-b border-mist-200 bg-mist-50/50">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Docs</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-b border-mist-100 hover:bg-mist-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-medium text-mist-900">{(b.bookingNumber || b.id).slice(0, 8)}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-mist-900 font-medium">{b.customerName || "N/A"}</p>
                      <p className="text-xs text-mist-400">{b.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded font-medium ${typeColors[b.bookingType] || "bg-mist-100 text-mist-600"}`}>
                        {typeIcon(b.bookingType)} {b.bookingType.charAt(0).toUpperCase() + b.bookingType.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-mist-600 max-w-[160px] truncate">{b.itemName}</td>
                    <td className="px-4 py-3.5 text-xs text-mist-500">{fmt(b.startDate)}<br/>{fmt(b.endDate) !== fmt(b.startDate) && <span>– {fmt(b.endDate)}</span>}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-mist-900">${b.totalPrice?.toLocaleString() || "0"}</td>
                    <td className="px-4 py-3.5"><span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[b.status] || "bg-mist-100 text-mist-600"}`}>{label(b.status)}</span></td>
                    <td className="px-4 py-3.5"><span className={`text-xs px-2 py-1 rounded font-medium ${docColors[b.documentStatus || "PENDING"]}`}>{label(b.documentStatus || "PENDING")}</span></td>
                    <td className="px-4 py-3.5"><span className={`text-xs px-2 py-1 rounded font-medium ${payColors[b.paymentStatus] || "bg-mist-100 text-mist-600"}`}>{label(b.paymentStatus)}</span></td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-medium ${b.source === "manual" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}>
                        {b.source === "manual" ? <><UserPlus size={11} /> Manual</> : <><Globe size={11} /> Website</>}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/bookings/${b.id}`} className="inline-flex items-center gap-1 text-xs text-mist-600 hover:text-black font-medium"><Eye size={13} /> View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet View */}
          <div className="hidden sm:block lg:hidden bg-white border border-mist-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-mist-500 border-b border-mist-200 bg-mist-50/50">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-b border-mist-100 hover:bg-mist-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm text-mist-900 font-medium">{b.customerName || "N/A"}</p>
                      <p className="text-xs text-mist-400">{b.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${typeColors[b.bookingType]}`}>
                        {typeIcon(b.bookingType)} {b.bookingType.charAt(0).toUpperCase() + b.bookingType.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-mist-600 max-w-[120px] truncate">{b.itemName}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-mist-900">${b.totalPrice?.toLocaleString() || "0"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[b.status]}`}>{label(b.status)}</span></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${b.source === "manual" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}>
                        {b.source === "manual" ? <><UserPlus size={10} /> Manual</> : <><Globe size={10} /> Website</>}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Link href={`/admin/bookings/${b.id}`} className="text-xs text-mist-600 hover:text-black font-medium">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map(b => (
              <Link key={b.id} href={`/admin/bookings/${b.id}`} className="block bg-white border border-mist-200 rounded-xl p-4 hover:border-mist-400 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-mist-900">{b.customerName || "N/A"}</p>
                    <p className="text-xs text-mist-400">{b.customerEmail}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${typeColors[b.bookingType]}`}>
                    {typeIcon(b.bookingType)} {b.bookingType.charAt(0).toUpperCase() + b.bookingType.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-mist-600 mb-2">{b.itemName}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-mist-500">{fmt(b.startDate)}{fmt(b.endDate) !== fmt(b.startDate) ? ` – ${fmt(b.endDate)}` : ""}</span>
                  <span className="font-semibold text-mist-900">${b.totalPrice?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusColors[b.status]}`}>{label(b.status)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${payColors[b.paymentStatus]}`}>{label(b.paymentStatus)}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${b.source === "manual" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}>
                    {b.source === "manual" ? "Manual" : "Website"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
