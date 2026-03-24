"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

// Free-to-use YouTube embed — Lamborghini lifestyle / luxury car video
const VIDEO_ID = "pMAalTqaP9s";

export default function LuxuryVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative w-full bg-[#eeeeed] overflow-hidden py-16 px-6">

      {/* Background watermark pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='80' font-size='80' font-family='serif' font-weight='700' fill='%23000'%3EV%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />

      {/* Header */}
      <div className="relative text-center mb-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-black text-gray-900">
          Luxury Is a Lifestyle. <br /> Make It Yours.
        </h2>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
          At Vidi Vici, luxury isn't just what you drive or where you stay—it's
          how you feel. From the moment you arrive in Los Angeles, every detail
          is curated for sophistication, comfort, and exclusivity.
        </p>
        <button className="mt-6 bg-gray-900 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-200">
          Reserve Now
        </button>
      </div>

      {/* Laptop frame + video */}
      <div className="relative max-w-2xl mx-auto">
        {/* Laptop screen bezel */}
        <div className="rounded-2xl overflow-hidden border-[8px] border-gray-800 shadow-2xl bg-gray-800">
          {/* Screen area */}
          <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>

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
                  <div className="w-16 h-12 bg-white/90 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-105 transition-all duration-200">
                    <Play size={22} className="text-gray-900 ml-1" fill="currentColor" />
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
        <div className="relative mx-auto mt-0">
          <div className="h-2 bg-gray-600 rounded-b-2xl mx-0 shadow-lg" />
        </div>
      </div>

    </section>
  );
}