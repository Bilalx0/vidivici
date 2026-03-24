import { Suspense } from "react"
import CarCard from "@/components/cars/CarCard"
import CarFilters from "@/components/cars/CarFilters"

const sampleCars = [
  { name: "Lamborghini Huracán EVO", slug: "lamborghini-huracan-evo", brand: "Lamborghini", category: "Supercar", pricePerDay: 1500, year: 2024, transmission: "Automatic", seats: 2, shortDescription: "V10 supercar perfection" },
  { name: "Ferrari 488 Spider", slug: "ferrari-488-spider", brand: "Ferrari", category: "Supercar", pricePerDay: 1800, year: 2024, transmission: "Automatic", seats: 2, shortDescription: "Twin-turbo V8 convertible" },
  { name: "Rolls-Royce Cullinan", slug: "rolls-royce-cullinan", brand: "Rolls-Royce", category: "Ultra-Luxury", pricePerDay: 2500, year: 2024, transmission: "Automatic", seats: 5, shortDescription: "The ultimate luxury SUV" },
  { name: "Porsche 911 Turbo S", slug: "porsche-911-turbo-s", brand: "Porsche", category: "Coupe/Sports", pricePerDay: 1200, year: 2024, transmission: "Automatic", seats: 4, shortDescription: "Iconic German performance" },
  { name: "Mercedes-AMG G63", slug: "mercedes-amg-g63", brand: "Mercedes", category: "SUV", pricePerDay: 1100, year: 2024, transmission: "Automatic", seats: 5, shortDescription: "Iconic luxury SUV" },
  { name: "Bentley Continental GT", slug: "bentley-continental-gt", brand: "Bentley", category: "Ultra-Luxury", pricePerDay: 1400, year: 2024, transmission: "Automatic", seats: 4, shortDescription: "Handcrafted grand tourer" },
]

export default function CarsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a] text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-[#dbb241]">Fleet</span></h1>
        <p className="text-gray-400">Browse our collection of exotic and luxury vehicles</p>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <Suspense fallback={<div className="h-96 bg-[#1a1a1a] rounded-xl animate-pulse" />}>
              <CarFilters />
            </Suspense>
          </aside>

          {/* Cars Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-400">{sampleCars.length} vehicles available</p>
              <select className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sampleCars.map((car) => (
                <CarCard key={car.slug} {...car} />
              ))}
            </div>

            {/* Pagination placeholder */}
            <div className="flex justify-center gap-2 mt-10">
              <button className="bg-[#dbb241] text-black w-10 h-10 rounded font-semibold text-sm">1</button>
              <button className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 w-10 h-10 rounded text-sm hover:border-[#dbb241]">2</button>
              <button className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 w-10 h-10 rounded text-sm hover:border-[#dbb241]">3</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
