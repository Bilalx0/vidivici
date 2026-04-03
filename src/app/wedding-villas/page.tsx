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
  BedDouble,
  Users,
  Maximize2,
  ArrowUpRight,
  SlidersHorizontal,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
} from "lucide-react"
import { ChevronRight, RotateCcw, X } from "lucide-react"

interface VillaFromAPI {
  id: string
  name: string
  slug: string
  location: string
  bedrooms: number
  guests: number
  sqft: number
  pricePerNight: number
  images: { url: string; isPrimary: boolean }[]
}

const ADD_ONS = ["Valet Parking", "Security", "Mixologist", "Drivers"]
const EVENT_TYPES = ["Wedding", "Cocktail Party", "Corporate Event", "Birthday Party", "Private Celebration", "Other"]

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


function WeddingVillaFilters({ onHide }: { onHide?: () => void }) {
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
    router.push(`/wedding-villas?${params.toString()}`)
  }

  const clearAll = () => {
    setSelectedLocation("")
    setMinBedrooms("")
    setMinGuests("")
    setMinSqft("")
    setMinPrice("")
    setMaxPrice("")
    router.push("/wedding-villas")
  }

  return (
    <div className="bg-white p-2 sm:p-0 2xl:p-4 space-y-6 w-full">

   

      {/* Location — fix: use value= not defaultValue= */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-mist-500 block">Location</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md focus:border-mist-300 focus:outline-none appearance-none"
        >
          <option value="">Search location</option>
          {LOCATION_TAGS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        {selectedLocation && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {selectedLocation}
              <button onClick={() => setSelectedLocation("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Bedrooms */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-mist-500 block">Bedrooms</label>
        <select
          value={minBedrooms}
          onChange={(e) => setMinBedrooms(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md focus:border-mist-300 focus:outline-none appearance-none"
        >
          {BEDROOM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {minBedrooms && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {BEDROOM_OPTIONS.find(o => o.value === minBedrooms)?.label}
              <button onClick={() => setMinBedrooms("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Square Footage — fix: use value= not defaultValue= */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-mist-500 block">Square</label>
        <select
          value={minSqft}
          onChange={(e) => setMinSqft(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md focus:border-mist-300 focus:outline-none appearance-none"
        >
          <option value="">Select square footage</option>
          {SQFT_OPTIONS.filter(o => o.value !== "").map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {minSqft && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {SQFT_OPTIONS.find(o => o.value === minSqft)?.label}
              <button onClick={() => setMinSqft("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Guests */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-mist-500 block">Guests</label>
        <select
          value={minGuests}
          onChange={(e) => setMinGuests(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md focus:border-mist-300 focus:outline-none appearance-none"
        >
          {GUEST_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {minGuests && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {GUEST_OPTIONS.find(o => o.value === minGuests)?.label}
              <button onClick={() => setMinGuests("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-mist-500 block">Price Range</label>
        <input
          type="range"
          min={0}
          max={10000}
          value={maxPrice || 0}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full accent-neutral-500 h-1"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[10px] text-mist-400 mb-1">Minimum</p>
            <div className="flex items-center bg-neutral-100 border border-mist-200 rounded-md px-3 py-2 gap-1">
              <span className="text-xs text-mist-400">$</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-sm text-mist-700 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>
          <span className="text-mist-300 mt-4">–</span>
          <div className="flex-1">
            <p className="text-[10px] text-mist-400 mb-1">Maximum</p>
            <div className="flex items-center bg-neutral-100 border border-mist-200 rounded-md px-3 py-2 gap-1">
              <span className="text-xs text-mist-400">$</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-sm text-mist-700 focus:outline-none"
                placeholder="10000"
              />
            </div>
          </div>
          <button
            onClick={applyFilters}
            className="mt-4 w-9 h-9 flex-shrink-0 bg-mist-200 hover:bg-mist-200 rounded-md flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} className="text-mist-600" />
          </button>
        </div>
      </div>

      {/* Apply + Reset */}
      <div className="space-y-2 pt-2">
        <button
          onClick={applyFilters}
          className="w-full bg-mist-900 text-white py-3 2xl:py-6 rounded-lg text-sm hover:bg-mist-800 transition-colors"
        >
          Apply
        </button>
        <button
          onClick={clearAll}
          className="w-full bg-white border border-mist-200 text-mist-700 py-3 2xl:py-6 rounded-lg text-sm hover:bg-mist-50 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

    </div>
  )
}

/* ================================================================== */
/*  Wedding Booking Inquiry Form                                       */
/* ================================================================== */
function WeddingBookingInquiry() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    addOns: [] as string[],
    specialRequests: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleAddOn = (addon: string) => {
    setForm((f) => ({
      ...f,
      addOns: f.addOns.includes(addon) ? f.addOns.filter((a) => a !== addon) : [...f.addOns, addon],
    }))
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.eventType || !form.eventDate) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "wedding",
          category: "Villa",
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          subject: `Wedding Inquiry — ${form.eventType}`,
          message: form.specialRequests,
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            eventType: form.eventType,
            eventDate: form.eventDate,
            guestCount: parseInt(form.guestCount) || 50,
            addOns: form.addOns.join(", "),
          },
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
    <section className="w-full bg-white py-12 2xl:py-24 sm:px-16 2xl:sm:px-32 lg:px-20 2xl:lg:px-40 px-6" id="inquiry">
      <div className="">
        <div className="border border-mist-200 rounded-3xl overflow-hidden gap-8 2xl:gap-16 sm:p-8 2xl:sm:p-16 px-4 py-6 2xl:px-8 2xl:py-12 flex flex-col md:flex-row shadow-sm">

          {/* Left Panel - Contact Info */}
          <div className="bg-mist-100 p-8 2xl:p-16 md:w-1/3 flex-shrink-0 flex flex-col gap-8 2xl:gap-16 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-mist-400 to-transparent rounded-full blur-3xl" />
            </div>
            <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none rotate-180"
            />

            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl 2xl:md:text-4xl 2xl:text-3xl font-bold text-mist-900 leading-snug mb-3">
                Have questions or want to book your wedding experience?
              </h3>
              <p className="text-sm text-mist-600 leading-relaxed">
                Our team is here to assist you with villas, cars, and VIP events across Los Angeles.
              </p>
            </div>

            <div className="border-t border-mist-300" />

            <div className="relative z-10 flex flex-col gap-6 2xl:gap-12">
              <div className="flex items-start gap-4 2xl:gap-8">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-mist-900">Phone</p>
                  <p className="text-sm text-mist-600 leading-relaxed">(310) 555-0991</p>
                </div>
              </div>
              <div className="flex items-start gap-4 2xl:gap-8">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-mist-900">Email</p>
                  <p className="text-sm text-mist-600 leading-relaxed">admin@vidivicirental.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 2xl:gap-8">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-mist-900">Address</p>
                  <p className="text-sm text-mist-600 leading-relaxed">8687 Melrose Ave, Los Angeles CA 90069, United States</p>
                </div>
              </div>
              <div className="flex items-start gap-4 2xl:gap-8">
                <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-mist-900">Working Hours</p>
                  <p className="text-sm text-mist-600 leading-relaxed">Mon-Sun: 8 AM – 8 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl 2xl:md:text-7xl 2xl:text-6xl font-bold text-mist-900 mb-8 2xl:mb-16 tracking-tight">
              Wedding Booking Inquiry
            </h2>

            <div className="flex flex-col gap-6 2xl:gap-12">

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-12">
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Full Name</label>
                  <input type="text" placeholder="Enter your full name" value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-mist-300 rounded-xl px-4 py-3 2xl:px-8 2xl:py-6 text-sm text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
                </div>
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Last Name</label>
                  <input type="text" placeholder="Enter your last name" value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-mist-300 rounded-xl px-4 py-3 2xl:px-8 2xl:py-6 text-sm text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-12">
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Email Address</label>
                  <input type="email" placeholder="Enter your email address" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-mist-300 rounded-xl px-4 py-3 2xl:px-8 2xl:py-6 text-sm text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
                </div>
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Phone</label>
                  <div className="flex items-center border border-mist-300 rounded-xl overflow-hidden focus-within:border-mist-400 transition-colors duration-200 bg-white">
                    <span className="px-4 py-3 2xl:px-8 2xl:py-6 text-lg border-r border-mist-300 bg-mist-50 flex items-center gap-2 text-mist-600 flex-shrink-0">
                      🇺🇸
                    </span>
                    <input type="tel" placeholder="Enter your phone number" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="flex-1 px-4 py-3 2xl:px-8 2xl:py-6 text-sm text-mist-900 placeholder-mist-400 outline-none bg-white" />
                  </div>
                </div>
              </div>

              {/* Event Type & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-12">
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Event Type</label>
                  <div className="relative">
                    <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className="w-full border border-mist-300 rounded-xl px-4 py-3 pr-12 2xl:px-8 2xl:pr-16 2xl:py-6 text-sm text-mist-900 bg-white focus:outline-none focus:border-mist-400 transition-colors duration-200 cursor-pointer appearance-none">
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500 2xl:right-6 2xl:h-6 2xl:w-6" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 2xl:gap-4">
                  <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Event Date</label>
                  <input type="date" value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full border border-mist-300 rounded-xl px-4 py-3 2xl:px-8 2xl:py-6 text-sm text-mist-900 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
                </div>
              </div>

              {/* Guest Count */}
              <div className="flex flex-col gap-2 2xl:gap-4">
                <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Number of Guests</label>
                <input type="number" placeholder="e.g. 120" value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                  className="w-full border border-mist-300 rounded-xl px-4 py-3 2xl:px-8 2xl:py-6 text-sm text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white" />
              </div>

              {/* Add-Ons */}
              <div className="flex flex-col gap-2 2xl:gap-4">
                <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Add-Ons</label>
                <div className="flex flex-wrap gap-3 2xl:gap-6">
                  {ADD_ONS.map((addon) => (
                    <button type="button" key={addon} onClick={() => toggleAddOn(addon)} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        form.addOns.includes(addon) ? "border-blue-600" : "border-mist-300"
                      }`}>
                        {form.addOns.includes(addon) && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <span className="text-sm text-mist-600">{addon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="flex flex-col gap-2 2xl:gap-4">
                <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">Special Requests / Notes</label>
                <textarea placeholder="Tell us more about your event..." value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} rows={5}
                  className="w-full border border-mist-300 rounded-xl px-4 py-3 2xl:px-8 2xl:py-6 text-sm text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white resize-none" />
              </div>

              {/* Submit */}
              <button onClick={handleSubmit}
                className="w-full bg-mist-900 text-white cursor-pointer font-semibold py-4 2xl:py-8 rounded-xl hover:bg-mist-800 transition-colors duration-200 mt-2 disabled:opacity-40 disabled:cursor-not-allowed">
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
/*  Villa Card                                                          */
/* ================================================================== */
function WeddingVillaCard({ villa }: { villa: VillaFromAPI }) {
  const [fav, setFav] = useState(false)
  const image = villa.images?.[0]?.url

  return (
    <div className="relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">

      {/* Image */}
      <div className="relative overflow-hidden p-3 2xl:p-6">
        {image ? (
          <img
            src={image}
            alt={villa.name}
            className="w-full h-64 2xl:h-96 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-64 2xl:h-96 bg-mist-100 flex items-center justify-center text-mist-400 text-sm rounded-2xl">No Image</div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setFav((p) => !p) }}
          className={`absolute top-5 right-5 2xl:top-8 2xl:right-8 w-9 h-9 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${fav ? "bg-white text-red-500" : "bg-white text-mist-400 hover:text-red-400"
            }`}
        >
          <Heart size={15} fill={fav ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col px-4 pb-5 pt-1 2xl:px-8 2xl:pb-10 2xl:pt-2 gap-1">
        <p className="text-xs text-mist-400 font-medium">
          Luxury Villa for Rent | {villa.location}
        </p>
        <h3 className="text-2xl 2xl:text-4xl font-bold text-mist-900 leading-snug">{villa.name}</h3>

        <div className="h-px bg-mist-100 mt-3 mb-2" />

        <Link
          href={`/villas/${villa.slug}`}
          className="flex items-center gap-1 text-sm text-mist-500 hover:text-mist-900 transition-colors w-fit"
        >
          View Details <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>
      </div>

    </div>
  )
}

/* ================================================================== */
/*  Main Content                                                        */
/* ================================================================== */
function WeddingVillasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [villas, setVillas] = useState<VillaFromAPI[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const sort = searchParams.get("sort") || "popular"

  const fetchVillas = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const search = searchParams.get("search")
      if (search) params.set("search", search)
      params.set("limit", "12")

      const res = await fetch(`/api/villas?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        let sorted = data.villas || []
        if (sort === "price-asc") sorted.sort((a: VillaFromAPI, b: VillaFromAPI) => a.pricePerNight - b.pricePerNight)
        else if (sort === "price-desc") sorted.sort((a: VillaFromAPI, b: VillaFromAPI) => b.pricePerNight - a.pricePerNight)
        setVillas(sorted)
        setTotal(data.total || 0)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [searchParams, sort])

  useEffect(() => { fetchVillas() }, [fetchVillas])

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", newSort)
    router.push(`/wedding-villas?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Banner */}
      <Banner
        heading="Celebrate Your Dream Wedding in Style"
        description="Host your dream wedding, cocktail party, or private celebration at our exclusive villas across Los Angeles"
        height="h-[500px]"
        image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80"
        searchBar={{
          placeholder: "Search by location or villa name...",
          onSearch: (value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value.trim()) params.set("search", value.trim())
            else params.delete("search")
            router.push(`/wedding-villas?${params.toString()}`)
          },
        }}
      />

      {/* Luxury Wedding Venues Section */}
<section className="bg-white py-16 2xl:py-32 sm:px-16 2xl:sm:px-32 lg:px-20 2xl:lg:px-40 px-6">
  <div className="">
    <h2 className="text-4xl 2xl:text-7xl font-bold text-mist-900 text-center my-20 2xl:my-40">
      Luxury Wedding Venues Los Angeles
    </h2>

    <div className="flex justify-between items-center mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 2xl:px-8 2xl:py-4 border border-mist-200 rounded-xl text-sm text-mist-600 hover:bg-mist-50 transition-colors"
      >
        <SlidersHorizontal size={14} />
        {showFilters ? "Hide Filter" : "Show Filter"}
      </button>
      <select
        value={sort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-neutral-100 border border-mist-200 text-mist-600 text-sm px-3 py-2 2xl:px-6 2xl:py-4 rounded-lg focus:border-mist-400 focus:outline-none"
      >
        <option value="popular">Sort by: Most Popular</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
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
          <WeddingVillaFilters onHide={() => setShowFilters(false)} />
        </div>
      </div>
    )}

    <div className="flex flex-col lg:flex-row gap-8 2xl:gap-16">
      {/* Sidebar Filters - Fixed: proper conditional visibility */}
      <aside className={`hidden lg:block lg:w-72 shrink-0 ${showFilters ? "lg:block" : "lg:hidden"}`}>
        <WeddingVillaFilters onHide={() => setShowFilters(false)} />
      </aside>

      {/* Villas Grid - Dynamic columns based on filter visibility */}
      <div className="flex-1">
        {loading ? (
          <div className={`grid gap-6 2xl:gap-12 ${showFilters ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-mist-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : villas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-mist-400 text-lg mb-2">No wedding venues found</p>
            <p className="text-mist-300 text-sm">Try adjusting your search</p>
          </div>
        ) : (
          <div className={`grid gap-6 2xl:gap-12 ${showFilters ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
            {villas.map((villa) => <WeddingVillaCard key={villa.id} villa={villa} />)}
          </div>
        )}
      </div>
    </div>
  </div>
</section>

      <section className="py-16 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">

          {/* Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-mist-900 leading-tight mb-4">
              About Our Wedding Venues
            </h2>
            <p className="text-base text-mist-500 leading-relaxed mb-7">
              Our exclusive collection of villas and estates offers the perfect backdrop for weddings,
              receptions, and private celebrations. Each venue has been carefully selected for its
              beauty, ambiance, and world-class amenities — ensuring your big day is as special as
              you imagined.
            </p>
            <ul className="space-y-4">
              {[
                "Spacious layouts with breathtaking views",
                "Elegant indoor and outdoor settings",
                "Perfect for ceremonies, receptions, and photoshoots",
                "Complete privacy and personalized service",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-mist-300 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="gray" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-base text-mist-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — bento grid */}
          <div className="grid grid-cols-3 grid-rows-2 gap-3 w-full">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80"
              alt="Wedding ceremony"
              className="col-span-2 row-span-1 w-full h-52 object-cover rounded-2xl"
            />
            <img
              src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80"
              alt="Wedding venue"
              className="col-span-1 row-span-1 w-full h-52 object-cover rounded-2xl"
            />
            <img
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80"
              alt="Wedding decor"
              className="col-span-1 row-span-1 w-full h-52 object-cover rounded-2xl"
            />
            <img
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80"
              alt="Outdoor wedding"
              className="col-span-2 row-span-1 w-full h-52 object-cover rounded-2xl"
            />
          </div>

        </div>
      </section>

      <section className="py-16 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-mist-900 mb-3">
              Enhance Your Celebration
            </h2>
            <p className="text-sm text-mist-400 max-w-sm mx-auto leading-relaxed">
              Make your celebration seamless with our exclusive add-on
              services available across all venues
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">

            {/* Mixologist */}
            <div className="flex items-center gap-4 bg-mist-100 rounded-2xl p-4">
              <img
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80"
                alt="Mixologist"
                className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
              />
              <div className="pt-1">
                <h3 className="text-base font-bold text-mist-900 mb-1">Mixologist</h3>
                <p className="text-base text-mist-500 font-normal leading-relaxed">
                  Professional bartenders to craft signature drinks for your guests.
                </p>
              </div>
            </div>

            {/* Valet Parking */}
            <div className="flex items-center gap-4 bg-mist-100 rounded-2xl p-4">
              <img
                src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=300&q=80"
                alt="Valet Parking"
                className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
              />
              <div className="pt-1">
                <h3 className="text-base font-bold text-mist-900 mb-1">Valet Parking</h3>
                <p className="text-base text-mist-500 font-normal leading-relaxed">
                  Hassle-free parking management for you and your guests.
                </p>
              </div>
            </div>

            {/* Driver */}
            <div className="flex items-center gap-4 bg-mist-100 rounded-2xl p-4">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&q=80"
                alt="Driver"
                className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
              />
              <div className="pt-1">
                <h3 className="text-base font-bold text-mist-900 mb-1">Driver</h3>
                <p className="text-base text-mist-500 font-normal leading-relaxed">
                  Private drivers and guest transportation available upon request.
                </p>
              </div>
            </div>

            {/* Security Team */}
            <div className="flex items-center gap-4 bg-mist-100 rounded-2xl p-4">
              <img
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80"
                alt="Security Team"
                className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
              />
              <div className="pt-1">
                <h3 className="text-base font-bold text-mist-900 mb-1">Security Team</h3>
                <p className="text-base text-mist-500 font-normal leading-relaxed">
                  On-site security professionals to ensure a smooth event.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>





      {/* Reuse existing sections */}
      <WhyChooseUs />
      <Reviews />
      <section className="py-16 px-6 sm:px-16 lg:px-20 bg-white">
        <div className="">
          <div className="relative bg-mist-100 rounded-3xl px-8 py-16 text-center overflow-hidden">
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


            {/* Content */}
            <h2 className="text-3xl sm:text-4xl font-bold text-mist-900 leading-tight mb-4">
              Plan Your Dream<br />Wedding With Us
            </h2>
            <p className="text-sm text-mist-400 max-w-sm mx-auto leading-relaxed mb-8">
              Tell us about your celebration and let our team help you create an unforgettable experience.
            </p>
            <button className="bg-mist-900 text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-mist-700 transition-colors">
              Request a Quote
            </button>

          </div>
        </div>
      </section>
      <FAQ />
      {/* Wedding Booking Inquiry */}
      <WeddingBookingInquiry />
    </div>
  )
}

export default function WeddingVillasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <WeddingVillasContent />
    </Suspense>
  )
}
