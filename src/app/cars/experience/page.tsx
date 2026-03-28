"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"

export default function ExperiencePage() {
  return (
    <div>
      <Banner
        heading="The Ultimate Driving Experience"
        description="Experience comfort, flexibility, and pure driving joy with our handpicked collection."
        height="h-80"
      />

      {/* Intro Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Crafted Experiences, Not Just Rentals
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              At Vidi Vici, every rental is an experience. From the moment you reserve to the second the key is in your
              hand, our team ensures a seamless, white-glove journey tailored to your preferences.
            </p>
            <p>
              Whether you want to feel the raw power of an Italian supercar on Mulholland Drive, cruise down Sunset
              Boulevard in a convertible, or arrive at a premier event in a Rolls-Royce — we make it happen.
            </p>
            <p>
              Our experience packages include personalized route suggestions, professional photography options, and
              VIP concierge services that elevate every moment behind the wheel.
            </p>
          </div>
        </div>
      </section>

      <ExoticCarRentals
        title="Experience Collection"
        description="Vehicles curated for unforgettable driving experiences across Los Angeles."
      />

      <CarBrowse />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
}
