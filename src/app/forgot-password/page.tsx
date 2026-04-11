"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      setSent(true)
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

            {sent ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                  <CheckCircle className="text-green-500" size={36} />
                </div>
                <h1 className="text-2xl 2xl:text-3xl font-bold text-mist-900 mb-2">Check your email</h1>
                <p className="text-mist-500 text-sm 2xl:text-base mb-6">
                  If an account exists for <strong>{email}</strong>, we've sent a password reset link. It expires in 1 hour.
                </p>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-mist-600 hover:text-mist-900 transition-colors">
                  <ArrowLeft size={16} />
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-7 2xl:mb-10">
                  <h1 className="text-2xl 2xl:text-4xl font-bold text-mist-900 tracking-tight">Forgot Password?</h1>
                  <p className="text-sm 2xl:text-lg text-mist-400 mt-1">We'll send you a reset link</p>
                </div>

                {error && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-lg mb-5">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 2xl:space-y-7">
                  <div>
                    <label className="text-sm 2xl:text-base font-medium text-mist-700 block mb-1.5 2xl:mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your account email"
                        className="w-full border border-mist-200 text-mist-900 placeholder-mist-300 px-4 2xl:px-6 py-3 2xl:py-4 rounded-lg 2xl:rounded-xl focus:border-mist-900 focus:ring-1 focus:ring-mist-900 outline-none transition text-sm 2xl:text-base pl-11"
                      />
                      <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-300" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-mist-900 text-white py-3 2xl:py-4 rounded-lg 2xl:rounded-xl font-semibold text-sm 2xl:text-base hover:bg-mist-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                <p className="text-center text-sm 2xl:text-base text-mist-400 mt-6 2xl:mt-8">
                  Remember your password?{" "}
                  <Link href="/login" className="text-mist-900 font-semibold hover:underline">
                    Sign in
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
