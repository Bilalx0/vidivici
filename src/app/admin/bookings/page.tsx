"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface Booking {
  id: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  paymentStatus: string
  notes: string | null
  pickupLocation: string
  dropoffLocation: string
  car: { name: string; brand: { name: string } }
  user: { name: string | null; email: string; phone: string | null }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setBookings(data)
    } catch {
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update")
      toast.success(`Status updated to ${status}`)
      fetchBookings()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const filteredBookings = statusFilter === "All Statuses"
    ? bookings
    : bookings.filter((b) => b.status === statusFilter.toUpperCase())

  const displayStatus = (status: string) => status.charAt(0) + status.slice(1).toLowerCase()
  const displayPayment = (status: string) => status.charAt(0) + status.slice(1).toLowerCase()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Bookings</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 text-mist-900 text-sm px-3 py-2 rounded focus:border-black focus:outline-none"
        >
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading bookings...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-mist-500 border-b border-gray-200">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Car</th>
                  <th className="px-6 py-3">Dates</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <>
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-mist-900">{b.id.slice(0, 8)}</td>
                      <td className="px-6 py-4"><p className="text-sm text-mist-900">{b.user.name || "N/A"}</p><p className="text-xs text-mist-400">{b.user.email}</p></td>
                      <td className="px-6 py-4 text-sm text-mist-600">{b.car.brand.name} {b.car.name}</td>
                      <td className="px-6 py-4 text-sm text-mist-500">{formatDate(b.startDate)} - {formatDate(b.endDate)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-mist-900">${b.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          b.status === "CONFIRMED" ? "bg-blue-50 text-blue-600" :
                          b.status === "ACTIVE" ? "bg-green-50 text-green-600" :
                          b.status === "COMPLETED" ? "bg-gray-100 text-mist-600" :
                          b.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                          "bg-yellow-50 text-yellow-600"
                        }`}>{displayStatus(b.status)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          b.paymentStatus === "PAID" ? "bg-green-50 text-green-600" :
                          b.paymentStatus === "REFUNDED" ? "bg-purple-50 text-purple-600" :
                          "bg-yellow-50 text-yellow-600"
                        }`}>{displayPayment(b.paymentStatus)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setExpandedId(expandedId === b.id ? null : b.id)} className="text-xs text-black font-medium hover:underline">View</button>
                      </td>
                    </tr>
                    {expandedId === b.id && (
                      <tr key={`${b.id}-details`} className="border-b border-gray-100 bg-gray-50">
                        <td colSpan={8} className="px-6 py-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div><span className="text-mist-400 text-xs">Pickup</span><p className="text-mist-900">{b.pickupLocation}</p></div>
                              <div><span className="text-mist-400 text-xs">Dropoff</span><p className="text-mist-900">{b.dropoffLocation}</p></div>
                              <div><span className="text-mist-400 text-xs">Phone</span><p className="text-mist-900">{b.user.phone || "N/A"}</p></div>
                              <div><span className="text-mist-400 text-xs">Notes</span><p className="text-mist-900">{b.notes || "None"}</p></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-mist-500">Update Status:</span>
                              <select
                                value={b.status}
                                onChange={(e) => updateStatus(b.id, e.target.value)}
                                className="text-xs border border-gray-200 rounded px-2 py-1 focus:border-black focus:outline-none"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
