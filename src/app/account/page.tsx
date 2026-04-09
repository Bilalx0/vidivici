"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import { Pencil, Camera } from "lucide-react"
import toast from "react-hot-toast"

interface ProfileForm {
  name: string
  email: string
  phone: string
  dobMonth: string
  dobDay: string
  dobYear: string
  company: string
  address: string
  country: string
  city: string
  state: string
  zipCode: string
  image: string
  noMarketing: boolean
}

const EMPTY: ProfileForm = {
  name: "", email: "", phone: "",
  dobMonth: "", dobDay: "", dobYear: "",
  company: "", address: "", country: "",
  city: "", state: "", zipCode: "", image: "",
  noMarketing: false,
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1))
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => String(currentYear - i))

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
        // Parse legacy dateOfBirth string if needed
        let dobMonth = "", dobDay = "", dobYear = ""
        if (data.dateOfBirth) {
          const parts = data.dateOfBirth.split(/[\/\-,\s]+/)
          if (parts.length >= 3) {
            dobMonth = parts[0]; dobDay = parts[1]; dobYear = parts[2]
          }
        }
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          dobMonth, dobDay, dobYear,
          company: data.company || "",
          address: data.address || "",
          country: data.country || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          image: data.image || "",
          noMarketing: data.noMarketing || false,
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
      const dateOfBirth = [form.dobMonth, form.dobDay, form.dobYear].filter(Boolean).join("/")
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dateOfBirth }),
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

  const set = (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const inputCls = (disabled = false) =>
    `w-full px-3 py-2.5 2xl:px-6 2xl:py-5 rounded-lg 2xl:rounded-xl text-sm 2xl:text-xl border outline-none transition-colors placeholder:text-mist-400 ${
      disabled || !editing
        ? "bg-mist-50 border-mist-200 text-mist-700 cursor-default"
        : "bg-white border-mist-300 text-mist-900 focus:border-mist-500 focus:ring-1 focus:ring-mist-400"
    }`

  const selectCls = () =>
    `px-2 2xl:px-4 py-2.5 2xl:py-5 rounded-lg 2xl:rounded-xl text-sm 2xl:text-xl border outline-none transition-colors bg-white appearance-none cursor-pointer ${
      !editing
        ? "bg-mist-50 border-mist-200 text-mist-700 cursor-default pointer-events-none"
        : "border-mist-300 text-mist-900 focus:border-mist-500 focus:ring-1 focus:ring-mist-400"
    }`

  const initials = (form.name || form.email || "U").charAt(0).toUpperCase()

  return (
    <div className="overflow-hidden">

      {/* ── Heading ─────────────────────────────────────────── */}
      <div className="px-6 sm:px-8 py-14 2xl:py-20 border-b-2 border-mist-300 font-medium flex items-center justify-between">
        <h1 className="text-4xl 2xl:text-6xl font-bold text-mist-900">Personal Information</h1>
      </div>

      {/* Avatar — sits between header and card */}
      <div className="flex justify-start px-7 sm:px-10 lg:px-24 2xl:px-40">
        <div className="relative -mb-20 2xl:-mb-32 mt-8 z-10">
          <div className="w-28 2xl:w-40 h-28 2xl:h-40 rounded-full border-4 2xl:border-6 border-white shadow-md overflow-hidden bg-mist-200 flex items-center justify-center">
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="Profile" loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl 2xl:text-5xl font-bold text-mist-400">{initials}</span>
            )}
          </div>

          {/* Camera button — top-right of avatar, shown when editing */}
          {editing && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -top-1 -right-1 w-8 2xl:w-10 h-8 2xl:h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-md transition disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Camera size={14} className="text-white 2xl:w-5 2xl:h-5" />
              )}
            </button>
          )}

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>
      </div>

      {/* Card */}
      <div className="mx-7 sm:mx-10 lg:mx-16 2xl:mx-32 my-10 2xl:my-16 rounded-2xl 2xl:rounded-3xl bg-white shadow-xl pt-20 2xl:pt-32 pb-10 2xl:pb-16 px-6 sm:px-8 2xl:px-12 relative">

        {/* Edit pencil — top right of card */}
        <div className="absolute top-5 2xl:top-8 right-6 2xl:right-10">
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="w-9 2xl:w-11 h-9 2xl:h-11 rounded-lg 2xl:rounded-xl border border-mist-200 flex items-center justify-center text-mist-500 hover:border-mist-400 hover:text-mist-800 transition"
            >
              <Pencil size={15} className="2xl:w-5 2xl:h-5" />
            </button>
          ) : (
            <button
              type="button"
              className="w-9 2xl:w-11 h-9 2xl:h-11 rounded-lg 2xl:rounded-xl border border-mist-200 flex items-center justify-center text-mist-500 hover:border-mist-400 hover:text-mist-800 transition"
              onClick={() => { setEditing(false); fetchProfile() }}
            >
              <Pencil size={15} className="2xl:w-5 2xl:h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 2xl:space-y-6">

            {/* Row 1: Name / Email / Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-6">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  disabled={!editing}
                  onChange={set("name")}
                  className={inputCls()}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  disabled
                  className={inputCls(true)}
                />
              </div>
              {/* Phone with flag */}
              <div className="flex items-center border rounded-lg 2xl:rounded-xl overflow-hidden transition-colors
                bg-white border-mist-300 focus-within:border-mist-500 focus-within:ring-1 focus-within:ring-mist-400
                disabled:bg-mist-50">
                <div className="flex items-center gap-1 px-3 2xl:px-5 border-r border-mist-200 shrink-0">
                  <span className="text-base 2xl:text-2xl">🇺🇸</span>
                  <svg className="w-3 2xl:w-5 h-3 2xl:h-5 text-mist-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  disabled={!editing}
                  onChange={set("phone")}
                  className="flex-1 px-3 2xl:px-5 py-2.5 2xl:py-5 text-sm 2xl:text-xl outline-none bg-transparent text-mist-900 placeholder:text-mist-400 disabled:cursor-default disabled:bg-mist-50"
                />
              </div>
            </div>

            {/* Row 2: Date of Birth / Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* DOB with 3 dropdowns */}
              <div className="">
                <p className="text-xs text-mist-500 mb-1">Date of birth</p>
                <div className="flex gap-2">
                  <select value={form.dobMonth} onChange={set("dobMonth")} disabled={!editing} className={`${selectCls()} flex-1`}>
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
                  </select>
                  <select value={form.dobDay} onChange={set("dobDay")} disabled={!editing} className={`${selectCls()} w-20`}>
                    <option value="">Day</option>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={form.dobYear} onChange={set("dobYear")} disabled={!editing} className={`${selectCls()} w-24`}>
                    <option value="">Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Company"
                  value={form.company}
                  disabled={!editing}
                  onChange={set("company")}
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Row 3: Address / Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Address" value={form.address} disabled={!editing} onChange={set("address")} className={inputCls()} />
              <input type="text" placeholder="Country" value={form.country} disabled={!editing} onChange={set("country")} className={inputCls()} />
            </div>

            {/* Row 4: City / State / Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="text" placeholder="City" value={form.city} disabled={!editing} onChange={set("city")} className={inputCls()} />
              <input type="text" placeholder="State" value={form.state} disabled={!editing} onChange={set("state")} className={inputCls()} />
              <input type="text" placeholder="Zip code" value={form.zipCode} disabled={!editing} onChange={set("zipCode")} className={inputCls()} />
            </div>

            {/* Marketing checkbox + action buttons */}
            {editing && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-mist-600">
                  <input
                    type="checkbox"
                    checked={form.noMarketing}
                    onChange={(e) => setForm((f) => ({ ...f, noMarketing: e.target.checked }))}
                    className="w-4 h-4 rounded border-mist-300 accent-mist-700"
                  />
                  Don&apos;t send me special offers &amp; marketing promotions
                </label>

                <div className="flex gap-2 2xl:gap-4 ml-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 2xl:px-10 py-2 2xl:py-4 bg-mist-700 hover:bg-mist-800 text-white rounded-lg 2xl:rounded-xl text-sm 2xl:text-xl font-semibold transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); fetchProfile() }}
                    className="px-5 2xl:px-8 py-2 2xl:py-4 border border-mist-300 text-mist-700 rounded-lg 2xl:rounded-xl text-sm 2xl:text-xl font-medium hover:border-mist-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}