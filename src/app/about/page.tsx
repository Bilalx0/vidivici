import Link from "next/link"
import { Gauge, Sparkles, Award } from "lucide-react"

const features = [
  {
    icon: Gauge,
    title: "State-of-the-Art Vehicles",
    description: "Our fleet features the latest models from the world's most prestigious brands including Rolls-Royce, Bentley, Ferrari, Lamborghini, McLaren, Porsche, Mercedes, BMW, Tesla, and more. Each vehicle is meticulously maintained and detailed before every rental.",
  },
  {
    icon: Sparkles,
    title: "Exclusive Driving Experience",
    description: "From high-performance supercars to ultra-luxury sedans, eco-friendly electric vehicles to commanding SUVs \u2014 we offer a driving experience unlike any other. Every vehicle features the latest technology and performance capabilities.",
  },
  {
    icon: Award,
    title: "World-Class Service",
    description: "Our dedicated team ensures a seamless experience from reservation to return. Complimentary delivery, flexible scheduling, transparent pricing, and 24/7 support \u2014 we go above and beyond for every client.",
  },
]

export default function AboutPage() {
  return (
    <div>
      <section className="py-20 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a] text-center">
        <p className="text-[#dbb241] text-sm uppercase tracking-[0.3em] mb-4">About Us</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Falcon Car Rental</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Made by Car Enthusiasts for Car Enthusiasts</p>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto">
        <p className="text-gray-300 leading-relaxed mb-6">
          Founded in 2015, Falcon Car Rental has established itself as the premier luxury and exotic car rental service in Los Angeles. Our passion for exceptional automobiles and unwavering commitment to customer experience drives everything we do.
        </p>
        <p className="text-gray-400 leading-relaxed mb-6">
          We believe that everyone deserves to experience the thrill of driving the world&apos;s most exclusive vehicles. Whether you&apos;re celebrating a special occasion, impressing clients, or simply treating yourself, our curated fleet of exotic and luxury vehicles is ready to make your dreams a reality.
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
                <div className="w-12 h-12 bg-[#dbb241]/10 rounded-lg flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[#dbb241]" />
                </div>
                <h3 className="text-xl font-semibold text-[#dbb241] mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Experience the <span className="text-[#dbb241]">Extraordinary</span>?</h2>
        <Link href="/cars" className="bg-[#dbb241] text-black px-10 py-4 rounded text-base font-semibold hover:bg-[#c9a238] transition-colors inline-block">
          Make Your Reservation
        </Link>
      </section>
    </div>
  )
}
