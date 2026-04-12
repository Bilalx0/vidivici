import Link from "next/link";

const services = [
  {
    title: "Exotic Cars",
    description:
      "Unleash the thrill of the world's most powerful machines. From Lamborghinis to Rolls-Royces, your dream car is ready to be delivered to your door.",
    image: "/pic1.png",
    href: "/cars",
  },
  {
    title: "Villas",
    description:
      "Stay in breathtaking LA properties with skyline views, infinity pools, and unmatched comfort. A home that defines prestige.",
    image: "/pic2.png",
    href: "/villas",
  },
  {
    title: "Nightlife & Events",
    description:
      "Step into a world of exclusivity. From elite club access to personalized concierge services — we open the doors to unforgettable nights.",
    image: "/pic3.png",
    href: "/events",
  },
];

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.5 12.5L12.5 3.5M12.5 3.5H6M12.5 3.5V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LuxuryServices() {
  return (
    <section className="bg-[#f0f0ee] w-full py-16 2xl:py-24 sm:px-16 lg:px-20 px-6 2xl:px-32">
      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 2xl:gap-40 ">

        {/* Left — heading + subtitle */}
        <div className="w-full lg:w-64 2xl:w-96 shrink-0 lg:pt-6 2xl:pt-8 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold leading-tight text-mist-900 mb-5 2xl:mb-7 mx-auto lg:mx-0">
            Our Luxury Services
          </h2>
          <p className="text-sm 2xl:text-xl text-mist-500 leading-relaxed font-normal max-w-xs mx-auto lg:mx-0">
            Exotic cars, premium villas, and unforgettable nightlife – all curated for your ultimate comfort and style.
          </p>
        </div>

        {/* Right — cards grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 2xl:gap-7">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Image */}
              <div className="h-48 2xl:h-72 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Body */}
              <div className="p-5 2xl:p-7 flex flex-col flex-1">
                <h3 className="text-base 2xl:text-2xl font-semibold text-mist-900 mb-2 2xl:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm 2xl:text-xl text-mist-500 leading-relaxed font-normal flex-1">
                  {service.description}
                </p>

                {/* Footer */}
                <div className="mt-5 2xl:mt-7 flex items-center justify-end">
                  <span className="flex items-center gap-2 text-sm 2xl:text-lg group-hover:bg-mist-100 py-1 pr-2 pl-4 rounded-full text-mist-800 font-normal cursor-pointer transition-all duration-300">
                    <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-mist-800">
                      View Details
                    </span>
                    <span className="flex items-center justify-center w-8 h-8 2xl:w-11 2xl:h-11 rounded-full bg-mist-900 text-white">
                      <ArrowIcon />
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}