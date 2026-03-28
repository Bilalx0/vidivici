"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"

export default function DriveExtraordinaryPage() {
  return (
    <div>
      <Banner
        heading="Drive the Extraordinary"
        description="Experience our curated collection of exotic and luxury cars for unforgettable moments in Los Angeles."
        height="h-80"
      />

      {/* Intro Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Tailored Luxury for Every Occasion
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Whether it&apos;s a special celebration, a weekend getaway along the Pacific Coast, or simply the desire to
              experience automotive excellence — our Drive the Extraordinary collection delivers.
            </p>
            <p>
              Hand-picked supercars, grand tourers, and ultra-luxury vehicles curated for those who appreciate the
              finer things. Each car is meticulously maintained and delivered to your location with white-glove service.
            </p>
            <p>
              From Lamborghinis and Ferraris to Rolls-Royces and Bentleys, every vehicle in our extraordinary
              collection transforms a simple drive into an unforgettable experience.
            </p>
          </div>
        </div>
      </section>

      <ExoticCarRentals
        title="Extraordinary Collection"
        description="Our finest selection of exotic and luxury vehicles for extraordinary experiences."
      />

      <CarBrowse />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
}
