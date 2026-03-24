import Link from "next/link"
import { ImageOff } from "lucide-react"

const featuredCars = [
  { name: "Lamborghini Hurac\u00e1n EVO", brand: "Lamborghini", price: 1500, slug: "lamborghini-huracan-evo", year: 2024, transmission: "Automatic", seats: 2 },
  { name: "Ferrari 488 Spider", brand: "Ferrari", price: 1800, slug: "ferrari-488-spider", year: 2024, transmission: "Automatic", seats: 2 },
  { name: "Rolls-Royce Cullinan", brand: "Rolls-Royce", price: 2500, slug: "rolls-royce-cullinan", year: 2024, transmission: "Automatic", seats: 5 },
  { name: "Porsche 911 Turbo S", brand: "Porsche", price: 1200, slug: "porsche-911-turbo-s", year: 2024, transmission: "Automatic", seats: 4 },
]

export default function FeaturedCars() {
  return (
    <section className="py-20 px-4 bg-[#111]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-[#dbb241]">Vehicles</span></h2>
          <div className="w-16 h-1 bg-[#dbb241] mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCars.map((car) => (
            <Link
              key={car.slug}
              href={`/cars/${car.slug}`}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#dbb241]/50 transition-all group hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
                <ImageOff size={32} className="text-gray-700" />
              </div>
              <div className="p-5">
                <p className="text-xs text-[#dbb241] font-medium mb-1">{car.brand}</p>
                <h3 className="text-base font-semibold text-white group-hover:text-[#dbb241] transition-colors mb-2">{car.name}</h3>
                <div className="flex gap-2 mb-3">
                  <span className="text-[10px] bg-[#2a2a2a] text-gray-400 px-2 py-0.5 rounded">{car.year}</span>
                  <span className="text-[10px] bg-[#2a2a2a] text-gray-400 px-2 py-0.5 rounded">{car.transmission}</span>
                  <span className="text-[10px] bg-[#2a2a2a] text-gray-400 px-2 py-0.5 rounded">{car.seats} seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-[#dbb241]">${car.price}<span className="text-xs text-gray-500 font-normal"> /day</span></p>
                  <span className="text-xs text-[#dbb241] border border-[#dbb241] px-3 py-1 rounded group-hover:bg-[#dbb241] group-hover:text-black transition-colors">
                    Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/cars" className="bg-[#dbb241] text-black px-8 py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors inline-block">
            View All Vehicles
          </Link>
        </div>
      </div>
    </section>
  )
}
