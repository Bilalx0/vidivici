"use client"

import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Mail, Phone, Calendar, Tag, Trash2, Globe, Building2 } from "lucide-react"

interface PartnerInquiry {
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

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/inquiries?source=partner")
      if (!res.ok) throw new Error()
      const all = await res.json()
      setPartners(all)
    } catch {
      toast.error("Failed to load partner applications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const toggleRead = async (inq: PartnerInquiry) => {
    try {
      await fetch(`/api/inquiries/${inq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !inq.isRead }),
      })
      toast.success(inq.isRead ? "Marked as unread" : "Marked as read")
      fetchPartners()
    } catch {
      toast.error("Failed to update")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this partner application?")) return
    try {
      await fetch(`/api/inquiries/${id}`, { method: "DELETE" })
      toast.success("Deleted")
      fetchPartners()
    } catch {
      toast.error("Failed to delete")
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const unreadCount = partners.filter((i) => !i.isRead).length

  return (
    <div>
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-mist-900">Partner Applications</h1>
          <p className="text-sm text-mist-500">{partners.length} total &middot; {unreadCount} unread</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading partner applications...</div>
      ) : partners.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-mist-400 text-sm">No partner applications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {partners.map((inq) => {
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
                <button
                  onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                  className="w-full p-5 text-left flex items-center gap-4"
                >
                  {!inq.isRead && <div className="w-2 h-2 bg-black rounded-full flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-mist-900">{inq.name}</p>
                        {extraData.listingType && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                            {extraData.listingType}
                          </span>
                        )}
                        {extraData.company && (
                          <span className="text-[10px] text-mist-400 flex items-center gap-1">
                            <Building2 size={10} /> {extraData.company}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-mist-400 ml-4 flex-shrink-0">{formatDate(inq.createdAt)}</span>
                    </div>
                    <p className="text-xs text-mist-500 truncate">
                      {inq.subject || "Partner Application"} {extraData.location ? `— ${extraData.location}` : ""}
                    </p>
                  </div>
                </button>

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
                        <Calendar size={14} className="text-mist-400" />
                        <span>{formatDate(inq.createdAt)}</span>
                      </div>
                      {extraData.website && (
                        <div className="flex items-center gap-2 text-sm text-mist-600">
                          <Globe size={14} className="text-mist-400" />
                          <span>{extraData.website}</span>
                        </div>
                      )}
                    </div>

                    {inq.message && (
                      <div className="mb-4">
                        <p className="text-xs text-mist-400 mb-1">Description</p>
                        <p className="text-sm text-mist-700 bg-mist-50 p-3 rounded whitespace-pre-wrap">{inq.message}</p>
                      </div>
                    )}

                    {Object.keys(extraData).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-mist-400 mb-2">Application Details</p>
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
