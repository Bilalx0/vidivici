"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/layout/AdminSidebar"
import { Toaster } from "react-hot-toast"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "vidivici2024"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_auth")
    if (stored === "true") setAuthenticated(true)
    setChecking(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true")
      setAuthenticated(true)
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-mist-300 border-t-mist-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center px-4">
        <div className="bg-white border border-mist-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
          <h1 className="text-2xl font-bold text-mist-900 text-center mb-1">VIDIVICI</h1>
          <p className="text-sm text-mist-400 text-center mb-8">Admin Dashboard</p>

          {error && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 p-2 rounded">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-mist-200 rounded-lg px-4 py-2.5 text-sm focus:border-black focus:outline-none"
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-mist-200 rounded-lg px-4 py-2.5 text-sm focus:border-black focus:outline-none"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-mist-800 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-mist-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-14 sm:p-6 sm:pt-6 lg:p-10">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
