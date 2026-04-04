"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import ImageManager, { ExistingImage } from "@/components/admin/ImageManager"

type WhyChooseCard = {
  title: string
  description: string
  icon: string
}

type ShowcaseCard = {
  title: string
  description: string
  imageUrl: string
}

const ICON_OPTIONS = [
  "Star",
  "Sparkles",
  "Music2",
  "UtensilsCrossed",
  "ShieldCheck",
  "GlassWater",
  "Gem",
]

const DEFAULT_WHY_CHOOSE: WhyChooseCard[] = [
  { title: "VIP Atmosphere", description: "Exclusive ambiance and curated service.", icon: "Star" },
]

const DEFAULT_SHOWCASE: ShowcaseCard[] = [
  { title: "", description: "", imageUrl: "" },
  { title: "", description: "", imageUrl: "" },
  { title: "", description: "", imageUrl: "" },
]

function parseHighlightsConfig(raw: string | null | undefined): {
  whyChooseCards: WhyChooseCard[]
  showcaseCards: ShowcaseCard[]
} {
  if (!raw) {
    return { whyChooseCards: DEFAULT_WHY_CHOOSE, showcaseCards: DEFAULT_SHOWCASE }
  }

  try {
    const parsed = JSON.parse(raw)
    const whyChooseCards = Array.isArray(parsed?.whyChooseCards)
      ? parsed.whyChooseCards.map((item: any) => ({
          title: String(item?.title || ""),
          description: String(item?.description || ""),
          icon: String(item?.icon || "Star"),
        }))
      : []

    const showcaseCards = Array.isArray(parsed?.showcaseCards)
      ? parsed.showcaseCards.map((item: any) => ({
          title: String(item?.title || ""),
          description: String(item?.description || ""),
          imageUrl: String(item?.imageUrl || ""),
        }))
      : []

    return {
      whyChooseCards: whyChooseCards.length > 0 ? whyChooseCards : DEFAULT_WHY_CHOOSE,
      showcaseCards: showcaseCards.length > 0 ? showcaseCards : DEFAULT_SHOWCASE,
    }
  } catch {
    const legacy = raw
      .split("|")
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => {
        const [title, description] = v.split(":")
        return {
          title: (title || "").trim(),
          description: (description || "").trim(),
          icon: "Star",
        }
      })

    return {
      whyChooseCards: legacy.length > 0 ? legacy : DEFAULT_WHY_CHOOSE,
      showcaseCards: DEFAULT_SHOWCASE,
    }
  }
}

function parseExperienceConfig(raw: string | null | undefined): {
  subtitle: string
  images: string[]
} {
  if (!raw) return { subtitle: "", images: ["", "", ""] }

  try {
    const parsed = JSON.parse(raw)
    const subtitle = String(parsed?.subtitle || "")
    const images = Array.isArray(parsed?.images)
      ? [0, 1, 2].map((i) => String(parsed.images[i] || ""))
      : ["", "", ""]
    return { subtitle, images }
  } catch {
    return { subtitle: "", images: ["", "", ""] }
  }
}

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
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [whyChooseCards, setWhyChooseCards] = useState<WhyChooseCard[]>(DEFAULT_WHY_CHOOSE)
  const [showcaseCards, setShowcaseCards] = useState<ShowcaseCard[]>(DEFAULT_SHOWCASE)
  const [experienceSubtitle, setExperienceSubtitle] = useState("")
  const [experienceImages, setExperienceImages] = useState<string[]>(["", "", ""])
  const [uploadingExperienceIndex, setUploadingExperienceIndex] = useState<number | null>(null)
  const [uploadingShowcaseIndex, setUploadingShowcaseIndex] = useState<number | null>(null)

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
            const highlightsConfig = parseHighlightsConfig(event.highlights)
            setWhyChooseCards(highlightsConfig.whyChooseCards)
            setShowcaseCards(highlightsConfig.showcaseCards)

            const experienceConfig = parseExperienceConfig(event.experience)
            setExperienceSubtitle(experienceConfig.subtitle)
            setExperienceImages(experienceConfig.images)
            if (event.images) setExistingImages(event.images)
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

      const keptUrls = existingImages.map(img => img.url)
      const allImages = [...keptUrls, ...uploadedUrls]

      const payload = {
        ...form,
        capacity: parseInt(form.capacity) || 200,
        highlights: JSON.stringify({
          whyChooseCards: whyChooseCards.filter((c) => c.title.trim() || c.description.trim()),
          showcaseCards: showcaseCards.filter((c) => c.title.trim() || c.description.trim() || c.imageUrl.trim()),
        }),
        experience: JSON.stringify({
          subtitle: experienceSubtitle,
          images: experienceImages,
        }),
        images: isEditing || allImages.length > 0 ? allImages : undefined,
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

  const uploadSingleImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("files", file)
    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
    if (!uploadRes.ok) throw new Error("Upload failed")
    const data = await uploadRes.json()
    const url = data?.urls?.[0]
    if (!url) throw new Error("No URL returned")
    return String(url)
  }

  const handleExperienceImageUpload = async (index: number, file?: File) => {
    if (!file) return
    setUploadingExperienceIndex(index)
    try {
      const url = await uploadSingleImage(file)
      setExperienceImages((prev) => prev.map((v, i) => (i === index ? url : v)))
      toast.success(`Experience image ${index + 1} uploaded`)
    } catch {
      toast.error("Failed to upload experience image")
    } finally {
      setUploadingExperienceIndex(null)
    }
  }

  const handleShowcaseImageUpload = async (index: number, file?: File) => {
    if (!file) return
    setUploadingShowcaseIndex(index)
    try {
      const url = await uploadSingleImage(file)
      setShowcaseCards((prev) => prev.map((c, i) => (i === index ? { ...c, imageUrl: url } : c)))
      toast.success(`Showcase image ${index + 1} uploaded`)
    } catch {
      toast.error("Failed to upload showcase image")
    } finally {
      setUploadingShowcaseIndex(null)
    }
  }

  const inputClass = "w-full bg-white border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none"

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
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-mist-900 mb-4">Basic Information</h2>
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
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-semibold text-mist-900 mb-4">Event Details</h2>
          <div className="space-y-6">
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
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-mist-400 block mb-1">Why Choose Cards</label>
                <button
                  type="button"
                  onClick={() => setWhyChooseCards((prev) => [...prev, { title: "", description: "", icon: "Star" }])}
                  className="text-xs px-3 py-1.5 rounded bg-mist-100 text-mist-700 hover:bg-mist-200"
                >
                  Add Card
                </button>
              </div>
              <div className="space-y-2.5">
                {whyChooseCards.map((card, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center bg-mist-50 rounded-lg p-3">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => setWhyChooseCards((prev) => prev.map((c, i) => i === idx ? { ...c, title: e.target.value } : c))}
                      className={`${inputClass} md:col-span-3`}
                      placeholder="Card title"
                    />
                    <input
                      type="text"
                      value={card.description}
                      onChange={(e) => setWhyChooseCards((prev) => prev.map((c, i) => i === idx ? { ...c, description: e.target.value } : c))}
                      className={`${inputClass} md:col-span-6`}
                      placeholder="Card description"
                    />
                    <select
                      value={card.icon}
                      onChange={(e) => setWhyChooseCards((prev) => prev.map((c, i) => i === idx ? { ...c, icon: e.target.value } : c))}
                      className={`${inputClass} md:col-span-2`}
                    >
                      {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => setWhyChooseCards((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)}
                      className="text-xs px-3 py-2 rounded bg-white text-mist-600 hover:bg-mist-100 md:col-span-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-mist-400 block mb-1">Experience Section Subtitle (line below main heading)</label>
              <input
                type="text"
                value={experienceSubtitle}
                onChange={(e) => setExperienceSubtitle(e.target.value)}
                className={inputClass}
                placeholder="e.g., Modern luxury meets classic elegance"
              />
            </div>

            <div>
              <label className="text-xs text-mist-400 block mb-1">Experience Section Images (3)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="space-y-2 bg-mist-50 rounded-lg p-3">
                    <p className="text-xs text-mist-400">Image {idx + 1}</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleExperienceImageUpload(idx, e.target.files?.[0])}
                        className="block w-full text-xs text-mist-500 file:mr-2 file:rounded-md file:border file:border-mist-200 file:bg-white file:px-2.5 file:py-1.5 file:text-xs file:text-mist-700 hover:file:bg-mist-50"
                      />
                      {uploadingExperienceIndex === idx && (
                        <span className="text-xs text-mist-400">Uploading...</span>
                      )}
                    </div>
                    {experienceImages[idx] && (
                      <p className="text-xs text-mist-500 truncate">{experienceImages[idx]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-mist-400 block mb-1">Showcase Cards (Image + Text section)</label>
                <button
                  type="button"
                  onClick={() => setShowcaseCards((prev) => [...prev, { title: "", description: "", imageUrl: "" }])}
                  className="text-xs px-3 py-1.5 rounded bg-mist-100 text-mist-700 hover:bg-mist-200"
                >
                  Add Showcase Card
                </button>
              </div>
              <div className="space-y-2.5">
                {showcaseCards.map((card, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center bg-mist-50 rounded-lg p-3">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => setShowcaseCards((prev) => prev.map((c, i) => i === idx ? { ...c, title: e.target.value } : c))}
                      className={`${inputClass} md:col-span-3`}
                      placeholder="Card title"
                    />
                    <input
                      type="text"
                      value={card.description}
                      onChange={(e) => setShowcaseCards((prev) => prev.map((c, i) => i === idx ? { ...c, description: e.target.value } : c))}
                      className={`${inputClass} md:col-span-5`}
                      placeholder="Card description"
                    />
                    <div className="md:col-span-2">
                      <p className="text-xs text-mist-400 mb-1">Image Upload</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleShowcaseImageUpload(idx, e.target.files?.[0])}
                        className="block w-full text-xs text-mist-500 file:mr-2 file:rounded-md file:border file:border-mist-200 file:bg-white file:px-2.5 file:py-1.5 file:text-xs file:text-mist-700 hover:file:bg-mist-50"
                      />
                      {uploadingShowcaseIndex === idx && (
                        <span className="text-xs text-mist-400">Uploading...</span>
                      )}
                      {card.imageUrl && (
                        <p className="text-xs text-mist-500 truncate mt-1">{card.imageUrl}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowcaseCards((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)}
                      className="text-xs px-3 py-2 rounded bg-white text-mist-600 hover:bg-mist-100 md:col-span-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
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
              <span className="text-sm text-mist-300">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-black" />
              <span className="text-sm text-mist-300">Featured Event</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-mist-800 transition-colors disabled:opacity-50">
            {submitting ? "Saving..." : isEditing ? "Update Event" : "Save Event"}
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

export default function AddEventPage() {
  return (
    <Suspense fallback={<div><h1 className="text-2xl font-bold mb-8">Event</h1><p className="text-mist-400 text-sm">Loading...</p></div>}>
      <EventForm />
    </Suspense>
  )
}
