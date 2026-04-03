"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { Search, Plus, PartyPopper } from "lucide-react"

interface Event {
  id: string
  name: string
  location: string
  category: string
  capacity: number
  isAvailable: boolean
  isFeatured: boolean
  images: { url: string; isPrimary: boolean }[]
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events?limit=100&all=true")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setEvents(data.events || [])
    } catch {
      toast.error("Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated bookings and cannot be undone.`)) return

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success(`"${name}" deleted successfully`)
      fetchEvents()
    } catch {
      toast.error("Failed to delete event")
    }
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-mist-900">Manage Events</h1>
        <Link href="/admin/events/new" className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-mist-800 transition-colors">
          <Plus size={14} /> Add New Event
        </Link>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
        <input type="text" placeholder="Search events by name, location..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-mist-200 rounded-lg text-sm text-mist-900 placeholder:text-mist-400 outline-none focus:border-black transition" />
      </div>

      {(() => {
        const q = search.toLowerCase()
        const filtered = events.filter(e => !q || e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))

        return loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-mist-100 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><PartyPopper size={40} className="mx-auto text-mist-300 mb-3" /><p className="text-mist-400 text-sm">No events found</p></div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block bg-white border border-mist-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-mist-500 border-b border-mist-200 bg-mist-50/50">
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3 hidden md:table-cell">Location</th>
                    <th className="px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Capacity</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((event) => {
                    const primaryImage = event.images?.[0]?.url
                    return (
                      <tr key={event.id} className="border-b border-mist-100 hover:bg-mist-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {primaryImage ? (
                              <img src={primaryImage} alt={event.name} className="w-12 h-10 bg-mist-100 rounded object-cover" />
                            ) : (
                              <div className="w-12 h-10 bg-mist-100 rounded flex items-center justify-center"><PartyPopper size={16} className="text-mist-400" /></div>
                            )}
                            <div>
                              <span className="text-sm font-medium text-mist-900">{event.name}</span>
                              <p className="text-xs text-mist-400 md:hidden">{event.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-mist-500 hidden md:table-cell">{event.location}</td>
                        <td className="px-4 py-3.5 text-sm text-mist-500 hidden md:table-cell">{event.category}</td>
                        <td className="px-4 py-3.5 text-sm text-mist-500 hidden lg:table-cell">{event.capacity}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-xs px-2 py-1 rounded ${event.isAvailable ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>{event.isAvailable ? "Available" : "Unavailable"}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-2">
                            <Link href={`/admin/events/new?edit=${event.id}`} className="text-xs text-black font-medium hover:underline">Edit</Link>
                            <button onClick={() => handleDelete(event.id, event.name)} className="text-xs text-red-500 hover:underline">Delete</button>
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
              {filtered.map((event) => {
                const primaryImage = event.images?.[0]?.url
                return (
                  <div key={event.id} className="bg-white border border-mist-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {primaryImage ? (
                        <img src={primaryImage} alt={event.name} className="w-14 h-11 bg-mist-100 rounded object-cover" />
                      ) : (
                        <div className="w-14 h-11 bg-mist-100 rounded flex items-center justify-center"><PartyPopper size={16} className="text-mist-400" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-mist-900 truncate">{event.name}</p>
                        <p className="text-xs text-mist-400">{event.location} &middot; {event.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${event.isAvailable ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>{event.isAvailable ? "Available" : "Unavailable"}</span>
                      <div className="flex gap-3">
                        <Link href={`/admin/events/new?edit=${event.id}`} className="text-xs text-black font-medium hover:underline">Edit</Link>
                        <button onClick={() => handleDelete(event.id, event.name)} className="text-xs text-red-500 hover:underline">Delete</button>
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
