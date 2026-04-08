"use client"

import { useRef, useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  X,
  Maximize,
  Minimize,
  LayoutPanelTop,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

interface CarGalleryProps {
  images: { url: string; alt?: string | null }[]
}

export default function CarGallery({ images }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const [showFilmstrip, setShowFilmstrip] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [zoomMode, setZoomMode] = useState(false)

  // drag-to-pan state
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null)

  const thumbsRef = useRef<HTMLDivElement | null>(null)
  const lightboxThumbsRef = useRef<HTMLDivElement | null>(null)
  const lightboxRef = useRef<HTMLDivElement | null>(null)
  const zoomScrollRef = useRef<HTMLDivElement | null>(null)

  const [aspectRatio, setAspectRatio] = useState<string>("16/9")

const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget
  const ratio = img.naturalWidth / img.naturalHeight
  setAspectRatio(`${img.naturalWidth}/${img.naturalHeight}`)
}


  // ─── sync thumb strips whenever activeIndex changes ───────────────────────
 useEffect(() => {
  const scrollThumbs = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return

    const container = ref.current
    const thumb = container.children[activeIndex] as HTMLElement | null

    if (!thumb) return

    const thumbWidth = thumb.offsetWidth
    const gap = 12 // because you used gap-3

    container.scrollTo({
      left: activeIndex * (thumbWidth + gap),
      behavior: "smooth",
    })
  }

  scrollThumbs(thumbsRef)
  scrollThumbs(lightboxThumbsRef)
}, [activeIndex])

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, images.length - 1))
    setActiveIndex(clamped)
    setZoom(1)
    setZoomMode(false)
    setAspectRatio("16/9")
  }

  const prev = () => goTo(activeIndex - 1)
  const next = () => goTo(activeIndex + 1)

  const openLightbox = () => {
    setIsLightboxOpen(true)
    setZoom(1)
    setZoomMode(false)
    setShowFilmstrip(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setZoom(1)
    setZoomMode(false)
    if (document.fullscreenElement) document.exitFullscreen()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const toggleZoom = () => {
    if (zoomMode) {
      setZoom(1)
      setZoomMode(false)
    } else {
      setZoom(3)
      setZoomMode(true)
    }
  }

  // centre scroll position after zoom is applied
  useEffect(() => {
    if (!zoomScrollRef.current) return
    const el = zoomScrollRef.current
    // allow the DOM to repaint with new dimensions first
    requestAnimationFrame(() => {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2
    })
  }, [zoom])

  // drag-to-pan handlers
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomMode || !zoomScrollRef.current) return
    setIsPanning(true)
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: zoomScrollRef.current.scrollLeft,
      scrollTop: zoomScrollRef.current.scrollTop,
    }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !panStart.current || !zoomScrollRef.current) return
    const dx = e.clientX - panStart.current.x
    const dy = e.clientY - panStart.current.y
    zoomScrollRef.current.scrollLeft = panStart.current.scrollLeft - dx
    zoomScrollRef.current.scrollTop = panStart.current.scrollTop - dy
  }

  const onMouseUp = () => setIsPanning(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
      if (e.key === "Escape" && !document.fullscreenElement) closeLightbox()
    }

    const scrollY = window.scrollY
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"

    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, scrollY)
    }
  }, [isLightboxOpen, activeIndex])

  if (!images || images.length === 0) {
    return (
      <div className="bg-mist-100 rounded-2xl h-96 flex items-center justify-center">
        <ImageOff size={48} className="text-mist-300" />
      </div>
    )
  }

  return (
    <>
      <div className="w-full">

        {/* MAIN IMAGE */}
      <div
  className="relative rounded-2xl overflow-hidden mb-3 bg-black w-full"
  style={{ aspectRatio: "3/2" }}
>
          <img
            src={images[activeIndex].url}
            alt={images[activeIndex].alt || "Car image"}
            loading="lazy"
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={openLightbox}
          />
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2
                       w-6 h-6 rounded-full bg-white shadow
                       flex items-center justify-center"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            onClick={next}
            disabled={activeIndex === images.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       w-6 h-6 rounded-full bg-white shadow
                       flex items-center justify-center"
          >
            <ChevronRight size={12} />
          </button>
        </div>

        {/* THUMBNAILS */}
        {images.length > 1 && (
          <div className="relative">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10
                         w-6 h-6 rounded-full bg-white shadow
                         flex items-center justify-center"
            >
              <ChevronLeft size={12} />
            </button>

            <div
              ref={thumbsRef}
              className="flex gap-3 overflow-x-auto scroll-smooth
                         snap-x snap-mandatory px-0
                         [&::-webkit-scrollbar]:hidden"
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`relative rounded-lg sm:rounded-xl overflow-hidden
                              aspect-[4/3] shrink-0 snap-start
                              w-[calc((100%-36px)/4)]
                              border-2 transition
                              ${i === activeIndex
                                ? "border-transparent"
                                : "border-transparent hover:border-gray-300"
                              }`}
                >
                  <img src={img.url} alt={img.alt || ""} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button
              onClick={next}
              disabled={activeIndex === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                         w-6 h-6 rounded-full bg-white shadow
                         flex items-center justify-center"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {isLightboxOpen && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[9999] flex flex-col mb-0"
          style={{ backgroundColor: "#111111" }}
        >
          {/* TOP BAR */}
          <div
            className="flex items-center justify-between px-4 py-2.5 shrink-0"
            style={{ backgroundColor: "#111111" }}
          >
            <span className="text-white/60 text-sm font-medium tabular-nums select-none">
              {activeIndex + 1} / {images.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleZoom}
                title={zoomMode ? "Zoom out" : "Zoom in"}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors
                  ${zoomMode ? "bg-white/25" : "bg-white/10 hover:bg-white/20"}`}
              >
                {zoomMode ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
              </button>

              <button
                onClick={() => setShowFilmstrip((v) => !v)}
                title={showFilmstrip ? "Hide thumbnails" : "Show thumbnails"}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors
                  ${!showFilmstrip ? "bg-white/25" : "bg-white/10 hover:bg-white/20"}`}
              >
                <LayoutPanelTop size={16} />
              </button>

              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20
                           flex items-center justify-center text-white transition-colors"
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>

              <button
                onClick={closeLightbox}
                title="Close"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20
                           flex items-center justify-center text-white transition-colors ml-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* MAIN IMAGE AREA */}
          <div className="flex-1 flex items-center justify-center relative min-h-0 px-4 sm:px-8 md:px-14 overflow-hidden">

            {/* ── zoom scroll container ── */}
            <div
              ref={zoomScrollRef}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onClick={zoomMode ? toggleZoom : undefined}
              className="w-full h-full overflow-auto [&::-webkit-scrollbar]:hidden"
              style={{
                cursor: zoomMode ? (isPanning ? "grabbing" : "grab") : "default",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* inner wrapper sized to the zoomed image */}
              <div
               style={{
  width: zoomMode ? `${zoom * 100}vw` : "100%",
  height: zoomMode ? `${zoom * 100}vh` : "100%",
  minWidth: "100%",
  minHeight: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}
              >
                <img
                  src={images[activeIndex].url}
                  alt={images[activeIndex].alt || ""}
                  draggable={false}
                  loading="lazy"
                  className="select-none"
                  style={{
  width: "100%",
  height: "100%",
  maxWidth: zoomMode ? "none" : "100%",
  maxHeight: zoomMode ? "none" : "100%",
  objectFit: "contain",
  pointerEvents: "none",
}}
                />
              </div>
            </div>

            {/* Prev arrow */}
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              className="absolute left-0 top-0 h-full w-14
                         flex items-center justify-center
                         disabled:opacity-20 transition-opacity group z-10"
            >
              <span className="w-10 h-10 rounded-full bg-white
                               flex items-center justify-center text-black transition-colors group-hover:bg-white/90">
                <ChevronLeft size={22} />
              </span>
            </button>

            {/* Next arrow */}
            <button
              onClick={next}
              disabled={activeIndex === images.length - 1}
              className="absolute right-0 top-0 h-full w-14
                         flex items-center justify-center
                         disabled:opacity-20 transition-opacity group z-10"
            >
              <span className="w-10 h-10 rounded-full bg-white
                               flex items-center justify-center text-black transition-colors group-hover:bg-white/90">
                <ChevronRight size={22} />
              </span>
            </button>
          </div>

          {/* FILMSTRIP */}
          {showFilmstrip && (
            <div className="shrink-0 px-4 py-3" style={{ backgroundColor: "#0a0a0a" }}>
              <div
                ref={lightboxThumbsRef}
                className="flex gap-1.5 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden justify-center"
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`shrink-0 rounded overflow-hidden aspect-[4/3]
                                h-16 sm:h-[72px] transition-all duration-150
                                ${i === activeIndex
                                  ? "ring-2 ring-white opacity-100"
                                  : "opacity-40 hover:opacity-75"
                                }`}
                  >
                    <img src={img.url} alt="" loading="lazy" className="w-full h-full object-cover" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}