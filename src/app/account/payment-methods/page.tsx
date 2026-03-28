"use client"

import { CreditCard, Plus } from "lucide-react"

export default function PaymentMethodsPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <button className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
          <Plus size={14} /> Add Card
        </button>
      </div>

      <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center">
        <CreditCard size={48} className="mx-auto text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">No payment methods</p>
        <p className="text-sm text-gray-400">Add a card to make bookings faster.</p>
        <p className="mt-6 text-xs text-gray-400">Payment integration coming soon.</p>
      </div>
    </div>
  )
}
