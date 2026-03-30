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

      <CarBrowse />
      <ExoticCarRentals
        title="Extraordinary Collection"
        description="Our finest selection of exotic and luxury vehicles for extraordinary experiences."
      />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
}
