"use client"

import { useState, useEffect } from "react"
import { Search, Users } from "lucide-react"

interface Customer {
  id: string
  name: string | null
  email: string
  phone: string | null
  image: string | null
  createdAt: string
  _count: { bookings: number; wishlist: number }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.ok ? r.json() : [])
      .then(setCustomers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.name?.toLowerCase().includes(q) || false) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone?.toLowerCase().includes(q) || false)
    )
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mist-900">Customers</h1>
          <p className="text-mist-500 text-sm mt-1">{customers.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
        <input
          type="text"
          placeholder="Search by name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-mist-900 placeholder:text-mist-400 outline-none focus:border-gray-900 transition"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto text-mist-300 mb-3" />
          <p className="text-mist-500">No customers found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-mist-500 text-xs uppercase tracking-wide bg-gray-50">
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3 hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Phone</th>
                <th className="text-center px-5 py-3">Bookings</th>
                <th className="text-center px-5 py-3 hidden sm:table-cell">Wishlist</th>
                <th className="text-left px-5 py-3 hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const initials = (c.name || c.email).charAt(0).toUpperCase()
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold text-mist-500">
                          {c.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.image} alt={c.name || ""} className="w-full h-full object-cover" />
                          ) : initials}
                        </div>
                        <div>
                          <p className="font-medium text-mist-900">{c.name || "—"}</p>
                          <p className="text-xs text-mist-400 sm:hidden">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-mist-600 hidden sm:table-cell">{c.email}</td>
                    <td className="px-5 py-3.5 text-mist-600 hidden md:table-cell">{c.phone || "—"}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {c._count.bookings}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                      <span className="inline-block bg-red-50 text-red-500 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {c._count.wishlist}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-mist-400 hidden lg:table-cell text-xs">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
