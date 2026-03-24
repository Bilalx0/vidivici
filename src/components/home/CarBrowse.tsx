"use client";

import { useState } from "react";

const carMakes = [
    { name: "Rolls-Royce", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/rollsroyce.svg" },
    { name: "Cadillac", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/cadillac.svg" },
    { name: "Mercedes", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mercedes.svg" },
    { name: "Bentley", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bentley.svg" },
    { name: "Lamborghini", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/lamborghini.svg" },
    { name: "Aston Martin", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/astonmartin.svg" },
    { name: "BMW", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bmw.svg" },
    { name: "Porsche", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/porsche.svg" },
    { name: "Ferrari", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ferrari.svg" },
    { name: "Maserati", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maserati.svg" },
    { name: "Bugatti", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/bugatti.svg" },
    { name: "McLaren", logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mclaren.svg" },
];

function CarLogo({ car, selected, onClick }) {

    return (
        <button
            onClick={() => onClick(car.name)}
            className={`flex flex-col items-center justify-center gap-3
        py-8 px-14 my-3 rounded-2xl border shrink-0 
        transition-all duration-200 border-gray-200 bg-white hover:border-gray-400 hover:scale-105 `}
        >
            <img
                src={car.logo}
                alt={car.name}
                className="w-16 h-16 object-contain grayscale hover:grayscale-0 transition"
            />
            <span className="text-xs text-gray-600">{car.name}</span>
        </button>
    );
}

export default function CarBrowseSection() {
    const [selectedMake, setSelectedMake] = useState(null);
    const [activeTab, setActiveTab] = useState("make");

    return (
        <section className="w-full bg-[#f5f5f5] py-16 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 mb-10 flex justify-center">
                <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">

                    <button
                        onClick={() => setActiveTab("make")}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === "make"
                                ? "bg-black text-white shadow"
                                : "text-gray-600 hover:text-black"
                            }`}
                    >
                        Browse by Make
                    </button>

                    <button
                        onClick={() => setActiveTab("type")}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === "type"
                                ? "bg-black text-white shadow"
                                : "text-gray-600 hover:text-black"
                            }`}
                    >
                        Browse by Type
                    </button>

                </div>
            </div>

            <div className="mx-auto">

                {/* Row 1 */}
                <div className="marquee">
                    <div className="marquee-track">
                        {[...carMakes, ...carMakes].map((car, i) => (
                            <CarLogo
                                key={i}
                                car={car}
                                selected={selectedMake === car.name}
                                onClick={setSelectedMake}
                            />
                        ))}
                    </div>
                </div>

                {/* Row 2 (reverse) */}
                <div className="marquee mt-4">
                    <div className="marquee-track reverse">
                        {[...carMakes, ...carMakes].map((car, i) => (
                            <CarLogo
                                key={"r" + i}
                                car={car}
                                selected={selectedMake === car.name}
                                onClick={setSelectedMake}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* ✅ CSS INSIDE COMPONENT */}
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

        .marquee-track.reverse {
          animation: scroll-reverse 25s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* Pause on hover */
        .marquee:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
}