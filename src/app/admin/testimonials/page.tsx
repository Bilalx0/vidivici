"use client"

import { useState } from "react"
import { Star } from "lucide-react"

const testimonialsList = [
  { id: "1", name: "James R.", content: "Absolutely incredible experience! The Lamborghini was in perfect condition.", rating: 5, visible: true },
  { id: "2", name: "Sarah M.", content: "Rented a Rolls-Royce for our wedding. The team went above and beyond.", rating: 5, visible: true },
  { id: "3", name: "Michael T.", content: "Best exotic car rental in LA. Smooth process, no hidden fees.", rating: 5, visible: true },
  { id: "4", name: "Emily K.", content: "Professional, transparent, and reliable. Outstanding service!", rating: 5, visible: true },
  { id: "5", name: "David L.", content: "Third time renting and they never disappoint. Great selection.", rating: 5, visible: false },
]

export default function AdminTestimonialsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Testimonials</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          {showForm ? "Cancel" : "+ Add Testimonial"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Customer Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded-lg focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Rating</label>
              <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded-lg focus:border-black focus:outline-none">
                <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Content</label>
            <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded-lg focus:border-black focus:outline-none resize-none" />
          </div>
          <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Save Testimonial</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonialsList.map((t) => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium text-sm">{t.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={12} className="fill-gray-900 text-gray-900" />)}</div>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.visible ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                {t.visible ? "Visible" : "Hidden"}
              </span>
            </div>
            <p className="text-sm text-gray-500 italic mb-4">&ldquo;{t.content}&rdquo;</p>
            <div className="flex gap-4">
              <button className="text-xs text-gray-900 font-medium hover:underline">Edit</button>
              <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">{t.visible ? "Hide" : "Show"}</button>
              <button className="text-xs text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
