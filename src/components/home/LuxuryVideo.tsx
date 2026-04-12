"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

// Free-to-use YouTube embed — Lamborghini lifestyle / luxury car video
const VIDEO_ID = "pMAalTqaP9s";

export default function LuxuryVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative w-full bg-[#eeeeed] py-16 2xl:pb-44 2xl:pt-36 px-6 mt-24 2xl:mt-48 mb-44 2xl:mb-80  overflow-visible">

      {/* Left side vector decoration */}
      <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none rotate-180"
      />

      {/* Right side vector decoration */}
      <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180"
      />

      {/* Header - Scaled for 2xl */}
      <div className="relative text-center mb-10 2xl:mb-20 max-w-4xl 2xl:max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl 2xl:text-7xl font-bold text-mist-900 leading-tight">
          Luxury Is a Lifestyle. <br /> Make It Yours.
        </h2>
        <p className="mt-4 2xl:mt-12 text-sm 2xl:text-2xl text-mist-500 leading-relaxed max-w-xl 2xl:max-w-4xl mx-auto">
          At Vidi Vici, luxury isn't just what you drive or where you stay—it's
          how you feel. From the moment you arrive in Los Angeles, every detail
          is curated for sophistication, comfort, and exclusivity.
        </p>
        <button className="mt-6 2xl:mt-16 bg-mist-900 text-white text-sm 2xl:text-xl px-7 py-3 2xl:px-10 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
          Reserve Now
        </button>
      </div>

      {/* Laptop frame + video - Scaled up to 1200px wide on 2xl screens */}
     <div className="relative max-w-2xl 2xl:max-w-[950px] mx-auto -mb-32 2xl:-mb-[325px] transition-all duration-500">
  
  {/* Laptop screen bezel */}
  <div className="rounded-2xl 2xl:rounded-[32px] overflow-hidden shadow-2xl bg-mist-800 p-1 2xl:p-2">
    {/* Screen area */}
    <div className="relative bg-black rounded-lg 2xl:rounded-[24px] overflow-hidden" style={{ aspectRatio: "16/9" }}>

      {/* Thumbnail */}
      {!playing && (
        <>
          <img
            src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
            alt="Luxury lifestyle video"
            className="w-full h-full object-cover"
          />
          {/* Play button */}
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-16 h-12 2xl:w-24 2xl:h-18 bg-white/90 rounded-xl 2xl:rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300">
              <Play size={22} className="text-mist-900 ml-1 2xl:w-9 2xl:h-9" fill="currentColor" />
            </div>
          </button>
        </>
      )}

      {/* YouTube embed */}
      {playing && (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
          title="Luxury Lifestyle Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  </div>

  {/* Laptop base / hinge */}
  <div className="relative mx-4 2xl:mx-8">
    <div className="h-5 2xl:h-7 bg-mist-900 rounded-b-4xl 2xl:rounded-b-[44px] mx-0 shadow-lg" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 2xl:w-28 h-1 2xl:h-1.5 bg-mist-800 rounded-b-full opacity-50" />
  </div>
</div>
    </section>
  );
}