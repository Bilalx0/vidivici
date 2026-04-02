"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Turnstile from "@/components/Turnstile"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (turnstileToken) {
      const verify = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      })
      if (!verify.ok) {
        setError("Bot verification failed. Please try again.")
        setLoading(false)
        return
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else {
      router.push("/account")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-mist-100 flex flex-col">

      {/* ── Page body ─────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 pt-24 2xl:pt-32">
        <div className="w-full max-w-[460px] 2xl:max-w-[600px]">
          <div className="bg-white rounded-2xl 2xl:rounded-3xl shadow-xl border border-mist-200 px-8 2xl:px-12 py-10 2xl:py-16 sm:px-10 sm:py-12">

            {/* Heading */}
            <div className="mb-7 2xl:mb-10">
              <h1 className="text-2xl 2xl:text-4xl font-bold text-mist-900 tracking-tight">Welcome Back</h1>
              <p className="text-sm 2xl:text-lg text-mist-400 mt-1">Log in to your Vidi Vici account</p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm 2xl:text-base bg-red-50 border border-red-100 px-4 2xl:px-6 py-3 2xl:py-4 rounded-lg 2xl:rounded-xl mb-5 2xl:mb-8">
                {error}
              </p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 2xl:space-y-7">

              {/* Email */}
              <div>
                <label className="text-sm 2xl:text-base font-medium text-mist-700 block mb-1.5 2xl:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-mist-200 text-mist-900 placeholder-mist-300 px-4 2xl:px-6 py-3 2xl:py-4 rounded-lg 2xl:rounded-xl focus:border-mist-900 focus:ring-1 focus:ring-mist-900 outline-none transition text-sm 2xl:text-base"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm 2xl:text-base font-medium text-mist-700 block mb-1.5 2xl:mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border border-mist-200 text-mist-900 placeholder-mist-300 px-4 2xl:px-6 py-3 2xl:py-4 rounded-lg 2xl:rounded-xl focus:border-mist-900 focus:ring-1 focus:ring-mist-900 outline-none transition text-sm 2xl:text-base pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-300 hover:text-mist-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} className="2xl:w-5 2xl:h-5" /> : <Eye size={18} className="2xl:w-5 2xl:h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 border-mist-300 rounded text-mist-900 focus:ring-mist-900 accent-mist-900"
                  />
                  <span className="text-sm 2xl:text-base text-mist-500">Remember me</span>
                </label>
                <span className="text-sm 2xl:text-base text-mist-400 cursor-pointer hover:text-mist-700 transition-colors">
                  Forget password
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-mist-900 text-white py-3 2xl:py-4 rounded-lg 2xl:rounded-xl font-semibold text-sm 2xl:text-base hover:bg-mist-800 transition-colors disabled:opacity-50 mt-1 2xl:mt-3"
              >
                {loading ? "Signing in..." : "Sign Up"}
              </button>

              <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6 2xl:my-8">
              <div className="flex-1 h-px bg-mist-100" />
              <span className="text-xs 2xl:text-sm text-mist-400">Or continue with</span>
              <div className="flex-1 h-px bg-mist-100" />
            </div>

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-2.5 border border-mist-200 bg-mist-50 rounded-lg 2xl:rounded-xl py-3 2xl:py-4 text-sm 2xl:text-base text-mist-600 hover:bg-mist-100 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" className="2xl:w-5 2xl:h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with google
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm 2xl:text-base text-mist-400 mt-6 2xl:mt-8">
              Already have an account?{" "}
              <Link href="/register" className="text-mist-900 font-semibold hover:underline">
                Sign up
              </Link>
            </p>

          </div>
        </div>
      </main>

    </div>
  )
}