import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import VillaDetailClient from "./VillaDetailClient"

export default async function VillaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const villa = await prisma.villa.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { isPrimary: "desc" } },
    },
  })

  if (!villa) return notFound()

  const relatedVillas = await prisma.villa.findMany({
    where: { id: { not: villa.id }, isAvailable: true },
    include: { images: { orderBy: { isPrimary: "desc" }, take: 1 } },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  const serialized = {
    id: villa.id,
    name: villa.name,
    slug: villa.slug,
    description: villa.description,
    shortDescription: villa.shortDescription,
    detailHeading: (villa as unknown as { detailHeading?: string | null }).detailHeading ?? null,
    location: villa.location,
    address: villa.address,
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
    guests: villa.guests,
    sqft: villa.sqft,
    pricePerNight: villa.pricePerNight,
    cleaningFee: villa.cleaningFee,
    securityDeposit: villa.securityDeposit,
    amenities: villa.amenities,
    images: villa.images.map((img) => ({ url: img.url, alt: img.alt })),
  }

  const serializedRelated = relatedVillas.map((v) => ({
    id: v.id,
    name: v.name,
    slug: v.slug,
    location: v.location,
    bedrooms: v.bedrooms,
    guests: v.guests,
    sqft: v.sqft,
    pricePerNight: v.pricePerNight,
    image: v.images?.[0]?.url || null,
  }))

  return <VillaDetailClient villa={serialized} relatedVillas={serializedRelated} />
}
