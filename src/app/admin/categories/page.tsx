"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface Category {
  id: string
  name: string
  description: string | null
  _count?: { cars: number }
}

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setCategories(data)
    } catch {
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setName("")
    setDescription("")
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Category name is required")
      return
    }
    try {
      const payload = { name, description }

      if (editingId) {
        const res = await fetch(`/api/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update")
        toast.success("Category updated successfully")
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create")
        toast.success("Category created successfully")
      }
      resetForm()
      fetchCategories()
    } catch {
      toast.error(editingId ? "Failed to update category" : "Failed to create category")
    }
  }

  const handleEdit = (cat: Category) => {
    setName(cat.name)
    setDescription(cat.description || "")
    setEditingId(cat.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Category deleted successfully")
      fetchCategories()
    } catch {
      toast.error("Failed to delete category")
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Categories</h1>
        <button onClick={() => { if (showForm) { resetForm() } else { setShowForm(true) } }} className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-mist-800 transition-colors">
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-mist-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
          </div>
          <button onClick={handleSubmit} className="mt-4 bg-black text-white px-6 py-2 rounded text-sm font-semibold hover:bg-mist-800 transition-colors">{editingId ? "Update Category" : "Save Category"}</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-mist-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-mist-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-mist-500 mb-3">{cat.description}</p>
              <p className="text-xs text-mist-900 font-medium mb-4">{cat._count?.cars ?? 0} vehicles</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cat)} className="text-xs text-black font-medium hover:underline">Edit</button>
                <button onClick={() => handleDelete(cat.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
