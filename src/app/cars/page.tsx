"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CarCard from "@/components/cars/CarCard"
import CarFilters from "@/components/cars/CarFilters"
import Banner from "@/components/ui/Banner"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import FAQ from "@/components/home/FAQ"
import Reviews from "@/components/home/Reviews"
import Contact from "@/components/home/Contact"
import { SlidersHorizontal, X } from "lucide-react"

interface CarFromAPI {
  id: string
  name: string
  slug: string
  pricePerDay: number
  originalPrice?: number | null
  year: number | null
  seats: number
  transmission: string
  shortDescription: string | null
  horsepower: number | null
  acceleration: string | null
  brand: { name: string; slug: string }
  category: { name: string; slug: string }
  images: { url: string; isPrimary: boolean }[]
}

export function CarsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cars, setCars] = useState<CarFromAPI[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const currentPage = parseInt(searchParams.get("page") || "1")
  const sort = searchParams.get("sort") || "newest"
  const make = searchParams.get("make") || ""
  const category = searchParams.get("category") || ""

  // Dynamic heading based on make or category
  const heading = make
    ? `${make} Car Rentals`
    : category
      ? `${category} Car Rentals`
      : "Exotic Car Rentals"

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const brand = searchParams.get("brand")
      const make = searchParams.get("make")
      const category = searchParams.get("category")
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      const search = searchParams.get("search")

      if (brand) params.set("brand", brand)
      else if (make) params.set("make", make)
      if (category) params.set("category", category)
      if (minPrice) params.set("minPrice", minPrice)
      if (maxPrice) params.set("maxPrice", maxPrice)
      if (search) params.set("search", search)
      params.set("page", String(currentPage))
      params.set("limit", "12")

      const res = await fetch(`/api/cars?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        let sorted = data.cars || []

        if (sort === "price-asc") sorted.sort((a: CarFromAPI, b: CarFromAPI) => a.pricePerDay - b.pricePerDay)
        else if (sort === "price-desc") sorted.sort((a: CarFromAPI, b: CarFromAPI) => b.pricePerDay - a.pricePerDay)

        setCars(sorted)
        setTotal(data.total || 0)
        setPages(data.pages || 1)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [searchParams, currentPage, sort])

  useEffect(() => { fetchCars() }, [fetchCars])

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", newSort)
    params.set("page", "1")
    router.push(`/cars?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`/cars?${params.toString()}`)
  }

  // REPLACE the entire CarsContent function return statement with this:

return (
  <div>
    <Banner
      heading={heading}
      description="Browse our collection of exotic and luxury vehicles available for rent"
      height="h-96 2xl:h-[520px]"
      searchBar={{
        placeholder: "Search cars by name, brand...",
        onSearch: (value: string) => {
          const params = new URLSearchParams(searchParams.toString())
          if (value.trim()) params.set("search", value.trim())
          else params.delete("search")
          params.set("page", "1")
          router.push(`/cars?${params.toString()}`)
        },
      }}
    />

    {/* Cars Content */}
    <section className="bg-white py-16 2xl:py-32 px-6 sm:px-16 lg:px-20 2xl:px-32">
      <div className="max-w-[1840px] mx-auto">
        <h2 className="text-4xl 2xl:text-7xl font-bold text-mist-900 text-center my-20 2xl:my-32">
          {heading}
        </h2>

        {/* Filter toggle + Sort - MOVED HERE to match villas layout */}
        <div className="flex justify-between items-center mb-6 2xl:mb-10 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 2xl:px-6 py-2 2xl:py-3 border border-mist-200 rounded-xl 2xl:rounded-2xl text-sm 2xl:text-lg text-mist-600 hover:bg-mist-50 transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal size={14} />
            {showFilters ? "Hide Filter" : "Show Filter"}
          </button>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-neutral-100 border border-mist-200 text-mist-600 text-sm 2xl:text-lg px-3 2xl:px-5 py-2 2xl:py-3 rounded-lg 2xl:rounded-xl focus:border-mist-400 focus:outline-none"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
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
              <Suspense fallback={<div className="h-96 bg-mist-100 rounded-xl animate-pulse" />}>
                <CarFilters hideBrand={!!make} hideCategory={!!category} />
              </Suspense>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 2xl:gap-12">
          {/* Sidebar - FIXED: removed lg:block, added onHide prop */}
          <aside className={`hidden lg:block lg:w-72 2xl:w-96 shrink-0 ${showFilters ? "lg:block" : "lg:hidden"}`}>
            <Suspense fallback={<div className="h-96 bg-mist-100 rounded-xl animate-pulse" />}>
              <CarFilters onHide={() => setShowFilters(false)} hideBrand={!!make} hideCategory={!!category} />
            </Suspense>
          </aside>

          {/* Cars Grid - FIXED: dynamic columns based on filter visibility */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-6 2xl:gap-10 ${showFilters ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-mist-100 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-mist-400 text-lg mb-2">No cars found</p>
                <p className="text-mist-300 text-sm">Try adjusting your filters or search</p>
              </div>
            ) : (
              <div className={`grid gap-6 2xl:gap-10 ${showFilters ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
                {cars.map((car) => (
                  <CarCard
                    key={car.id}
                    id={car.id}
                    name={car.name}
                    slug={car.slug}
                    brand={car.brand.name}
                    category={car.category.name}
                    pricePerDay={car.pricePerDay}
                    originalPrice={car.originalPrice}
                    year={car.year ?? undefined}
                    transmission={car.transmission}
                    seats={car.seats}
                    image={car.images?.[0]?.url}
                    shortDescription={car.shortDescription ?? undefined}
                    horsepower={car.horsepower ?? undefined}
                    acceleration={car.acceleration ?? undefined}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 2xl:gap-4 mt-10 2xl:mt-16">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 2xl:w-12 h-10 2xl:h-12 rounded-lg 2xl:rounded-xl font-semibold text-sm 2xl:text-lg transition-colors ${
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
      </div>
    </section>

    {/* Extra Sections */}
    <WhyChooseUs />
    <Reviews />
    <FAQ />
    <Contact />
  </div>
)

}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CarsContent />
    </Suspense>
  )
}