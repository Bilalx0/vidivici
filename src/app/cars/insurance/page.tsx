"use client"

import Banner from "@/components/ui/Banner"
import ExoticCarRentals from "@/components/cars/ExoticCarRentals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Reviews from "@/components/home/Reviews"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"

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
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-20 2xl:py-28">
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
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-16 2xl:py-24 ">
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
              <button className="bg-mist-900 hover:bg-mist-700 transition-colors duration-200 text-white text-sm 2xl:text-xl font-semibold px-6 2xl:px-10 py-3 2xl:py-5 rounded-md 2xl:rounded-xl">
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
              <div className="col-span-2 rounded-xl 2xl:rounded-2xl overflow-hidden h-44 sm:h-52 2xl:h-72 bg-mist-200">
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
      <section className="w-full bg-white px-6 sm:px-16 lg:px-20 2xl:px-32 py-20 2xl:py-28">
        <div className="">

          {/* Heading */}
          <div className="text-center mb-16 2xl:mb-24">
            <h2 className="text-4xl 2xl:text-7xl font-bold text-mist-900">How It Works</h2>

            <p className="mt-6 2xl:mt-8 text-base 2xl:text-2xl text-mist-500 max-w-xl 2xl:max-w-4xl mx-auto">
              Partner with Vidi Vici Rental in four easy steps and start earning from your luxury
              assets with ease and confidence.
            </p>
          </div>

          {/* Steps Container */}
          <div className="relative my-20 top-20">

            {/* Connector Line */}
            <div className="hidden md:block absolute top-7 left-10 right-10 border-t-2 border-dashed border-mist-200"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0">

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-14 h-14 2xl:w-20 2xl:h-20 rounded-full bg-mist-900 text-white flex items-center justify-center text-lg 2xl:text-2xl font-bold shadow-md">
                  1
                </div>

                <div className="mt-4 max-w-[150px]">
                  <p className="font-semibold 2xl:text-2xl text-mist-900">Sign Up</p>
                  <p className="text-sm 2xl:text-xl text-mist-500 mt-1">
                    Fill out our partner application form.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative z-10 -mt-20">
                <div className="max-w-[150px] mb-4">
                  <p className="text-sm 2xl:text-xl text-mist-500">
                    Our team reviews and approves your asset.
                  </p>
                  <p className="font-semibold 2xl:text-2xl text-mist-900 mt-1">
                    Verify & Approve
                  </p>
                </div>

                <div className="w-14 h-14 2xl:w-20 2xl:h-20 rounded-full bg-mist-900 text-white flex items-center justify-center text-lg 2xl:text-2xl font-bold shadow-md">
                  2
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-14 h-14 2xl:w-20 2xl:h-20 rounded-full bg-mist-900 text-white flex items-center justify-center text-lg 2xl:text-2xl font-bold shadow-md">
                  3
                </div>

                <div className="mt-4 max-w-[150px]">
                  <p className="font-semibold 2xl:text-2xl text-mist-900">List & Manage</p>
                  <p className="text-sm 2xl:text-xl text-mist-500 mt-1">
                    Upload your cars, villas, clubs, or events.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center relative z-10 -mt-20">
                <div className="max-w-[150px] mb-4">
                  <p className="text-sm 2xl:text-xl text-mist-500">
                    Start receiving bookings from high-end clients.
                  </p>
                  <p className="font-semibold 2xl:text-2xl text-mist-900 mt-1">
                    Earn Revenue
                  </p>
                </div>

                <div className="w-14 h-14 2xl:w-20 2xl:h-20 rounded-full bg-mist-900 text-white flex items-center justify-center text-lg 2xl:text-2xl font-bold shadow-md">
                  4
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <section className="w-full bg-white">
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 py-16 2xl:py-24">
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
