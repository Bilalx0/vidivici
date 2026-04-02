"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"

interface Villa {
  id: string
  name: string
  location: string
  bedrooms: number
  guests: number
  sqft: number
  pricePerNight: number
  isAvailable: boolean
  isFeatured: boolean
  images: { url: string; isPrimary: boolean }[]
}

export default function AdminVillasPage() {
  const [villas, setVillas] = useState<Villa[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVillas = async () => {
    try {
      const res = await fetch("/api/villas?limit=100&all=true")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setVillas(data.villas || [])
    } catch {
      toast.error("Failed to load villas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVillas()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated bookings and cannot be undone.`)) return

    try {
      const res = await fetch(`/api/villas/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success(`"${name}" deleted successfully`)
      fetchVillas()
    } catch {
      toast.error("Failed to delete villa")
    }
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Villas</h1>
        <Link href="/admin/villas/new" className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-mist-800 transition-colors">
          + Add New Villa
        </Link>
      </div>

      <div className="bg-white border border-mist-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-mist-500 border-b border-mist-200">
                <th className="px-3 sm:px-6 py-3">Villa</th>
                <th className="px-3 sm:px-6 py-3 hidden sm:table-cell">Location</th>
                <th className="px-3 sm:px-6 py-3 hidden md:table-cell">Bedrooms</th>
                <th className="px-3 sm:px-6 py-3 hidden md:table-cell">Guests</th>
                <th className="px-3 sm:px-6 py-3">Price/Night</th>
                <th className="px-3 sm:px-6 py-3">Status</th>
                <th className="px-3 sm:px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-mist-400">Loading villas...</td>
                </tr>
              ) : villas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-mist-400">No villas found. Add your first villa to get started.</td>
                </tr>
              ) : (
                villas.map((villa) => {
                  const primaryImage = villa.images?.[0]?.url
                  return (
                    <tr key={villa.id} className="border-b border-mist-100 hover:bg-mist-50 transition-colors">
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          {primaryImage ? (
                            <img src={primaryImage} alt={villa.name} className="w-12 h-10 bg-mist-100 rounded object-cover" />
                          ) : (
                            <div className="w-12 h-10 bg-mist-100 rounded flex items-center justify-center text-xs text-mist-400">IMG</div>
                          )}
                          <span className="text-sm font-medium text-mist-900">{villa.name}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-mist-500 hidden sm:table-cell">{villa.location}</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-mist-500 hidden md:table-cell">{villa.bedrooms}</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-mist-500 hidden md:table-cell">{villa.guests}</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-mist-900 font-medium">${villa.pricePerNight.toLocaleString()}</td>
                      <td className="px-3 sm:px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          villa.isAvailable ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                        }`}>{villa.isAvailable ? "Available" : "Unavailable"}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/villas/new?edit=${villa.id}`} className="text-xs text-black font-medium hover:underline">Edit</Link>
                          <button onClick={() => handleDelete(villa.id, villa.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
