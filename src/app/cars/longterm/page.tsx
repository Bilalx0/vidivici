"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"
import Rentals from "@/components/home/Rentals"

import { Tag, Calendar, RefreshCw, Gauge, HeadphonesIcon } from "lucide-react";

const rows = [
  { duration: "7–13 days", discount: "15% OFF", mileage: "Up to 100 miles/day" },
  { duration: "14–29 days", discount: "25% OFF", mileage: "Up to 75 miles/day" },
  { duration: "1–3 months", discount: "35% OFF", mileage: "1,500 miles/month" },
  { duration: "3–6 months", discount: "50% OFF", mileage: "1,000 miles/month" },
  { duration: "6–9 months", discount: "60% OFF", mileage: "1,000 miles/month" },
  { duration: "9–12 months", discount: "65% OFF", mileage: "1,000 miles/month" },
];

const features = [
  {
    icon: <Tag className="w-5 h-5 text-mist-700" />,
    title: "Save Up to 65%",
    description:
      "Enjoy exclusive long-term pricing with up to 65% off standard daily rates.",
  },
  {
    icon: <Calendar className="w-5 h-5 text-mist-700" />,
    title: "Flexible Duration",
    description:
      "Choose plans starting from 7 days to 12 months.",
  },
  {
    icon: <RefreshCw className="w-5 h-5 text-mist-700" />,
    title: "Vehicle Swap Option",
    description:
      "Swap your vehicle with the fleet. Switch to suit your experience.",
  },
  {
    icon: <Gauge className="w-5 h-5 text-mist-700" />,
    title: "Generous Mileage",
    description:
      "Up to 3,000 miles per month, depending on your plan.",
  },
  {
    icon: <HeadphonesIcon className="w-5 h-5 text-mist-700" />,
    title: "Concierge Support",
    description:
      "From 24/7 customer care to a dedicated luxury concierge team.",
  },
];

export default function LongTermPage() {
  return (
    <div>
      <Banner
        heading="Long-Term Luxury Rentals"
        description="Flexible plans starting from 7 days to 12 months — save up to 65% on standard daily rates."
        height="h-96"
      />

      <section className="w-full ">
        <div className="px-10 sm:px-16 lg:px-20 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left: Text Content */}
            <div className="flex-1 max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-mist-900 leading-tight mb-5">
                <span className="text-blue-500">Save Up to 65% </span>
                on Long-Term Luxury Car Rentals in Los Angeles
              </h2>

              <p className="text-mist-400 text-sm sm:text-base leading-relaxed mb-4">
                Drive your dream car for a week, a month, or even a year — without the ownership cost.
              </p>
              <p className="text-mist-400 text-sm sm:text-base leading-relaxed mb-4">
                Whether you're staying short-term or renting in for a longer role, enjoy exclusive extended rental rates and flexible mileage plans.
              </p>
              <p className="text-mist-400 text-sm sm:text-base leading-relaxed mb-8">
                From 7-day getaways with 15% off to year-long drives saving up to 65%, we've made luxury driving in Los Angeles more accessible than ever.
              </p>

              <button className="bg-mist-900 hover:bg-mist-800 transition-colors duration-200 text-white text-sm font-semibold px-6 py-3 rounded-md">
                Reserve Now
              </button>
            </div>

            {/* Right: Car Image */}
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <img
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"
                alt="Luxury sports car"
                className="w-full max-w-lg rounded-xl object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="px-10 sm:px-16 lg:px-20 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-mist-900 leading-tight mb-3">
              Why Choose Vidi Vici <br className="hidden sm:block" />
              Long-Term Rentals?
            </h2>
            <p className="text-mist-400 text-sm sm:text-base">
              Experience comfort, flexibility, and luxury — without the burdens of ownership.
            </p>
          </div>


          {/* Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col gap-3 bg-mist-100 p-4 rounded-lg">
                {/* Icon */}
                <div className="w-9 h-9 flex items-center justify-center border border-mist-200 rounded-md">
                  {feature.icon}
                </div>
                {/* Title */}
                <h3 className="text-sm font-bold text-mist-900 leading-snug">
                  {feature.title}
                </h3>
                {/* Description */}
                <p className="text-xs text-mist-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CarBrowse />

      <div className="px-10 sm:px-16 lg:px-20 py-10 flex items-start justify-between gap-4">
        {/* Left: Title + Subtitle */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-mist-900 mb-2">
            Our Long-Term Fleet
          </h2>
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-mist-400 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <p className="text-mist-400 text-sm leading-snug max-w-xs">
              Explore our collection of premium vehicles available for long-term hire in Los Angeles
            </p>
          </div>
        </div>

        {/* Right: View All Link */}
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-mist-500 bg-mist-100 rounded-md px-4 py-2 hover:bg-mist-50 transition-colors duration-150 whitespace-nowrap shrink-0"
        >
          View all
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
      </div>
      <Rentals showHeader={false} />
      <section className="w-full bg-white">
        <div className="px-10 sm:px-16 lg:px-20 py-16">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-bold text-mist-900 text-center leading-tight mb-10">
            The Longer You Drive, The <br className="hidden sm:block" />
            More You Save
          </h2>

          {/* Table */}
          <div className="border border-blue-300 rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-blue-50 px-6 py-3">
              <span className="text-xs font-semibold text-mist-500 uppercase tracking-wide">Duration</span>
              <span className="text-xs font-semibold text-mist-500 uppercase tracking-wide">Discount</span>
              <span className="text-xs font-semibold text-mist-500 uppercase tracking-wide">Mileage</span>
            </div>

            {/* Table Rows */}
            {rows.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 px-6 py-4 border-t border-mist-200 ${index % 2 === 0 ? "bg-blue-50" : "bg-blue-50"
                  }`}
              >
                <span className="text-sm text-mist-600">{row.duration}</span>
                <span className="text-sm font-semibold text-mist-900">{row.discount}</span>
                <span className="text-sm text-mist-500">{row.mileage}</span>
              </div>
            ))}

            {/* Bottom blue accent bar */}
            <div className="h-1.5 bg-blue-500 w-full" />
          </div>
        </div>
      </section>
      <section className="w-full bg-white">
        <div className="px-10 sm:px-16 lg:px-20 py-16">
          <div className="flex flex-col sm:flex-row items-start gap-8">
            {/* Left: Image */}
            <div className="w-full sm:w-64 lg:w-lg shrink-0 rounded-2xl overflow-hidden h-96 sm:h-52 bg-mist-100">
              <img
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80"
                alt="Luxury car on road"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Text */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-mist-900 leading-tight mb-4">
                The Smart Way to Experience LA in Style
              </h2>
              <p className="text-mist-400 text-base leading-relaxed mb-3">
                With Vidi Vici, you're not just renting a car — you're unlocking freedom, comfort, and prestige for as long as you need it.
              </p>
              <p className="text-mist-400 text-base leading-relaxed mb-3">
                Enjoy transparent pricing, premium service, and exclusive long-term discounts —{" "}
                <span className="font-semibold text-mist-700">up to 65% OFF.</span>
              </p>
              <p className="text-mist-400 text-base leading-relaxed">
                The longer you drive, the more you save — and the more luxury you enjoy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative w-full bg-[#eeeeed] py-16 px-10 sm:px-16 lg:px-20 text-center my-16 overflow-hidden">

              <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none  rotate-180"
      />

      {/* Right side vector decoration */}
      <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180"
      />
        {/* Foreground content */}
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mist-900 leading-tight tracking-tight">
            Start Saving{" "}
            <span className="text-blue-500">Up to 65%</span>{" "}
            on <br className="hidden sm:block" />
            Your Luxury Drive Today
          </h2>
          <p className="text-sm sm:text-base text-mist-500 leading-relaxed max-w-sm">
            Choose your dream car, pick your plan, and enjoy premium service —
            all while saving up to 65% on long-term rentals.
          </p>
          <button className="mt-2 bg-mist-900 text-white text-sm font-semibold px-7 py-3 rounded-xl hover:bg-mist-700 transition-colors duration-200">
            Reserve Now
          </button>
        </div>

      </div>
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
}
