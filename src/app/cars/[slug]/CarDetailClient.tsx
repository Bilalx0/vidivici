"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import CarGallery from "@/components/cars/CarGallery"
import { MapPin, Shield, Clock, DollarSign, Share2, Bookmark, Minus, Plus } from "lucide-react"

interface CarDetail {
  id: string
  name: string
  slug: string
  brandName: string
  brandSlug: string
  categoryName: string
  categorySlug: string
  description: string | null
  shortDescription: string | null
  pricePerDay: number
  year: number | null
  seats: number
  transmission: string
  fuelType: string
  horsepower: number | null
  topSpeed: string | null
  acceleration: string | null
  milesIncluded: number
  extraMileRate: number
  minRentalDays: number
  location: string
  images: { url: string; alt: string | null }[]
}

const discountTiers = [
  { duration: "7-13 days", discount: "15% OFF", miles: "Up to 100 miles/day" },
  { duration: "14-25 days", discount: "25% OFF", miles: "Up to 75 miles/day" },
  { duration: "1-3 months", discount: "35% OFF", miles: "1,500 miles/month" },
  { duration: "3-6 months", discount: "50% OFF", miles: "1,000 miles/month" },
  { duration: "6-9 months", discount: "60% OFF", miles: "1,000 miles/month" },
  { duration: "9-12 months", discount: "65% OFF", miles: "1,000 miles/month" },
]

export default function CarDetailClient({ car }: { car: CarDetail }) {
  const router = useRouter()
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [needDriver, setNeedDriver] = useState(true)
  const [driverHours, setDriverHours] = useState(8)
  const [driverAvailability, setDriverAvailability] = useState<"full" | "select">("select")
  const [driverDays, setDriverDays] = useState(1)
  const today = new Date().toISOString().split("T")[0]

  const days = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  let discountPercent = 0
  if (days >= 270) discountPercent = 65
  else if (days >= 180) discountPercent = 60
  else if (days >= 90) discountPercent = 50
  else if (days >= 28) discountPercent = 35
  else if (days >= 14) discountPercent = 25
  else if (days >= 7) discountPercent = 15

  const subtotal = car.pricePerDay * days
  const discountAmount = Math.round(subtotal * (discountPercent / 100))
  const actualDriverDays = driverAvailability === "full" ? days : driverDays
  const driverTotal = needDriver ? actualDriverDays * driverHours * 45 : 0
  const taxRate = 0.085
  const preTax = subtotal - discountAmount + driverTotal
  const tax = Math.round(preTax * taxRate)
  const securityDeposit = Math.round(car.pricePerDay * 2)
  const total = preTax + tax + securityDeposit

  const originalDayRate = Math.round(car.pricePerDay * 1.2)

  const handleNext = () => {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(needDriver && {
        driver: "1",
        driverHours: String(driverHours),
        driverAvailability,
        driverDays: String(actualDriverDays),
      }),
    })
    router.push(`/booking/${car.slug}?${params.toString()}`)
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-4">
        <div className="flex items-center gap-2 text-sm text-mist-400">
          <Link href="/" className="hover:text-mist-700">Los Angeles</Link>
          <span>/</span>
          <Link href={`/cars?brand=${car.brandSlug}`} className="hover:text-mist-700">{car.brandName}</Link>
          <span>/</span>
          <Link href={`/cars?category=${car.categorySlug}`} className="hover:text-mist-700">{car.categoryName}</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Share / Save */}
        <div className="flex justify-end gap-3 mb-4">
          <button className="flex items-center gap-1.5 text-sm text-mist-500 hover:text-mist-800">
            <Share2 size={14} /> Share
          </button>
          <button className="flex items-center gap-1.5 text-sm text-mist-500 hover:text-mist-800">
            <Bookmark size={14} /> Save
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT COLUMN — 3/5 */}
          <div className="lg:col-span-3 space-y-8">
            {/* Gallery */}
            <CarGallery images={car.images} />

            {/* Title + Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-mist-900">{car.name}</h1>
              {car.shortDescription && (
                <p className="text-sm text-mist-400 mt-1">{car.shortDescription}</p>
              )}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-mist-900">
                  ${car.pricePerDay.toLocaleString()}.00
                </span>
                <span className="text-sm text-mist-400 line-through">
                  ${originalDayRate.toLocaleString()}.00 USD / day
                </span>
              </div>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-mist-600">
                <Shield size={14} className="text-mist-400" />
                Security Deposit: ${securityDeposit.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-mist-600">
                <Clock size={14} className="text-mist-400" />
                Rental Duration: {car.minRentalDays}+ day min
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-mist-600">
                <DollarSign size={14} className="text-mist-400" />
                Extra Hours: 25% of the daily rate
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[
                { label: "Seats", value: car.seats },
                { label: "0-60 mph", value: car.acceleration || "—" },
                { label: "Engine", value: car.horsepower ? `${car.horsepower} hp` : "—" },
                { label: "Top Speed", value: car.topSpeed || "—" },
                { label: "Transmission", value: car.transmission },
                { label: "Fuel", value: car.fuelType },
                { label: "Year", value: car.year || "—" },
                { label: "Miles/Day", value: `${car.milesIncluded}` },
              ].map((spec) => (
                <div key={spec.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-mist-400 mb-0.5">{spec.label}</p>
                  <p className="text-sm font-semibold text-mist-800">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Long-Term Rental Discounts */}
            <div>
              <h2 className="text-lg font-bold text-mist-900 mb-4">Long-Term Rental Discounts</h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 font-medium text-mist-500">Duration</th>
                      <th className="text-left px-4 py-3 font-medium text-mist-500">Discount</th>
                      <th className="text-left px-4 py-3 font-medium text-mist-500">Mileage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discountTiers.map((tier, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-mist-700">{tier.duration}</td>
                        <td className="px-4 py-3 font-semibold text-green-600">{tier.discount}</td>
                        <td className="px-4 py-3 text-mist-500">{tier.miles}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-mist-400 mt-2 flex items-center gap-1">
                Vehicle Swap Option: Available with 30-day notice
              </p>
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <h2 className="text-lg font-bold text-mist-900 mb-3">
                  Rent a {car.name} in {car.location}
                </h2>
                <p className="text-sm text-mist-500 leading-relaxed">{car.description}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Booking Form 2/5 */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
                {/* Date & Time Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start date*"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End date*"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                </div>

                {/* Need a Driver */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Need a Driver?</p>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${needDriver ? "border-blue-600" : "border-gray-300"}`}>
                      {needDriver && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <input type="checkbox" checked={needDriver} onChange={(e) => setNeedDriver(e.target.checked)} className="sr-only" />
                    <span className="text-sm text-gray-600">Yes, I will need a driver ($45/hour)</span>
                  </label>
                </div>

                {needDriver && (
                  <>
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
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${driverAvailability === "full" ? "border-blue-600" : "border-gray-300"}`}>
                            {driverAvailability === "full" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                          </div>
                          <input type="radio" name="driverAvail" checked={driverAvailability === "full"} onChange={() => setDriverAvailability("full")} className="sr-only" />
                          <span className="text-sm text-gray-600">Full Rental</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${driverAvailability === "select" ? "border-blue-600" : "border-gray-300"}`}>
                            {driverAvailability === "select" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                          </div>
                          <input type="radio" name="driverAvail" checked={driverAvailability === "select"} onChange={() => setDriverAvailability("select")} className="sr-only" />
                          <span className="text-sm text-gray-600">Select Days</span>
                        </label>
                      </div>
                    </div>

                    {driverAvailability === "select" && (
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setDriverDays(Math.max(1, driverDays - 1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium text-gray-900 w-6 text-center">{driverDays}</span>
                        <button type="button" onClick={() => setDriverDays(Math.min(days || 365, driverDays + 1))} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Next Button & Price Breakdown */}
                {days > 0 ? (
                  <>
                    <button
                      onClick={handleNext}
                      className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Car Total · ${car.pricePerDay} × {days}d</span>
                        <span className="text-gray-900">${subtotal.toLocaleString()}</span>
                      </div>
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount · {days} days – {discountPercent}%</span>
                          <span>-${discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {driverTotal > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Driver Total · {driverHours}hr × $45 × {actualDriverDays}d</span>
                          <span className="text-gray-900">${driverTotal.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-500">
                        <span>Tax · 8.5%</span>
                        <span className="text-gray-900">${tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Security Deposit · Fully refundable</span>
                        <span className="text-gray-900">${securityDeposit.toLocaleString()}</span>
                      </div>
                      <hr className="border-gray-100" />
                      <div className="flex justify-between font-bold text-gray-900 text-base">
                        <span>Total Charges</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400">Select dates to see pricing</p>
                  </div>
                )}
              </div>

              {/* Pickup Location */}
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 px-1">
                <MapPin size={14} />
                Pickup: {car.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
