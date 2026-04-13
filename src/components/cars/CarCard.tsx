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
  originalPrice?: number | null
  year?: number
  transmission?: string
  seats?: number
  image?: string
  shortDescription?: string
  horsepower?: number
  acceleration?: string
  wishlisted?: boolean
  discountBadgeText?: string
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 2xl:gap-1.5">
      <div className="text-mist-600 2xl:scale-125">{icon}</div>
      <span className="text-xs 2xl:text-sm text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] 2xl:text-xs text-mist-600">{value}</span>
    </div>
  )
}

export default function CarCard({ 
  id, 
  name, 
  slug, 
  brand, 
  pricePerDay, 
  originalPrice, 
  seats, 
  image, 
  horsepower, 
  acceleration, 
  wishlisted: initialWishlisted,
  discountBadgeText 
}: CarCardProps) {
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
    /* Width slightly decreased to 450px on 2xl for better fit on large screens */
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 group cursor-pointer">

      {/* Image - Height slightly decreased for 2xl */}
      <div className="relative h-56 2xl:h-[300px] overflow-hidden p-3 2xl:p-4">
        {/* Discount badge */}
        {discountBadgeText && (
          <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-green-500 text-white font-bold text-xs 2xl:text-sm px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-full shadow-lg" style={{ minWidth: 'fit-content' }}>
            <span role="img" aria-label="fire" className=" ">🔥</span> <p>{discountBadgeText}</p>
          </div>
        )}
        <Link href={`/cars/${slug}`} className="block w-full h-full">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-3xl"
            />
          ) : (
            <div className="w-full h-full rounded-2xl 2xl:rounded-3xl flex items-center justify-center bg-mist-100">
              <ImageOff size={32} className="text-mist-300" />
            </div>
          )}
        </Link>

        <button
          onClick={toggleWishlist}
          disabled={toggling}
          className={`absolute top-5 right-5 w-8 h-8 2xl:w-11 2xl:h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            wishlisted
              ? "bg-mist-700 text-red-500"
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} className="2xl:w-3.5 2xl:h-3.5" fill={wishlisted ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body - Padding and spacing slightly decreased for 2xl */}
      <div className="flex flex-col gap-2 2xl:gap-4 px-6 2xl:px-8 pt-3.5 2xl:pt-5 pb-4 2xl:pb-6">
        <p className="text-xs 2xl:text-sm text-mist-400 font-medium tracking-wide uppercase truncate">{brand}</p>
        <h3 className="text-lg sm:text-xl 2xl:text-2xl font-semibold text-mist-900 leading-snug -mt-0.5 line-clamp-1">{name}</h3>

        <div className="flex items-center justify-between px-3 2xl:px-2 py-3 2xl:py-3.5">
          <StatPill icon={<Users size={12} />} label="Seats" value={seats || "—"} />
          <div className="w-px h-8 2xl:h-12 bg-mist-100" />
          <StatPill icon={<Gauge size={12} />} label="0-60 mph" value={acceleration || "—"} />
          <div className="w-px h-8 2xl:h-12 bg-mist-100" />
          <StatPill icon={<Zap size={12} />} label="Engine" value={horsepower ? `${horsepower} hp` : "—"} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <Link href={`/cars/${slug}`} className="flex items-center gap-1 2xl:gap-2.5 text-sm 2xl:text-lg text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-4.5 2xl:h-4.5" strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-xl font-semibold text-mist-900">${pricePerDay}</span>
            {originalPrice ? (
          <div className="flex items-center gap-1">
  <p className="text-[10px] 2xl:text-sm text-mist-400 line-through">${originalPrice}</p>
  <p className="text-[10px] 2xl:text-sm text-mist-400">/ day</p>
</div>
            ) : (
              <span className="text-[10px] 2xl:text-sm text-mist-400">/ day</span>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}