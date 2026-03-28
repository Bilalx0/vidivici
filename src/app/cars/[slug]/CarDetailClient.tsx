"use client"

import { useState } from "react"
import Link from "next/link"
import CarGallery from "@/components/cars/CarGallery"
import { MapPin, Shield, Clock, DollarSign, Share2, Bookmark } from "lucide-react"

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
  { duration: "7-13 days", discount: "15% OFF", miles: "Up to 75 miles/day" },
  { duration: "14-29 days", discount: "25% OFF", miles: "Up to 75 miles/day" },
  { duration: "1-3 months", discount: "30% OFF", miles: "1,500 miles/month" },
  { duration: "3-6 months", discount: "50% OFF", miles: "1,000 miles/month" },
  { duration: "6-9 months", discount: "60% OFF", miles: "1,000 miles/month" },
  { duration: "9-12 months", discount: "65% OFF", miles: "1,000 miles/month" },
]

export default function CarDetailClient({ car }: { car: CarDetail }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [needDriver, setNeedDriver] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  const days = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  let discountPercent = 0
  if (days >= 270) discountPercent = 65
  else if (days >= 180) discountPercent = 60
  else if (days >= 90) discountPercent = 50
  else if (days >= 28) discountPercent = 30
  else if (days >= 14) discountPercent = 25
  else if (days >= 7) discountPercent = 15

  const subtotal = car.pricePerDay * days
  const discountAmount = Math.round(subtotal * (discountPercent / 100))
  const driverTotal = needDriver ? days * 65 : 0
  const taxRate = 0.085
  const preTax = subtotal - discountAmount + driverTotal
  const tax = Math.round(preTax * taxRate)
  const securityDeposit = Math.round(car.pricePerDay * 2)
  const total = preTax + tax + securityDeposit

  const originalDayRate = Math.round(car.pricePerDay * 1.2)

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

            {/* Pickup Location */}
            <div className="flex items-center gap-2 text-sm text-mist-500">
              <MapPin size={14} />
              Pickup: {car.location}
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
                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-mist-500 block mb-1.5">Start Date</label>
                    <input
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-mist-500 block mb-1.5">End Date</label>
                    <input
                      type="date"
                      min={startDate || today}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Need a Driver */}
                <div>
                  <p className="text-xs font-medium text-mist-500 mb-2">Need a Driver?</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needDriver}
                      onChange={(e) => setNeedDriver(e.target.checked)}
                      className="accent-gray-900 w-4 h-4"
                    />
                    <span className="text-sm text-mist-600">Yes, I will rent a driver ($65/hour)</span>
                  </label>
                </div>

                {/* Select Dates prompt */}
                {days > 0 ? (
                  <>
                    <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">
                      Next
                    </button>

                    {/* Price Breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-mist-500">
                        <span>Car Total · ${car.pricePerDay}/day × {days} days</span>
                        <span className="text-mist-900">${subtotal.toLocaleString()}</span>
                      </div>
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount · {discountPercent}%</span>
                          <span>-${discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {driverTotal > 0 && (
                        <div className="flex justify-between text-mist-500">
                          <span>Driver · {days} days</span>
                          <span className="text-mist-900">${driverTotal.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-mist-500">
                        <span>Tax · 8.5%</span>
                        <span className="text-mist-900">${tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-mist-500">
                        <span>Security Deposit · Fully refundable</span>
                        <span className="text-mist-900">${securityDeposit.toLocaleString()}</span>
                      </div>
                      <hr className="border-gray-100" />
                      <div className="flex justify-between font-bold text-mist-900 text-base">
                        <span>Total Charges</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-mist-400">Select dates to see pricing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
