"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, BedDouble, Users, Maximize2, ArrowUpRight } from "lucide-react";

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 2xl:gap-2">
      <div className="text-mist-600 2xl:scale-150">{icon}</div>
      <span className="text-xs 2xl:text-base text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] 2xl:text-sm text-mist-600">{value}</span>
    </div>
  );
}

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
    /* Width increased to 500px on 2xl to match CarCard and EventCard scaling */
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs 2xl:w-[500px] flex-shrink-0 group cursor-pointer">

      {/* Image - Height and padding scaled for 2xl */}
      <div className="relative h-56 2xl:h-[350px] overflow-hidden p-3 2xl:m-5">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 320px, 500px"
          className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setFav((p) => !p); }}
          className={`absolute top-5 right-5 w-8 h-8 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            fav
              ? "bg-mist-700 text-red-500"
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} className="2xl:w-4 2xl:h-4" fill={fav ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body - Padding and spacing significantly increased for 2xl */}
      <div className="flex flex-col gap-2 2xl:gap-5 px-8 2xl:px-12 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        <p className="text-xs 2xl:text-base text-mist-400 font-medium tracking-wide uppercase truncate">
          {tag}
        </p>
        <h3 className="text-lg sm:text-xl 2xl:text-3xl font-semibold text-mist-900 leading-snug -mt-0.5">
          {name}
        </h3>

        {/* Stats Row - Vertical dividers scaled for high resolution */}
        <div className="flex items-center justify-between px-4 2xl:px-0 py-3 2xl:py-4">
          <StatPill icon={<BedDouble size={12} />} label="Bedrooms" value={bedrooms} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Users size={12} />} label="Guests" value={guests} />
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <StatPill icon={<Maximize2 size={12} />} label="Sq.ft" value={sqft} />
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        {/* Footer - Pricing and CTAs scaled up */}
        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <button className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-xl text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-2xl font-semibold text-mist-900">${price}</span>
            <span className="text-[10px] 2xl:text-base text-mist-400">
            <span className="text-[10px] 2xl:text-base text-mist-400 line-through">${oldPrice}</span> / night
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}