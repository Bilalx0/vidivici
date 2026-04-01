"use client";

import Services from "@/components/home/Services";
import Banner from "@/components/ui/Banner";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import LuxuryVideo from "@/components/home/LuxuryVideo";
import ExclusiveCollection from "@/components/home/ExclusiveCollection";
import FAQ from "@/components/home/FAQ";
import Reviews from "@/components/home/Reviews";



export default function AboutPage() {
  return (
    <div className="w-full">

      {/* Banner */}
      <Banner
        heading={"Experience Unmatched Luxury"}
        description="Vidi Vici Rental connects enthusiasts and travelers with the finest cars, villas, and event spaces in Los Angeles"
        image="/banner2.png"
        height="h-96"
        overlay="bg-black/60"
        searchBar={false}
      />

      {/* About Vidi Vici */}
      <section className="w-full bg-white sm:px-16 lg:px-20 px-6 py-40 2xl:py-64 2xl:px-40">
        <div className="flex flex-col md:flex-row items-center gap-12 2xl:gap-20 2xl:max-w-[1800px] 2xl:mx-auto">

          {/* Left text */}
          <div className="flex-1 flex flex-col gap-5 2xl:gap-8">
            <h2 className="text-4xl 2xl:text-6xl font-bold text-mist-900 tracking-tight">About Vidi Vici</h2>
            <div className="flex flex-col gap-4 2xl:gap-6 text-base 2xl:text-2xl text-mist-500 leading-relaxed">
              <p>
                At <span className="font-bold text-mist-900">Vidi Vici Rental</span>, we are driven by a singular passion: to
                deliver unforgettable luxury experiences. Founded in <span className="font-bold text-mist-900">2024</span> in
                Los Angeles, our company was built on principles of excellence, trust, and customer satisfaction.
              </p>
              <p>
                We believe that a vehicle or villa is more than just a service —
                it's an extension of your lifestyle. That's why every car and
                property in our collection is meticulously selected to reflect
                sophistication, elegance, and superior quality.
              </p>
              <p>
                Whether it's cruising in a Lamborghini Huracán EVO Spyder or
                enjoying a private stay in a Beverly Hills estate, our mission is
                to make every experience seamless, personalized, and truly
                extraordinary.
              </p>
            </div>
          </div>

          {/* Right image */}
          <div className="flex-1 w-full">
            <div className="rounded-2xl 2xl:rounded-[40px] overflow-hidden shadow-sm aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"
                alt="Luxury cars"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>
      <Services />
      <WhyChooseUs bg="white" />
      <ExclusiveCollection />
      <LuxuryVideo />
      <div className="pb-16 2xl:pb-32 pt-32 2xl:pt-64">
      <Reviews />
      </div>
      <div className="relative w-full bg-[#eeeeed] py-16 2xl:py-32 px-6 2xl:px-40 text-center mt-16 2xl:mt-32">
           <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none  rotate-180"
      />

      {/* Right side vector decoration */}
      <img
        src="/Vector 7.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180"
      />

        <div className="relative z-10 max-w-md 2xl:max-w-2xl mx-auto flex flex-col items-center gap-8 2xl:gap-12">

          <h2 className="text-5xl 2xl:text-7xl font-bold text-mist-900 tracking-tight">
            Ready to experience luxury like never before?
          </h2>
          <p className="text-base 2xl:text-2xl text-mist-500 leading-relaxed">
            Our dedicated support team is available 24/7 to assist you with
            bookings, inquiries, or custom requests.
          </p>
          <button className="mt-2 bg-mist-800 text-white text-base 2xl:text-2xl px-7 2xl:px-12 py-3 2xl:py-6 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
            Reserve Now
          </button>
        </div>

      </div>

      <FAQ/>
    </div>
  )
}
