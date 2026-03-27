import { CircleCheckBig } from "lucide-react";

const features = [
  {
    title: "Exotic & Luxury Fleet",
    description:
      "Drive the latest high-end cars and experience ultimate comfort and style.",
  },
  {
    title: "Transparent & Hassle-Free",
    description:
      "No hidden fees, clear pricing, and easy reservations for all services.",
  },
  {
    title: "Personalized Service",
    description:
      "Our team crafts each experience tailored to your preferences, ensuring seamless luxury.",
  },
  {
    title: "VIP Nightlife & Events",
    description:
      "Access curated parties, private events, and unparalleled VIP experiences in LA.",
  },
];

export default function WhyChooseUs({ bg = "#f0f0ee" }: { bg?: string }) {
  return (
    <section
      className="w-full px-10 sm:px-16 lg:px-20 py-20 relative overflow-visible"
      style={{ backgroundColor: bg }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32 items-start">

        {/* Left: Heading + CTA */}
        <div className="flex flex-col justify-between h-full gap-8">
          <div>
            <h2 className="text-4xl font-black text-mist-900 leading-tight tracking-tight">
              Why Choose Vidi Vici?
            </h2>
            <p className="mt-4 text-sm text-mist-600 leading-relaxed">
              Experience the ultimate in luxury, convenience, and personalized
              service in Los Angeles.
            </p>
          </div>
          <button className="w-fit bg-mist-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-200">
            Reserve Now
          </button>
        </div>

        {/* Right: 2x2 Feature Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <CircleCheckBig size={18} strokeWidth={2} className="text-mist-700" />
              </div>
              <h3 className="text-base font-bold text-mist-900 leading-snug">
                {f.title}
              </h3>
              <p className="text-sm text-mist-600 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}