"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, BedDouble, Users, Maximize2 } from "lucide-react"
import Banner from "@/components/ui/Banner"
import Rentals from "@/components/home/Rentals"
import CarBrowse from "@/components/home/CarBrowse"
import Villa from "@/components/home/Villa"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import Services from "@/components/home/Services"
import Events from "@/components/home/Events"

/* ================================================================== */
/*  Match Fixtures Data                                                */
/* ================================================================== */
const FIXTURES = [
  { date: "12 June", matchNo: "M4", stage: "Group Stage (USA opener)", stadium: "LA Stadium" },
  { date: "15 June", matchNo: "M15", stage: "Group Stage", stadium: "LA Stadium" },
  { date: "18 June", matchNo: "M26", stage: "Group Stage", stadium: "LA Stadium" },
  { date: "21 June", matchNo: "M39", stage: "Group Stage", stadium: "LA Stadium" },
  { date: "25 June", matchNo: "M59", stage: "Group Stage (USA)", stadium: "LA Stadium" },
  { date: "28 June", matchNo: "M73", stage: "Round of 32", stadium: "LA Stadium" },
  { date: "2 July", matchNo: "M84", stage: "Round of 32", stadium: "LA Stadium" },
  { date: "10 July", matchNo: "M98", stage: "Quarter-Final", stadium: "LA Stadium" },
]

/* ================================================================== */
/*  Event Card Slider                                                  */
/* ================================================================== */
interface EventFromAPI {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  location: string
  category: string
  images: { url: string; isPrimary: boolean }[]
}

function EventSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [events, setEvents] = useState<EventFromAPI[]>([])
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  useEffect(() => {
    fetch("/api/events?limit=8")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => {})
  }, [])

  const updateScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 5)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScroll)
    updateScroll()
    return () => el.removeEventListener("scroll", updateScroll)
  }, [events])

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" })
  }

  if (events.length === 0) return null

  return (
    <section className="bg-white py-14 2xl:py-21 px-4 2xl:px-8">
      <div className="max-w-7xl 2xl:max-w-[1840px] mx-auto">
        <div className="flex items-center justify-between mb-6 2xl:mb-12">
          <h2 className="text-2xl 2xl:text-6xl font-bold text-mist-900">FIFA World Cup 2026 Events</h2>
          <Link href="/events" className="flex items-center gap-1 text-sm 2xl:text-2xl font-semibold text-mist-500 hover:text-mist-900 transition-colors">
            View all <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="relative">
          {canLeft && (
            <button onClick={() => scroll("left")} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 2xl:w-12 2xl:h-12 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50">
              <ChevronLeft size={16} />
            </button>
          )}
          <div ref={scrollRef} className="flex gap-5 2xl:gap-10 overflow-x-auto scrollbar-hide scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
            {events.map((event) => {
              const img = event.images?.[0]?.url
              return (
                <div key={event.id} className="flex-shrink-0 w-[270px] 2xl:w-[320px] bg-white rounded-2xl overflow-hidden border border-mist-100 group">
                  <div className="relative h-44 2xl:h-52 overflow-hidden">
                    {img ? (
                      <img src={img} alt={event.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-4 2xl:p-6">
                    <h3 className="text-sm 2xl:text-xl font-semibold text-mist-900 mb-1 truncate">{event.name}</h3>
                    {event.shortDescription && <p className="text-[11px] 2xl:text-lg text-mist-400 line-clamp-2 mb-2">{event.shortDescription}</p>}
                    <Link href={`/events/${event.slug}`} className="flex items-center gap-1 text-[11px] 2xl:text-lg font-semibold text-mist-500 hover:text-mist-900 transition-colors">
                      View Details <ArrowUpRight size={11} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          {canRight && (
            <button onClick={() => scroll("right")} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 2xl:w-12 2xl:h-12 bg-white border border-mist-200 rounded-full flex items-center justify-center shadow-sm hover:bg-mist-50">
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  Gallery Bento Grid                                                 */
/* ================================================================== */
const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80", alt: "FIFA World Cup Trophy", className: "col-span-1 row-span-2" },
  { src: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80", alt: "Stadium panorama", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80", alt: "Stadium roof interior", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", alt: "Fans celebrating", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80", alt: "Stadium crowd", className: "col-span-1 row-span-2" },
  { src: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80", alt: "Football field", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80", alt: "Los Angeles Stadium", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=600&q=80", alt: "Trophy celebration", className: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80", alt: "Stadium exterior night", className: "col-span-1 row-span-1" },
]

function GalleryBentoGrid() {
  return (
    <section className="bg-white py-14 2xl:py-21 px-4 2xl:px-8">
      <div className="max-w-5xl 2xl:max-w-[1840px] mx-auto">
        <h2 className="text-3xl 2xl:text-6xl font-bold text-mist-900 text-center mb-10 2xl:mb-20">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[180px] sm:auto-rows-[200px] md:auto-rows-[220px] 2xl:auto-rows-[280px] gap-3 2xl:gap-6">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl 2xl:rounded-3xl group ${img.className}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================================== */
/*  Big Image Slider                                                   */
/* ================================================================== */
const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80",
    title: "Feel the Energy of LA × World Cup 2026",
    subtitle: "Matches, celebrations, nightlife — enjoy it all with seamless VIP services.",
  },
  {
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80",
    title: "VIP Match Day Experiences",
    subtitle: "Premium seating, luxury transport & exclusive lounge access at every game.",
  },
  {
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1400&q=80",
    title: "Luxury Stays for the World Stage",
    subtitle: "Private villas and penthouses minutes from the stadium.",
  },
  {
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80",
    title: "Celebrate Like a Champion",
    subtitle: "After-party planning, club reservations & bottle service — all arranged for you.",
  },
]

function BigImageSlider() {
  const [current, setCurrent] = useState(0);
  const total = HERO_SLIDES.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % total);
    }, 5000);
  }, [total]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const go = (dir: "prev" | "next") => {
    setCurrent((p) => (dir === "prev" ? (p - 1 + total) % total : (p + 1) % total));
    resetTimer();
  };

  return (
    <section className="py-16 2xl:py-32 overflow-hidden bg-white">
      <div className="relative px-6 2xl:px-12 sm:px-16 2xl:sm:px-32 lg:px-20 2xl:lg:px-40">
        
        {/* Main Viewport */}
        <div className="relative overflow-visible">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ 
              transform: `translateX(-${current * 85}%)`, // Adjusted for partial visibility
              gap: '24px' 
            }}
          >
            {HERO_SLIDES.map((slide, i) => (
              <div 
                key={i} 
                className={`w-[85%] flex-shrink-0 relative transition-all duration-500 transform ${
                  i === current ? "scale-100 opacity-100" : "scale-95 backdrop-opacity-80 opacity-70"
                }`}
              >
                <div className="relative h-[400px] 2xl:h-[600px] lg:h-[550px] 2xl:lg:h-[800px] rounded-[2.5rem] 2xl:rounded-[40px] overflow-hidden shadow-2xl">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* High-end Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-12 2xl:bottom-20 left-12 2xl:left-20 right-12 2xl:right-20">
                    <h3 className="text-3xl 2xl:text-7xl lg:text-5xl 2xl:lg:text-7xl font-bold text-white mb-4 tracking-tight leading-tight max-w-2xl">
                      {slide.title}
                    </h3>
                    <p className="text-lg 2xl:text-2xl lg:text-xl 2xl:lg:text-2xl text-white/90 max-w-xl font-medium">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Image/FIFA Badge Branding */}
                  <div className="absolute bottom-12 2xl:bottom-20 right-12 2xl:right-20 w-20 h-20 flex items-center justify-center">
                     <img 
                       src="/fifa-logo.png" 
                       alt="FIFA 2026" 
                       className="w-14 h-14 object-contain"
                     />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls - Positioned exactly as in the reference */}
          <button
            onClick={() => go("prev")}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black transition-all shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={() => go("next")}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black transition-all shadow-xl"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Progress Indicators (Optional - hidden in your target image) */}
        <div className="mt-10 2xl:mt-20 flex justify-center gap-3 2xl:gap-6">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetTimer(); }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-12 bg-[#1a1a1a]" : "w-2 bg-mist-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FIFA Page                                                          */
/* ================================================================== */
function FifaContent() {
  const router = useRouter()
  return (
    <div className="bg-white">
      {/* Hero */}
      <Banner
        heading="Los Angeles FIFA World Cup 2026"
        description="Exclusive cars, luxury villas, elite nightlife & concierge services for the world's biggest event."
        height="h-[520px]"
        image="/fifa.png"
        searchBar={{
          placeholder: "Search cars, villas, or events...",
          onSearch: (value: string) => {
            if (value.trim()) router.push(`/cars?search=${encodeURIComponent(value.trim())}`)
          },
        }}
      />

      {/* VIP Journey Section */}
      <section className="bg-white py-16 2xl:py-32 px-4 2xl:px-8">
        <div className="max-w-6xl 2xl:max-w-[1840px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 2xl:gap-20 items-center">
            <div>
              <h2 className="text-2xl 2xl:text-4xl lg:text-3xl font-bold text-mist-900 mb-4 2xl:mb-6">Your VIP World Cup Journey Starts Here</h2>
              <div className="space-y-3 2xl:space-y-4 text-sm 2xl:text-2xl text-mist-500 leading-relaxed">
                <p>
                  Experience the FIFA World Cup 2026 in Los Angeles like never before.
                  Taking place at the world-class <strong>Los Angeles Stadium</strong>, the
                  tournament brings unparalleled energy — and we elevate it with VIP comfort.
                </p>
                <p>
                  From private villas and high-end car rentals to exclusive
                  nightlife and tailored city experiences, our dedicated team
                  ensures every moment is curated to perfection.
                </p>
                <p className="font-normal text-mist-900">
                  Enjoy a seamless, personalized, and truly unforgettable
                  World Cup journey with Vidi Vici.
                </p>
              </div>
            </div>
            <div className="rounded-2xl 2xl:rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=700&q=80"
                alt="SoFi Stadium"
                className="w-full h-[320px] 2xl:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Services/>

      {/* Match Fixtures */}
    {/* FIFA World Cup Fixtures Section */}
      <section className="px-6 2xl:px-12 sm:px-16 2xl:sm:px-32 lg:px-20 2xl:lg:px-40 py-20 2xl:py-40 bg-white">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl 2xl:text-7xl lg:text-5xl 2xl:lg:text-7xl font-bold text-[#1a1a1a] mb-2">
            FIFA World Cup 2026™ Fixtures
          </h2>
          <p className="text-xl 2xl:text-3xl text-mist-600 font-medium">in Los Angeles</p>
        </div>

        {/* Table Container */}
        <div className=" bg-mist-200 rounded-[2.5rem] 2xl:rounded-3xl shadow-sm border border-mist-100">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-mist-300">
                  <th className="px-6 2xl:px-12 py-5 2xl:py-10 text-base 2xl:text-2xl font-bold text-[#1a1a1a] border-r border-mist-300">Date</th>
                  <th className="px-6 2xl:px-12 py-5 2xl:py-10 text-base 2xl:text-2xl font-bold text-[#1a1a1a] border-r border-mist-300">Match No.</th>
                  <th className="px-6 2xl:px-12 py-5 2xl:py-10 text-base 2xl:text-2xl font-bold text-[#1a1a1a] border-r border-mist-300">Stage</th>
                  <th className="px-6 2xl:px-12 py-5 2xl:py-10 text-base 2xl:text-2xl font-bold text-[#1a1a1a] ">Stadium</th>
                </tr>
              </thead>
              <tbody>
                {FIXTURES.map((f, i) => (
                  <tr key={i} className="border-b border-mist-300 last:border-0 hover:bg-mist-100/50 transition-colors">
                    <td className="px-6 2xl:px-12 py-5 2xl:py-10 text-sm 2xl:text-lg font-medium text-mist-700 border-r border-mist-300">{f.date}</td>
                    <td className="px-6 2xl:px-12 py-5 2xl:py-10 text-sm 2xl:text-lg text-mist-500 border-r border-mist-300">{f.matchNo}</td>
                    <td className="px-6 2xl:px-12 py-5 2xl:py-10 text-sm 2xl:text-lg text-mist-600 italic lg:not-italic border-r border-mist-300">{f.stage}</td>
                    <td className="px-6 2xl:px-12 py-5 2xl:py-10 text-sm 2xl:text-lg text-mist-500">{f.stadium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* Gallery Bento Grid */}
    

      {/* Big Image Slider */}
      

      {/* Car Rentals Slider */}
      <div className="py-4">
        <Rentals showHeader={true} />
      </div>

      {/* Browse by Make & Type */}
      <CarBrowse />

      <BigImageSlider />

      {/* Villa Slider */}
      <Villa showHeader={true} />

      {/* Event Slider */}
      <Events showHeader={true} />

      {/* Why Choose Vidi Vici */}
      <WhyChooseUs />

      {/* Client Testimonials */}
      <Reviews />

        <GalleryBentoGrid />

      {/* FAQ */}
      <FAQ />

      {/* Contact / Booking Form */}
      <Contact />
    </div>
  )
}

export default function FifaWorldCupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <FifaContent />
    </Suspense>
  )
}
