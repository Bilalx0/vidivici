"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Pencil, Camera } from "lucide-react"
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
  image: string
}

const EMPTY: ProfileForm = {
  name: "", email: "", phone: "", dateOfBirth: "", company: "",
  address: "", country: "", city: "", state: "", zipCode: "", image: "",
}

export default function PersonalInfoPage() {
  const { data: session, update } = useSession()
  const [form, setForm] = useState<ProfileForm>(EMPTY)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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
          image: data.image || "",
        })
      }
    } catch {}
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("files", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (res.ok) {
        const { urls } = await res.json()
        const imageUrl = urls[0]
        // Save image to profile immediately
        const saveRes = await fetch("/api/account/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: imageUrl }),
        })
        if (saveRes.ok) {
          setForm((prev) => ({ ...prev, image: imageUrl }))
          toast.success("Profile photo updated")
          await update()
        }
      } else {
        toast.error("Upload failed")
      }
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
    }
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6">
        {/* Avatar row — overflow top */}
        <div className="flex justify-center -mt-20 mb-6">
          <div className="relative">
            <div className="w-36 h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              {form.image ? (
                <Image src={form.image} alt="Profile" fill className="object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-500">{initials}</span>
              )}
            </div>
            {/* Edit pencil — top right of avatar */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-2 right-2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              ) : (
                <Camera size={14} className="text-gray-600" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Edit button row */}
        <div className="flex justify-end mb-6">
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
