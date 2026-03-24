"use client"

import Link from "next/link"
import { useState } from "react"

const brands = [
  { name: "Rolls-Royce", slug: "rolls-royce" },
  { name: "Bentley", slug: "bentley" },
  { name: "Aston Martin", slug: "aston-martin" },
  { name: "Lamborghini", slug: "lamborghini" },
  { name: "Ferrari", slug: "ferrari" },
  { name: "McLaren", slug: "mclaren" },
  { name: "Porsche", slug: "porsche" },
  { name: "Mercedes", slug: "mercedes" },
  { name: "BMW", slug: "bmw" },
  { name: "Range Rover", slug: "range-rover" },
  { name: "Cadillac", slug: "cadillac" },
  { name: "Corvette", slug: "corvette" },
  { name: "Tesla", slug: "tesla" },
  { name: "Audi", slug: "audi" },
  { name: "Rivian", slug: "rivian" },
  { name: "Hummer", slug: "hummer" },
]

const categories = [
  { name: "Supercar", slug: "supercar" },
  { name: "Convertible", slug: "convertible" },
  { name: "SUV", slug: "suv" },
  { name: "Chauffeur", slug: "chauffeur" },
  { name: "EV", slug: "ev" },
  { name: "Coupe/Sports", slug: "coupe-sports" },
  { name: "Sedan", slug: "sedan" },
  { name: "Ultra-Luxury", slug: "ultra-luxury" },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [makesOpen, setMakesOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {/* Diamond icon */}
            <svg className="w-7 h-7 text-[#dbb241]" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 2L2 12l14 18L30 12z" opacity="0.2"/>
              <path d="M16 2L2 12h28L16 2z"/>
              <path d="M2 12l14 18L30 12H2z" opacity="0.7"/>
            </svg>
            <span className="text-white font-semibold text-base tracking-wide">Falcon</span>
          </Link>

          {/* Desktop Nav — centered */}
          <nav className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {/* Cars dropdown */}
            <div className="relative group">
              <button className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Cars
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl" style={{ minWidth: 480 }}>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-1">Browse by Make</p>
                  <div className="grid grid-cols-4 gap-1 mb-4">
                    {brands.map((b) => (
                      <Link key={b.slug} href={`/cars?brand=${b.slug}`} className="text-sm text-gray-300 hover:text-[#dbb241] py-1 px-2 rounded hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
                        {b.name}
                      </Link>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-1">Browse by Category</p>
                  <div className="grid grid-cols-4 gap-1">
                    {categories.map((c) => (
                      <Link key={c.slug} href={`/cars?category=${c.slug}`} className="text-sm text-gray-300 hover:text-[#dbb241] py-1 px-2 rounded hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Villas dropdown (placeholder) */}
            <div className="relative group">
              <button className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Villas
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 shadow-2xl w-40">
                  <Link href="/contact" className="block text-sm text-gray-300 hover:text-[#dbb241] py-1.5 px-2 rounded hover:bg-[#1a1a1a] transition-colors">Enquire Now</Link>
                </div>
              </div>
            </div>

            {/* Events dropdown (placeholder) */}
            <div className="relative group">
              <button className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Events
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 shadow-2xl w-40">
                  <Link href="/contact" className="block text-sm text-gray-300 hover:text-[#dbb241] py-1.5 px-2 rounded hover:bg-[#1a1a1a] transition-colors">Enquire Now</Link>
                </div>
              </div>
            </div>

            <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* Right side CTAs */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
              Become a Partner
            </Link>
            <Link
              href="/cars"
              className="border border-white text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition-colors"
            >
              Reserve Now
            </Link>
            {/* User icon */}
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors" aria-label="Account">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d0d0d] border-t border-[#2a2a2a] max-h-[80vh] overflow-y-auto">
          <div className="px-5 py-4 space-y-1">
            <Link href="/" className="block py-2.5 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/cars" className="block py-2.5 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>All Cars</Link>

            <button onClick={() => setMakesOpen(!makesOpen)} className="w-full text-left py-2.5 text-gray-300 hover:text-white flex justify-between">
              Browse by Make
              <svg className={`w-4 h-4 transition-transform ${makesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {makesOpen && (
              <div className="pl-4 grid grid-cols-2 gap-1 pb-2">
                {brands.map((b) => (
                  <Link key={b.slug} href={`/cars?brand=${b.slug}`} className="text-sm text-gray-400 hover:text-[#dbb241] py-1" onClick={() => setMobileOpen(false)}>{b.name}</Link>
                ))}
              </div>
            )}

            <button onClick={() => setCatsOpen(!catsOpen)} className="w-full text-left py-2.5 text-gray-300 hover:text-white flex justify-between">
              Categories
              <svg className={`w-4 h-4 transition-transform ${catsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {catsOpen && (
              <div className="pl-4 space-y-1 pb-2">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/cars?category=${c.slug}`} className="block text-sm text-gray-400 hover:text-[#dbb241] py-1" onClick={() => setMobileOpen(false)}>{c.name}</Link>
                ))}
              </div>
            )}

            <Link href="/about" className="block py-2.5 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/contact" className="block py-2.5 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Contact</Link>

            <hr className="border-[#2a2a2a] my-3" />
            <Link href="/contact" className="block py-2.5 text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Become a Partner</Link>
            <Link href="/login" className="block py-2 text-gray-400 hover:text-white" onClick={() => setMobileOpen(false)}>Login / Register</Link>
            <Link href="/cars" className="block border border-white text-white text-center py-2.5 rounded-md font-medium mt-2 hover:bg-white hover:text-black transition-colors" onClick={() => setMobileOpen(false)}>Reserve Now</Link>
          </div>
        </div>
      )}
    </header>
  )
}
