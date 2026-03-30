"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

const EVENT_CATEGORIES = [
  "Nightlife",
  "Lounge & Dining",
  "Private Events",
  "Corporate",
  "VIP Experience",
]

const LOCATIONS = [
  "Los Angeles",
  "Beverly Hills",
  "West Hollywood",
  "Hollywood",
  "Santa Monica",
  "Malibu",
]

function EventForm() {
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
    category: "Nightlife",
    venueName: "",
    capacity: "200",
    priceRange: "",
    dressCode: "",
    highlights: "",
    experience: "",
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
          const res = await fetch(`/api/events/${editId}`)
          if (res.ok) {
            const event = await res.json()
            setForm({
              name: event.name || "",
              location: event.location || "Los Angeles",
              address: event.address || "",
              category: event.category || "Nightlife",
              venueName: event.venueName || "",
              capacity: event.capacity?.toString() || "200",
              priceRange: event.priceRange || "",
              dressCode: event.dressCode || "",
              highlights: event.highlights || "",
              experience: event.experience || "",
              description: event.description || "",
              shortDescription: event.shortDescription || "",
              isAvailable: event.isAvailable ?? true,
              isFeatured: event.isFeatured ?? false,
            })
          } else {
            toast.error("Failed to load event data")
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
    if (!form.name.trim()) return "Event name is required"
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
        capacity: parseInt(form.capacity) || 200,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      }

      const url = isEditing ? `/api/events/${editId}` : "/api/events"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(isEditing ? "Event updated successfully" : "Event created successfully")
        setTimeout(() => router.push("/admin/events"), 500)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || `Failed to ${isEditing ? "update" : "create"} event`)
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
        <h1 className="text-2xl font-bold mb-8">{isEditing ? "Edit Event" : "Add New Event"}</h1>
        <p className="text-mist-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-8">{isEditing ? "Edit Event" : "Add New Event"}</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Basic Info */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-mist-400 block mb-1">Event Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g., Raspoutine Los Angeles" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Location</label>
              <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass}>
                {LOCATIONS.map((loc) => <option key={loc}>{loc}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} placeholder="Full address" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {EVENT_CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Venue Name</label>
              <input type="text" value={form.venueName} onChange={(e) => setForm({ ...form, venueName: e.target.value })} className={inputClass} placeholder="e.g., Raspoutine" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Capacity</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Price Range</label>
              <input type="text" value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} className={inputClass} placeholder="e.g., $500 - $5,000" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#dbb241] mb-4">Event Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-mist-400 block mb-1">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} placeholder="Brief tagline for the event" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Full Description</label>
              <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Dress Code</label>
              <input type="text" value={form.dressCode} onChange={(e) => setForm({ ...form, dressCode: e.target.value })} className={inputClass} placeholder="e.g., Collared shirts, no athletic apparel" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">Highlights (pipe-separated: Title: Description)</label>
              <textarea rows={4} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} className={`${inputClass} resize-none`}
                placeholder="Upscale Ambiance & Design: A sophisticated West Hollywood space | Signature DJ Sets: Immerse yourself in deep house | VIP & Private Experiences: Private tables and bottle service" />
            </div>
            <div>
              <label className="text-xs text-mist-400 block mb-1">The Experience (paragraphs, newline-separated)</label>
              <textarea rows={5} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className={`${inputClass} resize-none`}
                placeholder="Describe the full event experience here. Each paragraph on a new line." />
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
              <span className="text-sm text-mist-300">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-[#dbb241]" />
              <span className="text-sm text-mist-300">Featured Event</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-[#dbb241] text-black px-8 py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : isEditing ? "Update Event" : "Save Event"}
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

export default function AddEventPage() {
  return (
    <Suspense fallback={<div><h1 className="text-2xl font-bold mb-8">Event</h1><p className="text-mist-400 text-sm">Loading...</p></div>}>
      <EventForm />
    </Suspense>
  )
}
