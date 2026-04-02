"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Bell, X, Check } from "lucide-react"

interface DocNotification {
  userId: string
  name: string | null
  email: string
  image: string | null
  docType: string
  docLabel: string
  updatedAt: string
}

export default function AdminNotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<DocNotification[]>([])
  const [open, setOpen] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.ok ? r.json() : { notifications: [], count: 0 })
      .then((d) => setNotifications(d.notifications ?? []))
      .catch(() => {})
  }, [])

  // Poll every 30 seconds while tab is visible
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleVerify = async (n: DocNotification, status: "VERIFIED" | "REJECTED") => {
    const key = n.userId + n.docType + status
    setVerifying(key)
    await fetch(`/api/admin/customers/${n.userId}/verify-document`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docType: n.docType, status }),
    })
    setVerifying(null)
    fetchNotifications()
  }

  const count = notifications.length

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-1.5 text-mist-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-9 w-80 bg-white rounded-2xl shadow-2xl border border-mist-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-mist-100">
            <div>
              <p className="text-sm font-semibold text-mist-900">Pending Verifications</p>
              <p className="text-xs text-mist-400 mt-0.5">{count} document{count !== 1 ? "s" : ""} awaiting review</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 text-mist-400 hover:text-mist-700 rounded">
              <X size={15} />
            </button>
          </div>

          {count === 0 ? (
            <div className="py-10 text-center">
              <Check size={28} className="mx-auto text-green-400 mb-2" />
              <p className="text-sm text-mist-400">All documents verified</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-mist-100">
              {notifications.map((n) => {
                const initials = (n.name || n.email).charAt(0).toUpperCase()
                const keyBase = n.userId + n.docType
                return (
                  <div key={keyBase} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        onClick={() => { router.push(`/admin/customers/${n.userId}`); setOpen(false) }}
                        className="w-8 h-8 rounded-full bg-mist-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-mist-500 cursor-pointer hover:ring-2 hover:ring-mist-400 transition"
                      >
                        {n.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={n.image} alt={n.name || ""} className="w-full h-full object-cover" />
                        ) : initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => { router.push(`/admin/customers/${n.userId}`); setOpen(false) }}
                          className="text-sm font-medium text-mist-900 hover:underline text-left leading-tight block truncate w-full"
                        >
                          {n.name || n.email}
                        </button>
                        <p className="text-xs text-orange-500 font-medium mt-0.5">{n.docLabel} — pending review</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(n, "VERIFIED")}
                        disabled={verifying !== null}
                        className="flex-1 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold transition"
                      >
                        {verifying === keyBase + "VERIFIED" ? "Saving…" : "Verify"}
                      </button>
                      <button
                        onClick={() => handleVerify(n, "REJECTED")}
                        disabled={verifying !== null}
                        className="flex-1 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold transition"
                      >
                        {verifying === keyBase + "REJECTED" ? "Saving…" : "Reject"}
                      </button>
                      <button
                        onClick={() => { router.push(`/admin/customers/${n.userId}`); setOpen(false) }}
                        className="px-3 py-1.5 rounded-lg border border-mist-200 text-mist-600 hover:bg-mist-50 text-xs font-medium transition"
                      >
                        View
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
