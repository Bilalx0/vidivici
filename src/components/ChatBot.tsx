"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  role: "user" | "assistant" | "admin"
  content: string
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey there! I'm **Mark**, your personal VIDI VICI concierge. Looking for a luxury car, villa, or exclusive event? I can help you find and book the perfect experience. What are you looking for?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [visitorId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vv_visitor_id")
      if (stored) return stored
      const id = `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      localStorage.setItem("vv_visitor_id", id)
      return id
    }
    return `visitor-${Date.now()}`
  })
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Poll for admin messages when paused
  const pollForAdmin = useCallback(async () => {
    if (!sessionId) return
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`)
      if (!res.ok) return
      const session = await res.json()
      setPaused(session.isPaused)

      // Sync messages from DB
      const dbMessages: Message[] = session.messages.map((m: any) => ({
        role: m.role as "user" | "assistant" | "admin",
        content: m.content,
      }))

      // Only update if there are new messages
      if (dbMessages.length > messages.length - 1) {
        setMessages([messages[0], ...dbMessages])
      }
    } catch {}
  }, [sessionId, messages])

  useEffect(() => {
    if (paused && open && sessionId) {
      pollRef.current = setInterval(pollForAdmin, 3000)
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [paused, open, sessionId, pollForAdmin])

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
          messages: newMessages.slice(1).map((m) => ({ role: m.role, content: m.content })),
          sessionId,
          visitorId,
        }),
      })

      if (!res.ok) throw new Error()
      const data = await res.json()

      if (data.sessionId) setSessionId(data.sessionId)
      setPaused(data.paused || false)

      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }])
      }

      // If paused, check for admin messages
      if (data.paused) {
        pollForAdmin()
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderContent = (content: string) => {
    const parts = content.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
      if (linkMatch) {
        return (
          <a key={i} href={linkMatch[2]} className="text-[#dbb241] underline hover:text-[#c9a238]" target={linkMatch[2].startsWith("http") ? "_blank" : undefined}>
            {linkMatch[1]}
          </a>
        )
      }
      const boldMatch = part.match(/\*\*(.*?)\*\*/)
      if (boldMatch) {
        return <strong key={i}>{boldMatch[1]}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#dbb241] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#c9a238] transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-mist-200 flex flex-col overflow-hidden" style={{ height: "520px" }}>
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#dbb241] flex items-center justify-center text-black text-xs font-bold">M</div>
              <div>
                <p className="font-semibold text-sm">Mark</p>
                <p className="text-[10px] text-mist-400">
                  {paused ? "Live Agent Connected" : "VIDI VICI Concierge"}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-mist-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Paused banner */}
          {paused && (
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-xs text-blue-700 flex-shrink-0">
              A team member has joined this conversation.
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-mist-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {(msg.role === "assistant" || msg.role === "admin") && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mr-2 mt-1 flex-shrink-0 ${msg.role === "admin" ? "bg-blue-500 text-white" : "bg-[#dbb241] text-black"}`}>
                    {msg.role === "admin" ? "A" : "M"}
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-sm"
                      : msg.role === "admin"
                      ? "bg-blue-50 text-mist-800 border border-blue-200 rounded-bl-sm"
                      : "bg-white text-mist-800 border border-mist-200 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "user" ? msg.content : renderContent(msg.content)}
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
