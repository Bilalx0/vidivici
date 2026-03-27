"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
}

export default function AdminFAQsPage() {
  const [showForm, setShowForm] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [order, setOrder] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setFaqs(data)
    } catch {
      toast.error("Failed to load FAQs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFaqs() }, [])

  const resetForm = () => {
    setQuestion("")
    setAnswer("")
    setOrder(0)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required")
      return
    }
    try {
      const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs"
      const method = editingId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, order }),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success(editingId ? "FAQ updated" : "FAQ created")
      resetForm()
      fetchFaqs()
    } catch {
      toast.error("Failed to save FAQ")
    }
  }

  const handleEdit = (faq: FAQ) => {
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setOrder(faq.order)
    setEditingId(faq.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("FAQ deleted")
      fetchFaqs()
    } catch {
      toast.error("Failed to delete FAQ")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage FAQs</h1>
        <button onClick={() => { if (showForm && editingId) { resetForm() } else { setShowForm(!showForm) } }} className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
          {showForm ? "Cancel" : "+ Add FAQ"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Question</label>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Answer</label>
            <textarea rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Order</label>
            <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-32 bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
          </div>
          <button onClick={handleSubmit} className="bg-black text-white px-6 py-2 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">Save FAQ</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading FAQs...</div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
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
                  <button onClick={() => handleEdit(faq)} className="text-xs text-black font-medium hover:underline">Edit</button>
                  <button onClick={() => handleDelete(faq.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
