"use client";

import { useState } from "react";
import Image from "next/image";

const carMakes = [
  { name: "Rolls-Royce", logo: "/carlogo1.png" },
  { name: "Cadillac", logo: "/carlogo2.png" },
  { name: "Mercedes", logo: "/carlogo3.png" },
  { name: "Bentley", logo: "/carlogo4.png" },
  { name: "Lamborghini", logo: "/carlogo5.png" },
  { name: "Aston Martin", logo: "/carlogo6.png" },
  { name: "BMW", logo: "/carlogo7.png" },
  { name: "Porsche", logo: "/carlogo8.png" },
  { name: "Ferrari", logo: "/carlogo9.png" },
  { name: "Maserati", logo: "/carlogo10.png" },
  { name: "Bugatti", logo: "/carlogo11.png" },
  { name: "McLaren", logo: "/carlogo12.png" },
];

const carTypes = [
  { name: "SUV", logo: "/type1.png" },
  { name: "Sports", logo: "/type2.png" },
  { name: "Luxury", logo: "/type3.png" },
  { name: "Convertible", logo: "/type4.png" },
  { name: "Sedan", logo: "/type5.png" },
  { name: "Electric", logo: "/type6.png" },
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
  return (
    <button
      onClick={() => onClick(item.name)}
      className="flex flex-col items-center justify-center gap-4 2xl:gap-10
      py-8 px-12 2xl:py-20 2xl:px-32 my-4 rounded-3xl border shrink-0
      transition-all duration-300 border-gray-200 bg-white
      hover:border-black hover:scale-105 group shadow-sm hover:shadow-xl"
    >
      <div className={`relative transition-transform duration-500 group-hover:scale-110
        ${isType 
          ? "w-20 h-10 sm:w-28 sm:h-14 2xl:w-64 2xl:h-32" 
          : "w-14 h-14 sm:w-20 sm:h-20 2xl:w-40 2xl:h-40"
        }`}
      >
        <Image
          src={item.logo}
          alt={item.name}
          fill
          className="object-contain filter grayscale group-hover:grayscale-0 transition-all"
        />
      </div>
      
      <span className="text-[10px] sm:text-xs 2xl:text-2xl font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-black">
        {item.name}
      </span>
    </button>
  );
}

export default function CarBrowseSection() {
  const [activeTab, setActiveTab] = useState("make");
  const isType = activeTab === "type";
  const data = isType ? carTypes : carMakes;

  const marqueeItems = [...data, ...data, ...data, ...data];

  return (
    <section className="w-full bg-[#fcfcfc] py-16 sm:py-24 2xl:py-48 overflow-hidden">
      
      {/* Buttons Container - Now two separate independent buttons */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 mb-16 2xl:mb-32 flex flex-row items-center justify-center gap-4 2xl:gap-12">
        
        {/* Button: Browse by Make */}
        <button
          onClick={() => setActiveTab("make")}
          className={`px-8 py-3 2xl:px-16 2xl:py-6 text-xs sm:text-sm 2xl:text-xl font-semibold uppercase tracking-widest rounded-xl 2xl:rounded-2xl border-2 transition-all duration-300 ${
            !isType
              ? "bg-black border-black text-white shadow-2xl scale-105"
              : "bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black"
          }`}
        >
          Browse by Make
        </button>

        {/* Button: Browse by Type */}
        <button
          onClick={() => setActiveTab("type")}
          className={`px-8 py-3 2xl:px-16 2xl:py-6 text-xs sm:text-sm 2xl:text-xl font-semibold uppercase tracking-widest rounded-xl 2xl:rounded-2xl border-2 transition-all duration-300 ${
            isType
              ? "bg-black border-black text-white shadow-2xl scale-105"
              : "bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black"
          }`}
        >
          Browse by Type
        </button>

      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full">
        {/* Luxury Fades */}
        <div className="absolute inset-y-0 left-0 w-32 2xl:w-80 bg-gradient-to-r from-[#fcfcfc] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 2xl:w-80 bg-gradient-to-l from-[#fcfcfc] to-transparent z-10 pointer-events-none" />

        <div className="marquee">
          <div className={`marquee-track ${isType ? 'speed-type' : 'speed-make'}`}>
            {marqueeItems.map((item, i) => (
              <BrowseCard
                key={`${activeTab}-${i}`}
                item={item}
                isType={isType}
                onClick={(name) => console.log(name)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee {
          overflow: hidden;
          width: 100%;
        }

        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
        }

        .speed-make {
          animation: scroll 45s linear infinite;
        }

        .speed-type {
          animation: scroll 28s linear infinite;
        }

        @media (min-width: 1900px) {
          .marquee-track {
            gap: 64px;
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