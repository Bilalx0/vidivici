"use client"

import { FileText, Upload } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Documents</h1>
      <p className="text-gray-500 text-sm mb-8">Upload and manage your documents for seamless bookings.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: "Driving License", desc: "Upload front and back" },
          { label: "Passport / National ID", desc: "Government-issued photo ID" },
          { label: "Proof of Address", desc: "Utility bill or bank statement" },
        ].map((doc) => (
          <div key={doc.label} className="border border-dashed border-gray-200 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{doc.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{doc.desc}</p>
              <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition">
                <Upload size={12} /> Upload
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-5 text-center text-gray-400 text-sm">
        <p>Document upload functionality coming soon.</p>
      </div>
    </div>
  )
}
