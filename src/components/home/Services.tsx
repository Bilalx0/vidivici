const services = [
  {
    title: "Exotic Cars",
    description:
      "Unleash the thrill of the world's most powerful machines. From Lamborghinis to Rolls-Royces, your dream car is ready to be delivered to your door.",
    image: "/pic1.png",
    showLabel: true,
  },
  {
    title: "Villas",
    description:
      "Stay in breathtaking LA properties with skyline views, infinity pools, and unmatched comfort. A home that defines prestige.",
    image: "/pic2.png",
    showLabel: false,
  },
  {
    title: "Nightlife & Events",
    description:
      "Step into a world of exclusivity. From elite club access to personalized concierge services — we open the doors to unforgettable nights.",
    image: "/pic3.png",
    showLabel: false,
  },
];

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6M12.5 3.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LuxuryServices() {
  return (
    <section className="bg-[#f0f0ee] w-full py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

        {/* Left — heading + subtitle */}
        <div className="lg:w-[260px] shrink-0 lg:pt-6">
          <h2 className="text-[2.6rem] font-bold leading-[1.1] text-gray-900 mb-5">
            Our<br />Luxury<br />Services
          </h2>
          <p className="text-[14.5px] text-gray-500 leading-relaxed font-light max-w-[220px]">
            Exotic cars, premium villas, and unforgettable nightlife – all curated for your ultimate comfort and style.
          </p>
        </div>

        {/* Right — cards grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Image */}
              <div className="h-[190px] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[15.5px] font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed font-light flex-1">
                  {service.description}
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between">
                  {service.showLabel ? (
                    <button className="flex items-center gap-2 text-[13px] text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200">
                      View Details
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white">
                        <ArrowIcon />
                      </span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {!service.showLabel && (
                    <button className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors duration-200">
                      <ArrowIcon />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}