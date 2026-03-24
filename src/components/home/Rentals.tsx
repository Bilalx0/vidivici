"use client";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
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

const CARD_WIDTH = 270 + 20; // card width + gap

export default function ExoticCarRentals() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index) => {
    if (!trackRef.current) return;
    const clamped = Math.max(0, Math.min(index, cars.length - 1));
    trackRef.current.scrollTo({ left: clamped * CARD_WIDTH, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const index = Math.round(trackRef.current.scrollLeft / CARD_WIDTH);
    setActiveIndex(index);
  };

  return (
    <section className="bg-white w-full py-16 overflow-hidden ">

      {/* Header */}
      <div className="max-w-[1300px] mx-auto px-6 flex items-center justify-between mb-8 md:px-12 lg:px-20">
        <h2 className="text-[2rem] font-bold text-gray-900 tracking-tight">
          Exotic Car Rentals
        </h2>
        <button className="flex items-center gap-2 px-5 py-2.5 text-[13.5px] font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
          View all
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Carousel track — hide scrollbar via inline style (no Tailwind utility) */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-5 px-6 md:px-12 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
        {/* Right padding spacer */}
        <div className="w-6 shrink-0" />
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-7">
        {cars.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-5 h-2 bg-gray-800"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

    </section>
  );
}