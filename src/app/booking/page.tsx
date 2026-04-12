"use client"

import { useState, useEffect, useMemo, useRef, Suspense, Dispatch, SetStateAction } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ArrowLeft,
  ChevronDown,
  Minus,
  Plus,
  Info,
  CheckCircle,
  X,
  MapPin,
} from "lucide-react"
import PayPalBookingButton from "@/components/booking/PayPalBookingButton"
import Turnstile from "@/components/Turnstile"
import DateRangeCalendarPopup, { DateTriggerField } from "@/components/ui/FloatingDatePickerField"
import TimeSelectDropdown from "@/components/ui/TimeSelectDropdown"

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
  needDriver: boolean,
  driverAvailability: "full" | "select",
  couponPercent = 0,
  carTaxPercent = 8.5,
  startTime = "",
  endTime = ""
) {
  const securityHold = 5000
  const subtotal = pricePerDay * days
  const discountPercent = getDiscount(days)
  const discountAmount = Math.round(subtotal * (discountPercent / 100))
  const driverTotal = needDriver ? driverDays * driverHours * 45 : 0

  // Extra hours: when return time is later than pickup time, charge 25% of
  // the discounted daily rate per extra hour, first hour complimentary.
  let extraHours = 0
  let extraHoursCharge = 0
  if (startTime && endTime) {
    const [sh, sm] = startTime.split(":").map(Number)
    const [eh, em] = endTime.split(":").map(Number)
    const startMin = sh * 60 + (sm || 0)
    const endMin = eh * 60 + (em || 0)
    if (endMin > startMin) {
      extraHours = Math.ceil((endMin - startMin) / 60)
      const chargeableHours = Math.max(0, extraHours - 1)
      const discountedDailyRate = pricePerDay * (1 - discountPercent / 100)
      extraHoursCharge = Math.round(chargeableHours * discountedDailyRate * 0.25)
    }
  }

  const afterDiscount = subtotal - discountAmount + driverTotal + extraHoursCharge
  const couponAmount = couponPercent > 0 ? Math.round(afterDiscount * (couponPercent / 100)) : 0
  const preTax = afterDiscount - couponAmount
  const tax = Math.round(preTax * (carTaxPercent / 100))
  const rentalTotal = preTax + tax
  const total = rentalTotal + 2000 // rental + $2,000 refundable deposit
  const payNowTotal = securityHold // $5,000 authorization hold (no charge)
  const dueAtPickup = Math.max(0, total - securityHold)
  return { subtotal, discountPercent, discountAmount, couponAmount, couponPercent, driverTotal, extraHours, extraHoursCharge, tax, securityHold, payNowTotal, dueAtPickup, total, rentalTotal }
}

function calcVillaPricing(villa: VillaData, nights: number, airportTransfer: boolean, couponPercent = 0, villaTaxPercent = 14) {
  const villaDeposit = 5000
  const nightsTotal = villa.pricePerNight * nights
  const airportTransferFee = airportTransfer ? 500 : 0
  const subtotal = nightsTotal + villa.cleaningFee + airportTransferFee
  const couponAmount = couponPercent > 0 ? Math.round(subtotal * (couponPercent / 100)) : 0
  const afterCoupon = subtotal - couponAmount
  const tax = Math.round(afterCoupon * (villaTaxPercent / 100))
  const total = afterCoupon + tax + villa.securityDeposit
  const payNow = villaDeposit
  const dueAtPickup = Math.max(0, total - payNow)
  return {
    nightsTotal,
    airportTransferFee,
    cleaningFee: villa.cleaningFee,
    couponAmount,
    couponPercent,
    tax,
    securityDeposit: villa.securityDeposit,
    villaDeposit,
    payNow,
    dueAtPickup,
    total,
  }
}

function switchTemporalInputType(input: HTMLInputElement, kind: "date" | "time") {
  if (input.type !== "text") return
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

  const lockedWidth = Math.ceil(input.getBoundingClientRect().width)
  if (isIOS && lockedWidth > 0) {
    // Prevent iOS Safari from resizing date/time controls while switching input type.
    input.style.width = `${lockedWidth}px`
    input.style.minWidth = `${lockedWidth}px`
    input.style.maxWidth = `${lockedWidth}px`
    input.style.fontSize = "16px"
  }
  input.type = kind
  requestAnimationFrame(() => {
    input.focus()
    if (typeof (input as HTMLInputElement & { showPicker?: () => void }).showPicker === "function") {
      try {
        ; (input as HTMLInputElement & { showPicker: () => void }).showPicker()
      } catch {
        // Safari may not support or may block showPicker; focus fallback still works.
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

const temporalInputClass = "ios-temporal-input w-full max-w-full min-w-0 box-border border border-neutral-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:border-neutral-400 focus:outline-none"

const TIME_OPTIONS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "17:30", label: "5:30 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
]

function getTemporalSelectClass() {
  return "w-full appearance-none bg-white border border-mist-300 rounded-md px-3 text-sm text-mist-900 focus:outline-none focus:border-mist-400 h-11 pt-5 pb-1 peer"
}

function getTemporalTopLabelClass(hasValue: boolean) {
  return `pointer-events-none absolute left-3 top-1 text-[10px] text-mist-400 transition-opacity duration-150 ${hasValue ? "opacity-100" : "opacity-0 peer-focus:opacity-100"}`
}

function getTemporalCenterLabelClass(hasValue: boolean) {
  return `pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-mist-300 transition-opacity duration-150 ${hasValue ? "opacity-0" : "opacity-100 peer-focus:opacity-0"}`
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

  /* ---- Booked date ranges (availability blocking) ---- */
  const [bookedRanges, setBookedRanges] = useState<{ start: string; end: string }[]>([])

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
  const [driverLicenseFileName, setDriverLicenseFileName] = useState("")
  const [insuranceUrl, setInsuranceUrl] = useState("")
  const [insuranceFileName, setInsuranceFileName] = useState("")
  const [uploadingLicense, setUploadingLicense] = useState(false)
  const [uploadingInsurance, setUploadingInsurance] = useState(false)
  const [villaIdDocumentName, setVillaIdDocumentName] = useState("")
  const [villaIdDocumentUrl, setVillaIdDocumentUrl] = useState("")
  const [uploadingVillaId, setUploadingVillaId] = useState(false)

  /* ---- Delivery state ---- */
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [returnAddress, setReturnAddress] = useState("")
  const [isOneWay, setIsOneWay] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("paypal")

  /* ---- Coupon state ---- */
  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState("")
  const [couponError, setCouponError] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)

  /* ---- Tax rates (from settings) ---- */
  const [carTaxPercent, setCarTaxPercent] = useState(8.5)
  const [villaTaxPercent, setVillaTaxPercent] = useState(14)

  /* ---- Credit card form state ---- */
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardBillingAddress, setCardBillingAddress] = useState("")
  const [cardCountry, setCardCountry] = useState("")
  const [cardZip, setCardZip] = useState("")
  const [placingOrder, setPlacingOrder] = useState(false)
  const [cardError, setCardError] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")

  const today = new Date().toISOString().split("T")[0]

  /* ---- Save booking state to sessionStorage before login redirect ---- */
  const saveBookingState = () => {
    const state = {
      mode, selectedBrandSlug,
      selectedCar: selectedCar ? { id: selectedCar.id, slug: selectedCar.slug, name: selectedCar.name, brandName: selectedCar.brandName, pricePerDay: selectedCar.pricePerDay, milesIncluded: selectedCar.milesIncluded, extraMileRate: selectedCar.extraMileRate, minRentalDays: selectedCar.minRentalDays, location: selectedCar.location, image: selectedCar.image } : null,
      selectedVilla: selectedVilla ? { id: selectedVilla.id, slug: selectedVilla.slug, name: selectedVilla.name, location: selectedVilla.location, pricePerNight: selectedVilla.pricePerNight, cleaningFee: selectedVilla.cleaningFee, securityDeposit: selectedVilla.securityDeposit, bedrooms: selectedVilla.bedrooms, guests: selectedVilla.guests, image: selectedVilla.image } : null,
      startDate, endDate, startTime, endTime,
      needDriver, driverHours, driverAvailability, driverDays,
      guestCount, villaAirportTransfer, villaPrivateChef, villaSecurityService,
      firstName, lastName, email, phone,
      driverLicenseUrl, driverLicenseFileName, insuranceUrl, insuranceFileName,
      villaIdDocumentName, villaIdDocumentUrl,
      deliveryType, deliveryAddress, returnAddress, isOneWay,
    }
    sessionStorage.setItem("bookingState", JSON.stringify(state))
  }

  const redirectToLogin = () => {
    saveBookingState()
    router.push("/login?callbackUrl=/booking")
  }

  /* ---- Restore booking state from sessionStorage after login ---- */
  useEffect(() => {
    const raw = sessionStorage.getItem("bookingState")
    if (!raw || !session?.user) return
    try {
      const s = JSON.parse(raw)
      if (s.mode) setMode(s.mode)
      if (s.selectedBrandSlug) setSelectedBrandSlug(s.selectedBrandSlug)
      if (s.selectedCar) setSelectedCar(s.selectedCar)
      if (s.selectedVilla) setSelectedVilla(s.selectedVilla)
      if (s.startDate) setStartDate(s.startDate)
      if (s.endDate) setEndDate(s.endDate)
      if (s.startTime) setStartTime(s.startTime)
      if (s.endTime) setEndTime(s.endTime)
      if (s.needDriver) setNeedDriver(s.needDriver)
      if (s.driverHours) setDriverHours(s.driverHours)
      if (s.driverAvailability) setDriverAvailability(s.driverAvailability)
      if (s.driverDays) setDriverDays(s.driverDays)
      if (s.guestCount) setGuestCount(s.guestCount)
      if (s.villaAirportTransfer) setVillaAirportTransfer(s.villaAirportTransfer)
      if (s.villaPrivateChef) setVillaPrivateChef(s.villaPrivateChef)
      if (s.villaSecurityService) setVillaSecurityService(s.villaSecurityService)
      if (s.firstName) setFirstName(s.firstName)
      if (s.lastName) setLastName(s.lastName)
      if (s.email) setEmail(s.email)
      if (s.phone) setPhone(s.phone)
      if (s.driverLicenseUrl) { setDriverLicenseUrl(s.driverLicenseUrl); setDriverLicenseFileName(s.driverLicenseFileName || "") }
      if (s.insuranceUrl) { setInsuranceUrl(s.insuranceUrl); setInsuranceFileName(s.insuranceFileName || "") }
      if (s.villaIdDocumentUrl) { setVillaIdDocumentUrl(s.villaIdDocumentUrl); setVillaIdDocumentName(s.villaIdDocumentName || "") }
      if (s.deliveryType) setDeliveryType(s.deliveryType)
      if (s.deliveryAddress) setDeliveryAddress(s.deliveryAddress)
      if (s.returnAddress) setReturnAddress(s.returnAddress)
      if (s.isOneWay) setIsOneWay(s.isOneWay)
      sessionStorage.removeItem("bookingState")
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  /* ---- Fetch brands + settings on mount ---- */
  useEffect(() => {
    fetch("/api/brands")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const b = Array.isArray(data) ? data : []
        setBrands(b.map((x: any) => ({ id: x.id, name: x.name, slug: x.slug })))
      })
      .catch(() => { })
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : {}))
      .then((s: any) => {
        if (s.carTaxPercent) setCarTaxPercent(parseFloat(s.carTaxPercent))
        if (s.villaTaxPercent) setVillaTaxPercent(parseFloat(s.villaTaxPercent))
      })
      .catch(() => { })
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

  /* ---- Fetch booked date ranges when car/villa is selected ---- */
  useEffect(() => {
    if (mode === "car" && selectedCar) {
      fetch(`/api/cars/${selectedCar.id}/availability`)
        .then((r) => (r.ok ? r.json() : { bookedRanges: [] }))
        .then((data) => setBookedRanges(data.bookedRanges || []))
        .catch(() => setBookedRanges([]))
    } else if (mode === "villa" && selectedVilla) {
      fetch(`/api/villas/${selectedVilla.id}/availability`)
        .then((r) => (r.ok ? r.json() : { bookedRanges: [] }))
        .then((data) => setBookedRanges(data.bookedRanges || []))
        .catch(() => setBookedRanges([]))
    } else {
      setBookedRanges([])
    }
  }, [mode, selectedCar, selectedVilla])

  useEffect(() => {
    if (step >= 2) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [step])

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
            if (profile.driverLicense && !driverLicenseUrl) {
              setDriverLicenseUrl(profile.driverLicense)
              setDriverLicenseFileName(getUploadedFileName(profile.driverLicense))
            }
            if (profile.insurance && !insuranceUrl) {
              setInsuranceUrl(profile.insurance)
              setInsuranceFileName(getUploadedFileName(profile.insurance))
            }
          }
        })
        .catch(() => { })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  /* ---- File upload helper ---- */
  const handleDocUpload = async (file: File, type: "license" | "insurance") => {
    const setter = type === "license" ? setDriverLicenseUrl : setInsuranceUrl
    const setFileName = type === "license" ? setDriverLicenseFileName : setInsuranceFileName
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
        setFileName(file.name)
        // Save to profile
        fetch("/api/account/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [type === "license" ? "driverLicense" : "insurance"]: url }),
        }).catch(() => { })
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
    () => (selectedCar ? calcCarPricing(selectedCar.pricePerDay, days, driverHours, actualDriverDays, needDriver, driverAvailability, couponDiscount, carTaxPercent, startTime, endTime) : null),
    [selectedCar, days, driverHours, actualDriverDays, needDriver, driverAvailability, couponDiscount, carTaxPercent, startTime, endTime]
  )

  const villaPricing = useMemo(
    () => (selectedVilla && days > 0 ? calcVillaPricing(selectedVilla, days, villaAirportTransfer, couponDiscount, villaTaxPercent) : null),
    [selectedVilla, days, villaAirportTransfer, couponDiscount, villaTaxPercent]
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

  const handlePlaceOrder = async () => {
    setCardError("")
    if (!cardName.trim()) { setCardError("Please enter the name on your card."); return }
    const digits = cardNumber.replace(/\s/g, "")
    if (digits.length < 13) { setCardError("Please enter a valid card number."); return }
    if (cardExpiry.length < 5) { setCardError("Please enter a valid expiration date."); return }
    if (cardCvv.length < 3) { setCardError("Please enter your security code."); return }
    setPlacingOrder(true)
    try {
      let res: Response
      if (mode === "car" && selectedCar) {
        res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        })
      } else if (mode === "villa" && selectedVilla) {
        res = await fetch("/api/villa-bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
              [villaAirportTransfer ? "Airport Transfer (Luxury SUV)" : null, villaPrivateChef ? "Private Chef" : null, villaSecurityService ? "Security Service" : null].filter(Boolean).length
                ? `Add-ons: ${[villaAirportTransfer ? "Airport Transfer (Luxury SUV)" : null, villaPrivateChef ? "Private Chef" : null, villaSecurityService ? "Security Service" : null].filter(Boolean).join(", ")}`
                : "Add-ons: None",
            ].join("\n"),
          }),
        })
      } else {
        setCardError("No booking data. Please go back and select a vehicle.")
        setPlacingOrder(false)
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create booking")
      if (couponApplied) fetch("/api/coupons/use", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponApplied }) }).catch(() => {})
      setBookingId((data.id || "").slice(-6).toUpperCase())
      setStep(3)
    } catch (err: any) {
      setCardError(err.message || "Something went wrong. Please try again.")
    } finally {
      setPlacingOrder(false)
    }
  }

  const vehicleName = mode === "car" ? (selectedCar?.name || "Car") : (selectedVilla?.name || "Villa")
  const hasVehicle = mode === "car" ? !!selectedCar : !!selectedVilla

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError("")
    try {
      const scope = mode === "car" ? "car" : "villa"
      const itemId = mode === "car" ? selectedCar?.id : selectedVilla?.id
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), scope, itemId }),
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
  // Auto-set fixed villa check-in/out times
  useEffect(() => {
    if (mode === "villa") {
      if (startTime !== "15:00") setStartTime("15:00")
      if (endTime !== "11:00") setEndTime("11:00")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const canProceed = hasVehicle
    && startDate
    && endDate
    && days > 0
    && (mode === "car"
      ? (!!driverLicenseUrl && !!insuranceUrl)
      : (!!firstName && !!email && !!phone && !!villaIdDocumentUrl))

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="sm:px-16 lg:px-20 px-6 2xl:px-56">
        {step > 1 && (
          <div className="mb-10">
            <button
              type="button"
              onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))}
              className="inline-flex h-10 w-10 items-center justify-center"
              aria-label="Back"
            >
              <ArrowLeft size={25} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border border-mist-200 rounded-md overflow-hidden max-w-sm mx-auto">
          <button
            onClick={() => {
              if ((isFlowLockedFromDetails && sourceMode !== "car") || step >= 2) return
              setMode("car")
              setStep(1)
            }}
            disabled={(isFlowLockedFromDetails && sourceMode !== "car") || (step >= 2 && mode !== "car")}
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${mode === "car"
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
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-colors ${mode === "villa"
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? "bg-blue-600 text-white" : "bg-mist-200 text-mist-400"
              }`}>
              {step > 1 ? <CheckCircle size={16} /> : "1"}
            </div>
            <span className={`text-xs mt-1.5 ${step >= 1 ? "text-blue-600 font-medium" : "text-mist-400"}`}>Select</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 -mt-3 ${step >= 2 ? "bg-blue-600" : "bg-mist-200"}`} />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? "bg-blue-600 text-white" : "bg-mist-200 text-mist-400"
              }`}>
              {step > 2 ? <CheckCircle size={16} /> : "2"}
            </div>
            <span className={`text-xs mt-1.5 ${step >= 2 ? "text-blue-600 font-medium" : "text-mist-400"}`}>Pay</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 -mt-3 ${step >= 3 ? "bg-blue-600" : "bg-mist-200"}`} />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? "bg-blue-600 text-white" : "bg-mist-200 text-mist-400"
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
                  if (!session?.user) { redirectToLogin(); return }
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
                setDriverLicenseUrl={setDriverLicenseUrl}
                driverLicenseFileName={driverLicenseFileName}
                setDriverLicenseFileName={setDriverLicenseFileName}
                insuranceUrl={insuranceUrl}
                setInsuranceUrl={setInsuranceUrl}
                insuranceFileName={insuranceFileName}
                setInsuranceFileName={setInsuranceFileName}
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
                bookedRanges={bookedRanges}
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
                  if (!session?.user) { redirectToLogin(); return }
                  setStep(2)
                }}
                canProceed={!!canProceed}
                autoScrollToCustomerInfo={isFlowLockedFromDetails}
                villaIdDocumentName={villaIdDocumentName}
                setVillaIdDocumentName={setVillaIdDocumentName}
                villaIdDocumentUrl={villaIdDocumentUrl}
                setVillaIdDocumentUrl={setVillaIdDocumentUrl}
                uploadingVillaId={uploadingVillaId}
                setUploadingVillaId={setUploadingVillaId}
                bookedRanges={bookedRanges}
              />
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-mist-900">Card Info</h2>

                {/* Coupon Code */}
                <div className="rounded-xl border border-mist-200 p-4">
                  <label className="text-sm font-medium text-mist-700 block mb-2">Promo Code</label>
                  {couponApplied ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <div>
                        <span className="text-sm font-semibold text-green-700">{couponApplied}</span>
                        <span className="text-xs text-green-600 ml-2">{couponDiscount}% OFF applied</span>
                      </div>
                      <button type="button" onClick={removeCoupon} className="text-green-600 hover:text-green-800 text-sm font-medium">Remove</button>
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
                      {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-mist-200 overflow-hidden">
                    {/* Credit Card Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`w-full flex items-center justify-between px-4 py-3.5 text-sm transition-colors ${paymentMethod === "card" ? "bg-blue-50/60 border-b border-mist-200" : "bg-white hover:bg-mist-50"}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`h-5 w-5 rounded-full border-2 ${paymentMethod === "card" ? "border-blue-600" : "border-mist-300"} flex items-center justify-center shrink-0`}>
                          {paymentMethod === "card" && <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
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
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                              <span className="w-4 h-3 rounded-sm bg-mist-200" />
                            </span>
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
                              className="w-full rounded-lg border border-mist-200 bg-white pl-10 pr-3.5 py-3 text-sm text-mist-700 placeholder:text-mist-300 focus:outline-none focus:border-mist-400 tracking-wider"
                            />
                          </div>
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

                    {/* Divider between options */}
                    <div className="border-t border-mist-200" />

                    {/* PayPal Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${paymentMethod === "paypal" ? "bg-blue-50/60" : "bg-white hover:bg-mist-50"}`}
                    >
                      <span className={`h-5 w-5 rounded-full border-2 ${paymentMethod === "paypal" ? "border-blue-600" : "border-mist-300"} flex items-center justify-center shrink-0`}>
                        {paymentMethod === "paypal" && <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                      </span>
                      <span className="font-medium text-mist-900">PayPal</span>
                    </button>
                  </div>

                  <p className="text-xs text-mist-400 leading-relaxed">
                    By placing this order, I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">Terms &amp; Conditions</Link> &{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                  </p>

                  <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

                  {mode === "car" ? (
                    <ul className="text-xs text-mist-400 leading-relaxed list-disc list-inside space-y-1">
                      <li>A temporary authorization hold of up to $5,000 will be placed on your card (this includes the $2,000 refundable deposit).</li>
                      <li>No charges will be made at the time of booking.</li>
                      <li>Any remaining balance above $5,000 will be due before or at vehicle delivery (card or wire transfer).</li>
                      <li>After the rental, the final amount will be charged and the $2,000 deposit will be released if no additional charges apply.</li>
                    </ul>
                  ) : (
                    <p className="text-xs text-mist-400 leading-relaxed">
                      {paymentMethod === "card"
                        ? "We will temporarily reserve the funds on your credit card with a pre-authorization. Your credit card will only be charged after the reservation gets confirmed by the Sales Team."
                        : "We will temporarily authorize the funds via PayPal. Your payment will only be charged after the reservation is confirmed by our team and the contract is signed."}
                    </p>
                  )}

                  {paymentMethod === "paypal" && mode === "car" && selectedCar && (
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
                      totalPrice={carPricing.payNowTotal}
                      onSuccess={(id) => {
                        if (couponApplied) fetch("/api/coupons/use", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponApplied }) }).catch(() => {})
                        setBookingId(id.slice(-6).toUpperCase())
                        setStep(3)
                      }}
                      onError={(msg) => alert(msg)}
                    />
                  )}

                  {paymentMethod === "paypal" && mode === "villa" && selectedVilla && (
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
                      totalPrice={villaPricing.payNow}
                      onSuccess={(id) => {
                        if (couponApplied) fetch("/api/coupons/use", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponApplied }) }).catch(() => {})
                        setBookingId(id.slice(-6).toUpperCase())
                        setStep(3)
                      }}
                      onError={(msg) => alert(msg)}
                    />
                  )}
                </div>

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
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                session={session}
                carTaxPercent={carTaxPercent}
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
                villaTaxPercent={villaTaxPercent}
              />
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
  driverLicenseUrl, setDriverLicenseUrl, insuranceUrl, setInsuranceUrl,
  driverLicenseFileName, setDriverLicenseFileName, insuranceFileName, setInsuranceFileName,
  uploadingLicense, uploadingInsurance, onDocUpload,
  deliveryType, setDeliveryType,
  deliveryAddress, setDeliveryAddress,
  returnAddress, setReturnAddress,
  isOneWay, setIsOneWay,
  autoScrollToCustomerInfo,
  bookedRanges,
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
  driverLicenseUrl: string; setDriverLicenseUrl: (v: string) => void
  driverLicenseFileName: string; setDriverLicenseFileName: (v: string) => void
  insuranceUrl: string; setInsuranceUrl: (v: string) => void
  insuranceFileName: string; setInsuranceFileName: (v: string) => void
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
  bookedRanges: { start: string; end: string }[]
}) {
  const [showOneWayInfo, setShowOneWayInfo] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const customerInfoRef = useRef<HTMLDivElement | null>(null)
  const didAutoScrollRef = useRef(false)
  const licenseInputRef = useRef<HTMLInputElement>(null)
  const insuranceInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!autoScrollToCustomerInfo || didAutoScrollRef.current) return
    let attempts = 0
    let timerId: number | undefined

    const tryScroll = () => {
      const node = customerInfoRef.current
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" })
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

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    if (!value) setStartTime("")
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    if (!value) setEndTime("")
  }

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
                  <option key={c.slug} value={c.slug}>{c.name}</option>
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
              <DateTriggerField
                label="Start date*"
                value={startDate}
                onClick={() => setCalendarOpen(true)}
              />
            </div>
            <TimeSelectDropdown
              label="Time*"
              value={startTime}
              onChange={setStartTime}
              options={TIME_OPTIONS}
              disabled={!startDate}
              desktop
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <DateTriggerField
                label="End date*"
                value={endDate}
                onClick={() => setCalendarOpen(true)}
              />
            </div>
            <TimeSelectDropdown
              label="Time*"
              value={endTime}
              onChange={setEndTime}
              options={TIME_OPTIONS}
              disabled={!endDate}
              desktop
            />
          </div>
        </div>

        <DateRangeCalendarPopup
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          minDate={today}
          startLabel="start date"
          endLabel="end date"
          bookedRanges={bookedRanges}
        />
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
              <input
                type="range"
                min={5}
                max={15}
                step={1}
                value={driverHours}
                onChange={(e) => setDriverHours(Number(e.target.value))}
                className="w-full accent-mist-500"
              />
              <div className="flex justify-between text-[10px] text-mist-400 mt-1">
                <span>5 hr</span>
                <span>{driverHours} hr</span>
                <span>15 hr</span>
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
            <div className="flex flex-row items-center justify-between gap-3 my-8">
              <div className="flex w-fit self-start gap-0 border border-mist-200 rounded-md overflow-hidden">
                <button type="button" onClick={() => setDeliveryType("pickup")}
                  className={`px-5 py-2 text-sm font-medium transition-colors ${deliveryType === "pickup" ? "bg-mist-900 text-white" : "text-mist-400 bg-mist-50 hover:bg-mist-100"
                    }`}>
                  Pickup
                </button>
                <button type="button" onClick={() => setDeliveryType("delivery")}
                  className={`px-5 py-2 text-sm font-medium transition-colors ${deliveryType === "delivery" ? "bg-mist-900 text-white" : "text-mist-400 bg-mist-50 hover:bg-mist-100"
                    }`}>
                  Delivery
                </button>
              </div>
              <div className="flex items-center gap-1">
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
              <div className="grid  grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {/* Driver License Upload */}
                <div>
                  <label className="text-xs text-mist-500 block mb-1.5">Drivers License <span className="text-red-400">*</span></label>
                  <div className="relative h-11">
                    {!driverLicenseUrl ? (
                      <input
                        ref={licenseInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="w-full h-full border border-neutral-300 rounded-md px-3 py-[4px] text-sm text-mist-700 focus:border-neutral-400 focus:outline-none file:mr-3 file:rounded-md file:border file:border-mist-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-mist-700 file:cursor-pointer"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) onDocUpload(f, "license");
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center border border-neutral-300 rounded-md px-3 bg-white">
                        <span className="text-sm text-mist-700 truncate flex-1">{driverLicenseFileName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDriverLicenseUrl("");
                            setDriverLicenseFileName("");
                            if (licenseInputRef.current) licenseInputRef.current.value = "";
                          }}
                          className="flex-shrink-0 ml-2 text-mist-700 hover:text-mist-600 transition-colors"
                          aria-label="Remove file"
                        >
                          <X size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                  </div>
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

                {/* Insurance Upload */}
                <div>
                  <label className="text-xs text-mist-500 block mb-1.5">Insurance <span className="text-red-400">*</span></label>
                  <div className="relative h-11">
                    {!insuranceUrl ? (
                      <input
                        ref={insuranceInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="w-full h-full border border-neutral-300 rounded-md px-3 py-[4px] text-sm text-mist-700 focus:border-neutral-400 focus:outline-none file:mr-3 file:rounded-md file:border file:border-mist-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-mist-700 file:cursor-pointer"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) onDocUpload(f, "insurance");
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center border border-neutral-300 rounded-md px-3 bg-white">
                        <span className="text-sm text-mist-700 truncate flex-1">{insuranceFileName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setInsuranceUrl("");
                            setInsuranceFileName("");
                            if (insuranceInputRef.current) insuranceInputRef.current.value = "";
                          }}
                          className="flex-shrink-0 ml-2 text-mist-700 hover:text-mist-600 transition-colors"
                          aria-label="Remove file"
                        >
                          <X size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                  </div>
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
  villaIdDocumentUrl, setVillaIdDocumentUrl,
  uploadingVillaId, setUploadingVillaId,
  days, today, onNext, canProceed,
  autoScrollToCustomerInfo,
  bookedRanges,
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
  villaIdDocumentUrl: string
  setVillaIdDocumentUrl: (v: string) => void
  uploadingVillaId: boolean
  setUploadingVillaId: (v: boolean) => void
  bookedRanges: { start: string; end: string }[]
}) {
  const locations = [...new Set(villaOptions.map((v) => v.location))].sort()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [locationFilter, setLocationFilter] = useState("")
  const customerInfoRef = useRef<HTMLDivElement | null>(null)
  const didAutoScrollRef = useRef(false)

  const showCustomerInfo = Boolean(
    selectedVilla
    && startDate
    && endDate
    && guestCount > 0
    && days > 0
  )

  const handleStartDateChange = (value: string) => {
  setStartDate(value)
  if (value) {
    setStartTime("15:00") // Auto-set to 3:00 PM
  } else {
    setStartTime("")
  }
}

const handleEndDateChange = (value: string) => {
  setEndDate(value)
  if (value) {
    setEndTime("11:00") // Auto-set to 11:00 AM
  } else {
    setEndTime("")
  }
}

  useEffect(() => {
    if (!autoScrollToCustomerInfo || !showCustomerInfo || didAutoScrollRef.current) return
    let attempts = 0
    let timerId: number | undefined

    const tryScroll = () => {
      const node = customerInfoRef.current
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" })
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
  }, [autoScrollToCustomerInfo, showCustomerInfo])

  const filteredVillas = locationFilter
    ? villaOptions.filter((v) => v.location === locationFilter)
    : villaOptions

  return (
    <div className="space-y-8">
      {/* Villa Info */}
      <div>
        <h2 className="text-lg font-semibold text-mist-900 mb-4">Villa Info</h2>
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
        <h2 className="text-lg 2xl:text-2xl font-semibold text-mist-900 mb-4 2xl:mb-6">Stay Details</h2>
        <div className="space-y-3 2xl:space-y-4 border-t border-mist-300 pt-6 2xl:pt-8">
          {/* Check-in date + time */}
          <div className="grid grid-cols-2 gap-3 2xl:gap-5">
            <DateTriggerField
              label="Check-in*"
              value={startDate}
              onClick={() => setCalendarOpen(true)}
              desktopLabel
            />
           <div className="relative">
  <input
    type={startTime ? "time" : "text"}
    onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "time")}
    onFocus={(e) => switchTemporalInputType(e.currentTarget, "time")}
    onBlur={(e) => { if (!startTime) e.currentTarget.type = "text" }}
    value={startTime}
    onChange={(e) => setStartTime(e.target.value)}
    placeholder=" "
    disabled={!startDate}
    className="ios-temporal-input w-full max-w-full min-w-0 box-border bg-white border border-mist-300 rounded-md px-3 2xl:px-6 text-sm 2xl:text-xl text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-transparent h-11 2xl:h-16 flex items-end pb-1 2xl:pb-2 pt-5 2xl:pt-6 peer"
  />
  <span className={`pointer-events-none absolute left-3 2xl:left-6 top-1 2xl:top-2 text-[10px] 2xl:text-sm text-mist-400 transition-opacity duration-150 ${startTime ? "opacity-100" : "opacity-0 peer-focus:opacity-100"}`}>Time*</span>
  <span className={`pointer-events-none absolute left-3 2xl:left-6 top-1/2 -translate-y-1/2 text-sm 2xl:text-xl text-mist-300 transition-opacity duration-150 ${startTime ? "opacity-0" : "opacity-100 peer-focus:opacity-0"}`}>Time*</span>
</div>
          </div>

          {/* Check-out date + time */}
          <div className="grid grid-cols-2 gap-3 2xl:gap-5">
            <DateTriggerField
              label="Check-out*"
              value={endDate}
              onClick={() => setCalendarOpen(true)}
              desktopLabel
            />
           <div className="relative">
  <input
    type={startTime ? "time" : "text"}
    onPointerDown={(e) => switchTemporalInputType(e.currentTarget, "time")}
    onFocus={(e) => switchTemporalInputType(e.currentTarget, "time")}
    onBlur={(e) => { if (!startTime) e.currentTarget.type = "text" }}
    value={endTime}
    onChange={(e) => setStartTime(e.target.value)}
    placeholder=" "
    disabled={!startDate}
    className="ios-temporal-input w-full max-w-full min-w-0 box-border bg-white border border-mist-300 rounded-md px-3 2xl:px-6 text-sm 2xl:text-xl text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-transparent h-11 2xl:h-16 flex items-end pb-1 2xl:pb-2 pt-5 2xl:pt-6 peer"
  />
  <span className={`pointer-events-none absolute left-3 2xl:left-6 top-1 2xl:top-2 text-[10px] 2xl:text-sm text-mist-400 transition-opacity duration-150 ${startTime ? "opacity-100" : "opacity-0 peer-focus:opacity-100"}`}>Time*</span>
  <span className={`pointer-events-none absolute left-3 2xl:left-6 top-1/2 -translate-y-1/2 text-sm 2xl:text-xl text-mist-300 transition-opacity duration-150 ${startTime ? "opacity-0" : "opacity-100 peer-focus:opacity-0"}`}>Time*</span>
</div>
          </div>
        </div>

        <DateRangeCalendarPopup
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          minDate={today}
          startLabel="check-in"
          endLabel="check-out"
          bookedRanges={bookedRanges}
        />
      </div>

      {/* Guests */}
      <div>
        <div className="relative">
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full appearance-none border border-neutral-300 rounded-md px-3 2xl:px-5 pr-8 2xl:pr-10 py-2.5 2xl:py-4 text-sm 2xl:text-lg text-mist-700 bg-white focus:border-neutral-400 focus:outline-none"
          >
            {Array.from({ length: selectedVilla?.guests || 20 }, (_, i) => i + 1).map((count) => (
              <option key={count} value={count} className="text-sm 2xl:text-base">Number of Guests: {count}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 2xl:right-4 top-1/2 -translate-y-1/2 text-mist-400 pointer-events-none 2xl:w-5 2xl:h-5" />
        </div>
      </div>

      {/* Add-Ons */}
      <div>
        <h2 className="text-lg 2xl:text-2xl font-semibold text-mist-900 mb-1 2xl:mb-2">Add-Ons <span className="text-xs 2xl:text-sm italic text-mist-500 font-normal">(optional)</span></h2>
        <div className="space-y-3 2xl:space-y-4 mt-4">
          <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 2xl:px-4 py-3 2xl:py-4 cursor-pointer hover:border-mist-400 transition">
            <div className="flex items-center gap-2.5 2xl:gap-3">
              <input
                type="radio"
                checked={villaAirportTransfer}
                onClick={() => setVillaAirportTransfer((prev) => !prev)}
                onChange={() => { }}
                className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full accent-blue-600 cursor-pointer"
              />
              <span className="text-sm 2xl:text-lg text-mist-700">Airport Transfer (Luxury SUV)</span>
            </div>
          </label>

          <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 2xl:px-4 py-3 2xl:py-4 cursor-pointer hover:border-mist-400 transition">
            <div className="flex items-center gap-2.5 2xl:gap-3">
              <input
                type="radio"
                checked={villaPrivateChef}
                onClick={() => setVillaPrivateChef((prev) => !prev)}
                onChange={() => { }}
                className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full accent-blue-600 cursor-pointer"
              />
              <span className="text-sm 2xl:text-lg text-mist-700">Private Chef</span>
            </div>
          </label>

          <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 2xl:px-4 py-3 2xl:py-4 cursor-pointer hover:border-mist-400 transition">
            <div className="flex items-center gap-2.5 2xl:gap-3">
              <input
                type="radio"
                checked={villaSecurityService}
                onClick={() => setVillaSecurityService((prev) => !prev)}
                onChange={() => { }}
                className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full accent-blue-600 cursor-pointer"
              />
              <span className="text-sm 2xl:text-lg text-mist-700">Security Service</span>
            </div>
          </label>
        </div>
      </div>

      {/* Customer Info */}
      <div ref={customerInfoRef} className="border-t border-mist-200 pt-8 scroll-mt-28">
        {showCustomerInfo && (
          <>
            <h2 className="text-lg font-semibold text-mist-900 mb-4">Customer Info</h2>
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
                <label className="text-xs text-mist-500 block mb-1.5">Upload ID / Passport <span className="text-red-400">*</span></label>
                <div className="relative h-11">
                  {!villaIdDocumentUrl ? (
                    <input
                      id="villa-id-upload"
                      type="file"
                      accept="image/*,.pdf"
                      className="w-full h-full border border-neutral-300 rounded-md px-3 py-[4px] text-sm text-mist-700 focus:border-neutral-400 focus:outline-none file:mr-3 file:rounded-md file:border file:border-mist-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-mist-700 file:cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setVillaIdDocumentName(file.name)
                        setUploadingVillaId(true)
                        try {
                          const fd = new FormData()
                          fd.append("files", file)
                          const res = await fetch("/api/upload", { method: "POST", body: fd })
                          if (!res.ok) throw new Error()
                          const data = await res.json()
                          const url = data.urls?.[0]
                          if (url) {
                            setVillaIdDocumentUrl(url)
                            fetch("/api/account/profile", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ passport: url }),
                            }).catch(() => { })
                          }
                        } catch {
                          alert("Upload failed. Please try again.")
                          setVillaIdDocumentName("")
                        } finally {
                          setUploadingVillaId(false)
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center border border-neutral-300 rounded-md px-3 bg-white">
                      <span className="text-sm text-mist-700 truncate flex-1">{villaIdDocumentName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setVillaIdDocumentUrl("");
                          setVillaIdDocumentName("");
                          const input = document.getElementById("villa-id-upload") as HTMLInputElement;
                          if (input) input.value = "";
                        }}
                        className="flex-shrink-0 ml-2 text-mist-500 hover:text-mist-600 transition-colors"
                        aria-label="Remove file"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
                {uploadingVillaId && <p className="mt-1 text-xs text-mist-400">Uploading...</p>}
                {villaIdDocumentUrl && (
                  <a
                    href={villaIdDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-xs text-mist-600 underline"
                  >
                    View uploaded document
                  </a>
                )}
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
  firstName, lastName, email, phone,
  session, carTaxPercent,
}: {
  car: CarData; startDate: string; endDate: string; startTime: string; endTime: string
  days: number; pricing: ReturnType<typeof calcCarPricing> | null
  needDriver: boolean; driverHours: number; actualDriverDays: number
  driverLicenseUrl: string; insuranceUrl: string
  firstName: string; lastName: string; email: string; phone: string
  session: any; carTaxPercent: number
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
            <img src={car.image} alt={car.name} loading="lazy" className="w-full h-full object-cover" />
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
        <p><span className="text-mist-700 font-medium">Full name:</span> {(firstName || lastName) ? `${firstName} ${lastName}`.trim() : (session?.user?.name || "—")}</p>
        <p><span className="text-mist-700 font-medium">Email:</span> {email || session?.user?.email || "—"}</p>
        <p><span className="text-mist-700 font-medium">Phone number:</span> {phone || "—"}</p>
        <p><span className="text-mist-700 font-medium">Driver License:</span> {getUploadedFileName(driverLicenseUrl)}</p>
        <p><span className="text-mist-700 font-medium">Insurance:</span> {getUploadedFileName(insuranceUrl)}</p>
      </div>

      <p className="text-xs text-mist-400 border-t border-mist-100 pt-3">
        Free cancellation within 24 hours from the time you place the order.
      </p>

      {pricing && days > 0 && (
        <div className="space-y-2 text-sm border-t border-mist-100 pt-3">
          <div className="flex justify-between text-mist-500">
            <span>Car Total <span className="text-xs">({`$${car.pricePerDay.toLocaleString()} × ${days}d`})</span></span>
            <span className="text-mist-900 font-medium">${pricing.subtotal.toLocaleString()}</span>
          </div>
          {pricing.discountPercent > 0 && (
            <div className="flex justify-between text-mist-500">
              <span>Long-Term Discount <span className="text-xs">({days} days – {pricing.discountPercent}% OFF)</span></span>
              <span className="text-mist-900 font-medium">-${pricing.discountAmount.toLocaleString()}</span>
            </div>
          )}
          {pricing.extraHoursCharge > 0 && (
            <div className="flex justify-between text-mist-500">
              <span>Extra Hours <span className="text-xs">({pricing.extraHours - 1} hr{pricing.extraHours - 1 > 1 ? "s" : ""} × 25% daily rate)</span></span>
              <span className="text-mist-900 font-medium">${pricing.extraHoursCharge.toLocaleString()}</span>
            </div>
          )}
          {pricing.driverTotal > 0 && (
            <div className="flex justify-between text-mist-500">
              <span>Driver Total <span className="text-xs">({driverHours} hrs x $45/hr × {actualDriverDays} days)</span></span>
              <span className="text-mist-900 font-medium">${pricing.driverTotal.toLocaleString()}</span>
            </div>
          )}
          {pricing.couponAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo Code <span className="text-xs">({pricing.couponPercent}% OFF)</span></span>
              <span>-${pricing.couponAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-mist-500">
            <span>Tax <span className="text-xs">({carTaxPercent}%)</span></span>
            <span className="text-mist-900 font-medium">${pricing.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-mist-500">
            <span>Security Deposit <span className="text-xs">(Fully Refundable)</span></span>
            <span className="text-mist-900 font-medium">$2,000</span>
          </div>
          <div className="flex justify-between text-mist-500">
            <span>Delivery Fee</span>
            <span className="text-mist-900 font-medium">TBD</span>
          </div>
          <div className="flex justify-between text-mist-500">
            <span>Return Fee</span>
            <span className="text-mist-900 font-medium">TBD</span>
          </div>
          <hr className="border-mist-100" />
          <div className="flex justify-between items-center text-mist-500">
            <span className="flex items-center gap-1.5">Place Hold <span className="text-xs">(No Charge)</span></span>
            <span className="text-blue-600 font-medium flex items-center gap-1">
              ${pricing.securityHold.toLocaleString()}
              <span className="relative group">
                <Info size={13} className="text-mist-400 cursor-pointer hover:text-mist-600" />
                <span className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-72 p-3 bg-mist-900 text-white text-[11px] leading-relaxed rounded-lg shadow-lg z-50">
                  A temporary hold of $5,000 will be placed on your card. This includes the $2,000 refundable deposit. No money will be charged at this stage.<br /><br />
                  If your total reservation exceeds $5,000, the remaining balance will be due before or at delivery via card or wire transfer.<br /><br />
                  After the rental, the final amount will be calculated based on your booking and any additional usage. The $2,000 deposit will be refunded if no extra charges apply.
                </span>
              </span>
            </span>
          </div>
          <div className="flex justify-between text-mist-500">
            <span>Due at Pickup</span>
            <span className="text-mist-900 font-medium">${pricing.dueAtPickup.toLocaleString()}</span>
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
  villaIdDocumentName, villaTaxPercent,
}: {
  villa: VillaData; startDate: string; endDate: string; startTime: string; endTime: string; days: number; guestCount: number
  pricing: ReturnType<typeof calcVillaPricing> | null; step: number; session: any
  firstName: string; lastName: string; email: string; phone: string
  villaAirportTransfer: boolean; villaPrivateChef: boolean; villaSecurityService: boolean
  villaIdDocumentName: string; villaTaxPercent: number
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
            <img src={villa.image} alt={villa.name} loading="lazy" className="w-full h-full object-cover" />
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

      <div className="text-xs text-mist-400 border-t border-mist-100 pt-3">
        <p className="font-medium text-mist-600 mb-2">Cancellation Policy</p>
        <ul className="space-y-1">
          <li>• Full refund: 361+ days before arrival</li>
          <li>• 10% charge: 61–360 days before arrival</li>
          <li>• 50% charge: 31–60 days before arrival</li>
          <li>• 100% charge: 0–30 days before arrival</li>
        </ul>
      </div>

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
          {pricing.couponAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo Code <span className="text-xs">({pricing.couponPercent}% OFF)</span></span>
              <span>-${pricing.couponAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-mist-500">
            <span>Tax <span className="text-xs">({villaTaxPercent}%)</span></span>
            <span className="text-mist-900">${pricing.tax.toLocaleString()}</span>
          </div>
          {pricing.securityDeposit > 0 && (
            <div className="flex justify-between text-mist-500">
              <span>Security Deposit <span className="text-xs">(Fully Refundable)</span></span>
              <span className="text-mist-900">${pricing.securityDeposit.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-mist-100" />
          <p className="text-[10px] font-semibold text-mist-700 uppercase tracking-wider pt-1">Payment Breakdown</p>
          <div className="flex justify-between text-mist-500">
            <span>Pay Now <span className="text-xs">(Authorize Hold)</span></span>
            <span className="text-blue-600 font-medium">${pricing.villaDeposit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-mist-500">
            <div className="flex flex-col gap-0.5">
            <span className="text-mist-500">Remaining Balance</span>
          <span className="text-mist-500 text-xs">(Payable via wire transfer after confirmation)</span>

            </div>
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

