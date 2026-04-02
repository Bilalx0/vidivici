"use client"

import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Mail, Phone, Calendar, Tag, Trash2 } from "lucide-react"

interface Inquiry {
  id: string
  source: string
  category: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string | null
  data: string | null
  isRead: boolean
  createdAt: string
}

const TABS = ["All", "Car", "Villa", "Event", "General"]

const sourceLabels: Record<string, string> = {
  "homepage-contact": "Homepage Contact",
  "contact-page": "Contact Page",
  "partner": "Partner Application",
  "ballroom": "Ballroom Booking",
  "venue-booking": "Venue Booking",
  "film-tv-production": "Film & TV Production",
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("All")
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchInquiries = async () => {
    try {
      const url = activeTab === "All" ? "/api/inquiries" : `/api/inquiries?category=${activeTab}`
      const res = await fetch(url)
      if (!res.ok) throw new Error()
      setInquiries(await res.json())
    } catch {
      toast.error("Failed to load inquiries")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchInquiries()
  }, [activeTab])

  const toggleRead = async (inq: Inquiry) => {
    try {
      await fetch(`/api/inquiries/${inq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !inq.isRead }),
      })
      toast.success(inq.isRead ? "Marked as unread" : "Marked as read")
      fetchInquiries()
    } catch {
      toast.error("Failed to update")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return
    try {
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" })
      toast.success("Deleted")
      fetchInquiries()
    } catch {
      toast.error("Failed to delete")
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const unreadCount = inquiries.filter((i) => !i.isRead).length

  const tabCounts = TABS.reduce((acc, tab) => {
    if (tab === "All") {
      acc[tab] = inquiries.length
    }
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-mist-900">Inquiries</h1>
          <p className="text-sm text-mist-500">{unreadCount} unread</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeTab === tab
                ? "bg-black text-white border-black"
                : "bg-white text-mist-600 border-mist-200 hover:border-mist-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-mist-400 text-sm">No inquiries found{activeTab !== "All" ? ` for ${activeTab}` : ""}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            let extraData: Record<string, any> = {}
            try {
              if (inq.data) extraData = JSON.parse(inq.data)
            } catch {}

            return (
              <div
                key={inq.id}
                className={`bg-white border rounded-xl overflow-hidden transition-colors ${
                  inq.isRead ? "border-mist-200" : "border-black/20"
                }`}
              >
                {/* Row header */}
                <button
                  onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                  className="w-full p-5 text-left flex items-center gap-4"
                >
                  {!inq.isRead && <div className="w-2 h-2 bg-black rounded-full flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-mist-900">{inq.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          inq.category === "Car" ? "bg-orange-100 text-orange-700"
                          : inq.category === "Villa" ? "bg-blue-100 text-blue-700"
                          : inq.category === "Event" ? "bg-purple-100 text-purple-700"
                          : "bg-mist-100 text-mist-600"
                        }`}>
                          {inq.category}
                        </span>
                        <span className="text-[10px] text-mist-400">{sourceLabels[inq.source] || inq.source}</span>
                      </div>
                      <span className="text-xs text-mist-400 ml-4 flex-shrink-0">{formatDate(inq.createdAt)}</span>
                    </div>
                    <p className="text-xs text-mist-500 truncate">
                      {inq.subject || "No subject"} {inq.message ? `— ${inq.message}` : ""}
                    </p>
                  </div>
                </button>

                {/* Expanded details */}
                {expanded === inq.id && (
                  <div className="px-5 pb-5 border-t border-mist-200 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-mist-600">
                        <Mail size={14} className="text-mist-400" />
                        <span>{inq.email}</span>
                      </div>
                      {inq.phone && (
                        <div className="flex items-center gap-2 text-sm text-mist-600">
                          <Phone size={14} className="text-mist-400" />
                          <span>{inq.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-mist-600">
                        <Tag size={14} className="text-mist-400" />
                        <span>{inq.subject || "No subject"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-mist-600">
                        <Calendar size={14} className="text-mist-400" />
                        <span>{formatDate(inq.createdAt)}</span>
                      </div>
                    </div>

                    {inq.message && (
                      <div className="mb-4">
                        <p className="text-xs text-mist-400 mb-1">Message</p>
                        <p className="text-sm text-mist-700 bg-mist-50 p-3 rounded whitespace-pre-wrap">{inq.message}</p>
                      </div>
                    )}

                    {/* Extra data fields */}
                    {Object.keys(extraData).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-mist-400 mb-2">Additional Details</p>
                        <div className="bg-mist-50 p-3 rounded space-y-1">
                          {Object.entries(extraData).map(([key, val]) => (
                            val ? (
                              <div key={key} className="flex gap-2 text-sm">
                                <span className="text-mist-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                                <span className="text-mist-700">{String(val)}</span>
                              </div>
                            ) : null
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <a
                        href={`mailto:${inq.email}`}
                        className="text-xs bg-black text-white px-4 py-1.5 rounded font-medium hover:bg-mist-800 transition-colors"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => toggleRead(inq)}
                        className="text-xs text-mist-500 hover:text-mist-900 transition-colors"
                      >
                        {inq.isRead ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
