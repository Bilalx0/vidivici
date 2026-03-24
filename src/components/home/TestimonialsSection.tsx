"use client"

import { Star } from "lucide-react"

const testimonials = [
  { name: "James R.", content: "Absolutely incredible experience! The Lamborghini Hurac\u00e1n was in perfect condition and the delivery service was flawless. Will definitely be back!", rating: 5 },
  { name: "Sarah M.", content: "Rented a Rolls-Royce Cullinan for our wedding weekend. The team went above and beyond to make everything perfect. Highly recommend!", rating: 5 },
  { name: "Michael T.", content: "Best exotic car rental in LA. The process was smooth, no hidden fees, and the car was immaculate. The Ferrari 488 Spider was a dream!", rating: 5 },
  { name: "Emily K.", content: "Professional, transparent, and reliable. The Porsche 911 was amazing and they delivered it right to our hotel. Outstanding service!", rating: 5 },
  { name: "David L.", content: "Third time renting from Falcon and they never disappoint. Great selection, fair prices, and the cars are always in showroom condition.", rating: 5 },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-[#dbb241] text-[#dbb241]" />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <StarRating count={t.rating} />
      <p className="text-gray-300 text-sm leading-relaxed my-4 italic">&ldquo;{t.content}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#dbb241]/20 rounded-full flex items-center justify-center text-[#dbb241] font-semibold text-sm">
          {t.name.charAt(0)}
        </div>
        <p className="text-sm font-medium text-white">{t.name}</p>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our <span className="text-[#dbb241]">Clients Say</span></h2>
          <div className="w-16 h-1 bg-[#dbb241] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
          {testimonials.slice(3).map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
