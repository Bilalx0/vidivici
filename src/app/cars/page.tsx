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
import { SlidersHorizontal } from "lucide-react"

interface CarFromAPI {
  id: string
  name: string
  slug: string
  pricePerDay: number
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

function CarsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cars, setCars] = useState<CarFromAPI[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const currentPage = parseInt(searchParams.get("page") || "1")
  const sort = searchParams.get("sort") || "newest"

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const brand = searchParams.get("brand")
      const category = searchParams.get("category")
      const minPrice = searchParams.get("minPrice")
      const maxPrice = searchParams.get("maxPrice")
      const search = searchParams.get("search")

      if (brand) params.set("brand", brand)
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

  return (
    <div>
      <Banner
        heading="Exotic Car Rentals"
        description="Browse our collection of exotic and luxury vehicles available for rent"
        height="h-72"
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
      <section className="bg-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-mist-700 w-fit"
          >
            <SlidersHorizontal size={16} /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Sidebar */}
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Suspense fallback={<div className="h-96 bg-gray-100 rounded-xl animate-pulse" />}>
              <CarFilters />
            </Suspense>
          </aside>

          {/* Cars Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-mist-500">{total} vehicles available</p>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-gray-200 text-mist-700 text-sm px-3 py-2 rounded-lg focus:border-gray-400 focus:outline-none"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-mist-400 text-lg mb-2">No cars found</p>
                <p className="text-mist-300 text-sm">Try adjusting your filters or search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard
                    key={car.id}
                    id={car.id}
                    name={car.name}
                    slug={car.slug}
                    brand={car.brand.name}
                    category={car.category.name}
                    pricePerDay={car.pricePerDay}
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
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                      p === currentPage
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-mist-500 hover:bg-gray-200"
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
