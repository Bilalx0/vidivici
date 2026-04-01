"use client";

import { useState } from "react";
import { Heart, Users, Shirt, Banknote, ArrowUpRight } from "lucide-react";

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5 2xl:gap-2">
      <div className="text-mist-600 2xl:scale-150">{icon}</div>
      <span className="text-xs 2xl:text-xl text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] 2xl:text-base text-mist-600">{value}</span>
    </div>
  );
}

export default function EventCard({ event }) {
  const [liked, setLiked] = useState(event.liked || false);

  return (
    /* Width increased to 500px on 2xl to fill the horizontal space of 1912px */
    <div className="relative flex flex-col bg-white rounded-3xl 2xl:rounded-[40px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs 2xl:w-[500px] flex-shrink-0 group cursor-pointer">

      {/* Image - Height scaled for the 7869px verticality */}
      <div className="relative h-56 2xl:h-80 overflow-hidden p-3 2xl:p-5">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); }}
          className={`absolute top-5 right-5 2xl:top-8 2xl:right-8 w-8 h-8 2xl:w-14 2xl:h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            liked
              ? "bg-mist-700 text-red-500"
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} className="2xl:w-6 2xl:h-6" fill={liked ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body - Scaling padding and font sizes */}
      <div className="flex flex-col gap-2 2xl:gap-5 px-8 2xl:px-12 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        <p className="text-xs 2xl:text-lg text-mist-400 font-medium tracking-wide uppercase truncate">
          {event.venue}
        </p>
        <h3 className="text-lg sm:text-xl 2xl:text-4xl font-semibold text-mist-900 leading-snug -mt-0.5">
          {event.name}
        </h3>
        <p className="text-sm 2xl:text-2xl text-mist-600 leading-relaxed">
            {event.description}
        </p>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-4" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-4">
          <button className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-2xl text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

    </div>
  );
}