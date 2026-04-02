"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Share2,
  Phone,
  Mail,
  Clock,
  Star,
  Heart
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
const VENUE_OPTIONS = [
  "Delilah Los Angeles",
  "Catch LA Rooftop",
  "The Highlight Room",
]

export function VenueBookingForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    clubVenue: "",
    bookingDate: "",
    guestsTotal: "",
    budget: "",
    addOns: [] as string[],
    specialRequests: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleAddOn = (addon: string) => {
    setForm((f) => ({
      ...f,
      addOns: f.addOns.includes(addon)
        ? f.addOns.filter((a) => a !== addon)
        : [...f.addOns, addon],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.bookingDate || !form.clubVenue) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "venue-booking",
          category: "Event",
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          subject: `Venue Booking - ${form.clubVenue}`,
          message: form.specialRequests,
          data: {
            clubVenue: form.clubVenue,
            bookingDate: form.bookingDate,
            guestsTotal: form.guestsTotal,
            budget: form.budget,
            addOns: form.addOns.join(", "),
          },
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reusable input class (matches ContactForm exactly)
  const inputClass = "w-full border border-mist-300 rounded-xl px-4 py-3 2xl:px-8 2xl:py-6 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white";

  return (
    <section className="w-full bg-white py-12 2xl:py-24 sm:px-16 lg:px-20 2xl:px-32 px-6 " id="booking-form">
     
      <div className="border border-mist-200 rounded-3xl 2xl:rounded-[40px] overflow-hidden gap-8 2xl:gap-16 sm:p-8 2xl:sm:p-16 px-4 py-6 2xl:px-8 2xl:py-12 flex flex-col md:flex-row shadow-sm">

        {/* Left Panel - Info */}
        <div className="bg-mist-100 px-4 sm:px-8 2xl:sm:px-12 py-8 2xl:py-12 md:w-1/3 flex-shrink-0 flex flex-col gap-8 2xl:gap-12 relative overflow-hidden rounded-2xl 2xl:rounded-3xl">
           <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none  rotate-180"
            />
          
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl 2xl:text-4xl font-bold text-mist-900 leading-snug mb-3 2xl:mb-5">
              Have questions or want to book your luxury experience?
            </h3>
            <p className="text-sm 2xl:text-xl text-mist-600 leading-relaxed">
              Our team is here to assist you with cars, villas, and VIP events in Los Angeles.
            </p>
          </div>

          <div className="border-t border-mist-300"></div>

          <div className="relative z-10 flex flex-col gap-6">
            <ContactInfo icon={<Phone size={16} />} label="Phone" value="(310) 555-0991" />
            <ContactInfo icon={<Mail size={16} />} label="Email" value="admin@vidivicitrental.com" />
            <ContactInfo icon={<MapPin size={16} />} label="Address" value="851 S Grand Ave, Los Angeles CA 90017" />
            <ContactInfo icon={<Clock size={16} />} label="Working Hours" value="Mon–Sun: 8 AM – 8 PM" />
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 2xl:py-20">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl 2xl:text-4xl font-bold text-mist-900 mb-2">Request Submitted!</h3>
              <p className="text-mist-500 2xl:text-2xl">Our VIP concierge will contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl 2xl:text-6xl font-bold text-mist-900 mb-8 2xl:mb-12 tracking-tight">
                VIP Venue Booking
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 2xl:gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Full Name">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </Field>
                  <Field label="Email Address">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Selected Venue">
                    <div className="relative">
                    <select
                      value={form.clubVenue}
                      onChange={(e) => setForm({ ...form, clubVenue: e.target.value })}
                      className={`${inputClass} appearance-none pr-10`}
                      required
                    >
                      <option value="" disabled>Select venue</option>
                      {VENUE_OPTIONS.map((venue) => (
                        <option key={venue} value={venue}>{venue}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist-400" />
                    </div>
                  </Field>
                  <Field label="Booking Date">
                    <input
                      type="date"
                      value={form.bookingDate}
                      onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Guests (Total)">
                    <input
                      type="text"
                      placeholder="e.g. 50 guests"
                      value={form.guestsTotal}
                      onChange={(e) => setForm({ ...form, guestsTotal: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Budget Range">
                    <div className="relative">
                    <select
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                    >
                      <option value="">Select range</option>
                      {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist-400" />
                    </div>
                  </Field>
                </div>

                <Field label="Add-Ons">
                  <div className="flex flex-wrap gap-3 mt-1">
                    {ADD_ONS.map((addon) => (
                      <button
                        key={addon}
                        type="button"
                        onClick={() => toggleAddOn(addon)}
                        className={`px-4 2xl:px-6 py-2 2xl:py-3 rounded-full text-xs 2xl:text-base font-semibold border transition-all ${form.addOns.includes(addon)
                            ? "bg-mist-900 text-white border-mist-900"
                            : "bg-white text-mist-600 border-mist-200 hover:border-mist-400"
                          }`}
                      >
                        {addon}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Special Requests">
                  <textarea
                    placeholder="Catering needs, AV requirements, etc..."
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-mist-900 text-white font-medium py-4 2xl:py-6 rounded-xl 2xl:rounded-2xl hover:bg-mist-800 transition-colors disabled:opacity-50 mt-2 text-base 2xl:text-2xl"
                >
                  {submitting ? "Processing..." : "Submit Booking Request"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 2xl:gap-4">
      <label className="text-xs 2xl:text-sm font-semibold text-mist-700 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function ContactInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 2xl:gap-6">
      <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-full border border-mist-300 bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm 2xl:text-xl font-bold text-mist-900">{label}</p>
        <p className="text-sm 2xl:text-lg text-mist-600 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}


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
      <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-12 2xl:py-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base 2xl:text-xl text-mist-500">
            <Link href="/" className="hover:text-mist-700">Los Angeles</Link>
            <span>&gt;</span>
            <Link href="/events" className="hover:text-mist-700">Events</Link>
            <span>&gt;</span>
            <span className="text-mist-700 font-medium">{event.name}</span>
          </div>
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1.5 text-base 2xl:text-xl text-mist-500 hover:text-mist-700 transition-colors">
              <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-1.5 text-base 2xl:text-xl text-mist-500 hover:text-mist-700 transition-colors">
              <Heart size={16} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image with Event Title */}
      <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mb-14 2xl:mb-24">
        <div className="relative rounded-[2rem] 2xl:rounded-[48px] overflow-hidden h-[450px] lg:h-[550px] 2xl:h-[760px]">
          <img
            src={images[currentImage].url}
            alt={images[currentImage].alt || event.name}
            className="w-full h-full object-cover"
          />
          
          {/* Darker gradient at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute bottom-12 2xl:bottom-20 left-10 2xl:left-20 right-10 2xl:right-20">
            <h1 className="text-4xl lg:text-5xl 2xl:text-7xl font-semibold text-white mb-3 2xl:mb-5 tracking-tight">
              {event.name}
            </h1>
            {event.shortDescription && (
              <p className="text-base lg:text-lg 2xl:text-3xl text-white/90 mb-8 2xl:mb-12 max-w-xl 2xl:max-w-5xl leading-snug">
                {event.shortDescription}
              </p>
            )}
            
            <button 
               className="bg-white text-black px-10 2xl:px-14 py-3.5 2xl:py-6 rounded-xl 2xl:rounded-2xl text-sm 2xl:text-2xl font-bold hover:bg-gray-100 transition-all shadow-lg"
               onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Reserve Now
            </button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 w-full px-6 flex justify-between pointer-events-none">
              <button 
                onClick={prevImage} 
                className="w-12 h-12 2xl:w-14 2xl:h-14 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all pointer-events-auto text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage} 
                className="w-12 h-12 2xl:w-14 2xl:h-14 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all pointer-events-auto text-white"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

    {/* Why Choose Section */}
{highlightsList.length > 0 && (
  <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-16 2xl:py-28 text-center">
    {/* Header */}
    <h2 className="text-3xl lg:text-4xl 2xl:text-7xl font-bold text-[#1a1a1a] mb-4 2xl:mb-6">
      Why Choose {event.name}?
    </h2>
    <p className="text-gray-600 text-base 2xl:text-2xl max-w-2xl 2xl:max-w-5xl mx-auto mb-12 2xl:mb-20 leading-relaxed">
      {event.shortDescription || "Experience the perfect blend of luxury, entertainment, and world-class service in one unforgettable event."}
    </p>

    {/* Feature Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-10">
      {highlightsList.map((highlight, i) => {
        const parts = highlight.split(":");
        const title = parts[0]?.trim();
        const desc = parts[1]?.trim() || "";

        return (
          <div
            key={i}
            className="bg-[#f5f5f5] p-8 2xl:p-12 rounded-2xl 2xl:rounded-3xl text-left flex flex-col h-full"
          >
            {/* Icon Container */}
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
              {/* Using a generic Star or Check icon to match the aesthetic */}
              <Star size={24} className="text-gray-600" />
            </div>

            {/* Content */}
              <h3 className="text-xl 2xl:text-3xl font-bold text-[#1a1a1a] mb-3 2xl:mb-5">
              {title}
            </h3>
            {desc && (
              <p className="text-gray-600 text-sm 2xl:text-2xl leading-relaxed">
                {desc}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </section>
)}

      {/* The Experience Section */}
{event.experience && (
  <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-16 2xl:py-28 flex flex-col lg:flex-row items-center gap-12 2xl:gap-20 bg-white">
    
    {/* Left Side: Bento Image Grid */}
    <div className="w-full lg:w-1/2 flex gap-4">
      {/* Main Large Image */}
      <div className="w-2/3 h-[450px] lg:h-[500px]">
        <img
          src={images[0]?.url || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000"}
          alt={event.name}
          className="w-full h-full object-cover rounded-[2rem]"
        />
      </div>

      {/* Secondary Vertical Stack */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="h-3/5">
          <img
            src={images[1]?.url || "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600"}
            alt="Interior Details"
            className="w-full h-full object-cover rounded-[2rem]"
          />
        </div>
        <div className="h-2/5">
          <img
            src={images[2]?.url || "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600"}
            alt="Atmosphere"
            className="w-full h-full object-cover rounded-[2rem]"
          />
        </div>
      </div>
    </div>

    {/* Right Side: Content */}
    <div className="w-full lg:w-1/2">
      <h2 className="text-4xl lg:text-5xl 2xl:text-7xl font-bold text-[#1a1a1a] leading-tight mb-4 2xl:mb-6">
        Experience the <br /> {event.name}
      </h2>

      <h3 className="text-lg 2xl:text-3xl font-semibold text-gray-500 mb-6 2xl:mb-8">
        Modern luxury meets classic elegance
      </h3>

      <div className="text-gray-600 2xl:text-2xl leading-relaxed mb-8 2xl:mb-10 max-w-xl 2xl:max-w-4xl space-y-4 2xl:space-y-6">
        {event.experience.split("\n").filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {event.dressCode && (
        <div className="mb-8 p-6 2xl:p-10 bg-[#f5f5f5] rounded-2xl 2xl:rounded-3xl border border-gray-100">
          <h4 className="text-sm 2xl:text-xl font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Dress Code</h4>
          <p className="text-sm 2xl:text-2xl text-gray-600">{event.dressCode}</p>
        </div>
      )}

      <button 
        onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
        className="bg-[#1a1a1a] text-white px-10 2xl:px-14 py-4 2xl:py-6 rounded-xl 2xl:rounded-2xl font-bold 2xl:text-2xl hover:bg-black transition-colors shadow-lg"
      >
        Reserve Now
      </button>
    </div>

  </section>
)}

<section className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-16 2xl:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-10 max-w-[1840px] mx-auto">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <div className="h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=800"
                alt="Delilah Atmosphere"
                className="w-full h-full object-cover rounded-[2rem]"
              />
            </div>
            <div className="bg-[#f5f5f5] p-10 2xl:p-14 rounded-[2rem] 2xl:rounded-[2.5rem] flex-grow">
              <h3 className="text-xl 2xl:text-3xl font-bold text-[#1a1a1a] mb-4 2xl:mb-6">Dress for the Occasion</h3>
              <p className="text-gray-500 text-sm 2xl:text-xl leading-relaxed">
                Delilah's attire is upscale casual chic. Collared shirts are recommended.
                No athletic apparel, shorts, swimwear, flip-flops, or slides. Arrive stylish
                and ready to enjoy an elegant night out.
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#f5f5f5] p-10 2xl:p-14 rounded-[2rem] 2xl:rounded-[2.5rem]">
              <h3 className="text-xl 2xl:text-3xl font-bold text-[#1a1a1a] mb-4 2xl:mb-6">Culinary Excellence</h3>
              <p className="text-gray-500 text-sm 2xl:text-xl leading-relaxed">
                Indulge in upscale American cuisine crafted to perfection. Signature dishes
                and curated cocktails elevate your night, complementing live performances
                and the sophisticated ambiance. Every bite and sip is designed to enhance
                your Delilah experience.
              </p>
            </div>
            <div className="h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800"
                alt="Delilah Bar"
                className="w-full h-full object-cover rounded-[2rem]"
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <div className="h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800"
                alt="Live Entertainment"
                className="w-full h-full object-cover rounded-[2rem]"
              />
            </div>
            <div className="bg-[#f5f5f5] p-10 2xl:p-14 rounded-[2rem] 2xl:rounded-[2.5rem] flex-grow">
              <h3 className="text-xl 2xl:text-3xl font-bold text-[#1a1a1a] mb-4 2xl:mb-6">Live Entertainment & Performances</h3>
              <p className="text-gray-500 text-sm 2xl:text-xl leading-relaxed">
                Enjoy live performers, DJs, and surprise acts throughout the evening.
                After dinner, lounge-style bottle service brings a VIP touch to your night.
                Every visit to Delilah promises a seamless blend of luxury, excitement,
                and entertainment.
              </p>
            </div>
          </div>

        </div>
      </section>
      <section className="py-16 2xl:py-28 px-6 sm:px-12 lg:px-20 2xl:px-32 bg-white">
        <div className="">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl 2xl:text-7xl font-bold text-mist-900 mb-3 2xl:mb-6">
              Elevate Your Night
            </h2>
            <p className="text-base 2xl:text-2xl text-mist-600 leading-relaxed">
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
                <h3 className="text-base 2xl:text-2xl font-bold text-mist-900 mb-1 2xl:mb-3">Chauffeur Services or Party Bus</h3>
                <p className="text-base 2xl:text-xl text-mist-500 font-normal leading-relaxed">
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
                <h3 className="text-base 2xl:text-2xl font-bold text-mist-900 mb-1 2xl:mb-3">Security & Bodyguards</h3>
                <p className="text-base 2xl:text-xl text-mist-500 font-normal leading-relaxed">
                  Hassle-free parking management for you and your guests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reviews />

      <section className="py-16 2xl:py-24 px-6 sm:px-16 lg:px-20 2xl:px-32 bg-white">
        <div className="">
          <div className="relative bg-mist-100 rounded-3xl 2xl:rounded-[40px] px-8 2xl:px-16 py-16 2xl:py-24 text-center overflow-hidden">
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
            <h2 className="text-3xl sm:text-4xl 2xl:text-7xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-8">
              Reserve Your<br /> Unforgettable Night
            </h2>
            <p className="text-sm 2xl:text-2xl text-mist-600 max-w-sm 2xl:max-w-3xl mx-auto leading-relaxed mb-8 2xl:mb-12">
              Secure your table, VIP services, or private experience today and make your evening truly extraordinary.
            </p>
            <button className="bg-mist-900 text-white text-sm 2xl:text-2xl font-semibold px-7 2xl:px-12 py-3.5 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors">
              Reserve Now
            </button>

          </div>
        </div>
      </section>

      <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-16 2xl:py-28">
        <div className="max-w-[1840px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 2xl:mb-24">
          <h2 className="text-4xl lg:text-5xl 2xl:text-7xl font-bold text-[#1a1a1a] mb-6 2xl:mb-8">Gallery</h2>
          <p className="text-gray-600 text-base 2xl:text-2xl max-w-3xl 2xl:max-w-6xl mx-auto leading-relaxed">
            Explore the vibrant atmosphere, elegant décor, and unforgettable
            performances that make Delilah Los Angeles a must-visit nightlife destination.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-10 h-[600px] lg:h-[700px] 2xl:h-[860px]">

          {/* Left Column: Full Height */}
          <div className="h-full">
            <img
              src="https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800"
              alt="Bar interior"
              className="w-full h-full object-cover rounded-[2rem]"
            />
          </div>

          {/* Middle Column: Two Stacked Images */}
          <div className="flex flex-col gap-6 h-full">
            <div className="h-1/2">
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800"
                alt="Lounge seating"
                className="w-full h-full object-cover rounded-[2rem]"
              />
            </div>
            <div className="h-1/2">
              <img
                src="https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=800"
                alt="Elegant lighting"
                className="w-full h-full object-cover rounded-[2rem]"
              />
            </div>
          </div>

          {/* Right Column: Full Height */}
          <div className="h-full">
            <img
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800"
              alt="Atmospheric dining"
              className="w-full h-full object-cover rounded-[2rem]"
            />
          </div>

        </div>
        </div>
      </section>
      <FAQ />

      <VenueBookingForm />





     
    </div>
  )
}
