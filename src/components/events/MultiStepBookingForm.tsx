"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Phone, Mail, MapPin, Clock, ChevronDown } from "lucide-react"
import Turnstile from "@/components/Turnstile"

const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
]

const ADD_ONS = ["Chauffeur / Party Bus", "Security / Bodyguard"]

type BookingForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  clubVenue: string
  eventType: string
  bookingDate: string
  guestsTotal: string
  budget: string
  addOns: string[]
  specialRequests: string
}

const defaultForm: BookingForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  clubVenue: "",
  eventType: "",
  bookingDate: "",
  guestsTotal: "",
  budget: "",
  addOns: [],
  specialRequests: "",
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Info", step: 1 },
    { label: "Pay", step: 2 },
    { label: "Done", step: 3 },
  ]

  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto my-12 2xl:my-14">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 2xl:w-5 h-3 2xl:h-5 rounded-full border-2 transition-colors ${
                currentStep >= s.step
                  ? "bg-blue-500 border-blue-500"
                  : "bg-gray-200 border-gray-300"
              }`}
            />
            <span
              className={`text-xs 2xl:text-lg font-medium mt-2 ${
                currentStep >= s.step ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 mx-2 mb-5 2xl:mb-7">
              <div
                className={`h-0.5 w-full ${
                  currentStep > s.step
                    ? "bg-blue-500"
                    : currentStep === s.step
                    ? "bg-blue-500 opacity-50"
                    : "bg-gray-200"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function switchTemporalInputType(input: HTMLInputElement, kind: "date" | "time") {
  if (input.type !== "text") return
  const isIOS =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

  const lockedWidth = Math.ceil(input.getBoundingClientRect().width)
  if (isIOS && lockedWidth > 0) {
    input.style.width = `${lockedWidth}px`
    input.style.minWidth = `${lockedWidth}px`
    input.style.maxWidth = `${lockedWidth}px`
    input.style.fontSize = "16px"
  }

  input.type = kind
  requestAnimationFrame(() => {
    input.focus()
    if (
      typeof (input as HTMLInputElement & { showPicker?: () => void }).showPicker ===
      "function"
    ) {
      try {
        ;(input as HTMLInputElement & { showPicker: () => void }).showPicker()
      } catch {
        // Fallback
      }
    }
    if (isIOS) {
      requestAnimationFrame(() => {
        input.style.width = "100%"
        input.style.minWidth = "0"
        input.style.maxWidth = "100%"
        input.style.fontSize = "16px"
      })
    }
  })
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 2xl:gap-4">
      <label className="text-xs 2xl:text-xl font-semibold text-mist-700 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

function ContactInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 2xl:gap-6">
      <div className="w-8 h-8 2xl:w-12 2xl:h-12 rounded-md bg-white flex items-center justify-center text-mist-600 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm 2xl:text-xl font-bold text-mist-900">{label}</p>
        <p className="text-sm 2xl:text-lg text-mist-600 leading-relaxed">{value}</p>
      </div>
    </div>
  )
}

function EventPayPalButton({
  bookingData,
  onSuccess,
  onError,
}: {
  bookingData: Record<string, any>
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const [processing, setProcessing] = useState(false)
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId)
    return (
      <p className="text-red-400 text-sm text-center">
        PayPal is not configured.
      </p>
    )

  return (
    <PayPalScriptProvider
      options={{ clientId, currency: "USD", intent: "capture" }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
        }}
        disabled={processing}
        createOrder={async () => {
          setProcessing(true)
          try {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                totalPrice: 100,
                currency: "USD",
                bookingRef: "event",
                intent: "CAPTURE",
              }),
            })
            const data = await res.json()
            if (!res.ok)
              throw new Error(data.error || "Failed to create order")
            return data.orderId
          } catch (err: any) {
            setProcessing(false)
            onError(err.message)
            throw err
          }
        }}
        onApprove={async (data) => {
          try {
            const res = await fetch("/api/paypal/capture-event", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderID,
                bookingData,
              }),
            })
            const result = await res.json()
            if (!res.ok)
              throw new Error(result.error || "Payment failed")
            onSuccess()
          } catch (err: any) {
            onError(err.message)
          } finally {
            setProcessing(false)
          }
        }}
        onError={(err) => {
          setProcessing(false)
          onError(String(err))
        }}
        onCancel={() => setProcessing(false)}
      />
    </PayPalScriptProvider>
  )
}

interface MultiStepBookingFormProps {
  venueOptions?: string[]
  eventTypeOptions?: string[]
  venueName?: string
  eventName?: string
}

export default function MultiStepBookingForm({
  venueOptions,
  eventTypeOptions,
  venueName,
  eventName,
}: MultiStepBookingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BookingForm>(() => {
    const initial = { ...defaultForm }
    if (venueName) initial.clubVenue = venueName
    if (eventName) initial.eventType = eventName
    return initial
  })
  const [paymentError, setPaymentError] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")

  // New payment UI state (UI only — does not affect existing PayPal logic)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("paypal")
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardBillingAddress, setCardBillingAddress] = useState("")
  const [cardCountry, setCardCountry] = useState("")
  const [cardZip, setCardZip] = useState("")
  const [placingOrder, setPlacingOrder] = useState(false)
  const [cardError, setCardError] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState("")
  const [couponError, setCouponError] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)

  const VENUES = venueOptions || [
    "Delilah Los Angeles",
    "Catch LA Rooftop",
    "The Highlight Room",
    "Trinity Ballroom",
  ]

  const EVENT_TYPES = eventTypeOptions || [
    "Birthday Party",
    "Corporate Event",
    "Wedding Reception",
    "Private Dinner",
    "Album Release",
    "Networking Event",
    "Other",
  ]

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("vipBookingData")
      if (raw) {
        const data = JSON.parse(raw)
        setForm((prev) => ({
          ...prev,
          ...data,
          addOns: Array.isArray(data.addOns)
            ? data.addOns
            : typeof data.addOns === "string" && data.addOns
            ? data.addOns.split(", ").filter(Boolean)
            : [],
        }))
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true)
  }, [])

  const inputClass =
    "w-full border border-mist-300 rounded-xl 2xl:rounded-2xl px-4 2xl:px-6 py-3 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 focus:outline-none focus:border-mist-400 transition-colors duration-200 bg-white"

  const isFormValid =
    form.firstName && form.email && form.bookingDate && form.clubVenue

  const toggleAddOn = (addon: string) => {
    setForm((f) => ({
      ...f,
      addOns: f.addOns.includes(addon)
        ? f.addOns.filter((a) => a !== addon)
        : [...f.addOns, addon],
    }))
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    sessionStorage.setItem("vipBookingData", JSON.stringify({ ...form, turnstileToken }))
    setStep(2)
  }

  // Unchanged: called by both PayPal onSuccess and card Place Order
  const handlePaymentSuccess = () => {
    sessionStorage.removeItem("vipBookingData")
    setStep(3)
  }

  // Card validation + order placement (UI only; wire up your own API if needed)
  const handlePlaceOrder = async () => {
    setCardError("")
    if (!cardName.trim()) { setCardError("Please enter the name on your card."); return }
    const digits = cardNumber.replace(/\s/g, "")
    if (digits.length < 13) { setCardError("Please enter a valid card number."); return }
    if (cardExpiry.length < 5) { setCardError("Please enter a valid expiration date."); return }
    if (cardCvv.length < 3) { setCardError("Please enter your security code."); return }
    setPlacingOrder(true)
    try {
      // Wire up your card API here. On success call handlePaymentSuccess().
      handlePaymentSuccess()
    } catch (err: any) {
      setCardError(err.message || "Something went wrong. Please try again.")
    } finally {
      setPlacingOrder(false)
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError("")
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), scope: "event" }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setCouponError(data.error || "Invalid coupon code")
        setCouponDiscount(0)
        setCouponApplied("")
        return
      }
      setCouponDiscount(data.discountPercent)
      setCouponApplied(data.code)
      setCouponError("")
    } catch {
      setCouponError("Failed to validate coupon")
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setCouponCode("")
    setCouponDiscount(0)
    setCouponApplied("")
    setCouponError("")
  }

  if (!loaded) {
    return (
      <section className="w-full bg-white py-12 2xl:py-24 sm:px-16 lg:px-20 2xl:px-32 px-6" id="booking-form">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-mist-300 border-t-mist-900 rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  // Booking data passed to PayPal (unchanged)
  const paypalBookingData = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone,
    clubVenue: form.clubVenue,
    eventType: form.eventType,
    bookingDate: form.bookingDate,
    guestsTotal: form.guestsTotal,
    budget: form.budget,
    addOns: form.addOns.join(", "),
    specialRequests: form.specialRequests,
  }

  return (
    <section className="w-full bg-white py-12 2xl:py-24 sm:px-16 lg:px-20 2xl:px-32 px-6" id="booking-form">
      <div className="border border-mist-200 rounded-3xl 2xl:rounded-[40px] overflow-hidden gap-8 2xl:gap-14 sm:p-8 2xl:sm:p-14 px-4 py-6 2xl:px-8 2xl:py-10 flex flex-col md:flex-row shadow-sm">

        {/* Right Panel - Multi-step Form */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl 2xl:text-6xl text-center font-bold text-mist-900 mb-10 2xl:mb-16 mt-5 2xl:mt-10  tracking-tight">
            VIP Venue Booking
          </h2>

          <StepIndicator currentStep={step} />


          {/* Step 1: Info — completely unchanged */}
          {step === 1 && (
            <form onSubmit={handleInfoSubmit} className="flex flex-col gap-6 2xl:gap-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="First Name">
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Email Address">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="Phone Number">
                  <div className="flex items-center border border-mist-300 rounded-xl 2xl:rounded-2xl overflow-hidden focus-within:border-mist-400 transition-colors duration-200 bg-white">
                    <span className="px-4 2xl:px-6 py-3 2xl:py-5 text-sm 2xl:text-3xl border-r border-mist-300 bg-mist-50 flex items-center gap-2 text-mist-600 flex-shrink-0">
                      <svg viewBox="0 0 30 20" className="w-5 h-3.5 2xl:w-7 2xl:h-5 shrink-0 rounded-[2px]" aria-hidden="true"><rect width="30" height="20" fill="#B22234"/><path d="M0,2.31H30M0,5.39H30M0,8.46H30M0,11.54H30M0,14.62H30M0,17.69H30" stroke="#fff" strokeWidth="1.54"/><rect width="12" height="10.77" fill="#3C3B6E"/></svg>
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="flex-1 px-4 2xl:px-6 py-3 2xl:py-5 text-sm 2xl:text-xl text-mist-900 placeholder-mist-400 outline-none bg-white"
                    />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Selected Venue">
                  <div className="relative">
                    <select
                      value={form.clubVenue}
                      onChange={(e) => setForm({ ...form, clubVenue: e.target.value })}
                      className={`${inputClass} appearance-none cursor-pointer pr-12`}
                      required
                    >
                      <option value="" disabled>Choose a venue</option>
                      {VENUES.map((venue) => (
                        <option key={venue} value={venue}>{venue}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist-400 2xl:w-6 2xl:h-6" />
                  </div>
                </Field>
                <Field label="Event Type">
                  <div className="relative">
                    <select
                      value={form.eventType}
                      onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                      className={`${inputClass} appearance-none cursor-pointer pr-12`}
                    >
                      <option value="" disabled>Choose event type</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist-400 2xl:w-6 2xl:h-6" />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Guests (Total & Ratio)">
                  <input
                    type="text"
                    placeholder="e.g. 6 guests ~ 4M / 2F"
                    value={form.guestsTotal}
                    onChange={(e) => setForm({ ...form, guestsTotal: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Booking Date">
                  <input
                    type={form.bookingDate ? "date" : "text"}
                    onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "date")}
                    onFocus={(e) => switchTemporalInputType(e.currentTarget, "date")}
                    onBlur={(e) => { if (!form.bookingDate) e.currentTarget.type = "text" }}
                    value={form.bookingDate}
                    onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                    placeholder="dd/mm/yyyy"
                    className={`${inputClass} ios-temporal-input`}
                    required
                  />
                </Field>
              </div>

              <Field label="Budget">
                <div className="relative">
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className={`${inputClass} appearance-none cursor-pointer pr-12`}
                  >
                    <option value="" disabled>Select your budget range</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist-400 2xl:w-6 2xl:h-6" />
                </div>
              </Field>

              <Field label="Add-Ons">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {ADD_ONS.map((addon) => (
                    <button
                      key={addon}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`w-full px-4 2xl:px-6 py-3 2xl:py-5 rounded-2xl text-sm 2xl:text-xl font-medium border transition-all flex items-center gap-4 ${
                        form.addOns.includes(addon)
                          ? "bg-white text-mist-900 border-mist-300"
                          : "bg-white text-mist-700 border-mist-200 hover:border-mist-300"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          form.addOns.includes(addon)
                            ? "border-blue-500"
                            : "border-mist-400"
                        }`}
                      >
                        {form.addOns.includes(addon) && (
                          <span className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                      </span>
                      {addon}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Special Requests / Notes">
                <textarea
                  placeholder="e.g. Birthday celebration, bottle preferences, etc."
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

              <button
                type="submit"
                disabled={!isFormValid || !turnstileToken}
                className="w-full bg-mist-900 text-white font-medium py-4 2xl:py-6 rounded-xl 2xl:rounded-2xl hover:bg-mist-800 transition-colors disabled:opacity-50 mt-2 text-base 2xl:text-2xl"
              >
                Next
              </button>
            </form>
          )}

          {/* Step 2: Payment — new UI, same underlying logic */}
          {step === 2 && (
            <div className="flex flex-col gap-6 2xl:gap-10">
              {/* Authorization notice — unchanged text */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl 2xl:rounded-2xl p-5 2xl:p-8">
                <h3 className="font-semibold text-mist-900 text-base 2xl:text-2xl mb-2 2xl:mb-3">
                  Secure Payment Authorization
                </h3>
                <p className="text-sm 2xl:text-xl text-mist-600 leading-relaxed">
                  A $100 service fee will be authorized to process your request.
                  You will only be charged if your reservation is confirmed.
                  This fee is non-refundable once confirmed.
                </p>
              </div>

              {/* Promo Code */}
              <div className="rounded-xl border border-mist-200 p-4">
                <label className="text-sm font-medium text-mist-700 block mb-2">Promo Code</label>
                {couponApplied ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <div>
                      <span className="text-sm font-semibold text-green-700">{couponApplied}</span>
                      <span className="text-xs text-green-600 ml-2">{couponDiscount}% OFF applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter promo code"
                        className="flex-1 rounded-lg border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400 uppercase tracking-wide"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2.5 rounded-lg bg-mist-900 text-white text-sm font-medium hover:bg-mist-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment method toggle */}
              <div className="space-y-4">
                <div className="rounded-xl border border-mist-200 overflow-hidden">

                  {/* Credit Card row */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full flex items-center justify-between px-4 py-3.5 text-sm transition-colors ${
                      paymentMethod === "card"
                        ? "bg-blue-50/60 border-b border-mist-200"
                        : "bg-white hover:bg-mist-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentMethod === "card" ? "border-blue-600" : "border-mist-300"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        )}
                      </span>
                      <span className="font-medium text-mist-900">Credit card</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="rounded bg-[#1a1f71] px-2 py-0.5 text-[10px] font-bold text-white tracking-wider leading-tight">VISA</span>
                      <span className="rounded bg-[#2e77bc] px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wider leading-tight">AMEX</span>
                      <span className="flex items-center justify-center w-6 h-5">
                        <svg viewBox="0 0 24 16" className="w-6 h-4">
                          <circle cx="9" cy="8" r="7" fill="#EB001B" />
                          <circle cx="15" cy="8" r="7" fill="#F79E1B" />
                          <path d="M12 2.4a7 7 0 0 1 0 11.2A7 7 0 0 1 12 2.4z" fill="#FF5F00" />
                        </svg>
                      </span>
                      <span className="rounded-full bg-mist-200 text-mist-500 text-[10px] font-semibold w-5 h-5 flex items-center justify-center">+5</span>
                    </span>
                  </button>

                  {/* Credit card form — shown only when "card" is selected */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4 bg-white px-4 py-5">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-mist-700">Name on Card</label>
                        <input
                          type="text"
                          placeholder="Enter cardholder name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full rounded-lg border border-mist-200 bg-white px-3.5 py-3 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-mist-700">Card Number</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="1234 1234 1234 1234"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 16)
                            setCardNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "))
                          }}
                          className="w-full rounded-lg border border-mist-200 bg-white px-3.5 py-3 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400 tracking-wider"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-mist-700">Expiration Date</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, "").slice(0, 4)
                              if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2)
                              setCardExpiry(v)
                            }}
                            className="w-full rounded-lg border border-mist-200 bg-white px-3.5 py-3 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-mist-700">Security Code</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="CVV"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            className="w-full rounded-lg border border-mist-200 bg-white px-3.5 py-3 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-mist-700">Billing Address</label>
                        <input
                          type="text"
                          placeholder="Enter billing address"
                          value={cardBillingAddress}
                          onChange={(e) => setCardBillingAddress(e.target.value)}
                          className="w-full rounded-lg border border-mist-200 bg-white px-3.5 py-3 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-mist-700">Country</label>
                          <input
                            type="text"
                            placeholder="United States"
                            value={cardCountry}
                            onChange={(e) => setCardCountry(e.target.value)}
                            className="w-full rounded-lg border border-mist-200 bg-white px-3.5 py-3 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-mist-700">ZIP Code</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="ZIP code"
                            maxLength={5}
                            value={cardZip}
                            onChange={(e) => setCardZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                            className="w-full rounded-lg border border-mist-200 bg-white px-3.5 py-3 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400"
                          />
                        </div>
                      </div>
                      {cardError && (
                        <p className="text-sm text-red-500">{cardError}</p>
                      )}
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                        className="w-full rounded-lg bg-mist-900 py-3 text-sm font-semibold text-white hover:bg-mist-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {placingOrder ? "Processing…" : "Place Order"}
                      </button>
                    </div>
                  )}

                  <div className="border-t border-mist-200" />

                  {/* PayPal row */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
                      paymentMethod === "paypal" ? "bg-blue-50/60" : "bg-white hover:bg-mist-50"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === "paypal" ? "border-blue-600" : "border-mist-300"
                      }`}
                    >
                      {paymentMethod === "paypal" && (
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                      )}
                    </span>
                    <span className="font-medium text-mist-900">PayPal</span>
                  </button>
                </div>

                {/* Legal copy */}
                <p className="text-xs text-mist-400 leading-relaxed">
                  By placing this order, I agree to the{" "}
                  <a href="/terms" className="text-blue-600 hover:underline">Terms &amp; Conditions</a>{" "}
                  &amp;{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>
                

                {/* PayPal buttons — only rendered when paypal method is selected */}
                {paymentMethod === "paypal" && (
                  <>
                    {paymentError && (
                      <p className="text-sm 2xl:text-xl text-red-500 text-center">{paymentError}</p>
                    )}
                    <EventPayPalButton
                      bookingData={paypalBookingData}
                      onSuccess={handlePaymentSuccess}
                      onError={(msg) => setPaymentError(msg)}
                    />
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm 2xl:text-xl text-mist-500 hover:text-mist-700 transition-colors text-center py-2 2xl:py-4"
              >
                &larr; Back to Info
              </button>
            </div>
          )}

          {/* Step 3: Done — completely unchanged */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center py-8 2xl:py-16">
              <div className="w-16 2xl:w-24 h-16 2xl:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 2xl:mb-8">
                <svg className="w-8 h-8 2xl:w-12 2xl:h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl 2xl:text-4xl font-bold text-mist-900 mb-3 2xl:mb-4">
                Booking Request Submitted
              </h2>
              <p className="text-mist-600 text-base 2xl:text-2xl mb-4">
                Your booking request has been received.
              </p>
              <p className="text-mist-600 text-base 2xl:text-2xl mb-1">
                A $100 service fee has been authorized (not charged yet).
              </p>
              <p className="text-mist-600 text-base 2xl:text-2xl mb-6">
                You will only be charged once your reservation is confirmed.
              </p>
              <p className="text-mist-600 text-base 2xl:text-2xl">
                Our team will contact you shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}