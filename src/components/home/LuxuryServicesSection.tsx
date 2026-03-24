import Link from "next/link"

const services = [
  {
    title: "Exotic Cars",
    description:
      "Unleash the thrill of the world's most powerful machines. From Lamborghinis to Rolls-Royces, your dream car is ready to be delivered to your door.",
    href: "/cars",
  },
  {
    title: "Villas",
    description:
      "Stay in breathtaking LA properties with skyline views, infinity pools, and unmatched comfort. A home that defines prestige.",
    href: "/contact",
  },
  {
    title: "Nightlife & Events",
    description:
      "Step into a world of exclusivity — from elite club access to personalized concierge services, we open the doors to unforgettable nights.",
    href: "/contact",
  },
]

export default function LuxuryServicesSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: heading + description */}
          <div className="lg:w-72 flex-shrink-0">
            <h2 className="text-4xl font-bold text-black leading-tight mb-5">
              Our<br />Luxury<br />Services
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Exotic cars, premium villas, and unforgettable nightlife — all curated for your ultimate comfort and style.
            </p>
          </div>

          {/* Right: service cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col"
              >
                {/* Image placeholder — replace with <img> when ready */}
                <div className="h-48 bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {/* <img src="/images/service-xyz.jpg" alt={service.title} className="w-full h-full object-cover" /> */}
                  <span className="text-gray-400 text-xs tracking-widest uppercase">
                    {service.title} Image
                  </span>
                </div>

                {/* Card content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-black font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <div className="flex justify-end mt-4">
                    <Link
                      href={service.href}
                      className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-[#dbb241] transition-colors"
                      aria-label={`View ${service.title}`}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
