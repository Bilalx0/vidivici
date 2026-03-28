"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, MapPin, ImageOff } from "lucide-react"

const TABS = ["All", "Upcoming", "Ongoing", "Completed", "Cancelled"]

interface BookingData {
  id: string
  startDate: string
  endDate: string
  pickupLocation: string
  totalPrice: number
  status: string
  car: {
    name: string
    slug: string
    brand: { name: string }
    images: { url: string }[]
  }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [activeTab, setActiveTab] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings")
      if (res.ok) {
        setBookings(await res.json())
      }
    } catch {} finally {
      setLoading(false)
    }
  }

  const statusMap: Record<string, string> = {
    PENDING: "Upcoming",
    CONFIRMED: "Upcoming",
    ACTIVE: "Ongoing",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  }

  const filtered = activeTab === "All"
    ? bookings
    : bookings.filter((b) => statusMap[b.status] === activeTab)

  const statusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-50 text-green-700"
      case "PENDING": return "bg-yellow-50 text-yellow-700"
      case "ACTIVE": return "bg-blue-50 text-blue-700"
      case "COMPLETED": return "bg-gray-100 text-mist-600"
      case "CANCELLED": return "bg-red-50 text-red-600"
      default: return "bg-gray-100 text-mist-600"
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-mist-900 mb-6">My Bookings</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
              activeTab === tab
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-mist-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-mist-400">
          <CalendarEmpty />
          <p className="mt-4 text-lg font-medium text-mist-500">No bookings found</p>
          <p className="text-sm">Your {activeTab !== "All" ? activeTab.toLowerCase() : ""} bookings will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const img = booking.car.images?.[0]?.url
            return (
              <div key={booking.id} className="border border-gray-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
                {/* Car badge */}
                <div className="relative w-full sm:w-44 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">Car</span>
                  {img ? (
                    <Image src={img} alt={booking.car.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-mist-300">
                      <ImageOff size={32} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-mist-400">{booking.car.brand.name}</p>
                    <p className="font-bold text-mist-900 text-lg">{booking.car.name}</p>
                    <p className="text-xs text-mist-400 mt-1">Booking ID: VV-{booking.id.slice(-8).toUpperCase()}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-mist-500">
                      <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(booking.startDate)}–{formatDate(booking.endDate)}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} />{booking.pickupLocation}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(booking.status)}`}>
                      {booking.status === "CONFIRMED" ? "Confirmed" : booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                    </span>
                    <p className="text-xl font-bold text-mist-900">${booking.totalPrice}<span className="text-xs font-normal text-mist-400"> /day</span></p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CalendarEmpty() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto text-mist-300">
      <rect x="6" y="10" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6 18H42" stroke="currentColor" strokeWidth="2" />
      <path d="M16 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
