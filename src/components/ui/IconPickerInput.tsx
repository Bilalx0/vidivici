"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import * as LucideIcons from "lucide-react"
import { Search, X, ChevronDown } from "lucide-react"

// Dynamically get all valid icon names from lucide-react
const ALL_ICON_NAMES: string[] = Object.keys(LucideIcons).filter((key) => {
  const val = (LucideIcons as Record<string, unknown>)[key]
  return (
    (typeof val === "function" || (typeof val === "object" && val !== null)) &&
    key !== "createLucideIcon" &&
    key !== "default" &&
    !key.startsWith("lucide") &&
    /^[A-Z]/.test(key)
  )
})

function DynamicIcon({
  name,
  size = 18,
  className = "",
}: {
  name: string
  size?: number
  className?: string
}) {
  const Icon = (LucideIcons as Record<string, unknown>)[name] as
    | React.ComponentType<{ size?: number; className?: string }>
    | undefined

  if (!Icon) return null
  return <Icon size={size} className={className} />
}

interface IconPickerInputProps {
  value: string
  onChange: (iconName: string) => void
  placeholder?: string
  inputClassName?: string
}

export default function IconPickerInput({
  value,
  onChange,
  placeholder = "Select icon",
  inputClassName = "",
}: IconPickerInputProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  
  // Filter icons based on search query
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return ALL_ICON_NAMES
    return ALL_ICON_NAMES.filter((name) => name.toLowerCase().includes(q))
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    }
  }, [open])

  const handleSelect = (iconName: string) => {
    onChange(iconName)
    setOpen(false)
    setQuery("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2 w-full cursor-pointer ${inputClassName}`}
      >
        <span className="flex items-center gap-2 truncate">
          {value ? (
            <>
              <DynamicIcon name={value} size={16} className="text-mist-600 flex-shrink-0" />
              <span className="text-mist-800 text-sm truncate">{value}</span>
            </>
          ) : (
            <span className="text-mist-400 text-sm">{placeholder}</span>
          )}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
              className="text-mist-300 hover:text-mist-500 p-0.5 rounded"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-mist-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-mist-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-mist-100">
            <Search size={14} className="text-mist-400 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons..."
              className="flex-1 text-sm text-mist-800 placeholder-mist-400 outline-none bg-transparent"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-mist-300 hover:text-mist-500">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Count */}
          <div className="px-3 py-1.5 text-[11px] text-mist-400 border-b border-mist-100">
            {filtered.length} icon{filtered.length !== 1 ? "s" : ""}
            {query && ` matching "${query}"`}
          </div>

          {/* Icon Grid */}
          <div className="overflow-y-auto max-h-60 p-2">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-mist-400 py-6">No icons found</p>
            ) : (
              <div className="grid grid-cols-6 gap-1">
                {filtered.slice(0, 180).map((name) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => handleSelect(name)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-mist-100 ${
                      value === name ? "bg-mist-100 ring-1 ring-mist-300" : ""
                    }`}
                  >
                    <DynamicIcon name={name} size={18} className="text-mist-700" />
                  </button>
                ))}
                {filtered.length > 180 && (
                  <div className="col-span-6 text-center text-[11px] text-mist-400 py-2">
                    Showing 180 of {filtered.length} — refine your search
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}