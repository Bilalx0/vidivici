import CarGallery from "@/components/cars/CarGallery"
import BookingForm from "@/components/booking/BookingForm"
import Link from "next/link"

const sampleCar = {
  id: "sample-1",
  name: "Lamborghini Huracán EVO",
  slug: "lamborghini-huracan-evo",
  brand: "Lamborghini",
  category: "Supercar",
  pricePerDay: 1500,
  year: 2024,
  seats: 2,
  transmission: "Automatic",
  fuelType: "Gasoline",
  horsepower: 631,
  topSpeed: "202 mph",
  acceleration: "2.9s 0-60",
  milesIncluded: 100,
  extraMileRate: 10,
  minRentalDays: 1,
  description: "The Huracán EVO represents the natural evolution of the most successful V10-powered Lamborghini ever. With 631 horsepower, a top speed of 202 mph, and acceleration from 0-60 in just 2.9 seconds, this mid-engine supercar delivers an unmatched driving experience. The advanced LDVI system integrates all vehicle dynamics to anticipate the driver's intentions and optimize behavior in real time.",
  images: [],
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // In production, fetch car data from API using slug
  const car = { ...sampleCar, slug }

  return (
    <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-white">Cars</Link>
          <span>/</span>
          <span className="text-[#dbb241]">{car.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-8">
            <CarGallery images={car.images} />

            {/* Title & Price */}
            <div>
              <p className="text-sm text-[#dbb241] font-medium mb-1">{car.brand}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{car.name}</h1>
              <p className="text-2xl text-[#dbb241] font-bold">${car.pricePerDay} <span className="text-sm text-gray-500 font-normal">/ day</span></p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Year", value: car.year },
                { label: "Transmission", value: car.transmission },
                { label: "Seats", value: car.seats },
                { label: "Fuel Type", value: car.fuelType },
                { label: "Horsepower", value: `${car.horsepower} HP` },
                { label: "Top Speed", value: car.topSpeed },
                { label: "0-60 mph", value: car.acceleration },
                { label: "Miles Included", value: `${car.milesIncluded} miles` },
                { label: "Extra Mile Rate", value: `$${car.extraMileRate}/mile` },
              ].map((spec) => (
                <div key={spec.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">{spec.label}</p>
                  <p className="text-sm font-semibold text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-[#dbb241] mb-3">About This Vehicle</h2>
              <p className="text-gray-400 leading-relaxed">{car.description}</p>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm car={car} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
