"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Registration failed")
      }

      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#dbb241] mb-2">Create Account</h1>
            <p className="text-sm text-gray-400">Join Falcon Car Rental today</p>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Full Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Confirm Password</label>
              <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#dbb241] text-black py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors disabled:opacity-50">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#dbb241] hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
