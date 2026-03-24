"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import VillaCard from "@/components/ui/VillaCard";

const villas = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Collina Royale",
    bedrooms: 6,
    guests: 12,
    sqft: "5.5k",
    price: "$6,500",
    oldPrice: "$7,500",
    isFavorited: false,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Villa Legende",
    bedrooms: 4,
    guests: 10,
    sqft: "4.8k",
    price: "$6,500",
    oldPrice: "$7,500",
    isFavorited: true,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Villa Solaré",
    bedrooms: 4,
    guests: 8,
    sqft: "6.5k",
    price: "$6,500",
    oldPrice: "$7,500",
    isFavorited: false,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Casa Del Mar",
    bedrooms: 5,
    guests: 10,
    sqft: "5.1k",
    price: "$7,200",
    oldPrice: "$8,800",
    isFavorited: false,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Maison Blanc",
    bedrooms: 3,
    guests: 6,
    sqft: "3.9k",
    price: "$5,100",
    oldPrice: "$6,200",
    isFavorited: false,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "Villa Aurore",
    bedrooms: 7,
    guests: 14,
    sqft: "7.2k",
    price: "$9,800",
    oldPrice: "$11,500",
    isFavorited: false,
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    tag: "Luxury Villa for Rent | LA - 2025",
    name: "The Summit",
    bedrooms: 5,
    guests: 10,
    sqft: "6.0k",
    price: "$8,400",
    oldPrice: "$9,900",
    isFavorited: false,
  },
];

const CARD_WIDTH = 240 + 16; // card width + gap

export default function Villa() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setActiveIndex(Math.min(Math.round(el.scrollLeft / CARD_WIDTH), villas.length - 1));
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, []);

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * CARD_WIDTH * 2, behavior: "smooth" });
  };

  const scrollToIndex = (i) => {
    trackRef.current?.scrollTo({ left: i * CARD_WIDTH, behavior: "smooth" });
  };

  return (
    <section className="w-full py-16">
      <div className="mx-auto">

        {/* Header */}
        <div className="px-6 flex items-center justify-between mb-8 md:px-12 lg:px-20">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Luxury Villa Rentals
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                  : "border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                  : "border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>

            <button className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-gray-400 transition-all duration-200">
              View all <ArrowUpRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          ref={trackRef}
          className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {villas.map((villa) => (
            <VillaCard
              key={villa.id}
              image={villa.image}
              tag={villa.tag}
              name={villa.name}
              bedrooms={villa.bedrooms}
              guests={villa.guests}
              sqft={villa.sqft}
              price={villa.price}
              oldPrice={villa.oldPrice}
              isFavorited={villa.isFavorited}
            />
          ))}
          <div className="w-4 flex-shrink-0" />
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {villas.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-5 h-2 bg-gray-900"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}