"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, BedDouble, Users, Bath, Maximize2, MapPin, Plane, ChefHat, Shield, ArrowUpRight, Heart } from "lucide-react"
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
  const [currentImage, setCurrentImage] = useState(0)
  const [activeTab, setActiveTab] = useState<TabType>("Stay")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guestCount, setGuestCount] = useState(1)

  // Add-ons
  const [airportTransfer, setAirportTransfer] = useState(false)
  const [privateChef, setPrivateChef] = useState(false)
  const [securityService, setSecurityService] = useState(false)

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

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 text-xs text-mist-400">
          <Link href="/" className="hover:text-mist-700">Home</Link>
          <span>/</span>
          <Link href="/villas" className="hover:text-mist-700">Villas</Link>
          <span>/</span>
          <span className="text-mist-700">{villa.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column */}
          <div className="flex-1">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <img
                src={images[currentImage].url}
                alt={images[currentImage].alt || villa.name}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-white w-5" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? "border-mist-900" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-mist-100 rounded-xl p-1 w-fit">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab ? "bg-white text-mist-900 shadow-sm" : "text-mist-500 hover:text-mist-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Villa Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-mist-900 mb-2">{villa.name}</h1>
              {villa.address && (
                <div className="flex items-center gap-1.5 text-sm text-mist-500 mb-4">
                  <MapPin size={14} /> {villa.address}
                </div>
              )}
              {villa.shortDescription && (
                <p className="text-mist-600 text-sm leading-relaxed mb-4">{villa.shortDescription}</p>
              )}
              {villa.description && (
                <p className="text-mist-500 text-sm leading-relaxed">{villa.description}</p>
              )}
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-mist-50 rounded-xl p-4 text-center">
                <BedDouble size={20} className="mx-auto text-mist-400 mb-1" />
                <p className="text-xs text-mist-400">Bedrooms</p>
                <p className="text-lg font-bold text-mist-900">{villa.bedrooms}</p>
              </div>
              <div className="bg-mist-50 rounded-xl p-4 text-center">
                <Bath size={20} className="mx-auto text-mist-400 mb-1" />
                <p className="text-xs text-mist-400">Bathrooms</p>
                <p className="text-lg font-bold text-mist-900">{villa.bathrooms}</p>
              </div>
              <div className="bg-mist-50 rounded-xl p-4 text-center">
                <Users size={20} className="mx-auto text-mist-400 mb-1" />
                <p className="text-xs text-mist-400">Guests</p>
                <p className="text-lg font-bold text-mist-900">{villa.guests}</p>
              </div>
              <div className="bg-mist-50 rounded-xl p-4 text-center">
                <Maximize2 size={20} className="mx-auto text-mist-400 mb-1" />
                <p className="text-xs text-mist-400">Sq.ft</p>
                <p className="text-lg font-bold text-mist-900">{villa.sqft.toLocaleString()}</p>
              </div>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-mist-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity, i) => (
                    <span key={i} className="text-xs bg-mist-50 text-mist-600 px-3 py-1.5 rounded-full border border-mist-100">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add-Ons */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-mist-900 mb-3">Add-Ons</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-mist-50 rounded-xl cursor-pointer hover:bg-mist-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={airportTransfer} onChange={(e) => setAirportTransfer(e.target.checked)} className="accent-mist-900 w-4 h-4" />
                    <Plane size={18} className="text-mist-500" />
                    <div>
                      <p className="text-sm font-medium text-mist-900">Airport Transfer</p>
                      <p className="text-xs text-mist-400">Round-trip luxury chauffeur service</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-mist-900">$500</span>
                </label>
                <label className="flex items-center justify-between p-4 bg-mist-50 rounded-xl cursor-pointer hover:bg-mist-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={privateChef} onChange={(e) => setPrivateChef(e.target.checked)} className="accent-mist-900 w-4 h-4" />
                    <ChefHat size={18} className="text-mist-500" />
                    <div>
                      <p className="text-sm font-medium text-mist-900">Private Chef</p>
                      <p className="text-xs text-mist-400">Personal chef for your stay</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-mist-400">Price TBD</span>
                </label>
                <label className="flex items-center justify-between p-4 bg-mist-50 rounded-xl cursor-pointer hover:bg-mist-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={securityService} onChange={(e) => setSecurityService(e.target.checked)} className="accent-mist-900 w-4 h-4" />
                    <Shield size={18} className="text-mist-500" />
                    <div>
                      <p className="text-sm font-medium text-mist-900">Security Service</p>
                      <p className="text-xs text-mist-400">24/7 professional security detail</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-mist-400">Price TBD</span>
                </label>
              </div>
            </div>

            {/* Info Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="bg-mist-50 border border-mist-100 rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-mist-400">Security Deposit</p>
                <p className="text-sm font-bold text-mist-900">${villa.securityDeposit.toLocaleString()}</p>
              </div>
              <div className="bg-mist-50 border border-mist-100 rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-mist-400">Tax</p>
                <p className="text-sm font-bold text-mist-900">14%</p>
              </div>
              <div className="bg-mist-50 border border-mist-100 rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-mist-400">Cleaning Fee</p>
                <p className="text-sm font-bold text-mist-900">${villa.cleaningFee.toLocaleString()}</p>
              </div>
              <div className="bg-mist-50 border border-mist-100 rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-mist-400">Rental Duration</p>
                <p className="text-sm font-bold text-mist-900">24 hours</p>
              </div>
              <div className="bg-mist-50 border border-mist-100 rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-mist-400">Extra Hour</p>
                <p className="text-sm font-bold text-mist-900">20%</p>
              </div>
              <div className="bg-mist-50 border border-mist-100 rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-mist-400">Extra Hours Rule</p>
                <p className="text-sm font-bold text-mist-900">5 Extra Hours</p>
              </div>
            </div>
          </div>

          {/* Right Column — Booking Sidebar */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="sticky top-6 bg-mist-50 border border-mist-100 rounded-2xl p-6 space-y-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
                  <span className="text-sm text-mist-400"> /night</span>
                </div>
                {villa.location && (
                  <span className="text-xs text-mist-400 flex items-center gap-1"><MapPin size={11} /> {villa.location}</span>
                )}
              </div>

              <div className="h-px bg-mist-200" />

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-mist-400 font-medium block mb-1">CHECK-IN</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-mist-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-mist-400 font-medium block mb-1">CHECK-OUT</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-mist-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="text-[10px] text-mist-400 font-medium block mb-1">GUESTS</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-9 h-9 bg-white border border-mist-200 rounded-lg flex items-center justify-center text-mist-500 hover:border-mist-400 transition-colors text-lg font-medium"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-mist-900 w-8 text-center">{guestCount}</span>
                  <button
                    onClick={() => setGuestCount(Math.min(villa.guests, guestCount + 1))}
                    className="w-9 h-9 bg-white border border-mist-200 rounded-lg flex items-center justify-center text-mist-500 hover:border-mist-400 transition-colors text-lg font-medium"
                  >
                    +
                  </button>
                  <span className="text-xs text-mist-400 ml-1">max {villa.guests}</span>
                </div>
              </div>

              <div className="h-px bg-mist-200" />

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-mist-500">${villa.pricePerNight.toLocaleString()} × {days} night{days > 1 ? "s" : ""}</span>
                  <span className="text-mist-900 font-medium">${nightsTotal.toLocaleString()}</span>
                </div>
                {villa.cleaningFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-mist-500">Cleaning Fee</span>
                    <span className="text-mist-900 font-medium">${villa.cleaningFee.toLocaleString()}</span>
                  </div>
                )}
                {addOnsTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-mist-500">Add-Ons</span>
                    <span className="text-mist-900 font-medium">${addOnsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-mist-500">Tax (14%)</span>
                  <span className="text-mist-900 font-medium">${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {villa.securityDeposit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-mist-500">Security Deposit</span>
                    <span className="text-mist-900 font-medium">${villa.securityDeposit.toLocaleString()}</span>
                  </div>
                )}
                <div className="h-px bg-mist-200" />
                <div className="flex justify-between pt-1">
                  <span className="text-mist-900 font-semibold">Total</span>
                  <span className="text-mist-900 font-bold text-lg">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button className="w-full bg-mist-900 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors">
                Reserve Now
              </button>

              <p className="text-[10px] text-mist-400 text-center">You won&apos;t be charged yet</p>
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

      {/* Bottom Sections */}
      <WhyChooseUs />
      <Reviews />
      <FAQ />
    </div>
  )
}
