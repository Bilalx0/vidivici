"use client"

import { useState, useEffect, useRef } from "react"
import toast, { Toaster } from "react-hot-toast"
import { MessageCircle, Send, Pause, Play, ArrowLeft, Search } from "lucide-react"

interface ChatSession {
  id: string
  visitorId: string
  visitorName: string | null
  isPaused: boolean
  lastMessage: string | null
  createdAt: string
  updatedAt: string
  _count: { messages: number }
}

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "admin"
  content: string
  createdAt: string
}

interface SessionDetail extends ChatSession {
  messages: ChatMessage[]
}

export default function AdminConversationsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selected, setSelected] = useState<SessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/chat/sessions")
      if (res.ok) setSessions(await res.json())
    } catch {} finally {
      setLoading(false)
    }
  }

  const fetchSession = async (id: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${id}`)
      if (res.ok) {
        const data = await res.json()
        setSelected(data)
      }
    } catch {}
  }

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 5000)
    return () => clearInterval(interval)
  }, [])

  // Poll selected conversation for new messages
  useEffect(() => {
    if (selected) {
      pollRef.current = setInterval(() => fetchSession(selected.id), 3000)
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [selected?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selected?.messages])

  const togglePause = async () => {
    if (!selected) return
    try {
      const res = await fetch(`/api/chat/sessions/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaused: !selected.isPaused }),
      })
      if (res.ok) {
        const updated = await res.json()
        setSelected((prev) => prev ? { ...prev, isPaused: updated.isPaused } : null)
        toast.success(updated.isPaused ? "AI paused — you're now live with the customer" : "AI resumed — Mark is back in control")
        fetchSessions()
      }
    } catch {
      toast.error("Failed to update")
    }
  }

  const sendReply = async () => {
    if (!selected || !reply.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/chat/sessions/${selected.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin", content: reply.trim() }),
      })
      if (res.ok) {
        setReply("")
        fetchSession(selected.id)
      }
    } catch {
      toast.error("Failed to send")
    } finally {
      setSending(false)
    }
  }

  const formatTime = (d: string) =>
    new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })

  const formatRelative = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  // Mobile: show either list or detail
  if (selected) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col min-w-0">
        <Toaster position="top-right" />

        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-mist-200 flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="text-mist-400 hover:text-mist-700">
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="font-semibold text-mist-900 text-sm truncate max-w-[200px]">{selected.visitorId.slice(0, 20)}</p>
              <p className="text-xs text-mist-400">{selected._count?.messages || selected.messages.length} messages</p>
            </div>
          </div>
          <button
            onClick={togglePause}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected.isPaused
                ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                : "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
            }`}
          >
            {selected.isPaused ? <><Play size={14} /> Resume AI</> : <><Pause size={14} /> Take Over</>}
          </button>
        </div>

        {selected.isPaused && (
          <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2 text-xs text-yellow-700 flex-shrink-0">
            AI is paused. You are responding directly to the customer. Click "Resume AI" to let Mark take over again.
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {selected.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {(msg.role === "assistant" || msg.role === "admin") && (
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mr-2 mt-1 flex-shrink-0 ${
                  msg.role === "admin" ? "bg-blue-500 text-white" : "bg-[#dbb241] text-black"
                }`}>
                  {msg.role === "admin" ? "A" : "M"}
                </div>
              )}
              <div className="max-w-[70%] min-w-0">
                <div
                  className={`px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-mist-900 text-white rounded-br-sm"
                      : msg.role === "admin"
                      ? "bg-blue-50 text-mist-800 border border-blue-200 rounded-bl-sm"
                      : "bg-white text-mist-800 border border-mist-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <p className="text-[10px] text-mist-400 mt-1 px-1">
                  {msg.role === "admin" ? "You" : msg.role === "assistant" ? "Mark" : "Customer"} &middot; {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Reply input (only when paused / admin took over) */}
        {selected.isPaused && (
          <div className="border-t border-mist-200 pt-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Type your reply..."
                className="flex-1 min-w-0 text-sm px-4 py-2.5 border border-mist-200 rounded-lg focus:outline-none focus:border-black"
              />
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-mist-800 disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mist-900">Conversations</h1>
          <p className="text-sm text-mist-500">{sessions.length} total conversations</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
        <input type="text" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-mist-200 rounded-lg text-sm text-mist-900 placeholder:text-mist-400 outline-none focus:border-black transition" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading conversations...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle size={40} className="text-mist-300 mx-auto mb-3" />
          <p className="text-mist-400 text-sm">No conversations yet. When customers chat with Mark, conversations will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.filter(s => {
            if (!search) return true
            const q = search.toLowerCase()
            return (s.visitorName?.toLowerCase().includes(q)) || s.visitorId.toLowerCase().includes(q) || (s.lastMessage?.toLowerCase().includes(q))
          }).map((s) => (
            <button
              key={s.id}
              onClick={() => fetchSession(s.id)}
              className="w-full bg-white border border-mist-200 rounded-xl p-4 text-left hover:border-mist-400 transition-colors flex items-center gap-3 min-w-0"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${s.isPaused ? "bg-yellow-100 text-yellow-700" : "bg-mist-100 text-mist-500"}`}>
                <MessageCircle size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-mist-900 truncate">{s.visitorName || s.visitorId.slice(0, 24)}</p>
                  <span className="text-xs text-mist-400 flex-shrink-0 ml-2">{formatRelative(s.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  {s.isPaused && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">Live</span>}
                  <p className="text-xs text-mist-500 truncate">{s.lastMessage || "No messages yet"}</p>
                </div>
              </div>
              <div className="text-xs text-mist-400 bg-mist-100 px-2 py-1 rounded flex-shrink-0">
                {s._count.messages}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
