"use client"

import { useState, useRef, useEffect } from "react";
import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"
import Rentals from "@/components/home/Rentals"

import { Tag, Calendar, RefreshCw, Gauge, HeadphonesIcon, Info, X } from "lucide-react";
import RelatedCars from "@/components/ui/RelatedCars";

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
    icon: <Tag className="w-5 h-5 text-mist-600" />,
    title: "Save Up to 65%",
    description:
      "Enjoy exclusive long-term pricing with up to 65% off standard daily rates.",
  },
  {
    icon: <Calendar className="w-5 h-5 text-mist-600" />,
    title: "Flexible Duration",
    description:
      "Choose plans starting from 7 days to 12 months.",
  },
  {
    icon: <RefreshCw className="w-5 h-5 text-mist-600" />,
    title: "Vehicle Swap Option",
    description:
      "Swap your vehicle with the fleet. Switch to suit your experience.",
  },
  {
    icon: <Gauge className="w-5 h-5 text-mist-600" />,
    title: "Generous Mileage",
    description:
      "Up to 3,000 miles per month, depending on your plan.",
  },
  {
    icon: <HeadphonesIcon className="w-5 h-5 text-mist-600" />,
    title: "Concierge Support",
    description:
      "From 24/7 customer care to a dedicated luxury concierge team.",
  },
];

export default function LongTermPage() {

  const [infoOpen, setInfoOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setInfoOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <Banner
        heading="Long-Term Luxury Rentals"
        description="Flexible plans starting from 7 days to 12 months — save up to 65% on standard daily rates."
        height="h-96 2xl:h-[520px]"
      />

      <section className="w-full ">
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 2xl:gap-16">
            {/* Left: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-5 2xl:mb-8">
                <span className="text-blue-500">Save Up to 65% </span>
                on Long-Term Luxury Car Rentals in Los Angeles
              </h2>

              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                Drive your dream car for a week, a month, or even a year — without the ownership cost. <span className="hidden 2xl:inline">Enjoy exclusive extended rental rates and flexible mileage plans.</span>
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:hidden leading-relaxed mb-4 2xl:mb-6">
                Whether you're staying short-term or renting in for a longer role, enjoy exclusive extended rental rates and flexible mileage plans.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-8 2xl:mb-10">
                From 7-day getaways with 15% off to year-long drives saving up to 65%, we've made luxury driving in Los Angeles more accessible than ever.
              </p>

              <button className="bg-mist-900 hover:bg-mist-800 transition-colors duration-200 text-white text-sm 2xl:text-xl px-6 2xl:px-10 py-3 2xl:py-5 rounded-md 2xl:rounded-xl">
                Reserve Now
              </button>
            </div>

            {/* Right: Car Image */}
            <div className="w-full lg:w-[620px] 2xl:w-[860px] flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"
                alt="Luxury sports car"
                className="w-full rounded-xl 2xl:rounded-2xl object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mt-24 2xl:mt-48">
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32">
          {/* Header */}
          <div className="text-center mb-12 2xl:mb-20">
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-3 2xl:mb-5">
              Why Choose Vidi Vici <br className="hidden sm:block" />
              Long-Term Rentals?
            </h2>
            <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl">
              Experience comfort, flexibility, and luxury — without the burdens of ownership.
            </p>
          </div>


          {/* Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 2xl:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col gap-3 2xl:gap-5 bg-mist-100 p-4 2xl:p-8 rounded-lg 2xl:rounded-2xl">
                {/* Icon */}
                <div className="bg-white w-9 h-9 2xl:w-14 2xl:h-14 flex items-center justify-center rounded-md 2xl:rounded-xl">
                  {feature.icon}
                </div>
                {/* Title */}
                <h3 className="text-sm 2xl:text-2xl font-bold text-mist-900 leading-snug">
                  {feature.title}
                </h3>
                {/* Description */}
                <p className="text-xs 2xl:text-lg text-mist-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CarBrowse />

      <div className="relative px-6 sm:px-16 lg:px-20 2xl:px-32  flex items-start justify-between gap-4 mt-24 2xl:mt-48 mb-10 2xl:mb-16">
        {/* Left: Title + Subtitle */}
        <div>
          <h2 className="text-2xl sm:text-3xl 2xl:text-6xl font-bold text-mist-900 pb-7">
            Our Long-Term Fleet
          </h2>
          <div className="flex items-start gap-2">
            <button
              ref={triggerRef}
              onClick={() => setInfoOpen((prev) => !prev)}
              className="text-mist-400 hover:text-mist-600 mt-1 transition-colors focus:outline-none"
              aria-label="More information"
            >
              <Info size={14} />
            </button>


            <p className="text-mist-400 text-sm 2xl:text-xl leading-snug max-w-xs 2xl:max-w-xl">
              Explore our collection of premium vehicles available for long-term hire in Los Angeles
            </p>
          </div>
        </div>

        {infoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            {/* Modal */}
            <div
              ref={popoverRef}
              className="relative w-80 2xl:w-[420px] rounded-xl bg-white shadow-xl p-6 2xl:p-8"
            >

              {/* Close Button */}
              <button
                onClick={() => setInfoOpen(false)}
                className="absolute top-4 right-4 text-mist-400 hover:text-mist-700"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <Info size={18} className="text-mist-500" />
                <h3 className="text-lg 2xl:text-xl font-semibold text-mist-900">
                  About Long-Term Hire
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm 2xl:text-base text-mist-500 leading-relaxed">
                Our long-term fleet is available for hire periods of 7 days or more.
                Enjoy competitive rates, full insurance coverage, and dedicated
                concierge support throughout your rental.
              </p>

              {/* List */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                <p className="text-sm text-mist-500">✓ Starting from 7-day rental periods</p>
                <p className="text-sm text-mist-500">✓ Flexible pickup & return in Los Angeles</p>
                <p className="text-sm text-mist-500">✓ Save up to 65% on daily rates</p>
              </div>

            </div>
          </div>
        )}
        {/* Right: View All Link */}
        <a
          href="#"
          className="flex items-center gap-1 2xl:gap-2 text-sm 2xl:text-2xl font-medium text-mist-500 bg-mist-100 rounded-md 2xl:rounded-xl px-4 2xl:px-8 py-2 2xl:py-4 hover:bg-mist-50 transition-colors duration-150 whitespace-nowrap shrink-0"
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
      <RelatedCars showHeader={false} discountBadgeText="Up to 65% OFF" />
      <section className="w-full bg-white">
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 text-center leading-tight mb-10 2xl:mb-16">
            The Longer You Drive, The <br className="hidden sm:block" />
            More You Save
          </h2>

          {/* Table */}
          <div className="bg-blue-100 rounded-xl overflow-hidden border border-blue-400">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mist-300">
                  <th className="text-left px-6 2xl:px-10 py-3 2xl:py-5 font-medium text-mist-500 text-xs 2xl:text-lg">Duration</th>
                  <th className="text-left px-6 2xl:px-10 py-3 2xl:py-5 font-medium text-mist-500 text-xs 2xl:text-lg border-l border-mist-300">Discount</th>
                  <th className="text-left px-6 2xl:px-10 py-3 2xl:py-5 font-medium text-mist-500 text-xs 2xl:text-lg border-l border-mist-300">Mileage</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-t border-mist-300">
                    <td className="px-6 2xl:px-10 py-4 2xl:py-6 text-sm 2xl:text-2xl text-mist-600">{row.duration}</td>
                    <td className="px-6 2xl:px-10 py-4 2xl:py-6 text-sm 2xl:text-2xl font-semibold text-mist-900 border-l border-mist-300">{row.discount}</td>
                    <td className="px-6 2xl:px-10 py-4 2xl:py-6 text-sm 2xl:text-2xl text-mist-500 border-l border-mist-300">{row.mileage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Laptop base / hinge */}
          <div className="relative mx-4 2xl:mx-10">
            <div className="h-3 2xl:h-10 bg-blue-400 rounded-b-3xl 2xl:rounded-b-[40px] mx-0 shadow-lg" />
          </div>
        </div>
      </section>
      <section className="w-full mt-24 2xl:mt-48">
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 2xl:gap-16">
            {/* Left: Image */}
            <div className="w-full lg:w-[620px] 2xl:w-[820px] shrink-0 rounded-2xl 2xl:rounded-3xl overflow-hidden h-96 sm:h-64 lg:h-80 2xl:h-[420px] bg-mist-100">
              <img
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80"
                alt="Luxury car on road"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Text */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-6">
                The Smart Way to Experience LA in Style
              </h2>
              <p className="text-mist-500 text-base 2xl:text-2xl leading-relaxed mb-3 2xl:mb-5">
                With Vidi Vici, you're not just renting a car — you're unlocking freedom, comfort, and prestige for as long as you need it.
              </p>
              <p className="text-mist-500 text-base 2xl:text-2xl leading-relaxed mb-3 2xl:mb-5">
                Enjoy transparent pricing, premium service, and exclusive long-term discounts —{" "}
                <span className="font-semibold text-mist-700">up to 65% OFF.</span>
              </p>
              <p className="text-mist-500 text-base 2xl:text-2xl leading-relaxed">
                The longer you drive, the more you save — and the more luxury you enjoy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative w-full bg-[#eeeeed] py-16 2xl:py-24 px-6 sm:px-16 lg:px-20 2xl:px-32 text-center overflow-hidden mt-24 2xl:mt-48">

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
        <div className="relative z-10 max-w-xl 2xl:max-w-5xl mx-auto flex flex-col items-center gap-5 2xl:gap-8 ">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl 2xl:text-7xl font-bold text-mist-900 leading-tight tracking-tight">
            Start Saving{" "}
            <span className="text-blue-500">Up to 65%</span>{" "}
            on <br className="hidden sm:block" />
            Your Luxury Drive Today
          </h2>
          <p className="text-sm sm:text-base 2xl:text-2xl text-mist-500 leading-relaxed max-w-sm 2xl:max-w-3xl">
            Choose your dream car, pick your plan, and enjoy premium service —
            all while saving up to 65% on long-term rentals.
          </p>
          <button className="mt-2 bg-mist-900 text-white text-sm 2xl:text-xl px-7 2xl:px-12 py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
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
