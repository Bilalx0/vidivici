import HeroSection from "@/components/home/HeroSection"
import LuxuryServicesSection from "@/components/home/LuxuryServicesSection"
import ValueProps from "@/components/home/ValueProps"
import BrowseByMake from "@/components/home/BrowseByMake"
import BrowseByCategory from "@/components/home/BrowseByCategory"
import FeaturedCars from "@/components/home/FeaturedCars"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import GuaranteeSection from "@/components/home/GuaranteeSection"
import FAQSection from "@/components/home/FAQSection"

export default function Home() {
  return (
    <>
      <HeroSection />
      <LuxuryServicesSection />
      <ValueProps />
      <BrowseByMake />
      <BrowseByCategory />
      <FeaturedCars />
      <TestimonialsSection />
      <GuaranteeSection />
      <FAQSection />
    </>
  )
}
