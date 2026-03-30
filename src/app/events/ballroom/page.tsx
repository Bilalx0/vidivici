"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  Phone,
  MapPin,
  Share2,
  Drama, 
  Repeat, 
  Building, 
  UserPlus, 
  Waves, 
  Film, 
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
  Heart,
  Crown,
  Music,
  Martini,
} from "lucide-react"
import { Calendar, ShieldCheck } from 'lucide-react';
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"

/* ================================================================== */
/*  Static Data                                                        */
/* ================================================================== */


const features = [
    {
      icon: Building2,
      title: "Historic 1914 Architecture",
      description: "Original 1914 theatre structure & preserved details."
    },
    {
      icon: Users,
      title: "Large Capacity",
      description: "Designed for audiences up to 1,600 (depending on setup)."
    },
    {
      icon: Calendar,
      title: "Event Versatility",
      description: "Ideal for weddings, concerts, galas & productions."
    },
    {
      icon: Clock,
      title: "Prestigious History",
      description: "Former home of LA Philharmonic's first season."
    },
    {
      icon: MapPin,
      title: "Prime Downtown LA Location",
      description: "Located on Grand Ave, near LA's top hotels and attractions."
    },
    {
      icon: ShieldCheck,
      title: "Dedicated Support Team",
      description: "Experienced coordinators for seamless planning."
    }
  ];

  const events = [
    {
      title: "Weddings & Receptions",
      description: "Romantic architecture and cinematic charm for unforgettable celebrations.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Corporate Events & Conferences",
      description: "A spacious, historic ballroom designed for professional gatherings and large audiences.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Galas, Award Nights & Charity Events",
      description: "Elegant atmosphere for high-profile functions and branded experiences.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Private Parties",
      description: "Perfect for birthdays, anniversaries, and intimate social gatherings.",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    }
  ];

 const images = [
  {
    url: "https://picsum.photos/seed/ballroom/800/1200",
    alt: "Ornate blue and gold ballroom ceiling",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    url: "https://picsum.photos/seed/theater/1200/600",
    alt: "Historic theater building exterior",
    className: "md:col-span-2 md:row-span-1",
  },
  {
    url: "https://picsum.photos/seed/balcony/800/1200",
    alt: "View of balconies from stage",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    url: "https://picsum.photos/seed/stage/1200/600",
    alt: "Red theater stage with curtain closed",
    className: "md:col-span-2 md:row-span-1",
  },
  {
    url: "https://picsum.photos/seed/stairs/800/1200",
    alt: "Modern staircase with red lighting",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    url: "https://picsum.photos/seed/architecture/1200/1200",
    alt: "Modern architectural staircase with dark railings",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    url: "https://picsum.photos/seed/dome/800/600",
    alt: "Close up of ornate glass ceiling dome",
    className: "md:col-span-1 md:row-span-1",
  },
];

  const amenities = [
    { icon: Drama, text: "Historic Ballroom & Stage" },
    { icon: Users, text: "Grand Capacity Layout" },
    { icon: Repeat, text: "Flexible Event Configurations" },
    { icon: Building, text: "Architectural Landmark" },
    { icon: UserPlus, text: "Ideal for Large Gatherings" },
    { icon: Waves, text: "Premium Acoustics" },
    { icon: Film, text: "Film-Friendly Space" },
    { icon: MapPin, text: "Downtown Accessibility" },
  ];

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


const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#f5f5f5] p-8 rounded-xl flex flex-col items-start gap-4 transition-all hover:shadow-md">
    <div className="bg-[#e5e5e5] p-3 rounded-lg text-gray-600">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-[15px]">
        {description}
      </p>
    </div>
  </div>
);

const AmenityBadge = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-4 bg-[#f5f5f5] p-5 rounded-xl hover:bg-[#efefef] transition-colors cursor-default">
    <div className="bg-[#e5e5e5] p-2.5 rounded-lg text-gray-500 shrink-0">
      <Icon size={22} />
    </div>
    <span className="text-[17px] font-semibold text-[#333] leading-tight">
      {text}
    </span>
  </div>
);

/* ================================================================== */
/*  Booking Form                                                       */
/* ================================================================== */
export function VenueBookingForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    clubVenue: "Delilah Los Angeles",
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
    if (!form.fullName || !form.email || !form.bookingDate) return;
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // Reusable input class (matches ContactForm exactly)
  const inputClass = "w-full border border-mist-300 rounded-xl px-4 py-3 text-sm text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white";

  return (
    <section className="w-full bg-white py-12 sm:px-16 lg:px-20 px-6 " id="booking-form">
     
      <div className="border border-mist-200 rounded-3xl overflow-hidden gap-8 sm:p-8 px-4 py-6 flex flex-col md:flex-row shadow-sm">

        {/* Left Panel - Info */}
        <div className="bg-mist-100 px-4 sm:px-8 py-8 md:w-1/3 flex-shrink-0 flex flex-col gap-8 relative overflow-hidden rounded-2xl">
           <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none  rotate-180"
            />
          
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-bold text-mist-900 leading-snug mb-3">
              Have questions or want to book your luxury experience?
            </h3>
            <p className="text-sm text-mist-600 leading-relaxed">
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
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-mist-900 mb-2">Request Submitted!</h3>
              <p className="text-mist-500">Our VIP concierge will contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-mist-900 mb-8 tracking-tight">
                VIP Venue Booking
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                    <input
                      type="text"
                      value={form.clubVenue}
                      readOnly
                      className={`${inputClass} bg-mist-50 cursor-not-allowed`}
                    />
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
                    <select
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Select range</option>
                      {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Add-Ons">
                  <div className="flex flex-wrap gap-3 mt-1">
                    {ADD_ONS.map((addon) => (
                      <button
                        key={addon}
                        type="button"
                        onClick={() => toggleAddOn(addon)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${form.addOns.includes(addon)
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
                  className="w-full bg-mist-900 text-white font-medium py-4 rounded-xl hover:bg-mist-800 transition-colors disabled:opacity-50 mt-2"
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
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-mist-700 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function ContactInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full border border-mist-300 bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-mist-900">{label}</p>
        <p className="text-sm text-mist-600 leading-relaxed">{value}</p>
      </div>
    </div>
  );
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (events.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 3 : prev - 1));
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb Section */}
      <div className="px-6 sm:px-16 lg:px-20 py-8">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">Los Angeles</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <Link href="/events" className="hover:text-black transition-colors">Event</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-900 font-medium">Delilah</span>
          </nav>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              <Share2 size={18} /> Share
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              <Heart size={18} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 sm:px-16 lg:px-20 mb-16">
        <div className="relative rounded-[2.5rem] overflow-hidden h-[500px] lg:h-[600px] shadow-2xl">
          {/* Main Hero Image */}
          <img
            src={HERO_IMAGE}
            alt="Delilah Los Angeles Interior"
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-12 left-12 right-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Delilah Los Angeles
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Roaring &apos;20s vibes with American cuisine &<br /> Art Deco elegance
            </p>

            <button
              onClick={() => { }}
              className="bg-white text-black px-10 py-4 rounded-xl text-base font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Reserve Now
            </button>
          </div>
        </div>
      </div>

      {/* A Landmark Born / History Section */}
      <section className="px-6 sm:px-16 lg:px-20 py-20 flex flex-col lg:flex-row items-center gap-16 bg-[#f9f9f9]">
    
        {/* Left Side: Vertical Image Stack */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="h-[350px] lg:h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000"
              alt="The Trinity Building Exterior"
              className="w-full h-full object-cover rounded-[2rem] shadow-sm"
            />
          </div>
          <div className="h-[250px] lg:h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600"
              alt="Historic Ballroom Interior"
              className="w-full h-full object-cover rounded-[2rem] shadow-sm"
            />
          </div>
        </div>

        {/* Right Side: Historical Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight mb-8">
            A Landmark Born <br /> in 1914 — Reborn <br /> for Today
          </h2>

          <div className="space-y-6 text-gray-600 leading-relaxed max-w-xl">
            <p>
              Originally constructed in <span className="font-bold text-[#1a1a1a]">1914</span>, the Trinity Building was
              celebrated as an architectural masterpiece in Downtown Los Angeles. Hidden within its walls was a
              <span className="font-bold text-[#1a1a1a]"> 1,600-seat auditorium</span> that quickly became one of the city's
              most important cultural hubs.
            </p>

            <p>
              In 1919, it hosted the <span className="font-bold text-[#1a1a1a]">LA Philharmonic’s first season</span>,
              marking its place in music history. The venue also housed the largest pipe organ installation on the West Coast.
            </p>

            <p>
              Over the decades, the auditorium evolved into a beloved filming location, welcoming legendary figures such as
              <span className="font-bold text-[#1a1a1a]"> Charlie Chaplin</span>. After being closed for nearly two decades,
              this historic icon became a sleeping giant—leaving everyone with one question:
              <span className="italic font-medium"> “Will it ever open?”</span>
            </p>

            <p className="pt-4">
              Today, we proudly reintroduce this breathtaking historic treasure — restored and reborn as a premier venue
              for weddings, conferences, galas, and prestigious events in the heart of Downtown LA.
            </p>
          </div>
        </div>
      </section>

     <section className="max-w-7xl mx-auto px-6 py-20 bg-white font-sans">
      {/* Header Section */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
          Why Choose the Trinity Ballroom
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed">
          A rare blend of heritage, elegance, and scale—crafted for extraordinary events.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>

        <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#1a1a1a] mb-12">
          Perfect for Every Prestigious Event
        </h2>

        <div className="relative group">
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <ChevronRight size={24} />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {events.map((event, index) => (
                <div key={index} className="min-w-full md:min-w-[33.333%] px-3">
                  <div className="relative h-[450px] rounded-2xl overflow-hidden group cursor-pointer">
                    {/* Image */}
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 p-8 text-white">
                      <h3 className="text-xl font-bold mb-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {events.slice(0, events.length - 2).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === i ? "w-8 bg-gray-800" : "w-2.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
          Venue Features & Amenities
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          Designed to honor its historic roots while supporting world-class modern events.
        </p>
      </div>

      {/* Grid - Adjusts from 1 to 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {amenities.map((item, index) => (
          <AmenityBadge 
            key={index} 
            icon={item.icon} 
            text={item.text} 
          />
        ))}
      </div>
    </section>
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
              Host Your Event at the <br /> Trinity Ballroom
            </h2>
            <p className="text-sm text-mist-600 max-w-sm mx-auto leading-relaxed mb-8">
              Secure your table, VIP services, or private experience today and make your evening truly extraordinary.
            </p>
            <button className="bg-mist-900 text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-mist-700 transition-colors">
              Request a Quote
            </button>

          </div>
        </div>
      </section>
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Simple Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl text-center font-bold text-mist-900">
            Gallery
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-center leading-relaxed mt-5">
          Designed to honor its historic roots while supporting world-class modern events.
        </p>
        </div>


        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 lg:gap-6">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`group overflow-hidden rounded-2xl ${image.className}`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
    
      <FAQ />
      {/* VIP Venue Booking Form */}
      <VenueBookingForm />

      {/* Reusable Sections */}
      
    </div>
  )
}
