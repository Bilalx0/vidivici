import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import CarDetailClient from "./CarDetailClient"

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const car = await prisma.car.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { isPrimary: "desc" } },
    },
  })

  if (!car) return notFound()

  const serialized = {
    id: car.id,
    name: car.name,
    slug: car.slug,
    brandName: car.brand.name,
    brandSlug: car.brand.slug,
    categoryName: car.category.name,
    categorySlug: car.category.slug,
    description: car.description,
    shortDescription: car.shortDescription,
    detailHeading: (car as unknown as { detailHeading?: string | null }).detailHeading ?? null,
    pricePerDay: car.pricePerDay,
    originalPrice: car.originalPrice,
    year: car.year,
    seats: car.seats,
    transmission: car.transmission,
    fuelType: car.fuelType,
    horsepower: car.horsepower,
    topSpeed: car.topSpeed,
    acceleration: car.acceleration,
    milesIncluded: car.milesIncluded,
    extraMileRate: car.extraMileRate,
    minRentalDays: car.minRentalDays,
    location: car.location,
    images: car.images.map((img) => ({ url: img.url, alt: img.alt })),
  }

  return <CarDetailClient car={serialized} />
}
