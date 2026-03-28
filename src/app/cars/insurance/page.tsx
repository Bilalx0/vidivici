"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"

export default function InsurancePage() {
  return (
    <div>
      <Banner
        heading="Luxury Insurance Replacement Vehicles"
        description="Seamless luxury replacements across Los Angeles — comfort, speed, and style when you need it most."
        height="h-80"
      />

      {/* Intro Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Seamless Replacement When You Need It Most
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              When unexpected repairs interrupt your routine, our luxury insurance replacement vehicles restore your
              mobility without compromise. We know being without your car disrupts your day — that&apos;s why we deliver
              premium replacements straight to your door.
            </p>
            <p>
              From executive sedans to high-end SUVs, our fleet ensures you continue driving a car that matches your
              comfort, routine, and everything you&apos;re accustomed to.
            </p>
            <p>
              Each vehicle arrives ready to drive — insured, fueled, clean, and prepared to perfection. Our dedicated
              team handles all the coordination with your insurance provider so you don&apos;t have to.
            </p>
          </div>
        </div>
      </section>

      <ExoticCarRentals
        title="Insurance Replacement Fleet"
        description="Browse our selection of premium vehicles available for insurance replacement."
      />

      <CarBrowse />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
}
