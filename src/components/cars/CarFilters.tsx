"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

interface Option {
  id: string
  name: string
  slug: string
}

export default function CarFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [brands, setBrands] = useState<Option[]>([])
  const [categories, setCategories] = useState<Option[]>([])

  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

  useEffect(() => {
    fetch("/api/brands").then(r => r.ok ? r.json() : []).then(setBrands).catch(() => {})
    fetch("/api/categories").then(r => r.ok ? r.json() : []).then(setCategories).catch(() => {})
  }, [])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (selectedBrand) params.set("brand", selectedBrand)
    if (selectedCategory) params.set("category", selectedCategory)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    params.set("page", "1")
    router.push(`/cars?${params.toString()}`)
  }

  const clearAll = () => {
    setSelectedBrand("")
    setSelectedCategory("")
    setMinPrice("")
    setMaxPrice("")
    router.push("/cars")
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-mist-900">Filters</h3>
        <button onClick={clearAll} className="text-xs text-mist-400 hover:text-mist-700 transition-colors">Clear All</button>
      </div>

      {/* Brand */}
      <div>
        <label className="text-xs font-medium text-mist-500 block mb-2">Brand</label>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-gray-400 focus:outline-none">
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-medium text-mist-500 block mb-2">Category</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-gray-400 focus:outline-none">
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-medium text-mist-500 block mb-2">Price Range (per day)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 bg-gray-50 border border-gray-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-gray-400 focus:outline-none" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 bg-gray-50 border border-gray-200 text-mist-700 text-sm px-3 py-2.5 rounded-xl focus:border-gray-400 focus:outline-none" />
        </div>
      </div>

      <button onClick={applyFilters} className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">
        Apply Filters
      </button>
    </div>
  )
}
