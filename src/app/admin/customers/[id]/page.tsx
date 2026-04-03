"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, MapPin, FileText, Car, Home, Heart, Calendar, Phone, Mail, Building, CreditCard } from "lucide-react"

interface CarBooking {
  id: string
  bookingNumber: string
  status: string
  paymentStatus: string
  documentStatus: string
  startDate: string
  endDate: string
  totalPrice: number
  createdAt: string
  car: {
    name: string
    slug: string
    brand: { name: string }
    images: { url: string }[]
  }
}

interface VillaBooking {
  id: string
  bookingNumber: string
  status: string
  paymentStatus: string
  documentStatus: string
  checkIn: string
  checkOut: string
  totalPrice: number
  createdAt: string
  villa: {
    name: string
    slug: string
    images: { url: string }[]
  }
}

interface CustomerDetail {
  id: string
  name: string | null
  email: string
  phone: string | null
  image: string | null
  dateOfBirth: string | null
  company: string | null
  address: string | null
  country: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  driverLicense: string | null
  driverLicenseStatus: string
  insurance: string | null
  insuranceStatus: string
  passport: string | null
  passportStatus: string
  createdAt: string
  bookings: CarBooking[]
  villaBookings: VillaBooking[]
  _count: { wishlist: number }
}

interface DocEntry { url: string | null; number: string | null; expiry: string | null }

function parseDoc(raw: string | null): DocEntry | null {
  if (!raw) return null
  try { return JSON.parse(raw) as DocEntry }
  catch { return { url: raw, number: null, expiry: null } }
}

const DOC_STATUS_COLORS: Record<string, string> = {
  VERIFIED: "bg-green-100 text-green-700",
  PENDING:  "bg-yellow-100 text-yellow-700",
  REJECTED: "bg-red-100 text-red-600",
  NONE:     "bg-mist-100 text-mist-500",
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-mist-100 text-mist-500",
  CANCELLED: "bg-red-100 text-red-600",
}

const PAYMENT_COLORS: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PARTIALLY_PAID: "bg-yellow-100 text-yellow-700",
  UNPAID: "bg-red-100 text-red-600",
  REFUNDED: "bg-mist-100 text-mist-500",
}

function StatusBadge({ value, colorMap }: { value: string; colorMap: Record<string, string> }) {
  const cls = colorMap[value] ?? "bg-mist-100 text-mist-500"
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {value}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-mist-400 mb-0.5">{label}</p>
      <p className="text-sm text-mist-900 font-medium">{value || "—"}</p>
    </div>
  )
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"cars" | "villas">("cars")
  const [verifying, setVerifying] = useState<string | null>(null)

  const loadCustomer = () => {
    fetch(`/api/admin/customers/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setCustomer)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadCustomer() }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const verifyDoc = async (docType: string, status: string) => {
    setVerifying(docType + status)
    await fetch(`/api/admin/customers/${id}/verify-document`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docType, status }),
    })
    setVerifying(null)
    loadCustomer()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-mist-100 rounded animate-pulse" />
        <div className="h-48 bg-mist-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-mist-100 rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-mist-500">Customer not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-mist-900 underline">Go back</button>
      </div>
    )
  }

  const initials = (customer.name || customer.email).charAt(0).toUpperCase()
  const dl  = parseDoc(customer.driverLicense)
  const ins = parseDoc(customer.insurance)
  const pp  = parseDoc(customer.passport)
  const hasLicense  = !!dl
  const hasInsurance = !!ins

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/admin/customers")}
        className="flex items-center gap-2 text-sm text-mist-500 hover:text-mist-900 transition"
      >
        <ArrowLeft size={16} />
        Back to Customers
      </button>

      {/* Profile header */}
      <div className="bg-white border border-mist-200 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-mist-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl font-bold text-mist-500">
            {customer.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={customer.image} alt={customer.name || ""} className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-mist-900">{customer.name || "No name"}</h1>
                <p className="text-mist-500 text-sm mt-0.5">{customer.email}</p>
                {customer.phone && <p className="text-mist-500 text-sm">{customer.phone}</p>}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-mist-100 text-mist-600 px-2.5 py-1 rounded-full font-medium">
                  {customer.bookings.length + customer.villaBookings.length} bookings
                </span>
                <span className="bg-red-50 text-red-500 px-2.5 py-1 rounded-full font-medium">
                  {customer._count.wishlist} wishlist
                </span>
                <span className={`px-2.5 py-1 rounded-full font-medium text-xs ${DOC_STATUS_COLORS[customer.driverLicenseStatus] ?? DOC_STATUS_COLORS.NONE}`}>
                  DL: {customer.driverLicenseStatus === "NONE" ? "not submitted" : customer.driverLicenseStatus.toLowerCase()}
                </span>
                <span className={`px-2.5 py-1 rounded-full font-medium text-xs ${DOC_STATUS_COLORS[customer.insuranceStatus] ?? DOC_STATUS_COLORS.NONE}`}>
                  Insurance: {customer.insuranceStatus === "NONE" ? "not submitted" : customer.insuranceStatus.toLowerCase()}
                </span>
                <span className={`px-2.5 py-1 rounded-full font-medium text-xs ${DOC_STATUS_COLORS[customer.passportStatus] ?? DOC_STATUS_COLORS.NONE}`}>
                  Passport: {customer.passportStatus === "NONE" ? "not submitted" : customer.passportStatus.toLowerCase()}
                </span>
              </div>
            </div>
            <p className="text-xs text-mist-400 mt-3">
              Member since {new Date(customer.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Profile details grid */}
      <div className="bg-white border border-mist-200 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-mist-900 mb-4 flex items-center gap-2">
          <User size={15} /> Personal Information
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          <InfoRow label="Full Name" value={customer.name} />
          <InfoRow label="Email" value={customer.email} />
          <InfoRow label="Phone" value={customer.phone} />
          <InfoRow label="Date of Birth" value={customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null} />
          <InfoRow label="Company" value={customer.company} />
          <InfoRow label="Address" value={customer.address} />
          <InfoRow label="City" value={customer.city} />
          <InfoRow label="State" value={customer.state} />
          <InfoRow label="Zip Code" value={customer.zipCode} />
          <InfoRow label="Country" value={customer.country} />
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white border border-mist-200 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-mist-900 mb-4 flex items-center gap-2">
          <FileText size={15} /> Documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Driver's License */}
          <div className="border border-mist-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-mist-100 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Driver&apos;s License</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DOC_STATUS_COLORS[customer.driverLicenseStatus] ?? DOC_STATUS_COLORS.NONE}`}>
                {customer.driverLicenseStatus === "NONE" ? "Not submitted" : customer.driverLicenseStatus}
              </span>
            </div>
            {dl ? (
              <>
                <div className="bg-mist-50 flex items-center justify-center" style={{ minHeight: 180 }}>
                  {dl.url ? (
                    dl.url.toLowerCase().endsWith(".pdf") ? (
                      <a href={dl.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline p-4">View PDF</a>
                    ) : (
                      <a href={dl.url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={dl.url} alt="Driver License" className="max-h-44 max-w-full object-contain" />
                      </a>
                    )
                  ) : (
                    <p className="text-xs text-mist-400 p-4">No image uploaded</p>
                  )}
                </div>
                {dl.number && <p className="text-xs text-mist-500 px-4 pt-2">Number: <span className="font-medium text-mist-900">{dl.number}</span></p>}
                {dl.expiry  && <p className="text-xs text-mist-500 px-4 pb-2">Expiry: <span className="font-medium text-mist-900">{dl.expiry}</span></p>}
                <div className="flex gap-2 p-4 pt-3">
                  <button
                    onClick={() => verifyDoc("DRIVING_LICENSE", "VERIFIED")}
                    disabled={verifying !== null || customer.driverLicenseStatus === "VERIFIED"}
                    className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold transition"
                  >
                    {verifying === "DRIVING_LICENSEVERIFIED" ? "Saving…" : "Verify"}
                  </button>
                  <button
                    onClick={() => verifyDoc("DRIVING_LICENSE", "REJECTED")}
                    disabled={verifying !== null || customer.driverLicenseStatus === "REJECTED"}
                    className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold transition"
                  >
                    {verifying === "DRIVING_LICENSEREJECTED" ? "Saving…" : "Reject"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-mist-400 p-4">Not submitted yet.</p>
            )}
          </div>

          {/* Insurance */}
          <div className="border border-mist-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-mist-100 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Insurance Policy</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DOC_STATUS_COLORS[customer.insuranceStatus] ?? DOC_STATUS_COLORS.NONE}`}>
                {customer.insuranceStatus === "NONE" ? "Not submitted" : customer.insuranceStatus}
              </span>
            </div>
            {ins ? (
              <>
                <div className="bg-mist-50 flex items-center justify-center" style={{ minHeight: 180 }}>
                  {ins.url ? (
                    ins.url.toLowerCase().endsWith(".pdf") ? (
                      <a href={ins.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline p-4">View PDF</a>
                    ) : (
                      <a href={ins.url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ins.url} alt="Insurance" className="max-h-44 max-w-full object-contain" />
                      </a>
                    )
                  ) : (
                    <p className="text-xs text-mist-400 p-4">No image uploaded</p>
                  )}
                </div>
                {ins.number && <p className="text-xs text-mist-500 px-4 pt-2">Policy #: <span className="font-medium text-mist-900">{ins.number}</span></p>}
                {ins.expiry  && <p className="text-xs text-mist-500 px-4 pb-2">Expiry: <span className="font-medium text-mist-900">{ins.expiry}</span></p>}
                <div className="flex gap-2 p-4 pt-3">
                  <button
                    onClick={() => verifyDoc("INSURANCE_POLICY", "VERIFIED")}
                    disabled={verifying !== null || customer.insuranceStatus === "VERIFIED"}
                    className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold transition"
                  >
                    {verifying === "INSURANCE_POLICYVERIFIED" ? "Saving…" : "Verify"}
                  </button>
                  <button
                    onClick={() => verifyDoc("INSURANCE_POLICY", "REJECTED")}
                    disabled={verifying !== null || customer.insuranceStatus === "REJECTED"}
                    className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold transition"
                  >
                    {verifying === "INSURANCE_POLICYREJECTED" ? "Saving…" : "Reject"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-mist-400 p-4">Not submitted yet.</p>
            )}
          </div>

          {/* Passport / ID */}
          <div className="border border-mist-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-mist-100 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Passport / ID</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DOC_STATUS_COLORS[customer.passportStatus] ?? DOC_STATUS_COLORS.NONE}`}>
                {customer.passportStatus === "NONE" ? "Not submitted" : customer.passportStatus}
              </span>
            </div>
            {pp ? (
              <>
                <div className="bg-mist-50 flex items-center justify-center" style={{ minHeight: 180 }}>
                  {pp.url ? (
                    pp.url.toLowerCase().endsWith(".pdf") ? (
                      <a href={pp.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline p-4">View PDF</a>
                    ) : (
                      <a href={pp.url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pp.url} alt="Passport / ID" className="max-h-44 max-w-full object-contain" />
                      </a>
                    )
                  ) : (
                    <p className="text-xs text-mist-400 p-4">No image uploaded</p>
                  )}
                </div>
                {pp.number && <p className="text-xs text-mist-500 px-4 pt-2">Number: <span className="font-medium text-mist-900">{pp.number}</span></p>}
                {pp.expiry  && <p className="text-xs text-mist-500 px-4 pb-2">Expiry: <span className="font-medium text-mist-900">{pp.expiry}</span></p>}
                <div className="flex gap-2 p-4 pt-3">
                  <button
                    onClick={() => verifyDoc("PASSPORT_ID", "VERIFIED")}
                    disabled={verifying !== null || customer.passportStatus === "VERIFIED"}
                    className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold transition"
                  >
                    {verifying === "PASSPORT_IDVERIFIED" ? "Saving\u2026" : "Verify"}
                  </button>
                  <button
                    onClick={() => verifyDoc("PASSPORT_ID", "REJECTED")}
                    disabled={verifying !== null || customer.passportStatus === "REJECTED"}
                    className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold transition"
                  >
                    {verifying === "PASSPORT_IDREJECTED" ? "Saving\u2026" : "Reject"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-mist-400 p-4">Not submitted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bookings */}
      <div className="bg-white border border-mist-200 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-0 border-b border-mist-200">
          <button
            onClick={() => setTab("cars")}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition border-b-2 ${tab === "cars" ? "border-mist-900 text-mist-900" : "border-transparent text-mist-400 hover:text-mist-600"}`}
          >
            <Car size={14} /> Car Bookings ({customer.bookings.length})
          </button>
          <button
            onClick={() => setTab("villas")}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition border-b-2 ${tab === "villas" ? "border-mist-900 text-mist-900" : "border-transparent text-mist-400 hover:text-mist-600"}`}
          >
            <Home size={14} /> Villa Bookings ({customer.villaBookings.length})
          </button>
        </div>

        {tab === "cars" && (
          <div>
            {customer.bookings.length === 0 ? (
              <p className="text-center py-12 text-mist-400 text-sm">No car bookings yet.</p>
            ) : (
              <div className="divide-y divide-mist-100">
                {customer.bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-14 h-10 rounded-lg bg-mist-100 overflow-hidden flex-shrink-0">
                      {b.car.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.car.images[0].url} alt={b.car.name} className="w-full h-full object-cover" />
                      ) : <Car size={16} className="m-auto mt-2.5 text-mist-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-mist-900 text-sm truncate">
                        {b.car.brand?.name} {b.car.name}
                      </p>
                      <p className="text-xs text-mist-400 mt-0.5">
                        #{b.bookingNumber} &middot; {new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — {new Date(b.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <StatusBadge value={b.status} colorMap={STATUS_COLORS} />
                      <StatusBadge value={b.paymentStatus} colorMap={PAYMENT_COLORS} />
                    </div>
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-sm font-semibold text-mist-900">${b.totalPrice.toLocaleString()}</p>
                      <p className="text-xs text-mist-400 mt-0.5">{new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "villas" && (
          <div>
            {customer.villaBookings.length === 0 ? (
              <p className="text-center py-12 text-mist-400 text-sm">No villa bookings yet.</p>
            ) : (
              <div className="divide-y divide-mist-100">
                {customer.villaBookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-14 h-10 rounded-lg bg-mist-100 overflow-hidden flex-shrink-0">
                      {b.villa.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.villa.images[0].url} alt={b.villa.name} className="w-full h-full object-cover" />
                      ) : <Home size={16} className="m-auto mt-2.5 text-mist-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-mist-900 text-sm truncate">{b.villa.name}</p>
                      <p className="text-xs text-mist-400 mt-0.5">
                        #{b.bookingNumber} &middot; {new Date(b.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — {new Date(b.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <StatusBadge value={b.status} colorMap={STATUS_COLORS} />
                      <StatusBadge value={b.paymentStatus} colorMap={PAYMENT_COLORS} />
                    </div>
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-sm font-semibold text-mist-900">${b.totalPrice.toLocaleString()}</p>
                      <p className="text-xs text-mist-400 mt-0.5">{new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
