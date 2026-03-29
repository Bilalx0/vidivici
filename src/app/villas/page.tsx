"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Banner from "@/components/ui/Banner"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import FAQ from "@/components/home/FAQ"
import Reviews from "@/components/home/Reviews"
import Contact from "@/components/home/Contact"
import { SlidersHorizontal, BedDouble, Users, Maximize2, Heart, ArrowUpRight } from "lucide-react"

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

  const [villas, setVillas] = useState<VillaFromAPI[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

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
        height="h-96"
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

      <section className="bg-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-mist-200 rounded-xl text-sm font-medium text-mist-700 w-fit"
          >
            <SlidersHorizontal size={16} /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Sidebar Filters */}
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <VillaFilters />
          </aside>

          {/* Villas Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-mist-500">{total} villas available</p>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-mist-200 text-mist-700 text-sm px-3 py-2 rounded-lg focus:border-mist-400 focus:outline-none"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-mist-100 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : villas.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-mist-400 text-lg mb-2">No villas found</p>
                <p className="text-mist-300 text-sm">Try adjusting your filters or search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {villas.map((villa) => (
                  <VillaListCard key={villa.id} villa={villa} />
                ))}
              </div>
            )}

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                      p === currentPage
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
      </section>

      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
}

function VillaFilters() {
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
    <div className="bg-white border border-mist-200 rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-mist-900">Filters</h3>
        <button onClick={clearAll} className="text-xs text-mist-400 hover:text-mist-700 transition-colors">Clear All</button>
      </div>

      {/* Location */}
      <div>
        <label className="text-xs font-medium text-mist-500 block mb-2">Location</label>
        <div className="flex flex-wrap gap-2">
          {LOCATION_TAGS.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(selectedLocation === loc ? "" : loc)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedLocation === loc
                  ? "bg-mist-900 text-white border-mist-900"
                  : "bg-white text-mist-600 border-mist-200 hover:border-mist-400"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="text-xs font-medium text-mist-500 block mb-2">Bedrooms</label>
        <select value={minBedrooms} onChange={(e) => setMinBedrooms(e.target.value)} className="w-full bg-mist-50 border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-mist-400 focus:outline-none">
          {BEDROOM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Square Footage */}
      <div>
        <label className="text-xs font-medium text-mist-500 block mb-2">Square Footage</label>
        <div className="flex flex-wrap gap-2">
          {SQFT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMinSqft(minSqft === opt.value ? "" : opt.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                minSqft === opt.value
                  ? "bg-mist-900 text-white border-mist-900"
                  : "bg-white text-mist-600 border-mist-200 hover:border-mist-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="text-xs font-medium text-mist-500 block mb-2">Guests</label>
        <select value={minGuests} onChange={(e) => setMinGuests(e.target.value)} className="w-full bg-mist-50 border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-mist-400 focus:outline-none">
          {GUEST_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-medium text-mist-500 block mb-2">Price Range (per night)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 bg-mist-50 border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-mist-400 focus:outline-none" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 bg-mist-50 border border-mist-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-mist-400 focus:outline-none" />
        </div>
      </div>

      <button onClick={applyFilters} className="w-full bg-mist-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors">
        Apply Filters
      </button>
    </div>
  )
}

function VillaListCard({ villa }: { villa: VillaFromAPI }) {
  const [fav, setFav] = useState(false)
  const image = villa.images?.[0]?.url

  const formatSqft = (sqft: number) => {
    return sqft >= 1000 ? `${(sqft / 1000).toFixed(1)}k` : sqft.toString()
  }

  return (
    <div className="relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
      <div className="relative h-56 overflow-hidden">
        {image ? (
          <img src={image} alt={villa.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-mist-100 flex items-center justify-center text-mist-400 text-sm">No Image</div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setFav((p) => !p) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            fav ? "bg-red-500 text-white" : "bg-white/75 text-mist-500 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart size={13} fill={fav ? "currentColor" : "none"} strokeWidth={2} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>

      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4">
        <p className="text-[10px] text-mist-400 font-medium tracking-wide uppercase truncate">
          Luxury Villa for Rent | {villa.location}
        </p>
        <h3 className="text-[15px] font-semibold text-mist-900 leading-snug -mt-0.5">{villa.name}</h3>

        <div className="flex items-center justify-between mt-0.5">
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-mist-400"><BedDouble size={12} /></div>
            <span className="text-[10px] text-mist-400">Bedrooms</span>
            <span className="text-[11px] font-semibold text-mist-700">{villa.bedrooms}</span>
          </div>
          <div className="w-px h-8 bg-mist-100" />
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-mist-400"><Users size={12} /></div>
            <span className="text-[10px] text-mist-400">Guests</span>
            <span className="text-[11px] font-semibold text-mist-700">{villa.guests}</span>
          </div>
          <div className="w-px h-8 bg-mist-100" />
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-mist-400"><Maximize2 size={12} /></div>
            <span className="text-[10px] text-mist-400">Sq.ft</span>
            <span className="text-[11px] font-semibold text-mist-700">{formatSqft(villa.sqft)}</span>
          </div>
        </div>

        <div className="h-px bg-mist-100 mt-0.5" />

        <div className="flex items-center justify-between mt-0.5">
          <Link href={`/villas/${villa.slug}`} className="flex items-center gap-1 text-[11px] font-semibold text-mist-500 hover:text-mist-900 transition-colors">
            View Details <ArrowUpRight size={11} strokeWidth={2.5} />
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-[15px] font-bold text-mist-900">${villa.pricePerNight.toLocaleString()}</span>
            <span className="text-[10px] text-mist-400">/night</span>
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
