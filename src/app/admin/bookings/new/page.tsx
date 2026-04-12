"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

interface CarOption { id: string; name: string; pricePerDay: number; brand: { name: string } }
interface VillaOption { id: string; name: string; pricePerNight: number; cleaningFee: number; securityDeposit: number }
interface EventOption { id: string; name: string; priceRange: string | null }

type BookingType = "car" | "villa" | "event"

export default function NewBookingPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [bookingType, setBookingType] = useState<BookingType>("car")
  const [cars, setCars] = useState<CarOption[]>([])
  const [villas, setVillas] = useState<VillaOption[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [loading, setLoading] = useState(true)
  const [carTaxPercent, setCarTaxPercent] = useState(9.5)
  const [villaTaxPercent, setVillaTaxPercent] = useState(14)

  const [dlFile, setDlFile] = useState<File | null>(null)
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null)
  const [passportFile, setPassportFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    carId: "", villaId: "", eventId: "",
    customerName: "", customerEmail: "", customerPhone: "",
    startDate: "", endDate: "", startTime: "", endTime: "",
    checkIn: "", checkOut: "", guests: "1",
    bookingDate: "", guestsTotal: "", budget: "", clubVenue: "",
    pickupLocation: "Office", dropoffLocation: "",
    deliveryType: "pickup", deliveryAddress: "", returnAddress: "",
    isOneWay: false, needsDriver: false, driverHours: "6", driverDays: "1",
    totalPrice: "", basePrice: "", discount: "0", deliveryFee: "0", driverCost: "0", addOnsTotal: "0", tax: "0",
    status: "PENDING", paymentStatus: "UNPAID", notes: "", adminNotes: "",
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/cars?limit=200&all=true").then(r => r.json()).then(d => setCars(d.cars || [])),
      fetch("/api/villas?limit=200").then(r => r.json()).then(d => setVillas(Array.isArray(d) ? d : d.villas || [])),
      fetch("/api/events?limit=200").then(r => r.json()).then(d => setEvents(Array.isArray(d) ? d : d.events || [])),
      fetch("/api/settings").then(r => r.ok ? r.json() : {}).then((s: any) => {
        if (s.carTaxPercent) setCarTaxPercent(parseFloat(s.carTaxPercent))
        if (s.villaTaxPercent) setVillaTaxPercent(parseFloat(s.villaTaxPercent))
      }),
    ]).catch(() => toast.error("Failed to load data")).finally(() => setLoading(false))
  }, [])

  // Auto-calculate price
  useEffect(() => {
    if (bookingType === "car" && form.carId && form.startDate && form.endDate) {
      const car = cars.find(c => c.id === form.carId)
      if (car) {
        const days = Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000)
        if (days > 0) {
          const base = car.pricePerDay * days
          const driverCost = form.needsDriver ? parseInt(form.driverHours) * parseInt(form.driverDays) * 45 : 0
          const deliveryFee = parseFloat(form.deliveryFee) || 0
          const discount = parseFloat(form.discount) || 0
          const subtotal = base - discount + driverCost + deliveryFee
          const tax = Math.round(subtotal * (carTaxPercent / 100))
          setForm(p => ({ ...p, basePrice: base.toString(), driverCost: driverCost.toString(), tax: tax.toString(), totalPrice: (subtotal + tax).toString() }))
        }
      }
    }
    if (bookingType === "villa" && form.villaId && form.checkIn && form.checkOut) {
      const villa = villas.find(v => v.id === form.villaId)
      if (villa) {
        const nights = Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
        const base = villa.pricePerNight * nights
        const subtotal = base + villa.cleaningFee
        const tax = Math.round(subtotal * (villaTaxPercent / 100))
        const total = subtotal + tax + villa.securityDeposit
        setForm(p => ({ ...p, basePrice: base.toString(), tax: tax.toString(), totalPrice: total.toString() }))
      }
    }
  }, [bookingType, form.carId, form.villaId, form.startDate, form.endDate, form.checkIn, form.checkOut, form.needsDriver, form.driverHours, form.driverDays, form.deliveryFee, form.discount, cars, villas])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerEmail) { toast.error("Email is required"); return }

    if (bookingType === "car" && (!form.carId || !form.startDate || !form.endDate)) { toast.error("Select a car and dates"); return }
    if (bookingType === "villa" && (!form.villaId || !form.checkIn || !form.checkOut)) { toast.error("Select a villa and dates"); return }
    if (bookingType === "event" && !form.bookingDate) { toast.error("Booking date is required"); return }

    setSubmitting(true)
    try {
      // Upload document files first
      const docUrls: Record<string, string> = {}
      const filesToUpload: { key: string; file: File }[] = []
      if (bookingType === "car") {
        if (dlFile) filesToUpload.push({ key: "driverLicense", file: dlFile })
        if (insuranceFile) filesToUpload.push({ key: "insurance", file: insuranceFile })
      }
      if (passportFile) filesToUpload.push({ key: "passport", file: passportFile })

      for (const { key, file } of filesToUpload) {
        const fd = new FormData()
        fd.append("files", file)
        const upRes = await fetch("/api/upload", { method: "POST", body: fd })
        if (!upRes.ok) { toast.error(`Failed to upload ${key}`); setSubmitting(false); return }
        const upData = await upRes.json()
        if (upData.urls?.[0]) docUrls[key] = upData.urls[0]
      }

      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: bookingType, docUrls }),
      })
      if (res.ok) {
        toast.success("Booking created!")
        setTimeout(() => router.push("/admin/bookings"), 500)
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || "Failed to create booking")
      }
    } catch { toast.error("An error occurred") } finally { setSubmitting(false) }
  }

  const inp = "w-full bg-white border border-mist-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none"

  if (loading) return <div><h1 className="text-2xl font-bold mb-8">Add Booking</h1><p className="text-mist-400 text-sm">Loading...</p></div>

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-8">Add Manual Booking</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Booking Type Selector */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-mist-900 mb-4">Booking Type</h2>
          <div className="flex gap-3">
            {(["car", "villa", "event"] as BookingType[]).map(t => (
              <button key={t} type="button" onClick={() => setBookingType(t)}
                className={`px-5 py-2.5 rounded text-sm font-medium transition-colors ${bookingType === t ? "bg-black text-white" : "bg-mist-100 text-mist-600 hover:bg-mist-200"}`}>
                {t === "car" ? "Car" : t === "villa" ? "Villa" : "Event"}
              </button>
            ))}
          </div>
        </div>

        {/* Item Selection */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-mist-900 mb-4">
            {bookingType === "car" ? "Vehicle" : bookingType === "villa" ? "Villa" : "Event"}
          </h2>
          {bookingType === "car" && (
            <select required value={form.carId} onChange={e => setForm({ ...form, carId: e.target.value })} className={inp}>
              <option value="">Select a car</option>
              {cars.map(c => <option key={c.id} value={c.id}>{c.brand.name} {c.name} — ${c.pricePerDay}/day</option>)}
            </select>
          )}
          {bookingType === "villa" && (
            <select required value={form.villaId} onChange={e => setForm({ ...form, villaId: e.target.value })} className={inp}>
              <option value="">Select a villa</option>
              {villas.map(v => <option key={v.id} value={v.id}>{v.name} — ${v.pricePerNight}/night</option>)}
            </select>
          )}
          {bookingType === "event" && (
            <select value={form.eventId} onChange={e => setForm({ ...form, eventId: e.target.value })} className={inp}>
              <option value="">Select an event (optional)</option>
              {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
            </select>
          )}
        </div>

        {/* Customer Info */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-mist-900 mb-4">Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="text-xs text-mist-500 block mb-1">Name</label>
              <input type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} className={inp} placeholder="Customer name" /></div>
            <div><label className="text-xs text-mist-500 block mb-1">Email *</label>
              <input type="email" required value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} className={inp} placeholder="customer@email.com" /></div>
            <div><label className="text-xs text-mist-500 block mb-1">Phone</label>
              <input type="text" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} className={inp} placeholder="+971 50 123 4567" /></div>
          </div>
        </div>

        {/* Dates & Details - Car */}
        {bookingType === "car" && (
          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-mist-900 mb-4">Rental Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs text-mist-500 block mb-1">Start Date *</label>
                <input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">End Date *</label>
                <input type="date" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Start Time</label>
                <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">End Time</label>
                <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Pickup Location</label>
                <input type="text" value={form.pickupLocation} onChange={e => setForm({ ...form, pickupLocation: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Dropoff Location</label>
                <input type="text" value={form.dropoffLocation} onChange={e => setForm({ ...form, dropoffLocation: e.target.value })} className={inp} placeholder="Same as pickup if empty" /></div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs text-mist-500 block mb-1">Delivery Address</label>
                <input type="text" value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Return Address</label>
                <input type="text" value={form.returnAddress} onChange={e => setForm({ ...form, returnAddress: e.target.value })} className={inp} /></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-mist-700"><input type="checkbox" checked={form.isOneWay} onChange={e => setForm({ ...form, isOneWay: e.target.checked })} /> One-way rental</label>
              <label className="flex items-center gap-2 text-sm text-mist-700"><input type="checkbox" checked={form.needsDriver} onChange={e => setForm({ ...form, needsDriver: e.target.checked })} /> Driver Required</label>
            </div>
            {form.needsDriver && (
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div><label className="text-xs text-mist-500 block mb-1">Driver Hours/Day</label>
                  <input type="number" value={form.driverHours} onChange={e => setForm({ ...form, driverHours: e.target.value })} className={inp} /></div>
                <div><label className="text-xs text-mist-500 block mb-1">Driver Days</label>
                  <input type="number" value={form.driverDays} onChange={e => setForm({ ...form, driverDays: e.target.value })} className={inp} /></div>
              </div>
            )}
          </div>
        )}

        {/* Dates - Villa */}
        {bookingType === "villa" && (
          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-mist-900 mb-4">Stay Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-xs text-mist-500 block mb-1">Check-in *</label>
                <input type="date" required value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Check-out *</label>
                <input type="date" required value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Guests</label>
                <input type="number" min="1" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className={inp} /></div>
            </div>
          </div>
        )}

        {/* Details - Event */}
        {bookingType === "event" && (
          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-mist-900 mb-4">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs text-mist-500 block mb-1">Booking Date *</label>
                <input type="date" required value={form.bookingDate} onChange={e => setForm({ ...form, bookingDate: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Guest Count</label>
                <input type="text" value={form.guestsTotal} onChange={e => setForm({ ...form, guestsTotal: e.target.value })} className={inp} placeholder="e.g. 50-100" /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Budget</label>
                <input type="text" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className={inp} placeholder="e.g. $5,000" /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Club/Venue</label>
                <input type="text" value={form.clubVenue} onChange={e => setForm({ ...form, clubVenue: e.target.value })} className={inp} /></div>
            </div>
          </div>
        )}

        {/* Customer Documents */}
        {bookingType !== "event" && (
          <div className="bg-white border border-mist-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-mist-900 mb-4">Customer Documents</h2>
            <div className={`grid gap-4 ${bookingType === "car" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-1 max-w-sm"}`}>
              {bookingType === "car" && (
                <>
                  <div>
                    <label className="text-xs text-mist-500 block mb-1">Driver&apos;s License</label>
                    <input type="file" accept="image/*,.pdf" onChange={e => setDlFile(e.target.files?.[0] || null)}
                      className="w-full text-transparent text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-mist-100 file:text-mist-700 hover:file:bg-mist-200" />
                  </div>
                  <div>
                    <label className="text-xs text-mist-500 block mb-1">Insurance Policy</label>
                    <input type="file" accept="image/*,.pdf" onChange={e => setInsuranceFile(e.target.files?.[0] || null)}
                      className="w-full text-transparent text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-mist-100 file:text-mist-700 hover:file:bg-mist-200" />
                  </div>
                </>
              )}
              <div>
                <label className="text-xs text-mist-500 block mb-1">Passport / ID</label>
                <input type="file" accept="image/*,.pdf" onChange={e => setPassportFile(e.target.files?.[0] || null)}
                  className="w-full text-transparent text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-mist-100 file:text-mist-700 hover:file:bg-mist-200" />
              </div>
            </div>
            <p className="text-xs text-mist-400 mt-3">Uploaded documents will be attached to the customer&apos;s profile for verification.</p>
          </div>
        )}

        {/* Price & Status */}
        <div className="bg-white border border-mist-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-mist-900 mb-4">Price & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="text-xs text-mist-500 block mb-1">Total Price ($)</label>
              <input type="number" step="0.01" value={form.totalPrice} onChange={e => setForm({ ...form, totalPrice: e.target.value })} className={inp} placeholder="Auto-calculated" /></div>
            <div><label className="text-xs text-mist-500 block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                <option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option><option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
              </select></div>
            <div><label className="text-xs text-mist-500 block mb-1">Payment</label>
              <select value={form.paymentStatus} onChange={e => setForm({ ...form, paymentStatus: e.target.value })} className={inp}>
                <option value="UNPAID">Unpaid</option><option value="PAID">Paid</option><option value="REFUNDED">Refunded</option>
              </select></div>
          </div>
          {bookingType === "car" && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="text-xs text-mist-500 block mb-1">Base Price</label>
                <input type="number" step="0.01" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} className={inp} readOnly /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Discount</label>
                <input type="number" step="0.01" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Delivery Fee</label>
                <input type="number" step="0.01" value={form.deliveryFee} onChange={e => setForm({ ...form, deliveryFee: e.target.value })} className={inp} /></div>
              <div><label className="text-xs text-mist-500 block mb-1">Tax</label>
                <input type="number" step="0.01" value={form.tax} onChange={e => setForm({ ...form, tax: e.target.value })} className={inp} readOnly /></div>
            </div>
          )}
          <div className="mt-4">
            <label className="text-xs text-mist-500 block mb-1">Customer Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={`${inp} resize-none`} placeholder="Customer notes..." />
          </div>
          <div className="mt-3">
            <label className="text-xs text-mist-500 block mb-1">Admin Notes</label>
            <textarea rows={2} value={form.adminNotes} onChange={e => setForm({ ...form, adminNotes: e.target.value })} className={`${inp} resize-none`} placeholder="Internal notes..." />
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
