"use client"

import { useState, useEffect } from "react"
import CarCard from "@/components/cars/CarCard"

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

interface ExoticCarRentalsProps {
  title?: string
  description?: string
  limit?: number
  category?: string
}

export default function ExoticCarRentals({
  title = "Exotic Car Rentals",
  description = "Explore our curated collection of exotic and luxury cars available for short and long-term hire in Los Angeles.",
  limit = 6,
  category,
}: ExoticCarRentalsProps) {
  const [cars, setCars] = useState<CarFromAPI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    params.set("limit", String(limit))
    if (category) params.set("category", category)

    fetch(`/api/cars?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setCars(data.cars || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [limit, category])

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-mist-900 text-center mb-2">{title}</h2>
        <p className="text-mist-500 text-center mb-10 max-w-2xl mx-auto">{description}</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <p className="text-center text-mist-400 py-12">No vehicles available at this time.</p>
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

        <div className="text-center mt-8">
          <a
            href="/cars"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
          >
            View All Cars
          </a>
        </div>
      </div>
    </section>
  )
}
