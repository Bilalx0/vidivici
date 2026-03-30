"use client";

import { useState } from "react";
import { Heart, Users, Shirt, Banknote, ArrowUpRight } from "lucide-react";

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-mist-600">{icon}</div>
      <span className="text-xs text-mist-900 font-semibold">{label}</span>
      <span className="text-[10px] text-mist-600">{value}</span>
    </div>
  );
}

export default function EventCard({ event }) {
  const [liked, setLiked] = useState(event.liked || false);

  return (
    <div className="relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-xs flex-shrink-0 group cursor-pointer">

      {/* Image */}
      <div className="relative h-56 overflow-hidden p-3">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); }}
          className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            liked
              ? "bg-mist-700 text-red-500"
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} fill={liked ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 px-8 pt-3.5 pb-4">
        <p className="text-xs text-mist-400 font-medium tracking-wide uppercase truncate">
          {event.venue}
        </p>
        <h3 className="text-lg sm:text-xl font-semibold text-mist-900 leading-snug -mt-0.5">
          {event.name}
        </h3>
        <p>
            {event.description}
        </p>

        <div className="h-px bg-mist-100 mt-0.5" />

        <div className="flex items-center justify-between mt-0.5">
          <button className="flex items-center gap-1 text-sm text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} strokeWidth={2.5} />
          </button>
        </div>
      </div>

    </div>
  );
}