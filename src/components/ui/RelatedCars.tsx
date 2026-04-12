"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "@/components/ui/CarCard";

export const cars = [
  {
    id: 1,
    brand: "Range Rover",
    name: "Range Rover V8",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    seats: "5",
    zeroToSixty: "4.4 sec",
    engine: "523 hp",
    pricePerDay: 499,
    originalPrice: "1,425",
    liked: true,
  },
  {
    id: 2,
    brand: "Tesla",
    name: "Cyber Truck",
    image: "https://images.unsplash.com/photo-1698778573682-346d219402b5?w=800&q=80",
    seats: "Up to 6",
    zeroToSixty: "Under 2.9 sec",
    engine: "800+ hp",
    pricePerDay: 499,
    originalPrice: "1,425",
    liked: false,
  },
  {
    id: 3,
    brand: "Porsche",
    name: "Carrera S 992.2 Cabriolet",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    seats: "2+2",
    zeroToSixty: "3.5 sec",
    engine: "443 hp",
    pricePerDay: 499,
    originalPrice: "1,425",
    liked: true,
  },
  {
    id: 4,
    brand: "Rolls Royce",
    name: "Rolls Royce Ghost",
    image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
    seats: "4",
    zeroToSixty: "4.8 sec",
    engine: "563 hp",
    pricePerDay: 899,
    originalPrice: "2,100",
    liked: false,
  },
  {
    id: 5,
    brand: "Lamborghini",
    name: "Huracán EVO",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    seats: "2",
    zeroToSixty: "2.9 sec",
    engine: "630 hp",
    pricePerDay: 1299,
    originalPrice: "2,800",
    liked: false,
  },
  {
    id: 6,
    brand: "Ferrari",
    name: "488 Spider",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
    seats: "2",
    zeroToSixty: "3.0 sec",
    engine: "660 hp",
    pricePerDay: 1199,
    originalPrice: "2,600",
    liked: false,
  },
];

const CARD_WIDTH = 270 + 20;

export default function ExoticCarRentals({ showHeader = true, discountBadgeText = undefined }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.children[0];
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 20
      : CARD_WIDTH;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const CARD_WIDTH = 270 + 20; // desktop

  const scrollTo = (index) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(index, cars.length - 1));

    // Get actual card width dynamically
    const firstCard = trackRef.current.children[0];
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 20 // 20 = gap
      : CARD_WIDTH;

    trackRef.current.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  return (
    <section className="bg-white w-full overflow-hidden">

      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-8 sm:px-16 lg:px-20 px-6 2xl:px-32 gap-4 pb-7">
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-bold text-mist-900 tracking-tight">
            Exotic Car Rentals
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


        {/* Carousel track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cars.map((car) => (
            <CarCard key={car.id} car={car} discountBadgeText={discountBadgeText} />
          ))}
          <div className="w-6 shrink-0" />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-10 2xl:mt-16">
        {cars.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${i === activeIndex
                  ? "w-6 h-3 bg-mist-800"
                : "w-2 h-2 2xl:w-3 2xl:h-3 bg-mist-300 hover:bg-mist-400"
              }`}
          />
        ))}
      </div>

    </section>
  );
}