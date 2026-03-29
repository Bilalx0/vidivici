"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ChevronDown,
  Minus,
  Plus,
  CreditCard,
  CheckCircle,
  MapPin,
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

interface VillaData {
  id: string
  name: string
  slug: string
  location: string
  pricePerNight: number
  cleaningFee: number
  securityDeposit: number
  bedrooms: number
  guests: number
  image: string | null
}

interface BrandOption {
  id: string
  name: string
  slug: string
}

interface CarOption {
  id: string
  name: string
  slug: string
  pricePerDay: number
  milesIncluded: number
  extraMileRate: number
  minRentalDays: number
  location: string
  image: string | null
  brandName: string
}

/* ------------------------------------------------------------------ */
/*  Car pricing helpers                                                 */
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

function calcCarPricing(
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

function calcVillaPricing(villa: VillaData, nights: number) {
  const nightsTotal = villa.pricePerNight * nights
  const subtotal = nightsTotal + villa.cleaningFee
  const tax = Math.round(subtotal * 0.14)
  const total = subtotal + tax + villa.securityDeposit
  return { nightsTotal, cleaningFee: villa.cleaningFee, tax, securityDeposit: villa.securityDeposit, total }
}

/* ================================================================== */
/*  Main Page                                                          */
/* ================================================================== */
export default function ReservationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-mist-300 border-t-mist-900 rounded-full animate-spin" />
      </div>
    }>
      <ReservationContent />
    </Suspense>
  )
}

function ReservationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()

  /* ---- Mode: car or villa ---- */
  const initialMode = searchParams.get("type") === "villa" ? "villa" : "car"
  const [mode, setMode] = useState<"car" | "villa">(initialMode as "car" | "villa")
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = useState(false)
  const [bookingId, setBookingId] = useState("")

  /* ---- Car selection state ---- */
  const [brands, setBrands] = useState<BrandOption[]>([])
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("")
  const [carOptions, setCarOptions] = useState<CarOption[]>([])
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null)
  const [loadingCars, setLoadingCars] = useState(false)

  /* ---- Villa selection state ---- */
  const [villaOptions, setVillaOptions] = useState<VillaData[]>([])
  const [selectedVilla, setSelectedVilla] = useState<VillaData | null>(null)
  const [loadingVillas, setLoadingVillas] = useState(false)

  /* ---- Shared date state ---- */
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || searchParams.get("checkIn") || "")
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || searchParams.get("checkOut") || "")
  const [startTime, setStartTime] = useState(searchParams.get("startTime") || "10:00")
  const [endTime, setEndTime] = useState(searchParams.get("endTime") || "10:00")

  /* ---- Car-specific state ---- */
  const [needDriver, setNeedDriver] = useState(searchParams.get("driver") === "1")
  const [driverHours, setDriverHours] = useState(Number(searchParams.get("driverHours")) || 8)
  const [driverAvailability, setDriverAvailability] = useState<"full" | "select">(
    (searchParams.get("driverAvailability") as "full" | "select") || "select"
  )
  const [driverDays, setDriverDays] = useState(Number(searchParams.get("driverDays")) || 1)

  /* ---- Villa-specific state ---- */
  const [guestCount, setGuestCount] = useState(Number(searchParams.get("guests")) || 1)

  /* ---- Customer info state ---- */
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [driverLicenseUrl, setDriverLicenseUrl] = useState("")
  const [insuranceUrl, setInsuranceUrl] = useState("")
  const [uploadingLicense, setUploadingLicense] = useState(false)
  const [uploadingInsurance, setUploadingInsurance] = useState(false)

  /* ---- Pay step state ---- */
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [billingAddress, setBillingAddress] = useState("")
  const [country, setCountry] = useState("United States")
  const [zipCode, setZipCode] = useState("")

  const today = new Date().toISOString().split("T")[0]

  /* ---- Fetch brands on mount ---- */
  useEffect(() => {
    fetch("/api/brands")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const b = Array.isArray(data) ? data : []
        setBrands(b.map((x: any) => ({ id: x.id, name: x.name, slug: x.slug })))
      })
      .catch(() => {})
  }, [])

  /* ---- Fetch cars when brand changes ---- */
  useEffect(() => {
    if (!selectedBrandSlug) {
      setCarOptions([])
      return
    }
    setLoadingCars(true)
    fetch(`/api/cars?brand=${encodeURIComponent(selectedBrandSlug)}&limit=100`)
      .then((r) => (r.ok ? r.json() : { cars: [] }))
      .then((data) => {
        const list = data.cars || []
        setCarOptions(
          list.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            pricePerDay: c.pricePerDay,
            milesIncluded: c.milesIncluded,
            extraMileRate: c.extraMileRate,
            minRentalDays: c.minRentalDays,
            location: c.location,
            image: c.images?.[0]?.url || null,
            brandName: c.brand?.name || "",
          }))
        )
      })
      .finally(() => setLoadingCars(false))
  }, [selectedBrandSlug])

  /* ---- Pre-select car from URL ---- */
  useEffect(() => {
    const carSlug = searchParams.get("car")
    if (carSlug) {
      fetch(`/api/cars?slug=${encodeURIComponent(carSlug)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((c) => {
          if (c && !c.error) {
            const carData: CarData = {
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
            }
            setSelectedCar(carData)
            if (c.brand?.slug) setSelectedBrandSlug(c.brand.slug)
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---- Fetch villas ---- */
  useEffect(() => {
    if (mode !== "villa") return
    setLoadingVillas(true)
    fetch("/api/villas?limit=100")
      .then((r) => (r.ok ? r.json() : { villas: [] }))
      .then((data) => {
        const list = data.villas || []
        setVillaOptions(
          list.map((v: any) => ({
            id: v.id,
            name: v.name,
            slug: v.slug,
            location: v.location,
            pricePerNight: v.pricePerNight,
            cleaningFee: v.cleaningFee,
            securityDeposit: v.securityDeposit,
            bedrooms: v.bedrooms,
            guests: v.guests,
            image: v.images?.[0]?.url || null,
          }))
        )
      })
      .finally(() => setLoadingVillas(false))
  }, [mode])

  /* ---- Pre-select villa from URL ---- */
  useEffect(() => {
    const villaSlug = searchParams.get("villa")
    if (villaSlug && mode === "villa") {
      fetch(`/api/villas?slug=${encodeURIComponent(villaSlug)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          const v = data?.villas?.[0] || data
          if (v && v.id) {
            setSelectedVilla({
              id: v.id,
              name: v.name,
              slug: v.slug,
              location: v.location,
              pricePerNight: v.pricePerNight,
              cleaningFee: v.cleaningFee,
              securityDeposit: v.securityDeposit,
              bedrooms: v.bedrooms,
              guests: v.guests,
              image: v.images?.[0]?.url || null,
            })
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  /* ---- Profile pre-fill ---- */
  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name || "").split(" ")
      if (!firstName) setFirstName(nameParts[0] || "")
      if (!lastName) setLastName(nameParts.slice(1).join(" ") || "")
      if (!email) setEmail(session.user.email || "")

      fetch("/api/account/profile")
        .then((r) => (r.ok ? r.json() : null))
        .then((profile) => {
          if (profile) {
            if (profile.address && !billingAddress) setBillingAddress(profile.address)
            if (profile.country && country === "United States") setCountry(profile.country)
            if (profile.zipCode && !zipCode) setZipCode(profile.zipCode)
            if (profile.phone && !phone) setPhone(profile.phone)
            if (profile.driverLicense && !driverLicenseUrl) setDriverLicenseUrl(profile.driverLicense)
            if (profile.insurance && !insuranceUrl) setInsuranceUrl(profile.insurance)
          }
        })
        .catch(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  /* ---- File upload helper ---- */
  const handleDocUpload = async (file: File, type: "license" | "insurance") => {
    const setter = type === "license" ? setDriverLicenseUrl : setInsuranceUrl
    const setLoading = type === "license" ? setUploadingLicense : setUploadingInsurance
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("files", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const url = data.urls?.[0]
      if (url) {
        setter(url)
        // Save to profile
        fetch("/api/account/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [type === "license" ? "driverLicense" : "insurance"]: url }),
        }).catch(() => {})
      }
    } catch {
      alert("Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  /* ---- Computed values ---- */
  const days = useMemo(() => {
    if (!startDate || !endDate) return 0
    return Math.max(0, Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    ))
  }, [startDate, endDate])

  const actualDriverDays = driverAvailability === "full" ? days : driverDays

  const carPricing = useMemo(
    () => (selectedCar ? calcCarPricing(selectedCar.pricePerDay, days, driverHours, actualDriverDays, needDriver) : null),
    [selectedCar, days, driverHours, actualDriverDays, needDriver]
  )

  const villaPricing = useMemo(
    () => (selectedVilla && days > 0 ? calcVillaPricing(selectedVilla, days) : null),
    [selectedVilla, days]
  )

  /* ---- Select car from dropdown ---- */
  const handleSelectCar = (slug: string) => {
    const car = carOptions.find((c) => c.slug === slug)
    if (car) {
      setSelectedCar({
        id: car.id,
        name: car.name,
        slug: car.slug,
        brandName: car.brandName,
        pricePerDay: car.pricePerDay,
        milesIncluded: car.milesIncluded,
        extraMileRate: car.extraMileRate,
        minRentalDays: car.minRentalDays,
        location: car.location,
        image: car.image,
      })
    } else {
      setSelectedCar(null)
    }
  }

  /* ---- Submit booking ---- */
  const handleSubmitBooking = async () => {
    if (!session?.user) {
      router.push("/login")
      return
    }

    setSubmitting(true)
    try {
      if (mode === "car" && selectedCar) {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            carId: selectedCar.id,
            startDate,
            endDate,
            pickupLocation: selectedCar.location,
            dropoffLocation: selectedCar.location,
            notes: needDriver
              ? `Driver: ${driverHours}hr/day × ${actualDriverDays} days`
              : undefined,
          }),
        })
        if (!res.ok) throw new Error("Booking failed")
        const booking = await res.json()
        setBookingId(booking.id?.slice(-6)?.toUpperCase() || "000000")
        setStep(3)
      } else if (mode === "villa" && selectedVilla) {
        const res = await fetch("/api/villa-bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            villaId: selectedVilla.id,
            checkIn: startDate,
            checkOut: endDate,
            guests: guestCount,
          }),
        })
        if (!res.ok) throw new Error("Booking failed")
        const booking = await res.json()
        setBookingId(booking.id?.slice(-6)?.toUpperCase() || "000000")
        setStep(3)
      }
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const vehicleName = mode === "car" ? (selectedCar?.name || "Car") : (selectedVilla?.name || "Villa")
  const hasVehicle = mode === "car" ? !!selectedCar : !!selectedVilla
  const canProceed = hasVehicle && startDate && endDate && days > 0

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Tabs */}
        <div className="flex gap-0 mb-8 border border-mist-200 rounded-xl overflow-hidden max-w-sm mx-auto">
          <button
            onClick={() => { if (step >= 2) return; setMode("car"); setStep(1) }}
            disabled={step >= 2 && mode !== "car"}
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
              mode === "car" ? "bg-mist-900 text-white" : step >= 2 ? "text-mist-300 bg-mist-50 cursor-not-allowed" : "text-mist-400 bg-mist-50 hover:bg-mist-100"
            }`}
          >
            Car
          </button>
          <button
            onClick={() => { if (step >= 2) return; setMode("villa"); setStep(1) }}
            disabled={step >= 2 && mode !== "villa"}
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
              mode === "villa" ? "bg-mist-900 text-white" : step >= 2 ? "text-mist-300 bg-mist-50 cursor-not-allowed" : "text-mist-400 bg-mist-50 hover:bg-mist-100"
            }`}
          >
            Villa
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-10 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-mist-200 text-mist-400"
            }`}>
              {step > 1 ? <CheckCircle size={16} /> : "1"}
            </div>
            <span className={`text-xs mt-1.5 ${step >= 1 ? "text-blue-600 font-medium" : "text-mist-400"}`}>Select</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 mt-[-12px] ${step >= 2 ? "bg-blue-600" : "bg-mist-200"}`} />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-mist-200 text-mist-400"
            }`}>
              {step > 2 ? <CheckCircle size={16} /> : "2"}
            </div>
            <span className={`text-xs mt-1.5 ${step >= 2 ? "text-blue-600 font-medium" : "text-mist-400"}`}>Pay</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 mt-[-12px] ${step >= 3 ? "bg-blue-600" : "bg-mist-200"}`} />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 3 ? "bg-blue-600 text-white" : "bg-mist-200 text-mist-400"
            }`}>
              3
            </div>
            <span className={`text-xs mt-1.5 ${step >= 3 ? "text-blue-600 font-medium" : "text-mist-400"}`}>Done</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3">
            {step === 1 && mode === "car" && (
              <CarSelectStep
                brands={brands}
                selectedBrandSlug={selectedBrandSlug}
                setSelectedBrandSlug={(v) => { setSelectedBrandSlug(v); setSelectedCar(null) }}
                carOptions={carOptions}
                selectedCar={selectedCar}
                onSelectCar={handleSelectCar}
                loadingCars={loadingCars}
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
                days={days}
                today={today}
                onNext={() => {
                  if (!session?.user) { router.push("/login"); return }
                  setStep(2)
                }}
                canProceed={!!canProceed}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                driverLicenseUrl={driverLicenseUrl}
                insuranceUrl={insuranceUrl}
                uploadingLicense={uploadingLicense}
                uploadingInsurance={uploadingInsurance}
                onDocUpload={handleDocUpload}
              />
            )}

            {step === 1 && mode === "villa" && (
              <VillaSelectStep
                villaOptions={villaOptions}
                selectedVilla={selectedVilla}
                setSelectedVilla={setSelectedVilla}
                loadingVillas={loadingVillas}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                guestCount={guestCount}
                setGuestCount={setGuestCount}
                days={days}
                today={today}
                onNext={() => {
                  if (!session?.user) { router.push("/login"); return }
                  setStep(2)
                }}
                canProceed={!!canProceed}
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

            {step === 3 && <DoneStep bookingId={bookingId} vehicleName={vehicleName} mode={mode} />}
          </div>

          {/* RIGHT COLUMN — Summary */}
          <div className="lg:col-span-2">
            {mode === "car" && selectedCar && (
              <CarSummaryCard
                car={selectedCar}
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime}
                days={days}
                pricing={carPricing}
                needDriver={needDriver}
                driverHours={driverHours}
                actualDriverDays={actualDriverDays}
                step={step}
                session={session}
              />
            )}
            {mode === "villa" && selectedVilla && (
              <VillaSummaryCard
                villa={selectedVilla}
                startDate={startDate}
                endDate={endDate}
                days={days}
                guestCount={guestCount}
                pricing={villaPricing}
                step={step}
                session={session}
              />
            )}
            {!hasVehicle && (
              <div className="border border-mist-200 rounded-2xl p-5 text-center text-sm text-mist-400">
                Select a {mode} to see pricing
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Car Select Step                                                     */
/* ================================================================== */
function CarSelectStep({
  brands, selectedBrandSlug, setSelectedBrandSlug,
  carOptions, selectedCar, onSelectCar, loadingCars,
  startDate, setStartDate, endDate, setEndDate,
  startTime, setStartTime, endTime, setEndTime,
  needDriver, setNeedDriver, driverHours, setDriverHours,
  driverAvailability, setDriverAvailability, driverDays, setDriverDays,
  days, today, onNext, canProceed,
  firstName, setFirstName, lastName, setLastName,
  email, setEmail, phone, setPhone,
  driverLicenseUrl, insuranceUrl,
  uploadingLicense, uploadingInsurance, onDocUpload,
}: {
  brands: BrandOption[]
  selectedBrandSlug: string
  setSelectedBrandSlug: (v: string) => void
  carOptions: CarOption[]
  selectedCar: CarData | null
  onSelectCar: (slug: string) => void
  loadingCars: boolean
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
  days: number
  today: string
  onNext: () => void
  canProceed: boolean
  firstName: string; setFirstName: (v: string) => void
  lastName: string; setLastName: (v: string) => void
  email: string; setEmail: (v: string) => void
  phone: string; setPhone: (v: string) => void
  driverLicenseUrl: string; insuranceUrl: string
  uploadingLicense: boolean; uploadingInsurance: boolean
  onDocUpload: (file: File, type: "license" | "insurance") => void
}) {
  return (
    <div className="space-y-8">
      {/* Select Vehicle */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">Select Vehicle</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Make</label>
            <div className="relative">
              <select
                value={selectedBrandSlug}
                onChange={(e) => setSelectedBrandSlug(e.target.value)}
                className="w-full appearance-none border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none pr-8"
              >
                <option value="">Select a make</option>
                {brands.map((b) => (
                  <option key={b.slug} value={b.slug}>{b.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Model</label>
            <div className="relative">
              <select
                value={selectedCar?.slug || ""}
                onChange={(e) => onSelectCar(e.target.value)}
                disabled={!selectedBrandSlug || loadingCars}
                className="w-full appearance-none border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none pr-8 disabled:opacity-50"
              >
                <option value="">
                  {loadingCars ? "Loading..." : !selectedBrandSlug ? "Select a make first" : "Select a model"}
                </option>
                {carOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name} — ${c.pricePerDay}/day</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* When & Where */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">When & Where</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Start Date</label>
              <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">End Date</label>
              <input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Need a Driver */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">Need a Driver?</h2>
        <label className="flex items-center gap-2.5 cursor-pointer mb-4">
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${needDriver ? "border-blue-600" : "border-mist-300"}`}>
            {needDriver && <div className="w-2 h-2 rounded-full bg-blue-600" />}
          </div>
          <input type="checkbox" checked={needDriver} onChange={(e) => setNeedDriver(e.target.checked)} className="sr-only" />
          <span className="text-sm text-mist-600">Yes, I will need a driver ($45/hour)</span>
        </label>

        {needDriver && (
          <div className="space-y-5 pl-0.5">
            <div>
              <p className="text-xs text-mist-500 mb-2">Driver Hours per Day</p>
              <input type="range" min={1} max={16} value={driverHours} onChange={(e) => setDriverHours(Number(e.target.value))} className="w-full accent-mist-900" />
              <div className="flex justify-between text-[10px] text-mist-400 mt-1">
                <span>0 hr</span><span>{driverHours} hr</span><span>16 hr</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-mist-500 mb-2">Driver Availability</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${driverAvailability === "full" ? "border-blue-600" : "border-mist-300"}`}>
                    {driverAvailability === "full" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input type="radio" name="driverAvail" checked={driverAvailability === "full"} onChange={() => setDriverAvailability("full")} className="sr-only" />
                  <span className="text-sm text-mist-600">Full Rental</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${driverAvailability === "select" ? "border-blue-600" : "border-mist-300"}`}>
                    {driverAvailability === "select" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <input type="radio" name="driverAvail" checked={driverAvailability === "select"} onChange={() => setDriverAvailability("select")} className="sr-only" />
                  <span className="text-sm text-mist-600">Select Days</span>
                </label>
              </div>
            </div>
            {driverAvailability === "select" && (
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setDriverDays(Math.max(1, driverDays - 1))}
                  className="w-8 h-8 rounded-lg border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50">
                  <Minus size={14} />
                </button>
                <span className="text-sm font-medium text-mist-900 w-6 text-center">{driverDays}</span>
                <button type="button" onClick={() => setDriverDays(Math.min(days || 365, driverDays + 1))}
                  className="w-8 h-8 rounded-lg border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">Customer Info</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">First Name <span className="text-red-400">*</span></label>
              <input type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Last Name</label>
              <input type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Email Address</label>
              <input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Phone Number</label>
              <input type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Drivers License</label>
              {driverLicenseUrl ? (
                <div className="relative border border-mist-200 rounded-xl overflow-hidden h-24">
                  <img src={driverLicenseUrl} alt="Driver License" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => (document.getElementById("license-upload") as HTMLInputElement)?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                    Change
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => (document.getElementById("license-upload") as HTMLInputElement)?.click()}
                  className="w-full flex items-center gap-2 border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-400 hover:bg-mist-50 transition-colors text-left">
                  {uploadingLicense ? "Uploading..." : "Choose File"} <span className="text-xs text-mist-300">No file chosen</span>
                </button>
              )}
              <input id="license-upload" type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onDocUpload(f, "license") }} />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Insurance</label>
              {insuranceUrl ? (
                <div className="relative border border-mist-200 rounded-xl overflow-hidden h-24">
                  <img src={insuranceUrl} alt="Insurance" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => (document.getElementById("insurance-upload") as HTMLInputElement)?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                    Change
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => (document.getElementById("insurance-upload") as HTMLInputElement)?.click()}
                  className="w-full flex items-center gap-2 border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-400 hover:bg-mist-50 transition-colors text-left">
                  {uploadingInsurance ? "Uploading..." : "Choose File"} <span className="text-xs text-mist-300">No file chosen</span>
                </button>
              )}
              <input id="insurance-upload" type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onDocUpload(f, "insurance") }} />
            </div>
          </div>
        </div>
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="w-full bg-mist-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  )
}

/* ================================================================== */
/*  Villa Select Step                                                   */
/* ================================================================== */
function VillaSelectStep({
  villaOptions, selectedVilla, setSelectedVilla, loadingVillas,
  startDate, setStartDate, endDate, setEndDate,
  guestCount, setGuestCount,
  days, today, onNext, canProceed,
}: {
  villaOptions: VillaData[]
  selectedVilla: VillaData | null
  setSelectedVilla: (v: VillaData | null) => void
  loadingVillas: boolean
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  guestCount: number
  setGuestCount: (v: number) => void
  days: number
  today: string
  onNext: () => void
  canProceed: boolean
}) {
  const locations = [...new Set(villaOptions.map((v) => v.location))].sort()
  const [locationFilter, setLocationFilter] = useState("")

  const filteredVillas = locationFilter
    ? villaOptions.filter((v) => v.location === locationFilter)
    : villaOptions

  return (
    <div className="space-y-8">
      {/* Select Villa */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">Select Villa</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Location</label>
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => { setLocationFilter(e.target.value); setSelectedVilla(null) }}
                className="w-full appearance-none border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none pr-8"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Villa</label>
            <div className="relative">
              <select
                value={selectedVilla?.slug || ""}
                onChange={(e) => {
                  const v = filteredVillas.find((x) => x.slug === e.target.value) || null
                  setSelectedVilla(v)
                }}
                disabled={loadingVillas}
                className="w-full appearance-none border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none pr-8 disabled:opacity-50"
              >
                <option value="">{loadingVillas ? "Loading..." : "Select a villa"}</option>
                {filteredVillas.map((v) => (
                  <option key={v.slug} value={v.slug}>{v.name} — ${v.pricePerNight}/night</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* When */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">When</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Check-In</label>
            <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Check-Out</label>
            <input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">Guests</h2>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            className="w-8 h-8 rounded-lg border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50">
            <Minus size={14} />
          </button>
          <span className="text-sm font-medium text-mist-900 w-6 text-center">{guestCount}</span>
          <button type="button" onClick={() => setGuestCount(Math.min(selectedVilla?.guests || 20, guestCount + 1))}
            className="w-8 h-8 rounded-lg border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50">
            <Plus size={14} />
          </button>
          {selectedVilla && (
            <span className="text-xs text-mist-400">max {selectedVilla.guests}</span>
          )}
        </div>
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="w-full bg-mist-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  )
}

/* ================================================================== */
/*  Pay Step                                                            */
/* ================================================================== */
function PayStep({
  cardName, setCardName, cardNumber, setCardNumber,
  expiry, setExpiry, cvv, setCvv,
  billingAddress, setBillingAddress, country, setCountry,
  zipCode, setZipCode, submitting, onBack, onPay,
}: {
  cardName: string; setCardName: (v: string) => void
  cardNumber: string; setCardNumber: (v: string) => void
  expiry: string; setExpiry: (v: string) => void
  cvv: string; setCvv: (v: string) => void
  billingAddress: string; setBillingAddress: (v: string) => void
  country: string; setCountry: (v: string) => void
  zipCode: string; setZipCode: (v: string) => void
  submitting: boolean; onBack: () => void; onPay: () => void
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
      <h2 className="text-lg font-semibold text-mist-900">Card Info</h2>

      <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
            </div>
            <span className="text-sm font-medium text-mist-900">Credit card</span>
          </label>
          <div className="flex items-center gap-1.5">
            <div className="h-5 px-1.5 bg-[#1A1F71] rounded text-white text-[8px] font-bold flex items-center">VISA</div>
            <div className="h-5 px-1.5 bg-[#2E77BC] rounded text-white text-[8px] font-bold flex items-center">AMEX</div>
            <div className="h-5 px-1.5 bg-[#EB001B] rounded text-white text-[8px] font-bold flex items-center">MC</div>
            <CreditCard size={18} className="text-mist-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-mist-500 block mb-1.5">Name on Card</label>
        <input type="text" placeholder="Full name" value={cardName} onChange={(e) => setCardName(e.target.value)}
          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
      </div>

      <div>
        <label className="text-xs text-mist-500 block mb-1.5">Card Number</label>
        <input type="text" placeholder="1234 1234 1234 1234" value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} maxLength={19}
          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-mist-500 block mb-1.5">Expiration Date</label>
          <input type="text" placeholder="MM/YY" value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))} maxLength={5}
            className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
        </div>
        <div>
          <label className="text-xs text-mist-500 block mb-1.5">Security Code</label>
          <input type="text" placeholder="CVV" value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4}
            className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="text-xs text-mist-500 block mb-1.5">Billing Address</label>
        <input type="text" placeholder="Enter billing address" value={billingAddress}
          onChange={(e) => setBillingAddress(e.target.value)}
          className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-mist-500 block mb-1.5">Country</label>
          <div className="relative">
            <select value={country} onChange={(e) => setCountry(e.target.value)}
              className="w-full appearance-none border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 bg-white focus:border-mist-400 focus:outline-none pr-8">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
              <option>Germany</option>
              <option>France</option>
              <option>United Arab Emirates</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs text-mist-500 block mb-1.5">ZIP Code</label>
          <input type="text" placeholder="ZIP code" value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full border border-mist-200 rounded-xl px-4 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none" />
        </div>
      </div>

      <div className="border border-mist-200 rounded-xl p-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-4 h-4 rounded-full border-2 border-mist-300" />
          <span className="text-sm text-mist-500">PayPal</span>
        </label>
      </div>

      <p className="text-xs text-mist-400 leading-relaxed">
        By placing this order, I agree to the{" "}
        <span className="text-blue-600 cursor-pointer">Terms & Conditions</span> &{" "}
        <span className="text-blue-600 cursor-pointer">Privacy Policy.</span>
      </p>
      <p className="text-xs text-mist-400 leading-relaxed">
        We will temporarily reserve the funds on your credit card with a pre-authorization. Your credit card will only be charged after the reservation gets confirmed by the Sales Team.
      </p>
      <p className="text-xs text-mist-400">Safe and Secure SSL Encrypted</p>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-1 border border-mist-200 text-mist-700 py-3 rounded-xl font-semibold text-sm hover:bg-mist-50 transition-colors">
          Back
        </button>
        <button onClick={onPay} disabled={submitting || !cardNumber || !expiry || !cvv}
          className="flex-1 bg-mist-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Done Step                                                           */
/* ================================================================== */
function DoneStep({ bookingId, vehicleName, mode }: { bookingId: string; vehicleName: string; mode: "car" | "villa" }) {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-mist-900">Reservation Confirmed!</h2>
      <p className="text-mist-500 text-sm max-w-md mx-auto">
        Your booking for <span className="font-medium text-mist-900">{vehicleName}</span> has been
        submitted successfully. Our team will confirm your reservation shortly.
      </p>
      <p className="text-xs text-mist-400">
        Booking Reference: <span className="font-mono font-semibold text-mist-700">VV-{bookingId}</span>
      </p>
      <p className="text-xs text-mist-400">
        Free cancellation within 24 hours from the time you place the order.
      </p>
      <div className="flex gap-3 justify-center pt-4">
        <Link href="/account/bookings"
          className="px-6 py-2.5 bg-mist-900 text-white rounded-xl text-sm font-semibold hover:bg-mist-700 transition-colors">
          View My Bookings
        </Link>
        <Link href={mode === "car" ? "/cars" : "/villas"}
          className="px-6 py-2.5 border border-mist-200 text-mist-700 rounded-xl text-sm font-semibold hover:bg-mist-50 transition-colors">
          Browse More {mode === "car" ? "Cars" : "Villas"}
        </Link>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Car Summary Card                                                    */
/* ================================================================== */
function CarSummaryCard({
  car, startDate, endDate, startTime, endTime, days, pricing,
  needDriver, driverHours, actualDriverDays, step, session,
}: {
  car: CarData; startDate: string; endDate: string; startTime: string; endTime: string
  days: number; pricing: ReturnType<typeof calcCarPricing> | null
  needDriver: boolean; driverHours: number; actualDriverDays: number; step: number; session: any
}) {
  const formatDate = (d: string, t: string) => {
    if (!d) return "—"
    const date = new Date(d + "T" + (t || "10:00"))
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " at " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }

  return (
    <div className="border border-mist-200 rounded-2xl p-5 space-y-4 sticky top-24">
      <div className="flex gap-4">
        <div className="w-24 h-16 bg-mist-100 rounded-xl overflow-hidden flex-shrink-0">
          {car.image ? (
            <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-mist-400">No image</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-mist-900 text-sm">{car.name}</h3>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-mist-900 mt-1 flex-shrink-0" />
              <div className="text-xs text-mist-500">
                <p>{formatDate(startDate, startTime)}</p>
                <p className="text-mist-400">{car.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-mist-400 mt-1 flex-shrink-0" />
              <div className="text-xs text-mist-500">
                <p>{formatDate(endDate, endTime)}</p>
                <p className="text-mist-400">{car.location}</p>
              </div>
            </div>
          </div>
          {days > 0 && (
            <p className="text-[10px] text-mist-400 mt-2 flex items-center gap-1">
              <MapPin size={10} /> Up to {car.milesIncluded} miles/day
            </p>
          )}
        </div>
      </div>

      {step >= 2 && session?.user && (
        <div className="text-xs text-mist-500 space-y-0.5 border-t border-mist-100 pt-3">
          <p><span className="text-mist-700 font-medium">Full name:</span> {session.user.name || "—"}</p>
          <p><span className="text-mist-700 font-medium">Email:</span> {session.user.email || "—"}</p>
        </div>
      )}

      {step >= 2 && (
        <p className="text-xs text-mist-400 border-t border-mist-100 pt-3">
          Free cancellation within 24 hours from the time you place the order.
        </p>
      )}

      {pricing && days > 0 && (
        <div className="space-y-2 text-sm border-t border-mist-100 pt-3">
          <div className="flex justify-between text-mist-500">
            <span>Car Total <span className="text-xs">({`$${car.pricePerDay} × ${days}d`})</span></span>
            <span className="text-mist-900">${pricing.subtotal.toLocaleString()}</span>
          </div>
          {pricing.discountPercent > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Long-Term Discount <span className="text-xs">({days}d – {pricing.discountPercent}% OFF)</span></span>
              <span>-${pricing.discountAmount.toLocaleString()}</span>
            </div>
          )}
          {pricing.driverTotal > 0 && (
            <div className="flex justify-between text-mist-500">
              <span>Driver Total <span className="text-xs">({driverHours}hr × $45 × {actualDriverDays}d)</span></span>
              <span className="text-mist-900">${pricing.driverTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-mist-500">
            <span>Tax <span className="text-xs">(8.5%)</span></span>
            <span className="text-mist-900">${pricing.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-mist-500">
            <span>Security Deposit <span className="text-xs">(Fully Refundable)</span></span>
            <span className="text-mist-900">${pricing.securityDeposit.toLocaleString()}</span>
          </div>
          <hr className="border-mist-100" />
          <div className="flex justify-between font-bold text-mist-900 text-base pt-1">
            <span>Total Charges</span>
            <span>${pricing.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/*  Villa Summary Card                                                  */
/* ================================================================== */
function VillaSummaryCard({
  villa, startDate, endDate, days, guestCount, pricing, step, session,
}: {
  villa: VillaData; startDate: string; endDate: string; days: number; guestCount: number
  pricing: ReturnType<typeof calcVillaPricing> | null; step: number; session: any
}) {
  const formatDate = (d: string) => {
    if (!d) return "—"
    return new Date(d + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="border border-mist-200 rounded-2xl p-5 space-y-4 sticky top-24">
      <div className="flex gap-4">
        <div className="w-24 h-16 bg-mist-100 rounded-xl overflow-hidden flex-shrink-0">
          {villa.image ? (
            <img src={villa.image} alt={villa.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-mist-400">No image</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-mist-900 text-sm">{villa.name}</h3>
          <p className="text-xs text-mist-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {villa.location}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-mist-500">Check-in: {formatDate(startDate)}</p>
            <p className="text-xs text-mist-500">Check-out: {formatDate(endDate)}</p>
          </div>
          <p className="text-xs text-mist-400 mt-1">{guestCount} guest{guestCount > 1 ? "s" : ""} · {villa.bedrooms} bedrooms</p>
        </div>
      </div>

      {step >= 2 && session?.user && (
        <div className="text-xs text-mist-500 space-y-0.5 border-t border-mist-100 pt-3">
          <p><span className="text-mist-700 font-medium">Full name:</span> {session.user.name || "—"}</p>
          <p><span className="text-mist-700 font-medium">Email:</span> {session.user.email || "—"}</p>
        </div>
      )}

      {pricing && days > 0 && (
        <div className="space-y-2 text-sm border-t border-mist-100 pt-3">
          <div className="flex justify-between text-mist-500">
            <span>${villa.pricePerNight.toLocaleString()} × {days} night{days > 1 ? "s" : ""}</span>
            <span className="text-mist-900">${pricing.nightsTotal.toLocaleString()}</span>
          </div>
          {pricing.cleaningFee > 0 && (
            <div className="flex justify-between text-mist-500">
              <span>Cleaning Fee</span>
              <span className="text-mist-900">${pricing.cleaningFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-mist-500">
            <span>Tax <span className="text-xs">(14%)</span></span>
            <span className="text-mist-900">${pricing.tax.toLocaleString()}</span>
          </div>
          {pricing.securityDeposit > 0 && (
            <div className="flex justify-between text-mist-500">
              <span>Security Deposit</span>
              <span className="text-mist-900">${pricing.securityDeposit.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-mist-100" />
          <div className="flex justify-between font-bold text-mist-900 text-base pt-1">
            <span>Total</span>
            <span>${pricing.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
