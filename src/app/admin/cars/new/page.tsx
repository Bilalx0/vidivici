"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import ImageManager, { ExistingImage } from "@/components/admin/ImageManager"

interface BrandOption {
  id: string
  name: string
}

interface CategoryOption {
  id: string
  name: string
}

function AddCarForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const isEditing = !!editId

  const [submitting, setSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [brands, setBrands] = useState<BrandOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [form, setForm] = useState({
    name: "", brandId: "", categoryId: "", pricePerDay: "", originalPrice: "", year: "", seats: "4",
    transmission: "Automatic", fuelType: "Gasoline", horsepower: "", topSpeed: "",
    acceleration: "", milesIncluded: "100", extraMileRate: "9", minRentalDays: "1",
    description: "", shortDescription: "", detailHeading: "", location: "Los Angeles",
    isAvailable: true, isFeatured: false,
  })
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
        ])

        if (brandsRes.ok) {
          const brandsData = await brandsRes.json()
          setBrands(brandsData)
        }
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        if (editId) {
          const carRes = await fetch(`/api/cars/${editId}`)
          if (carRes.ok) {
            const car = await carRes.json()
            setForm({
              name: car.name || "",
              brandId: car.brandId || "",
              categoryId: car.categoryId || "",
              pricePerDay: car.pricePerDay?.toString() || "",
              originalPrice: car.originalPrice?.toString() || "",
              year: car.year?.toString() || "",
              seats: car.seats?.toString() || "4",
              transmission: car.transmission || "Automatic",
              fuelType: car.fuelType || "Gasoline",
              horsepower: car.horsepower?.toString() || "",
              topSpeed: car.topSpeed || "",
              acceleration: car.acceleration || "",
              milesIncluded: car.milesIncluded?.toString() || "100",
              extraMileRate: car.extraMileRate?.toString() || "9",
              minRentalDays: car.minRentalDays?.toString() || "1",
              description: car.description || "",
              shortDescription: car.shortDescription || "",
              detailHeading: car.detailHeading || "",
              location: car.location || "Los Angeles",
              isAvailable: car.isAvailable ?? true,
              isFeatured: car.isFeatured ?? false,
            })
            if (car.images) setExistingImages(car.images)
          } else {
            toast.error("Failed to load car data")
          }
        }
      } catch {
        toast.error("Failed to load form data")
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [editId])

  const validate = (): string | null => {
    if (!form.name.trim()) return "Car name is required"
    if (!form.brandId) return "Brand is required"
    if (!form.categoryId) return "Category is required"
    if (!form.pricePerDay || parseFloat(form.pricePerDay) <= 0) return "Valid price per day is required"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    setSubmitting(true)

    try {
      // Upload new images if any
      let uploadedUrls: string[] = []
      if (newFiles.length > 0) {
        const formData = new FormData()
        newFiles.forEach(f => formData.append("files", f))
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        if (uploadRes.ok) {
          const data = await uploadRes.json()
          uploadedUrls = data.urls
        }
      }

      // Combine kept existing + newly uploaded
      const keptUrls = existingImages.map(img => img.url)
      const allImages = [...keptUrls, ...uploadedUrls]

      const payload = {
        ...form,
        pricePerDay: parseFloat(form.pricePerDay),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        year: form.year ? parseInt(form.year) : null,
        seats: parseInt(form.seats),
        horsepower: form.horsepower ? parseInt(form.horsepower) : null,
        milesIncluded: parseInt(form.milesIncluded),
        extraMileRate: parseFloat(form.extraMileRate),
        minRentalDays: parseInt(form.minRentalDays),
        images: isEditing || allImages.length > 0 ? allImages : undefined,
      }

      const url = isEditing ? `/api/cars/${editId}` : "/api/cars"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(isEditing ? "Car updated successfully" : "Car created successfully")
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || `Failed to ${isEditing ? "update" : "create"} car`)
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none"

  if (loadingData) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">{isEditing ? "Edit Car" : "Add New Car"}</h1>
        <p className="text-mist-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-8">{isEditing ? "Edit Car" : "Add New Car"}</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Basic Info */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-mist-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-mist-400 block mb-1">Car Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g., Lamborghini Huracán EVO" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Brand *</label>
              <select required value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className={inputClass}>
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Category *</label>
              <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Price Per Day ($) *</label>
              <input type="number" required value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Original Price ($) <span className="text-mist-600">— shown as strikethrough</span></label>
              <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className={inputClass} placeholder="Leave empty if no discount" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Location</label>
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass}>
                <option>Los Angeles</option>
                <option>Miami</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-mist-900 mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-mist-400 block mb-1">Seats</label>
              <input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Transmission</label>
              <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className={inputClass}>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Fuel Type</label>
              <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} className={inputClass}>
                <option>Gasoline</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Horsepower</label>
              <input type="number" value={form.horsepower} onChange={(e) => setForm({ ...form, horsepower: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Top Speed</label>
              <input type="text" value={form.topSpeed} onChange={(e) => setForm({ ...form, topSpeed: e.target.value })} className={inputClass} placeholder="e.g., 202 mph" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">0-60 Acceleration</label>
              <input type="text" value={form.acceleration} onChange={(e) => setForm({ ...form, acceleration: e.target.value })} className={inputClass} placeholder="e.g., 2.9s" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Miles Included</label>
              <input type="number" value={form.milesIncluded} onChange={(e) => setForm({ ...form, milesIncluded: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Extra Mile Rate ($)</label>
              <input type="number" step="0.01" value={form.extraMileRate} onChange={(e) => setForm({ ...form, extraMileRate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Min Rental Days</label>
              <input type="number" value={form.minRentalDays} onChange={(e) => setForm({ ...form, minRentalDays: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-mist-900 mb-4">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-mist-400 block mb-1">Detail Heading (Car detail page title line)</label>
              <input type="text" value={form.detailHeading} onChange={(e) => setForm({ ...form, detailHeading: e.target.value })} className={inputClass} placeholder="e.g., Rent a Lamborghini Huracan in Los Angeles" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} placeholder="Brief tagline" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Full Description</label>
              <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* Images */}
        <ImageManager
          existingImages={existingImages}
          onExistingChange={setExistingImages}
          newFiles={newFiles}
          onNewFilesChange={setNewFiles}
        />

        {/* Toggles */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-black" />
              <span className="text-sm text-mist-300">Available for Rent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-black" />
              <span className="text-sm text-mist-300">Featured Vehicle</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-mist-800 transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : isEditing ? "Update Car" : "Save Car"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="border border-mist-200 text-mist-600 px-8 py-3 rounded hover:border-black transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default function AddCarPage() {
  return (
    <Suspense fallback={<div><h1 className="text-2xl font-bold mb-8">Car</h1><p className="text-mist-400 text-sm">Loading...</p></div>}>
      <AddCarForm />
    </Suspense>
  )
}
