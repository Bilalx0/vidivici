"use client";

import { useState } from "react";
import { Heart, Users, Gauge, Zap, ArrowUpRight } from "lucide-react";

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-gray-400">{icon}</div>
      <span className="text-[10px] text-gray-400">{label}</span>
      <span className="text-[11px] font-semibold text-gray-700">{value}</span>
    </div>
  );
}

export default function CarCard({ car }) {
  const [liked, setLiked] = useState(car.liked || false);

  return (
    <div className="relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 w-xs flex-shrink-0 group cursor-pointer">

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            liked
              ? "bg-red-500 text-white"
              : "bg-white/75 text-gray-500 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} fill={liked ? "currentColor" : "none"} strokeWidth={2} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4">
        <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase truncate">
          {car.brand}
        </p>
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug -mt-0.5">
          {car.name}
        </h3>

        <div className="flex items-center justify-between mt-0.5">
          <StatPill icon={<Users size={12} />} label="Seats" value={car.seats} />
          <div className="w-px h-8 bg-gray-100" />
          <StatPill icon={<Gauge size={12} />} label="0-60 mph" value={car.zeroToSixty} />
          <div className="w-px h-8 bg-gray-100" />
          <StatPill icon={<Zap size={12} />} label="Engine" value={car.engine} />
        </div>

        <div className="h-px bg-gray-100 mt-0.5" />

        <div className="flex items-center justify-between mt-0.5">
          <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            View Details <ArrowUpRight size={11} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-bold text-gray-900">${car.pricePerDay}</span>
            <span className="text-[10px] text-gray-400 line-through">${car.originalPrice}/day</span>
          </div>
        </div>
      </div>

    </div>
  );
}