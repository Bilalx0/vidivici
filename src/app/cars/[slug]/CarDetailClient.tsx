// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import CarGallery from "@/components/cars/CarGallery"
// import Rentals from "@/components/home/Rentals"
// import WhyChooseUs from "@/components/home/WhyChooseUs"
// import Reviews from "@/components/home/Reviews"
// import FAQ from "@/components/home/FAQ"
// import Contact from "@/components/home/Contact"
// import {
//   MapPin, Shield, Clock, DollarSign,
//   Share2, Bookmark, ChevronDown, ChevronUp,
//   Calendar, Users, Zap, Gauge, Fuel, Settings
// } from "lucide-react"

// interface CarDetail {
//   id: string
//   name: string
//   slug: string
//   brandName: string
//   brandSlug: string
//   categoryName: string
//   categorySlug: string
//   description: string | null
//   shortDescription: string | null
//   pricePerDay: number
//   year: number | null
//   seats: number
//   transmission: string
//   fuelType: string
//   horsepower: number | null
//   topSpeed: string | null
//   acceleration: string | null
//   milesIncluded: number
//   extraMileRate: number
//   minRentalDays: number
//   location: string
//   images: { url: string; alt: string | null }[]
// }

// const discountTiers = [
//   { duration: "7-13 days",   discount: "15% OFF", miles: "Up to 100 miles/day" },
//   { duration: "14-29 days",  discount: "25% OFF", miles: "Up to 75 miles/day"  },
//   { duration: "1-3 months",  discount: "35% OFF", miles: "1,500 miles/month"   },
//   { duration: "3-6 months",  discount: "50% OFF", miles: "1,000 miles/month"   },
//   { duration: "6-9 months",  discount: "60% OFF", miles: "1,000 miles/month"   },
//   { duration: "9-12 months", discount: "65% OFF", miles: "1,000 miles/month"   },
// ]

// export default function CarDetailClient({ car }: { car: CarDetail }) {
//   const [startDate, setStartDate]   = useState("")
//   const [endDate, setEndDate]       = useState("")
//   const [needDriver, setNeedDriver] = useState(false)
//   const [showDesc, setShowDesc]     = useState(false)
//   const today = new Date().toISOString().split("T")[0]

//   const days = startDate && endDate
//     ? Math.max(0, Math.ceil(
//         (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000
//       ))
//     : 0

//   let discountPercent = 0
//   if (days >= 270)      discountPercent = 65
//   else if (days >= 180) discountPercent = 60
//   else if (days >= 90)  discountPercent = 50
//   else if (days >= 28)  discountPercent = 35
//   else if (days >= 14)  discountPercent = 25
//   else if (days >= 7)   discountPercent = 15

//   const subtotal        = car.pricePerDay * days
//   const discountAmount  = Math.round(subtotal * (discountPercent / 100))
//   const driverTotal     = needDriver ? days * 65 : 0
//   const preTax          = subtotal - discountAmount + driverTotal
//   const tax             = Math.round(preTax * 0.085)
//   const securityDeposit = Math.round(car.pricePerDay * 2)
//   const total           = preTax + tax + securityDeposit
//   const originalDayRate = Math.round(car.pricePerDay * 1.2)

//   const specs = [
//     { label: "Seats",        value: car.seats,                          icon: <Users size={13} /> },
//     { label: "0-60 mph",     value: car.acceleration || "—",            icon: <Zap size={13} /> },
//     { label: "Engine",       value: car.horsepower ? `${car.horsepower} hp` : "—", icon: <Settings size={13} /> },
//     { label: "Top Speed",    value: car.topSpeed || "—",                icon: <Gauge size={13} /> },
//     { label: "Transmission", value: car.transmission,                   icon: <Settings size={13} /> },
//     { label: "Fuel",         value: car.fuelType,                       icon: <Fuel size={13} /> },
//     { label: "Year",         value: car.year || "—",                    icon: <Calendar size={13} /> },
//     { label: "Miles/Day",    value: `${car.milesIncluded}`,             icon: <MapPin size={13} /> },
//   ]

//   return (
//     <div className="bg-white min-h-screen font-sans">

//       {/* ── Breadcrumb + actions ─────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-3 flex items-center justify-between">
//         <div className="flex items-center gap-1.5 text-xs text-mist-400">
//           <Link href="/" className="hover:text-mist-700">Los Angeles</Link>
//           <span>/</span>
//           <Link href={`/cars?brand=${car.brandSlug}`} className="hover:text-mist-700">{car.brandName}</Link>
//           <span>/</span>
//           <span className="text-mist-600">{car.categoryName}</span>
//         </div>
//         <div className="flex items-center gap-4">
//           <button className="flex items-center gap-1 text-xs text-mist-500 hover:text-mist-800">
//             <Share2 size={13} /> Share
//           </button>
//           <button className="flex items-center gap-1 text-xs text-mist-500 hover:text-mist-800">
//             <Bookmark size={13} /> Save
//           </button>
//         </div>
//       </div>

//       {/* ── Main grid ────────────────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">

//           {/* ══ LEFT ═══════════════════════════════════════════════ */}
//           <div className="lg:col-span-3 space-y-6">

//             {/* Gallery */}
//             <CarGallery images={car.images} />

//             {/* Quick info pills */}
//             <div className="flex flex-wrap gap-2">
//               <div className="flex items-center gap-1.5 px-3 py-2 bg-mist-50 rounded-xl text-xs text-mist-600 border border-mist-100">
//                 <Shield size={12} className="text-mist-400" />
//                 Security Deposit: ${securityDeposit.toLocaleString()}
//               </div>
//               <div className="flex items-center gap-1.5 px-3 py-2 bg-mist-50 rounded-xl text-xs text-mist-600 border border-mist-100">
//                 <Clock size={12} className="text-mist-400" />
//                 Rental Duration: {car.minRentalDays}+ day min
//               </div>
//               <div className="flex items-center gap-1.5 px-3 py-2 bg-mist-50 rounded-xl text-xs text-mist-600 border border-mist-100">
//                 <DollarSign size={12} className="text-mist-400" />
//                 Extra Hours: 25% of the daily rate
//               </div>
//             </div>

//             {/* Specs grid */}
//             <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
//               {specs.map((s) => (
//                 <div key={s.label} className="bg-mist-50 rounded-xl p-3 text-center border border-mist-100">
//                   <div className="flex justify-center text-mist-400 mb-1">{s.icon}</div>
//                   <p className="text-[10px] text-mist-400 mb-0.5">{s.label}</p>
//                   <p className="text-xs font-semibold text-mist-800">{s.value}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Long-Term Discount Table */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h2 className="text-base font-bold text-mist-900">Long-Term Rental Discounts</h2>
//                 <ChevronUp size={16} className="text-mist-400" />
//               </div>
//               <div className="border border-mist-200 rounded-xl overflow-hidden">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-mist-50">
//                       <th className="text-left px-4 py-3 text-xs font-semibold text-mist-500">Duration</th>
//                       <th className="text-left px-4 py-3 text-xs font-semibold text-mist-500">Discount</th>
//                       <th className="text-left px-4 py-3 text-xs font-semibold text-mist-500">Mileage</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {discountTiers.map((tier, i) => (
//                       <tr key={i} className="border-t border-mist-100 hover:bg-mist-50/50">
//                         <td className="px-4 py-3 text-xs text-mist-600">{tier.duration}</td>
//                         <td className="px-4 py-3 text-xs font-semibold text-green-600">{tier.discount}</td>
//                         <td className="px-4 py-3 text-xs text-mist-400">{tier.miles}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <p className="text-[11px] text-mist-400 mt-2 flex items-center gap-1">
//                 <span className="w-1 h-1 rounded-full bg-mist-300 inline-block" />
//                 Vehicle Swap Option: Available with 30-day notice
//               </p>
//             </div>

//             {/* Pickup Location */}
//             <div className="flex items-center gap-2 text-xs text-mist-400 border-t border-mist-100 pt-4">
//               <MapPin size={13} className="text-mist-400 shrink-0" />
//               <span>Pickup: {car.location}</span>
//             </div>

//             {/* Description */}
//             {car.description && (
//               <div className="border-t border-mist-100 pt-4">
//                 <button
//                   onClick={() => setShowDesc(!showDesc)}
//                   className="flex items-center justify-between w-full text-left"
//                 >
//                   <h2 className="text-base font-bold text-mist-900">
//                     Rent a {car.name} in Los Angeles
//                   </h2>
//                   {showDesc
//                     ? <ChevronUp size={16} className="text-mist-400 shrink-0" />
//                     : <ChevronDown size={16} className="text-mist-400 shrink-0" />
//                   }
//                 </button>
//                 {showDesc && (
//                   <p className="text-xs text-mist-400 leading-relaxed mt-3">{car.description}</p>
//                 )}
//                 {!showDesc && (
//                   <p className="text-xs text-mist-400 leading-relaxed mt-3 line-clamp-2">{car.description}</p>
//                 )}
//                 <button
//                   onClick={() => setShowDesc(!showDesc)}
//                   className="text-xs text-mist-600 font-medium mt-2 hover:underline"
//                 >
//                   {showDesc ? "Show less" : "Show more"}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* ══ RIGHT — Booking Form ════════════════════════════════ */}
//           <div className="lg:col-span-2">
//             <div className="sticky top-6">

//               {/* Car title + price (shown on right on desktop) */}
//               <div className="mb-5 hidden lg:block">
//                 <h1 className="text-2xl font-bold text-mist-900">{car.name}</h1>
//                 {car.shortDescription && (
//                   <p className="text-xs text-mist-400 mt-1 leading-relaxed">{car.shortDescription}</p>
//                 )}
//                 <div className="flex items-baseline gap-3 mt-3">
//                   <span className="text-2xl font-bold text-mist-900">
//                     ${car.pricePerDay.toLocaleString()}.00
//                   </span>
//                   <span className="text-xs text-mist-400 line-through">
//                     ${originalDayRate.toLocaleString()}.00 USD / day
//                   </span>
//                 </div>
//               </div>

//               {/* Title block for mobile */}
//               <div className="mb-5 lg:hidden">
//                 <h1 className="text-2xl font-bold text-mist-900">{car.name}</h1>
//                 {car.shortDescription && (
//                   <p className="text-xs text-mist-400 mt-1">{car.shortDescription}</p>
//                 )}
//                 <div className="flex items-baseline gap-3 mt-2">
//                   <span className="text-xl font-bold text-mist-900">
//                     ${car.pricePerDay.toLocaleString()}.00
//                   </span>
//                   <span className="text-xs text-mist-400 line-through">
//                     ${originalDayRate.toLocaleString()}.00 USD / day
//                   </span>
//                 </div>
//               </div>

//               {/* Form card */}
//               <div className="bg-white border border-mist-200 rounded-2xl p-5 shadow-sm space-y-4">

//                 {/* Date inputs */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-[11px] font-medium text-mist-500 block mb-1.5">Start Date</label>
//                     <input
//                       type="date"
//                       min={today}
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-xs text-mist-700 focus:border-mist-400 focus:outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[11px] font-medium text-mist-500 block mb-1.5">End Date</label>
//                     <input
//                       type="date"
//                       min={startDate || today}
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       className="w-full border border-mist-200 rounded-xl px-3 py-2.5 text-xs text-mist-700 focus:border-mist-400 focus:outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Need a driver */}
//                 <div>
//                   <p className="text-[11px] font-medium text-mist-500 mb-2">Need a Driver?</p>
//                   <div className="flex flex-col gap-2">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="driver"
//                         checked={!needDriver}
//                         onChange={() => setNeedDriver(false)}
//                         className="accent-mist-900 w-3.5 h-3.5"
//                       />
//                       <span className="text-xs text-mist-600">No, I will drive myself</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="driver"
//                         checked={needDriver}
//                         onChange={() => setNeedDriver(true)}
//                         className="accent-mist-900 w-3.5 h-3.5"
//                       />
//                       <span className="text-xs text-mist-600">Yes, I will rent a driver ($65/hour)</span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Date availability note */}
//                 <div className="bg-mist-50 rounded-xl px-3 py-2.5">
//                   <p className="text-[11px] text-mist-400">4 listings</p>
//                   <p className="text-[11px] text-mist-400">Select Days</p>
//                 </div>

//                 {/* CTA */}
//                 <button className="w-full bg-mist-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-mist-700 transition-colors duration-200">
//                   Next
//                 </button>

//                 {/* Price breakdown */}
//                 <div className="space-y-2 pt-1">
//                   <div className="flex justify-between text-xs text-mist-400">
//                     <span>Car Total · ${car.pricePerDay}/day × {days || 0} days</span>
//                     <span className="text-mist-700">${subtotal.toLocaleString()}</span>
//                   </div>
//                   {discountPercent > 0 && (
//                     <div className="flex justify-between text-xs text-green-600">
//                       <span>Discount · {discountPercent}%</span>
//                       <span>-${discountAmount.toLocaleString()}</span>
//                     </div>
//                   )}
//                   {driverTotal > 0 && (
//                     <div className="flex justify-between text-xs text-mist-400">
//                       <span>Driver · {days} days</span>
//                       <span className="text-mist-700">${driverTotal.toLocaleString()}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between text-xs text-mist-400">
//                     <span>Tax · 8.5%</span>
//                     <span className="text-mist-700">${tax.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-xs text-mist-400">
//                     <span>Security Deposit · Fully refundable</span>
//                     <span className="text-mist-700">${securityDeposit.toLocaleString()}</span>
//                   </div>
//                   <hr className="border-mist-100" />
//                   <div className="flex justify-between font-bold text-mist-900 text-sm">
//                     <span>Total Charges</span>
//                     <span>${total.toLocaleString()}</span>
//                   </div>
//                 </div>

//                 {/* Pickup */}
//                 <div className="flex items-start gap-2 border-t border-mist-100 pt-3">
//                   <MapPin size={13} className="text-mist-400 shrink-0 mt-0.5" />
//                   <p className="text-[11px] text-mist-400">Pickup: {car.location}</p>
//                 </div>

//                 {/* Description short note */}
//                 <div className="flex items-start gap-2">
//                   <span className="text-[11px] text-mist-400 leading-relaxed">
//                     ⓘ {car.shortDescription}
//                   </span>
//                 </div>
//               </div>

//               {/* Pickup Location */}
//               <div className="mt-4 flex items-center gap-2 text-sm text-mist-500 px-1">
//                 <MapPin size={14} />
//                 Pickup: {car.location}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//       <div className="px-6 sm:px-16 lg:px-20 pt-16 flex items-center justify-between">
//         <h2 className="text-xl sm:text-3xl font-bold text-mist-900">
//           You may also like
//         </h2>
//         <a
//           href="#"
//           className="flex items-center gap-1 text-sm font-medium text-mist-500 bg-mist-100 rounded-md px-4 py-2 hover:bg-mist-50 transition-colors duration-150 whitespace-nowrap shrink-0"
//         >
//           View all
//           <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
//           </svg>
//         </a>
//       </div>
//       <Rentals showHeader={false} />
//       <WhyChooseUs />
//       <Reviews /> 
//             <FAQ />
//             <Contact />
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import CarGallery from "@/components/cars/CarGallery"
import Rentals from "@/components/home/Rentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import { MapPin, Shield, Clock, DollarSign, Share2, Bookmark, Minus, Plus } from "lucide-react"
import {
  AlertCircle,
  Users, Zap, Gauge, Activity, Settings2, Fuel, Calendar, Route,
  Tag, ChevronDown, ChevronUp,
} from "lucide-react";

const car = {
  pricePerDay: 799,
  location: "8687 Melrose Ave, Los Angeles",
};

const today = new Date().toISOString().split("T")[0];

function calcDiscount(days) {
  if (days >= 30) return 50;
  if (days >= 7) return 20;
  if (days >= 3) return 10;
  return 0;
}

// The one shared field-box class used by EVERY row
const fieldBox =
  "w-full border border-mist-200 rounded-xl px-3 py-2.5 text-sm text-mist-700 bg-white";

function RadioDot({ active }) {
  return (
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? "border-blue-600" : "border-mist-300"
        }`}
    >
      {active && <div className="w-2 h-2 rounded-full bg-blue-600" />}
    </div>
  );
}

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
  originalPrice?: number | null
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
  const [needDriver, setNeedDriver] = useState<boolean | null>(null)
  const [driverHours, setDriverHours] = useState(8)
  const [driverAvailability, setDriverAvailability] = useState<"full" | "select">("select")
  const [driverDays, setDriverDays] = useState(1)
  const [showMobileBooking, setShowMobileBooking] = useState(false)
  const [discountsOpen, setDiscountsOpen] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const today = new Date().toISOString().split("T")[0]

  const days: number =
    startDate && endDate
      ? Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      )
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
  const actualDriverDays: number =
    driverAvailability === "full" ? days : driverDays
  const driverTotal: number =
    needDriver ? actualDriverDays * driverHours * 45 : 0
  const taxRate = 0.085
  const preTax = subtotal - discountAmount + driverTotal
  const tax = Math.round(preTax * taxRate)
  const securityDeposit = Math.round(car.pricePerDay * 2)
  const total = preTax + tax + securityDeposit

  const originalDayRate = car.originalPrice ?? Math.round(car.pricePerDay * 1.2)

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

  const fieldBox = "w-full px-5 py-4 bg-white border border-gray-200 rounded-lg text-gray-400 text-lg transition-all";

  return (
    <div className="bg-white min-h-screen mt-10 2xl:mt-24 pb-24 lg:pb-0">
      <div className="px-6 sm:px-16 2xl:px-32 py-16 2xl:py-24">


        {/* Breadcrumb */}
        <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-10 2xl:pb-16">
          <div className="min-w-0 flex items-center gap-1.5 sm:gap-2 2xl:gap-4 text-xs sm:text-base 2xl:text-xl text-mist-400 whitespace-nowrap">
            <Link href="/" className="hover:text-mist-700">Los Angeles</Link>
            <span>{">"}</span>
            <Link href={`/cars?brand=${car.brandSlug}`} className="hover:text-mist-700">{car.brandName}</Link>
            <span>{">"}</span>
            <Link href={`/cars?category=${car.categorySlug}`} className="hover:text-mist-700">{car.categoryName}</Link>
          </div>
          {/* Share / Save */}
          <div className="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4 2xl:gap-5">
            <button className="flex items-center gap-1.5 text-xs sm:text-sm 2xl:text-lg text-mist-500 hover:text-mist-800">
              <Share2 size={14} /> Share
            </button>
            <button className="flex items-center gap-1.5 text-xs sm:text-sm 2xl:text-lg text-mist-500 hover:text-mist-800">
              <Bookmark size={14} /> Save
            </button>
          </div>
        </div>

        <div className="pb-16 2xl:pb-24">

          <div className="flex flex-col lg:flex-row gap-10 2xl:gap-16 items-start">
            {/* Left Column */}
            <div className="flex-1 min-w-0 space-y-8 2xl:space-y-12">

              {/* Gallery */}
              <CarGallery images={car.images} />
              {/* Mobile title block */}
              <div className="lg:hidden space-y-2">
                <h1 className="text-2xl font-semibold text-mist-900">{car.name}</h1>
                {car.shortDescription && (
                  <p className="text-sm text-mist-500 leading-relaxed">{car.shortDescription}</p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-mist-900">${car.pricePerDay.toLocaleString()}</span>
                  <span className="text-sm text-mist-400">USD / day</span>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 2xl:gap-5 mb-8 2xl:mb-12">
                {/* Left card */}
                <div className="bg-mist-100 rounded-xl p-4 2xl:p-6 space-y-2.5 2xl:space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Shield size={30} className="text-mist-400 bg-white p-2 rounded-md flex-shrink-0" />
                    <p className="text-sm 2xl:text-lg text-mist-500">
                      <span className="font-semibold">Security Deposit:</span> ${securityDeposit.toLocaleString()} <span className="text-[10px] 2xl:text-xs italic">(Fully Refundable)</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <DollarSign size={30} className="text-mist-400 bg-white p-2 rounded-md flex-shrink-0" />
                    <p className="text-sm 2xl:text-lg text-mist-500">
                      <span className="font-semibold">Tax:</span> 8.5%
                    </p>
                  </div>
                </div>

                {/* Right card */}
                <div className="bg-mist-100 rounded-xl p-4 2xl:p-6 space-y-2.5 2xl:space-y-4 relative pl-12 2xl:pl-14">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 2xl:w-9 2xl:h-9 bg-white rounded-md flex items-center justify-center">
                    <Tag size={14} className="text-mist-400" />
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-mist-400 mt-0.5">•</span>
                    <p className="text-sm 2xl:text-lg text-mist-500">
                      <span className="font-semibold">Rental Duration:</span> {car.minRentalDays}+ days min
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-mist-400 mt-0.5">•</span>
                    <p className="text-sm 2xl:text-lg text-mist-500">
                      <span className="font-semibold">Extra Hour:</span> 25% of the daily rate
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-mist-400 mt-0.5">•</span>
                    <p className="text-sm 2xl:text-lg text-mist-500">
                      <span className="font-semibold">Extra Miles:</span> Charged at an extra day
                    </p>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 2xl:gap-5 mb-8 2xl:mb-12">
                {[
                  { label: "Seats", value: car.seats, icon: Users },
                  { label: "0-60 mph", value: car.acceleration || "-", icon: Zap },
                  { label: "Engine", value: car.horsepower ? `${car.horsepower} hp` : "-", icon: Gauge },
                  // { label: "Top Speed", value: car.topSpeed || "-", icon: Activity },
                  // { label: "Transmission", value: car.transmission, icon: Settings2 },
                  // { label: "Fuel", value: car.fuelType, icon: Fuel },
                  // { label: "Year", value: car.year || "-", icon: Calendar },
                  // { label: "Miles/Day", value: `${car.milesIncluded}`, icon: Route },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-mist-100 rounded-xl p-4 2xl:p-6 flex flex-col sm:flex-row items-center gap-4">
                    <Icon size={30} className="text-mist-400 bg-neutral-200 rounded-full p-1.5" />
                    <div>
                      <p className="text-sm 2xl:text-lg font-bold text-mist-900 mt-1">{label}</p>
                      <p className="text-sm 2xl:text-lg text-mist-500">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Long-Term Rental Discounts ── */}
              <div>
                {/* Section header */}
                <button
                  type="button"
                  onClick={() => setDiscountsOpen(!discountsOpen)}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                      <Tag size={13} className="text-blue-500" />
                    </div>
                    <span className="text-base 2xl:text-xl font-bold text-mist-900">Long-Term Rental Discounts</span>
                  </div>
                  {discountsOpen
                    ? <ChevronUp size={16} className="text-mist-400" />
                    : <ChevronDown size={16} className="text-mist-400" />}
                </button>

                {discountsOpen && (
                  <>
                    {/* Table with blue-tinted bg */}
                    <div className="bg-blue-100 rounded-xl overflow-hidden border border-blue-400">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-mist-300">
                            <th className="text-left px-4 2xl:px-6 py-3 2xl:py-4 font-medium text-mist-500 text-xs 2xl:text-base">Duration</th>
                            <th className="text-left px-4 2xl:px-6 py-3 2xl:py-4 font-medium text-mist-500 text-xs 2xl:text-base border-l border-mist-300">Discount</th>
                            <th className="text-left px-4 2xl:px-6 py-3 2xl:py-4 font-medium text-mist-500 text-xs 2xl:text-base border-l border-mist-300">Mileage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountTiers.map((tier, i) => (
                            <tr key={i} className="border-t border-mist-300">
                              <td className="px-4 2xl:px-6 py-2.5 2xl:py-4 text-mist-600 text-sm 2xl:text-lg">{tier.duration}</td>
                              <td className="px-4 2xl:px-6 py-2.5 2xl:py-4 font-semibold text-mist-800 text-sm 2xl:text-lg border-l border-mist-300">{tier.discount}</td>
                              <td className="px-4 2xl:px-6 py-2.5 2xl:py-4 text-mist-500 text-sm 2xl:text-lg border-l border-mist-300">{tier.miles}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs 2xl:text-lg text-mist-500 px-4 2xl:px-6 py-3 2xl:py-4 border-t border-mist-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-mist-300 inline-block flex-shrink-0" />
                        <span><span className="font-medium text-mist-700">Vehicle Swap Option:</span> Available with 30-day notice</span>
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* ── Description ── */}
              {car.description && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowMore(!showMore)}
                    className="w-full flex items-center justify-between mb-2"
                  >
                    <h2 className="text-base 2xl:text-xl font-bold text-mist-900 text-left">
                      Rent a {car.name} in {car.location}
                    </h2>
                    <ChevronDown
                      size={16}
                      className={`text-mist-400 flex-shrink-0 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
                    />
                  </button>

                  <p className={`text-sm 2xl:text-lg text-mist-500 leading-relaxed ${showMore ? "" : "line-clamp-3"}`}>
                    {car.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowMore(!showMore)}
                    className="mt-1 text-sm 2xl:text-lg text-mist-700 font-medium hover:text-mist-900"
                  >
                    {showMore ? "Show less ›" : "Show more ›"}
                  </button>
                </div>
              )}


              {/* RIGHT COLUMN — Booking Form */}

            </div>
            <div className="hidden lg:block lg:w-[380px] 2xl:w-[500px] flex-shrink-0 lg:self-start">
              <div>
                {/* Header - Always visible */}
                <div className="mb-8 2xl:mb-12">
                  <h1 className="text-3xl 2xl:text-5xl font-semibold text-mist-900 mb-2 2xl:mb-4">{car.name}</h1>
                  {car.shortDescription && (
                    <p className="text-mist-600 text-base 2xl:text-xl leading-relaxed mb-4 2xl:mb-6">{car.shortDescription}</p>
                  )}
                  
                </div>

                {/* Form Container */}
                <div className="bg-white border border-mist-300 rounded-lg p-5 2xl:p-8 space-y-5 2xl:space-y-7 shadow-lg lg:sticky lg:top-24 lg:h-fit">
                  <div className="flex items-baseline gap-2 mb-6 2xl:mb-8">
                    <span className="text-3xl 2xl:text-5xl font-bold text-mist-900">
                      ${car.pricePerDay.toLocaleString()}
                    </span>
                    {car.originalPrice ? (
                      <span className="text-sm 2xl:text-lg text-mist-400 line-through">${car.originalPrice.toLocaleString()}</span>
                    ) : (
                      <span className="text-sm 2xl:text-lg text-mist-400">USD / day</span>
                    )}
                  </div>
                  {/* Date + Time Rows */}
                  <div className="space-y-3 2xl:space-y-4 border-t border-mist-300 pt-6 2xl:pt-8">
                    {/* Start date + time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type={startDate ? "date" : "text"}
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => !startDate && (e.target.type = "text")}
                          min={today}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder="Start date*"
                          className="w-full bg-white border border-mist-300 rounded-md px-3 2xl:px-5 py-2.5 2xl:py-4 text-sm 2xl:text-lg text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-mist-300"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type={startTime ? "time" : "text"}
                          onFocus={(e) => (e.target.type = "time")}
                          onBlur={(e) => !startTime && (e.target.type = "text")}
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          placeholder="Time*"
                          className="w-full bg-white border border-mist-300 rounded-md px-3 2xl:px-5 py-2.5 2xl:py-4 text-sm 2xl:text-lg text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-mist-300"
                        />
                      </div>
                    </div>

                    {/* End date + time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type={endDate ? "date" : "text"}
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => !endDate && (e.target.type = "text")}
                          min={startDate || today}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          placeholder="End date*"
                          className="w-full bg-white border border-mist-300 rounded-md px-3 2xl:px-5 py-2.5 2xl:py-4 text-sm 2xl:text-lg text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-mist-300"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type={endTime ? "time" : "text"}
                          onFocus={(e) => (e.target.type = "time")}
                          onBlur={(e) => !endTime && (e.target.type = "text")}
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          placeholder="Time*"
                          className="w-full bg-white border border-mist-300 rounded-md px-3 2xl:px-5 py-2.5 2xl:py-4 text-sm 2xl:text-lg text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-mist-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Need a Driver */}
                  <div className="space-y-3 2xl:space-y-4">
                    <p className="text-[15px] 2xl:text-xl font-bold text-mist-500">
                      Need a Driver? 
                    </p>

                    <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 2xl:px-5 py-3 2xl:py-4 cursor-pointer hover:border-mist-400 transition">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="needDriver"
                          checked={needDriver === true}
                          onChange={() => setNeedDriver(true)}
                          className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                        />
                        <span className="text-sm 2xl:text-lg text-mist-700">Yes, I will need a driver</span>
                      </div>
                      <span className="text-sm 2xl:text-lg font-bold text-mist-900">$45/hr</span>
                    </label>

                    <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 2xl:px-5 py-3 2xl:py-4 cursor-pointer hover:border-mist-400 transition">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="needDriver"
                          checked={needDriver === false}
                          onChange={() => setNeedDriver(false)}
                          className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                        />
                        <span className="text-sm 2xl:text-lg text-mist-700">No, I do not need a driver</span>
                      </div>
                    </label>
                  </div>

                  {needDriver && (
                    <div className="space-y-4">
                      {/* Driver Hours Slider */}
                      <div className="space-y-2">
                        <p className="text-xs 2xl:text-base text-mist-500">Driver Hours per Day</p>
                        <input
                          type="range"
                          min={1}
                          max={16}
                          value={driverHours}
                          onChange={(e) => setDriverHours(Number(e.target.value))}
                          className="w-full accent-mist-500"
                        />
                        <div className="flex justify-between text-[10px] 2xl:text-base text-mist-400">
                          <span>0 hr</span>
                          <span className="font-medium text-mist-600">{driverHours} hr</span>
                          <span>16 hr</span>
                        </div>
                      </div>

                      {/* Driver Availability */}
                      <div className="space-y-2">
                        <p className="text-sm 2xl:text-lg font-medium text-mist-700">Driver Availability:</p>

                        <label className="flex items-center gap-3 border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                          <input
                            type="radio"
                            name="driverAvail"
                            checked={driverAvailability === "full"}
                            onChange={() => setDriverAvailability("full")}
                            className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                          />
                          <span className="text-sm 2xl:text-lg text-mist-700">Full Rental</span>
                        </label>

                        <label className="flex items-center gap-3 border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                          <input
                            type="radio"
                            name="driverAvail"
                            checked={driverAvailability === "select"}
                            onChange={() => setDriverAvailability("select")}
                            className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                          />
                          <span className="text-sm 2xl:text-lg text-mist-700">Select Days</span>
                        </label>
                      </div>

                      {/* Day Counter */}
                      {driverAvailability === "select" && (
                        <div className="flex items-center justify-between border border-mist-300 rounded-md px-3 py-2.5">
                          <button
                            type="button"
                            onClick={() => setDriverDays(Math.max(1, driverDays - 1))}
                            className="w-8 h-8 rounded-md border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm 2xl:text-lg font-medium text-mist-900">{driverDays} days</span>
                          <button
                            type="button"
                            onClick={() => setDriverDays(Math.min(days || 365, driverDays + 1))}
                            className="w-8 h-8 rounded-md border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Next + Pricing */}
                  {days > 0 ? (
                    <>
                      <button
                        onClick={handleNext}
                        className="w-full bg-neutral-500 hover:bg-mist-700 transition text-white py-3.5 2xl:py-5 rounded-md font-semibold text-sm 2xl:text-lg tracking-wide"
                      >
                        Next
                      </button>

                      {/* Price breakdown */}
                      <div className="space-y-3 2xl:space-y-4 pt-4 2xl:pt-6 border-t border-mist-200">
                        <div className="flex justify-between text-mist-500 text-sm 2xl:text-lg">
                          <span>Car Total · ${car.pricePerDay} × {days}d</span>
                          <span className="text-mist-900 font-medium">${subtotal.toLocaleString()}</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="flex justify-between text-green-600 text-sm 2xl:text-lg">
                            <span>Discount · {days} days – {discountPercent}%</span>
                            <span>-${discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                        {driverTotal > 0 && (
                          <div className="flex justify-between text-mist-500 text-sm 2xl:text-lg">
                            <span>Driver Total · {driverHours}hr × $45 × {actualDriverDays}d</span>
                            <span className="text-mist-900 font-medium">${driverTotal.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-mist-500 text-sm 2xl:text-lg">
                          <span>Tax · 8.5%</span>
                          <span className="text-mist-900 font-medium">${tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-mist-500 text-sm 2xl:text-lg">
                          <span>Security Deposit · Fully refundable</span>
                          <span className="text-mist-900 font-medium">${securityDeposit.toLocaleString()}</span>
                        </div>
                        <hr className="border-mist-200" />
                        <div className="flex justify-between font-bold text-mist-900 text-base 2xl:text-xl pt-1">
                          <span>Total Charges</span>
                          <span>${total.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 border border-mist-200 rounded-md">
                      <p className="text-mist-400 text-sm 2xl:text-lg">Select dates to see pricing</p>
                    </div>
                  )}
                </div>

                {/* Pickup location */}
                <div className="mt-4 2xl:mt-6 border border-mist-300 rounded-md px-3 2xl:px-5 py-2.5 2xl:py-4 bg-white flex items-center gap-2 text-sm 2xl:text-lg text-mist-500">
                  <MapPin size={14} className="text-mist-400 flex-shrink-0" />
                  <span>Pickup: {car.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-mist-200 px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xl sm:text-2xl font-semibold text-mist-900 leading-none">
              ${car.pricePerDay.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-mist-500 leading-tight">
              {car.originalPrice ? (
                <><span className="line-through">${car.originalPrice.toLocaleString()}</span>/day</>
              ) : (
                <span>/day</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowMobileBooking(true)}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl whitespace-nowrap"
          >
            START
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Booking Popup */}
      {showMobileBooking && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-mist-200 px-4 py-3 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-mist-900">Select Dates</h3>
            <button
              type="button"
              onClick={() => setShowMobileBooking(false)}
              className="text-mist-600 text-2xl leading-none"
              aria-label="Close booking form"
            >
              ×
            </button>
          </div>

          <div className="px-4 py-4 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-mist-900 mb-2">{car.name}</h1>
              {car.shortDescription && (
                <p className="text-mist-600 text-base leading-relaxed mb-4">{car.shortDescription}</p>
              )}
            </div>

            <div className="bg-white border border-mist-300 rounded-lg p-5 space-y-5 shadow-lg">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-mist-900">
                  ${car.pricePerDay.toLocaleString()}
                </span>
                {car.originalPrice ? (
                  <span className="text-sm text-mist-400 line-through">${car.originalPrice.toLocaleString()}</span>
                ) : (
                  <span className="text-sm text-mist-400">USD / day</span>
                )}
              </div>

              <div className="space-y-3 border-t border-mist-300 pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type={startDate ? "date" : "text"}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => !startDate && (e.target.type = "text")}
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Start date*"
                      className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-mist-300"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={startTime ? "time" : "text"}
                      onFocus={(e) => (e.target.type = "time")}
                      onBlur={(e) => !startTime && (e.target.type = "text")}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="Time*"
                      className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-mist-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type={endDate ? "date" : "text"}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => !endDate && (e.target.type = "text")}
                      min={startDate || today}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="End date*"
                      className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-mist-300"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={endTime ? "time" : "text"}
                      onFocus={(e) => (e.target.type = "time")}
                      onBlur={(e) => !endTime && (e.target.type = "text")}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      placeholder="Time*"
                      className="w-full bg-white border border-mist-300 rounded-md px-3 py-2.5 text-sm text-mist-700 focus:outline-none focus:border-mist-400 placeholder:text-mist-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[15px] font-bold text-mist-500">Need a Driver?</p>

                <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="needDriverMobile"
                      checked={needDriver === true}
                      onChange={() => setNeedDriver(true)}
                      className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-mist-700">Yes, I will need a driver</span>
                  </div>
                  <span className="text-sm font-bold text-mist-900">$45/hr</span>
                </label>

                <label className="flex items-center justify-between border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="needDriverMobile"
                      checked={needDriver === false}
                      onChange={() => setNeedDriver(false)}
                      className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-mist-700">No, I do not need a driver</span>
                  </div>
                </label>
              </div>

              {needDriver && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-mist-500">Driver Hours per Day</p>
                    <input
                      type="range"
                      min={1}
                      max={16}
                      value={driverHours}
                      onChange={(e) => setDriverHours(Number(e.target.value))}
                      className="w-full accent-mist-500"
                    />
                    <div className="flex justify-between text-[10px] text-mist-400">
                      <span>0 hr</span>
                      <span className="font-medium text-mist-600">{driverHours} hr</span>
                      <span>16 hr</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-mist-700">Driver Availability:</p>

                    <label className="flex items-center gap-3 border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                      <input
                        type="radio"
                        name="driverAvailMobile"
                        checked={driverAvailability === "full"}
                        onChange={() => setDriverAvailability("full")}
                        className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                      />
                      <span className="text-sm text-mist-700">Full Rental</span>
                    </label>

                    <label className="flex items-center gap-3 border border-mist-200 rounded-md px-3 py-3 cursor-pointer hover:border-mist-400 transition">
                      <input
                        type="radio"
                        name="driverAvailMobile"
                        checked={driverAvailability === "select"}
                        onChange={() => setDriverAvailability("select")}
                        className="w-5 h-5 rounded-full accent-blue-600 cursor-pointer"
                      />
                      <span className="text-sm text-mist-700">Select Days</span>
                    </label>
                  </div>

                  {driverAvailability === "select" && (
                    <div className="flex items-center justify-between border border-mist-300 rounded-md px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => setDriverDays(Math.max(1, driverDays - 1))}
                        className="w-8 h-8 rounded-md border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium text-mist-900">{driverDays} days</span>
                      <button
                        type="button"
                        onClick={() => setDriverDays(Math.min(days || 365, driverDays + 1))}
                        className="w-8 h-8 rounded-md border border-mist-200 flex items-center justify-center text-mist-500 hover:bg-mist-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {days > 0 ? (
                <>
                  <button
                    onClick={handleNext}
                    className="w-full bg-neutral-500 hover:bg-mist-700 transition text-white py-3.5 rounded-md font-semibold text-sm tracking-wide"
                  >
                    Next
                  </button>

                  <div className="space-y-3 pt-4 border-t border-mist-200">
                    <div className="flex justify-between text-mist-500 text-sm">
                      <span>Car Total · ${car.pricePerDay} × {days}d</span>
                      <span className="text-mist-900 font-medium">${subtotal.toLocaleString()}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-green-600 text-sm">
                        <span>Discount · {days} days – {discountPercent}%</span>
                        <span>-${discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {driverTotal > 0 && (
                      <div className="flex justify-between text-mist-500 text-sm">
                        <span>Driver Total · {driverHours}hr × $45 × {actualDriverDays}d</span>
                        <span className="text-mist-900 font-medium">${driverTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-mist-500 text-sm">
                      <span>Tax · 8.5%</span>
                      <span className="text-mist-900 font-medium">${tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-mist-500 text-sm">
                      <span>Security Deposit · Fully refundable</span>
                      <span className="text-mist-900 font-medium">${securityDeposit.toLocaleString()}</span>
                    </div>
                    <hr className="border-mist-200" />
                    <div className="flex justify-between font-bold text-mist-900 text-base pt-1">
                      <span>Total Charges</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 border border-mist-200 rounded-md">
                  <p className="text-mist-400 text-sm">Select dates to see pricing</p>
                </div>
              )}
            </div>

            <div className="border border-mist-300 rounded-md px-3 py-2.5 bg-white flex items-center gap-2 text-sm text-mist-500">
              <MapPin size={14} className="text-mist-400 flex-shrink-0" />
              <span>Pickup: {car.location}</span>
            </div>
          </div>
        </div>
      )}

        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 pt-16 2xl:pt-24 flex items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-bold text-mist-900 tracking-tight">
            You may also like
          </h2>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-medium text-mist-500 bg-mist-100 rounded-md px-4 py-2 hover:bg-mist-50 transition-colors duration-150 whitespace-nowrap shrink-0"
          >
            View all
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      <Rentals showHeader={false} />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
} 