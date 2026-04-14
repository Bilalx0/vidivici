"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  ChevronDown,
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
  },
  {
    title: "Fashion Shows & Exhibitions",
    description: "A stunning backdrop for showcasing brands, art, and creative expression.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Cultural & Heritage Events",
    description: "Rich historic interiors that honour tradition and cultural significance.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop",
  },
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
  { icon: Building, text: "Architectural Landmark" },
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

import MultiStepBookingForm from "@/components/events/MultiStepBookingForm"

const BUDGET_OPTIONS = ["Under $5,000", "$5,000 - $15,000", "$15,000 - $30,000", "$30,000 - $50,000", "$50,000+"]
const ADD_ONS = ["Chauffeur / Party Bus", "Security / Bodyguard"]
const VENUE_OPTIONS = ["Trinity Ballroom", "Delilah Los Angeles", "The Majestic Downtown"]

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
        ; (input as HTMLInputElement & { showPicker: () => void }).showPicker()
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


const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#f5f5f5] p-6 sm:p-8 2xl:p-12 rounded-xl 2xl:rounded-2xl flex flex-col items-start gap-4 2xl:gap-6 transition-all hover:shadow-md">
    <div className="bg-[#e5e5e5] p-3 2xl:p-4 rounded-lg 2xl:rounded-xl text-mist-600">
      <Icon size={24} className="2xl:w-7 2xl:h-7" />
    </div>
    <div>
      <h3 className="text-lg sm:text-xl 2xl:text-3xl font-bold text-mist-900 mb-2 2xl:mb-4 leading-tight">
        {title}
      </h3>
      <p className="text-mist-600 leading-relaxed text-sm sm:text-[15px] 2xl:text-2xl">
        {description}
      </p>
    </div>
  </div>
);

const AmenityBadge = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 sm:gap-4 2xl:gap-6 bg-[#f5f5f5] p-4 sm:p-5 2xl:p-8 rounded-xl 2xl:rounded-2xl hover:bg-[#efefef] transition-colors cursor-default">
    <div className="bg-[#e5e5e5] p-2.5 2xl:p-4 rounded-lg 2xl:rounded-xl text-mist-500 shrink-0">
      <Icon size={22} className="2xl:w-6 2xl:h-6" />
    </div>
    <span className="text-sm sm:text-[17px] 2xl:text-2xl font-semibold text-[#333] leading-tight">
      {text}
    </span>
  </div>
);

/* ================================================================== */
/*  Ballroom Page                                                      */
/* ================================================================== */
export default function BallroomPage() {
 const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : 3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = events.length - itemsPerView;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const cardWidthPercent = 100 / itemsPerView;
  const translatePercent = currentIndex * cardWidthPercent;

  return (
    <div className="pt-24 lg:pt-28 2xl:pt-36">
      {/* Breadcrumb Section */}
      <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-8 2xl:py-12">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm 2xl:text-xl text-mist-500">
            <Link href="/" className="hover:text-mist-700 transition-colors">Los Angeles</Link>
            <ChevronRight size={14} className="text-mist-400" />
            <Link href="/events" className="hover:text-mist-700 transition-colors">Event</Link>
            <ChevronRight size={14} className="text-mist-400" />
            <span className="text-mist-700 font-medium">Delilah</span>
          </nav>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm 2xl:text-xl font-medium text-mist-600 hover:text-mist-900 transition-colors">
              <Share2 size={18} /> Share
            </button>
            <button className="flex items-center gap-2 text-sm 2xl:text-xl font-medium text-mist-600 hover:text-mist-900 transition-colors">
              <Heart size={18} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 sm:px-16 lg:px-20 2xl:px-32">
        <div className="relative rounded-[2.5rem] 2xl:rounded-[48px] overflow-hidden h-[500px] lg:h-[600px] 2xl:h-[760px] shadow-2xl">
          {/* Main Hero Image */}
          <img
            src={HERO_IMAGE}
            alt="Delilah Los Angeles Interior"
            loading="lazy"
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-12 2xl:bottom-20 left-12 2xl:left-20 right-12 2xl:right-20">
            <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-white mb-4 2xl:mb-6 tracking-tight">
              Delilah Los Angeles
            </h1>
            <p className="text-lg lg:text-xl 2xl:text-2xl text-white/90 mb-10 2xl:mb-14 max-w-2xl 2xl:max-w-5xl leading-relaxed">
              Roaring &apos;20s vibes with American cuisine &<br /> Art Deco elegance
            </p>

            <button
              onClick={() => { }}
              className="bg-white text-black px-10 2xl:px-12 py-4 2xl:py-5 rounded-xl 2xl:rounded-xl text-base 2xl:text-xl hover:bg-mist-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Reserve Now
            </button>
          </div>
        </div>
      </div>

      {/* A Landmark Born / History Section */}
      <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-20 2xl:py-32 flex flex-col lg:flex-row items-center gap-16 2xl:gap-24 bg-mist-100 mt-24 2xl:mt-48">

        {/* Left Side: Vertical Image Stack */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 2xl:gap-10">
          <div className="h-[350px] lg:h-[400px] 2xl:h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000"
              alt="The Trinity Building Exterior"
              loading="lazy"
              className="w-full h-full object-cover rounded-[2rem] 2xl:rounded-[40px] shadow-sm"
            />
          </div>
          <div className="h-[250px] lg:h-[300px] 2xl:h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600"
              alt="Historic Ballroom Interior"
              loading="lazy"
              className="w-full h-full object-cover rounded-[2rem] 2xl:rounded-[40px] shadow-sm"
            />
          </div>
        </div>

        {/* Right Side: Historical Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-6 2xl:mb-10">
            A Landmark Born <br /> in 1914 — Reborn <br /> for Today
          </h2>

          <div className="space-y-5 2xl:space-y-8 text-mist-600 text-sm sm:text-base 2xl:text-2xl leading-relaxed max-w-xl 2xl:max-w-4xl">
            <p>
              Originally constructed in <span className="font-bold text-[#1a1a1a]">1914</span>, the Trinity Building was
              celebrated as an architectural masterpiece in Downtown Los Angeles. Hidden within its walls was a
              <span className="font-bold text-[#1a1a1a]"> 1,600-seat auditorium</span> that quickly became one of the city's
              most important cultural hubs.
            </p>

            <p>
              In 1919, it hosted the <span className="font-bold text-[#1a1a1a]">LA Philharmonic's first season</span>,
              marking its place in music history. The venue also housed the largest pipe organ installation on the West Coast.
            </p>

            <p>
              Over the decades, the auditorium evolved into a beloved filming location, welcoming legendary figures such as
              <span className="font-bold text-[#1a1a1a]"> Charlie Chaplin</span>. After being closed for nearly two decades,
              this historic icon became a sleeping giant—leaving everyone with one question:
              <span className="italic font-medium"> "Will it ever open?"</span>
            </p>

            <p className="pt-4">
              Today, we proudly reintroduce this breathtaking historic treasure — restored and reborn as a premier venue
              for weddings, conferences, galas, and prestigious events in the heart of Downtown LA.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
        {/* Header Section */}
        <div className="text-center mb-14 2xl:mb-24 max-w-2xl 2xl:max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-[#1a1a1a] mb-5 2xl:mb-8">
            Why Choose the Trinity Ballroom
          </h2>
          <p className="text-sm sm:text-base 2xl:text-xl text-mist-500 leading-relaxed">
            A rare blend of heritage, elegance, and scale—crafted for extraordinary events.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 2xl:gap-10">
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

<section className="bg-white overflow-hidden mt-24 2xl:mt-48">
      <div>
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-center text-[#1a1a1a] mb-16 2xl:mb-20">
          Perfect for Every Prestigious Event
        </h2>

        <div className="relative group">
          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="absolute left-3 2xl:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 2xl:w-10 2xl:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={20} className="2xl:w-6 2xl:h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-3 2xl:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 2xl:w-10 2xl:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <ChevronRight size={20} className="2xl:w-6 2xl:h-6" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden px-6 sm:px-16 lg:px-20 2xl:px-32">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${translatePercent}%)` }}
            >
              {events.map((event, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${cardWidthPercent}%` }}
                >
                  <div className="relative h-[300px] sm:h-[350px] 2xl:h-[460px] rounded-2xl 2xl:rounded-3xl overflow-hidden group cursor-pointer">
                    {/* Image */}
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 p-6 2xl:p-12 text-white">
                      <h3 className="text-lg sm:text-xl 2xl:text-3xl font-bold mb-2 2xl:mb-4">
                        {event.title}
                      </h3>
                      <p className="text-sm sm:text-base 2xl:text-2xl text-gray-300 leading-relaxed">
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
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
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
      <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
        {/* Header */}
        <div className="text-center mb-12 2xl:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold text-[#1a1a1a] mb-4 2xl:mb-6">
            Venue Features & Amenities
          </h2>
          <p className="text-sm sm:text-base 2xl:text-2xl text-mist-500 max-w-2xl 2xl:max-w-5xl mx-auto leading-relaxed">
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
              Host Your Event at the <br /> Trinity Ballroom
            </h2>
            <p className="text-sm sm:text-base 2xl:text-2xl text-mist-600 max-w-sm 2xl:max-w-3xl mx-auto leading-relaxed mb-8 2xl:mb-12">
              Secure your table, VIP services, or private experience today and make your evening truly extraordinary.
            </p>
            <button className="bg-mist-900 text-white text-sm sm:text-base 2xl:text-xl px-7 2xl:px-12 py-3.5 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors">
              Request a Quote
            </button>

          </div>
        </div>
      </section>
      <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
        <div className="">

          {/* Simple Header */}
          <div className="text-center mb-16 2xl:mb-24">
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900">
              Gallery
            </h2>
            <p className="text-sm sm:text-base 2xl:text-2xl text-mist-500 max-w-2xl 2xl:max-w-5xl mx-auto leading-relaxed mt-4 2xl:mt-6">
              Explore the stunning architecture, elegant interiors, and historic charm of the Trinity Ballroom.
            </p>
          </div>


          {/* Bento Gallery Grid - Same as Event Detail Page */}
          <div className="
  grid gap-2
  grid-cols-2
  [grid-template-rows:180px_120px_160px]

  sm:grid-cols-[1.2fr_1fr_1fr]
  sm:[grid-template-rows:260px_220px]
  sm:gap-[10px]

  lg:grid-cols-[1fr_1.5fr_1fr]
  lg:[grid-template-rows:300px_220px]
  lg:gap-3

  2xl:grid-cols-[1fr_1.6fr_1fr_1fr]
  2xl:[grid-template-rows:320px_240px]
  2xl:gap-[14px]
">

            {/* T1 — tall left */}
            <div className="
    overflow-hidden rounded-2xl 2xl:rounded-3xl group
    col-[1] row-[1]
    sm:row-[1/3]
    lg:row-[1]
    2xl:row-[1/3]
  ">
              <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=900"
                alt="Ballroom ceiling" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>

            {/* T2 — tall center hero */}
            <div className="
    overflow-hidden rounded-2xl 2xl:rounded-3xl group
    col-[2] row-[1/3]
    sm:col-[2] sm:row-[1]
    lg:col-[2] lg:row-[1/3]
    2xl:col-[2] 2xl:row-[1]
  ">
              <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=900"
                alt="Grand ballroom" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>

            {/* T3 */}
            <div className="
    overflow-hidden rounded-2xl 2xl:rounded-3xl group
    col-[1] row-[2/4]
    sm:col-[3] sm:row-[1]
    lg:col-[3] lg:row-[1]
    2xl:col-[3] 2xl:row-[1]
  ">
              <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=900"
                alt="Wedding setup" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>

            {/* T4 */}
            <div className="
    overflow-hidden rounded-2xl 2xl:rounded-3xl group
    col-[2] row-[3]
    sm:col-[2] sm:row-[2]
    lg:col-[1] lg:row-[2]
    2xl:col-[4] 2xl:row-[1/3]
  ">
              <img src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=900"
                alt="Elegant lighting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>

            {/* T5 — hidden on mobile */}
            <div className="
    hidden sm:block
    overflow-hidden rounded-2xl 2xl:rounded-3xl group
    sm:col-[3] sm:row-[2]
    lg:col-[3] lg:row-[2]
    2xl:col-[2] 2xl:row-[2]
  ">
              <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=900"
                alt="Historic architecture" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>

            {/* T6 — 2xl only */}
            <div className="
    hidden 2xl:block
    overflow-hidden rounded-2xl 2xl:rounded-3xl group
    2xl:col-[3] 2xl:row-[2]
  ">
              <img src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1400"
                alt="Ballroom wide"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>

          </div>
        </div>
      </section>

      <FAQ />
      {/* VIP Venue Booking Form - Multi-step with PayPal */}
      <MultiStepBookingForm
        venueOptions={VENUE_OPTIONS}
        venueName="Trinity Ballroom"
        eventName="Trinity Ballroom Event"
      />

      {/* Reusable Sections */}

    </div>
  )
}