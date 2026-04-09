"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ImageOff, Users, Gauge, Settings, BedDouble, Maximize2, MapPin, ArrowUpRight, Zap } from "lucide-react"

interface WishlistItem {
  id: string
  carId?: string
  villaId?: string
  eventId?: string
  car?: {
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
  villa?: {
    id: string
    name: string
    slug: string
    pricePerNight: number
    bedrooms: number
    guests: number
    sqft: number
    location: string
    images: { url: string }[]
  }
  event?: {
    id: string
    name: string
    slug: string
    location: string
    category: string
    capacity: number
    images: { url: string }[]
  }
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 2xl:gap-2">
      <div className="text-mist-600 2xl:scale-150">{icon}</div>
      <span className="text-xs 2xl:text-base text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] 2xl:text-sm text-mist-600">{value}</span>
    </div>
  )
}

const formatSqft = (sqft: number) => sqft >= 1000 ? `${(sqft / 1000).toFixed(1)}k` : sqft.toString()

function WishlistCarCard({ item }: { item: WishlistItem }) {
  const car = item.car!
  const img = car.images?.[0]?.url

  return (
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs 2xl:w-[500px] flex-shrink-0 group cursor-pointer">
      <div className="relative h-56 2xl:h-[350px] overflow-hidden p-3 2xl:m-5">
        <Link href={`/cars/${car.slug}`} className="block w-full h-full">
          {img ? (
            <img src={img} alt={car.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]" />
          ) : (
            <div className="w-full h-full rounded-2xl 2xl:rounded-[30px] flex items-center justify-center bg-mist-100">
              <ImageOff size={32} className="text-mist-300" />
            </div>
          )}
        </Link>
        <button
          onClick={() => { }}
          className="absolute top-5 right-5 w-8 h-8 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 bg-mist-700 text-red-500"
        >
          <Heart size={13} className="2xl:w-4 2xl:h-4" fill="currentColor" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-2 2xl:gap-5 px-8 2xl:px-12 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        <p className="text-xs 2xl:text-base text-mist-400 font-medium tracking-wide uppercase truncate">{car.brand.name}</p>
        <h3 className="text-lg sm:text-xl 2xl:text-3xl font-semibold text-mist-900 leading-snug -mt-0.5 line-clamp-1">{car.name}</h3>

        <div className="flex items-center justify-between px-4 2xl:px-0 py-3 2xl:py-4">
          <StatPill icon={<Users size={12} />} label="Seats" value={car.seats || "—"} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Gauge size={12} />} label="0-60 mph" value={car.acceleration || "—"} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Zap size={12} />} label="Engine" value={car.horsepower ? `${car.horsepower} hp` : "—"} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <Link href={`/cars/${car.slug}`} className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-xl text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-2xl font-semibold text-mist-900">${car.pricePerDay}</span>
            <span className="text-[10px] 2xl:text-base text-mist-400 line-through">${Math.round(car.pricePerDay * 1.2).toLocaleString()} / day</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WishlistVillaCard({ item }: { item: WishlistItem }) {
  const villa = item.villa!
  const img = villa.images?.[0]?.url

  return (
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs 2xl:w-[500px] flex-shrink-0 group cursor-pointer">
      <div className="relative h-56 2xl:h-[350px] overflow-hidden p-3 2xl:m-5">
        <Link href={`/villas/${villa.slug}`} className="block w-full h-full">
          {img ? (
            <img src={img} alt={villa.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]" />
          ) : (
            <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm rounded-2xl 2xl:rounded-[30px]">No Image</div>
          )}
        </Link>
        <button
          onClick={() => { }}
          className="absolute top-5 right-5 w-8 h-8 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 bg-mist-700 text-red-500"
        >
          <Heart size={13} className="2xl:w-4 2xl:h-4" fill="currentColor" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-2 2xl:gap-5 px-8 2xl:px-12 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        <p className="text-xs 2xl:text-base text-mist-400 font-medium tracking-wide uppercase truncate">
          Luxury Villa for Rent | {villa.location}
        </p>
        <h3 className="text-lg sm:text-xl 2xl:text-3xl font-semibold text-mist-900 leading-snug -mt-0.5">{villa.name}</h3>

        <div className="flex items-center justify-between px-4 2xl:px-0 py-3 2xl:py-4">
          <StatPill icon={<BedDouble size={12} />} label="Bedrooms" value={villa.bedrooms} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Users size={12} />} label="Guests" value={villa.guests} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Maximize2 size={12} />} label="Sq.ft" value={formatSqft(villa.sqft)} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <Link href={`/villas/${villa.slug}`} className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-xl text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-2xl font-semibold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
            <span className="text-[10px] 2xl:text-base text-mist-400">/night</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WishlistEventCard({ item }: { item: WishlistItem }) {
  const event = item.event!
  const img = event.images?.[0]?.url

  return (
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs 2xl:w-[500px] flex-shrink-0 group cursor-pointer">
      <div className="relative h-56 2xl:h-[350px] overflow-hidden p-3 2xl:m-5">
        <Link href={`/events/${event.slug}`} className="block w-full h-full">
          {img ? (
            <img src={img} alt={event.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]" />
          ) : (
            <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm 2xl:text-lg rounded-2xl 2xl:rounded-[30px]">No Image</div>
          )}
        </Link>
        <button
          onClick={() => { }}
          className="absolute top-5 right-5 w-8 h-8 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 bg-mist-700 text-red-500"
        >
          <Heart size={13} className="2xl:w-4 2xl:h-4" fill="currentColor" strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-2 2xl:gap-5 px-8 2xl:px-12 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        <p className="text-xs 2xl:text-base text-mist-400 font-medium tracking-wide uppercase truncate">
          {event.category || event.location || "Venue TBA"}
        </p>
        <h3 className="text-lg sm:text-xl 2xl:text-3xl font-semibold text-mist-900 leading-snug -mt-0.5">
          {event.name}
        </h3>

        <div className="flex items-center justify-between px-4 2xl:px-0 py-3 2xl:py-4">
          <StatPill icon={<MapPin size={12} />} label="Location" value={event.location} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Users size={12} />} label="Capacity" value={`Up to ${event.capacity}`} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <Link href={`/events/${event.slug}`} className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-xl text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  )
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
    } catch { } finally {
      setLoading(false)
    }
  }

  const removeItem = async (id: string, type: 'car' | 'villa' | 'event') => {
    const item = items.find(i => i.id === id)
    const body: any = {}
    if (type === 'car' && item?.car) body.carId = item.car.id
    if (type === 'villa' && item?.villa) body.villaId = item.villa.id
    if (type === 'event' && item?.event) body.eventId = item.event.id

    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }
  }

  const carItems = items.filter(i => i.car)
  const villaItems = items.filter(i => i.villa)
  const eventItems = items.filter(i => i.event)

  const filteredItems = activeTab === "Cars" ? carItems : activeTab === "Villas" ? villaItems : eventItems

  return (
    <div className="overflow-hidden">
      <div className="px-4 sm:px-6 2xl:px-10 py-10 sm:py-12 2xl:py-16 border-b-2 border-mist-300 font-medium flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900">My Wishlist</h1>
      </div>

      <div className="py-10 sm:py-12 2xl:py-16 px-4 sm:px-6 lg:px-10 2xl:px-14">
        {(items.length > 0 || activeTab !== "Cars") && (
          <div className="flex flex-wrap gap-2 2xl:gap-4 mb-10 2xl:mb-16">
            {[
              { label: "Cars", count: carItems.length },
              { label: "Villas", count: villaItems.length },
              { label: "Events", count: eventItems.length },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`px-5 2xl:px-8 py-2 2xl:py-4 rounded-full text-sm 2xl:text-xl font-medium border transition-colors ${activeTab === tab.label
                    ? "bg-mist-500 text-white"
                    : "bg-white text-mist-600 border-mist-200 hover:border-mist-400"
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 2xl:gap-10 px-6 sm:px-16 lg:px-20 2xl:px-32">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-mist-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg 2xl:text-2xl font-semibold text-mist-700 mb-3">Your wishlist is empty</p>
            <p className="text-sm 2xl:text-xl text-mist-400 max-w-sm 2xl:max-w-3xl leading-relaxed mb-8">
              Start exploring luxury cars, villas, and exclusive events to save your favorites for later.
            </p>
            <div className="flex flex-wrap justify-center gap-3 2xl:gap-6">
              {[
                { label: "Explore Cars", href: "/cars" },
                { label: "Explore Villas", href: "/villas" },
                { label: "Explore Events", href: "/events" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 2xl:px-8 py-2.5 2xl:py-4 rounded-full text-sm 2xl:text-xl text-mist-600 bg-mist-200 hover:bg-mist-300 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 2xl:py-28 text-mist-400">
            <p className="text-lg 2xl:text-2xl font-medium text-mist-500">No {activeTab.toLowerCase()} in your wishlist</p>
            <p className="text-sm 2xl:text-xl mt-2">
              <Link href={`/${activeTab.toLowerCase()}`} className="text-mist-700 underline hover:text-mist-900">
                Explore {activeTab.toLowerCase()}
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 2xl:gap-10">
            {filteredItems.map((item) => {
              if (item.car) return <WishlistCarCard key={item.id} item={item} />
              if (item.villa) return <WishlistVillaCard key={item.id} item={item} />
              if (item.event) return <WishlistEventCard key={item.id} item={item} />
              return null
            })}
          </div>
        )}
      </div>
    </div>
  )
}