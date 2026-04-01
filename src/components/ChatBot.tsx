"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  role: "user" | "bot"
  text: string
}

const RESPONSES: Record<string, string> = {
  hello: "Hello! Welcome to VIDIVICI. How can I help you today? I can assist with car rentals, villa bookings, or events.",
  hi: "Hi there! Welcome to VIDIVICI. Looking for a luxury car, villa, or event experience?",
  hey: "Hey! How can I help you today?",
  cars: "We offer a premium fleet of exotic and luxury cars including Lamborghini, Ferrari, Rolls-Royce, Bentley, and more. Browse our collection at /cars or let me know what you're looking for!",
  villas: "We have stunning luxury villas in Los Angeles, Beverly Hills, Malibu, and Miami. Check them out at /villas!",
  events: "We host exclusive nightlife, private events, and VIP experiences across LA. See what's available at /events!",
  price: "Our pricing varies by vehicle and duration. Longer rentals get better rates - up to 40% off for monthly rentals! Visit /cars for specific pricing.",
  booking: "You can book directly on our website! Just pick a car, villa, or event, select your dates, and complete the reservation. Need help with a specific booking?",
  contact: "You can reach us at our Beverly Hills office: 499 N Canon Dr, Beverly Hills, CA 90210. Or use the contact form on our website!",
  thanks: "You're welcome! Let me know if there's anything else I can help with.",
  "thank you": "You're welcome! Enjoy the VIDIVICI experience!",
  bye: "Goodbye! Have a great day!",
}

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim()
  for (const [key, response] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return response
  }
  return "Thanks for your message! For detailed inquiries, please contact us through our contact page or call us directly. I can help with questions about our cars, villas, or events!"
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I'm the VIDIVICI assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [...prev, { role: "user", text }])
    setInput("")
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getBotResponse(text) }])
    }, 500)
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#dbb241] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#c9a238] transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-mist-200 flex flex-col overflow-hidden" style={{ height: "480px" }}>
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="font-semibold text-sm">VIDIVICI Assistant</p>
              <p className="text-[10px] text-mist-400">We typically reply instantly</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-mist-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-mist-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-white text-mist-800 border border-mist-200 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-mist-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message..."
                className="flex-1 text-sm px-3 py-2 border border-mist-200 rounded-lg focus:outline-none focus:border-[#dbb241]"
              />
              <button
                onClick={send}
                className="bg-[#dbb241] text-black p-2 rounded-lg hover:bg-[#c9a238] transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
