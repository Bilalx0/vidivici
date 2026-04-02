"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Plus, Pencil } from "lucide-react"

interface Document {
  id: string
  type: string
  number: string
  expiration: string
  status: "Pending" | "Approved" | "Rejected"
  imageUrl?: string
}

const EXISTING_DOCUMENTS: Document[] = [
  {
    id: "1",
    type: "Driver's License",
    number: "3546546454",
    expiration: "02/01",
    status: "Pending",
  },
]

const ADD_SLOTS = [
  { label: "Add Insurance Policy", href: "/account/documents/add-insurance"   },
  { label: "Add ID / Passport",    href: "/account/documents/add-id" },
]

const EDIT_ROUTES: Record<string, string> = {
  "Driver's License": "/account/documents/add-license",
  "Insurance Policy": "/account/documents/add-insurance",
  "ID / Passport":    "/account/documents/add-id",
}

const statusColor = (status: string) => {
  switch (status) {
    case "Approved": return "bg-green-50 text-green-600"
    case "Rejected": return "bg-red-50 text-red-500"
    default:         return "bg-orange-50 text-orange-500"
  }
}

function DocMenu({ docType, onClose }: { docType: string; onClose: () => void }) {
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
        onClick={() => {
          router.push(EDIT_ROUTES[docType] || "/account/documents/add-license")
          onClose()
        }}
        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-mist-700 hover:bg-mist-50 transition-colors"
      >
        <Pencil size={14} className="text-mist-400" />
        Edit
      </button>
    </div>
  )
}

export default function DocumentsPage() {
  const router = useRouter()
  const [docs] = useState<Document[]>(EXISTING_DOCUMENTS)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <div className="overflow-hidden">

      {/* ── Heading ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 2xl:px-10 py-10 sm:py-12 2xl:py-16 border-b-2 border-mist-300 font-medium flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900">Documents</h1>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="my-8 sm:my-12 2xl:my-16 p-4 sm:p-6 2xl:p-8 mx-4 sm:mx-6 lg:mx-10 2xl:mx-14 space-y-4 bg-white rounded-2xl">

        {/* Existing document cards */}
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col sm:flex-row items-start gap-4 border border-mist-200 rounded-2xl p-4 sm:p-5"
          >
            {/* Thumbnail */}
            <div className="w-full sm:w-56 2xl:w-72 h-44 sm:h-36 2xl:h-44 rounded-xl bg-mist-200 flex-shrink-0 overflow-hidden">
              {doc.imageUrl && (
                <img src={doc.imageUrl} alt={doc.type} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2 mt-3">
              <p className="font-semibold text-mist-900 text-base">{doc.type}</p>
              <p className="text-sm text-mist-400">License Number: {doc.number}</p>
              <p className="text-sm text-mist-400">Expiration Date: {doc.expiration}</p>
            </div>

            {/* Status + menu */}
            <div className="relative flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${statusColor(doc.status)}`}>
                {doc.status}
              </span>
              <button
                onClick={() => setOpenMenu(openMenu === doc.id ? null : doc.id)}
                className="p-1 hover:bg-mist-100 rounded-lg transition-colors"
              >
                <MoreVertical size={16} className="text-mist-400" />
              </button>
              {openMenu === doc.id && (
                <DocMenu docType={doc.type} onClose={() => setOpenMenu(null)} />
              )}
            </div>
          </div>
        ))}

        {/* Add slots */}
        {ADD_SLOTS.map((slot) => (
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