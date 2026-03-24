"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#dbb241] mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-400">Sign in to your Falcon Car Rental account</p>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#dbb241] text-black py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#dbb241] hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
