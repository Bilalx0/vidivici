"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export default function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = use(searchParams)
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) setError("Invalid or missing reset link. Please request a new one.")
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      setSuccess(true)
      setTimeout(() => router.push("/login"), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mist-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16 pt-24 2xl:pt-32">
        <div className="w-full max-w-[460px] 2xl:max-w-[600px]">
          <div className="bg-white rounded-2xl 2xl:rounded-3xl shadow-xl border border-mist-200 px-8 2xl:px-12 py-10 2xl:py-16 sm:px-10 sm:py-12">

            {success ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                  <CheckCircle className="text-green-500" size={36} />
                </div>
                <h1 className="text-2xl 2xl:text-3xl font-bold text-mist-900 mb-2">Password Updated!</h1>
                <p className="text-mist-500 text-sm 2xl:text-base">
                  Your password has been changed successfully. Redirecting you to sign in…
                </p>
                <Link href="/login" className="mt-4 inline-block text-sm text-mist-900 font-semibold hover:underline">
                  Sign in now
                </Link>
              </div>
            ) : !token ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                  <AlertCircle className="text-red-500" size={36} />
                </div>
                <h1 className="text-xl font-bold text-mist-900 mb-2">Invalid Link</h1>
                <p className="text-mist-500 text-sm mb-4">{error}</p>
                <Link href="/forgot-password" className="text-sm text-mist-900 font-semibold hover:underline">
                  Request a new reset link
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-7 2xl:mb-10">
                  <h1 className="text-2xl 2xl:text-4xl font-bold text-mist-900 tracking-tight">Set New Password</h1>
                  <p className="text-sm 2xl:text-lg text-mist-400 mt-1">Choose a strong password for your account</p>
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-lg mb-5">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 2xl:space-y-7">
                  <div>
                    <label className="text-sm 2xl:text-base font-medium text-mist-700 block mb-1.5 2xl:mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full border border-mist-200 text-mist-900 placeholder-mist-300 px-4 2xl:px-6 py-3 2xl:py-4 rounded-lg 2xl:rounded-xl focus:border-mist-900 focus:ring-1 focus:ring-mist-900 outline-none transition text-sm 2xl:text-base pr-11"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-300 hover:text-mist-500 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm 2xl:text-base font-medium text-mist-700 block mb-1.5 2xl:mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full border border-mist-200 text-mist-900 placeholder-mist-300 px-4 2xl:px-6 py-3 2xl:py-4 rounded-lg 2xl:rounded-xl focus:border-mist-900 focus:ring-1 focus:ring-mist-900 outline-none transition text-sm 2xl:text-base pr-11"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-300 hover:text-mist-500 transition-colors">
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-mist-900 text-white py-3 2xl:py-4 rounded-lg 2xl:rounded-xl font-semibold text-sm 2xl:text-base hover:bg-mist-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>

                <p className="text-center text-sm 2xl:text-base text-mist-400 mt-6 2xl:mt-8">
                  <Link href="/login" className="text-mist-900 font-semibold hover:underline">
                    Back to sign in
                  </Link>
                </p>
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
