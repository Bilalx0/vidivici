"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import toast from "react-hot-toast"

interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  isVisible: boolean
}

export default function AdminTestimonialsPage() {
  const [showForm, setShowForm] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(5)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials?all=true")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setTestimonials(data)
    } catch {
      toast.error("Failed to load testimonials")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTestimonials() }, [])

  const resetForm = () => {
    setName("")
    setContent("")
    setRating(5)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) {
      toast.error("Name and content are required")
      return
    }
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials"
      const method = editingId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, rating }),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success(editingId ? "Testimonial updated" : "Testimonial created")
      resetForm()
      fetchTestimonials()
    } catch {
      toast.error("Failed to save testimonial")
    }
  }

  const handleEdit = (t: Testimonial) => {
    setName(t.name)
    setContent(t.content)
    setRating(t.rating)
    setEditingId(t.id)
    setShowForm(true)
  }

  const toggleVisibility = async (t: Testimonial) => {
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !t.isVisible }),
      })
      if (!res.ok) throw new Error("Failed to update")
      toast.success(t.isVisible ? "Testimonial hidden" : "Testimonial visible")
      fetchTestimonials()
    } catch {
      toast.error("Failed to update visibility")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Testimonial deleted")
      fetchTestimonials()
    } catch {
      toast.error("Failed to delete testimonial")
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Testimonials</h1>
        <button onClick={() => { if (showForm && editingId) { resetForm() } else { setShowForm(!showForm) } }} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-mist-800 transition-colors">
          {showForm ? "Cancel" : "+ Add Testimonial"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-mist-200 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Customer Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded-lg focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Rating</label>
              <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded-lg focus:border-black focus:outline-none">
                <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-mist-500 block mb-1">Content</label>
            <textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded-lg focus:border-black focus:outline-none resize-none" />
          </div>
          <button onClick={handleSubmit} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-mist-800 transition-colors">Save Testimonial</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading testimonials...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white border border-mist-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-mist-900 rounded-full flex items-center justify-center text-white font-medium text-sm">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium text-mist-900">{t.name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={12} className="fill-mist-900 text-mist-900" />)}</div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.isVisible ? "bg-green-50 text-green-600" : "bg-mist-100 text-mist-500"}`}>
                  {t.isVisible ? "Visible" : "Hidden"}
                </span>
              </div>
              <p className="text-sm text-mist-500 italic mb-4">&ldquo;{t.content}&rdquo;</p>
              <div className="flex gap-4">
                <button onClick={() => handleEdit(t)} className="text-xs text-mist-900 font-medium hover:underline">Edit</button>
                <button onClick={() => toggleVisibility(t)} className="text-xs text-mist-400 hover:text-mist-600 transition-colors">{t.isVisible ? "Hide" : "Show"}</button>
                <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
