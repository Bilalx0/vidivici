"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Pencil } from "lucide-react"
import toast from "react-hot-toast"

interface ProfileForm {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  company: string
  address: string
  country: string
  city: string
  state: string
  zipCode: string
}

const EMPTY: ProfileForm = {
  name: "", email: "", phone: "", dateOfBirth: "", company: "",
  address: "", country: "", city: "", state: "", zipCode: "",
}

export default function PersonalInfoPage() {
  const { data: session, update } = useSession()
  const [form, setForm] = useState<ProfileForm>(EMPTY)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) fetchProfile()
  }, [session])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/account/profile")
      if (res.ok) {
        const data = await res.json()
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth || "",
          company: data.company || "",
          address: data.address || "",
          country: data.country || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
        })
      }
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success("Profile updated")
        await update()
        setEditing(false)
      } else {
        toast.error("Failed to update")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const field = (id: keyof ProfileForm, disabled = false) => (
    <input
      id={id}
      type="text"
      value={form[id]}
      disabled={disabled || !editing}
      onChange={(e) => setForm({ ...form, [id]: e.target.value })}
      className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none transition border ${
        disabled || !editing
          ? "bg-gray-50 border-gray-100 text-gray-600 cursor-default"
          : "bg-white border-gray-300 text-gray-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
      }`}
    />
  )

  const initials = (form.name || form.email || "U").charAt(0).toUpperCase()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6">
        {/* Avatar row */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
              {initials}
            </div>
            {editing && (
              <button
                type="button"
                className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50"
              >
                <Pencil size={13} className="text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex-1" />
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition"
            >
              <Pencil size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setEditing(false); fetchProfile() }}
                className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* Fields Grid */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Name</label>
              {field("name")}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              {field("email", true)}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
              {field("phone")}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Date of birth</label>
              {field("dateOfBirth")}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Company</label>
              {field("company")}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Address</label>
              {field("address")}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Country</label>
              {field("country")}
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">City</label>
              {field("city")}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">State</label>
              {field("state")}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Zip code</label>
              {field("zipCode")}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
