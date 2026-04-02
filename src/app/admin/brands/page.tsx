"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface Brand {
  id: string
  name: string
  description: string | null
  logo: string | null
  _count?: { cars: number }
}

export default function AdminBrandsPage() {
  const [showForm, setShowForm] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/brands")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setBrands(data)
    } catch {
      toast.error("Failed to fetch brands")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const resetForm = () => {
    setName("")
    setDescription("")
    setLogoUrl("")
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Brand name is required")
      return
    }
    try {
      const payload: Record<string, string> = { name, description }
      if (logoUrl) payload.logo = logoUrl

      if (editingId) {
        const res = await fetch(`/api/brands/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update")
        toast.success("Brand updated successfully")
      } else {
        const res = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create")
        toast.success("Brand created successfully")
      }
      resetForm()
      fetchBrands()
    } catch {
      toast.error(editingId ? "Failed to update brand" : "Failed to create brand")
    }
  }

  const handleEdit = (brand: Brand) => {
    setName(brand.name)
    setDescription(brand.description || "")
    setLogoUrl(brand.logo || "")
    setEditingId(brand.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Brand deleted successfully")
      fetchBrands()
    } catch {
      toast.error("Failed to delete brand")
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Brands</h1>
        <button onClick={() => { if (showForm) { resetForm() } else { setShowForm(true) } }} className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-mist-800 transition-colors">
          {showForm ? "Cancel" : "+ Add Brand"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-mist-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Brand Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Logo (Upload)</label>
              <input type="file" accept="image/*" className="text-sm text-mist-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-mist-500 block mb-1">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none resize-none" />
            </div>
          </div>
          <button onClick={handleSubmit} className="mt-4 bg-black text-white px-6 py-2 rounded text-sm font-semibold hover:bg-mist-800 transition-colors">{editingId ? "Update Brand" : "Save Brand"}</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading brands...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-white border border-mist-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-mist-100 rounded-full mx-auto mb-3 flex items-center justify-center text-mist-900 font-bold text-xl">
                {brand.name.charAt(0)}
              </div>
              <h3 className="text-base font-semibold text-mist-900 mb-1">{brand.name}</h3>
              <p className="text-xs text-mist-500 mb-2">{brand.description}</p>
              <p className="text-xs text-mist-900 font-medium mb-3">{brand._count?.cars ?? 0} vehicles</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => handleEdit(brand)} className="text-xs text-black font-medium hover:underline">Edit</button>
                <button onClick={() => handleDelete(brand.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
