"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

function CarLogo({ car, selected, onClick }: { car: { name: string; logo: string }; selected: boolean; onClick: (name: string) => void }) {
  return (
    <button
      onClick={() => onClick(car.name)}
      className="flex flex-col items-center justify-center gap-3
      py-8 px-14 my-3 rounded-2xl border shrink-0
      transition-all duration-200 border-gray-200 bg-white
      hover:border-gray-400 hover:scale-105"
    >
      <img
        src={car.logo}
        alt={car.name}
        className="w-16 h-16 object-contain grayscale hover:grayscale-0 transition"
      />

      <span className="text-xs text-mist-600">{car.name}</span>
    </button>
  );
}

function CategoryCard({ category, onClick }: { category: { slug: string; name: string }; onClick: (slug: string) => void }) {
    return (
        <button
            onClick={() => onClick(category.slug)}
            className="flex flex-col items-center justify-center gap-3
        py-8 px-14 my-3 rounded-2xl border shrink-0
        transition-all duration-200 border-gray-200 bg-white hover:border-gray-400 hover:scale-105"
        >
            <span className="text-lg font-semibold text-gray-700">{category.name}</span>
        </button>
    );
}

export default function CarBrowseSection() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("make");

  const data = activeTab === "make" ? carMakes : carTypes;

  return (
    <section className="w-full bg-[#f5f5f5] py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 mb-10 flex justify-center">
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">

          <button
            onClick={() => setActiveTab("make")}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "make"
                ? "bg-mist-900 text-white shadow"
                : "text-mist-600 hover:text-black"
            }`}
          >
            Browse by Make
          </button>

          <button
            onClick={() => setActiveTab("type")}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === "type"
                ? "bg-black text-white shadow"
                : "text-mist-600 hover:text-black"
            }`}
          >
            Browse by Type
          </button>

        </div>
      </div>

      <div className="mx-auto">

        <div className="marquee">
          <div className="marquee-track">
            {[...data, ...data].map((car, i) => (
              <CarLogo
                key={i}
                car={car}
                selected={selectedItem === car.name}
                onClick={setSelectedItem}
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
          gap: 16px;
          width: max-content;
          animation: scroll 25s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}