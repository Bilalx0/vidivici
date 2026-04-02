"use client"

import { useState, useEffect, useMemo, useRef, Suspense, Dispatch, SetStateAction } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ChevronDown,
  Minus,
  Plus,
  Info,
  CheckCircle,
  MapPin,
} from "lucide-react"
import PayPalBookingButton from "@/components/booking/PayPalBookingButton"

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

function calcVillaPricing(villa: VillaData, nights: number, airportTransfer: boolean) {
  const nightsTotal = villa.pricePerNight * nights
  const airportTransferFee = airportTransfer ? 500 : 0
  const subtotal = nightsTotal + villa.cleaningFee + airportTransferFee
  const tax = Math.round(subtotal * 0.14)
  const total = subtotal + tax + villa.securityDeposit
  const payNow = villa.securityDeposit
  const dueAtPickup = Math.max(0, total - payNow)
  return {
    nightsTotal,
    airportTransferFee,
    cleaningFee: villa.cleaningFee,
    tax,
    securityDeposit: villa.securityDeposit,
    payNow,
    dueAtPickup,
    total,
  }
}

function switchTemporalInputType(input: HTMLInputElement, kind: "date" | "time") {
  if (input.type !== "text") return
  input.type = kind
  requestAnimationFrame(() => {
    input.focus()
    if (typeof (input as HTMLInputElement & { showPicker?: () => void }).showPicker === "function") {
      try {
        ;(input as HTMLInputElement & { showPicker: () => void }).showPicker()
      } catch {
        // Safari may not support or may block showPicker; focus fallback still works.
      }
    }
  })
}

function getUploadedFileName(url: string) {
  if (!url) return "—"
  const clean = url.split("?")[0]
  const rawName = clean.split("/").pop() || ""
  if (!rawName) return "—"
  try {
    return decodeURIComponent(rawName)
  } catch {
    return rawName
  }
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
  const incomingType = searchParams.get("type")
  const sourceMode: "car" | "villa" | null =
    incomingType === "car" || incomingType === "villa"
      ? incomingType
      : searchParams.get("villa")
        ? "villa"
        : searchParams.get("car")
          ? "car"
          : null
  const initialMode = sourceMode === "villa" ? "villa" : "car"
  const isFlowLockedFromDetails = sourceMode !== null
  const [mode, setMode] = useState<"car" | "villa">(initialMode as "car" | "villa")
  const [step, setStep] = useState<1 | 2 | 3>(1)
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
  const [startTime, setStartTime] = useState(searchParams.get("startTime") || searchParams.get("checkInTime") || "")
  const [endTime, setEndTime] = useState(searchParams.get("endTime") || searchParams.get("checkOutTime") || "")

  /* ---- Car-specific state ---- */
  const [needDriver, setNeedDriver] = useState(searchParams.get("driver") === "1")
  const [driverHours, setDriverHours] = useState(Number(searchParams.get("driverHours")) || 8)
  const [driverAvailability, setDriverAvailability] = useState<"full" | "select">(
    (searchParams.get("driverAvailability") as "full" | "select") || "select"
  )
  const [driverDays, setDriverDays] = useState(Number(searchParams.get("driverDays")) || 1)

  /* ---- Villa-specific state ---- */
  const [guestCount, setGuestCount] = useState(Number(searchParams.get("guests")) || 1)
  const [villaAirportTransfer, setVillaAirportTransfer] = useState(searchParams.get("airportTransfer") === "1")
  const [villaPrivateChef, setVillaPrivateChef] = useState(searchParams.get("privateChef") === "1")
  const [villaSecurityService, setVillaSecurityService] = useState(searchParams.get("securityService") === "1")

  /* ---- Customer info state ---- */
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [driverLicenseUrl, setDriverLicenseUrl] = useState("")
  const [insuranceUrl, setInsuranceUrl] = useState("")
  const [uploadingLicense, setUploadingLicense] = useState(false)
  const [uploadingInsurance, setUploadingInsurance] = useState(false)
  const [villaIdDocumentName, setVillaIdDocumentName] = useState("")

  /* ---- Delivery state ---- */
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [returnAddress, setReturnAddress] = useState("")
  const [isOneWay, setIsOneWay] = useState(false)

  /* ---- Pay step state (removed - now using PayPal) ---- */

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
    () => (selectedVilla && days > 0 ? calcVillaPricing(selectedVilla, days, villaAirportTransfer) : null),
    [selectedVilla, days, villaAirportTransfer]
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

  const vehicleName = mode === "car" ? (selectedCar?.name || "Car") : (selectedVilla?.name || "Villa")
  const hasVehicle = mode === "car" ? !!selectedCar : !!selectedVilla
  const canProceed = hasVehicle
    && startDate
    && endDate
    && days > 0
    && (mode === "car" || (!!startTime && !!endTime && !!firstName && !!email && !!phone))

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Tabs */}
        <div className="flex gap-0 mb-8 border border-mist-200 rounded-md overflow-hidden max-w-sm mx-auto">
          <button
            onClick={() => {
              if ((isFlowLockedFromDetails && sourceMode !== "car") || step >= 2) return
              setMode("car")
              setStep(1)
            }}
            disabled={(isFlowLockedFromDetails && sourceMode !== "car") || (step >= 2 && mode !== "car")}
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
              mode === "car"
                ? "bg-mist-900 text-white"
                : ((isFlowLockedFromDetails && sourceMode !== "car") || step >= 2)
                  ? "text-mist-300 bg-mist-50 cursor-not-allowed"
                  : "text-mist-400 bg-mist-50 hover:bg-mist-100"
            }`}
          >
            Car
          </button>
          <button
            onClick={() => {
              if ((isFlowLockedFromDetails && sourceMode !== "villa") || step >= 2) return
              setMode("villa")
              setStep(1)
            }}
            disabled={(isFlowLockedFromDetails && sourceMode !== "villa") || (step >= 2 && mode !== "villa")}
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
              mode === "villa"
                ? "bg-mist-900 text-white"
                : ((isFlowLockedFromDetails && sourceMode !== "villa") || step >= 2)
                  ? "text-mist-300 bg-mist-50 cursor-not-allowed"
                  : "text-mist-400 bg-mist-50 hover:bg-mist-100"
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
          <div className={`flex-1 h-0.5 mx-2 -mt-3 ${step >= 2 ? "bg-blue-600" : "bg-mist-200"}`} />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-mist-200 text-mist-400"
            }`}>
              {step > 2 ? <CheckCircle size={16} /> : "2"}
            </div>
            <span className={`text-xs mt-1.5 ${step >= 2 ? "text-blue-600 font-medium" : "text-mist-400"}`}>Pay</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 -mt-3 ${step >= 3 ? "bg-blue-600" : "bg-mist-200"}`} />
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
                deliveryType={deliveryType}
                setDeliveryType={setDeliveryType}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                returnAddress={returnAddress}
                setReturnAddress={setReturnAddress}
                isOneWay={isOneWay}
                setIsOneWay={setIsOneWay}
                autoScrollToCustomerInfo={isFlowLockedFromDetails}
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
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                guestCount={guestCount}
                setGuestCount={setGuestCount}
                villaAirportTransfer={villaAirportTransfer}
                setVillaAirportTransfer={setVillaAirportTransfer}
                villaPrivateChef={villaPrivateChef}
                setVillaPrivateChef={setVillaPrivateChef}
                villaSecurityService={villaSecurityService}
                setVillaSecurityService={setVillaSecurityService}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                days={days}
                today={today}
                onNext={() => {
                  if (!session?.user) { router.push("/login"); return }
                  setStep(2)
                }}
                canProceed={!!canProceed}
                autoScrollToCustomerInfo={isFlowLockedFromDetails}
                villaIdDocumentName={villaIdDocumentName}
                setVillaIdDocumentName={setVillaIdDocumentName}
              />
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-mist-900">Complete Payment</h2>
                <p className="text-xs text-mist-400 leading-relaxed">
                  By placing this order, I agree to the{" "}
                  <span className="text-blue-600 cursor-pointer">Terms & Conditions</span> &{" "}
                  <span className="text-blue-600 cursor-pointer">Privacy Policy.</span>
                </p>
                <p className="text-xs text-mist-400 leading-relaxed">
                  We will temporarily authorize the funds via PayPal. Your payment will only be charged after the reservation is confirmed by our team and the contract is signed.
                </p>

                {mode === "car" && selectedCar && (
                  <PayPalBookingButton
                    bookingType="car"
                    bookingData={{
                      carId: selectedCar.id,
                      startDate,
                      endDate,
                      pickupLocation: selectedCar.location,
                      dropoffLocation: selectedCar.location,
                      deliveryType,
                      deliveryAddress: deliveryType === "delivery" ? deliveryAddress : undefined,
                      returnAddress: deliveryType === "delivery" ? (isOneWay ? returnAddress : deliveryAddress) : undefined,
                      isOneWay,
                      notes: needDriver ? `Driver: ${driverHours}hr/day × ${actualDriverDays} days` : undefined,
                    }}
                    totalPrice={carPricing.total}
                    onSuccess={(id) => {
                      setBookingId(id.slice(-6).toUpperCase())
                      setStep(3)
                    }}
                    onError={(msg) => alert(msg)}
                  />
                )}

                {mode === "villa" && selectedVilla && (
                  <PayPalBookingButton
                    bookingType="villa"
                    bookingData={{
                      villaId: selectedVilla.id,
                      checkIn: startDate,
                      checkOut: endDate,
                      guests: guestCount,
                      notes: [
                        `Check-in time: ${startTime || "N/A"}`,
                        `Check-out time: ${endTime || "N/A"}`,
                        `Customer: ${firstName || ""} ${lastName || ""}`.trim(),
                        `Email: ${email || "N/A"}`,
                        `Phone: ${phone || "N/A"}`,
                        [
                          villaAirportTransfer ? "Airport Transfer (Luxury SUV)" : null,
                          villaPrivateChef ? "Private Chef" : null,
                          villaSecurityService ? "Security Service" : null,
                        ].filter(Boolean).length
                          ? `Add-ons: ${[villaAirportTransfer ? "Airport Transfer (Luxury SUV)" : null, villaPrivateChef ? "Private Chef" : null, villaSecurityService ? "Security Service" : null].filter(Boolean).join(", ")}`
                          : "Add-ons: None",
                      ].join("\n"),
                    }}
                    totalPrice={villaPricing.total}
                    onSuccess={(id) => {
                      setBookingId(id.slice(-6).toUpperCase())
                      setStep(3)
                    }}
                    onError={(msg) => alert(msg)}
                  />
                )}

                <button onClick={() => setStep(1)}
                  className="w-full border border-mist-200 text-mist-700 py-3 rounded-md font-semibold text-sm hover:bg-mist-50 transition-colors">
                  Back
                </button>
              </div>
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
                driverLicenseUrl={driverLicenseUrl}
                insuranceUrl={insuranceUrl}
                session={session}
              />
            )}
            {mode === "villa" && selectedVilla && (
              <VillaSummaryCard
                villa={selectedVilla}
                startDate={startDate}
                endDate={endDate}
                startTime={startTime}
                endTime={endTime}
                days={days}
                guestCount={guestCount}
                pricing={villaPricing}
                step={step}
                session={session}
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                villaAirportTransfer={villaAirportTransfer}
                villaPrivateChef={villaPrivateChef}
                villaSecurityService={villaSecurityService}
                villaIdDocumentName={villaIdDocumentName}
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
  deliveryType, setDeliveryType,
  deliveryAddress, setDeliveryAddress,
  returnAddress, setReturnAddress,
  isOneWay, setIsOneWay,
  autoScrollToCustomerInfo,
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
  deliveryType: "pickup" | "delivery"
  setDeliveryType: (v: "pickup" | "delivery") => void
  deliveryAddress: string
  setDeliveryAddress: (v: string) => void
  returnAddress: string
  setReturnAddress: (v: string) => void
  isOneWay: boolean
  setIsOneWay: (v: boolean) => void
  autoScrollToCustomerInfo: boolean
}) {
  const [showOneWayInfo, setShowOneWayInfo] = useState(false)
  const customerInfoRef = useRef<HTMLDivElement | null>(null)
  const didAutoScrollRef = useRef(false)

  useEffect(() => {
    if (!autoScrollToCustomerInfo || didAutoScrollRef.current) return
    let attempts = 0
    let timerId: number | undefined

    const tryScroll = () => {
      const node = customerInfoRef.current
      if (node) {
        const top = Math.max(0, node.getBoundingClientRect().top + window.scrollY - 110)
        window.scrollTo({ top, behavior: "smooth" })
        didAutoScrollRef.current = true
        return
      }

      attempts += 1
      if (attempts < 8) {
        timerId = window.setTimeout(tryScroll, 120)
      }
    }

    timerId = window.setTimeout(tryScroll, 120)
    return () => window.clearTimeout(timerId)
  }, [autoScrollToCustomerInfo])

  const showCustomerInfo = Boolean(
    selectedCar
    && startDate
    && endDate
    && startTime
    && endTime
    && days > 0
  )

  return (
    <div className="space-y-8">
      {/* Select Vehicle */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">Select Vehicle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Make</label>
            <div className="relative">
              <select
                value={selectedBrandSlug}
                onChange={(e) => setSelectedBrandSlug(e.target.value)}
                className="w-full appearance-none border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-neutral-400 focus:outline-none pr-8"
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
                className="w-full appearance-none border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-neutral-400 focus:outline-none pr-8 disabled:opacity-50"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Start Date</label>
              <input
                type={startDate ? "date" : "text"}
                onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "date")}
                onFocus={(e) => switchTemporalInputType(e.currentTarget, "date")}
                onBlur={(e) => { if (!startDate) e.currentTarget.type = "text" }}
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start date*"
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Time</label>
              <input
                type={startTime ? "time" : "text"}
                onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "time")}
                onFocus={(e) => switchTemporalInputType(e.currentTarget, "time")}
                onBlur={(e) => { if (!startTime) e.currentTarget.type = "text" }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Time*"
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">End Date</label>
              <input
                type={endDate ? "date" : "text"}
                onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "date")}
                onFocus={(e) => switchTemporalInputType(e.currentTarget, "date")}
                onBlur={(e) => { if (!endDate) e.currentTarget.type = "text" }}
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End date*"
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Time</label>
              <input
                type={endTime ? "time" : "text"}
                onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "time")}
                onFocus={(e) => switchTemporalInputType(e.currentTarget, "time")}
                onBlur={(e) => { if (!endTime) e.currentTarget.type = "text" }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Time*"
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none" />
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
                  className="w-8 h-8 rounded-md border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50">
                  <Minus size={14} />
                </button>
                <span className="text-sm font-medium text-mist-900 w-6 text-center">{driverDays}</span>
                <button type="button" onClick={() => setDriverDays(Math.min(days || 365, driverDays + 1))}
                  className="w-8 h-8 rounded-md border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div ref={customerInfoRef} className="scroll-mt-28">
        {showCustomerInfo && (
          <>
        {/* Pickup / Delivery Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-8">
          <div className="flex w-fit self-start gap-0 border border-mist-200 rounded-md overflow-hidden">
            <button type="button" onClick={() => setDeliveryType("pickup")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                deliveryType === "pickup" ? "bg-mist-900 text-white" : "text-mist-400 bg-mist-50 hover:bg-mist-100"
              }`}>
              Pickup
            </button>
            <button type="button" onClick={() => setDeliveryType("delivery")}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                deliveryType === "delivery" ? "bg-mist-900 text-white" : "text-mist-400 bg-mist-50 hover:bg-mist-100"
              }`}>
              Delivery
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isOneWay} onChange={(e) => setIsOneWay(e.target.checked)}
                className="w-4 h-4 rounded border-mist-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-mist-600">One-way</span>
            </label>
            <button
              type="button"
              onClick={() => setShowOneWayInfo(true)}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-mist-400 transition-colors hover:bg-mist-100 hover:text-mist-700"
              aria-label="One-way information"
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        {showOneWayInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-mist-900">About one-way delivery</h3>
                <button
                  type="button"
                  onClick={() => setShowOneWayInfo(false)}
                  className="rounded-md px-2 py-1 text-sm text-mist-400 hover:bg-mist-100 hover:text-mist-700"
                  aria-label="Close"
                >
                  x
                </button>
              </div>
              <p className="text-sm leading-relaxed text-mist-600">
                One-way means your vehicle can be delivered to one address and collected from a different
                address at the end of your reservation. Additional relocation fees may apply based on
                distance and scheduling.
              </p>
              <button
                type="button"
                onClick={() => setShowOneWayInfo(false)}
                className="mt-5 w-full rounded-md bg-mist-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mist-700"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {(deliveryType === "delivery" || (deliveryType === "pickup" && isOneWay)) && (
          <div className="space-y-3 mb-4">
            {deliveryType === "delivery" && !isOneWay ? (
              <div>
                <label className="text-xs text-mist-500 block mb-1.5">Delivery & Return Address</label>
                <input type="text" placeholder="Delivery & return address" value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none" />
              </div>
            ) : deliveryType === "delivery" && isOneWay ? (
              <>
                <div>
                  <label className="text-xs text-mist-500 block mb-1.5">Delivery Address</label>
                  <input type="text" placeholder="Delivery address" value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-mist-500 block mb-1.5">Return Address</label>
                  <input type="text" placeholder="Return address" value={returnAddress}
                    onChange={(e) => setReturnAddress(e.target.value)}
                    className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none" />
                </div>
              </>
            ) : (
              <div>
                <label className="text-xs text-mist-500 block mb-1.5">Return Address</label>
                <input type="text" placeholder="Return address" value={returnAddress}
                  onChange={(e) => setReturnAddress(e.target.value)}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none" />
              </div>
            )}
          </div>
        )}

        <h2 className="text-lg font-semibold text-mist-900 mb-4">Customer Info</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">First Name <span className="text-red-400">*</span></label>
              <input type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Last Name</label>
              <input type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Email Address</label>
              <input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Phone Number</label>
              <input type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Drivers License</label>
              <input
                id="license-upload"
                type="file"
                accept="image/*"
                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm text-mist-700 file:mr-3 file:rounded-md file:border file:border-mist-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-mist-700"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onDocUpload(f, "license") }} />
              {uploadingLicense && <p className="mt-1 text-xs text-mist-400">Uploading...</p>}
              {driverLicenseUrl && (
                <a
                  href={driverLicenseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-mist-600 underline"
                >
                  View uploaded license
                </a>
              )}
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Insurance</label>
              <input
                id="insurance-upload"
                type="file"
                accept="image/*"
                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm text-mist-700 file:mr-3 file:rounded-md file:border file:border-mist-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-mist-700"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onDocUpload(f, "insurance") }} />
              {uploadingInsurance && <p className="mt-1 text-xs text-mist-400">Uploading...</p>}
              {insuranceUrl && (
                <a
                  href={insuranceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-mist-600 underline"
                >
                  View uploaded insurance
                </a>
              )}
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="w-full bg-mist-900 text-white py-3 rounded-md font-semibold text-sm hover:bg-mist-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
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
  startTime, setStartTime, endTime, setEndTime,
  guestCount, setGuestCount,
  villaAirportTransfer, setVillaAirportTransfer,
  villaPrivateChef, setVillaPrivateChef,
  villaSecurityService, setVillaSecurityService,
  firstName, setFirstName, lastName, setLastName, email, setEmail, phone, setPhone,
  villaIdDocumentName, setVillaIdDocumentName,
  days, today, onNext, canProceed,
  autoScrollToCustomerInfo,
}: {
  villaOptions: VillaData[]
  selectedVilla: VillaData | null
  setSelectedVilla: (v: VillaData | null) => void
  loadingVillas: boolean
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  startTime: string
  setStartTime: (v: string) => void
  endTime: string
  setEndTime: (v: string) => void
  guestCount: number
  setGuestCount: (v: number) => void
  villaAirportTransfer: boolean
  setVillaAirportTransfer: Dispatch<SetStateAction<boolean>>
  villaPrivateChef: boolean
  setVillaPrivateChef: Dispatch<SetStateAction<boolean>>
  villaSecurityService: boolean
  setVillaSecurityService: Dispatch<SetStateAction<boolean>>
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  days: number
  today: string
  onNext: () => void
  canProceed: boolean
  autoScrollToCustomerInfo: boolean
  villaIdDocumentName: string
  setVillaIdDocumentName: (v: string) => void
}) {
  const locations = [...new Set(villaOptions.map((v) => v.location))].sort()
  const [locationFilter, setLocationFilter] = useState("")
  const customerInfoRef = useRef<HTMLDivElement | null>(null)
  const didAutoScrollRef = useRef(false)

  useEffect(() => {
    if (!autoScrollToCustomerInfo || didAutoScrollRef.current) return
    let attempts = 0
    let timerId: number | undefined

    const tryScroll = () => {
      const node = customerInfoRef.current
      if (node) {
        const top = Math.max(0, node.getBoundingClientRect().top + window.scrollY - 110)
        window.scrollTo({ top, behavior: "smooth" })
        didAutoScrollRef.current = true
        return
      }

      attempts += 1
      if (attempts < 8) {
        timerId = window.setTimeout(tryScroll, 120)
      }
    }

    timerId = window.setTimeout(tryScroll, 120)
    return () => window.clearTimeout(timerId)
  }, [autoScrollToCustomerInfo])

  const showCustomerInfo = Boolean(
    selectedVilla
    && startDate
    && endDate
    && startTime
    && endTime
    && guestCount > 0
    && days > 0
  )

  const filteredVillas = locationFilter
    ? villaOptions.filter((v) => v.location === locationFilter)
    : villaOptions

  return (
    <div className="space-y-8">
      {/* Villa Info */}
      <div>
        <h2 className="text-3xl font-semibold text-mist-900 mb-4">Villa Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Villa Name</label>
            <div className="relative">
              <select
                value={selectedVilla?.slug || ""}
                onChange={(e) => {
                  const v = filteredVillas.find((x) => x.slug === e.target.value) || null
                  setSelectedVilla(v)
                }}
                className="w-full appearance-none border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-neutral-400 focus:outline-none pr-8"
              >
                <option value="">{loadingVillas ? "Loading..." : "Select a villa"}</option>
                {filteredVillas.map((v) => (
                  <option key={v.slug} value={v.slug}>{v.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Location</label>
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => { setLocationFilter(e.target.value); setSelectedVilla(null) }}
                disabled={loadingVillas}
                className="w-full appearance-none border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-neutral-400 focus:outline-none pr-8 disabled:opacity-50"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div>
        <h2 className="text-3xl font-semibold text-mist-900 mb-4">Stay Details</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type={startDate ? "date" : "text"}
                onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "date")}
                onFocus={(e) => switchTemporalInputType(e.currentTarget, "date")}
                onBlur={(e) => { if (!startDate) e.currentTarget.type = "text" }}
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Check-in"
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <input
                type={startTime ? "time" : "text"}
                onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "time")}
                onFocus={(e) => switchTemporalInputType(e.currentTarget, "time")}
                onBlur={(e) => { if (!startTime) e.currentTarget.type = "text" }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Time"
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <input
                type={endDate ? "date" : "text"}
                onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "date")}
                onFocus={(e) => switchTemporalInputType(e.currentTarget, "date")}
                onBlur={(e) => { if (!endDate) e.currentTarget.type = "text" }}
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Check-out"
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <input
                type={endTime ? "time" : "text"}
                onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "time")}
                onFocus={(e) => switchTemporalInputType(e.currentTarget, "time")}
                onBlur={(e) => { if (!endTime) e.currentTarget.type = "text" }}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Time"
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guests */}
      <div>
        <div className="relative">
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full appearance-none border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 bg-white focus:border-neutral-400 focus:outline-none pr-8"
          >
            {Array.from({ length: selectedVilla?.guests || 20 }, (_, i) => i + 1).map((count) => (
              <option key={count} value={count}>Number of Guests: {count}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none" />
        </div>
      </div>

      {/* Add-Ons */}
      <div>
        <h2 className="text-3xl font-semibold text-mist-900 mb-1">Add-Ons <span className="text-base italic text-mist-500 font-normal">(optional)</span></h2>
        <div className="space-y-3 mt-4">
          <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                checked={villaAirportTransfer}
                onClick={() => setVillaAirportTransfer((prev) => !prev)}
                onChange={() => { }}
                className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-mist-700">Airport Transfer (Luxury SUV)</span>
            </div>
          </label>

          <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                checked={villaPrivateChef}
                onClick={() => setVillaPrivateChef((prev) => !prev)}
                onChange={() => { }}
                className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-mist-700">Private Chef</span>
            </div>
          </label>

          <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                checked={villaSecurityService}
                onClick={() => setVillaSecurityService((prev) => !prev)}
                onChange={() => { }}
                className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-mist-700">Security Service</span>
            </div>
          </label>
        </div>
      </div>

      {/* Customer Info */}
      <div ref={customerInfoRef} className="border-t border-mist-200 pt-8 scroll-mt-28">
        {showCustomerInfo && (
          <>
        <h2 className="text-3xl font-semibold text-mist-900 mb-4">Customer Info</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1.5">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 placeholder:text-mist-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-mist-500 block mb-1.5">Upload ID / Passport</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setVillaIdDocumentName(file?.name || "")
              }}
              className="w-full text-sm text-mist-500 file:mr-3 file:rounded-md file:border file:border-mist-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-mist-700 hover:file:bg-mist-50"
            />
          </div>
        </div>
          </>
        )}
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="w-full bg-mist-900 text-white py-3 rounded-md font-semibold text-sm hover:bg-mist-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Next
      </button>
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
      <h2 className="text-2xl font-bold text-mist-900">Reservation Submitted!</h2>
      <p className="text-mist-500 text-sm max-w-md mx-auto">
        Your payment has been authorized for <span className="font-medium text-mist-900">{vehicleName}</span>.
        Our team will review availability and send you a contract to sign. You will only be charged after confirmation.
      </p>
      <p className="text-xs text-mist-400">
        Booking Reference: <span className="font-mono font-semibold text-mist-700">VV-{bookingId}</span>
      </p>
      <p className="text-xs text-mist-400">
        Free cancellation within 24 hours from the time you place the order.
      </p>
      <div className="flex gap-3 justify-center pt-4">
        <Link href="/account/bookings"
          className="px-6 py-2.5 bg-mist-900 text-white rounded-md text-sm font-semibold hover:bg-mist-700 transition-colors">
          View My Bookings
        </Link>
        <Link href={mode === "car" ? "/cars" : "/villas"}
          className="px-6 py-2.5 border border-mist-200 text-mist-700 rounded-md text-sm font-semibold hover:bg-mist-50 transition-colors">
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
  needDriver, driverHours, actualDriverDays,
  driverLicenseUrl, insuranceUrl,
  session,
}: {
  car: CarData; startDate: string; endDate: string; startTime: string; endTime: string
  days: number; pricing: ReturnType<typeof calcCarPricing> | null
  needDriver: boolean; driverHours: number; actualDriverDays: number
  driverLicenseUrl: string; insuranceUrl: string
  session: any
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
        <div className="w-24 h-16 bg-mist-100 rounded-xl overflow-hidden shrink-0">
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
              <div className="w-2 h-2 rounded-full bg-mist-900 mt-1 shrink-0" />
              <div className="text-xs text-mist-500">
                <p>{formatDate(startDate, startTime)}</p>
                <p className="text-mist-400">{car.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-mist-400 mt-1 shrink-0" />
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

      <div className="text-xs text-mist-500 space-y-0.5 border-t border-mist-100 pt-3">
        <p><span className="text-mist-700 font-medium">Full name:</span> {session?.user?.name || "—"}</p>
        <p><span className="text-mist-700 font-medium">Email:</span> {session?.user?.email || "—"}</p>
        <p><span className="text-mist-700 font-medium">Driver License:</span> {getUploadedFileName(driverLicenseUrl)}</p>
        <p><span className="text-mist-700 font-medium">Insurance:</span> {getUploadedFileName(insuranceUrl)}</p>
      </div>

      <p className="text-xs text-mist-400 border-t border-mist-100 pt-3">
        Free cancellation within 24 hours from the time you place the order.
      </p>

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
  villa, startDate, endDate, startTime, endTime, days, guestCount, pricing, step, session,
  firstName, lastName, email, phone,
  villaAirportTransfer, villaPrivateChef, villaSecurityService,
  villaIdDocumentName,
}: {
  villa: VillaData; startDate: string; endDate: string; startTime: string; endTime: string; days: number; guestCount: number
  pricing: ReturnType<typeof calcVillaPricing> | null; step: number; session: any
  firstName: string; lastName: string; email: string; phone: string
  villaAirportTransfer: boolean; villaPrivateChef: boolean; villaSecurityService: boolean
  villaIdDocumentName: string
}) {
  const formatDate = (d: string) => {
    if (!d) return "—"
    return new Date(d + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="border border-mist-200 rounded-2xl p-5 space-y-4 sticky top-24">
      <div className="flex gap-4">
        <div className="w-24 h-16 bg-mist-100 rounded-xl overflow-hidden shrink-0">
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

      <div className="text-xs text-mist-500 space-y-0.5 border-t border-mist-100 pt-3">
        <p><span className="text-mist-700 font-medium">Full name:</span> {(firstName || lastName) ? `${firstName} ${lastName}`.trim() : (session?.user?.name || "—")}</p>
        <p><span className="text-mist-700 font-medium">Email:</span> {email || session?.user?.email || "—"}</p>
        <p><span className="text-mist-700 font-medium">Phone number:</span> {phone || "—"}</p>
        <p><span className="text-mist-700 font-medium">Upload ID / Passport:</span> {villaIdDocumentName || "—"}</p>
      </div>

      <p className="text-xs text-mist-400 border-t border-mist-100 pt-3">
        Free cancellation within 24 hours from the time you place the order.
      </p>

      {pricing && days > 0 && (
        <div className="space-y-2 text-sm border-t border-mist-100 pt-3">
          <div className="flex justify-between text-mist-500">
            <span>Nightly Rate <span className="text-xs">(${villa.pricePerNight.toLocaleString()} × {days} night{days > 1 ? "s" : ""})</span></span>
            <span className="text-mist-900">${pricing.nightsTotal.toLocaleString()}</span>
          </div>
          {villaAirportTransfer && (
            <div className="flex justify-between text-mist-500">
              <span>Airport Transfer</span>
              <span className="text-mist-900">${pricing.airportTransferFee.toLocaleString()}</span>
            </div>
          )}
          {villaPrivateChef && (
            <div className="flex justify-between text-mist-500">
              <span>Private Chef</span>
              <span className="text-mist-900">TBD</span>
            </div>
          )}
          {villaSecurityService && (
            <div className="flex justify-between text-mist-500">
              <span>Security Service</span>
              <span className="text-mist-900">TBD</span>
            </div>
          )}
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
              <span>Security Deposit <span className="text-xs">(Fully Refundable)</span></span>
              <span className="text-mist-900">${pricing.securityDeposit.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-mist-100" />
          <div className="flex justify-between text-mist-500">
            <span>Pay Now <span className="text-xs">(Authorize Hold)</span></span>
            <span className="text-blue-600">${pricing.payNow.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-mist-500">
            <span>Due at Pickup</span>
            <span className="text-mist-900">${pricing.dueAtPickup.toLocaleString()}</span>
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

