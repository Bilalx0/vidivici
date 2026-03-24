"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setSuccess(true)
      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch {
      setError("Failed to send message. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <section className="py-16 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a] text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact <span className="text-[#dbb241]">Us</span></h1>
        <p className="text-gray-400">Get in touch with our team</p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            {success && <p className="text-green-400 bg-green-400/10 p-4 rounded mb-6">Message sent successfully! We&apos;ll get back to you soon.</p>}
            {error && <p className="text-red-400 bg-red-400/10 p-4 rounded mb-6">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Full Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Email *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Subject</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Message *</label>
                <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white px-4 py-3 rounded focus:border-[#dbb241] focus:outline-none resize-none" />
              </div>
              <button type="submit" disabled={submitting}
                className="bg-[#dbb241] text-black px-8 py-3 rounded font-semibold hover:bg-[#c9a238] transition-colors disabled:opacity-50">
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            {[
              { icon: MapPin, title: "Address", content: "499 N Canon Dr, Beverly Hills, CA 90210" },
              { icon: Phone, title: "Phone", content: "+1-310-887-7005" },
              { icon: Mail, title: "Email", content: "info@falconcarrental.com" },
              { icon: Clock, title: "Business Hours", content: "Mon-Fri: 8am - 8pm\nSat-Sun: 8am - 6pm" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex gap-4">
                  <div className="w-10 h-10 bg-[#dbb241]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#dbb241]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#dbb241] mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
