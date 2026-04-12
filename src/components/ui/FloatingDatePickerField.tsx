"use client"

import { useEffect, useMemo, useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { format } from "date-fns"
import { X } from "lucide-react"

/* ─── Parse "yyyy-MM-dd" → local-midnight Date (avoids UTC offset bugs) ─── */
function parseLocalDate(v: string) {
  if (!v) return undefined
  try {
    const [y, m, d] = v.split("-").map(Number)
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  } catch { return undefined }
}

/* ═══════════════════════════════════════════════════════════════════
   DateTriggerField – a read-only display field that opens the popup
   ═══════════════════════════════════════════════════════════════════ */
export function DateTriggerField({
  label,
  value,
  onClick,
  desktopLabel = false,
}: {
  label: string
  value: string
  onClick: () => void
  desktopLabel?: boolean
}) {
  const displayValue = useMemo(() => {
    const d = parseLocalDate(value)
    return d ? format(d, "MMM d, yyyy") : ""
  }, [value])
  const hasValue = Boolean(value)

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
              <div
className={`w-full bg-white border border-mist-300 rounded-md px-3 ${desktopLabel ? "2xl:px-5 2xl:text-lg 2xl:pb-2" : ""} text-sm text-mist-700 h-11 2xl:h-13 flex items-end pb-1`}>
        {displayValue}
      </div>
      {/* Top label */}
      <span
        className={`pointer-events-none absolute left-3 ${desktopLabel ? "2xl:left-6" : ""} top-1 ${desktopLabel ? "2xl:top-1" : ""} text-[10px] ${desktopLabel ? "2xl:text-base" : ""} text-mist-400 transition-opacity duration-150 ${hasValue ? "opacity-100" : "opacity-0"}`}
      >
        {label}
      </span>
      {/* Center label */}
      <span
        className={`pointer-events-none absolute left-3 ${desktopLabel ? "2xl:left-6" : ""} top-1/2 -translate-y-1/2 text-sm ${desktopLabel ? "2xl:text-xl " : ""} text-mist-300 transition-opacity duration-150 ${hasValue ? "opacity-0" : "opacity-100"}`}
      >
        {label}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   DateRangeCalendarPopup – full-screen modal with range calendar
   Manual selection: click 1 = start, click 2 = end (forward only).
   Hover preview shows light-blue strip between start and hovered day.
   ═══════════════════════════════════════════════════════════════════ */
interface DateRangeCalendarPopupProps {
  open: boolean
  onClose: () => void
  startDate: string
  endDate: string
  onStartDateChange: (d: string) => void
  onEndDateChange: (d: string) => void
  minDate?: string
  startLabel?: string
  endLabel?: string
  bookedRanges?: { start: string; end: string }[]
}

export default function DateRangeCalendarPopup({
  open,
  onClose,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  startLabel = "start date",
  endLabel = "end date",
  bookedRanges = [],
}: DateRangeCalendarPopupProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredDay, setHoveredDay] = useState<Date | undefined>()

  const fromDate = useMemo(() => parseLocalDate(startDate), [startDate])
  const toDate = useMemo(() => parseLocalDate(endDate), [endDate])
  const minParsed = useMemo(() => parseLocalDate(minDate || ""), [minDate])

  const selectingEnd = Boolean(fromDate && !toDate)
  const headerText = selectingEnd ? `Select ${endLabel}` : `Select ${startLabel}`
  const startDisplay = fromDate ? format(fromDate, "MMM d, yyyy") : startLabel
  const endDisplay = toDate ? format(toDate, "MMM d, yyyy") : endLabel

  /* Build set of booked dates from ranges */
  const bookedDates = useMemo(() => {
    const dates: Date[] = []
    for (const range of bookedRanges) {
      const s = parseLocalDate(range.start)
      const e = parseLocalDate(range.end)
      if (!s || !e) continue
      const cur = new Date(s)
      while (cur <= e) {
        dates.push(new Date(cur))
        cur.setDate(cur.getDate() + 1)
      }
    }
    return dates
  }, [bookedRanges])

  /* Hover preview: only when selecting end & hovered day is AFTER start */
  const previewEnd =
    selectingEnd && hoveredDay && fromDate && hoveredDay > fromDate
      ? hoveredDay
      : undefined

  /* Build modifiers – map to rdp's built-in CSS class names for range styling */
  const modifiers = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m: Record<string, any> = {}
    const endPoint = toDate || previewEnd
    if (fromDate && endPoint) {
      m.rangeStart = fromDate
      m.rangeEnd = endPoint
      m.rangeMiddle = { after: fromDate, before: endPoint }
    } else if (fromDate) {
      m.selectedOnly = fromDate
    }
    if (bookedDates.length > 0) {
      m.booked = bookedDates
    }
    return m
  }, [fromDate, toDate, previewEnd, bookedDates])

  const modifiersClassNames = {
    rangeStart: "rdp-range_start",
    rangeEnd: "rdp-range_end",
    rangeMiddle: "rdp-range_middle",
    selectedOnly: "rdp-custom-selected",
    booked: "rdp-booked",
  }

  /* responsive */
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    fn()
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  /* escape */
  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", esc)
    return () => document.removeEventListener("keydown", esc)
  }, [open, onClose])

  /* lock body scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [open])

  /* reset hover when popup closes */
  useEffect(() => {
    if (!open) setHoveredDay(undefined)
  }, [open])

  if (!open) return null

  const handleDayClick = (day: Date, dayModifiers: Record<string, boolean>) => {
    if (dayModifiers.disabled) return

    if (!fromDate || toDate) {
      /* No start selected, or both already set → start fresh */
      onStartDateChange(format(day, "yyyy-MM-dd"))
      onEndDateChange("")
    } else {
      /* Start is set, selecting end */
      if (day > fromDate) {
        onEndDateChange(format(day, "yyyy-MM-dd"))
        setTimeout(() => onClose(), 300)
      }
      /* day <= fromDate → discard (reverse / same-day selection blocked) */
    }
  }

  const handleClear = () => {
    onStartDateChange("")
    onEndDateChange("")
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 md:p-4 2xl:p-8"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${isMobile
            ? "h-full flex flex-col"
            : "rounded-2xl 2xl:rounded-[2rem] shadow-2xl 2xl:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] max-w-[750px] 2xl:max-w-[1400px] p-6 md:p-8 2xl:p-16"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={`flex items-start justify-between ${isMobile ? "p-4 pb-3 border-b border-gray-100 shrink-0" : "mb-6 2xl:mb-14"}`}>
          <div>
            <h2 className="text-xl md:text-2xl 2xl:text-5xl font-medium text-blue-600">
              {headerText}
            </h2>
            <p className="text-sm 2xl:text-2xl text-mist-500 mt-0.5 2xl:mt-4">
              {startDisplay} – {endDisplay}
            </p>
          </div>
          <div className="flex items-center gap-4 2xl:gap-8">
            {(fromDate || toDate) && (
              <button
                onClick={handleClear}
                className="text-sm 2xl:text-xl text-mist-700 underline hover:text-mist-900"
              >
                Clear dates
              </button>
            )}
            <button
              onClick={onClose}
              className="text-mist-400 hover:text-mist-600 2xl:p-3"
            >
              <X size={22} className="2xl:w-10 2xl:h-10" />
            </button>
          </div>
        </div>

        {/* ── Calendar ── */}
        <style>{`
          .rdp-range-popup .rdp-root {
            --rdp-accent-color: #3b82f6;
            --rdp-accent-background-color: #dbeafe;
            --rdp-range_middle-background-color: #dbeafe;
            --rdp-range_start-date-background-color: #3b82f6;
            --rdp-range_end-date-background-color: #3b82f6;
            --rdp-today-color: #3b82f6;
          }
          .rdp-range-popup .rdp-day_button {
            font-weight: 400 !important;
          }
          .rdp-range-popup .rdp-custom-selected .rdp-day_button {
            background-color: #3b82f6;
            color: white;
            border-radius: var(--rdp-day_button-border-radius);
          }
          /* Black nav arrows */
          .rdp-range-popup .rdp-button_previous,
          .rdp-range-popup .rdp-button_next {
            color: #000 !important;
          }
          .rdp-range-popup .rdp-chevron {
            fill: #000 !important;
            color: #000 !important;
          }
          .rdp-range-popup .rdp-button_previous svg,
          .rdp-range-popup .rdp-button_next svg {
            color: #000 !important;
            fill: #000 !important;
            stroke: #000 !important;
          }
          /* 2XL scaling for calendar - LARGER */
          @media (min-width: 1536px) {
            .rdp-range-popup {
              --rdp-day-width: 64px;
              --rdp-day-height: 64px;
            }
            .rdp-range-popup .rdp-day {
              width: var(--rdp-day-width) !important;
              height: var(--rdp-day-height) !important;
            }
            .rdp-range-popup .rdp-day_button {
              width: 60px !important;
              height: 60px !important;
              font-size: 22px !important;
              font-weight: 500 !important;
            }
            .rdp-range-popup .rdp-weekday {
              font-size: 18px !important;
              padding: 16px 0 !important;
              font-weight: 600 !important;
            }
            .rdp-range-popup .rdp-month_caption {
              font-size: 32px !important;
              padding: 20px 0 !important;
              font-weight: 600 !important;
            }
            .rdp-range-popup .rdp-nav_button {
              width: 56px !important;
              height: 56px !important;
            }
            .rdp-range-popup .rdp-chevron {
              width: 28px !important;
              height: 28px !important;
            }
            .rdp-range-popup .rdp-months {
              gap: 3rem !important;
            }
            .rdp-range-popup .rdp-month_grid {
              width: auto !important;
            }
          }
          /* Mobile: hide nav arrows, stack months vertically, full width */
          .rdp-range-popup-mobile .rdp-nav {
            display: none;
          }
          .rdp-range-popup-mobile .rdp-button_previous,
          .rdp-range-popup-mobile .rdp-button_next {
            display: none !important;
          }
          .rdp-range-popup-mobile .rdp-months {
            flex-direction: column;
            gap: 1.5rem;
          }
          .rdp-range-popup-mobile .rdp-month {
            width: 100%;
          }
          .rdp-range-popup-mobile .rdp-month_grid {
            width: 100%;
          }
          .rdp-range-popup-mobile .rdp-weekdays,
          .rdp-range-popup-mobile .rdp-week {
            display: flex;
            justify-content: space-around;
          }
          .rdp-range-popup-mobile .rdp-day {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .rdp-range-popup-mobile .rdp-weekday {
            flex: 1;
            text-align: center;
          }
          .rdp-range-popup-mobile .rdp-month_caption {
            padding: 0.5rem 0;
          }
          /* Booked dates */
          .rdp-range-popup .rdp-booked .rdp-day_button {
            background-color: #1a1a1a !important;
            color: #fff !important;
            border-radius: var(--rdp-day_button-border-radius);
            cursor: not-allowed;
            opacity: 0.85;
          }
        `}</style>
        <div className={`${isMobile ? "rdp-range-popup rdp-range-popup-mobile overflow-y-auto flex-1 px-4 py-3" : "rdp-range-popup"}`}>
          <DayPicker
            navLayout="around"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            onDayClick={handleDayClick}
            onDayMouseEnter={(day) => setHoveredDay(day)}
            onDayMouseLeave={() => setHoveredDay(undefined)}
            numberOfMonths={isMobile ? 6 : 2}
            showOutsideDays={!isMobile}
            startMonth={minParsed}
            disabled={[
              ...(minParsed ? [{ before: minParsed }] : []),
              ...bookedDates,
            ]}
          />
        </div>
      </div>
    </div>
  )
}