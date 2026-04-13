"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import Turnstile from "@/components/Turnstile"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Banner from "@/components/ui/Banner"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import {
  SlidersHorizontal,
  BedDouble,
  Users,
  Maximize2,
  Heart,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RotateCcw,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react"

/* ================================================================== */
/*  Types & Constants                                                  */
/* ================================================================== */
interface VillaFromAPI {
  id: string
  name: string
  slug: string
  location: string
  bedrooms: number
  guests: number
  sqft: number
  pricePerNight: number
  originalPrice?: number
  images: { url: string; isPrimary: boolean }[]
}

const LOCATION_TAGS = ["Beverly Hills", "Malibu", "Hollywood Hills", "Los Angeles", "Miami"]
const SQFT_OPTIONS = [
  { label: "Any", value: "" },
  { label: "5,000+ sq.ft", value: "5000" },
  { label: "9,000+ sq.ft", value: "9000" },
  { label: "15,000+ sq.ft", value: "15000" },
]
const BEDROOM_OPTIONS = [
  { label: "Any", value: "" },
  { label: "3+", value: "3" },
  { label: "5+", value: "5" },
  { label: "7+", value: "7" },
  { label: "10+", value: "10" },
]
const GUEST_OPTIONS = [
  { label: "Any", value: "" },
  { label: "6+", value: "6" },
  { label: "10+", value: "10" },
  { label: "15+", value: "15" },
  { label: "20+", value: "20" },
]

const PROJECT_TYPES = [
  "Feature Film",
  "TV Series",
  "Commercial",
  "Music Video",
  "Photo Shoot",
  "Corporate Video",
  "Documentary",
  "Short Film",
  "Other",
]

function switchTemporalInputType(input: HTMLInputElement, kind: "date" | "time") {
  if (input.type !== "text") return
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

  const lockedWidth = Math.ceil(input.getBoundingClientRect().width)
  if (isIOS && lockedWidth > 0) {
    input.style.width = `${lockedWidth}px`
    input.style.minWidth = `${lockedWidth}px`
    input.style.maxWidth = `${lockedWidth}px`
    input.style.fontSize = "16px"
  }
  input.type = kind
  requestAnimationFrame(() => {
    input.focus()
    if (typeof (input as HTMLInputElement & { showPicker?: () => void }).showPicker === "function") {
      try {
        ;(input as HTMLInputElement & { showPicker: () => void }).showPicker()
      } catch {
        // Fallback to focus when showPicker is unavailable.
      }
    }
    if (isIOS) {
      requestAnimationFrame(() => {
        input.style.width = "100%"
        input.style.minWidth = "0"
        input.style.maxWidth = "100%"
        input.style.fontSize = "16px"
      })
    }
  })
}

const ABOUT_BULLETS = [
  "Spacious interiors for lighting & camera setups",
  "Scenic outdoor areas ideal for film or photo shoots",
  "On-site parking & crew access",
  "Variety of architectural styles",
]

/* ================================================================== */
/*  Villa Card (same as /villas)                                       */
/* ================================================================== */


function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 2xl:gap-1.5">
      <div className="text-mist-600 2xl:scale-125">{icon}</div>
      <span className="text-xs 2xl:text-sm text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] 2xl:text-xs text-mist-600">{value}</span>
    </div>
  )
}

function VillaListCard({ villa, wishlisted: initialWishlisted }: { villa: VillaFromAPI; wishlisted?: boolean }) {
  const [fav, setFav] = useState(false)
  const [wishlisted, setWishlisted] = useState(initialWishlisted || false)
   const [toggling, setToggling] = useState(false)
  const image = villa.images?.[0]?.url
  
    const toggleWishlist = async (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (!villa.id || toggling) return
      setToggling(true)
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ villaId: villa.id }),
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
  
    const formatSqft = (sqft: number) => {
      return sqft >= 1000 ? `${(sqft / 1000).toFixed(1)}k` : sqft.toString()
    }

  return (
 <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 group cursor-pointer">

      {/* Image - Height slightly decreased for 2xl */}
      <div className="relative h-56 2xl:h-[300px] overflow-hidden p-3 2xl:p-4">
        <Link href={`/villas/${villa.slug}`} className="block w-full h-full">
          {image ? (
            <img 
              src={image} 
              alt={villa.name} 
              loading="lazy" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-3xl" 
            />
          ) : (
            <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm rounded-2xl 2xl:rounded-3xl">No Image</div>
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
        <p className="text-xs 2xl:text-sm text-mist-400 font-medium tracking-wide uppercase truncate">
          Luxury Villa for Rent | {villa.location}
        </p>
        <h3 className="text-lg sm:text-xl 2xl:text-2xl font-semibold text-mist-900 leading-snug -mt-0.5 line-clamp-1">
          {villa.name}
        </h3>

        {/* Stats Row - Using StatPill component with vertical dividers slightly decreased for 2xl */}
        <div className="flex items-center justify-between px-3 2xl:px-2 py-3 2xl:py-3.5">
          <StatPill icon={<BedDouble size={12} />} label="Bedrooms" value={villa.bedrooms} />
          <div className="w-px h-8 2xl:h-12 bg-mist-100" />
          <StatPill icon={<Users size={12} />} label="Guests" value={villa.guests} />
          <div className="w-px h-8 2xl:h-12 bg-mist-100" />
          <StatPill icon={<Maximize2 size={12} />} label="Sq.ft" value={formatSqft(villa.sqft)} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        {/* Footer - Pricing and CTAs slightly decreased for 2xl */}
        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <Link href={`/villas/${villa.slug}`} className="flex items-center gap-1 2xl:gap-2.5 text-sm 2xl:text-lg text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-4.5 2xl:h-4.5" strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-xl font-semibold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
            <span className="text-[10px] 2xl:text-sm text-mist-400">
              <span className="text-[10px] 2xl:text-sm text-mist-400 line-through">${villa.originalPrice?.toLocaleString() || villa.pricePerNight.toLocaleString()}</span> / night
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

/* ================================================================== */
/*  Sidebar Filters                                                    */
/* ================================================================== */
function FilmFilters({ onHide }: { onHide?: () => void }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "")
  const [minBedrooms, setMinBedrooms] = useState(searchParams.get("minBedrooms") || "")
  const [minGuests, setMinGuests] = useState(searchParams.get("minGuests") || "")
  const [minSqft, setMinSqft] = useState(searchParams.get("minSqft") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedLocation) params.set("location", selectedLocation)
    if (minBedrooms) params.set("minBedrooms", minBedrooms)
    if (minGuests) params.set("minGuests", minGuests)
    if (minSqft) params.set("minSqft", minSqft)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    params.set("page", "1")
    router.push(`/film-tv-production?${params.toString()}`)
  }

  const clearAll = () => {
    setSelectedLocation("")
    setMinBedrooms("")
    setMinGuests("")
    setMinSqft("")
    setMinPrice("")
    setMaxPrice("")
    router.push("/film-tv-production")
  }

  return (
    <div className="bg-white p-2 sm:p-0 2xl:p-4 space-y-6 2xl:space-y-8 w-full">

      {/* Location */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Location</label>
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none">
          <option value="">Search location</option>
          {LOCATION_TAGS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        {selectedLocation && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {selectedLocation}
              <button onClick={() => setSelectedLocation("")} className="hover:text-mist-900"><X size={10} /></button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Bedrooms */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Bedrooms</label>
        <select value={minBedrooms} onChange={(e) => setMinBedrooms(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none">
          {BEDROOM_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {minBedrooms && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {BEDROOM_OPTIONS.find(o => o.value === minBedrooms)?.label}
              <button onClick={() => setMinBedrooms("")} className="hover:text-mist-900"><X size={10} /></button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Square Footage */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Square</label>
        <select value={minSqft} onChange={(e) => setMinSqft(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none">
          <option value="">Select square footage</option>
          {SQFT_OPTIONS.filter(o => o.value !== "").map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {minSqft && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {SQFT_OPTIONS.find(o => o.value === minSqft)?.label}
              <button onClick={() => setMinSqft("")} className="hover:text-mist-900"><X size={10} /></button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Guests */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Guests</label>
        <select value={minGuests} onChange={(e) => setMinGuests(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none">
          {GUEST_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {minGuests && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {GUEST_OPTIONS.find(o => o.value === minGuests)?.label}
              <button onClick={() => setMinGuests("")} className="hover:text-mist-900"><X size={10} /></button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Price Range</label>
        <input type="range" min={0} max={10000} value={maxPrice || 0} onChange={(e) => setMaxPrice(e.target.value)} className="w-full accent-neutral-500 h-1" />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[10px] 2xl:text-sm text-mist-400 mb-1">Minimum</p>
            <div className="flex items-center bg-neutral-100 border border-mist-200 rounded-md 2xl:rounded-xl px-3 py-2 2xl:px-5 2xl:py-3 gap-1">
              <span className="text-xs text-mist-400">$</span>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full text-sm 2xl:text-lg text-mist-700 focus:outline-none" placeholder="0" />
            </div>
          </div>
          <span className="text-mist-300 mt-4">–</span>
          <div className="flex-1">
            <p className="text-[10px] 2xl:text-sm text-mist-400 mb-1">Maximum</p>
            <div className="flex items-center bg-neutral-100 border border-mist-200 rounded-md 2xl:rounded-xl px-3 py-2 2xl:px-5 2xl:py-3 gap-1">
              <span className="text-xs text-mist-400">$</span>
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full text-sm 2xl:text-lg text-mist-700 focus:outline-none" placeholder="10000" />
            </div>
          </div>
          <button onClick={applyFilters} className="mt-4 w-9 h-9 2xl:w-12 2xl:h-12 flex-shrink-0 bg-mist-200 hover:bg-mist-200 rounded-md 2xl:rounded-xl flex items-center justify-center transition-colors">
            <ChevronRight size={16} className="text-mist-600" />
          </button>
        </div>
      </div>

      {/* Apply + Reset */}
      <div className="space-y-2 pt-2">
        <button onClick={applyFilters} className="w-full bg-mist-900 text-white py-3 2xl:py-5 rounded-lg 2xl:rounded-xl text-sm 2xl:text-lg hover:bg-mist-800 transition-colors">Apply</button>
        <button onClick={clearAll} className="w-full bg-white border border-mist-200 text-mist-700 py-3 2xl:py-5 rounded-lg 2xl:rounded-xl text-sm 2xl:text-lg hover:bg-mist-50 transition-colors flex items-center justify-center gap-2">
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Inquiry Form                                                       */
/* ================================================================== */
function ProductionInquiryForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    shootDates: "",
    crewSize: "",
    specialRequests: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.projectType || !form.shootDates) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "film-tv-production",
          category: "Villa",
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          subject: `Film & TV Production — ${form.projectType}`,
          message: form.specialRequests,
          data: {
            projectType: form.projectType,
            shootDates: form.shootDates,
            crewSize: form.crewSize,
          },
          turnstileToken,
        }),
      })
      if (res.ok) setSubmitted(true)
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-mist-900 mb-2">Inquiry Submitted!</h3>
        <p className="text-sm text-mist-500">Our team will get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <section className="w-full bg-white py-12 2xl:py-24 sm:px-16 lg:px-20 2xl:px-32 px-6" id="inquiry">
      <div>
        <div className="border border-mist-200 rounded-3xl 2xl:rounded-[40px] overflow-hidden gap-8 2xl:gap-14 sm:p-8 2xl:sm:p-16 px-4 py-6 2xl:px-8 2xl:py-12 flex flex-col md:flex-row shadow-sm">

          {/* Left Panel — Contact Info */}
          <div className="bg-mist-100 px-4 sm:px-8 py-8 2xl:py-14 md:w-1/3 2xl:w-[480px] flex-shrink-0 flex flex-col gap-8 2xl:gap-12 relative overflow-hidden rounded-2xl 2xl:rounded-[32px]">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-64 h-64 2xl:w-[460px] bg-gradient-to-br from-mist-400 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl 2xl:text-3xl font-bold text-mist-900 leading-tight mb-3 2xl:mb-6">
                Have questions or ready to book your shoot location?
              </h3>
              <p className="text-sm 2xl:text-xl text-mist-500 leading-relaxed">
                Our team is here to assist you with film, TV, and commercial production rentals in Los Angeles.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-mist-300"></div>

            {/* Contact Info Items */}
            <div className="relative z-10 flex flex-col gap-6 2xl:gap-9">
              <div className="flex items-start gap-4 2xl:gap-6">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 2xl:w-[1.35rem] 2xl:h-[1.35rem]" />
                </div>
                <div>
                  <p className="text-sm 2xl:text-lg font-normal text-mist-900">Phone</p>
                  <p className="text-sm 2xl:text-lg text-mist-500 leading-relaxed mt-1">(310) 555-0991</p>
                </div>
              </div>
              <div className="flex items-start gap-4 2xl:gap-6">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 2xl:w-[1.35rem] 2xl:h-[1.35rem]" />
                </div>
                <div>
                  <p className="text-sm 2xl:text-lg font-normal text-mist-900">Email</p>
                  <p className="text-sm 2xl:text-lg text-mist-500 leading-relaxed mt-1">admin@vidivicirental.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 2xl:gap-6">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 2xl:w-[1.35rem] 2xl:h-[1.35rem]" />
                </div>
                <div>
                  <p className="text-sm 2xl:text-lg font-normal text-mist-900">Address</p>
                  <p className="text-sm 2xl:text-lg text-mist-500 leading-relaxed mt-1">8687 Melrose Ave, Los Angeles CA 90069, United States</p>
                </div>
              </div>
              <div className="flex items-start gap-4 2xl:gap-6">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 2xl:w-[1.35rem] 2xl:h-[1.35rem]" />
                </div>
                <div>
                  <p className="text-sm 2xl:text-lg font-normal text-mist-900">Working Hours</p>
                  <p className="text-sm 2xl:text-lg text-mist-500 leading-relaxed mt-1">Mon–Sun: 8 AM – 8 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel — Form */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-mist-900 mb-8 2xl:mb-12 tracking-tight">
              Film &amp; TV Production House Inquiry
            </h2>

            <div className="flex flex-col gap-6 2xl:gap-8">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-8">
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">First Name</label>
                  <input type="text" placeholder="Enter your first name" value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
                </div>
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">Last Name</label>
                  <input type="text" placeholder="Enter your last name" value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-8">
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">Email Address</label>
                  <input type="email" placeholder="Enter your email address" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
                </div>
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">Phone</label>
                  <div className="flex items-center border border-mist-300 rounded-xl 2xl:rounded-2xl overflow-hidden focus-within:border-mist-400 transition-colors duration-200 bg-white">
                    <span className="px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl border-r border-mist-300 bg-mist-50 flex items-center gap-2 text-mist-600 flex-shrink-0">🇺🇸</span>
                    <input type="tel" placeholder="Enter your phone number" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="flex-1 px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 outline-none bg-white" />
                  </div>
                </div>
              </div>

              {/* Project Type & Shoot Dates Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-8">
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">Project Type</label>
                  <div className="relative">
                    <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                      className="w-full appearance-none border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 pr-12 2xl:px-6 2xl:pr-12 2xl:py-5 text-sm 2xl:text-xl text-mist-900 bg-white focus:outline-none focus:border-mist-400 transition-colors duration-200 cursor-pointer">
                      <option value="">Project Type</option>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500 2xl:right-5 2xl:h-[1.1rem] 2xl:w-[1.1rem]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">Shoot Dates</label>
                  <input type={form.shootDates ? "date" : "text"}
                    onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "date")}
                    onFocus={(e) => switchTemporalInputType(e.currentTarget, "date")}
                    onBlur={(e) => { if (!form.shootDates) e.currentTarget.type = "text" }}
                    onChange={(e) => setForm({ ...form, shootDates: e.target.value })}
                    placeholder="Select shoot date"
                    className="ios-temporal-input w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
                </div>
              </div>

              {/* Crew Size */}
              <div className="flex flex-col gap-2 2xl:gap-4">
                <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">Crew Size</label>
                <input type="number" placeholder="e.g. 25" value={form.crewSize}
                  onChange={(e) => setForm({ ...form, crewSize: e.target.value })}
                  className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
              </div>

              {/* Special Requests */}
              <div className="flex flex-col gap-2 2xl:gap-4">
                <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">Special Requests / Notes</label>
                <textarea placeholder="Tell us more about your project..." value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} rows={5}
                  className="w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 py-3 2xl:px-6 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white resize-none" />
              </div>

              {/* Turnstile */}
              <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

              {/* Submit */}
              <button onClick={handleSubmit} disabled={submitting || !turnstileToken}
                className="w-full bg-mist-900 text-white cursor-pointer font-normal py-4 2xl:py-6 rounded-xl 2xl:rounded-2xl hover:bg-mist-800 transition-all duration-200 mt-2 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-sm 2xl:text-xl">
                {submitting ? "Sending..." : "Send"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  Main Page Content                                                  */
/* ================================================================== */
function FilmTVContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [villas, setVillas] = useState<VillaFromAPI[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const currentPage = parseInt(searchParams.get("page") || "1")
  const sort = searchParams.get("sort") || "newest"

  const fetchVillas = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const location = searchParams.get("location")
      const minBedrooms = searchParams.get("minBedrooms")
      const minGuests = searchParams.get("minGuests")
      const minSqft = searchParams.get("minSqft")
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      const search = searchParams.get("search")

      if (location) params.set("location", location)
      if (minBedrooms) params.set("minBedrooms", minBedrooms)
      if (minGuests) params.set("minGuests", minGuests)
      if (minSqft) params.set("minSqft", minSqft)
      if (minPrice) params.set("minPrice", minPrice)
      if (maxPrice) params.set("maxPrice", maxPrice)
      if (search) params.set("search", search)
      params.set("page", String(currentPage))
      params.set("limit", "12")

      const res = await fetch(`/api/villas?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        let sorted = data.villas || []
        if (sort === "price-asc") sorted.sort((a: VillaFromAPI, b: VillaFromAPI) => a.pricePerNight - b.pricePerNight)
        else if (sort === "price-desc") sorted.sort((a: VillaFromAPI, b: VillaFromAPI) => b.pricePerNight - a.pricePerNight)
        setVillas(sorted)
        setTotal(data.total || 0)
        setPages(data.pages || 1)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [searchParams, currentPage, sort])

  useEffect(() => { fetchVillas() }, [fetchVillas])

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", newSort)
    params.set("page", "1")
    router.push(`/film-tv-production?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`/film-tv-production?${params.toString()}`)
  }

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <Banner
        heading="Film & TV Production House Rentals in Los Angeles"
        description="Discover exclusive villas and estates available for film, TV, and commercial shoots."
        height="h-96 2xl:h-[520px]"
        image="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&q=80"
        searchBar={{
          placeholder: "Search by location or villa name...",
          onSearch: (value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value.trim()) params.set("search", value.trim())
            else params.delete("search")
            params.set("page", "1")
            router.push(`/film-tv-production?${params.toString()}`)
          },
        }}
      />

      {/* Listing Section */}
      {/* Listing Section - UPDATED to match villas page */}
      <section className="sm:px-16 lg:px-20 2xl:px-32 px-6">
        <div className="mt-24 2xl:mt-48 o">
          <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 text-center my-20 2xl:my-32">
            Film & TV Production House Rentals
          </h2>

          {/* Filter toggle + Sort - MOVED HERE to match villas layout */}
          <div className="flex justify-between items-center mb-6 2xl:mb-10">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 2xl:px-8 py-2 2xl:py-4 border border-mist-200 rounded-xl 2xl:rounded-2xl text-sm 2xl:text-xl text-mist-600 hover:bg-mist-50 transition-colors"
            >
              <SlidersHorizontal size={14} />
              {showFilters ? "Hide Filter" : "Show Filter"}
            </button>
            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-neutral-100 border border-mist-200 text-mist-600 text-sm 2xl:text-xl px-3 2xl:px-6 py-2 2xl:py-4 pr-9 2xl:pr-12 rounded-lg 2xl:rounded-xl focus:border-mist-400 focus:outline-none"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500 2xl:right-4" />
            </div>
          </div>

          {showFilters && (
            <div
              className="fixed inset-0 z-120 bg-black/50 lg:hidden"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="h-full w-full max-w-sm bg-white p-5 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between border-b border-mist-200 pb-3">
                  <h3 className="text-base font-semibold text-mist-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="rounded-md p-1 text-mist-500 hover:bg-mist-100 hover:text-mist-900"
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>
                  <FilmFilters />
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 2xl:gap-14">
            {/* Sidebar Filters - FIXED: removed lg:block */}
            <aside className={`hidden lg:block lg:w-72 2xl:w-96 shrink-0 ${showFilters ? "lg:block" : "lg:hidden"}`}>
              <FilmFilters onHide={() => setShowFilters(false)} />
            </aside>

            {/* Villa Grid - FIXED: dynamic columns */}
            <div className="flex-1">
              {loading ? (
                <div className={`grid gap-6 2xl:gap-12 ${showFilters ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-mist-100 rounded-2xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : villas.length === 0 ? (
                <div className="text-center py-20 2xl:py-28">
                  <p className="text-mist-400 text-lg 2xl:text-3xl mb-2">No properties found</p>
                  <p className="text-mist-300 text-sm 2xl:text-xl">Try adjusting your filters or search</p>
                </div>
              ) : (
                <div className={`grid gap-6 2xl:gap-12 ${showFilters ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
                  {villas.map((villa) => <VillaListCard key={villa.id} villa={villa} />)}
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 2xl:gap-4 mt-10 2xl:mt-16">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-10 h-10 2xl:w-12 2xl:h-12 rounded-lg 2xl:rounded-xl font-semibold text-sm 2xl:text-lg transition-colors ${p === currentPage
                          ? "bg-mist-900 text-white"
                          : "bg-mist-100 text-mist-500 hover:bg-mist-200"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Our Film & TV Houses */}
      <section className="py-16 2xl:py-28 px-6 sm:px-12 lg:px-20 2xl:px-32 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 2xl:gap-20 items-center max-w-[1840px] mx-auto">
          <div>
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl  font-bold text-mist-900 leading-tight mb-4 2xl:mb-8">
              About Our Film &amp; TV Houses
            </h2>
            <p className="text-base 2xl:text-2xl text-mist-500 leading-relaxed mb-7 2xl:mb-10">
              Our portfolio of production-ready properties offers a diverse
              range of aesthetics — from sleek modern architecture to
              timeless estates. Each space is designed to accommodate
              film crews, photography teams, and creative projects of any scale.
            </p>
            <ul className="space-y-4">
              {ABOUT_BULLETS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-mist-300 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="mist" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-base 2xl:text-2xl text-mist-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2x2 Image Grid */}
          <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full">
            <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80" alt="Camera equipment"
              loading="lazy" className="col-span-2 row-span-1 w-full h-52 object-cover rounded-2xl" />
            <img src="https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=600&q=80" alt="Studio lights"
              loading="lazy" className="col-span-1 row-span-1 w-full h-52 object-cover rounded-2xl" />
            <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80" alt="Film crew"
              loading="lazy" className="col-span-1 row-span-1 w-full h-52 object-cover rounded-2xl" />
            <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80" alt="Production set"
              loading="lazy" className="col-span-2 row-span-1 w-full h-52 object-cover rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Reviews />

        <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
        <div className="">
          <div className="relative bg-mist-100 rounded-3xl 2xl:rounded-[40px] px-8 2xl:px-16 py-16 2xl:py-24 text-center overflow-hidden">
            <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none  rotate-180"
            />

            {/* Right side vector decoration */}
            <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180"
            />


            {/* Content */}
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-8">
             Ready to book your next <br/> shoot location?
            </h2>
            <p className="text-sm 2xl:text-xl text-mist-500 max-w-sm 2xl:max-w-3xl mx-auto leading-relaxed mb-8 2xl:mb-12">
              Tell us about your celebration and let our team help you create an unforgettable experience.
            </p>
            <button className="bg-mist-900 text-white text-base 2xl:text-xl px-7 2xl:px-12 py-3.5 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors">
              Request a Quote
            </button>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Production Inquiry Form */}
      <ProductionInquiryForm />
    </div>
  )
}

/* ================================================================== */
/*  Export                                                              */
/* ================================================================== */
export default function FilmTVProductionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <FilmTVContent />
    </Suspense>
  )
}
