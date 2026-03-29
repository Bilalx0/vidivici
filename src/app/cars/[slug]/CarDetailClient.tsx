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
//               <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 px-1">
//                 <MapPin size={14} />
//                 Pickup: {car.location}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//       <div className="px-10 sm:px-16 lg:px-20 pt-16 flex items-center justify-between">
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
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white";

function RadioDot({ active }) {
  return (
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? "border-blue-600" : "border-gray-300"
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

            {/* ── Quick Info — two gray boxes side by side ── */}
            <div className="grid grid-cols-2 gap-3">
              {/* Left box */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Shield size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>
                    <span className="font-medium text-gray-700">Security Deposit:</span>{" "}
                    ${securityDeposit.toLocaleString()} fully refundable
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <DollarSign size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>
                    <span className="font-medium text-gray-700">Tax:</span> 8.5%
                  </span>
                </div>
              </div>

              {/* Right box */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Clock size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>
                    <span className="font-medium text-gray-700">Rental Duration:</span>{" "}
                    {car.minRentalDays}+ days min
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <AlertCircle size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>
                    <span className="font-medium text-gray-700">Extra Hours:</span>{" "}
                    25% of the daily rate
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Route size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>
                    <span className="font-medium text-gray-700">Extra Miles:</span>{" "}
                    Charged at an extra day
                  </span>
                </div>
              </div>
            </div>

            {/* ── Specs Grid — icons + label + value ── */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[
                { label: "Seats", value: car.seats, icon: Users },
                { label: "0-60 mph", value: car.acceleration, icon: Zap },
                { label: "Engine", value: car.horsepower, icon: Gauge },
                { label: "Top Speed", value: car.topSpeed, icon: Activity },
                { label: "Transmission", value: car.transmission, icon: Settings2 },
                { label: "Fuel", value: car.fuelType, icon: Fuel },
                { label: "Year", value: car.year, icon: Calendar },
                { label: "Miles/Day", value: `${car.milesIncluded}`, icon: Route },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <Icon size={14} className="text-gray-400 mb-1" />
                  <p className="text-[10px] text-gray-400 leading-tight">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
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
                  <span className="text-base font-bold text-gray-900">Long-Term Rental Discounts</span>
                </div>
                {discountsOpen
                  ? <ChevronUp size={16} className="text-gray-400" />
                  : <ChevronDown size={16} className="text-gray-400" />}
              </button>

              {discountsOpen && (
                <>
                  {/* Table with blue-tinted bg */}
                  <div className="bg-blue-50 rounded-xl overflow-hidden border border-blue-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Duration</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Discount</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Mileage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {discountTiers.map((tier, i) => (
                          <tr key={i} className="border-t border-blue-100 bg-white/60">
                            <td className="px-4 py-2.5 text-gray-600 text-sm">{tier.duration}</td>
                            <td className="px-4 py-2.5 font-semibold text-gray-800 text-sm">{tier.discount}</td>
                            <td className="px-4 py-2.5 text-gray-500 text-sm">{tier.miles}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block flex-shrink-0" />
                    Vehicle Swap Option: Available with 30-day notice
                  </p>
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
                  <h2 className="text-base font-bold text-gray-900 text-left">
                    Rent a {car.name} in {car.location}
                  </h2>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
                  />
                </button>

                <p className={`text-sm text-gray-500 leading-relaxed ${showMore ? "" : "line-clamp-3"}`}>
                  {car.description}
                </p>

                <button
                  type="button"
                  onClick={() => setShowMore(!showMore)}
                  className="mt-1 text-sm text-gray-700 font-medium hover:text-gray-900"
                >
                  {showMore ? "Show less ›" : "Show more ›"}
                </button>
              </div>
            )}


            {/* RIGHT COLUMN — Booking Form 2/5 */}

          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">

                {/* Start date + time */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date" min={today} value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start date*"
                    className={fieldBox + " focus:border-gray-400 focus:outline-none placeholder:text-gray-400"}
                  />
                  <input
                    type="time" value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={fieldBox + " focus:border-gray-400 focus:outline-none"}
                  />
                </div>

                {/* End date + time */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date" min={startDate || today} value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End date*"
                    className={fieldBox + " focus:border-gray-400 focus:outline-none placeholder:text-gray-400"}
                  />
                  <input
                    type="time" value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={fieldBox + " focus:border-gray-400 focus:outline-none"}
                  />
                </div>

                {/* Need a Driver label */}
                <p className="text-sm font-medium text-gray-700 pt-1">Need a Driver?</p>

                {/* Driver checkbox — field-box styled row */}
                <label className={fieldBox + " flex items-center gap-2.5 cursor-pointer"}>
                  <RadioDot active={needDriver} />
                  <input
                    type="checkbox" checked={needDriver}
                    onChange={(e) => setNeedDriver(e.target.checked)}
                    className="sr-only"
                  />
                  <span className="text-gray-600">Yes, I will need a driver ($45/hour)</span>
                </label>

                {needDriver && (
                  <>
                    {/* Driver Hours Slider — field-box styled row */}
                    <div className={fieldBox + " space-y-2"}>
                      <p className="text-xs text-gray-500">Driver Hours per Day</p>
                      <input
                        type="range" min={1} max={16} value={driverHours}
                        onChange={(e) => setDriverHours(Number(e.target.value))}
                        className="w-full accent-gray-900"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>0 hr</span>
                        <span className="font-medium text-gray-600">{driverHours} hr</span>
                        <span>16 hr</span>
                      </div>
                    </div>

                    {/* Driver Availability label */}
                    <p className="text-sm font-medium text-gray-700 pt-1">Driver Availability:</p>

                    {/* Full Rental radio — field-box styled row */}
                    <label className={fieldBox + " flex items-center gap-2.5 cursor-pointer"}>
                      <RadioDot active={driverAvailability === "full"} />
                      <input
                        type="radio" name="driverAvail"
                        checked={driverAvailability === "full"}
                        onChange={() => setDriverAvailability("full")}
                        className="sr-only"
                      />
                      <span className="text-gray-600">Full Rental</span>
                    </label>

                    {/* Select Days radio — field-box styled row */}
                    <label className={fieldBox + " flex items-center gap-2.5 cursor-pointer"}>
                      <RadioDot active={driverAvailability === "select"} />
                      <input
                        type="radio" name="driverAvail"
                        checked={driverAvailability === "select"}
                        onChange={() => setDriverAvailability("select")}
                        className="sr-only"
                      />
                      <span className="text-gray-600">Select Days</span>
                    </label>

                    {/* Day counter — field-box styled row */}
                    {driverAvailability === "select" && (
                      <div className={fieldBox + " flex items-center justify-between"}>
                        <button
                          type="button"
                          onClick={() => setDriverDays(Math.max(1, driverDays - 1))}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium text-gray-900">{driverDays}</span>
                        <button
                          type="button"
                          onClick={() => setDriverDays(Math.min(days || 365, driverDays + 1))}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Next + Pricing */}
                {days > 0 ? (
                  <>
                    <button
                      onClick={() => alert("Proceeding to next step…")}
                      className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>

                    {/* Price breakdown — field-box styled container */}
                    <div className={fieldBox + " space-y-2 py-3"}>
                      <div className="flex justify-between text-gray-500">
                        <span>Car Total · ${car.pricePerDay} × {days}d</span>
                        <span className="text-gray-900 font-medium">${subtotal.toLocaleString()}</span>
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
                          <span className="text-gray-900 font-medium">${driverTotal.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-500">
                        <span>Tax · 8.5%</span>
                        <span className="text-gray-900 font-medium">${tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Security Deposit · Fully refundable</span>
                        <span className="text-gray-900 font-medium">${securityDeposit.toLocaleString()}</span>
                      </div>
                      <hr className="border-gray-100" />
                      <div className="flex justify-between font-bold text-gray-900 text-base">
                        <span>Total Charges</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={fieldBox + " text-center py-2"}>
                    <p className="text-gray-400">Select dates to see pricing</p>
                  </div>
                )}
              </div>

              {/* Pickup location — field-box styled row outside main card */}
              <div className="mt-3 border border-gray-200 rounded-xl px-4 py-3 bg-white flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                <span>Pickup: {car.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-10 sm:px-16 lg:px-20 pt-16 flex items-center justify-between">
        <h2 className="text-xl sm:text-3xl font-bold text-mist-900">
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