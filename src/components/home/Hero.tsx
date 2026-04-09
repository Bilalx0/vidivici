"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface SearchResult {
  id: string
  name: string
  slug: string
  type: "car" | "villa" | "event"
  subtitle: string
  imageUrl?: string
}

export default function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const [carsRes, villasRes, eventsRes] = await Promise.all([
        fetch(`/api/cars?search=${encodeURIComponent(q)}&limit=4`),
        fetch(`/api/villas?search=${encodeURIComponent(q)}&limit=4`),
        fetch(`/api/events?search=${encodeURIComponent(q)}&limit=4`),
      ])
      const [carsData, villasData, eventsData] = await Promise.all([
        carsRes.ok ? carsRes.json() : { cars: [] },
        villasRes.ok ? villasRes.json() : { villas: [] },
        eventsRes.ok ? eventsRes.json() : { events: [] },
      ])
      const combined: SearchResult[] = [
        ...(carsData.cars || []).map((c: any) => ({
          id: c.id, name: c.name, slug: c.slug, type: "car" as const,
          subtitle: `${c.brand?.name || ""} · $${c.pricePerDay}/day`,
          imageUrl: c.images?.[0]?.url,
        })),
        ...(villasData.villas || []).map((v: any) => ({
          id: v.id, name: v.name, slug: v.slug, type: "villa" as const,
          subtitle: `${v.location || ""} · $${v.pricePerNight}/night`,
          imageUrl: v.images?.[0]?.url,
        })),
        ...(eventsData.events || []).map((e: any) => ({
          id: e.id, name: e.name, slug: e.slug, type: "event" as const,
          subtitle: e.venueName || e.location || e.category || "",
          imageUrl: e.images?.[0]?.url,
        })),
      ]
      setResults(combined)
      setOpen(combined.length > 0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    router.push(`/cars?search=${encodeURIComponent(query.trim())}`)
  }

  const hrefFor = (r: SearchResult) =>
    r.type === "car" ? `/cars/${r.slug}` : r.type === "villa" ? `/villas/${r.slug}` : `/events/${r.slug}`

  const labelFor = (type: string) =>
    type === "car" ? "Car" : type === "villa" ? "Villa" : "Event"

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }

        .hero-title {
          animation: fadeUp 0.9s ease forwards;
          animation-delay: 0.1s;
          opacity: 0;
        }
        .hero-sub {
          animation: fadeUp 0.9s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        .hero-search {
          animation: fadeUp 0.9s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        .hero-chevron {
          animation: fadeIn 1s ease forwards, bounce-slow 2s ease-in-out 1.2s infinite;
          opacity: 0;
          animation-delay: 0.9s, 1.2s;
        }

        .search-input:focus { outline: none; }
      `}</style>

      <section
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/main.png')" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl 2xl:max-w-7xl 3xl:max-w-[1800px] mx-auto mt-20 2xl:mt-56 3xl:mt-40">

          <h1 className="hero-title text-white font-semibold mb-5 2xl:mb-12 3xl:mb-16 text-3xl sm:text-5xl 2xl:text-[5rem] leading-snug 2xl:leading-[1.1] 3xl:leading-[1.1]">
            Experience Luxury Like Never Before with Vidi Vici
          </h1>

          <p className="hero-sub text-mist-300 font-extralight leading-relaxed mb-10 2xl:mb-12 3xl:mb-28 text-base sm:text-xl 2xl:text-3xl 3xl:text-5xl px-0 sm:px-8 2xl:px-36 3xl:px-40">
            Exotic cars and luxury villas in Los Angeles, curated for those who
            demand the extraordinary.
          </p>

          {/* Search bar */}
          <div className="hero-search w-full max-w-lg 2xl:max-w-4xl 3xl:max-w-[1200px] relative" ref={wrapperRef}>
            <form onSubmit={handleSubmit}>
              <div
                className="flex items-center gap-3 2xl:gap-6 3xl:gap-8 px-5 py-3 2xl:px-10 2xl:py-5 3xl:px-14 3xl:py-7 rounded-2xl 2xl:rounded-3xl 3xl:rounded-[32px] border border-white/40 transition-all duration-300 focus-within:border-white/60"
                style={{
                  background: "rgba(255, 255, 255, 0.22)",
                  backdropFilter: "blur(100px) saturate(200%)",
                  WebkitBackdropFilter: "blur(60px) saturate(200%)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                <button type="submit" className="shrink-0 text-white/70 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="2xl:w-8 2xl:h-8 3xl:w-14 3xl:h-14">
                    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => results.length > 0 && setOpen(true)}
                  placeholder="Search cars, villas, or events..."
                  className="flex-1 bg-transparent placeholder:text-white/60 text-white tracking-wide outline-none border-none text-sm sm:text-base 2xl:text-2xl 3xl:text-3xl search-input"
                />
                {loading && (
                  <svg className="animate-spin shrink-0 text-white/60 w-4 h-4 2xl:w-7 2xl:h-7 3xl:w-10 3xl:h-10" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" />
                  </svg>
                )}
              </div>
            </form>

            {/* Dropdown */}
            {open && results.length > 0 && (
              <div
                className="absolute mt-2 w-full max-w-lg 2xl:max-w-4xl 3xl:max-w-[1200px] rounded-2xl 3xl:rounded-3xl overflow-hidden z-50"
                style={{
                  background: "rgba(10, 10, 15, 0.92)",
                  backdropFilter: "blur(40px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {results.map((r, i) => (
                  <Link
                    key={r.id}
                    href={hrefFor(r)}
                    onClick={() => { setOpen(false); setQuery("") }}
                    className="flex items-center gap-3 2xl:gap-4 3xl:gap-6 px-4 py-3 2xl:px-6 2xl:py-4 3xl:px-8 3xl:py-5 hover:bg-white/10 transition-colors group"
                  >
                    {r.imageUrl ? (
                      <div className="relative w-10 h-10 2xl:w-12 2xl:h-12 3xl:w-16 3xl:h-16 rounded-lg overflow-hidden shrink-0">
                        <Image src={r.imageUrl} alt={r.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/10 shrink-0" />
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white text-sm 2xl:text-base 3xl:text-xl font-medium truncate">{r.name}</p>
                      <p className="text-white/50 text-xs 2xl:text-sm 3xl:text-base truncate">{r.subtitle}</p>
                    </div>
                    <span className="text-xs 2xl:text-sm 3xl:text-base text-white/30 shrink-0 bg-white/10 2xl:bg-white/15 3xl:bg-white/20 px-2 py-0.5 2xl:px-3 2xl:py-1 3xl:px-4 3xl:py-1.5 rounded-full">
                      {labelFor(r.type)}
                    </span>
                  </Link>
                ))}
                <div className="border-t border-white/10 px-4 py-2 2xl:px-6 2xl:py-3 3xl:px-8 3xl:py-4">
                  <button
                    onClick={() => { setOpen(false); router.push(`/cars?search=${encodeURIComponent(query)}`) }}
                    className="text-xs 2xl:text-sm 3xl:text-base text-white/50 hover:text-white/80 transition-colors"
                  >
                    See all results for &ldquo;{query}&rdquo; →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}