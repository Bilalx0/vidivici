import { CircleCheckBig } from "lucide-react";

const features = [
  {
    title: "Exotic & Luxury Fleet",
    description:
      "Drive the latest high-end cars and experience ultimate comfort and style.",
  },
  {
    title: "Hassle-Free",
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
      /* Increased vertical padding to 2xl:py-64 to account for the massive 7k height */
      className="w-full px-6 sm:px-16 lg:px-20 2xl:px-32 py-20 2xl:py-36 mt-16 2xl:mt-48 relative overflow-visible"
      style={{ backgroundColor: bg }}
    >
      {/* Background Vectors - Scaled up for 2xl */}
      <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none rotate-180 "
      />

      <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180 opacity-80"
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-32 items-start">

        {/* Left: Heading + CTA */}
        <div className="flex flex-col h-full gap-8 2xl:gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl 2xl:text-7xl font-bold text-mist-900 leading-tight tracking-tight">
              Why Choose Vidi Vici?
            </h2>
            <p className="mt-4 2xl:mt-10 text-md 2xl:text-2xl text-mist-500 leading-relaxed 2xl:max-w-xl">
              Experience the ultimate in luxury, convenience, and personalized
              service in Los Angeles.
            </p>
          </div>
          <button className="w-fit bg-mist-900 text-white text-md 2xl:text-xl font-normal px-6 py-3 2xl:px-10 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
            Reserve Now
          </button>
        </div>

        {/* Right: 2x2 Feature Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-x-44 2xl:gap-x-64 2xl:gap-y-32 md:pl-10 2xl:pl-24 pt-14 sm:pt-0">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3 2xl:gap-8">
              {/* Scaled Icon Container */}
              <div className="w-9 h-9 2xl:w-14 2xl:h-14 bg-white rounded-xl 2xl:rounded-2xl flex items-center justify-center shadow-sm">
                <CircleCheckBig strokeWidth={2} className="text-mist-700 w-[18px] h-[18px] 2xl:w-7 2xl:h-7" />
              </div>
              <h3 className="text-lg sm:text-xl 2xl:text-3xl font-bold text-mist-900 leading-snug">
                {f.title}
              </h3>
              <p className="text-md 2xl:text-2xl text-mist-500 leading-relaxed 2xl:max-w-md">
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}