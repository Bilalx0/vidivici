"use client"

import { useState, useRef } from "react"
import { Camera } from "lucide-react"

const MONTHS = ["Month", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAYS   = ["Day",   ...Array.from({ length: 31 }, (_, i) => String(i + 1))]
const YEARS  = ["Year",  ...Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() + i))]

interface AddDocumentFormProps {
  title: string
  numberLabel: string
  uploadLabel: string
  onSubmit: (data: { number: string; month: string; day: string; year: string; file: File | null }) => void
}

export default function AddDocumentForm({ title, numberLabel, uploadLabel, onSubmit }: AddDocumentFormProps) {
  const [number, setNumber] = useState("")
  const [month, setMonth]   = useState("Month")
  const [day, setDay]       = useState("Day")
  const [year, setYear]     = useState("Year")
  const [file, setFile]     = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (f) setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ number, month, day, year, file })
  }

  return (
    <div className="bg-white rounded-2xl 2xl:rounded-3xl border border-mist-200 shadow-xl p-6 sm:p-8 2xl:p-12 w-full max-w-xl 2xl:max-w-3xl mx-auto">

      {/* Title — hidden on mobile where layout header shows it */}
      <h2 className="hidden lg:block text-xl 2xl:text-3xl font-bold text-mist-900 mb-6 2xl:mb-10">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 2xl:space-y-8">

        {/* Number + Expiration row */}
        <div className="flex flex-col sm:flex-row gap-3 2xl:gap-6">

          {/* Number input */}
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder={numberLabel}
            className="flex-1 border-2 border-mist-200 rounded-xl 2xl:rounded-2xl px-4 2xl:px-6 py-3 2xl:py-5 text-sm 2xl:text-xl text-mist-700 placeholder-mist-300 focus:border-mist-400 focus:outline-none transition"
          />

          {/* Expiration date selects */}
          <div className="flex-1 border-2 border-mist-200 rounded-xl 2xl:rounded-2xl px-4 2xl:px-6 py-2.5 2xl:py-5 flex flex-col gap-0.5 2xl:gap-1">
            <span className="text-[10px] 2xl:text-lg text-mist-400 font-medium">Expiration date</span>
            <div className="flex items-center gap-1 2xl:gap-2">
              {[
                { value: month, set: setMonth, options: MONTHS },
                { value: day,   set: setDay,   options: DAYS   },
                { value: year,  set: setYear,  options: YEARS  },
              ].map((sel, i) => (
                <select
                  key={i}
                  value={sel.value}
                  onChange={(e) => sel.set(e.target.value)}
                  className="flex-1 text-xs 2xl:text-xl text-mist-600 bg-transparent outline-none cursor-pointer"
                >
                  {sel.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        </div>

        {/* Upload area */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-blue-300 rounded-2xl 2xl:rounded-3xl py-10 2xl:py-20 flex flex-col items-center gap-3 2xl:gap-6 hover:bg-blue-50/40 transition-colors group"
        >
          {preview ? (
            <img src={preview} alt="Preview" loading="lazy" className="h-24 2xl:h-40 object-contain rounded-lg 2xl:rounded-2xl" />
          ) : (
            <>
              <div className="w-12 2xl:w-20 h-12 2xl:h-20 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera size={22} className="text-blue-400 2xl:w-8 2xl:h-8" />
              </div>
              <div className="text-center">
                <p className="text-sm 2xl:text-2xl font-semibold text-mist-700">{uploadLabel}</p>
                <p className="text-xs 2xl:text-xl text-mist-400 mt-0.5 2xl:mt-2">(jpg, jpeg, png, pdf)</p>
              </div>
            </>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFile}
          className="hidden"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-mist-900 text-white text-sm 2xl:text-xl font-semibold py-3 2xl:py-5 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors"
        >
          Save Document
        </button>
      </form>
    </div>
  )
}