"use client"

import { useState } from "react"
import Link from "next/link"
import { ImageOff, Users, Gauge, Zap, ArrowUpRight, Heart } from "lucide-react"

interface CarCardProps {
  id?: string
  name: string
  slug: string
  brand: string
  category: string
  pricePerDay: number
  year?: number
  transmission?: string
  seats?: number
  image?: string
  shortDescription?: string
  horsepower?: number
  acceleration?: string
  wishlisted?: boolean
}

export default function CarCard({ id, name, slug, brand, pricePerDay, seats, image, horsepower, acceleration, wishlisted: initialWishlisted }: CarCardProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted || false)
  const [toggling, setToggling] = useState(false)

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!id || toggling) return
    setToggling(true)
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: id }),
      })
      if (res.ok) {
        const data = await res.json()
        setWishlisted(data.wishlisted)
      } else if (res.status === 401) {
        window.location.href = "/login"
      }
    } catch {} finally {
      setToggling(false)
    }
  }

  return (
    <div className="relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={32} className="text-gray-300" />
          </div>
        )}
        <button
          onClick={toggleWishlist}
          disabled={toggling}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
            wishlisted
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4">
        <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{brand}</p>
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug -mt-0.5">{name}</h3>

        {/* Stats */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col items-center gap-0.5">
            <Users size={12} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">Seats</span>
            <span className="text-[11px] font-semibold text-gray-700">{seats || "—"}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col items-center gap-0.5">
            <Gauge size={12} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">0-60 mph</span>
            <span className="text-[11px] font-semibold text-gray-700">{acceleration || "—"}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col items-center gap-0.5">
            <Zap size={12} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">Engine</span>
            <span className="text-[11px] font-semibold text-gray-700">{horsepower ? `${horsepower} hp` : "—"}</span>
          </div>
        </div>

        <div className="h-px bg-gray-100 mt-1" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <Link href={`/cars/${slug}`} className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            View Details <ArrowUpRight size={11} strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-bold text-gray-900">${pricePerDay}</span>
            <span className="text-[10px] text-gray-400">/day</span>
          </div>
        </div>
      </div>
    </div>
  )
}
