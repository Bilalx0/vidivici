"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Users, Gauge, Zap, ArrowUpRight } from "lucide-react";

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 2xl:gap-1.5">
      <div className="text-mist-600 2xl:scale-125">{icon}</div>
      <span className="text-xs 2xl:text-sm text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] 2xl:text-xs text-mist-600">{value}</span>
    </div>
  );
}

export default function CarCard({ car, discountBadgeText = undefined }) {
  const [liked, setLiked] = useState(car.liked || false);

  return (
    /* Width slightly decreased to 450px on 2xl for better fit on large screens */
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs 2xl:w-[450px] flex-shrink-0 group cursor-pointer">

      {/* Image - Height slightly decreased for 2xl */}
      <div className="relative h-56 2xl:h-[300px] overflow-hidden p-3 2xl:p-4">
        {/* Discount badge */}
        {discountBadgeText && (
          <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-green-500 text-white font-bold text-xs 2xl:text-sm px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-full shadow-lg" style={{ minWidth: 'fit-content' }}>
            <span role="img" aria-label="fire" className=" ">🔥</span> <p>{discountBadgeText}</p>
          </div>
        )}
        <Image
          src={car.image}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 320px, 450px"
          className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-2xl"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); }}
          className={`absolute top-5 right-5 w-8 h-8 2xl:w-11 2xl:h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${liked
              ? "bg-mist-700 text-red-500"
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
            }`}
        >
          <Heart size={13} className="2xl:w-3.5 2xl:h-3.5" fill={liked ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body - Padding and spacing slightly decreased for 2xl */}
      <div className="flex flex-col gap-2 2xl:gap-4 px-6 2xl:px-8 pt-3.5 2xl:pt-5 pb-4 2xl:pb-6">
        <p className="text-xs 2xl:text-sm text-mist-400 font-medium tracking-wide uppercase truncate">
          {car.brand}
        </p>
        <h3 className="text-lg sm:text-xl 2xl:text-2xl font-semibold text-mist-900 leading-snug -mt-0.5 line-clamp-1">
          {car.name}
        </h3>

        <div className="flex items-center justify-between px-3 2xl:px-2 py-3 2xl:py-3.5">
          <StatPill icon={<Users size={12} />} label="Seats" value={car.seats} />
          <div className="w-px h-8 2xl:h-12 bg-mist-100" />
          <StatPill icon={<Gauge size={12} />} label="0-60 mph" value={car.zeroToSixty} />
          <div className="w-px h-8 2xl:h-12 bg-mist-100" />
          <StatPill icon={<Zap size={12} />} label="Engine" value={car.engine} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <button className="flex items-center gap-1 2xl:gap-2.5 text-sm 2xl:text-lg text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-4.5 2xl:h-4.5" strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-xl font-semibold text-mist-900">${car.pricePerDay}</span>
            <span className="text-[10px] 2xl:text-sm text-mist-400">
            <span className="text-[10px] 2xl:text-sm text-mist-400 line-through">${car.originalPrice}</span> / day
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}