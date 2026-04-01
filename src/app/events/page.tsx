"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Banner from "@/components/ui/Banner"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Events from "@/components/home/Events"
import {
  Heart,
  ArrowUpRight,
} from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-[40px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs 2xl:w-[500px] flex-shrink-0 group cursor-pointer">
      
      {/* Image with padding */}
      <div className="relative h-56 2xl:h-[350px] overflow-hidden p-3 2xl:p-5">
        {image ? (
          <img 
            src={image} 
            alt={event.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]" 
          />
        ) : (
          <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm 2xl:text-lg rounded-2xl 2xl:rounded-[30px]">No Image</div>
        )}
        
        {/* Updated favorite button - positioned inside padding, dark bg */}
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setFav((p) => !p) }}
          className={`absolute top-5 right-5 2xl:top-8 2xl:right-8 w-8 h-8 2xl:w-14 2xl:h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            fav 
              ? "bg-mist-700 text-red-500" 
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} fill={fav ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body - increased padding */}
      <div className="flex flex-col gap-2 2xl:gap-5 px-8 2xl:px-12 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        
        {/* Venue tag */}
        <p className="text-xs 2xl:text-lg text-mist-400 font-medium tracking-wide uppercase truncate">
          {event.location || "Venue TBA"}
        </p>
        
        {/* Title - larger size */}
        <h3 className="text-lg sm:text-xl 2xl:text-4xl font-semibold text-mist-900 leading-snug -mt-0.5">
          {event.name}
        </h3>
        
        {/* Description */}
        {event.shortDescription && (
          <p className="text-sm 2xl:text-2xl text-mist-600 leading-relaxed line-clamp-2">
            {event.shortDescription}
          </p>
        )}

        <div className="h-px bg-mist-100 mt-0.5" />

        <div className="flex items-center justify-between mt-0.5">
          <Link 
            href={`/events/${event.slug}`} 
            className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-2xl text-mist-500 hover:text-mist-900 transition-colors"
          >
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
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
  const [hovered, setHovered] = useState(null);

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

const categories = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Fine Dining & Lounges",
      description: "Indulge in upscale cuisine and live entertainment in chic, intimate settings."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Elite Nightclubs",
      description: "Step into the city's most exclusive clubs with VIP access and curated experiences."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: "Private Events & Parties",
      description: "Tailored arrangements for private gatherings, influencer parties, or corporate events."
    }
  ];

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

      <section className="w-full">
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-16 2xl:py-32">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 2xl:gap-16 max-w-[1840px] mx-auto">
            {/* Left: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-5 2xl:mb-8">

                Luxury Nights, Seamless Experiences
              </h2>

              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                At Vidi Vici Nightlife, every evening is extraordinary. From Beverly Hills to the Sunset Strip, our team ensures seamless entry to LA’s top-tier restaurants, lounges, and entertainment venues.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                Whether you’re planning a private celebration, corporate outing, or high-profile gathering, we handle every detail — from luxury arrivals to effortless access to the city’s most exclusive locations.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-8 2xl:mb-10">
                Experience the glamour, sophistication, and exclusivity of Los Angeles nightlife like never before.
              </p>


            </div>

            {/* Right: Car Image */}
            <div className="w-full lg:w-[620px] 2xl:w-[860px] flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"
                alt="Luxury sports car"
                className="w-full rounded-xl 2xl:rounded-3xl object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
       <section className="relative px-6 sm:px-16 lg:px-20 2xl:px-32 py-16 2xl:py-28 bg-mist-100 overflow-hidden">
              <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none  rotate-180"
      />

      {/* Right side vector decoration */}
      <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180"
      />

      <div className="max-w-[1840px] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 2xl:mb-20">
          <h2 className="text-4xl 2xl:text-7xl font-bold text-gray-900 mb-4 2xl:mb-6">
            Explore Our Nightlife
            <br />
            Categories
          </h2>
          <p className="text-gray-600 text-lg 2xl:text-2xl">
            Find the perfect experience to match your style and occasion.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-10">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl 2xl:rounded-3xl p-8 2xl:p-12 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 mb-6">
                {category.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl 2xl:text-3xl font-semibold text-gray-900 mb-3 2xl:mb-4">
                {category.title}
              </h3>
              <p className="text-gray-500 text-base 2xl:text-2xl leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
      <section className="py-16 2xl:py-32 px-6 sm:px-16 lg:px-20 2xl:px-32 bg-white">
        <div className="max-w-[1840px] mx-auto">

          {/* Header */}
          <div className="text-center mb-12 2xl:mb-20">
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 mb-3 2xl:mb-8">
              Elevate Your Night
            </h2>
            <p className="text-sm 2xl:text-2xl text-mist-500 max-w-sm 2xl:max-w-lg mx-auto leading-relaxed">
              Make your Vidi Vici experience even more extraordinary with our exclusive VIP services.
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 2xl:gap-y-8 gap-x-6 2xl:gap-x-10">

            {/* Mixologist */}
            <div className="flex items-center gap-4 2xl:gap-8 bg-mist-100 rounded-2xl 2xl:rounded-[40px] p-4 2xl:p-8">
              <img
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80"
                alt="Mixologist"
                className="w-48 2xl:w-72 h-48 2xl:h-72 object-cover rounded-lg 2xl:rounded-2xl flex-shrink-0"
              />
              <div className="pt-1">
                <h3 className="text-base 2xl:text-2xl font-normal text-mist-900 mb-1 2xl:mb-3">Chauffeur Services or Party Bus</h3>
                <p className="text-base text-mist-500 font-normal leading-relaxed">
                  Professional bartenders to craft signature drinks for your guests.
                </p>
              </div>
            </div>

            {/* Valet Parking */}
            <div className="flex items-center gap-4 2xl:gap-8 bg-mist-100 rounded-2xl 2xl:rounded-[40px] p-4 2xl:p-8">
              <img
                src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=300&q=80"
                alt="Valet Parking"
                className="w-48 2xl:w-72 h-48 2xl:h-72 object-cover rounded-lg 2xl:rounded-2xl flex-shrink-0"
              />
              <div className="pt-1">
                <h3 className="text-base 2xl:text-2xl font-normal text-mist-900 mb-1 2xl:mb-3">Security & Bodyguards</h3>
                <p className="text-base 2xl:text-2xl text-mist-500 font-normal leading-relaxed">
                  Hassle-free parking management for you and your guests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
     <section className="py-16 2xl:py-28">
  {/* Header */}
  <div className="text-center px-6 sm:px-16 lg:px-20 2xl:px-32">
    <h2 className="text-3xl sm:text-4xl 2xl:text-7xl font-bold text-mist-900 mb-3 2xl:mb-6">
      Exclusive Nightlife & VIP Experiences
    </h2>
    <p className="text-base 2xl:text-2xl text-mist-500 leading-relaxed">
      Make your Vidi Vici experience even more extraordinary with our exclusive VIP services.
    </p>
  </div>

  {/* Inline Carousel with Real Data */}
  <div className="relative mt-8">
    {/* Left Arrow */}
    <button
      onClick={() => {
        const el = document.getElementById('events-carousel');
        if (el) el.scrollBy({ left: -290, behavior: 'smooth' });
      }}
      className="absolute left-3 2xl:left-8 top-1/2 -translate-y-1/2 z-10 w-9 2xl:w-12 h-9 2xl:h-12 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
    >
      <ChevronLeft size={16} strokeWidth={2.5} className="text-mist-700 2xl:w-6 2xl:h-6" />
    </button>

    {/* Right Arrow */}
    <button
      onClick={() => {
        const el = document.getElementById('events-carousel');
        if (el) el.scrollBy({ left: 290, behavior: 'smooth' });
      }}
      className="absolute right-3 2xl:right-8 top-1/2 -translate-y-1/2 z-10 w-9 2xl:w-12 h-9 2xl:h-12 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
    >
      <ChevronRight size={16} strokeWidth={2.5} className="text-mist-700 2xl:w-6 2xl:h-6" />
    </button>

    {/* Carousel Track */}
    <div
      id="events-carousel"
      className="flex gap-5 2xl:gap-10 px-6 sm:px-16 lg:px-20 2xl:px-32 overflow-x-auto pb-2 scroll-smooth"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {loading ? (
        // Loading skeletons
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-[270px] 2xl:w-[500px] flex-shrink-0 h-80 2xl:h-[520px] bg-mist-100 rounded-3xl animate-pulse" />
        ))
      ) : events.length === 0 ? (
          <div className="w-full text-center py-12 2xl:py-20 text-mist-500 2xl:text-2xl">No events found</div>
      ) : (
        events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      )}
      <div className="w-6 shrink-0" />
    </div>
  </div>
</section>

      {/* Reuse existing sections */}
      <WhyChooseUs />
      <Reviews />
      <FAQ />

          <div className="relative w-full bg-[#eeeeed] py-16 2xl:py-24 px-6 sm:px-16 lg:px-20 2xl:px-32 text-center mt-16 2xl:mt-24 overflow-hidden">
               <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none  rotate-180"
      />

      {/* Right side vector decoration */}
      <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180"
      />

        <div className="relative z-10 max-w-md 2xl:max-w-4xl mx-auto flex flex-col items-center gap-8 2xl:gap-10">

          <h2 className="text-5xl 2xl:text-7xl font-bold text-mist-900 tracking-tight">
            Make Your LA Night Unforgettable
          </h2>
          <p className="text-base 2xl:text-2xl text-mist-500 leading-relaxed">
            Book your next unforgettable LA experience with Vidi Vici — where every night is tailored to perfection.
          </p>
          <button className="mt-2 bg-mist-800 text-white text-base 2xl:text-2xl px-7 2xl:px-12 py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
            Reserve Now
          </button>
        </div>

      </div>
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
