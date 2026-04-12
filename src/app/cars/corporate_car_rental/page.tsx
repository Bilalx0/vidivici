"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"
import Rentals from "@/components/home/Rentals"
import RelatedCars from "@/components/ui/RelatedCars"

export default function CorporateCarRentalPage() {
  return (
    <div>
      <Banner
        heading="Luxury Corporate Car Rentals in Los Angeles"
        description="Experience comfort, flexibility, and pure driving joy with our handpicked collection."
        height="h-96 2xl:h-[520px]"
      />



      <CarBrowse />
      <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48 mb-16 2xl:mb-24 flex items-center justify-between">
        <h2 className="text-xl sm:text-3xl 2xl:text-6xl font-bold text-mist-900">
          Corporate Fleet Vehicles
        </h2>
        <a
          href="#"
          className="flex items-center gap-1 2xl:gap-2 text-sm 2xl:text-2xl font-medium text-mist-500 bg-mist-100 rounded-md 2xl:rounded-xl px-4 2xl:px-8 py-2 2xl:py-4 hover:bg-mist-50 transition-colors duration-150 whitespace-nowrap shrink-0"
        >
          View all
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
      </div>
      <RelatedCars showHeader={false} discountBadgeText={undefined}/>

      <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48 flex flex-col lg:flex-row items-start gap-10 2xl:gap-16">

  {/* Left: Text */}
  <div className="flex-1 max-w-3xl">
    <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-6">
      Luxury Corporate Car Rentals in Los Angeles
    </h2>
    <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
      Make every business trip an unforgettable experience.
    </p>
    <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
      Whether you're attending client meetings, corporate events, or airport transfers — Vidi Vici delivers the perfect combination of performance, comfort, and style.
    </p>
    <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed">
      From sleek executive sedans to ultra-luxury SUVs, our handpicked fleet ensures you arrive with confidence and class — wherever your business takes you.
    </p>
    <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mt-4 2xl:mt-6">
      It's not just about transportation. It's about making an impression that lasts.
    </p>
  </div>

  {/* Right: Image Grid */}
  <div className="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-3 2xl:gap-6">
   {/* Top full-width image */}
            <div className="col-span-2 rounded-xl 2xl:rounded-2xl overflow-hidden h-48 sm:h-56 2xl:h-72 bg-mist-200">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80"
                alt="Luxury car interior"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Bottom two images */}
            <div className="rounded-xl 2xl:rounded-2xl overflow-hidden h-36 sm:h-44 2xl:h-56 bg-mist-200">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80"
                alt="Luxury SUV exterior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl 2xl:rounded-2xl overflow-hidden h-36 sm:h-44 2xl:h-56 bg-mist-200">
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
