"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ImageOff, Users, Gauge, Settings } from "lucide-react"

interface WishlistItem {
  id: string
  car: {
    id: string
    name: string
    slug: string
    pricePerDay: number
    seats: number
    acceleration: string | null
    horsepower: number | null
    brand: { name: string }
    images: { url: string }[]
  }
}

export default function MyWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Cars")

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist")
      if (res.ok) setItems(await res.json())
    } catch {} finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (carId: string) => {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carId }),
    })
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.car.id !== carId))
    }
  }

  const originalDayRate = (price: number) => Math.round(price * 1.2)

  return (
    <div className="overflow-hidden">

      {/* ── Heading ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 2xl:px-10 py-10 sm:py-12 2xl:py-16 border-b-2 border-mist-300 font-medium flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900">My Wishlist</h1>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="py-10 sm:py-12 2xl:py-16 px-4 sm:px-6 lg:px-10 2xl:px-14">

        {/* Tabs — only show when there are items */}
        {(items.length > 0 || activeTab !== "Cars") && (
          <div className="flex flex-wrap gap-2 mb-10">
            {["Cars", "Villas", "Events"].map((tab) => (
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
        )}

        {/* Non-cars tab */}
        {activeTab !== "Cars" ? (
          <div className="text-center py-16 text-mist-400">
            <p className="text-lg font-medium text-mist-500">Coming soon</p>
            <p className="text-sm">{activeTab} wishlist is not available yet</p>
          </div>

        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5 2xl:gap-7">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-mist-100 rounded-2xl animate-pulse" />
            ))}
          </div>

        ) : items.length === 0 ? (
          /* ── Empty state (Image 2) ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-mist-700 mb-3">Your wishlist is empty</p>
            <p className="text-sm text-mist-400 max-w-sm leading-relaxed mb-8">
              Start exploring luxury cars, villas, and exclusive events to save your favorites for later.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Explore Cars",   href: "/cars"   },
                { label: "Explore Villas", href: "/villas" },
                { label: "Explore Events", href: "/events" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2.5 rounded-full text-sm text-mist-600 bg-mist-200 hover:bg-mist-300 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        ) : (
          /* ── Cards grid (Image 1) ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5 2xl:gap-7">
            {items.map((item) => {
              const img = item.car.images?.[0]?.url
              return (
                <div
                  key={item.id}
                  className="bg-white border border-mist-100 rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-mist-100">
                    {img ? (
                      <Image src={img} alt={item.car.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-mist-300">
                        <ImageOff size={32} />
                      </div>
                    )}
                    {/* Heart remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.car.id)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart size={16} className="fill-red-500 text-red-500" />
                    </button>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    {/* Brand + name */}
                    <p className="text-xs text-mist-400 mb-0.5">{item.car.brand.name}</p>
                    <p className="text-lg font-bold text-mist-900 mb-4">{item.car.name}</p>

                    {/* Specs row */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Users size={18} className="text-mist-400" />
                        <span className="text-[11px] font-semibold text-mist-700">Seats</span>
                        <span className="text-[11px] text-mist-400">{item.car.seats || "2+2"}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Gauge size={18} className="text-mist-400" />
                        <span className="text-[11px] font-semibold text-mist-700">0-60 mph</span>
                        <span className="text-[11px] text-mist-400">{item.car.acceleration || "—"}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Settings size={18} className="text-mist-400" />
                        <span className="text-[11px] font-semibold text-mist-700">Engine</span>
                        <span className="text-[11px] text-mist-400">
                          {item.car.horsepower ? `${item.car.horsepower} hp` : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-mist-100 mb-4" />

                    {/* Footer: View Details + Price */}
                    <div className="flex items-end justify-between">
                      <Link
                        href={`/cars/${item.car.slug}`}
                        className="flex items-center gap-1 text-sm text-mist-700 font-medium hover:text-mist-900 transition-colors"
                      >
                        View Details
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-px">
                          <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                      <div className="text-right">
                        <p className="text-xl font-bold text-mist-900">
                          ${item.car.pricePerDay.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-mist-400 line-through">
                          ${originalDayRate(item.car.pricePerDay).toLocaleString()}/day
                        </p>
                      </div>
                    </div>
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