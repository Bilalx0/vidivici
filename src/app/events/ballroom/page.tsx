"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  MapPin,
  Share2,
  Bookmark,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  Sparkles,
  Award,
  Navigation,
  Headset,
} from "lucide-react"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"

/* ================================================================== */
/*  Static Data                                                        */
/* ================================================================== */

const HERO_IMAGE = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80"

const WHY_CHOOSE = [
  { icon: Building2, title: "Historic 1914 Architecture", desc: "Original 1914 theatre structure & preserved details." },
  { icon: Users, title: "Large Capacity", desc: "Designed for audiences up to 1,600 (depending on setup)." },
  { icon: Sparkles, title: "Event Versatility", desc: "Ideal for weddings, concerts, galas & productions." },
  { icon: Award, title: "Prestigious History", desc: "Former home of LA Philharmonic's first season." },
  { icon: Navigation, title: "Prime Downtown LA Location", desc: "Located on Grand Ave, near LA's top hotels and attractions." },
  { icon: Headset, title: "Dedicated Support Team", desc: "Experienced coordinators for seamless planning." },
]

const EVENT_TYPES = [
  { title: "Weddings & Receptions", desc: "Romantic architecture and grandeur for unforgettable celebrations.", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
  { title: "Corporate Events & Conferences", desc: "A prestigious setting for conferences, launches, and corporate galas.", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
  { title: "Galas, Award Nights & Charity Events", desc: "An iconic stage for high-profile charity events and award ceremonies.", image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&q=80" },
  { title: "Private Parties & Celebrations", desc: "Perfect for birthdays, anniversaries, and exclusive private events.", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80" },
  { title: "Film & Production Shoots", desc: "A cinematic backdrop for film, TV, and music productions.", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80" },
]

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  "https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80",
  "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&q=80",
  "https://images.unsplash.com/photo-1574790398664-0cb03be48335?w=600&q=80",
]

const BUDGET_OPTIONS = ["Under $5,000", "$5,000 - $15,000", "$15,000 - $30,000", "$30,000 - $50,000", "$50,000+"]
const ADD_ONS = ["Chauffeur / Party Bus", "Security / Bodyguard"]

/* ================================================================== */
/*  Booking Form                                                       */
/* ================================================================== */
function VenueBookingForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    clubVenue: "Trinity Ballroom", bookingDate: "",
    guestsTotal: "", budget: "", addOns: [] as string[], specialRequests: "",
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
    if (!form.firstName || !form.email || !form.bookingDate) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/event-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: null,
          firstName: form.firstName, lastName: form.lastName,
          email: form.email, phone: form.phone,
          clubVenue: form.clubVenue, bookingDate: form.bookingDate,
          guestsTotal: form.guestsTotal, budget: form.budget,
          addOns: form.addOns.join(", "), specialRequests: form.specialRequests,
        }),
      })
      if (res.ok) setSubmitted(true)
    } catch { /* silently fail */ } finally { setSubmitting(false) }
  }

  return (
    <section className="bg-mist-50 py-16 px-4" id="booking-form">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 bg-white rounded-3xl overflow-hidden shadow-sm">
          <div className="lg:col-span-2 bg-mist-900 text-white p-8 flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Have questions or want to book your luxury experience?</h3>
              <p className="text-sm text-white/70 leading-relaxed">Our team is here to assist you with villas, cars, and VIP events across Los Angeles.</p>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-3"><Phone size={18} className="text-white/60 mt-0.5" /><div><p className="font-semibold text-sm">Phone</p><p className="text-sm text-white/70">(310) 555-0991</p></div></div>
              <div className="flex items-start gap-3"><Mail size={18} className="text-white/60 mt-0.5" /><div><p className="font-semibold text-sm">Email</p><p className="text-sm text-white/70">admin@vidivicirental.com</p></div></div>
              <div className="flex items-start gap-3"><MapPin size={18} className="text-white/60 mt-0.5" /><div><p className="font-semibold text-sm">Address</p><p className="text-sm text-white/70">851 S Grand Ave, Los Angeles CA 90017</p></div></div>
              <div className="flex items-start gap-3"><Clock size={18} className="text-white/60 mt-0.5" /><div><p className="font-semibold text-sm">Working Hours</p><p className="text-sm text-white/70">Mon-Sun: 8 AM – 8 PM</p></div></div>
            </div>
          </div>
          <div className="lg:col-span-3 p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-mist-900 mb-2">Booking Request Submitted!</h3>
                <p className="text-sm text-mist-500">Our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-mist-900 mb-6">VIP Venue Booking Request</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Full Name</label><input type="text" placeholder="Enter your full name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" /></div>
                    <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Last Name</label><input type="text" placeholder="Enter your last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Email Address</label><input type="email" placeholder="Enter your email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" /></div>
                    <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Phone</label><input type="tel" placeholder="Enter your phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Select Venue</label><input type="text" value={form.clubVenue} readOnly className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 bg-mist-50 focus:outline-none" /></div>
                    <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Booking Date</label><input type="date" value={form.bookingDate} onChange={(e) => setForm({ ...form, bookingDate: e.target.value })} className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Guests (Total &amp; Ratio)</label><input type="text" placeholder="e.g. 200 guests" value={form.guestsTotal} onChange={(e) => setForm({ ...form, guestsTotal: e.target.value })} className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" /></div>
                    <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Budget</label><select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="w-full appearance-none border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none"><option value="">Select your budget range</option>{BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mist-500 block mb-1.5">Add-Ons</label>
                    <div className="flex flex-wrap gap-3">
                      {ADD_ONS.map((addon) => (
                        <label key={addon} className="flex items-center gap-2 cursor-pointer">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${form.addOns.includes(addon) ? "border-blue-600" : "border-mist-300"}`}>
                            {form.addOns.includes(addon) && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                          </div>
                          <span className="text-sm text-mist-600">{addon}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div><label className="text-xs font-medium text-mist-500 block mb-1.5">Special Requests / Notes</label><textarea placeholder="e.g. Stage setup, catering needs, AV requirements..." value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} rows={3} className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none resize-none" /></div>
                  <button onClick={handleSubmit} disabled={submitting || !form.firstName || !form.email || !form.bookingDate} className="w-full bg-mist-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {submitting ? "Submitting..." : "Submit Booking Request"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  Event Types Carousel                                               */
/* ================================================================== */
function EventTypesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" })
  }

  return (
    <section className="bg-white py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-mist-900 text-center mb-10">Perfect for Every Prestigious Event</h2>
        <div className="relative">
          <button onClick={() => scroll("left")} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
            {EVENT_TYPES.map((et) => (
              <div key={et.title} className="flex-shrink-0 w-[280px] relative rounded-2xl overflow-hidden group cursor-pointer h-56">
                <img src={et.image} alt={et.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-sm font-bold text-white mb-0.5">{et.title}</h3>
                  <p className="text-[11px] text-white/70 line-clamp-2">{et.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => scroll("right")} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  Ballroom Page                                                      */
/* ================================================================== */
export default function BallroomPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-mist-400">
            <Link href="/" className="hover:text-mist-700">Los Angeles</Link>
            <span>&gt;</span>
            <Link href="/events" className="hover:text-mist-700">Event</Link>
            <span>&gt;</span>
            <span className="text-mist-700">Ballroom</span>
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

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 mb-14">
        <div className="relative rounded-2xl overflow-hidden h-[420px] lg:h-[500px]">
          <img src={HERO_IMAGE} alt="Trinity Ballroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">A Historic Downtown LA Ballroom Reborn</h1>
            <p className="text-sm text-white/80 mb-2 max-w-xl">Where a 1914 cultural landmark awakens for today&apos;s most unforgettable events.</p>
            <div className="flex items-center gap-1.5 text-white/70 text-sm mb-5">
              <MapPin size={14} /> 851 S Grand Ave, Los Angeles
            </div>
            <button
              onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white text-mist-900 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-mist-100 transition-colors"
            >
              Request a Quote
            </button>
          </div>
        </div>
      </div>

      {/* History / About Section */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="grid grid-cols-2 gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" alt="Ballroom exterior" className="w-full h-48 object-cover rounded-xl" />
              <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&q=80" alt="Ballroom interior" className="w-full h-48 object-cover rounded-xl" />
              <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80" alt="Ballroom detail" className="w-full h-48 object-cover rounded-xl col-span-2" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-mist-900 mb-4">A Landmark Born in 1914 — Reborn for Today</h2>
              <div className="space-y-3 text-sm text-mist-600 leading-relaxed">
                <p>
                  Originally constructed in <strong>1914</strong>, the Trinity Building was celebrated as an architectural masterpiece in Downtown Los Angeles. Hidden within its walls was a <strong>1,600-seat auditorium</strong> that quickly became one of the city&apos;s most important cultural hubs.
                </p>
                <p>
                  In 1919, it hosted the <strong>LA Philharmonic&apos;s first season</strong>, marking its place in music history. The venue also housed the largest pipe organ installation on the West Coast, making it a destination for <strong>operas, orchestras, and jazz concerts</strong>.
                </p>
                <p>
                  Now restored for a new era, this historic celebration venue combines heritage grandeur with modern amenities — a stunning backdrop for events that demand the extraordinary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-mist-50 py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-mist-900 mb-2">Why Choose the Trinity Ballroom</h2>
          <p className="text-sm text-mist-500 mb-10 max-w-lg mx-auto">A rare blend of heritage, elegance, and scale — crafted for extraordinary events.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-2xl p-6 text-left border border-mist-100">
                  <div className="w-10 h-10 bg-mist-50 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={20} className="text-mist-600" />
                  </div>
                  <h3 className="text-sm font-bold text-mist-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-mist-500 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Event Types Carousel */}
      <EventTypesCarousel />

      {/* Gallery — Bento Grid */}
      <section className="bg-mist-50 py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-mist-900 mb-2">Gallery</h2>
          <p className="text-sm text-mist-500 mb-8 max-w-md mx-auto">A glimpse inside the historic architecture and evolving restoration of the Trinity Ballroom.</p>
          <div className="grid grid-cols-3 grid-rows-3 gap-3 auto-rows-[180px]">
            {/* Row 1: 1 tall left + 2x2 center-right */}
            <div className="row-span-2">
              <img src={GALLERY_IMAGES[0]} alt="Gallery 1" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="col-span-1">
              <img src={GALLERY_IMAGES[1]} alt="Gallery 2" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="row-span-2">
              <img src={GALLERY_IMAGES[2]} alt="Gallery 3" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="col-span-1">
              <img src={GALLERY_IMAGES[3]} alt="Gallery 4" className="w-full h-full object-cover rounded-xl" />
            </div>
            {/* Row 3 */}
            <div>
              <img src={GALLERY_IMAGES[4]} alt="Gallery 5" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <img src={GALLERY_IMAGES[5]} alt="Gallery 6" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <img src={GALLERY_IMAGES[6]} alt="Gallery 7" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* VIP Venue Booking Form */}
      <VenueBookingForm />

      {/* Reusable Sections */}
      <FAQ />
      <Reviews />
    </div>
  )
}
