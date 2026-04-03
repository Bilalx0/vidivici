"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { Search, Plus, Car } from "lucide-react"

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
  const [search, setSearch] = useState("")

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-mist-900">Manage Cars</h1>
        <Link href="/admin/cars/new" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-mist-800 transition-colors">
          <Plus size={14} /> Add New Car
        </Link>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
        <input type="text" placeholder="Search cars by name, brand..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-mist-200 rounded-lg text-sm text-mist-900 placeholder:text-mist-400 outline-none focus:border-black transition" />
      </div>

      {(() => {
        const q = search.toLowerCase()
        const filtered = cars.filter(c => !q || c.name.toLowerCase().includes(q) || c.brand?.name.toLowerCase().includes(q) || c.category?.name.toLowerCase().includes(q))

        return loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-mist-100 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><Car size={40} className="mx-auto text-mist-300 mb-3" /><p className="text-mist-400 text-sm">No cars found</p></div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block bg-white border border-mist-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-mist-500 border-b border-mist-200 bg-mist-50/50">
                    <th className="px-4 py-3">Car</th>
                    <th className="px-4 py-3 hidden md:table-cell">Brand</th>
                    <th className="px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="px-4 py-3">Price/Day</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((car) => {
                    const status = getStatus(car)
                    const primaryImage = car.images?.[0]?.url
                    return (
                      <tr key={car.id} className="border-b border-mist-100 hover:bg-mist-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {primaryImage ? (
                              <img src={primaryImage} alt={car.name} className="w-12 h-10 bg-mist-100 rounded object-cover" />
                            ) : (
                              <div className="w-12 h-10 bg-mist-100 rounded flex items-center justify-center"><Car size={16} className="text-mist-400" /></div>
                            )}
                            <div>
                              <span className="text-sm font-medium text-mist-900">{car.name}</span>
                              <p className="text-xs text-mist-400 md:hidden">{car.brand?.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-mist-500 hidden md:table-cell">{car.brand?.name}</td>
                        <td className="px-4 py-3.5 text-sm text-mist-500 hidden md:table-cell">{car.category?.name}</td>
                        <td className="px-4 py-3.5 text-sm text-mist-900 font-medium">${car.pricePerDay}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs px-2 py-1 rounded ${status === "Available" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>{status}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-2">
                            <Link href={`/admin/cars/new?edit=${car.id}`} className="text-xs text-black font-medium hover:underline">Edit</Link>
                            <button onClick={() => handleDelete(car.id, car.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {filtered.map((car) => {
                const status = getStatus(car)
                const primaryImage = car.images?.[0]?.url
                return (
                  <div key={car.id} className="bg-white border border-mist-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {primaryImage ? (
                        <img src={primaryImage} alt={car.name} className="w-14 h-11 bg-mist-100 rounded object-cover" />
                      ) : (
                        <div className="w-14 h-11 bg-mist-100 rounded flex items-center justify-center"><Car size={16} className="text-mist-400" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-mist-900 truncate">{car.name}</p>
                        <p className="text-xs text-mist-400">{car.brand?.name} &middot; {car.category?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-mist-900">${car.pricePerDay}/day</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${status === "Available" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>{status}</span>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/admin/cars/new?edit=${car.id}`} className="text-xs text-black font-medium hover:underline">Edit</Link>
                        <button onClick={() => handleDelete(car.id, car.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )
      })()}
    </div>
  )
}
