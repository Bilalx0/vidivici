"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/cars?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080b10]">
      {/* Hero background image placeholder — replace src with your actual image */}
      {/* <img src="/images/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" /> */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />

      {/* Left car image placeholder */}
      <div className="absolute bottom-0 left-0 w-[38%] h-[60%] hidden lg:flex items-end justify-center overflow-hidden">
        {/* Replace the div below with: <img src="/images/hero-car-left.png" alt="Luxury Car" className="w-full h-full object-contain object-bottom" /> */}
        <div className="w-full h-full bg-[#111]/60 border border-dashed border-[#333] flex items-center justify-center">
          <span className="text-gray-600 text-xs tracking-widest uppercase">Car Image · Left</span>
        </div>
      </div>

      {/* Right car image placeholder */}
      <div className="absolute bottom-0 right-0 w-[38%] h-[60%] hidden lg:flex items-end justify-center overflow-hidden">
        {/* Replace the div below with: <img src="/images/hero-car-right.png" alt="Luxury Car" className="w-full h-full object-contain object-bottom" /> */}
        <div className="w-full h-full bg-[#111]/60 border border-dashed border-[#333] flex items-center justify-center">
          <span className="text-gray-600 text-xs tracking-widest uppercase">Car Image · Right</span>
        </div>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
          Experience Luxury Like<br />Never Before with{" "}
          <span className="text-[#dbb241]">Falcon</span>
        </h1>
        <p className="text-gray-300 text-base md:text-lg mb-10 leading-relaxed">
          Exotic cars and luxury villas in Los Angeles, curated for those who demand the extraordinary.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cars, villas, or events..."
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 pl-14 pr-6 py-4 rounded-full text-sm focus:outline-none focus:border-white/40 transition-colors"
          />
        </form>
      </div>
    </section>
  )
}
