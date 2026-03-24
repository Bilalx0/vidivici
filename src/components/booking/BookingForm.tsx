"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

interface BookingFormProps {
  car: {
    id: string
    name: string
    slug: string
    pricePerDay: number
    minRentalDays: number
    milesIncluded: number
    extraMileRate: number
  }
}

export default function BookingForm({ car }: BookingFormProps) {
  const today = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [sameDropoff, setSameDropoff] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const days = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  let discount = 0
  if (days >= 28) discount = 0.4
  else if (days >= 7) discount = 0.15

  const subtotal = car.pricePerDay * days
  const discountAmount = subtotal * discount
  const total = subtotal - discountAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { setError("Please agree to the terms"); return }
    if (days < car.minRentalDays) { setError(`Minimum rental is ${car.minRentalDays} day(s)`); return }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          startDate,
          endDate,
          pickupLocation,
          dropoffLocation: sameDropoff ? pickupLocation : dropoffLocation,
          notes,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Booking failed")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[#1a1a1a] border border-green-600/30 rounded-xl p-8 text-center">
        <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Reservation Submitted!</h3>
        <p className="text-gray-400 text-sm mb-4">We&apos;ll confirm your booking shortly via email.</p>
        <p className="text-sm text-gray-500">{car.name} &bull; {days} day(s) &bull; ${total.toLocaleString()}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-[#dbb241] mb-2">Reserve This Vehicle</h3>

      {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Start Date</label>
          <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} required
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">End Date</label>
          <input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} required
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 block mb-1">Pickup Location</label>
        <input type="text" placeholder="Address, airport, hotel..." value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required
          className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="sameDropoff" checked={sameDropoff} onChange={(e) => setSameDropoff(e.target.checked)} className="accent-[#dbb241]" />
        <label htmlFor="sameDropoff" className="text-xs text-gray-400">Same drop-off location</label>
      </div>

      {!sameDropoff && (
        <div>
          <label className="text-xs text-gray-400 block mb-1">Drop-off Location</label>
          <input type="text" placeholder="Drop-off address..." value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} required
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
        </div>
      )}

      <hr className="border-[#2a2a2a]" />

      <div>
        <label className="text-xs text-gray-400 block mb-1">Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
          className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1">Phone</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none" />
      </div>
      <div>
        <label className="text-xs text-gray-400 block mb-1">Special Requests</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any special requests..."
          className="w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-3 py-2 rounded focus:border-[#dbb241] focus:outline-none resize-none" />
      </div>

      {/* Price Summary */}
      {days > 0 && (
        <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">${car.pricePerDay}/day × {days} days</span>
            <span className="text-white">${subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Discount ({Math.round(discount * 100)}%)</span>
              <span className="text-green-400">-${discountAmount.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-[#2a2a2a]" />
          <div className="flex justify-between text-base font-semibold">
            <span className="text-[#dbb241]">Total</span>
            <span className="text-[#dbb241]">${total.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-gray-600">{car.milesIncluded} miles included • Extra miles: ${car.extraMileRate}/mile</p>
        </div>
      )}

      <div className="flex items-start gap-2">
        <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-[#dbb241] mt-0.5" />
        <label htmlFor="terms" className="text-xs text-gray-400">I agree to the rental terms and conditions</label>
      </div>

      <button
        type="submit"
        disabled={submitting || !agreed || days < 1}
        className="w-full bg-[#dbb241] text-black py-3 rounded font-semibold text-sm hover:bg-[#c9a238] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Processing..." : "Confirm Reservation"}
      </button>
    </form>
  )
}
