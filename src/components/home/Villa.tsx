"use client";

import { useRef, useState } from "react";
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

const CARD_WIDTH = 240 + 16; // desktop

export default function Villa({ showHeader = true }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.children[0];
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 16
      : CARD_WIDTH;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollTo = (index) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(index, villas.length - 1));

    // Get actual card width dynamically
    const firstCard = trackRef.current.children[0];
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 16 // 16 = gap
      : CARD_WIDTH;

    trackRef.current.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  return (
    <section className="w-full mt-16 2xl:mt-48">
      <div className="">

        {/* Header */}
        {showHeader && (
        <div className="flex items-center justify-between mb-8 px-6 sm:px-16 lg:px-20 2xl:px-32 gap-4 pb-7 ">
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-bold text-mist-900 tracking-tight">
            Luxury Villa Rentals
          </h2>
          <button className="flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base 2xl:text-xl 2xl:py-4 2xl:px-6 text-mist-500 bg-mist-200 border border-mist-200 rounded-xl hover:bg-mist-50 hover:border-mist-300 transition-all duration-200 whitespace-nowrap">
      View all
      <ArrowUpRight size={15} />
    </button>
        </div>
      )}


        <div className="relative">
         
            <button
              onClick={() => scrollTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full 2xl:w-12 2xl:h-12 bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
            >
              <ChevronLeft size={16} strokeWidth={2.5} className="text-mist-700 2xl:w-6 2xl:h-6" />
            </button>

            <button
              onClick={() => scrollTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full 2xl:w-12 2xl:h-12 bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
            >
              <ChevronRight size={16} strokeWidth={2.5} className="text-mist-700 2xl:w-6 2xl:h-6" />
            </button>
    


          {/* Carousel Track */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
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

        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {villas.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${i === activeIndex
                ? "w-5 h-2 bg-mist-900"
                : "w-2 h-2 bg-mist-300 hover:bg-mist-500"
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}