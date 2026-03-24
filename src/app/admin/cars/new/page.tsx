"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const brandOptions = ["Rolls-Royce", "Bentley", "Aston Martin", "Lamborghini", "Ferrari", "McLaren", "Porsche", "Mercedes", "BMW", "Range Rover", "Cadillac", "Corvette", "Tesla", "Audi", "Rivian", "Hummer"]
const categoryOptions = ["Supercar", "Convertible", "SUV", "Chauffeur", "EV", "Coupe/Sports", "Sedan", "Ultra-Luxury"]

export default function AddCarPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "", brandId: "", categoryId: "", pricePerDay: "", year: "", seats: "4",
    transmission: "Automatic", fuelType: "Gasoline", horsepower: "", topSpeed: "",
    acceleration: "", milesIncluded: "100", extraMileRate: "9", minRentalDays: "1",
    description: "", shortDescription: "", location: "Los Angeles",
    isAvailable: true, isFeatured: false,
  })
  const [images, setImages] = useState<FileList | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Upload images first if any
      let imageUrls: string[] = []
      if (images && images.length > 0) {
        const formData = new FormData()
        Array.from(images).forEach(f => formData.append("files", f))
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        if (uploadRes.ok) {
          const data = await uploadRes.json()
          imageUrls = data.urls
        }
      }

      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerDay: parseFloat(form.pricePerDay),
          year: parseInt(form.year),
          seats: parseInt(form.seats),
          horsepower: form.horsepower ? parseInt(form.horsepower) : null,
          milesIncluded: parseInt(form.milesIncluded),
          extraMileRate: parseFloat(form.extraMileRate),
          minRentalDays: parseInt(form.minRentalDays),
          images: imageUrls,
        }),
      })

      if (res.ok) router.push("/admin/cars")
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none"

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Add New Car</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Basic Info */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 block mb-1">Car Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g., Lamborghini Huracán EVO" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Brand *</label>
              <select required value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className={inputClass}>
                <option value="">Select Brand</option>
                {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Category *</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
                <option value="">Select Category</option>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Price Per Day ($) *</label>
              <input type="number" required value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Location</label>
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass}>
                <option>Los Angeles</option>
                <option>Miami</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Seats</label>
              <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Transmission</label>
              <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className={inputClass}>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Fuel Type</label>
              <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} className={inputClass}>
                <option>Gasoline</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Horsepower</label>
              <input type="number" value={form.horsepower} onChange={(e) => setForm({ ...form, horsepower: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Top Speed</label>
              <input type="text" value={form.topSpeed} onChange={(e) => setForm({ ...form, topSpeed: e.target.value })} className={inputClass} placeholder="e.g., 202 mph" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">0-60 Acceleration</label>
              <input type="text" value={form.acceleration} onChange={(e) => setForm({ ...form, acceleration: e.target.value })} className={inputClass} placeholder="e.g., 2.9s" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Miles Included</label>
              <input type="number" value={form.milesIncluded} onChange={(e) => setForm({ ...form, milesIncluded: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Extra Mile Rate ($)</label>
              <input type="number" step="0.01" value={form.extraMileRate} onChange={(e) => setForm({ ...form, extraMileRate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Min Rental Days</label>
              <input type="number" value={form.minRentalDays} onChange={(e) => setForm({ ...form, minRentalDays: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} placeholder="Brief tagline" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Full Description</label>
              <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Images</h2>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#dbb241] file:text-black hover:file:bg-[#c9a238]" />
        </div>

        {/* Toggles */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-[#dbb241]" />
              <span className="text-sm text-gray-300">Available for Rent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-[#dbb241]" />
              <span className="text-sm text-gray-300">Featured Vehicle</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-[#dbb241] text-black px-8 py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : "Save Car"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="border border-[#2a2a2a] text-gray-300 px-8 py-3 rounded hover:border-[#dbb241] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
