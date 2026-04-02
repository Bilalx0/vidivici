"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, CreditCard } from "lucide-react"

interface SavedCard {
  id: string
  last4: string
  brand: string
  expiry: string
  name: string
}

export default function PaymentMethodsPage() {
  const [showForm, setShowForm] = useState(false)
  const [cards, setCards] = useState<SavedCard[]>([])

  const [name, setName]           = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry]       = useState("")
  const [cvv, setCvv]             = useState("")
  const [address, setAddress]     = useState("")
  const [country, setCountry]     = useState("United States")
  const [zip, setZip]             = useState("")

  const resetForm = () => {
    setName(""); setCardNumber(""); setExpiry(""); setCvv("")
    setAddress(""); setCountry("United States"); setZip("")
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const last4 = cardNumber.replace(/\s/g, "").slice(-4)
    setCards((prev) => [...prev, { id: Date.now().toString(), last4, brand: "Visa", expiry, name }])
    resetForm()
  }

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4)
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  return (
    <div className="overflow-hidden">

      {/* ── Heading ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 2xl:px-10 py-10 sm:py-12 2xl:py-16 border-b-2 border-mist-300 font-medium flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900">Payment Method</h1>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="my-8 sm:my-12 2xl:my-16 p-4 sm:p-6 2xl:p-8 mx-4 sm:mx-6 lg:mx-10 2xl:mx-14 bg-white rounded-2xl shadow-xl border border-mist-200">

        {!showForm ? (
          /* ── Cards grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 2xl:gap-5">
            {cards.map((card) => (
              <div key={card.id} className="aspect-[1.6/1] bg-mist-900 rounded-2xl p-5 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-mist-400 uppercase tracking-widest">{card.brand}</span>
                  <CreditCard size={20} className="text-mist-400" />
                </div>
                <div>
                  <p className="text-sm tracking-widest">•••• •••• •••• {card.last4}</p>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-mist-400">{card.name}</p>
                    <p className="text-xs text-mist-400">{card.expiry}</p>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowForm(true)}
              className="px-10 py-20 border-2 border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-blue-50/50 transition-colors group"
            >
              <Plus size={28} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-blue-500">Add Card</span>
            </button>
          </div>

        ) : (
          /* ── Inline Add Card Form ── */
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Card Info */}
            <div>
              <h2 className="text-xl font-bold text-mist-900 mb-5">Card Info</h2>
              <div className="mb-4">
                <label className="text-xs font-medium text-mist-500 block mb-1.5">Name on card</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Name on card" required
                  className="w-full border border-mist-200 rounded-xl px-4 py-3 text-sm text-mist-700 placeholder-mist-300 focus:border-mist-400 focus:outline-none transition"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Card number</label>
                  <div className="relative">
                    <input
                      type="text" value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 1234 1234 1234" required
                      className="w-full border border-mist-200 rounded-xl pl-9 pr-4 py-3 text-sm text-mist-700 placeholder-mist-300 focus:border-mist-400 focus:outline-none transition"
                    />
                    <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-300" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Expiration date</label>
                  <input
                    type="text" value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY" required
                    className="w-full border border-mist-200 rounded-xl px-4 py-3 text-sm text-mist-700 placeholder-mist-300 focus:border-mist-400 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Security code</label>
                  <div className="relative">
                    <input
                      type="password" value={cvv}
                      onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                      placeholder="CVV" required
                      className="w-full border border-mist-200 rounded-xl px-4 py-3 text-sm text-mist-700 placeholder-mist-300 focus:border-mist-400 focus:outline-none transition pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-4 bg-mist-200 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-mist-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h2 className="text-xl font-bold text-mist-900 mb-5">Billing Address</h2>
              <div className="mb-4">
                <label className="text-xs font-medium text-mist-500 block mb-1.5">Billing address</label>
                <input
                  type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter billing address" required
                  className="w-full border border-mist-200 rounded-xl px-4 py-3 text-sm text-mist-700 placeholder-mist-300 focus:border-mist-400 focus:outline-none transition"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Country</label>
                  <select
                    value={country} onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-mist-200 rounded-xl px-4 py-3 text-sm text-mist-700 focus:border-mist-400 focus:outline-none transition bg-white"
                  >
                    {["United States","United Kingdom","Canada","Australia","Germany","France","Other"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-mist-500 block mb-1.5">Zip code</label>
                  <input
                    type="text" value={zip} onChange={(e) => setZip(e.target.value)}
                    placeholder="Zip code" required
                    className="w-full border border-mist-200 rounded-xl px-4 py-3 text-sm text-mist-700 placeholder-mist-300 focus:border-mist-400 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-mist-400 leading-relaxed">
              By adding the card, I agree to the{" "}
              <Link href="/terms" className="text-blue-500 hover:underline">Terms & Conditions</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
            </p>

            {/* Footer: buttons + payment icons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-1">
              <div className="flex items-center gap-3">
                <button type="submit" className="bg-mist-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-mist-700 transition-colors">
                  Add Card
                </button>
                <button type="button" onClick={resetForm} className="text-sm text-mist-600 border border-mist-200 px-6 py-3 rounded-xl hover:bg-mist-50 transition-colors">
                  Cancel
                </button>
              </div>

              {/* Payment icons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center justify-center h-7 px-2.5 bg-white border border-mist-200 rounded-md">
                  <span className="text-[#1A1F71] text-xs font-black tracking-tight">VISA</span>
                </div>
                <div className="flex items-center justify-center h-7 px-2 bg-white border border-mist-200 rounded-md">
                  <span className="text-[#003087] text-[10px] font-bold">Pay</span>
                  <span className="text-[#009CDE] text-[10px] font-bold">Pal</span>
                </div>
                <div className="flex items-center justify-center h-7 px-2.5 bg-[#5a31f4] rounded-md">
                  <span className="text-white text-[10px] font-bold tracking-tight">shop</span>
                </div>
                <div className="flex items-center justify-center h-7 px-2 bg-white border border-mist-200 rounded-md gap-0.5">
                  <span className="text-[#4285F4] text-[10px] font-semibold">G</span>
                  <span className="text-[#5F6368] text-[10px] font-semibold">Pay</span>
                </div>
                <div className="flex items-center justify-center h-7 w-10 bg-white border border-mist-200 rounded-md">
                  <div className="flex -space-x-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#EB001B]" />
                    <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90" />
                  </div>
                </div>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}