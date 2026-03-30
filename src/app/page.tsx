import HeroSection from "@/components/home/Hero"
import LuxuryServicesSection from "@/components/home/Services"
import Rentals from "@/components/home/Rentals"
import FAQSection from "@/components/home/FAQ"
import CarBrowse from "@/components/home/CarBrowse"
import Villa from "@/components/home/Villa"
import Events from "@/components/home/Events"
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
      <Events/>
      <WhyChooseUs />
      <Reviews/>
      <LuxuryVideo/>
      <FAQSection />
      <Contact />
    </>
  )
}
