"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Plus, Pencil } from "lucide-react"

interface DocEntry {
  url: string | null
  number: string | null
  expiry: string | null
}

interface UserDocs {
  driverLicense: string | null
  driverLicenseStatus: string
  insurance: string | null
  insuranceStatus: string
  passport: string | null
  passportStatus: string
}

function parseDoc(raw: string | null): DocEntry | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as DocEntry
  } catch {
    return { url: raw, number: null, expiry: null }
  }
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:  "bg-orange-50 text-orange-500",
  VERIFIED: "bg-green-50 text-green-600",
  REJECTED: "bg-red-50 text-red-500",
  NONE:     "bg-mist-100 text-mist-400",
}

function statusLabel(s: string) {
  if (s === "NONE") return "Not uploaded"
  return s.charAt(0) + s.slice(1).toLowerCase()
}

function DocMenu({ href, onClose }: { href: string; onClose: () => void }) {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-20 w-36 bg-white border border-mist-100 rounded-xl shadow-lg overflow-hidden"
    >
      <button
        onClick={() => { router.push(href); onClose() }}
        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-mist-700 hover:bg-mist-50 transition-colors"
      >
        <Pencil size={14} className="text-mist-400" />
        Replace
      </button>
    </div>
  )
}

export default function DocumentsPage() {
  const router = useRouter()
  const [docs, setDocs] = useState<UserDocs | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const fetchDocs = useCallback(() => {
    fetch("/api/account/profile")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setDocs({
            driverLicense: data.driverLicense ?? null,
            driverLicenseStatus: data.driverLicenseStatus ?? "NONE",
            insurance: data.insurance ?? null,
            insuranceStatus: data.insuranceStatus ?? "NONE",
            passport: data.passport ?? null,
            passportStatus: data.passportStatus ?? "NONE",
          })
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  const dl  = parseDoc(docs?.driverLicense ?? null)
  const ins = parseDoc(docs?.insurance ?? null)
  const pp  = parseDoc(docs?.passport ?? null)

  const existingDocs = [
    dl  ? { key: "dl",  type: "Driver's License", doc: dl,  status: docs?.driverLicenseStatus ?? "NONE", href: "/account/documents/add-license"   } : null,
    ins ? { key: "ins", type: "Insurance Policy",  doc: ins, status: docs?.insuranceStatus     ?? "NONE", href: "/account/documents/add-insurance" } : null,
    pp  ? { key: "pp",  type: "Passport / ID",     doc: pp,  status: docs?.passportStatus      ?? "NONE", href: "/account/documents/add-id"        } : null,
  ].filter(Boolean) as { key: string; type: string; doc: DocEntry; status: string; href: string }[]

  const addSlots = [
    !dl  ? { label: "Add Driver's License", href: "/account/documents/add-license"   } : null,
    !ins ? { label: "Add Insurance Policy", href: "/account/documents/add-insurance" } : null,
    !pp  ? { label: "Add ID / Passport", href: "/account/documents/add-id" } : null,
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <div className="overflow-hidden">
      <div className="hidden lg:flex px-4 sm:px-6 2xl:px-10 py-10 sm:py-12 2xl:py-16 border-b-2 border-mist-300 font-medium items-center justify-between">
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900">Documents</h1>
      </div>

      <div className="my-8 sm:my-12 2xl:my-16 p-4 sm:p-6 2xl:p-8 mx-4 sm:mx-6 lg:mx-10 2xl:mx-14 space-y-4 bg-white rounded-2xl">

        {existingDocs.map((item) => (
          <div
            key={item.key}
            className="flex flex-col sm:flex-row items-start gap-4 border border-mist-200 rounded-2xl p-4 sm:p-5"
          >
            <div className="w-full sm:w-56 2xl:w-72 h-44 sm:h-36 2xl:h-44 rounded-xl bg-mist-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
              {item.doc.url ? (
                item.doc.url.toLowerCase().endsWith(".pdf") ? (
                  <a href={item.doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline px-4 text-center">
                    View PDF document
                  </a>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.doc.url} alt={item.type} className="w-full h-full object-contain" />
                )
              ) : (
                <span className="text-xs text-mist-400">No image uploaded</span>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2 mt-3">
              <p className="font-semibold text-mist-900 text-base">{item.type}</p>
              {item.doc.number && <p className="text-sm text-mist-400">Number: {item.doc.number}</p>}
              {item.doc.expiry && <p className="text-sm text-mist-400">Expiry: {item.doc.expiry}</p>}
            </div>

            <div className="relative flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${STATUS_STYLES[item.status] ?? STATUS_STYLES.NONE}`}>
                {statusLabel(item.status)}
              </span>
              <button
                onClick={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                className="p-1 hover:bg-mist-100 rounded-lg transition-colors"
              >
                <MoreVertical size={16} className="text-mist-400" />
              </button>
              {openMenu === item.key && (
                <DocMenu href={item.href} onClose={() => setOpenMenu(null)} />
              )}
            </div>
          </div>
        ))}

        {addSlots.map((slot) => (
          <button
            key={slot.label}
            onClick={() => router.push(slot.href)}
            className="w-full flex flex-col items-center justify-center gap-2 border border-blue-200 rounded-2xl py-16 hover:bg-blue-50/50 transition-colors group"
          >
            <Plus size={22} className="text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-500">{slot.label}</span>
          </button>
        ))}

      </div>
    </div>
  )
}
