"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"

interface CarGalleryProps {
  images: { url: string; alt?: string }[]
}

export default function CarGallery({ images }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl h-96 flex items-center justify-center">
        <ImageOff size={48} className="text-gray-700" />
      </div>
    )
  }

  return (
    <div>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden h-96 mb-3">
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || "Car image"}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === activeIndex ? "border-[#dbb241]" : "border-[#2a2a2a]"
              }`}
            >
              <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
