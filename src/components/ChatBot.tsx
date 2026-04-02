"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey there! I'm **Mark**, your personal VIDI VICI concierge. Looking for a luxury car, villa, or exclusive event? I can help you find and book the perfect experience. What are you looking for?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: "user", content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error()
      const data = await res.json()

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Simple markdown-like rendering for links and bold
  const renderContent = (content: string) => {
    const parts = content.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      // Markdown link [text](url)
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
      if (linkMatch) {
        return (
          <a key={i} href={linkMatch[2]} className="text-[#dbb241] underline hover:text-[#c9a238]" target={linkMatch[2].startsWith("http") ? "_blank" : undefined}>
            {linkMatch[1]}
          </a>
        )
      }
      // Bold **text**
      const boldMatch = part.match(/\*\*(.*?)\*\*/)
      if (boldMatch) {
        return <strong key={i}>{boldMatch[1]}</strong>
      }
      return <span key={i}>{part}</span>
    })
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
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-mist-200 flex flex-col overflow-hidden" style={{ height: "520px" }}>
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#dbb241] flex items-center justify-center text-black text-xs font-bold">M</div>
              <div>
                <p className="font-semibold text-sm">Mark</p>
                <p className="text-[10px] text-mist-400">VIDI VICI Concierge</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-mist-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-mist-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#dbb241] flex items-center justify-center text-black text-[10px] font-bold mr-2 mt-1 flex-shrink-0">M</div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-white text-mist-800 border border-mist-200 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-[#dbb241] flex items-center justify-center text-black text-[10px] font-bold mr-2 mt-1 flex-shrink-0">M</div>
                <div className="bg-white text-mist-400 border border-mist-200 px-3 py-2 rounded-xl rounded-bl-sm text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-mist-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-mist-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-mist-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-mist-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask Mark anything..."
                disabled={loading}
                className="flex-1 text-sm px-3 py-2 border border-mist-200 rounded-lg focus:outline-none focus:border-[#dbb241] disabled:opacity-50"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="bg-[#dbb241] text-black p-2 rounded-lg hover:bg-[#c9a238] transition-colors disabled:opacity-50"
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
