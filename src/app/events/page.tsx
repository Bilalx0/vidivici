"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Banner from "@/components/ui/Banner"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import {
  Heart,
  ArrowUpRight,
  SlidersHorizontal,
  Users,
  MapPin,
} from "lucide-react"

interface EventFromAPI {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  location: string
  category: string
  capacity: number
  images: { url: string; isPrimary: boolean }[]
}

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Nightlife", value: "Nightlife" },
  { label: "Lounge & Dining", value: "Lounge & Dining" },
  { label: "Private Events", value: "Private Events" },
  { label: "Corporate", value: "Corporate" },
  { label: "VIP Experience", value: "VIP Experience" },
]

const NIGHTLIFE_CATEGORIES = [
  {
    title: "Exclusive Clubs",
    description: "Access LA's most prestigious nightclubs with bottle service, VIP tables, and world-class entertainment in chic, intimate settings.",
  },
  {
    title: "VIP Nightlife",
    description: "Elevate your evening with priority entry to elite clubs with VIP access and curated experiences.",
  },
  {
    title: "Private Events",
    description: "Host unforgettable private gatherings, influencer parties, or corporate events.",
  },
  {
    title: "Lounge & Dining",
    description: "Savor the finest cocktails and cuisine at LA's most exclusive lounges and restaurants.",
  },
]

/* ================================================================== */
/*  Event Card                                                         */
/* ================================================================== */
function EventCard({ event }: { event: EventFromAPI }) {
  const [fav, setFav] = useState(false)
  const image = event.images?.[0]?.url

  return (
    <div className="relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
      <div className="relative h-56 overflow-hidden">
        {image ? (
          <img src={image} alt={event.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm">No Image</div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setFav((p) => !p) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            fav ? "bg-red-500 text-white" : "bg-white/75 text-mist-500 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} fill={fav ? "currentColor" : "none"} strokeWidth={2} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4">
        <h3 className="text-[15px] font-semibold text-mist-900 leading-snug">{event.name}</h3>
        {event.shortDescription && (
          <p className="text-[11px] text-mist-400 leading-relaxed line-clamp-2">{event.shortDescription}</p>
        )}
        <div className="h-px bg-mist-100 mt-1" />
        <div className="flex items-center justify-between mt-0.5">
          <Link href={`/events/${event.slug}`} className="flex items-center gap-1 text-[11px] font-semibold text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Main Content                                                        */
/* ================================================================== */
function EventsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<EventFromAPI[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const sort = searchParams.get("sort") || "newest"
  const activeCategory = searchParams.get("category") || ""

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const search = searchParams.get("search")
      if (search) params.set("search", search)
      if (activeCategory) params.set("category", activeCategory)
      params.set("limit", "12")
      params.set("page", searchParams.get("page") || "1")

      const res = await fetch(`/api/events?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
        setTotal(data.total || 0)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [searchParams, activeCategory])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("category", value)
    else params.delete("category")
    params.delete("page")
    router.push(`/events?${params.toString()}`)
  }

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", newSort)
    router.push(`/events?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Banner */}
      <Banner
        heading="Experience Los Angeles' Elite Nightlife"
        description="From Beverly Hills to West Hollywood, gain VIP access to the city's most exclusive experiences."
        height="h-[500px]"
        image="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=1400&q=80"
        searchBar={{
          placeholder: "Search events, venues, experiences...",
          onSearch: (value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value.trim()) params.set("search", value.trim())
            else params.delete("search")
            params.delete("page")
            router.push(`/events?${params.toString()}`)
          },
        }}
      />

      {/* Luxury Nights Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-mist-900 mb-3">Luxury Nights, Seamless Experiences</h2>
          <p className="text-sm text-mist-500 max-w-2xl mx-auto mb-10">
            At Vidi Vici Nightlife, every evening is extraordinary. From Beverly Hills to the Sunset Strip,
            our team ensures seamless entry to LA&apos;s top-tier restaurants, lounges, and entertainment venues.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {NIGHTLIFE_CATEGORIES.map((cat) => (
              <div key={cat.title} className="bg-mist-50 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-mist-900 mb-2">{cat.title}</h3>
                <p className="text-xs text-mist-500 leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="bg-mist-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-mist-900 mb-2">Exclusive Nightlife &amp; VIP Experiences</h2>
            <p className="text-sm text-mist-500">Discover Los Angeles&apos; most sought-after destinations for unforgettable nights.</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat.value
                    ? "bg-mist-900 text-white"
                    : "bg-white text-mist-600 hover:bg-mist-100 border border-mist-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end mb-6">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border border-mist-200 text-mist-700 text-sm px-3 py-2 rounded-lg focus:border-mist-400 focus:outline-none"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mist-400 text-lg mb-2">No events found</p>
              <p className="text-mist-300 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {events.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>
      </section>

      {/* Reuse existing sections */}
      <WhyChooseUs />
      <Reviews />
      <FAQ />
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <EventsContent />
    </Suspense>
  )
}
