"use client";

import { useState } from "react";
import { Heart, Users, Gauge, Zap, ArrowUpRight } from "lucide-react";

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 2xl:gap-2">
      <div className="text-mist-600 2xl:scale-150">{icon}</div> {/* Scaled icon for 2xl */}
      <span className="text-xs 2xl:text-xl text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] 2xl:text-base text-mist-600">{value}</span>
    </div>
  );
}

export default function CarCard({ car }) {
  const [liked, setLiked] = useState(car.liked || false);

  return (
    /* Increased 2xl width to [500px] to occupy better horizontal space */
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs 2xl:w-[500px] flex-shrink-0 group cursor-pointer">

      {/* Image - Height increased for 2xl */}
      <div className="relative h-56 2xl:h-[350px] overflow-hidden p-3 2xl:p-5">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); }}
          className={`absolute top-5 right-5 2xl:top-8 2xl:right-8 w-8 h-8 2xl:w-14 2xl:h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${liked
              ? "bg-mist-700 text-red-500"
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
            }`}
        >
          <Heart size={13} className="2xl:w-6 2xl:h-6" fill={liked ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body - Significant padding and font bumps for 2xl */}
      <div className="flex flex-col gap-2 2xl:gap-5 px-8 2xl:px-12 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        <p className="text-xs 2xl:text-lg text-mist-400 font-medium tracking-wide uppercase truncate">
          {car.brand}
        </p>
        <h3 className="text-lg sm:text-xl 2xl:text-4xl font-semibold text-mist-900 leading-snug -mt-0.5 line-clamp-1">
          {car.name}
        </h3>

        <div className="flex items-center justify-between px-4 2xl:px-0 py-3 2xl:py-4">
          <StatPill icon={<Users size={12} />} label="Seats" value={car.seats} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Gauge size={12} />} label="0-60 mph" value={car.zeroToSixty} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Zap size={12} />} label="Engine" value={car.engine} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <button className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-2xl text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-3xl font-semibold text-mist-900">${car.pricePerDay}</span>
            <span className="text-[10px] 2xl:text-lg text-mist-400">
            <span className="text-[10px] 2xl:text-lg text-mist-400 line-through">${car.originalPrice}</span> / day
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}