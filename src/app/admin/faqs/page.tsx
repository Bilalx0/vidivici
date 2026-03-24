"use client"

import { useState } from "react"

const faqsList = [
  { id: "1", question: "What happens if I return the vehicle late?", answer: "One-hour grace period...", order: 1 },
  { id: "2", question: "Can I do a one-way trip?", answer: "Yes, select One-way option...", order: 2 },
  { id: "3", question: "Do you offer delivery service?", answer: "Complimentary delivery within Beverly Hills...", order: 3 },
  { id: "4", question: "What are your rental requirements?", answer: "Valid license, insurance, credit card...", order: 4 },
  { id: "5", question: "What is your cancellation policy?", answer: "Free cancellation within 24 hours...", order: 5 },
]

export default function AdminFAQsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage FAQs</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
          {showForm ? "Cancel" : "+ Add FAQ"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Question</label>
            <input type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Answer</label>
            <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Order</label>
            <input type="number" className="w-32 bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
          </div>
          <button className="bg-black text-white px-6 py-2 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">Save FAQ</button>
        </div>
      )}

      <div className="space-y-3">
        {faqsList.map((faq) => (
          <div key={faq.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-900 px-2 py-0.5 rounded font-medium">#{faq.order}</span>
                  <h3 className="text-sm font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <p className="text-sm text-gray-500">{faq.answer}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="text-xs text-black font-medium hover:underline">Edit</button>
                <button className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
