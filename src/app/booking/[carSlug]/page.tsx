"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ChevronDown,
  Minus,
  Plus,
  CreditCard,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface CarData {
  id: string
  name: string
  slug: string
  brandName: string
  pricePerDay: number
  milesIncluded: number
  extraMileRate: number
  minRentalDays: number
  location: string
  image: string | null
}

/* ------------------------------------------------------------------ */
/*  Pricing helpers                                                     */
/* ------------------------------------------------------------------ */
function getDiscount(days: number) {
  if (days >= 270) return 65
  if (days >= 180) return 60
  if (days >= 90) return 50
  if (days >= 28) return 35
  if (days >= 14) return 25
  if (days >= 7) return 15
  return 0
}

function calcPricing(
  pricePerDay: number,
  days: number,
  driverHours: number,
  driverDays: number,
  needDriver: boolean
) {
  const subtotal = pricePerDay * days
  const discountPercent = getDiscount(days)
  const discountAmount = Math.round(subtotal * (discountPercent / 100))
  const driverTotal = needDriver ? driverDays * driverHours * 45 : 0
  const preTax = subtotal - discountAmount + driverTotal
  const tax = Math.round(preTax * 0.085)
  const securityDeposit = Math.round(pricePerDay * 2)
  const total = preTax + tax + securityDeposit
  return { subtotal, discountPercent, discountAmount, driverTotal, tax, securityDeposit, total }
}

/* ================================================================== */
/*  Main Page                                                          */
/* ================================================================== */
export default function ReservationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()

  const carSlug = params.carSlug as string
  const [car, setCar] = useState<CarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<1 | 2 | 3>(1) // 1=Select, 2=Pay, 3=Done
  const [submitting, setSubmitting] = useState(false)
  const [bookingId, setBookingId] = useState("")

  /* ---- Select step state (pre-filled from query params) ---- */
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")
  const [startTime, setStartTime] = useState(searchParams.get("startTime") || "10:00")
  const [endTime, setEndTime] = useState(searchParams.get("endTime") || "10:00")
  const [needDriver, setNeedDriver] = useState(searchParams.get("driver") === "1")
  const [driverHours, setDriverHours] = useState(Number(searchParams.get("driverHours")) || 8)
  const [driverAvailability, setDriverAvailability] = useState<"full" | "select">(
    (searchParams.get("driverAvailability") as "full" | "select") || "select"
  )
  const [driverDays, setDriverDays] = useState(Number(searchParams.get("driverDays")) || 1)
  const [pickupAddress, setPickupAddress] = useState("")
  const [dropoffAddress, setDropoffAddress] = useState("")

  /* ---- Pay step state ---- */
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [billingAddress, setBillingAddress] = useState("")
  const [country, setCountry] = useState("United States")
  const [zipCode, setZipCode] = useState("")

  const today = new Date().toISOString().split("T")[0]

  /* ---- Fetch car data ---- */
  useEffect(() => {
    fetch(`/api/cars?slug=${carSlug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => {
        if (c && !c.error) {
          setCar({
            id: c.id,
            name: c.name,
            slug: c.slug,
            brandName: c.brand?.name || "",
            pricePerDay: c.pricePerDay,
            milesIncluded: c.milesIncluded,
            extraMileRate: c.extraMileRate,
            minRentalDays: c.minRentalDays,
            location: c.location,
            image: c.images?.[0]?.url || null,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [carSlug])

  /* ---- Try to pre-fill card from profile ---- */
  useEffect(() => {
    if (session?.user) {
      fetch("/api/account/profile")
        .then((r) => (r.ok ? r.json() : null))
        .then((profile) => {
          if (profile) {
            if (profile.address && !billingAddress) setBillingAddress(profile.address)
            if (profile.country && country === "United States") setCountry(profile.country)
            if (profile.zipCode && !zipCode) setZipCode(profile.zipCode)
          }
        })
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0
    return Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  }, [startDate, endDate])

  const actualDriverDays = driverAvailability === "full" ? days : driverDays

  const pricing = useMemo(
    () => (car ? calcPricing(car.pricePerDay, days, driverHours, actualDriverDays, needDriver) : null),
    [car, days, driverHours, actualDriverDays, needDriver]
  )

  /* ---- Submit booking ---- */
  const handleSubmitBooking = async () => {
    if (!session?.user) {
      router.push("/login")
      return
    }
    if (!car || !pricing) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          startDate,
          endDate,
          pickupLocation: pickupAddress || car.location,
          dropoffLocation: dropoffAddress || pickupAddress || car.location,
          notes: needDriver
            ? `Driver: ${driverHours}hr/day × ${actualDriverDays} days`
            : undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Booking failed")
      }
      const booking = await res.json()
      setBookingId(booking.id?.slice(-6)?.toUpperCase() || "000000")
      setStep(3)
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20 gap-4">
        <p className="text-gray-500">Car not found</p>
        <Link href="/cars" className="text-sm text-blue-600 hover:underline">
          Browse Cars
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Tabs */}
        <div className="flex gap-0 mb-8 border border-gray-200 rounded-xl overflow-hidden max-w-sm mx-auto">
          <div className="flex-1 py-2.5 text-center text-sm font-medium bg-gray-900 text-white">
            Car
          </div>
          <div className="flex-1 py-2.5 text-center text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
            Villa
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-10 max-w-md mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              {step > 1 ? <CheckCircle size={16} /> : "1"}
            </div>
            <span className={`text-xs mt-1.5 ${step >= 1 ? "text-blue-600 font-medium" : "text-gray-400"}`}>
              Select
            </span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 mt-[-12px] ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              {step > 2 ? <CheckCircle size={16} /> : "2"}
            </div>
            <span className={`text-xs mt-1.5 ${step >= 2 ? "text-blue-600 font-medium" : "text-gray-400"}`}>
              Pay
            </span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 mt-[-12px] ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`} />
          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}
            >
              3
            </div>
            <span className={`text-xs mt-1.5 ${step >= 3 ? "text-blue-600 font-medium" : "text-gray-400"}`}>
              Done
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3">
            {step === 1 && (
              <SelectStep
                car={car}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                needDriver={needDriver}
                setNeedDriver={setNeedDriver}
                driverHours={driverHours}
                setDriverHours={setDriverHours}
                driverAvailability={driverAvailability}
                setDriverAvailability={setDriverAvailability}
                driverDays={driverDays}
                setDriverDays={setDriverDays}
                pickupAddress={pickupAddress}
                setPickupAddress={setPickupAddress}
                dropoffAddress={dropoffAddress}
                setDropoffAddress={setDropoffAddress}
                days={days}
                today={today}
                onNext={() => {
                  if (!session?.user) {
                    router.push("/login")
                    return
                  }
                  setStep(2)
                }}
              />
            )}

            {step === 2 && (
              <PayStep
                cardName={cardName}
                setCardName={setCardName}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                expiry={expiry}
                setExpiry={setExpiry}
                cvv={cvv}
                setCvv={setCvv}
                billingAddress={billingAddress}
                setBillingAddress={setBillingAddress}
                country={country}
                setCountry={setCountry}
                zipCode={zipCode}
                setZipCode={setZipCode}
                submitting={submitting}
                onBack={() => setStep(1)}
                onPay={handleSubmitBooking}
              />
            )}

            {step === 3 && <DoneStep bookingId={bookingId} carName={car.name} />}
          </div>

          {/* RIGHT COLUMN — Summary Card */}
          <div className="lg:col-span-2">
            <SummaryCard
              car={car}
              startDate={startDate}
              endDate={endDate}
              startTime={startTime}
              endTime={endTime}
              days={days}
              pricing={pricing}
              needDriver={needDriver}
              driverHours={driverHours}
              actualDriverDays={actualDriverDays}
              step={step}
              session={session}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 1 — Select                                                    */
/* ================================================================== */
function SelectStep({
  car,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  needDriver,
  setNeedDriver,
  driverHours,
  setDriverHours,
  driverAvailability,
  setDriverAvailability,
  driverDays,
  setDriverDays,
  pickupAddress,
  setPickupAddress,
  dropoffAddress,
  setDropoffAddress,
  days,
  today,
  onNext,
}: {
  car: CarData
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  startTime: string
  setStartTime: (v: string) => void
  endTime: string
  setEndTime: (v: string) => void
  needDriver: boolean
  setNeedDriver: (v: boolean) => void
  driverHours: number
  setDriverHours: (v: number) => void
  driverAvailability: "full" | "select"
  setDriverAvailability: (v: "full" | "select") => void
  driverDays: number
  setDriverDays: (v: number) => void
  pickupAddress: string
  setPickupAddress: (v: string) => void
  dropoffAddress: string
  setDropoffAddress: (v: string) => void
  days: number
  today: string
  onNext: () => void
}) {
  return (
    <div className="space-y-8">
      {/* Select Vehicle */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Vehicle</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Make</label>
            <div className="relative">
              <select className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-500 bg-white focus:border-gray-400 focus:outline-none pr-8" disabled>
                <option>{car.brandName || "Select a make"}</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Model</label>
            <div className="relative">
              <select className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-500 bg-white focus:border-gray-400 focus:outline-none pr-8" disabled>
                <option>{car.name || "Select a model"}</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* When & Where */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">When & Where</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Start Date</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">End Date</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Need a Driver */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Need a Driver?</h2>
        <label className="flex items-center gap-2.5 cursor-pointer mb-4">
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              needDriver ? "border-blue-600" : "border-gray-300"
            }`}
          >
            {needDriver && <div className="w-2 h-2 rounded-full bg-blue-600" />}
          </div>
          <input
            type="checkbox"
            checked={needDriver}
            onChange={(e) => setNeedDriver(e.target.checked)}
            className="sr-only"
          />
          <span className="text-sm text-gray-600">Yes, I will need a driver ($45/hour)</span>
        </label>

        {needDriver && (
          <div className="space-y-5 pl-0.5">
            {/* Driver Hours Slider */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Driver Hours per Day</p>
              <input
                type="range"
                min={1}
                max={16}
                value={driverHours}
                onChange={(e) => setDriverHours(Number(e.target.value))}
                className="w-full accent-gray-900"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0 hr</span>
                <span>{driverHours} hr</span>
                <span>16 hr</span>
              </div>
            </div>

            {/* Driver Availability */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Driver Availability</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      driverAvailability === "full" ? "border-blue-600" : "border-gray-300"
                    }`}
                  >
                    {driverAvailability === "full" && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="driverAvailSelect"
                    checked={driverAvailability === "full"}
                    onChange={() => setDriverAvailability("full")}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-600">Full Rental</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      driverAvailability === "select" ? "border-blue-600" : "border-gray-300"
                    }`}
                  >
                    {driverAvailability === "select" && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="driverAvailSelect"
                    checked={driverAvailability === "select"}
                    onChange={() => setDriverAvailability("select")}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-600">Select Days</span>
                </label>
              </div>
            </div>

            {/* Day Counter */}
            {driverAvailability === "select" && (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setDriverDays(Math.max(1, driverDays - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-medium text-gray-900 w-6 text-center">
                  {driverDays}
                </span>
                <button
                  type="button"
                  onClick={() => setDriverDays(Math.min(days || 365, driverDays + 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!startDate || !endDate || days < 1}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

/* ================================================================== */
/*  STEP 2 — Pay                                                       */
/* ================================================================== */
function PayStep({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  billingAddress,
  setBillingAddress,
  country,
  setCountry,
  zipCode,
  setZipCode,
  submitting,
  onBack,
  onPay,
}: {
  cardName: string
  setCardName: (v: string) => void
  cardNumber: string
  setCardNumber: (v: string) => void
  expiry: string
  setExpiry: (v: string) => void
  cvv: string
  setCvv: (v: string) => void
  billingAddress: string
  setBillingAddress: (v: string) => void
  country: string
  setCountry: (v: string) => void
  zipCode: string
  setZipCode: (v: string) => void
  submitting: boolean
  onBack: () => void
  onPay: () => void
}) {
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16)
    return digits.replace(/(.{4})/g, "$1 ").trim()
  }

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2)
    return digits
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Card Info</h2>

      {/* Card type */}
      <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Credit card</span>
          </label>
          <div className="flex items-center gap-1.5">
            <div className="h-5 px-1.5 bg-[#1A1F71] rounded text-white text-[8px] font-bold flex items-center">VISA</div>
            <div className="h-5 px-1.5 bg-[#2E77BC] rounded text-white text-[8px] font-bold flex items-center">AMEX</div>
            <div className="h-5 px-1.5 bg-[#EB001B] rounded text-white text-[8px] font-bold flex items-center">MC</div>
            <CreditCard size={18} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Name on Card */}
      <div>
        <label className="text-xs text-gray-500 block mb-1.5">Name on Card</label>
        <input
          type="text"
          placeholder="MM/YY"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
        />
      </div>

      {/* Card Number */}
      <div>
        <label className="text-xs text-gray-500 block mb-1.5">Card Number</label>
        <div className="relative">
          <input
            type="text"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none pr-20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">AutoFill</span>
          </div>
        </div>
      </div>

      {/* Expiry & CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Expiration Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Security Code</label>
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <label className="text-xs text-gray-500 block mb-1.5">Billing Address</label>
        <input
          type="text"
          placeholder="Enter billing address"
          value={billingAddress}
          onChange={(e) => setBillingAddress(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
        />
      </div>

      {/* Country & Zip */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Country</label>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-white focus:border-gray-400 focus:outline-none pr-8"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
              <option>Germany</option>
              <option>France</option>
              <option>United Arab Emirates</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">ZIP Code</label>
          <input
            type="text"
            placeholder="ZIP code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* PayPal option */}
      <div className="border border-gray-200 rounded-xl p-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
          <span className="text-sm text-gray-500">PayPal</span>
        </label>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-400 leading-relaxed">
        By placing this order, I agree to the{" "}
        <span className="text-blue-600 cursor-pointer">Terms & Conditions</span> &{" "}
        <span className="text-blue-600 cursor-pointer">Privacy Policy.</span>
      </p>
      <p className="text-xs text-gray-400 leading-relaxed">
        We will temporarily reserve the funds on your credit card with a pre-authorization. Your credit card will only be charged after the reservation gets confirmed by the Sales Team.
      </p>
      <p className="text-xs text-gray-400">Safe and Secure SSL Encrypted</p>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onPay}
          disabled={submitting || !cardNumber || !expiry || !cvv}
          className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  STEP 3 — Done                                                      */
/* ================================================================== */
function DoneStep({ bookingId, carName }: { bookingId: string; carName: string }) {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Reservation Confirmed!</h2>
      <p className="text-gray-500 text-sm max-w-md mx-auto">
        Your booking for the <span className="font-medium text-gray-900">{carName}</span> has been
        submitted successfully. Our team will confirm your reservation shortly.
      </p>
      <p className="text-xs text-gray-400">
        Booking Reference: <span className="font-mono font-semibold text-gray-700">VV-{bookingId}</span>
      </p>
      <p className="text-xs text-gray-400">
        Free cancellation within 24 hours from the time you place the order.
      </p>
      <div className="flex gap-3 justify-center pt-4">
        <Link
          href="/account/bookings"
          className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          View My Bookings
        </Link>
        <Link
          href="/cars"
          className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Browse More Cars
        </Link>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Summary Card (right sidebar)                                       */
/* ================================================================== */
function SummaryCard({
  car,
  startDate,
  endDate,
  startTime,
  endTime,
  days,
  pricing,
  needDriver,
  driverHours,
  actualDriverDays,
  step,
  session,
}: {
  car: CarData
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  days: number
  pricing: ReturnType<typeof calcPricing> | null
  needDriver: boolean
  driverHours: number
  actualDriverDays: number
  step: number
  session: any
}) {
  const formatDate = (d: string, t: string) => {
    if (!d) return "—"
    const date = new Date(d + "T" + (t || "10:00"))
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " at " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-5 space-y-4 sticky top-24">
      {/* Car Header */}
      <div className="flex gap-4">
        <div className="w-24 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
          {car.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">{car.name}</h3>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-900 mt-1 flex-shrink-0" />
              <div className="text-xs text-gray-500">
                <p>{formatDate(startDate, startTime)}</p>
                <p className="text-gray-400">{car.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 mt-1 flex-shrink-0" />
              <div className="text-xs text-gray-500">
                <p>{formatDate(endDate, endTime)}</p>
                <p className="text-gray-400">{car.location}</p>
              </div>
            </div>
          </div>
          {days > 0 && (
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <MapPin size={10} /> Up to {car.milesIncluded} miles/day
            </p>
          )}
        </div>
      </div>

      {/* User info (Pay step) */}
      {step >= 2 && session?.user && (
        <div className="text-xs text-gray-500 space-y-0.5 border-t border-gray-100 pt-3">
          <p>
            <span className="text-gray-700 font-medium">Full name:</span> {session.user.name || "—"}
          </p>
          <p>
            <span className="text-gray-700 font-medium">Email:</span> {session.user.email || "—"}
          </p>
        </div>
      )}

      {step >= 2 && (
        <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
          Free cancellation within 24 hours from the time you place the order.
        </p>
      )}

      {/* Price Breakdown */}
      {pricing && days > 0 && (
        <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
          <div className="flex justify-between text-gray-500">
            <span>Car Total <span className="text-xs">({`$${car.pricePerDay} × ${days}d`})</span></span>
            <span className="text-gray-900">${pricing.subtotal.toLocaleString()}</span>
          </div>
          {pricing.discountPercent > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Long-Term Discount <span className="text-xs">({days}d – {pricing.discountPercent}% OFF)</span></span>
              <span>-${pricing.discountAmount.toLocaleString()}</span>
            </div>
          )}
          {pricing.driverTotal > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Driver Total <span className="text-xs">({driverHours}hr × $45 × {actualDriverDays}d)</span></span>
              <span className="text-gray-900">${pricing.driverTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-500">
            <span>Tax <span className="text-xs">(8.5%)</span></span>
            <span className="text-gray-900">${pricing.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Security Deposit <span className="text-xs">(Fully Refundable)</span></span>
            <span className="text-gray-900">${pricing.securityDeposit.toLocaleString()}</span>
          </div>

          {step >= 2 && (
            <>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span className="text-gray-400">TBD</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Return Fee</span>
                <span className="text-gray-400">TBD</span>
              </div>
            </>
          )}

          <hr className="border-gray-100" />

          {step >= 2 ? (
            <>
              <div className="flex justify-between text-gray-500">
                <span className="font-medium">Pay Now <span className="text-xs">(Authorize Hold)</span></span>
                <span className="text-blue-600 font-semibold">${pricing.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="font-medium">Due at Pickup</span>
                <span className="text-gray-900 font-semibold">
                  ${(pricing.total - pricing.securityDeposit).toLocaleString()}
                </span>
              </div>
            </>
          ) : null}

          <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
            <span>Total Charges</span>
            <span>${pricing.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
