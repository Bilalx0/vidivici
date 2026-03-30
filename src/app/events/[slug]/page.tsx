import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EventDetailClient from "./EventDetailClient"

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { isPrimary: "desc" } },
    },
  })

  if (!event) return notFound()

  const relatedEvents = await prisma.event.findMany({
    where: { id: { not: event.id }, isAvailable: true },
    include: { images: { orderBy: { isPrimary: "desc" }, take: 1 } },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  const serialized = {
    id: event.id,
    name: event.name,
    slug: event.slug,
    description: event.description,
    shortDescription: event.shortDescription,
    location: event.location,
    address: event.address,
    category: event.category,
    venueName: event.venueName,
    capacity: event.capacity,
    priceRange: event.priceRange,
    dressCode: event.dressCode,
    highlights: event.highlights,
    experience: event.experience,
    images: event.images.map((img) => ({ url: img.url, alt: img.alt })),
  }

  const serializedRelated = relatedEvents.map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    shortDescription: e.shortDescription,
    location: e.location,
    category: e.category,
    image: e.images?.[0]?.url || null,
  }))

  return <EventDetailClient event={serialized} relatedEvents={serializedRelated} />
}
