"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight, BedDouble, Users, Bath, Maximize2, MapPin, Plane, ChefHat, Shield, CreditCard, Sparkles, Percent, Bed } from "lucide-react"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"

interface VillaImage {
  url: string
  alt: string | null
}

interface Villa {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  location: string
  address: string | null
  bedrooms: number
  bathrooms: number
  guests: number
  sqft: number
  pricePerNight: number
  cleaningFee: number
  securityDeposit: number
  amenities: string | null
  images: VillaImage[]
}

interface RelatedVilla {
  id: string
  name: string
  slug: string
  location: string
  bedrooms: number
  guests: number
  sqft: number
  pricePerNight: number
  image: string | null
}

const TABS = ["Stay", "Event", "Production"] as const
type TabType = (typeof TABS)[number]

export default function VillaDetailClient({ villa, relatedVillas }: { villa: Villa; relatedVillas: RelatedVilla[] }) {
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const [activeTab, setActiveTab] = useState<TabType>("Stay")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guestCount, setGuestCount] = useState(1)
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  // Add-ons
  const [airportTransfer, setAirportTransfer] = useState(false)
  const [privateChef, setPrivateChef] = useState(false)
  const [securityService, setSecurityService] = useState(false)

  // Event form state
  const [eventForm, setEventForm] = useState({
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

  // Production form state
  const [productionForm, setProductionForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    shootDate: "",
    crewSize: "",
    specialRequests: "",
  })

  const images = villa.images.length > 0 ? villa.images : [{ url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", alt: "Villa" }]

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  // Calculate days
  const days = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 1
  const nightsTotal = villa.pricePerNight * days
  const addOnsTotal = (airportTransfer ? 500 : 0)
  const subtotal = nightsTotal + villa.cleaningFee + addOnsTotal
  const tax = subtotal * 0.14
  const total = subtotal + tax + villa.securityDeposit

  const amenitiesList = villa.amenities ? villa.amenities.split(",").map((a) => a.trim()).filter(Boolean) : []

  const formatSqft = (sqft: number) => sqft >= 1000 ? `${(sqft / 1000).toFixed(1)}k` : sqft.toString()

  // Toggle event add-ons
  const toggleEventAddon = (addon: string) => {
    setEventForm(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addon)
        ? prev.addOns.filter(a => a !== addon)
        : [...prev.addOns, addon]
    }))
  }

  return (
    <div className="bg-white">
      <div className=" px-6 sm:px-16 lg:px-20 py-16">


        {/* Breadcrumb */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs sm:text-base text-mist-400">
            <Link href="/" className="hover:text-mist-700">Home</Link>
            <span>{">"}</span>
            <Link href="/villas" className="hover:text-mist-700">Villas</Link>
            <span>{">"}</span>
            <span className="text-mist-700">{villa.name}</span>
          </div>
        </div>

        <div className="pb-16">
          {/* CRITICAL FIX: items-start prevents flex children from stretching */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left Column */}
            <div className="flex-1 min-w-0">
              {/* Gallery */}
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <img
                  src={images[currentImage].url}
                  alt={images[currentImage].alt || villa.name}
                  className="w-full h-[340px] lg:h-[420px] object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                      <ChevronLeft size={18} className="text-mist-700" />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                      <ChevronRight size={18} className="text-mist-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="relative mb-8">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`flex-shrink-0 w-[118px] h-[80px] rounded-xl overflow-hidden transition-all ${i === currentImage ? "ring-2 ring-mist-800" : "opacity-70 hover:opacity-100"
                          }`}
                      >
                        <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  {/* Thumbnail row arrows */}
                  <button onClick={prevImage} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-7 h-7 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50 transition-colors">
                    <ChevronLeft size={14} className="text-mist-600" />
                  </button>
                  <button onClick={nextImage} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50 transition-colors">
                    <ChevronRight size={14} className="text-mist-600" />
                  </button>
                </div>
              )}

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {/* Left card */}
                <div className=" bg-mist-100 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={30} className="text-mist-400 bg-white p-2 rounded-md flex-shrink-0" />
                    <p className="text-sm text-mist-500">
                      <span className="font-semibold">Security Deposit:</span>
                      ${villa.securityDeposit.toLocaleString()}

                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Percent size={30} className="text-mist-400 bg-white p-2 rounded-md flex-shrink-0" />
                    <p className="text-sm text-mist-500">
                      <span className="font-semibold">Tax:</span> 14%
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={30} className="text-mist-400 bg-white p-2 rounded-md flex-shrink-0" />
                    <p className="text-sm text-mist-500">
                      <span className="font-semibold">Cleaning Fee:</span> ${villa.cleaningFee ?? "950"}
                    </p>
                  </div>
                </div>

                {/* Right card */}
                <div className=" bg-mist-100 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-mist-400 mt-0.5">•</span>
                    <p className="text-sm text-mist-500">
                      <span className="font-semibold">Rental Duration:</span> 24 hours
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-mist-400 mt-0.5">•</span>
                    <p className="text-sm text-mist-500">
                      <span className="font-semibold">Extra Hour:</span> 20% of the daily rate
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-mist-400 mt-0.5">•</span>
                    <p className="text-sm text-mist-500">
                      <span className="font-semibold">5 Extra Hours:</span> Charged as an extra night
                    </p>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-mist-100 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <BedDouble size={30} className="text-mist-400 bg-neutral-200 rounded-full p-1.5" />
                  <div>
                    <p className="text-sm font-bold text-mist-900 mt-1">Bedrooms</p>
                    <p className="text-sm text-mist-500">{villa.bedrooms}</p>
                  </div>

                </div>
                <div className="bg-mist-100 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <Users size={30} className="text-mist-400 bg-neutral-200 rounded-full p-1.5" />
                  <div>
                    <p className="text-sm font-bold text-mist-900 mt-1">Guests</p>
                    <p className="text-sm text-mist-500">{villa.guests}</p>
                  </div>

                </div>
                <div className="bg-mist-100 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <Maximize2 size={30} className="text-mist-400 bg-neutral-200 rounded-full p-1.5" />
                  <div>
                    <p className="text-sm font-bold text-mist-900 mt-1">Sq.ft</p>
                    <p className="text-sm text-mist-500">{villa.sqft?.toLocaleString()}</p>
                  </div>

                </div>
                <div className="bg-mist-100 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <Bath size={30} className="text-mist-400 bg-neutral-200 rounded-full p-1.5" />
                  <div>
                    <p className="text-sm font-bold text-mist-900 mt-1">Bathrooms</p>
                    <p className="text-sm text-mist-500">{villa.bathrooms}</p>
                  </div>

                </div>
              </div>

              {/* Amenities */}
              {/* Description + Amenities */}
              <div className="pt-6 border-t border-mist-200">

                {/* Title + Description */}
                <h2 className="text-xl font-bold text-mist-900 mb-3">Rent a {villa.name}</h2>

                {villa.description && (
                  <div className="mb-5">
                    <p className={`text-sm text-mist-600 leading-relaxed ${!showFullDesc ? "line-clamp-4" : ""}`}>
                      {villa.description}
                    </p>
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="flex items-center gap-1 text-sm font-semibold text-mist-900 underline underline-offset-2 mt-2 hover:text-mist-600 transition-colors"
                    >
                      {showFullDesc ? "Show less" : "Show more"}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                {/* What this place offers */}
                {amenitiesList.length > 0 && (
                  <div className="py-6 border-t border-mist-200">
                    <h2 className="text-xl font-bold text-mist-900 mb-4">What this place offers</h2>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {amenitiesList.slice(0, showAllAmenities ? amenitiesList.length : 10).map((amenity, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <BedDouble size={20} className="text-mist-500 flex-shrink-0" />
                          <span className="text-sm text-mist-700">{amenity}</span>
                        </div>
                      ))}
                    </div>

                    {amenitiesList.length > 10 && !showAllAmenities && (
                      <button
                        onClick={() => setShowAllAmenities(true)}
                        className="border border-mist-300 rounded-lg px-5 py-2.5 text-sm font-semibold text-mist-800 hover:bg-mist-50 transition-colors"
                      >
                        Show all {amenitiesList.length} amenities
                      </button>
                    )}
                  </div>
                )}

              </div>

              {/* Best For */}
              <div className="py-6 border-t border-mist-200">
                <h2 className="text-xl font-bold text-mist-900 mb-4">Best For</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    "Weddings",
                    "Luxury stays",
                    "Family vacations",
                    "Corporate retreats",
                    "Wellness retreats",
                    "Photoshoots",
                    "Extended stays",
                    "Starry night vacations",
                    "Private gatherings & parties",
                    "TV & Film Production",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-mist-200 border border-gray-300 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm text-mist-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Best For */}
              <div className="py-6 border-t border-mist-200">
                <h2 className="text-xl font-bold text-mist-900 mb-4">Add-Ons</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    "Private chef",
                    "Security Service",
                    "Mixologist",
                    "Airport Transfer (Luxury SUV)",
                    "Wellness retreats",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <BedDouble size={20} className="text-mist-500 flex-shrink-0" />
                      <span className="text-sm text-mist-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>


            </div>

            {/* Right Column — Booking Sidebar */}
            {/* CRITICAL FIX: The sticky wrapper is OUTSIDE the conditional forms */}
            <div className="lg:w-[380px] flex-shrink-0 lg:self-start">
              <div className="lg:sticky lg:top-[80px]">
                {/* Header - Always visible */}
                <div className="mb-8">
                  <h1 className="text-3xl font-semibold text-mist-900 mb-2">{villa.name}</h1>
                  {villa.address && (
                    <div className="flex items-center gap-1.5 text-sm text-mist-500 mb-4">
                      <MapPin size={14} /> {villa.address}
                    </div>
                  )}
                  {villa.shortDescription && (
                    <p className="text-mist-600 text-base leading-relaxed mb-4">{villa.shortDescription}</p>
                  )}

                  {/* Tabs */}
                  <div className="flex gap-2 justify-between my-6">
                    {TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full py-2 rounded-md text-sm transition-all ${activeTab === tab
                          ? "bg-neutral-500 text-white"
                          : "text-mist-500 hover:text-mist-700 bg-neutral-200 hover:bg-neutral-200"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FORMS CONTAINER - Only ONE form rendered at a time */}
                {activeTab === "Stay" && (
                  <div className="bg-white border border-mist-300 rounded-lg p-5 space-y-5 shadow-lg">
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
                      {/* <span className="text-sm text-mist-400 line-through">${villa.originalPrice?.toLocaleString()} </span> */}
                      <span className="text-sm text-mist-400">USD / night</span>
                    </div>
                    {/* Date + Time Rows */}
                    <div className="space-y-3 border-t border-mist-300 pt-6">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400"
                          placeholder="Start date*"
                        />
                        <input
                          type="time"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400"
                          placeholder="Time*"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400"
                          placeholder="End date*"
                        />
                        <input
                          type="time"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400"
                          placeholder="Time*"
                        />
                      </div>
                    </div>

                    {/* Guests */}
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400"
                    >
                      <option value="" disabled>Number of Guests</option>
                      {Array.from({ length: villa.guests }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Guest{i > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>

                    {/* Add-Ons */}
                    <div className="space-y-3">
                      <p className="text-[15px] font-bold text-mist-900">
                        Add-Ons <span className="font-normal italic text-mist-500 text-sm">(optional)</span>
                      </p>

                      {/* Airport Transfer */}
                      <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            checked={airportTransfer}
                            onChange={(e) => setAirportTransfer(e.target.checked)}
                            className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                          />
                          <span className="text-sm text-mist-700">Airport Transfer (Luxury SUV)</span>
                        </div>
                        <span className="text-sm font-bold text-mist-900">$500</span>
                      </label>

                      {/* Private Chef */}
                      <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            checked={privateChef}
                            onChange={(e) => setPrivateChef(e.target.checked)}
                            className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                          />
                          <span className="text-sm text-mist-700">Private Chef</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-mist-900">Price TBD</span>
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#9CA3AF" />
                            <text x="8" y="12" textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="serif" fontStyle="italic">i</text>
                          </svg>
                        </div>
                      </label>

                      {/* Security Service */}
                      <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            checked={securityService}
                            onChange={(e) => setSecurityService(e.target.checked)}
                            className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                          />
                          <span className="text-sm text-mist-700">Security Service</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-mist-900">Price TBD</span>
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8" cy="8" r="7.5" stroke="#9CA3AF" />
                            <text x="8" y="12" textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="serif" fontStyle="italic">i</text>
                          </svg>
                        </div>
                      </label>
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams({
                          type: "villa",
                          villa: villa.slug,
                          ...(checkIn && { checkIn }),
                          ...(checkOut && { checkOut }),
                          ...(guestCount > 1 && { guests: String(guestCount) }),
                          ...(airportTransfer && { airportTransfer: "1" }),
                          ...(privateChef && { privateChef: "1" }),
                          ...(securityService && { securityService: "1" }),
                        });
                        router.push(`/booking?${params.toString()}`);
                      }}
                      className="w-full bg-neutral-500 hover:bg-mist-700 transition text-white py-3.5 rounded-md font-semibold text-sm tracking-wide"
                    >
                      Next
                    </button>
                  </div>
                )}

                {activeTab === "Event" && (
                  <div className="bg-white border border-mist-300 rounded-lg p-5 space-y-5 shadow-lg">

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
                      {/* <span className="text-sm text-mist-400 line-through">${villa.originalPrice?.toLocaleString()} </span> */}
                      <span className="text-sm text-mist-400">USD / night</span>
                    </div>


                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-3 border-t border-mist-300 pt-6">
                      <div>
                        <label className="text-xs text-mist-500 block mb-1.5">First Name</label>
                        <input
                          type="text"
                          placeholder="Enter your first name"
                          value={eventForm.firstName}
                          onChange={(e) => setEventForm({ ...eventForm, firstName: e.target.value })}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-mist-500 block mb-1.5">Last Name</label>
                        <input
                          type="text"
                          placeholder="Enter your last name"
                          value={eventForm.lastName}
                          onChange={(e) => setEventForm({ ...eventForm, lastName: e.target.value })}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs text-mist-500 block mb-1.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={eventForm.email}
                        onChange={(e) => setEventForm({ ...eventForm, email: e.target.value })}
                        className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-xs text-mist-500 block mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +1 (310) 987-6543"
                        value={eventForm.phone}
                        onChange={(e) => setEventForm({ ...eventForm, phone: e.target.value })}
                        className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                      />
                    </div>

                    {/* Event Type & Date */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-mist-500 block mb-1.5">Event Type</label>
                        <select
                          value={eventForm.eventType}
                          onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 appearance-none focus:outline-none focus:border-mist-400"
                        >
                          <option value="">Event Type</option>
                          {["Birthday", "Corporate", "Wedding", "Film Shoot", "Private Party", "Other"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-mist-500 block mb-1.5">Event Date</label>
                        <input
                          type="date"
                          value={eventForm.eventDate}
                          onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400"
                        />
                      </div>
                    </div>

                    {/* Number of Guests */}
                    <div>
                      <label className="text-xs text-mist-500 block mb-1.5">Number of Guests</label>
                      <input
                        type="number"
                        placeholder="e.g. 120"
                        value={eventForm.guestCount}
                        onChange={(e) => setEventForm({ ...eventForm, guestCount: e.target.value })}
                        className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                      />
                    </div>

                    {/* Add-ons */}
                    <div className="space-y-2">
                      <p className="text-[15px] font-bold text-mist-900">
                        Add-ons <span className="font-normal italic text-mist-500 text-sm">(Optional)</span>
                      </p>
                      {["Valet Parking", "Security", "Mixologist", "Drivers"].map((addon) => (
                        <label key={addon} className="flex items-center gap-3 border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                          <input
                            type="radio"
                            checked={eventForm.addOns.includes(addon)}
                            onChange={() => toggleEventAddon(addon)}
                            className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                          />
                          <span className="text-sm text-mist-700">{addon}</span>
                        </label>
                      ))}
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="text-xs text-mist-500 block mb-1.5">Special Requests / Notes</label>
                      <textarea
                        placeholder="Tell us more about your event ...."
                        value={eventForm.specialRequests}
                        onChange={(e) => setEventForm({ ...eventForm, specialRequests: e.target.value })}
                        rows={3}
                        className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400 resize-none"
                      />
                    </div>

                    {/* Request Quote Button */}
                    <button
                      onClick={() => router.push(`/booking?type=event&villa=${villa.slug}`)}
                      className="w-full bg-neutral-500 hover:bg-mist-700 transition text-white py-3.5 rounded-md font-semibold text-sm tracking-wide"
                    >
                      Request Quote
                    </button>
                  </div>
                )}

                {activeTab === "Production" && (
                  <div className="bg-white border border-mist-300 rounded-lg p-5 space-y-5 shadow-lg">
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
                      {/* <span className="text-sm text-mist-400 line-through">${villa.originalPrice?.toLocaleString()} </span> */}
                      <span className="text-sm text-mist-400">USD / night</span>
                    </div>


                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-3 border-t border-mist-300 pt-6">
                      <div>
                        <label className="text-xs text-mist-500 block mb-1.5">First Name</label>
                        <input
                          type="text"
                          placeholder="Enter your first name"
                          value={productionForm.firstName}
                          onChange={(e) => setProductionForm({ ...productionForm, firstName: e.target.value })}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-mist-500 block mb-1.5">Last Name</label>
                        <input
                          type="text"
                          placeholder="Enter your last name"
                          value={productionForm.lastName}
                          onChange={(e) => setProductionForm({ ...productionForm, lastName: e.target.value })}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs text-mist-500 block mb-1.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={productionForm.email}
                        onChange={(e) => setProductionForm({ ...productionForm, email: e.target.value })}
                        className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-xs text-mist-500 block mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +1 (310) 987-6543"
                        value={productionForm.phone}
                        onChange={(e) => setProductionForm({ ...productionForm, phone: e.target.value })}
                        className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                      />
                    </div>

                    {/* Project Type & Shoot Date */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-mist-500 block mb-1.5">Project Type</label>
                        <select
                          value={productionForm.projectType}
                          onChange={(e) => setProductionForm({ ...productionForm, projectType: e.target.value })}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 appearance-none focus:outline-none focus:border-mist-400"
                        >
                          <option value="">Project Type</option>
                          {["Feature Film", "TV Series", "Commercial", "Music Video", "Documentary", "Photo Shoot"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-mist-500 block mb-1.5">Shoot Date</label>
                        <input
                          type="date"
                          value={productionForm.shootDate}
                          onChange={(e) => setProductionForm({ ...productionForm, shootDate: e.target.value })}
                          className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400"
                        />
                      </div>
                    </div>

                    {/* Crew Size */}
                    <div>
                      <label className="text-xs text-mist-500 block mb-1.5">Crew Size</label>
                      <input
                        type="number"
                        placeholder="e.g. 120"
                        value={productionForm.crewSize}
                        onChange={(e) => setProductionForm({ ...productionForm, crewSize: e.target.value })}
                        className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                      />
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="text-xs text-mist-500 block mb-1.5">Special Requests / Notes</label>
                      <textarea
                        placeholder="Tell us more about your project ...."
                        value={productionForm.specialRequests}
                        onChange={(e) => setProductionForm({ ...productionForm, specialRequests: e.target.value })}
                        rows={3}
                        className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400 resize-none"
                      />
                    </div>

                    {/* Request Quote Button */}
                    <button
                      onClick={() => router.push(`/booking?type=production&villa=${villa.slug}`)}
                      className="w-full bg-neutral-500 hover:bg-mist-700 transition text-white py-3.5 rounded-md font-semibold text-sm tracking-wide"
                    >
                      Request Quote
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Villas */}
          {relatedVillas.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-mist-900 mb-6">More Luxury Villas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedVillas.map((rv) => (
                  <Link href={`/villas/${rv.slug}`} key={rv.id} className="group">
                    <div className="relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                      <div className="relative h-56 overflow-hidden">
                        {rv.image ? (
                          <img src={rv.image} alt={rv.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                      </div>
                      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4">
                        <p className="text-[10px] text-mist-400 font-medium tracking-wide uppercase truncate">
                          Luxury Villa | {rv.location}
                        </p>
                        <h3 className="text-[15px] font-semibold text-mist-900 leading-snug">{rv.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-3 text-xs text-mist-500">
                            <span className="flex items-center gap-1"><BedDouble size={12} /> {rv.bedrooms}</span>
                            <span className="flex items-center gap-1"><Users size={12} /> {rv.guests}</span>
                            <span className="flex items-center gap-1"><Maximize2 size={12} /> {formatSqft(rv.sqft)}</span>
                          </div>
                          <span className="text-[15px] font-bold text-mist-900">${rv.pricePerNight.toLocaleString()}<span className="text-[10px] text-mist-400 font-normal">/night</span></span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sections */}
      <WhyChooseUs />
      <Reviews />
      <FAQ />
    </div>
  )
}