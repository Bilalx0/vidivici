"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import toast from "react-hot-toast"

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
  notes: string | null
  customerName: string | null
  customerEmail: string
  customerPhone: string | null
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [typeFilter, setTypeFilter] = useState("All Types")

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBookings(data)
    } catch {
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const display = (s: string) => s ? s.charAt(0) + s.slice(1).toLowerCase() : "N/A"

  const filtered = bookings.filter(b => {
    if (statusFilter !== "All Statuses" && b.status !== statusFilter.toUpperCase()) return false
    if (typeFilter !== "All Types" && b.bookingType !== typeFilter.toLowerCase()) return false
    return true
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Bookings</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/admin/bookings/new" className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-mist-800 transition-colors">
            + Add Booking
          </Link>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-mist-200 text-mist-900 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
            <option>All Types</option><option>Car</option><option>Villa</option><option>Event</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-mist-200 text-mist-900 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
            <option>All Statuses</option><option>Pending</option><option>Confirmed</option><option>Active</option><option>Completed</option><option>Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading bookings...</div>
      ) : (
        <div className="bg-white border border-mist-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-mist-500 border-b border-mist-200">
                  <th className="px-3 sm:px-6 py-3 hidden sm:table-cell">ID</th>
                  <th className="px-3 sm:px-6 py-3">Type</th>
                  <th className="px-3 sm:px-6 py-3">Customer</th>
                  <th className="px-3 sm:px-6 py-3 hidden md:table-cell">Item</th>
                  <th className="px-3 sm:px-6 py-3 hidden lg:table-cell">Dates</th>
                  <th className="px-3 sm:px-6 py-3">Total</th>
                  <th className="px-3 sm:px-6 py-3">Status</th>
                  <th className="px-3 sm:px-6 py-3 hidden lg:table-cell">Docs</th>
                  <th className="px-3 sm:px-6 py-3 hidden md:table-cell">Payment</th>
                  <th className="px-3 sm:px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-b border-mist-100 hover:bg-mist-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-mist-900 hidden sm:table-cell">{(b.bookingNumber || b.id).slice(0, 8)}</td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        b.bookingType === "car" ? "bg-blue-50 text-blue-600" :
                        b.bookingType === "villa" ? "bg-purple-50 text-purple-600" :
                        "bg-orange-50 text-orange-600"
                      }`}>{b.bookingType.charAt(0).toUpperCase() + b.bookingType.slice(1)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4"><p className="text-sm text-mist-900">{b.customerName || "N/A"}</p><p className="text-xs text-mist-400 hidden sm:block">{b.customerEmail}</p></td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-mist-600 hidden md:table-cell">{b.itemName}</td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-mist-500 hidden lg:table-cell">{formatDate(b.startDate)} - {formatDate(b.endDate)}</td>
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-mist-900">${b.totalPrice?.toLocaleString() || "0"}</td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        b.status === "CONFIRMED" ? "bg-blue-50 text-blue-600" :
                        b.status === "ACTIVE" ? "bg-green-50 text-green-600" :
                        b.status === "COMPLETED" ? "bg-mist-100 text-mist-600" :
                        b.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                        "bg-yellow-50 text-yellow-600"
                      }`}>{display(b.status)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                      <span className={`text-xs px-2 py-1 rounded ${
                        b.documentStatus === "VERIFIED" ? "bg-green-50 text-green-600" :
                        b.documentStatus === "REJECTED" ? "bg-red-50 text-red-600" :
                        "bg-yellow-50 text-yellow-600"
                      }`}>{display(b.documentStatus || "PENDING")}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                      <span className={`text-xs px-2 py-1 rounded ${
                        b.paymentStatus === "PAID" ? "bg-green-50 text-green-600" :
                        b.paymentStatus === "REFUNDED" ? "bg-purple-50 text-purple-600" :
                        "bg-yellow-50 text-yellow-600"
                      }`}>{display(b.paymentStatus)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <Link href={`/admin/bookings/${b.id}`} className="text-xs text-black font-medium hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="px-6 py-12 text-center text-mist-400">No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
