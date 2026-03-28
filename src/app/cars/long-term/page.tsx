"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"

export default function LongTermPage() {
  return (
    <div>
      <Banner
        heading="Long-Term Luxury Rentals"
        description="Flexible plans starting from 7 days to 12 months — save up to 65% on standard daily rates."
        height="h-80"
      />

      {/* Intro Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Save Up to 65% on Long-Term Rentals
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Drive your dream car for longer with our exclusive long-term rental plans. Whether you need a vehicle for a
              month or a full year, enjoy significant savings with flexible terms that adapt to your lifestyle.
            </p>
            <p>
              Our long-term fleet includes everything from executive sedans and premium SUVs to exotic supercars — all
              maintained to the highest standards with full insurance coverage included.
            </p>
            <p>
              From 7-day getaways to 12-month commitments, we offer tiered discounts that make luxury driving
              surprisingly accessible. No long-term contracts — just flexible, transparent pricing.
            </p>
          </div>

          {/* Discount Table */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold">Duration</th>
                  <th className="px-6 py-4 text-sm font-semibold">Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { duration: "7 – 13 days", discount: "15% off" },
                  { duration: "14 – 29 days", discount: "25% off" },
                  { duration: "1 – 2 months", discount: "35% off" },
                  { duration: "3 – 5 months", discount: "45% off" },
                  { duration: "6 – 8 months", discount: "55% off" },
                  { duration: "9 – 12 months", discount: "65% off" },
                ].map((row) => (
                  <tr key={row.duration} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700">{row.duration}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">{row.discount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ExoticCarRentals
        title="Our Long-Term Fleet"
        description="Explore our collection of premium vehicles available for long-term hire in Los Angeles."
      />

      <CarBrowse />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Contact />
    </div>
  )
}
