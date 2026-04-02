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
  paymentStatus: string
  contractStatus?: string
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
      if (res.ok) setBookings(await res.json())
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
      case "CONFIRMED":  return "bg-green-50 text-green-600"
      case "PENDING":    return "bg-yellow-50 text-yellow-600"
      case "ACTIVE":     return "bg-blue-50 text-blue-600"
      case "COMPLETED":  return "bg-mist-100 text-mist-500"
      case "CANCELLED":  return "bg-red-50 text-red-500"
      default:           return "bg-mist-100 text-mist-500"
    }
  }

  const statusLabel = (status: string) => {
    if (status === "CONFIRMED") return "Confirmed"
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="overflow-hidden">

      {/* ── Heading ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 2xl:px-10 py-10 sm:py-12 2xl:py-16 border-b-2 border-mist-300 font-medium flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900">My Bookings</h1>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="py-10 sm:py-12 2xl:py-16 px-4 sm:px-6 lg:px-10 2xl:px-14">

       

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-mist-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (

          /* ── Empty state matching the design ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-bold text-mist-500 mb-2">
              You don&apos;t have any bookings yet
            </p>
            <p className="text-sm text-mist-500 mb-6">
              Start exploring our premium cars, villas, and events.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Explore Cars", "Explore Villas", "Explore Events"].map((label) => (
                <button
                  key={label}
                  className="px-5 py-2 rounded-full text-sm font-medium text-mist-500 bg-white border border-mist-200 hover:border-mist-400 hover:text-mist-900 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        ) : (
          <div className="space-y-5 2xl:space-y-7">
             {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeTab === tab
                  ? "bg-mist-500 text-white"
                  : "bg-white text-mist-600 border-mist-200 hover:border-mist-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
            {filtered.map((booking) => {
              const img = booking.car.images?.[0]?.url
              const isConfirmed = booking.status === "CONFIRMED"

              return (
                <div key={booking.id} className="border border-mist-200 rounded-2xl overflow-hidden">

                  {/* ── Top: car info row ── */}
                  <div className="flex flex-col sm:flex-row gap-0">

                    {/* Image */}
                    <div className="relative w-full sm:w-52 2xl:w-64 h-44 sm:h-auto flex-shrink-0 bg-mist-100">
                      {/* Orange "Car" badge */}
                      <span className="absolute top-3 left-3 z-10 bg-orange-400 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        Car
                      </span>
                      {img ? (
                        <Image src={img} alt={booking.car.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-mist-300">
                          <ImageOff size={32} />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 sm:p-6 2xl:p-8">

                      {/* Left: text info */}
                      <div className="space-y-1.5">
                        <p className="text-xs text-mist-400 font-medium">{booking.car.brand.name}</p>
                        <p className="text-lg sm:text-xl 2xl:text-3xl font-bold text-mist-900">{booking.car.name}</p>
                        <p className="text-xs text-mist-400">Booking ID: VV-{booking.id.slice(-8).toUpperCase()}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-mist-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-mist-400" />
                            {formatDate(booking.startDate)}–{formatDate(booking.endDate)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-mist-400" />
                            {booking.pickupLocation}
                          </span>
                        </div>
                      </div>

                      {/* Right: status + price */}
                      <div className="flex sm:flex-col items-start sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(booking.status)}`}>
                          {statusLabel(booking.status)}
                        </span>
                        {booking.paymentStatus === "AUTHORIZED" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            Payment Authorized
                          </span>
                        )}
                        {booking.paymentStatus === "PAID" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                            Paid
                          </span>
                        )}
                        {booking.contractStatus === "SENT" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                            Contract Sent - Check Email
                          </span>
                        )}
                        {booking.contractStatus === "SIGNED" && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                            Contract Signed
                          </span>
                        )}
                        <p className="text-xl sm:text-2xl 2xl:text-4xl font-bold text-mist-900 leading-tight">
                          ${booking.totalPrice.toLocaleString()}
                          <span className="text-sm font-normal text-mist-400"> /day</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Bottom: action buttons ── */}
                  <div className="border-t border-mist-100 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-mist-100">
                    <button className="flex-1 py-3.5 text-sm text-mist-600 font-medium hover:bg-mist-50 transition-colors text-center">
                      View Details
                    </button>
                    {isConfirmed && (
                      <button className="flex-1 py-3.5 text-sm text-mist-600 font-medium hover:bg-mist-50 transition-colors text-center">
                        Download Invoice
                      </button>
                    )}
                    <button className="flex-1 py-3.5 text-sm text-mist-600 font-medium hover:bg-red-50 hover:text-red-500 transition-colors text-center">
                      Cancel Booking
                    </button>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}