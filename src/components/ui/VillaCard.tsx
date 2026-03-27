"use client";

import { useState } from "react";
import { Heart, BedDouble, Users, Maximize2, ArrowUpRight } from "lucide-react";

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-mist-400">{icon}</div>
      <span className="text-[10px] text-mist-400">{label}</span>
      <span className="text-[11px] font-semibold text-mist-700">{value}</span>
    </div>
  );
}

/**
 * VillaCard Props:
 * - image: string
 * - tag: string
 * - name: string
 * - bedrooms: number
 * - guests: number
 * - sqft: string
 * - price: string
 * - oldPrice: string
 * - isFavorited: boolean
 * - onViewDetails: function
 */
export default function VillaCard({
  image,
  tag = "Luxury Villa for Rent | LA - 2025",
  name = "Villa Name",
  bedrooms = 4,
  guests = 8,
  sqft = "4.8k",
  price = "$6,500",
  oldPrice = "$7,500",
  isFavorited = false,
}) {
  const [fav, setFav] = useState(isFavorited);

  return (
    <div className="relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs flex-shrink-0 group cursor-pointer">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setFav((p) => !p); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            fav
              ? "bg-red-500 text-white"
              : "bg-white/75 text-mist-500 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} fill={fav ? "currentColor" : "none"} strokeWidth={2} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4">
        <p className="text-[10px] text-mist-400 font-medium tracking-wide uppercase truncate">
          {tag}
        </p>
        <h3 className="text-[15px] font-semibold text-mist-900 leading-snug -mt-0.5">
          {name}
        </h3>

        <div className="flex items-center justify-between mt-0.5">
          <StatPill icon={<BedDouble size={12} />} label="Bedrooms" value={bedrooms} />
          <div className="w-px h-8 bg-gray-100" />
          <StatPill icon={<Users size={12} />} label="Guests" value={guests} />
          <div className="w-px h-8 bg-gray-100" />
          <StatPill icon={<Maximize2 size={12} />} label="Sq.ft" value={sqft} />
        </div>

        <div className="h-px bg-gray-100 mt-0.5" />

        <div className="flex items-center justify-between mt-0.5">
          <button
            className="flex items-center gap-1 text-[11px] font-semibold text-mist-500 hover:text-mist-900 transition-colors"
          >
            View Details <ArrowUpRight size={11} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-bold text-mist-900">{price}</span>
            <span className="text-[10px] text-mist-400 line-through">{oldPrice}/night</span>
          </div>
        </div>
      </div>
    </div>
  );
}