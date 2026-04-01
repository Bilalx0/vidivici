"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

interface CarOption {
  id: string
  name: string
  pricePerDay: number
  brand: { name: string }
}

export default function NewBookingPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [cars, setCars] = useState<CarOption[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    carId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: "",
    endDate: "",
    pickupLocation: "Office",
    dropoffLocation: "",
    totalPrice: "",
    status: "CONFIRMED",
    paymentStatus: "UNPAID",
    notes: "",
  })

  useEffect(() => {
    fetch("/api/cars?limit=200&all=true")
      .then((r) => r.json())
      .then((data) => setCars(data.cars || []))
      .catch(() => toast.error("Failed to load cars"))
      .finally(() => setLoading(false))
  }, [])

  // Auto-calculate price when car or dates change
  useEffect(() => {
    if (form.carId && form.startDate && form.endDate) {
      const car = cars.find((c) => c.id === form.carId)
      if (car) {
        const start = new Date(form.startDate)
        const end = new Date(form.endDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        if (days > 0) {
          setForm((prev) => ({ ...prev, totalPrice: (car.pricePerDay * days).toString() }))
        }
      }
    }
  }, [form.carId, form.startDate, form.endDate, cars])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.carId) { toast.error("Select a car"); return }
    if (!form.customerEmail) { toast.error("Email is required"); return }
    if (!form.startDate || !form.endDate) { toast.error("Dates are required"); return }

    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success("Booking created!")
        setTimeout(() => router.push("/admin/bookings"), 500)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "Failed to create booking")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none"

  if (loading) return <div><h1 className="text-2xl font-bold mb-8">Add Booking</h1><p className="text-mist-400 text-sm">Loading...</p></div>

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-8">Add Manual Booking</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Car Selection */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-mist-900 mb-4">Vehicle</h2>
          <select required value={form.carId} onChange={(e) => setForm({ ...form, carId: e.target.value })} className={inputClass}>
            <option value="">Select a car</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>{c.brand.name} {c.name} — ${c.pricePerDay}/day</option>
            ))}
          </select>
        </div>

        {/* Customer Info */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-mist-900 mb-4">Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Name</label>
              <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className={inputClass} placeholder="Customer name" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Email *</label>
              <input type="email" required value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} className={inputClass} placeholder="customer@email.com" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Phone</label>
              <input type="text" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className={inputClass} placeholder="+1-xxx-xxx-xxxx" />
            </div>
          </div>
        </div>

        {/* Dates & Locations */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-mist-900 mb-4">Rental Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Start Date *</label>
              <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">End Date *</label>
              <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Pickup Location</label>
              <input type="text" value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Dropoff Location</label>
              <input type="text" value={form.dropoffLocation} onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })} className={inputClass} placeholder="Same as pickup if empty" />
            </div>
          </div>
        </div>

        {/* Price & Status */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-mist-900 mb-4">Price & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Total Price ($)</label>
              <input type="number" step="0.01" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} className={inputClass} placeholder="Auto-calculated" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Payment</label>
              <select value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })} className={inputClass}>
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-mist-500 block mb-1">Notes</label>
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputClass} resize-none`} placeholder="Optional notes..." />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-mist-800 transition-colors disabled:opacity-50">
            {submitting ? "Creating..." : "Create Booking"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="border border-mist-200 text-mist-600 px-8 py-3 rounded hover:border-black transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
