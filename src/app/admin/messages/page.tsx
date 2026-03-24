"use client"

import { useState } from "react"

const messages = [
  { id: "1", name: "John D.", email: "john@email.com", subject: "Booking Inquiry", message: "I'm interested in renting the Ferrari 488 for a weekend in January. Is it available?", date: "Dec 15, 2024", read: false },
  { id: "2", name: "Lisa W.", email: "lisa@email.com", subject: "Wedding Rental", message: "We'd like to book a Rolls-Royce for our wedding on March 15th. Can you provide pricing?", date: "Dec 14, 2024", read: false },
  { id: "3", name: "Tom B.", email: "tom@email.com", subject: "Long Term Rental", message: "Looking for a monthly rental of a Mercedes G63. What are your rates?", date: "Dec 13, 2024", read: true },
  { id: "4", name: "Amy S.", email: "amy@email.com", subject: "General Question", message: "Do you deliver to Santa Monica? What's the fee?", date: "Dec 12, 2024", read: true },
]

export default function AdminMessagesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <span className="text-sm text-gray-500">{messages.filter(m => !m.read).length} unread</span>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`bg-white border rounded-xl overflow-hidden ${msg.read ? "border-gray-200" : "border-black/20"}`}>
            <button onClick={() => setExpanded(expanded === msg.id ? null : msg.id)} className="w-full p-5 text-left flex items-center gap-4">
              {!msg.read && <div className="w-2 h-2 bg-black rounded-full flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-900">{msg.name} <span className="text-gray-400 font-normal">-- {msg.subject}</span></p>
                  <span className="text-xs text-gray-400 ml-4 flex-shrink-0">{msg.date}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.message}</p>
              </div>
            </button>
            {expanded === msg.id && (
              <div className="px-5 pb-5 border-t border-gray-200 pt-4">
                <div className="flex gap-4 mb-3 text-xs text-gray-500">
                  <span>From: {msg.email}</span>
                  <span>Date: {msg.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{msg.message}</p>
                <div className="flex gap-2">
                  <button className="text-xs bg-black text-white px-4 py-1.5 rounded font-medium hover:bg-gray-800 transition-colors">Reply via Email</button>
                  <button className="text-xs text-gray-500 hover:text-gray-900 transition-colors">{msg.read ? "Mark Unread" : "Mark Read"}</button>
                  <button className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
