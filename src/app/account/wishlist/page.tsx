"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ImageOff } from "lucide-react"

interface WishlistItem {
  id: string
  car: {
    id: string
    name: string
    slug: string
    pricePerDay: number
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {["Cars", "Villas", "Events"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
              activeTab === tab
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== "Cars" ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium text-gray-500">Coming soon</p>
          <p className="text-sm">{activeTab} wishlist is not available yet</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Heart size={48} className="mx-auto text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">No wishlisted cars</p>
          <p className="text-sm">Cars you save will appear here</p>
          <Link href="/cars" className="inline-block mt-4 bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
            Browse Cars
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const img = item.car.images?.[0]?.url
            return (
              <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden group">
                <div className="relative h-44 bg-gray-100">
                  {img ? (
                    <Image src={img} alt={item.car.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageOff size={32} /></div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.car.id)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition shadow-sm"
                  >
                    <Heart size={16} className="fill-red-500 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400">{item.car.brand.name}</p>
                  <p className="font-bold text-gray-900">{item.car.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-bold text-gray-900">${item.car.pricePerDay}<span className="text-xs font-normal text-gray-400"> /day</span></p>
                    <Link
                      href={`/cars/${item.car.slug}`}
                      className="text-xs bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition"
                    >
                      View
                    </Link>
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
