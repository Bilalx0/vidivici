"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"
import HowItWorks from "@/components/ui/HowItWorks"

const steps = [
    { number: 1, title: "Sign Up", description: "Fill out our partner application form.", position: "top" },
    { number: 2, title: "Verify & Approve", description: "Our team reviews and approves your asset.", position: "bottom" },
    { number: 3, title: "List & Manage", description: "Upload your cars, villas, clubs, or events.", position: "top" },
    { number: 4, title: "Earn Revenue", description: "Start receiving bookings from high-end clients.", position: "bottom" },
];

export default function InsurancePage() {
  return (
    <div>
      <Banner
        heading="Luxury Insurance Replacement Vehicles"
        description="Seamless luxury replacements across Los Angeles — comfort, speed, and style when you need it most."
        height="h-96 2xl:h-[520px]"
      />
      <CarBrowse />
      {/* Intro Section */}
      <section className="w-full">
        {/* Top Section: Seamless Replacement */}
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 2xl:gap-16">
            {/* Left: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-5 2xl:mb-8">
                Seamless Replacement When You Need It Most
              </h2>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                When unexpected repairs interrupt your routine, our luxury insurance replacement vehicles restore your mobility without compromise.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed">
                We know living without your car disrupts your day — that's why we deliver premium replacements straight to your door.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mt-4 2xl:mt-6">
                From executive sedans to high-end SUVs, our fleet ensures you continue driving a car that matches your comfort, prestige, and performance expectations.
              </p>
            </div>

            {/* Right: Image Grid */}
            <div className="w-full lg:w-[560px] 2xl:w-[760px] flex-shrink-0 grid grid-cols-2 gap-3 2xl:gap-6">
              {/* Top full-width image */}
              <div className="col-span-2 rounded-xl 2xl:rounded-2xl overflow-hidden h-48 sm:h-56 2xl:h-72 bg-mist-200">
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80"
                  alt="Luxury car interior"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom two images */}
              <div className="rounded-xl 2xl:rounded-2xl overflow-hidden h-36 sm:h-44 2xl:h-56 bg-mist-200">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80"
                  alt="Luxury SUV exterior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl 2xl:rounded-2xl overflow-hidden h-36 sm:h-44 2xl:h-56 bg-mist-200">
                <img
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80"
                  alt="Luxury sedan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tailored Luxury */}
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
          <div className="flex flex-col lg:flex-row-reverse items-start justify-between gap-10 2xl:gap-16">
            {/* Right: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-2 2xl:mb-4">
                Tailored Luxury Replacement Options
              </h2>
              <p className="text-xs sm:text-sm 2xl:text-xl text-mist-400 italic mb-5 2xl:mb-8">
                Designed Around You and Your Insurance Needs
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                Every situation is different — and so are your requirements. Our dedicated team works closely with you and your insurance provider to deliver a bespoke replacement experience. Choose from an exclusive selection of luxury vehicles including Mercedes-Benz, BMW, Audi, Porsche, Maserati, and Bentley — all maintained to perfection and available on flexible terms.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-8 2xl:mb-10">
                Your replacement vehicle will be delivered and collected at your convenience, ensuring a smooth transition with zero downtime.
              </p>
              <button className="bg-mist-900 hover:bg-mist-700 transition-colors duration-200 text-white text-sm 2xl:text-xl px-6 2xl:px-10 py-3 2xl:py-5 rounded-md 2xl:rounded-xl">
                Get My Replacement Vehicle
              </button>
            </div>

            {/* Left: Image Grid */}
            <div className="w-full lg:w-[560px] 2xl:w-[760px] flex-shrink-0 grid grid-cols-2 gap-3 2xl:gap-6">
              {/* Top two images */}
              <div className="rounded-xl 2xl:rounded-2xl overflow-hidden h-40 sm:h-48 2xl:h-60 bg-mist-200">
                <img
                  src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80"
                  alt="Luxury car side"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl 2xl:rounded-2xl overflow-hidden h-40 sm:h-48 2xl:h-60 bg-mist-200">
                <img
                  src="https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=400&q=80"
                  alt="Luxury car interior"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom full-width image */}
              <div className="col-span-2 rounded-xl 2xl:rounded-2xl overflow-hidden h-44 sm:h-52 2xl:h-96 bg-mist-200">
                <img
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80"
                  alt="Luxury estate"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
  
   <section className="w-full bg-white px-4 sm:px-8 md:px-12 lg:px-20  mt-24 2xl:mt-48">

            {/* Heading */}
            <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-gray-900">How It Works</h2>
                <p className="mt-4 text-sm sm:text-base 2xl:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
                    Partner with Vidi Vici Rental in four easy steps and start earning from your luxury
                    assets with ease and confidence.
                </p>
            </div>

            {/* ── Desktop Layout (md+) ─────────────────────────────── */}
            <div className="hidden md:block relative">
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 1000 260"
                    preserveAspectRatio="none"
                    fill="none"
                >
                    <path d="M 125 65 C 210 65, 230 195, 375 195" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                    <path d="M 375 195 C 530 195, 470 65, 625 65" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                    <path d="M 625 65 C 780 65, 720 195, 875 195" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                </svg>

                <div className="relative z-10 grid grid-cols-4" style={{ height: "260px" }}>
                    {steps.map((step) =>
                        step.position === "top" ? (
                            <div key={step.number} className="flex flex-col items-center text-center pt-8">
                                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                                    {step.number}
                                </div>
                                <div className="mt-5 max-w-[160px] 2xl:max-w-[200px]">
                                    <p className="font-semibold text-gray-900 text-sm lg:text-base 2xl:text-xl">{step.title}</p>
                                    <p className="text-xs lg:text-sm 2xl:text-lg text-gray-500 mt-2 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ) : (
                            <div key={step.number} className="flex flex-col items-center text-center justify-end pb-8">
                                <div className="max-w-[160px] 2xl:max-w-[200px] mb-5">
                                    <p className="text-xs lg:text-sm 2xl:text-lg text-gray-500 leading-relaxed">{step.description}</p>
                                    <p className="font-semibold text-gray-900 text-sm lg:text-base 2xl:text-xl mt-2">{step.title}</p>
                                </div>
                                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                                    {step.number}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* ── Mobile Layout (<md) — zigzag 2-column ────────────── */}
            <div className="md:hidden">

                {/* Single SVG that covers both rows + connector */}
                <div className="relative" style={{ minHeight: "410px" }}>
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 300 410"
                        preserveAspectRatio="none"
                        fill="none"
                    >
                        {/* Step 1 → Step 2 */}
                        <path
                            d="M 75 40 C 150 40, 150 140, 225 140"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                        {/* Step 2 → Step 3 */}
                        <path
                            d="M 225 140 C 225 230, 75 230, 75 270"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                        {/* Step 3 → Step 4 */}
                        <path
                            d="M 75 270 C 150 270, 150 370, 225 370"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                    </svg>

                    {/* Step 1 — left, top-aligned */}
                    <div className="absolute left-0 w-1/2 flex flex-col items-center text-center px-4 pt-8" style={{ top: -16 }}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            1
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Sign Up</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                                Fill out our partner application form.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 — right, at ~140px from top (circle center) */}
                    <div className="absolute right-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "34px" }}>
                        <div className="mb-4">
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                Our team reviews and approves your asset.
                            </p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base mt-2">Verify &amp; Approve</p>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            2
                        </div>
                    </div>

                    {/* Step 3 — left, at ~270px from top (circle center) */}
                    <div className="absolute left-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "240px" }}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            3
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">List &amp; Manage</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                                Upload your cars, villas, clubs, or events.
                            </p>
                        </div>
                    </div>

                    {/* Step 4 — right, at ~370px from top (circle center) */}
                    <div className="absolute right-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "260px" }}>
                        <div className="mb-4">
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                Start receiving bookings from high-end clients.
                            </p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base mt-2">Earn Revenue</p>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            4
                        </div>
                    </div>
                </div>

            </div>
        </section>

      <section className="w-full  mt-24 2xl:mt-48">
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 2xl:gap-16">
            {/* Left: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-6">
                Five-Star Service, Every Step of the Way
              </h2>


              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                Our team goes beyond simple replacements — we deliver an experience.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                Each vehicle is meticulously inspected, fully insured, and presented in pristine condition. Our chauffeurs and logistics partners handle every detail, so all you have to do is step in and drive.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed">
                We pride ourselves on delivering fast, professional, and seamless service, ensuring your day-to-day life continues without interruption.
              </p>
            </div>

            {/* Right: Image */}
            <div className="w-full lg:w-[620px] 2xl:w-[820px] flex-shrink-0">
              <div className="rounded-2xl 2xl:rounded-3xl overflow-hidden w-full h-64 sm:h-72 lg:h-80 2xl:h-[420px] bg-mist-100">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80"
                  alt="Professional chauffeur in uniform"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      <WhyChooseUs />
      <FAQ />
      <Contact />
    </div>
  )
}
