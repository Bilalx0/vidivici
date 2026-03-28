"use client"

import { useState } from "react"
import { CreditCard, Plus, X } from "lucide-react"

export default function PaymentMethodsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nameOnCard: "", cardNumber: "", expiry: "", cvv: "",
    billingAddress: "", country: "United States", zipCode: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder — payment integration coming later
    setShowForm(false)
    setForm({ nameOnCard: "", cardNumber: "", expiry: "", cvv: "", billingAddress: "", country: "United States", zipCode: "" })
  }

  const inputCls = "w-full px-3 py-2.5 rounded-lg text-sm border border-gray-200 bg-white text-mist-900 placeholder:text-mist-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-mist-900">Payment Methods</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
          >
            <Plus size={14} /> Add Card
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit}>
          {/* Card Info */}
          <h2 className="text-lg font-bold text-mist-900 mb-4">Card Info</h2>

          <div className="mb-4">
            <label className="text-sm font-medium text-mist-700 mb-1.5 block">Name on card</label>
            <input
              type="text"
              placeholder="Name on card"
              value={form.nameOnCard}
              onChange={(e) => setForm({ ...form, nameOnCard: e.target.value })}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-mist-700 mb-1.5 block">Card number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 1234 1234 1234"
                  value={form.cardNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16)
                    setForm({ ...form, cardNumber: v.replace(/(.{4})/g, "$1 ").trim() })
                  }}
                  className={`${inputCls} pl-10`}
                />
                <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-mist-700 mb-1.5 block">Expiration date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 4)
                  if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2)
                  setForm({ ...form, expiry: v })
                }}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-mist-700 mb-1.5 block">Security code</label>
              <input
                type="text"
                placeholder="CVV"
                value={form.cvv}
                onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                className={inputCls}
              />
            </div>
          </div>

          {/* Billing Address */}
          <h2 className="text-lg font-bold text-mist-900 mb-4">Billing Address</h2>

          <div className="mb-4">
            <label className="text-sm font-medium text-mist-700 mb-1.5 block">Billing address</label>
            <input
              type="text"
              placeholder="Enter billing address"
              value={form.billingAddress}
              onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-mist-700 mb-1.5 block">Country</label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className={inputCls}
              >
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-mist-700 mb-1.5 block">Zip code</label>
              <input
                type="text"
                placeholder="Zip code"
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <p className="text-xs text-mist-500 mb-6">
            By adding the card, I agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">Terms &amp; Conditions</a>{" "}
            and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
              >
                Add Card
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-200 text-mist-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:border-gray-400 transition"
              >
                Cancel
              </button>
            </div>
            {/* Card brand logos */}
            <div className="hidden sm:flex items-center gap-2">
              {["VISA", "PayPal", "Shop", "GPay", "MC"].map((b) => (
                <span key={b} className="text-[10px] font-bold text-mist-400 border border-gray-200 rounded px-2 py-1">{b}</span>
              ))}
            </div>
          </div>
        </form>
      ) : (
        <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center">
          <CreditCard size={48} className="mx-auto text-mist-300" />
          <p className="mt-4 text-lg font-medium text-mist-500">No payment methods</p>
          <p className="text-sm text-mist-400">Add a card to make bookings faster.</p>
        </div>
      )}
    </div>
  )
}
