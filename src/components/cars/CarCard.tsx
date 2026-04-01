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

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 2xl:gap-2">
      <div className="text-mist-600 2xl:scale-150">{icon}</div>
      <span className="text-xs 2xl:text-xl text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] 2xl:text-base text-mist-600">{value}</span>
    </div>
  )
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
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
      <div className="relative h-56 2xl:h-[350px] overflow-hidden p-3 2xl:p-5 ">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]"
          />
        ) : (
          <div className="w-full h-full rounded-2xl 2xl:rounded-[30px] flex items-center justify-center bg-mist-100">
            <ImageOff size={32} className="text-mist-300" />
          </div>
        )}

        <button
          onClick={toggleWishlist}
          disabled={toggling}
          className={`absolute top-5 right-5 2xl:top-8 2xl:right-8 w-8 h-8 2xl:w-14 2xl:h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            wishlisted
              ? "bg-mist-700 text-red-500"
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} className="2xl:w-6 2xl:h-6" fill={wishlisted ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-2 2xl:gap-5 px-8 2xl:px-12 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        <p className="text-xs 2xl:text-lg text-mist-400 font-medium tracking-wide uppercase truncate">{brand}</p>
        <h3 className="text-lg sm:text-xl 2xl:text-4xl font-semibold text-mist-900 leading-snug -mt-0.5 line-clamp-1">{name}</h3>

        <div className="flex items-center justify-between px-4 2xl:px-0 py-3 2xl:py-4">
          <StatPill icon={<Users size={12} />} label="Seats" value={seats || "—"} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Gauge size={12} />} label="0-60 mph" value={acceleration || "—"} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Zap size={12} />} label="Engine" value={horsepower ? `${horsepower} hp` : "—"} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <Link href={`/cars/${slug}`} className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-2xl text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-3xl font-semibold text-mist-900">${pricePerDay}</span>
            <span className="text-[10px] 2xl:text-lg text-mist-400">/ day</span>
          </div>
        </div>
      </div>
    </div>
  )
}
