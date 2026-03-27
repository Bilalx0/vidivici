"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Car, CalendarDays, DollarSign, Key } from "lucide-react"

interface Booking {
  id: string
  totalPrice: number
  status: string
  startDate: string
  car: { name: string; brand: { name: string } }
  user: { name: string | null; email: string }
}

export default function AdminDashboard() {
  const [totalCars, setTotalCars] = useState(0)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, bookingsRes] = await Promise.all([
          fetch("/api/cars?limit=1"),
          fetch("/api/bookings"),
        ])
        if (carsRes.ok) {
          const carsData = await carsRes.json()
          setTotalCars(carsData.total || 0)
        }
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setBookings(bookingsData)
        }
      } catch {
        // silently fail, show zeros
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalBookings = bookings.length
  const revenue = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalPrice, 0)
  const activeRentals = bookings.filter((b) => b.status === "ACTIVE").length
  const recentBookings = bookings.slice(0, 5)

  const stats = [
    { label: "Total Cars", value: loading ? "..." : String(totalCars), change: "", icon: Car },
    { label: "Total Bookings", value: loading ? "..." : String(totalBookings), change: "", icon: CalendarDays },
    { label: "Revenue", value: loading ? "..." : `$${revenue.toLocaleString()}`, change: "", icon: DollarSign },
    { label: "Active Rentals", value: loading ? "..." : String(activeRentals), change: "Currently out", icon: Key },
  ]

  const displayStatus = (status: string) => status.charAt(0) + status.slice(1).toLowerCase()

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-CA")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon size={18} className="text-gray-600" />
                </div>
                <span className="text-xs text-gray-400">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 mb-10">
        <Link href="/admin/cars/new" className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">+ Add Car</Link>
        <Link href="/admin/messages" className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm hover:border-gray-400 transition-colors">View Messages</Link>
        <Link href="/admin/blog/new" className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm hover:border-gray-400 transition-colors">New Blog Post</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Car</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">Loading...</td></tr>
              ) : recentBookings.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No bookings yet</td></tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{b.user.name || b.user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.car.brand.name} {b.car.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(b.startDate)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${b.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        b.status === "CONFIRMED" ? "bg-blue-50 text-blue-600" :
                        b.status === "ACTIVE" ? "bg-green-50 text-green-600" :
                        b.status === "COMPLETED" ? "bg-gray-100 text-gray-600" :
                        b.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                        "bg-yellow-50 text-yellow-600"
                      }`}>{displayStatus(b.status)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
