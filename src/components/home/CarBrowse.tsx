"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carMakes = [
  { name: "Rolls-Royce", logo: "/Mask group-4.png" },
  { name: "Cadillac", logo: "/carlogo7.png" },
  { name: "Mercedes", logo: "/carlogo4.png" },
  { name: "Bentley", logo: "/carlogo8.png" },
  { name: "Lamborghini", logo: "/carlogo3.png" },
  { name: "Aston Martin", logo: "/carlogo2.png" },
  { name: "BMW", logo: "/carlogo5.png" },
  { name: "Porsche", logo: "/carlogo11.png" },
  { name: "Audi", logo: "/carlogo9.png" },
  { name: "Maserati", logo: "/carlogo12.png" },
  { name: "Range Rover", logo: "/carlogo6.png" },
  { name: "McLaren", logo: "/carlogo10.png" },
];

const carTypes = [
  { name: "Sports", logo: "/type1.png" },
  { name: "Sedan", logo: "/type2.png" },
  { name: "Luxury", logo: "/type3.png" },
  { name: "Electric", logo: "/type4.png" },
  { name: "SUV", logo: "/type5.png" },
  { name: "Convertible", logo: "/type6.png" },
];

function BrowseCard({ 
  item, 
  isType, 
  onClick 
}: { 
  item: { name: string; logo: string }; 
  isType: boolean; 
  onClick: (name: string) => void 
}) {

  const logoSizeClass = isType
    ? "w-36 h-20 sm:w-36 sm:h-20 2xl:w-48 2xl:h-28"
    : "w-36 h-20 sm:w-36 sm:h-20 2xl:w-48 2xl:h-28";

  const logoScaleClass = isType
    ? "scale-[1.35] sm:scale-[1.35] 2xl:scale-[1.4]"
    : "scale-100 2xl:scale-105";

  return (
    <button
      onClick={() => onClick(item.name)}
      className={`flex flex-col items-center justify-center gap-4 2xl:gap-6
      py-5 px-7 sm:py-7 sm:px-10 2xl:py-10 2xl:px-16 my-4 rounded-2xl border shrink-0
      transition-all duration-300 border-mist-200 bg-white
      hover:border-black hover:scale-105 group shadow-sm hover:shadow-xl`} 
    >
      <div className={`relative transition-transform duration-500 group-hover:scale-110 ${logoSizeClass}`}>
        <Image
          src={item.logo}
          alt={item.name}
          fill
          className={`object-contain filter mistscale group-hover:mistscale-0 transition-all duration-300 ${logoScaleClass}`}
        />
      </div>

      <span className="text-[10px] sm:text-xs 2xl:text-sm font-bold uppercase tracking-[0.2em] text-mist-400 group-hover:text-black">
        {item.name}
      </span>
    </button>
  );
}

export default function CarBrowseSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("make");
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isType = activeTab === "type";
  const data = isType ? carTypes : carMakes;

  const typeToCategory: Record<string, string> = {
    SUV: "SUV",
    Sports: "Coupe | Sports",
    Luxury: "Ultra-Luxury",
    Convertible: "Convertible",
    Sedan: "Sedan | 4-Door",
    Electric: "EV",
  };

  const marqueeItems = [...data, ...data, ...data, ...data];

  const scrollMarquee = (direction: "left" | "right") => {
    const node = marqueeRef.current;
    if (!node) return;
    const delta = direction === "left" ? -320 : 320;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleBrowseClick = (name: string) => {
    if (isType) {
      const category = typeToCategory[name] || name;
      router.push(`/cars?category=${encodeURIComponent(category)}`);
      return;
    }
    router.push(`/cars?make=${encodeURIComponent(name)}`);
  };

  return (
    <section className="w-full bg-[#fcfcfc] mt-16 2xl:mt-48 overflow-hidden">
      
      {/* Buttons Container */}
      <div className="px-6 mb-16 2xl:mb-20 flex flex-row items-center justify-center gap-4 2xl:gap-8">
        
        {/* Button: Browse by Make */}
        <button
          onClick={() => setActiveTab("make")}
          className={`px-7 py-2.5 2xl:px-10 2xl:py-3 text-xs sm:text-sm 2xl:text-base font-semibold uppercase tracking-widest rounded-xl 2xl:rounded-2xl border-2 transition-all duration-300 ${
            !isType
              ? "bg-black border-black text-white shadow-2xl scale-105"
              : "bg-white border-mist-200 text-mist-400 hover:border-black hover:text-black"
          }`}
        >
          Browse by Make
        </button>

        {/* Button: Browse by Type */}
        <button
          onClick={() => setActiveTab("type")}
          className={`px-7 py-2.5 2xl:px-10 2xl:py-3 text-xs sm:text-sm 2xl:text-base font-semibold uppercase tracking-widest rounded-xl 2xl:rounded-2xl border-2 transition-all duration-300 ${
            isType
              ? "bg-black border-black text-white shadow-2xl scale-105"
              : "bg-white border-mist-200 text-mist-400 hover:border-black hover:text-black"
          }`}
        >
          Browse by Type
        </button>

      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => scrollMarquee("left")}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full 2xl:w-10 2xl:h-10 bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} strokeWidth={2.5} className="text-mist-700 2xl:w-5 2xl:h-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollMarquee("right")}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full 2xl:w-10 2xl:h-10 bg-white border border-mist-200 shadow-md flex items-center justify-center hover:bg-mist-50 transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} strokeWidth={2.5} className="text-mist-700 2xl:w-5 2xl:h-5" />
        </button>

        <div ref={marqueeRef} className="marquee">
          <div className={`marquee-track ${isType ? 'speed-type' : 'speed-make'}`}>
            {marqueeItems.map((item, i) => (
              <BrowseCard
                key={`${activeTab}-${i}`}
                item={item}
                isType={isType}
                onClick={handleBrowseClick}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee {
          overflow: hidden;
          width: 100%;
          scroll-behavior: smooth;
        }

        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
        }

        .speed-make {
          animation: scroll 70s linear infinite;
        }

        .speed-type {
          animation: scroll 35s linear infinite;
        }

        @media (min-width: 1900px) {
          .marquee-track {
            gap: 40px;
          }
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); } 
        }

        .marquee:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}