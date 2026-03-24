"use client"

import { useState } from "react"

const faqs = [
  { q: "How do I make a reservation?", a: "Visit any vehicle page, select your dates, enter your personal and payment information, and place your order. We also offer delivery service with automatic cost calculation." },
  { q: "What are your rental requirements?", a: "US customers need a valid driver's license, full coverage insurance, and a major credit card. Non-US customers need a license, passport, credit card, and must be at least 25 years old." },
  { q: "Do you offer delivery service?", a: "Yes! We offer complimentary delivery within Beverly Hills and nearby areas. LAX deliveries are available at a $125 flat fee. Pickup services are also available." },
  { q: "What is your cancellation policy?", a: "Free cancellation within 24 hours of booking. No fee if cancelled 7+ days before rental. 50% penalty if cancelled within 7 days. Reservations within 48 hours of rental start are final." },
  { q: "Do I get a discount for longer rentals?", a: "Yes! 15% discount for 7-27 day rentals and 40% discount for 28+ consecutive days, applied to the base daily rate." },
  { q: "What payment methods do you accept?", a: "We accept Visa, MasterCard, Discover, and American Express. Cashier's checks and wire transfers may also be accepted for certain rentals." },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked <span className="text-[#dbb241]">Questions</span></h2>
          <div className="w-16 h-1 bg-[#dbb241] mx-auto" />
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className={`text-sm font-medium ${openIndex === i ? "text-[#dbb241]" : "text-white"}`}>{faq.q}</span>
                <svg className={`w-4 h-4 text-[#dbb241] transition-transform flex-shrink-0 ml-4 ${openIndex === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`accordion-content ${openIndex === i ? "open" : ""}`}>
                <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
