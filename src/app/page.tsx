import HeroSection from "@/components/home/Hero"
import LuxuryServicesSection from "@/components/home/Services"
import Rentals from "@/components/home/Rentals"
import ValueProps from "@/components/home/ValueProps"
import BrowseByMake from "@/components/home/BrowseByMake"
import BrowseByCategory from "@/components/home/BrowseByCategory"
import FeaturedCars from "@/components/home/FeaturedCars"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import GuaranteeSection from "@/components/home/GuaranteeSection"
import FAQSection from "@/components/home/FAQ"
import CarBrowse from "@/components/home/CarBrowse"
import Villa from "@/components/home/Villa"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import LuxuryVideo from "@/components/home/LuxuryVideo"
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <LuxuryServicesSection />
      <Rentals />
      <CarBrowse />
      <Villa />
      <WhyChooseUs />
      <Reviews/>
      <LuxuryVideo/>
      <FAQSection />
      <Contact />
    </>
  )
}
