"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Banner from "@/components/ui/Banner"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import FAQ from "@/components/home/FAQ"
import Reviews from "@/components/home/Reviews"
import Contact from "@/components/home/Contact"
import { SlidersHorizontal, BedDouble, Users, Maximize2, Heart, ArrowUpRight, ChevronRight, RotateCcw, X, ChevronDown } from "lucide-react"

interface VillaFromAPI {
  id: string
  name: string
  slug: string
  location: string
  bedrooms: number
  guests: number
  sqft: number
  pricePerNight: number
  images: { url: string; isPrimary: boolean }[]
}

const LOCATION_TAGS = ["Beverly Hills", "Malibu", "Hollywood Hills", "Los Angeles", "Miami"]
const SQFT_OPTIONS = [
  { label: "Any", value: "" },
  { label: "5,000+ sq.ft", value: "5000" },
  { label: "9,000+ sq.ft", value: "9000" },
  { label: "15,000+ sq.ft", value: "15000" },
]
const BEDROOM_OPTIONS = [
  { label: "Any", value: "" },
  { label: "3+", value: "3" },
  { label: "5+", value: "5" },
  { label: "7+", value: "7" },
  { label: "10+", value: "10" },
]
const GUEST_OPTIONS = [
  { label: "Any", value: "" },
  { label: "6+", value: "6" },
  { label: "10+", value: "10" },
  { label: "15+", value: "15" },
  { label: "20+", value: "20" },
]

function VillasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const [villas, setVillas] = useState<VillaFromAPI[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())

  const currentPage = parseInt(searchParams.get("page") || "1")
  const sort = searchParams.get("sort") || "newest"

  const fetchVillas = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const location = searchParams.get("location")
      const minBedrooms = searchParams.get("minBedrooms")
      const minGuests = searchParams.get("minGuests")
      const minSqft = searchParams.get("minSqft")
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      const search = searchParams.get("search")

      if (location) params.set("location", location)
      if (minBedrooms) params.set("minBedrooms", minBedrooms)
      if (minGuests) params.set("minGuests", minGuests)
      if (minSqft) params.set("minSqft", minSqft)
      if (minPrice) params.set("minPrice", minPrice)
      if (maxPrice) params.set("maxPrice", maxPrice)
      if (search) params.set("search", search)
      params.set("page", String(currentPage))
      params.set("limit", "12")

      const res = await fetch(`/api/villas?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        let sorted = data.villas || []
        if (sort === "price-asc") sorted.sort((a: VillaFromAPI, b: VillaFromAPI) => a.pricePerNight - b.pricePerNight)
        else if (sort === "price-desc") sorted.sort((a: VillaFromAPI, b: VillaFromAPI) => b.pricePerNight - a.pricePerNight)
        setVillas(sorted)
        setTotal(data.total || 0)
        setPages(data.pages || 1)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [searchParams, currentPage, sort])

  useEffect(() => { fetchVillas() }, [fetchVillas])

  // Fetch wishlist IDs
  useEffect(() => {
    if (!session?.user) return
    fetch("/api/wishlist?type=villa")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const ids = new Set<string>(data.map((item: any) => item.villaId).filter(Boolean))
        setWishlistIds(ids)
      })
      .catch(() => {})
  }, [session])

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", newSort)
    params.set("page", "1")
    router.push(`/villas?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`/villas?${params.toString()}`)
  }

  return (
    <div>
      <Banner
        heading="Discover Los Angeles' Most Exclusive Villas"
        description="Browse our collection of luxury villas available for rent"
        height="h-96 2xl:h-[520px]"
        image="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=80"
        searchBar={{
          placeholder: "Search villas by name, location...",
          onSearch: (value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value.trim()) params.set("search", value.trim())
            else params.delete("search")
            params.set("page", "1")
            router.push(`/villas?${params.toString()}`)
          },
        }}
      />

      <section className="bg-white py-16 2xl:py-32 px-6 sm:px-16 lg:px-20 2xl:px-32">
        <div className="max-w-[1840px] mx-auto">
          <h2 className="text-4xl 2xl:text-7xl font-bold text-mist-900 text-center my-20 2xl:my-32">
           Luxury Villa Rentals
          </h2>

          <div className="flex justify-between items-center mb-6 2xl:mb-10 gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 2xl:px-6 py-2 2xl:py-3 border border-mist-200 rounded-xl 2xl:rounded-2xl text-sm 2xl:text-lg text-mist-600 hover:bg-mist-50 transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal size={14} />
              {showFilters ? "Hide Filter" : "Show Filter"}
            </button>
            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-neutral-100 border border-mist-200 text-mist-600 text-sm 2xl:text-lg px-3 2xl:px-5 py-2 2xl:py-3 pr-9 2xl:pr-12 rounded-lg 2xl:rounded-xl focus:border-mist-400 focus:outline-none"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mist-500 2xl:right-4" />
            </div>
          </div>

          {showFilters && (
            <div
              className="fixed inset-0 z-120 bg-black/50 lg:hidden"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="h-full w-full max-w-sm bg-white p-5 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between border-b border-mist-200 pb-3">
                  <h3 className="text-base font-semibold text-mist-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="rounded-md p-1 text-mist-500 hover:bg-mist-100 hover:text-mist-900"
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>
                <VillaFilters onHide={() => setShowFilters(false)} />
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 2xl:gap-12">
            {/* Sidebar Filters - Fixed: proper conditional visibility */}
            <aside className={`hidden lg:block lg:w-72 2xl:w-96 shrink-0 ${showFilters ? "lg:block" : "lg:hidden"}`}>
              <VillaFilters onHide={() => setShowFilters(false)} />
            </aside>

            {/* Villas Grid - Dynamic columns based on filter visibility */}
            <div className="flex-1">
              {loading ? (
                <div className={`grid gap-6 2xl:gap-10 ${showFilters ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-mist-100 rounded-2xl h-80 animate-pulse" />
                  ))}
                </div>
              ) : villas.length === 0 ? (
                <div className="text-center py-20 2xl:py-28">
                  <p className="text-mist-400 text-lg 2xl:text-3xl mb-2">No villas found</p>
                  <p className="text-mist-300 text-sm 2xl:text-xl">Try adjusting your filters or search</p>
                </div>
              ) : (
                <div className={`grid gap-6 2xl:gap-10 ${showFilters ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
                  {villas.map((villa) => (
                    <VillaListCard key={villa.id} villa={villa} wishlisted={wishlistIds.has(villa.id)} />
                  ))}
                </div>
              )}

              {pages > 1 && (
                <div className="flex justify-center gap-2 2xl:gap-4 mt-10 2xl:mt-16">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-10 2xl:w-12 h-10 2xl:h-12 rounded-lg 2xl:rounded-xl font-semibold text-sm 2xl:text-lg transition-colors ${p === currentPage
                        ? "bg-mist-900 text-white"
                        : "bg-mist-100 text-mist-500 hover:bg-mist-200"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 2xl:py-32 px-6 sm:px-16 lg:px-20 2xl:px-32 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 2xl:gap-20 items-center max-w-[1840px] mx-auto">

          {/* Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-8">
              Beyond the Villa:<br />Concierge Services
            </h2>
            <p className="text-base 2xl:text-2xl text-mist-500 leading-relaxed mb-7 2xl:mb-10">
              Vidi Vici doesn't just rent homes—we create experiences.<br />
              Our concierge services include:
            </p>
            <ul className="space-y-4 2xl:space-y-6">
              {[
                "Chauffeur-driven cars or luxury SUV rentals",
                "Daily housekeeping and maid service",
                "Private chef and in-villa catering",
                "Event planning for corporate or influencer gatherings",
                "Filming and photo shoot locations approved by Hollywood studios",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 2xl:gap-5">
                  <span className="mt-0.5 flex-shrink-0 w-5 2xl:w-7 h-5 2xl:h-7 rounded-full bg-mist-800 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="2xl:w-4 2xl:h-4">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-base 2xl:text-xl text-mist-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — 2x2 mosaic */}
          <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3 2xl:gap-5 w-full">
            {/* Top left — spans 2 cols */}
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
              alt="Living room"
              className="col-span-2 row-span-1 w-full h-52 2xl:h-80 object-cover rounded-2xl 2xl:rounded-[30px]"
            />
            {/* Top right */}
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
              alt="Dining area"
              className="col-span-1 row-span-1 w-full h-52 2xl:h-80 object-cover rounded-2xl 2xl:rounded-[30px]"
            />
            {/* Bottom left — small */}
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
              alt="Staircase"
              className="col-span-1 row-span-1 w-full h-52 2xl:h-80 object-cover rounded-2xl 2xl:rounded-[30px]"
            />
            {/* Bottom right — spans 2 cols */}
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80"
              alt="Interior"
              className="col-span-2 row-span-1 w-full h-52 2xl:h-80 object-cover rounded-2xl 2xl:rounded-[30px]"
            />
          </div>

        </div>
      </section>
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
}

function VillaFilters({ onHide }: { onHide?: () => void }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "")
  const [minBedrooms, setMinBedrooms] = useState(searchParams.get("minBedrooms") || "")
  const [minGuests, setMinGuests] = useState(searchParams.get("minGuests") || "")
  const [minSqft, setMinSqft] = useState(searchParams.get("minSqft") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedLocation) params.set("location", selectedLocation)
    if (minBedrooms) params.set("minBedrooms", minBedrooms)
    if (minGuests) params.set("minGuests", minGuests)
    if (minSqft) params.set("minSqft", minSqft)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    params.set("page", "1")
    router.push(`/villas?${params.toString()}`)
  }

  const clearAll = () => {
    setSelectedLocation("")
    setMinBedrooms("")
    setMinGuests("")
    setMinSqft("")
    setMinPrice("")
    setMaxPrice("")
    router.push("/villas")
  }

  return (
    <div className="bg-white p-2 sm:p-0 2xl:p-4 space-y-6 2xl:space-y-8 w-full">

      {/* Location — fix: use value= not defaultValue= */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Location</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none"
        >
          <option value="">Search location</option>
          {LOCATION_TAGS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        {selectedLocation && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {selectedLocation}
              <button onClick={() => setSelectedLocation("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Bedrooms */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Bedrooms</label>
        <select
          value={minBedrooms}
          onChange={(e) => setMinBedrooms(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none"
        >
          {BEDROOM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {minBedrooms && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {BEDROOM_OPTIONS.find(o => o.value === minBedrooms)?.label}
              <button onClick={() => setMinBedrooms("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Square Footage — fix: use value= not defaultValue= */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Square</label>
        <select
          value={minSqft}
          onChange={(e) => setMinSqft(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none"
        >
          <option value="">Select square footage</option>
          {SQFT_OPTIONS.filter(o => o.value !== "").map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {minSqft && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {SQFT_OPTIONS.find(o => o.value === minSqft)?.label}
              <button onClick={() => setMinSqft("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Guests */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Guests</label>
        <select
          value={minGuests}
          onChange={(e) => setMinGuests(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none"
        >
          {GUEST_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {minGuests && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {GUEST_OPTIONS.find(o => o.value === minGuests)?.label}
              <button onClick={() => setMinGuests("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Price Range</label>
        <input
          type="range"
          min={0}
          max={10000}
          value={maxPrice || 0}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full accent-neutral-500 h-1"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[10px] 2xl:text-sm text-mist-400 mb-1">Minimum</p>
            <div className="flex items-center bg-neutral-100 border border-mist-200 rounded-md 2xl:rounded-xl px-3 py-2 2xl:px-5 2xl:py-3 gap-1">
              <span className="text-xs 2xl:text-base text-mist-400">$</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-sm 2xl:text-lg text-mist-700 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>
          <span className="text-mist-300 mt-4">–</span>
          <div className="flex-1">
            <p className="text-[10px] 2xl:text-sm text-mist-400 mb-1">Maximum</p>
            <div className="flex items-center bg-neutral-100 border border-mist-200 rounded-md 2xl:rounded-xl px-3 py-2 2xl:px-5 2xl:py-3 gap-1">
              <span className="text-xs 2xl:text-base text-mist-400">$</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-sm 2xl:text-lg text-mist-700 focus:outline-none"
                placeholder="10000"
              />
            </div>
          </div>
          <button
            onClick={applyFilters}
            className="mt-4 w-9 h-9 2xl:w-12 2xl:h-12 flex-shrink-0 bg-mist-200 hover:bg-mist-200 rounded-md 2xl:rounded-xl flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} className="text-mist-600" />
          </button>
        </div>
      </div>

      {/* Apply + Reset */}
      <div className="space-y-2 pt-2">
        <button
          onClick={applyFilters}
          className="w-full bg-mist-900 text-white py-3 2xl:py-5 rounded-lg 2xl:rounded-xl text-sm 2xl:text-lg hover:bg-mist-800 transition-colors"
        >
          Apply
        </button>
        <button
          onClick={clearAll}
          className="w-full bg-white border border-mist-200 text-mist-700 py-3 2xl:py-5 rounded-lg 2xl:rounded-xl text-sm 2xl:text-lg hover:bg-mist-50 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

    </div>
  )
}

function VillaListCard({ villa, wishlisted: initialWishlisted }: { villa: VillaFromAPI; wishlisted?: boolean }) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted || false)
  const [toggling, setToggling] = useState(false)
  const image = villa.images?.[0]?.url

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!villa.id || toggling) return
    setToggling(true)
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ villaId: villa.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setWishlisted(data.wishlisted)
      } else if (res.status === 401) {
        window.location.href = "/login"
      }
    } catch {} finally {
      setToggling(false)
    }
  }

  const formatSqft = (sqft: number) => {
    return sqft >= 1000 ? `${(sqft / 1000).toFixed(1)}k` : sqft.toString()
  }

  return (
    <div className="relative flex flex-col bg-white rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-xl border border-mist-200 hover:shadow-md transition-all duration-300 group cursor-pointer">

      {/* Image */}
      <div className="relative h-56 2xl:h-[350px] overflow-hidden p-3 2xl:m-5">
        <Link href={`/villas/${villa.slug}`} className="block w-full h-full">
          {image ? (
            <img src={image} alt={villa.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-[30px]" />
          ) : (
            <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm rounded-2xl">No Image</div>
          )}
        </Link>
        <button
          onClick={toggleWishlist}
          disabled={toggling}
          className={`absolute top-5 right-5 w-8 h-8 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            wishlisted
              ? "bg-mist-700 text-red-500"
              : "bg-mist-700 text-mist-100 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} className="2xl:w-4 2xl:h-4" fill={wishlisted ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 2xl:gap-5 px-6 2xl:px-10 pt-3.5 2xl:pt-6 pb-4 2xl:pb-8">
        <p className="text-xs 2xl:text-base text-mist-400 font-medium tracking-wide uppercase truncate">
          Luxury Villa for Rent | {villa.location}
        </p>
        <h3 className="text-lg sm:text-xl 2xl:text-3xl font-semibold text-mist-900 leading-snug -mt-0.5">{villa.name}</h3>

        <div className="flex items-center justify-between py-3 2xl:py-4">
          <div className="flex flex-col items-center gap-0.5 2xl:gap-2">
            <div className="text-mist-600 2xl:scale-150"><BedDouble size={12} /></div>
            <span className="text-xs 2xl:text-base text-mist-900 font-semibold">Bedrooms</span>
            <span className="text-[10px] 2xl:text-sm text-mist-600">{villa.bedrooms}</span>
          </div>
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <div className="flex flex-col items-center gap-0.5 2xl:gap-2">
            <div className="text-mist-600 2xl:scale-150"><Users size={12} /></div>
            <span className="text-xs 2xl:text-base text-mist-900 font-semibold">Guests</span>
            <span className="text-[10px] 2xl:text-sm text-mist-600">{villa.guests}</span>
          </div>
          <div className="w-px h-8 2xl:h-14 bg-mist-100" />
          <div className="flex flex-col items-center gap-0.5 2xl:gap-2">
            <div className="text-mist-600 2xl:scale-150"><Maximize2 size={12} /></div>
            <span className="text-xs 2xl:text-base text-mist-900 font-semibold">Sq.ft</span>
            <span className="text-[10px] 2xl:text-sm text-mist-600">{formatSqft(villa.sqft)}</span>
          </div>
        </div>

        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-0" />

        <div className="flex items-center justify-between mt-0.5 2xl:mt-0">
          <Link href={`/villas/${villa.slug}`} className="flex items-center gap-1 2xl:gap-3 text-sm 2xl:text-xl text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-base 2xl:text-2xl font-semibold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
            <span className="text-[10px] 2xl:text-base text-mist-400">/night</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default function VillasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <VillasContent />
    </Suspense>
  )
}
