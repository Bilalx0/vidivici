"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  { id: 1, name: "James Whitfield", avatar: "https://i.pravatar.cc/40?img=11", rating: 5, text: "Absolutely seamless experience from start to finish. The Rolls Royce Ghost was immaculate and the chauffeur was incredibly professional. Vidi Vici sets a new standard for luxury car rentals in LA." },
  { id: 2, name: "Sofia Reyes", avatar: "https://i.pravatar.cc/40?img=47", rating: 5, text: "I booked a Lamborghini Huracán for a weekend trip to Malibu. The process was effortless, no hidden fees, and the car was a dream. Will absolutely be back for every special occasion." },
  { id: 3, name: "Marcus Chen", avatar: "https://i.pravatar.cc/40?img=33", rating: 4, text: "Rented the Porsche Carrera for my anniversary. My partner was blown away. The team went above and beyond to ensure every detail was perfect. Highly recommend to anyone wanting a premium experience." },
  { id: 4, name: "Priya Nair", avatar: "https://i.pravatar.cc/40?img=56", rating: 5, text: "From the VIP event service to the Tesla Cybertruck delivery right to my door, nothing was short of spectacular. Vidi Vici truly understands what luxury hospitality means." },
  { id: 5, name: "Ethan Brooks", avatar: "https://i.pravatar.cc/40?img=15", rating: 5, text: "The Ferrari 488 Spider was in perfect condition and the whole booking process took under five minutes. Transparent pricing, friendly staff, and an unforgettable drive along the Pacific Coast Highway." },
  { id: 6, name: "Lena Müller", avatar: "https://i.pravatar.cc/40?img=44", rating: 4, text: "I was skeptical at first but Vidi Vici completely exceeded my expectations. The Range Rover V8 was spotless and delivery was on time. Customer support was responsive and kind throughout." },
  { id: 7, name: "Andre Fontaine", avatar: "https://i.pravatar.cc/40?img=22", rating: 5, text: "Used Vidi Vici for a client event and it made a huge impression. The vehicles are pristine and the professionalism is unmatched. This is the only service I trust for luxury rentals." },
  { id: 8, name: "Camille Torres", avatar: "https://i.pravatar.cc/40?img=49", rating: 5, text: "Booked the Bentley for my wedding day and it was perfect. The team coordinated everything flawlessly. I cannot imagine that special day without the magic Vidi Vici added to it." },
];

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 mt-1 2xl:gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          className="2xl:w-6 2xl:h-6"
          fill={i < rating ? "#FACC15" : "none"}
          stroke={i < rating ? "#FACC15" : "#D1D5DB"}
          strokeWidth="2"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

// Fixed Constants
const CARD_WIDTH = 300;
const CARD_WIDTH_2XL = 550; 
const CARD_GAP = 16;     // gap-4
const CARD_GAP_2XL = 40; // 2xl:gap-10

export default function Testimonials() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const getStep = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1536) {
      return CARD_WIDTH_2XL + CARD_GAP_2XL;
    }
    return CARD_WIDTH + CARD_GAP;
  };

  const updateState = () => {
    const el = trackRef.current;
    if (!el) return;
    const step = getStep();
    setActiveIndex(Math.round(el.scrollLeft / step));
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    updateState(); // Initial check
    return () => {
      el.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  const scroll = (dir) => {
    const step = getStep();
    trackRef.current?.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  const scrollToIndex = (i) => {
    const step = getStep();
    trackRef.current?.scrollTo({ left: i * step, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-16 2xl:py-48 overflow-hidden">
      
      {/* Header */}
      <div className="text-center mb-10 2xl:mb-24 sm:px-16 lg:px-20 px-6">
        <h2 className="text-3xl 2xl:text-7xl font-bold text-mist-900 tracking-tight">
          What Our Customers Are Saying
        </h2>
        <p className="mt-3 2xl:mt-8 text-sm 2xl:text-2xl text-mist-500 max-w-md 2xl:max-w-4xl mx-auto leading-relaxed">
          From first-class service to unforgettable moments, our clients share why Vidi Vici is
          their choice for luxury in Los Angeles.
        </p>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll(-1)}
          disabled={!canLeft}
          className="absolute left-3 2xl:left-10 top-1/2 -translate-y-1/2 z-20 w-9 h-9 2xl:w-12 2xl:h-12 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all disabled:opacity-20"
        >
          <ChevronLeft className="text-mist-700 w-4 h-4 2xl:w-6 2xl:h-6" strokeWidth={2.5} />
        </button>

        <button
          onClick={() => scroll(1)}
          disabled={!canRight}
          className="absolute right-3 2xl:right-10 top-1/2 -translate-y-1/2 z-20 w-9 h-9 2xl:w-12 2xl:h-12 rounded-full bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all disabled:opacity-20"
        >
          <ChevronRight className="text-mist-700 w-4 h-4 2xl:w-6 2xl:h-6" strokeWidth={2.5} />
        </button>

        {/* Carousel Track */}
        <div
          ref={trackRef}
          className="flex gap-4 2xl:gap-10 overflow-x-auto px-14 2xl:px-40 pb-4 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((r) => (
            <div
              key={r.id}
              /* FIX: Removed style-jsx and variable reference. 
                 Using Tailwind's arbitrary width for 2xl.
              */
              className="flex-shrink-0 bg-white border border-mist-100 rounded-2xl 2xl:rounded-[40px] shadow-sm p-5 2xl:p-12 flex flex-col justify-between w-[300px] 2xl:w-[550px]"
            >
              <p className="text-[13px] 2xl:text-2xl text-mist-500 leading-relaxed italic">
                "{r.text}"
              </p>
              
              <div className="flex items-center gap-3 2xl:gap-6 mt-5 2xl:mt-12 pt-4 2xl:pt-10 border-t border-mist-100">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-9 h-9 2xl:w-20 2xl:h-20 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-[13px] 2xl:text-2xl font-normal text-mist-900 leading-none">
                    {r.name}
                  </p>
                  <Stars rating={r.rating} />
                </div>
              </div>
            </div>
          ))}
          {/* Spacer for end of scroll */}
          <div className="w-8 2xl:w-40 flex-shrink-0" />
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 2xl:gap-4 mt-6 2xl:mt-16">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-5 h-2 2xl:w-12 2xl:h-4 bg-mist-900"
                : "w-2 h-2 2xl:w-4 2xl:h-4 bg-mist-300 hover:bg-mist-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}