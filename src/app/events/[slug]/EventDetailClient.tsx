"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Share2,
  Bookmark,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"

interface EventImage {
  url: string
  alt: string | null
}

interface EventDetail {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  location: string
  address: string | null
  category: string
  venueName: string | null
  capacity: number
  priceRange: string | null
  dressCode: string | null
  highlights: string | null
  experience: string | null
  images: EventImage[]
}

interface RelatedEvent {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  location: string
  category: string
  image: string | null
}

const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
]

const ADD_ONS = ["Chauffeur / Party Bus", "Security / Bodyguard"]

export default function EventDetailClient({ event, relatedEvents }: { event: EventDetail; relatedEvents: RelatedEvent[] }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    clubVenue: event.name,
    bookingDate: "",
    guestsTotal: "",
    budget: "",
    addOns: [] as string[],
    specialRequests: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const images = event.images.length > 0
    ? event.images
    : [{ url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80", alt: "Event" }]

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  const highlightsList = event.highlights
    ? event.highlights.split("|").map((h) => h.trim()).filter(Boolean)
    : []

  const toggleAddOn = (addon: string) => {
    setBookingForm((f) => ({
      ...f,
      addOns: f.addOns.includes(addon) ? f.addOns.filter((a) => a !== addon) : [...f.addOns, addon],
    }))
  }

  const handleBookingSubmit = async () => {
    if (!bookingForm.firstName || !bookingForm.email || !bookingForm.bookingDate) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/event-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          firstName: bookingForm.firstName,
          lastName: bookingForm.lastName,
          email: bookingForm.email,
          phone: bookingForm.phone,
          clubVenue: bookingForm.clubVenue,
          bookingDate: bookingForm.bookingDate,
          guestsTotal: bookingForm.guestsTotal,
          budget: bookingForm.budget,
          addOns: bookingForm.addOns.join(", "),
          specialRequests: bookingForm.specialRequests,
        }),
      })
      if (res.ok) setSubmitted(true)
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-mist-400">
            <Link href="/" className="hover:text-mist-700">Los Angeles</Link>
            <span>&gt;</span>
            <Link href="/events" className="hover:text-mist-700">Events</Link>
            <span>&gt;</span>
            <span className="text-mist-700">{event.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-xs text-mist-500 hover:text-mist-700 transition-colors">
              <Share2 size={14} /> Share
            </button>
            <button className="flex items-center gap-1.5 text-xs text-mist-500 hover:text-mist-700 transition-colors">
              <Bookmark size={14} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image with Event Title */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={images[currentImage].url}
            alt={images[currentImage].alt || event.name}
            className="w-full h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{event.name}</h1>
            {event.shortDescription && (
              <p className="text-sm text-white/80 max-w-xl">{event.shortDescription}</p>
            )}
          </div>
          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <button className="absolute bottom-6 right-6 bg-mist-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-mist-700 transition-colors">
            Reserve Now
          </button>
        </div>
      </div>

      {/* Why Choose Section */}
      {highlightsList.length > 0 && (
        <section className="bg-white py-14 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-mist-900 mb-2">Why Choose {event.name}?</h2>
            {event.shortDescription && (
              <p className="text-sm text-mist-500 mb-10 max-w-xl mx-auto">{event.shortDescription}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlightsList.map((highlight, i) => {
                const parts = highlight.split(":")
                const title = parts[0]?.trim()
                const desc = parts[1]?.trim() || ""
                return (
                  <div key={i} className="bg-mist-50 rounded-2xl p-6 text-left">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                      <svg className="w-5 h-5 text-mist-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-mist-900 mb-1">{title}</h3>
                    {desc && <p className="text-xs text-mist-500 leading-relaxed">{desc}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* The Experience Section */}
      {event.experience && (
        <section className="bg-mist-50 py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                {images.length > 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {images.slice(0, 4).map((img, i) => (
                      <img key={i} src={img.url} alt={img.alt || event.name} className="w-full h-48 object-cover rounded-xl" />
                    ))}
                  </div>
                )}
                {images.length <= 1 && (
                  <img src={images[0].url} alt={event.name} className="w-full h-80 object-cover rounded-xl" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-mist-900 mb-4">The {event.name} Experience</h2>
                <div className="space-y-3 text-sm text-mist-600 leading-relaxed">
                  {event.experience.split("\n").filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {event.dressCode && (
                  <div className="mt-6 p-4 bg-white rounded-xl border border-mist-100">
                    <h3 className="text-sm font-bold text-mist-900 mb-1">Dress Code</h3>
                    <p className="text-xs text-mist-500">{event.dressCode}</p>
                  </div>
                )}
                <button
                  onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-6 bg-mist-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-mist-700 transition-colors"
                >
                  Reserve Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VIP Club Booking Request Form */}
      <section className="bg-mist-50 py-16 px-4" id="booking-form">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 bg-white rounded-3xl overflow-hidden shadow-sm">
            {/* Left: Contact Info */}
            <div className="lg:col-span-2 bg-mist-900 text-white p-8 flex flex-col justify-center space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-2">Have questions or want to book your luxury experience?</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Our team is here to assist you with villas, cars, and VIP events across Los Angeles.
                </p>
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-white/60 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-sm text-white/70">(310) 555-0991</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-white/60 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-sm text-white/70">admin@vidivicirental.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-white/60 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Address</p>
                    <p className="text-sm text-white/70">8687 Melrose Ave, Los Angeles CA 90069, United States</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-white/60 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Working Hours</p>
                    <p className="text-sm text-white/70">Mon-Sun: 8 AM – 8 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-mist-900 mb-2">Booking Request Submitted!</h3>
                  <p className="text-sm text-mist-500">Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-mist-900 mb-6">VIP Club Booking Request</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-mist-500 block mb-1.5">Full Name</label>
                        <input type="text" placeholder="Enter your full name" value={bookingForm.firstName}
                          onChange={(e) => setBookingForm({ ...bookingForm, firstName: e.target.value })}
                          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-mist-500 block mb-1.5">Last Name</label>
                        <input type="text" placeholder="Enter your last name" value={bookingForm.lastName}
                          onChange={(e) => setBookingForm({ ...bookingForm, lastName: e.target.value })}
                          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-mist-500 block mb-1.5">Email Address</label>
                        <input type="email" placeholder="Enter your email address" value={bookingForm.email}
                          onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-mist-500 block mb-1.5">Phone</label>
                        <input type="tel" placeholder="Enter your phone number" value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-mist-500 block mb-1.5">Select Club / Event</label>
                        <select value={bookingForm.clubVenue}
                          onChange={(e) => setBookingForm({ ...bookingForm, clubVenue: e.target.value })}
                          className="w-full appearance-none border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none">
                          <option value={event.name}>{event.name}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-mist-500 block mb-1.5">Booking Date</label>
                        <input type="date" value={bookingForm.bookingDate}
                          onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-mist-500 block mb-1.5">Guests (Total &amp; Ratio)</label>
                        <input type="text" placeholder="e.g. 8 guests – 4M / 2F" value={bookingForm.guestsTotal}
                          onChange={(e) => setBookingForm({ ...bookingForm, guestsTotal: e.target.value })}
                          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-mist-500 block mb-1.5">Budget</label>
                        <select value={bookingForm.budget}
                          onChange={(e) => setBookingForm({ ...bookingForm, budget: e.target.value })}
                          className="w-full appearance-none border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none">
                          <option value="">Select your budget range</option>
                          {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-mist-500 block mb-1.5">Add-Ons</label>
                      <div className="flex flex-wrap gap-3">
                        {ADD_ONS.map((addon) => (
                          <label key={addon} className="flex items-center gap-2 cursor-pointer">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              bookingForm.addOns.includes(addon) ? "border-blue-600" : "border-mist-300"
                            }`}>
                              {bookingForm.addOns.includes(addon) && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                            </div>
                            <span className="text-sm text-mist-600">{addon}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-mist-500 block mb-1.5">Special Requests / Notes</label>
                      <textarea placeholder="e.g. Birthday celebration, bottle preferences, etc." value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })} rows={3}
                        className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none resize-none" />
                    </div>

                    <button onClick={handleBookingSubmit}
                      disabled={submitting || !bookingForm.firstName || !bookingForm.email || !bookingForm.bookingDate}
                      className="w-full bg-mist-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      {submitting ? "Submitting..." : "Submit Booking Request"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="bg-white py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-mist-900 mb-6">Elevate Your Night</h2>
            <p className="text-sm text-mist-500 mb-8">Make your Vidi Vici experience even more extraordinary with our other exclusive venues.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((re) => (
                <Link key={re.id} href={`/events/${re.slug}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden h-64">
                    {re.image ? (
                      <img src={re.image} alt={re.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-white mb-1">{re.name}</h3>
                      {re.shortDescription && (
                        <p className="text-xs text-white/80 line-clamp-2">{re.shortDescription}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reusable sections */}
      <WhyChooseUs />
      <Reviews />
      <FAQ />
    </div>
  )
}
