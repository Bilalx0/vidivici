"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

function VillaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const isEditing = !!editId

  const [submitting, setSubmitting] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [form, setForm] = useState({
    name: "",
    location: "Los Angeles",
    address: "",
    bedrooms: "4",
    bathrooms: "3",
    guests: "8",
    sqft: "4800",
    pricePerNight: "",
    cleaningFee: "0",
    securityDeposit: "0",
    amenities: "",
    description: "",
    shortDescription: "",
    isAvailable: true,
    isFeatured: false,
  })
  const [images, setImages] = useState<FileList | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (editId) {
          const res = await fetch(`/api/villas/${editId}`)
          if (res.ok) {
            const villa = await res.json()
            setForm({
              name: villa.name || "",
              location: villa.location || "Los Angeles",
              address: villa.address || "",
              bedrooms: villa.bedrooms?.toString() || "4",
              bathrooms: villa.bathrooms?.toString() || "3",
              guests: villa.guests?.toString() || "8",
              sqft: villa.sqft?.toString() || "4800",
              pricePerNight: villa.pricePerNight?.toString() || "",
              cleaningFee: villa.cleaningFee?.toString() || "0",
              securityDeposit: villa.securityDeposit?.toString() || "0",
              amenities: villa.amenities || "",
              description: villa.description || "",
              shortDescription: villa.shortDescription || "",
              isAvailable: villa.isAvailable ?? true,
              isFeatured: villa.isFeatured ?? false,
            })
          } else {
            toast.error("Failed to load villa data")
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
    if (!form.name.trim()) return "Villa name is required"
    if (!form.pricePerNight || parseFloat(form.pricePerNight) <= 0) return "Valid price per night is required"
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

      const payload = {
        ...form,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        guests: parseInt(form.guests),
        sqft: parseInt(form.sqft),
        pricePerNight: parseFloat(form.pricePerNight),
        cleaningFee: parseFloat(form.cleaningFee),
        securityDeposit: parseFloat(form.securityDeposit),
        images: imageUrls.length > 0 ? imageUrls : undefined,
      }

      const url = isEditing ? `/api/villas/${editId}` : "/api/villas"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(isEditing ? "Villa updated successfully" : "Villa created successfully")
        setTimeout(() => router.push("/admin/villas"), 500)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || `Failed to ${isEditing ? "update" : "create"} villa`)
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none"

  if (loadingData) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">{isEditing ? "Edit Villa" : "Add New Villa"}</h1>
        <p className="text-mist-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-8">{isEditing ? "Edit Villa" : "Add New Villa"}</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Basic Info */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-mist-400 block mb-1">Villa Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g., Beverly Hills Mansion" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Location</label>
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass}>
                <option>Los Angeles</option>
                <option>Beverly Hills</option>
                <option>Malibu</option>
                <option>Hollywood Hills</option>
                <option>Miami</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} placeholder="Full address" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Price Per Night ($) *</label>
              <input type="number" required value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Cleaning Fee ($)</label>
              <input type="number" value={form.cleaningFee} onChange={(e) => setForm({ ...form, cleaningFee: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Security Deposit ($)</label>
              <input type="number" value={form.securityDeposit} onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-mist-400 block mb-1">Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Bathrooms</label>
              <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Guests</label>
              <input type="number" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Sq. Ft.</label>
              <input type="number" value={form.sqft} onChange={(e) => setForm({ ...form, sqft: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Description</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-mist-400 block mb-1">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} placeholder="Brief tagline" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Full Description</label>
              <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Amenities (comma-separated)</label>
              <textarea rows={3} value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} className={`${inputClass} resize-none`} placeholder="Pool, Hot Tub, Home Theater, Wine Cellar, Gym" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Images</h2>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)}
            className="text-sm text-mist-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#dbb241] file:text-black hover:file:bg-[#c9a238]" />
        </div>

        {/* Toggles */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-[#dbb241]" />
              <span className="text-sm text-mist-300">Available for Rent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-[#dbb241]" />
              <span className="text-sm text-mist-300">Featured Villa</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-[#dbb241] text-black px-8 py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : isEditing ? "Update Villa" : "Save Villa"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="border border-[#2a2a2a] text-mist-300 px-8 py-3 rounded hover:border-[#dbb241] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default function AddVillaPage() {
  return (
    <Suspense fallback={<div><h1 className="text-2xl font-bold mb-8">Villa</h1><p className="text-mist-400 text-sm">Loading...</p></div>}>
      <VillaForm />
    </Suspense>
  )
}
