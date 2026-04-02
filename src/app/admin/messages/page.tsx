"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export default function AdminMessagesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setMessages(data)
    } catch {
      toast.error("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const toggleRead = async (msg: Message) => {
    try {
      const res = await fetch(`/api/contact/${msg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !msg.isRead }),
      })
      if (!res.ok) throw new Error("Failed to update")
      toast.success(msg.isRead ? "Marked as unread" : "Marked as read")
      fetchMessages()
    } catch {
      toast.error("Failed to update message")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Message deleted")
      fetchMessages()
    } catch {
      toast.error("Failed to delete message")
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Contact Messages</h1>
        <span className="text-sm text-mist-500">{messages.filter(m => !m.isRead).length} unread</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-mist-500">Loading messages...</div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-white border rounded-xl overflow-hidden ${msg.isRead ? "border-mist-200" : "border-black/20"}`}>
              <button onClick={() => setExpanded(expanded === msg.id ? null : msg.id)} className="w-full p-5 text-left flex items-center gap-4">
                {!msg.isRead && <div className="w-2 h-2 bg-black rounded-full flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-mist-900">{msg.name} <span className="text-mist-400 font-normal">-- {msg.subject || "No Subject"}</span></p>
                    <span className="text-xs text-mist-400 ml-4 flex-shrink-0">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-xs text-mist-500 truncate">{msg.message}</p>
                </div>
              </button>
              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-mist-200 pt-4">
                  <div className="flex gap-4 mb-3 text-xs text-mist-500">
                    <span>From: {msg.email}</span>
                    <span>Date: {formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-sm text-mist-600 mb-4">{msg.message}</p>
                  <div className="flex gap-2">
                    <a href={`mailto:${msg.email}`} className="text-xs bg-black text-white px-4 py-1.5 rounded font-medium hover:bg-mist-800 transition-colors">Reply via Email</a>
                    <button onClick={() => toggleRead(msg)} className="text-xs text-mist-500 hover:text-mist-900 transition-colors">{msg.isRead ? "Mark Unread" : "Mark Read"}</button>
                    <button onClick={() => handleDelete(msg.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
