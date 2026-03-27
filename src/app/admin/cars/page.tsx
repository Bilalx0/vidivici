"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

interface Car {
  id: string
  name: string
  pricePerDay: number
  isAvailable: boolean
  brand: { id: string; name: string }
  category: { id: string; name: string }
  images: { url: string; isPrimary: boolean }[]
  bookings?: any[]
}

export default function AdminCarsPage() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars?limit=100&all=true")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setCars(data.cars || [])
    } catch {
      toast.error("Failed to load cars")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated bookings and cannot be undone.`)) return

    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success(`"${name}" deleted successfully`)
      fetchCars()
    } catch {
      toast.error("Failed to delete car")
    }
  }

  const getStatus = (car: Car): string => {
    if (!car.isAvailable) return "Maintenance"
    return "Available"
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Cars</h1>
        <Link href="/admin/cars/new" className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
          + Add New Car
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="px-6 py-3">Car</th>
                <th className="px-6 py-3">Brand</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price/Day</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">Loading cars...</td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No cars found. Add your first car to get started.</td>
                </tr>
              ) : (
                cars.map((car) => {
                  const status = getStatus(car)
                  const primaryImage = car.images?.[0]?.url
                  return (
                    <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {primaryImage ? (
                            <img src={primaryImage} alt={car.name} className="w-12 h-10 bg-gray-100 rounded object-cover" />
                          ) : (
                            <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">IMG</div>
                          )}
                          <span className="text-sm font-medium text-gray-900">{car.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{car.brand?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{car.category?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">${car.pricePerDay}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          status === "Available" ? "bg-green-50 text-green-600" :
                          status === "Rented" ? "bg-blue-50 text-blue-600" :
                          "bg-orange-50 text-orange-600"
                        }`}>{status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/cars/new?edit=${car.id}`} className="text-xs text-black font-medium hover:underline">Edit</Link>
                          <button onClick={() => handleDelete(car.id, car.name)} className="text-xs text-red-500 hover:underline">Delete</button>
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
