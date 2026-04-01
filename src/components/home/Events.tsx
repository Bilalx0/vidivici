"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "@/components/ui/EventCard";

export const events = [
  {
    id: 1,
    venue: "Delilah Los Angeles",
    name: "Roaring '20s Luxury Dining",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80",
    category: "Fine Dining & Lounge",
    capacity: "Up to 200",
    dressCode: "Upscale",
    pricePerPerson: 299,
    originalPrice: "450",
    liked: true,
  },
  {
    id: 2,
    venue: "LIV Miami",
    name: "VIP Nightclub Experience",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    category: "Elite Nightclub",
    capacity: "Up to 500",
    dressCode: "Bottle Service",
    pricePerPerson: 499,
    originalPrice: "750",
    liked: false,
  },
  {
    id: 3,
    venue: "Nobu Malibu",
    name: "Oceanfront Private Dinner",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    category: "Private Events",
    capacity: "Up to 50",
    dressCode: "Smart Casual",
    pricePerPerson: 399,
    originalPrice: "600",
    liked: true,
  },
  {
    id: 4,
    venue: "1 OAK New York",
    name: "Celebrity VIP Lounge Night",
    image: "https://images.unsplash.com/photo-1571266028243-d220c6a7ea4f?w=800&q=80",
    category: "Elite Nightclub",
    capacity: "Up to 300",
    dressCode: "Bottle Service",
    pricePerPerson: 599,
    originalPrice: "900",
    liked: false,
  },
  {
    id: 5,
    venue: "Surrender Las Vegas",
    name: "Pool Party VIP Access",
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80",
    category: "Private Events",
    capacity: "Up to 1000",
    dressCode: "Resort Wear",
    pricePerPerson: 349,
    originalPrice: "550",
    liked: false,
  },
  {
    id: 6,
    venue: "Catch LA",
    name: "Rooftop Influencer Soirée",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    category: "Fine Dining & Lounge",
    capacity: "Up to 150",
    dressCode: "Trendy",
    pricePerPerson: 249,
    originalPrice: "400",
    liked: true,
  },
];

const CARD_WIDTH = 270 + 20;

export default function ExclusiveNightlife({ showHeader = true }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActiveIndex(Math.round(el.scrollLeft / CARD_WIDTH));
  };

  const scrollTo = (index) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(index, events.length - 1));
    trackRef.current.scrollTo({ left: clamped * CARD_WIDTH, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  return (
    <section className="bg-white w-full py-16 overflow-hidden">

      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-8 px-6 sm:px-16 lg:px-20 2xl:px-32 gap-4 pb-7 2xl:max-w-[1840px]">
          <h2 className="text-2xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 tracking-tight w-xl">
            Exclusive Nightlife & VIP Experiences
          </h2>
          <button className="flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base 2xl:text-2xl 2xl:py-4 2xl:px-8 text-mist-500 bg-mist-200 border border-mist-200 rounded-xl hover:bg-mist-50 hover:border-mist-300 transition-all duration-200 whitespace-nowrap">
            View all
            <ArrowUpRight size={15} />
          </button>
        </div>
      )}

      <div className="relative">

        {/* Left Arrow */}
        <button
          onClick={() => scrollTo(activeIndex - 2)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
        >
          <ChevronLeft size={16} strokeWidth={2.5} className="text-mist-700" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scrollTo(activeIndex + 2)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
        >
          <ChevronRight size={16} strokeWidth={2.5} className="text-mist-700" />
        </button>

        {/* Carousel track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          <div className="w-6 shrink-0" />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-7">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-5 h-2 bg-mist-800"
                : "w-2 h-2 bg-mist-300 hover:bg-mist-400"
            }`}
          />
        ))}
      </div>

    </section>
  );
}