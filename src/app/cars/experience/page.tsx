"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"
import Rentals from "@/components/home/Rentals"

export default function ExperiencePage() {
  return (
    <div>
      <Banner
        heading="The Ultimate Driving Experience"
        description="Experience comfort, flexibility, and pure driving joy with our handpicked collection."
        height="h-96"
      />



      <CarBrowse />
      <div className="px-10 sm:px-16 lg:px-20 pt-16 flex items-center justify-between">
        <h2 className="text-xl sm:text-3xl font-bold text-mist-900">
          Luxury Car Rental Los Angeles
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-medium text-mist-500 bg-gray-100 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors duration-150 whitespace-nowrap shrink-0"
        >
          View all
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
      </div>
      <Rentals showHeader={false} />

      <div className="px-10 sm:px-16 lg:px-20 py-16 flex flex-col lg:flex-row items-start gap-10">

  {/* Left: Text */}
  <div className="flex-1 max-w-lg">
    <h2 className="text-3xl sm:text-4xl font-bold text-mist-900 leading-tight mb-4">
      Exotic Cars for Hire
    </h2>
    <p className="text-mist-400 text-sm sm:text-base leading-relaxed mb-4">
      Make every drive through Los Angeles an unforgettable experience.
    </p>
    <p className="text-mist-400 text-sm sm:text-base leading-relaxed mb-4">
      Whether you're cruising down Sunset Boulevard, attending a red-carpet event, or heading to a business meeting — Vidi Vici delivers the perfect combination of performance, comfort, and style.
    </p>
    <p className="text-mist-400 text-sm sm:text-base leading-relaxed">
      From sleek supercars to ultra-luxury sedans and SUVs, our handpicked fleet ensures you arrive with confidence and class — wherever your destination takes you.
    </p>
    <p className="text-mist-400 text-sm sm:text-base leading-relaxed mt-4">
      It's not just about transportation. It's about making an impression that lasts.
    </p>
  </div>

  {/* Right: Image Grid */}
  <div className="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-3">
   {/* Top full-width image */}
            <div className="col-span-2 rounded-xl overflow-hidden h-48 sm:h-56 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80"
                alt="Luxury car interior"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Bottom two images */}
            <div className="rounded-xl overflow-hidden h-36 sm:h-44 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80"
                alt="Luxury SUV exterior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden h-36 sm:h-44 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80"
                alt="Luxury sedan"
                className="w-full h-full object-cover"
              />
            </div>
  </div>

</div>
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div >
  )
}
