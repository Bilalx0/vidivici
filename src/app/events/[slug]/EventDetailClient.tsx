"use client"
import MultiStepBookingForm from "@/components/events/MultiStepBookingForm"

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
  Heart,
  Sparkles,
  Music2,
  UtensilsCrossed,
  ShieldCheck,
  GlassWater,
  Gem,
  Crown,
  Wine,
  PartyPopper,
  Camera,
  Mic2,
  Palette,
  Theater,
  Martini,
  Flame,
  Zap,
  Trophy,
  Clapperboard,
  ChefHat,
  Landmark,
  Castle,
  Trees,
  Sun,
  Moon,
  Ticket,
  Award,
  Globe,
  Building2,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
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

type WhyChooseCard = {
  title: string
  description: string
  icon: string
}

type ShowcaseCard = {
  title: string
  description: string
  imageUrl: string
}

function DynamicIcon({ name, size = 24, className = "" }: {
  name: string
  size?: number
  className?: string
}) {
  const Icon = (LucideIcons as Record<string, unknown>)[name] as
    | React.ComponentType<{ size?: number; className?: string }>
    | undefined
  if (!Icon) {
    // Fallback to Star if icon name is invalid
    const { Star } = LucideIcons
    return <Star size={size} className={className} />
  }
  return <Icon size={size} className={className} />
}

function parseHighlightsConfig(raw: string | null | undefined): {
  whyChooseCards: WhyChooseCard[]
  showcaseCards: ShowcaseCard[]
  descriptionUnderWhyChoose: string
} {
  if (!raw) return { whyChooseCards: [], showcaseCards: [], descriptionUnderWhyChoose: "" }

  try {
    const parsed = JSON.parse(raw)
    const whyChooseCards = Array.isArray(parsed?.whyChooseCards)
      ? parsed.whyChooseCards.map((item: any) => ({
        title: String(item?.title || "").trim(),
        description: String(item?.description || "").trim(),
        icon: String(item?.icon || "Star").trim(),
      })).filter((item: WhyChooseCard) => item.title || item.description)
      : []

    const showcaseCards = Array.isArray(parsed?.showcaseCards)
      ? parsed.showcaseCards.map((item: any) => ({
        title: String(item?.title || "").trim(),
        description: String(item?.description || "").trim(),
        imageUrl: String(item?.imageUrl || "").trim(),
      })).filter((item: ShowcaseCard) => item.title || item.description || item.imageUrl)
      : []

    const descriptionUnderWhyChoose = String(parsed?.descriptionUnderWhyChoose || "").trim()

    return { whyChooseCards, showcaseCards, descriptionUnderWhyChoose }
  } catch {
    const legacyCards = raw
      .split("|")
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => {
        const [title, description] = v.split(":")
        return {
          title: (title || "").trim(),
          description: (description || "").trim(),
          icon: "Star",
        }
      })

    return { whyChooseCards: legacyCards, showcaseCards: [], descriptionUnderWhyChoose: "" }
  }
}

function parseExperienceConfig(raw: string | null | undefined): {
  subtitle: string
  images: string[]
  heading: string
} {
  if (!raw) return { subtitle: "", images: [], heading: "" }

  try {
    const parsed = JSON.parse(raw)
    const heading = String(parsed?.heading || "").trim()
    const subtitle = String(parsed?.subtitle || "").trim()
    const images = Array.isArray(parsed?.images)
      ? parsed.images.map((img: any) => String(img || "").trim()).filter(Boolean)
      : []

    return { heading, subtitle, images }
  } catch {
    return {
      heading: "",
      subtitle: "",
      images: [],
    }
  }
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Star,
  Sparkles,
  Music2,
  UtensilsCrossed,
  ShieldCheck,
  GlassWater,
  Gem,
  Crown,
  Wine,
  PartyPopper,
  Camera,
  Mic2,
  Palette,
  Theater,
  Martini,
  Flame,
  Zap,
  Trophy,
  Clapperboard,
  ChefHat,
  Landmark,
  Castle,
  Trees,
  Sun,
  Moon,
  Ticket,
  Award,
  Globe,
  Building2,
}

export function VenueBookingForm({ eventName, venueName }: { eventName?: string; venueName?: string }) {
  return <MultiStepBookingForm eventName={eventName} venueName={venueName} />
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
      <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
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

  const images = event.images.length > 0
    ? event.images
    : [{ url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80", alt: "Event" }]

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  const highlightsConfig = parseHighlightsConfig(event.highlights)
  const experienceConfig = parseExperienceConfig(event.experience)
  const whyChooseCards = highlightsConfig.whyChooseCards
  const showcaseCards = highlightsConfig.showcaseCards
  const fullDescriptionParagraphs = (event.description || event.experience || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
  const experienceImages = [
    experienceConfig.images[0] || images[0]?.url || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000",
    experienceConfig.images[1] || images[1]?.url || "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600",
    experienceConfig.images[2] || images[2]?.url || "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600",
  ]

  return (
    <div className="pt-24 lg:pt-28 2xl:pt-36">
      {/* Breadcrumb (Desktop) */}
      <div className="hidden lg:block px-6 sm:px-16 lg:px-28 2xl:px-32 py-8 2xl:py-12">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base 2xl:text-xl text-mist-500">
            <Link href="/" className="hover:text-mist-700">Los Angeles</Link>
            <ChevronRight size={14} className="text-mist-400" />
            <Link href="/events" className="hover:text-mist-700">Events</Link>
            <ChevronRight size={14} className="text-mist-400" />
            <span className="text-mist-700 font-medium">{event.name}</span>
          </div>
          <div className="flex flex-nowrap items-center gap-4 sm:gap-5">
            <button className="flex items-center gap-2 text-sm 2xl:text-xl font-medium text-mist-600 hover:text-mist-900 transition-colors">
              <Share2 size={18} /> Share
            </button>
            <button className="flex items-center gap-2 text-sm 2xl:text-xl font-medium text-mist-600 hover:text-black transition-colors">
              <Heart size={18} /> Save
            </button>

          </div>
        </div>
      </div>

      {/* Top Actions (Mobile) */}
      <div className="lg:hidden px-8 sm:px-16 pb-4">
        <div className="flex items-center justify-end gap-3">
          <button className="flex items-center gap-1 text-sm text-mist-500 hover:text-mist-700 transition-colors">
            <Share2 size={15} /> Share
          </button>
          <button className="flex items-center gap-1 text-sm text-mist-500 hover:text-mist-700 transition-colors">
            <Heart size={15} /> Save
          </button>
        </div>
      </div>

      {/* Hero Image with Event Title */}
      <div className="px-6 sm:px-16 lg:px-20 2xl:px-32">
        <div className="relative rounded-3xl overflow-hidden h-[450px] lg:h-[550px] 2xl:h-[760px]">
          <img
            src={images[currentImage].url}
            alt={images[currentImage].alt || event.name}
            className="w-full h-full object-cover"
          />

          {/* Darker gradient at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-12 2xl:bottom-20 left-10 2xl:left-20 right-10 2xl:right-20">
            <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-white mb-3 2xl:mb-5 tracking-tight">
              {event.name}
            </h1>
            {event.shortDescription && (
              <p className="text-base lg:text-xl 2xl:text-2xl text-white/90 mb-10 2xl:mb-14 max-w-2xl 2xl:max-w-5xl leading-relaxed">
                {event.shortDescription}
              </p>
            )}

            <button
              className="bg-white text-black px-5 py-3 sm:px-10 2xl:px-12 sm:py-4 2xl:py-5 rounded-xl 2xl:rounded-xl text-base 2xl:text-xl hover:bg-mist-100 transition-all transform hover:scale-105 shadow-xl"
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

      {/* Breadcrumb (Mobile) */}
      <div className="lg:hidden px-8 sm:px-16 lg:px-28 2xl:px-32 2xl:pb-16 pt-5">
        <div className="flex items-center">
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base 2xl:text-xl text-mist-500">
            <Link href="/" className="hover:text-mist-700">Los Angeles</Link>
            <ChevronRight size={14} className="text-mist-400" />
            <Link href="/events" className="hover:text-mist-700">Events</Link>
            <ChevronRight size={14} className="text-mist-400" />
            <span className="text-mist-700 font-medium">{event.name}</span>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      {whyChooseCards.length > 0 && (
        <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 text-center mt-24 2xl:mt-48">
          {/* Header */}
          <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-[#1a1a1a] mb-4 2xl:mb-6">
            Why Choose {event.name}?
          </h2>
          <p className="text-mist-600 text-base 2xl:text-xl max-w-2xl 2xl:max-w-5xl mx-auto mb-12 2xl:mb-20 leading-relaxed">
            {highlightsConfig.descriptionUnderWhyChoose || event.shortDescription || "Experience the perfect blend of luxury, entertainment, and world-class service in one unforgettable event."}
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-10">
            {whyChooseCards.map((card, i) => {


              return (
                <div
                  key={i}
                  className="bg-mist-100 p-8 2xl:p-12 rounded-3xl text-left flex flex-col h-full"
                >
                  {/* Icon Container */}
                  <div className="w-12 h-12 bg-mist-200 rounded-lg flex items-center justify-center mb-6">
                    <DynamicIcon name={card.icon} size={24} className="text-mist-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl 2xl:text-3xl font-bold text-[#1a1a1a] mb-3 2xl:mb-5">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-mist-500 text-sm 2xl:text-2xl leading-relaxed">
                      {card.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* The Experience Section */}
      {fullDescriptionParagraphs.length > 0 && (
        <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 flex flex-col lg:flex-row items-center gap-12 2xl:gap-20 mt-24 2xl:mt-48">

          {/* Left Side: Bento Image Grid */}
          <div className="w-full lg:w-1/2 flex gap-4">
            {/* Main Large Image */}
            <div className="w-2/3 h-80 sm:h-[450px] sm:h-[500px]">
              <img
                src={experienceImages[0]}
                alt={event.name}
                className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
              />
            </div>

            {/* Secondary Vertical Stack */}
            <div className="w-1/3 flex flex-col gap-4">
              <div className="h-3/5">
                <img
                  src={experienceImages[1]}
                  alt="Interior Details"
                  className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
                />
              </div>
              <div className="h-2/5">
                <img
                  src={experienceImages[2]}
                  alt="Atmosphere"
                  className="w-full h-full object-cover rounded-2xl sm:rounded-3xl"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-6">
              {experienceConfig.heading || `Experience the ${event.name}`}
            </h2>

            <h3 className="text-sm sm:text-base 2xl:text-2xl font-semibold text-mist-500 mb-6 2xl:mb-8">
              {experienceConfig.subtitle || "Modern luxury meets classic elegance"}
            </h3>

            <div className="text-mist-600 2xl:text-2xl leading-relaxed mb-8 2xl:mb-10 max-w-xl 2xl:max-w-4xl space-y-4 2xl:space-y-6">
              {fullDescriptionParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <button
              onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-mist-900 text-white px-10 2xl:px-12 py-4 2xl:py-5 rounded-xl 2xl:rounded-xl text-base 2xl:text-xl hover:bg-mist-800 transition-all transform hover:scale-105 shadow-xl"
            >
              Reserve Now
            </button>
          </div>

        </section>
      )}

      {showcaseCards.length > 0 && (
        <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-10">
            {showcaseCards.map((card, idx) => (
              <div key={idx} className="flex flex-col gap-6">
                <div className={`h-[220px] sm:h-[300px] ${idx === 1 ? "lg:h-[400px] md:order-2" : "lg:h-[350px]"}`}>
                  <img
                    src={card.imageUrl || `https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&v=${idx}`}
                    alt={card.title || `${event.name} showcase ${idx + 1}`}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
                <div className={`bg-mist-100 p-6 sm:p-8 2xl:p-14 rounded-3xl flex-grow ${idx === 1 ? "md:order-1" : ""}`}>
                  <h3 className="text-xl 2xl:text-3xl font-bold text-[#1a1a1a] mb-4 2xl:mb-6">{card.title}</h3>
                  <p className="text-mist-500 text-sm 2xl:text-xl leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="px-6 sm:px-12 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
        <div className="">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 mb-3 2xl:mb-6">
              Elevate Your Night
            </h2>
            <p className="text-base 2xl:text-xl max-w-2xl 2xl:max-w-5xl mx-auto text-mist-600 leading-relaxed">
              Make your Vidi Vici experience even more extraordinary with our exclusive VIP services.
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 2xl:gap-y-8 gap-x-6 2xl:gap-x-10">

            {/* Mixologist */}
            <div className="flex items-center gap-4 2xl:gap-8 bg-mist-100 rounded-3xl p-4 2xl:p-8">
              <img
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80"
                alt="Mixologist"
                className="w-24 h-24 sm:w-32 sm:h-32 2xl:w-56 2xl:h-56 object-cover rounded-2xl flex-shrink-0"
              />
              <div className="pt-1">
                <h3 className="text-base 2xl:text-[26px] font-bold text-mist-900 mb-1 2xl:mb-3">Chauffeur Services</h3>
                <p className="text-base 2xl:text-2xl text-mist-500 font-normal leading-relaxed">
                  Professional bartenders to craft signature for drinks
                </p>
              </div>
            </div>

            {/* Valet Parking */}
            <div className="flex items-center gap-4 2xl:gap-8 bg-mist-100 rounded-3xl p-4 2xl:p-8">
              <img
                src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=300&q=80"
                alt="Valet Parking"
                className="w-24 h-24 sm:w-32 sm:h-32 2xl:w-56 2xl:h-56 object-cover rounded-2xl flex-shrink-0"
              />
              <div className="pt-1">
                <h3 className="text-base 2xl:text-[26px] font-bold text-mist-900 mb-1 2xl:mb-3">Security & Bodyguards</h3>
                <p className="text-base 2xl:text-2xl text-mist-500 font-normal leading-relaxed">
                  Hassle-free parking management for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reviews />

      <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
        <div className="">
          <div className="relative bg-mist-100 rounded-3xl px-8 2xl:px-16 py-16 2xl:py-24 text-center overflow-hidden">
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
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-8">
              Reserve Your<br /> Unforgettable Night
            </h2>
            <p className="text-sm 2xl:text-2xl text-mist-600 max-w-sm 2xl:max-w-3xl mx-auto leading-relaxed mb-8 2xl:mb-12">
              Secure your table, VIP services, or private experience today and make your evening truly extraordinary.
            </p>
            <button className="bg-mist-900 text-white px-10 2xl:px-12 py-4 2xl:py-5 rounded-xl 2xl:rounded-xl text-base 2xl:text-xl hover:bg-mist-800 transition-all transform hover:scale-105 shadow-xl">
              Reserve Now
            </button>

          </div>
        </div>
      </section>

      <section className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
        <div className="">
          {/* Header */}
          <div className="text-center mb-16 2xl:mb-24">
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 mb-6 2xl:mb-8">Gallery</h2>
            <p className="text-mist-600 text-base 2xl:text-xl max-w-2xl 2xl:max-w-5xl mx-auto leading-relaxed">
              Explore the vibrant atmosphere, elegant décor, and unforgettable
              performances that make Delilah Los Angeles a must-visit nightlife destination.
            </p>
          </div>

          {/* Bento Gallery */}
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
    overflow-hidden rounded-2xl
    col-[1] row-[1]
    sm:row-[1/3]
    lg:row-[1]
    2xl:row-[1/3]
  ">
              <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=900"
                alt="Bar interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            {/* T2 — tall center hero */}
            <div className="
    overflow-hidden rounded-2xl
    col-[2] row-[1/3]
    sm:col-[2] sm:row-[1]
    lg:col-[2] lg:row-[1/3]
    2xl:col-[2] 2xl:row-[1]
  ">
              <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=900"
                alt="Lounge seating" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            {/* T3 */}
            <div className="
    overflow-hidden rounded-2xl
    col-[1] row-[2/4]
    sm:col-[3] sm:row-[1]
    lg:col-[3] lg:row-[1]
    2xl:col-[3] 2xl:row-[1]
  ">
              <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=900"
                alt="Atmospheric dining" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            {/* T4 */}
            <div className="
    overflow-hidden rounded-2xl
    col-[2] row-[3]
    sm:col-[2] sm:row-[2]
    lg:col-[1] lg:row-[2]
    2xl:col-[4] 2xl:row-[1/3]
  ">
              <img src="https://images.unsplash.com/photo-1485872299829-c673f5194813?q=80&w=900"
                alt="Elegant lighting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            {/* T5 — hidden on mobile */}
            <div className="
    hidden sm:block
    overflow-hidden rounded-2xl
    sm:col-[3] sm:row-[2]
    lg:col-[3] lg:row-[2]
    2xl:col-[2] 2xl:row-[2]
  ">
              <img src="https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=900"
                alt="Cocktail bar" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            {/* T6 — 2xl only */}
            <div className="
    hidden 2xl:block
    overflow-hidden rounded-2xl
    2xl:col-[3] 2xl:row-[2]
  ">
              <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1400"
                alt="Restaurant wide"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

          </div>
        </div>
      </section>
      <FAQ />

      <VenueBookingForm eventName={event.name} />






    </div>
  )
}
