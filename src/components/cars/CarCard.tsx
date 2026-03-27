import Link from "next/link"
import { ImageOff } from "lucide-react"

interface CarCardProps {
  name: string
  slug: string
  brand: string
  category: string
  pricePerDay: number
  year?: number
  transmission?: string
  seats?: number
  image?: string
  shortDescription?: string
}

export default function CarCard({ name, slug, brand, pricePerDay, year, transmission, seats, image, shortDescription }: CarCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#dbb241]/50 transition-all group hover:-translate-y-1">
      <div className="h-52 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <ImageOff size={32} className="text-mist-700" />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-[#dbb241] font-medium mb-1">{brand}</p>
        <h3 className="text-lg font-semibold text-white group-hover:text-[#dbb241] transition-colors mb-1">{name}</h3>
        {shortDescription && <p className="text-xs text-mist-500 mb-3">{shortDescription}</p>}
        <div className="flex gap-2 mb-4">
          {year && <span className="text-[10px] bg-[#2a2a2a] text-mist-400 px-2 py-0.5 rounded">{year}</span>}
          {transmission && <span className="text-[10px] bg-[#2a2a2a] text-mist-400 px-2 py-0.5 rounded">{transmission}</span>}
          {seats && <span className="text-[10px] bg-[#2a2a2a] text-mist-400 px-2 py-0.5 rounded">{seats} seats</span>}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-[#dbb241]">${pricePerDay}<span className="text-xs text-mist-500 font-normal"> /day</span></p>
        </div>
        <div className="flex gap-2 mt-4">
          <Link href={`/cars/${slug}`} className="flex-1 text-center text-xs border border-[#dbb241] text-[#dbb241] px-3 py-2 rounded hover:bg-[#dbb241] hover:text-black transition-colors font-medium">
            View Details
          </Link>
          <Link href={`/cars/${slug}`} className="flex-1 text-center text-xs bg-[#dbb241] text-black px-3 py-2 rounded hover:bg-[#c9a238] transition-colors font-semibold">
            Reserve Now
          </Link>
        </div>
      </div>
    </div>
  )
}
