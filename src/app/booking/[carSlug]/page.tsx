"use client"

import { useEffect, Suspense } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"

/**
 * Redirects /booking/[carSlug]?params → /booking?car=[carSlug]&params
 * The main reservation page at /booking handles everything.
 */
export default function CarBookingRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-mist-300 border-t-mist-900 rounded-full animate-spin" />
      </div>
    }>
      <CarBookingRedirect />
    </Suspense>
  )
}

function CarBookingRedirect() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const carSlug = params.carSlug as string

  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set("type", "car")
    sp.set("car", carSlug)
    router.replace(`/booking?${sp.toString()}`)
  }, [carSlug, searchParams, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-2 border-mist-300 border-t-mist-900 rounded-full animate-spin" />
    </div>
  )
}
