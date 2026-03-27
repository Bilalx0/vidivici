"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const brandsList = [
  "Rolls-Royce", "Bentley", "Aston Martin", "Lamborghini", "Ferrari", "McLaren",
  "Porsche", "Mercedes", "BMW", "Range Rover", "Cadillac", "Corvette", "Tesla", "Audi", "Rivian", "Hummer",
]

const categoriesList = [
  "Supercar", "Convertible", "SUV", "Chauffeur", "EV", "Coupe/Sports", "Sedan", "Ultra-Luxury",
]

export default function CarFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "")
  const [location, setLocation] = useState(searchParams.get("location") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedBrand) params.set("brand", selectedBrand)
    if (selectedCategory) params.set("category", selectedCategory)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (transmission) params.set("transmission", transmission)
    if (location) params.set("location", location)
    router.push(`/cars?${params.toString()}`)
  }

  const clearAll = () => {
    setSelectedBrand("")
    setSelectedCategory("")
    setMinPrice("")
    setMaxPrice("")
    setTransmission("")
    setLocation("")
    router.push("/cars")
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#dbb241]">Filters</h3>
        <button onClick={clearAll} className="text-xs text-mist-500 hover:text-white transition-colors">Clear All</button>
      </div>

      {/* Location */}
      <div>
        <label className="text-xs text-mist-400 block mb-2">Location</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none">
          <option value="">All Locations</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Miami">Miami</option>
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="text-xs text-mist-400 block mb-2">Brand</label>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none">
          <option value="">All Brands</option>
          {brandsList.map((b) => (
            <option key={b} value={b.toLowerCase().replace(/[\s/]+/g, "-")}>{b}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs text-mist-400 block mb-2">Category</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none">
          <option value="">All Categories</option>
          {categoriesList.map((c) => (
            <option key={c} value={c.toLowerCase().replace(/[\s/]+/g, "-")}>{c}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs text-mist-400 block mb-2">Price Range (per day)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="text-xs text-mist-400 block mb-2">Transmission</label>
        <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none">
          <option value="">Any</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      <button onClick={applyFilters} className="w-full bg-[#dbb241] text-black py-2.5 rounded font-semibold text-sm hover:bg-[#c9a238] transition-colors">
        Apply Filters
      </button>
    </div>
  )
}
