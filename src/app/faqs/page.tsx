"use client"

import { useState } from "react"

const faqs = [
  { q: "What happens if I return the vehicle late?", a: "We provide a one-hour grace period. After that, you will be charged 20% of the daily rate per hour. Five hours of late charges equals a full day fee." },
  { q: "Can I do a one-way trip?", a: "Yes! Select the \"One-way\" option during booking and enter separate delivery and return addresses." },
  { q: "Do you offer delivery service?", a: "Yes, we offer complimentary delivery within Beverly Hills and nearby areas. LAX deliveries are available at a $125 flat fee. Pickup services are also available." },
  { q: "What are your rental requirements?", a: "US customers need a valid driver's license, full coverage insurance, and a major credit card. Non-US customers need a license, passport, credit card, and must be at least 25 years old." },
  { q: "What happens if I get a ticket or tolls?", a: "Customers are responsible for all traffic citations, tolls, towing charges, penalties, and impound costs incurred during the rental period." },
  { q: "What payment methods do you accept?", a: "We accept Visa, MasterCard, Discover, and American Express. Cashier's checks and wire transfers may also be accepted for certain rentals." },
  { q: "Am I the only one who can drive the car?", a: "A maximum of two drivers are allowed per rental agreement. Both drivers must present valid licenses and insurance. An underage fee applies if either driver is under 25." },
  { q: "Do I get a discount when I rent for a week or a month?", a: "Yes! 15% discount for 7-27 day rentals and 30% discount for 28+ consecutive days (applied to base price only)." },
  { q: "How much do I get charged for extra miles?", a: "Charges vary by vehicle make and style. Specific mileage allowances and per-mile charges are listed on each individual vehicle page." },
  { q: "Is there a limited number of miles I can drive?", a: "Yes, each vehicle has a specific mileage allowance detailed on its respective page. Extra miles are charged at the rate specified for that vehicle." },
  { q: "Do you take a security deposit?", a: "Yes, the deposit amount varies by vehicle type, driver age, insurance coverage, and credit card used." },
  { q: "Can I rent a car if I'm younger than 25?", a: "Yes, you can rent with valid full coverage insurance. An underage fee applies for drivers under 25." },
  { q: "I have insurance on my car. Do I still need to purchase your coverage?", a: "If your existing policy covers rental vehicles, additional coverage is unnecessary. We will contact your provider for verification." },
  { q: "What is your cancellation policy?", a: "Free cancellation within 24 hours of booking. No fee if cancelled 7+ days before rental. 50% penalty if cancelled within 7 days. Reservations made within 48 hours of the rental start are final." },
  { q: "Do you offer hourly rentals?", a: "No, our minimum rental period is one day (24 hours). Some vehicles have 2-3 day minimums. Early return does not reduce charges." },
  { q: "What brands of vehicles do you carry?", a: "Ferrari, Lamborghini, Rolls-Royce, Mercedes, McLaren, Aston Martin, BMW, Bentley, Porsche, Range Rover, Tesla, Corvette, Cadillac, Audi, Rivian, and Hummer." },
  { q: "Will I get the same vehicle that I reserved?", a: "Usually yes. If your exact vehicle is unavailable, we'll offer a comparable or upgraded vehicle at no additional cost, or provide a full refund." },
  { q: "How do I make a reservation?", a: "Visit any vehicle page, select your dates, enter your personal and payment information, and place your order. Delivery is available with automatic cost calculation based on distance." },
]

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      <section className="py-16 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a] text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked <span className="text-[#dbb241]">Questions</span></h1>
        <p className="text-gray-400">Everything you need to know about renting with Falcon</p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <span className={`text-sm font-medium pr-4 ${openIndex === i ? "text-[#dbb241]" : "text-white"}`}>{faq.q}</span>
                <svg className={`w-4 h-4 text-[#dbb241] transition-transform flex-shrink-0 ${openIndex === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`accordion-content ${openIndex === i ? "open" : ""}`}>
                <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
