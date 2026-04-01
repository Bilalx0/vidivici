"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"

interface CarGalleryProps {
  images: { url: string; alt?: string | null }[]
}

export default function CarGallery({ images }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="bg-mist-100 rounded-2xl 2xl:rounded-3xl h-96 2xl:h-[520px] flex items-center justify-center">
        <ImageOff size={48} className="text-mist-300" />
      </div>
    )
  }

  return (
    <div>
      <div className="bg-mist-100 rounded-2xl 2xl:rounded-3xl overflow-hidden h-80 sm:h-96 2xl:h-[520px] mb-3 2xl:mb-6">
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || "Car image"}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 2xl:gap-4 overflow-x-auto pb-2 2xl:pb-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-20 h-16 2xl:w-32 2xl:h-24 rounded-xl 2xl:rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === activeIndex ? "border-mist-900" : "border-mist-200 hover:border-mist-400"
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
