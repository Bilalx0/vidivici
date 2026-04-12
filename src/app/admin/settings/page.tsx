"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    siteName: "VIDIVICI",
    contactEmail: "info@vidivici.com",
    phone: "+1-310-887-7005",
    address: "499 N Canon Dr, Beverly Hills, CA 90210",
    hoursWeekday: "8:00 AM - 8:00 PM",
    hoursWeekend: "8:00 AM - 6:00 PM",
    instagram: "vidivici_lifestyle",
    facebook: "vidivici",
    youtube: "",
    twitter: "",
    carTaxPercent: "9.5",
    villaTaxPercent: "14",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setForm((prev) => ({ ...prev, ...data }))
      } catch {
        // Keep defaults if settings not found
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Settings saved successfully")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-mist-900 mb-8">Site Settings</h1>
        <div className="text-center py-12 text-mist-500">Loading settings...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-mist-900 mb-8">Site Settings</h1>

      <form className="max-w-3xl space-y-8">
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-mist-900 mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Site Name</label>
              <input type="text" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-mist-500 block mb-1">Contact Email</label>
                <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-mist-500 block mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-mist-500 block mb-1">Weekday Hours</label>
                <input type="text" value={form.hoursWeekday} onChange={(e) => setForm({ ...form, hoursWeekday: e.target.value })}
                  className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-mist-500 block mb-1">Weekend Hours</label>
                <input type="text" value={form.hoursWeekend} onChange={(e) => setForm({ ...form, hoursWeekend: e.target.value })}
                  className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-mist-900 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Instagram</label>
              <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Facebook</label>
              <input type="text" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">YouTube</label>
              <input type="text" value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Twitter</label>
              <input type="text" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-mist-900 mb-4">Tax Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Car Tax Rate (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={form.carTaxPercent} onChange={(e) => setForm({ ...form, carTaxPercent: e.target.value })}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Villa Tax Rate (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={form.villaTaxPercent} onChange={(e) => setForm({ ...form, villaTaxPercent: e.target.value })}
                className="w-full bg-mist-50 border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
          </div>
        </div>

        <button type="button" onClick={handleSave} disabled={saving} className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-mist-800 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  )
}
