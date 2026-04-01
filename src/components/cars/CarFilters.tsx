"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { RotateCcw, X, ChevronRight } from "lucide-react"


interface Option {
  id: string
  name: string
  slug: string
}

export default function CarFilters({ onHide }: { onHide?: () => void }) {
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
    <div className="bg-white p-2 sm:p-0 2xl:p-4 space-y-6 2xl:space-y-8 w-full">
      {/* Add close button for mobile if onHide provided */}
      {onHide && (
        <div className="flex justify-end lg:hidden mb-2">
          <button onClick={onHide} className="p-2 text-mist-400 hover:text-mist-600">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Brand Filter */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none"
        >
          <option value="">Select brand</option>
          {/* brand options */}
        </select>
        {selectedBrand && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {selectedBrand}
              <button onClick={() => setSelectedBrand("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Category Filter */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-neutral-100 border border-mist-200 text-mist-500 text-sm 2xl:text-lg px-3 py-2.5 2xl:px-6 2xl:py-4 rounded-md 2xl:rounded-xl focus:border-mist-300 focus:outline-none appearance-none"
        >
          <option value="">Select category</option>
          {/* category options */}
        </select>
        {selectedCategory && (
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-xs 2xl:text-base bg-mist-100 text-mist-600 px-3 py-1.5 2xl:px-6 2xl:py-3 rounded-full">
              {selectedCategory}
              <button onClick={() => setSelectedCategory("")} className="hover:text-mist-900">
                <X size={10} />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Price Range - Match VillaFilters style */}
      <div className="space-y-3">
        <label className="text-sm 2xl:text-xl font-medium text-mist-500 block">Price Range</label>
        <input
          type="range"
          min={0}
          max={5000}
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
                placeholder="5000"
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

      {/* Apply + Reset Buttons */}
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