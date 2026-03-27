"use client"

import { useState } from "react"

const initialCategories = [
  { id: "1", name: "Supercar", slug: "supercar", description: "High-performance exotic supercars", cars: 8 },
  { id: "2", name: "Convertible", slug: "convertible", description: "Open-top luxury convertibles", cars: 5 },
  { id: "3", name: "SUV", slug: "suv", description: "Luxury SUVs and crossovers", cars: 6 },
  { id: "4", name: "Chauffeur", slug: "chauffeur", description: "Premium chauffeur services", cars: 3 },
  { id: "5", name: "EV", slug: "ev", description: "Electric vehicles", cars: 4 },
  { id: "6", name: "Coupe/Sports", slug: "coupe-sports", description: "Sports coupes", cars: 5 },
  { id: "7", name: "Sedan", slug: "sedan", description: "Luxury sedans", cars: 3 },
  { id: "8", name: "Ultra-Luxury", slug: "ultra-luxury", description: "The most exclusive vehicles", cars: 4 },
]

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mist-500 block mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-mist-500 block mb-1">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-mist-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
          </div>
          <button className="mt-4 bg-black text-white px-6 py-2 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">Save Category</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialCategories.map((cat) => (
          <div key={cat.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-mist-900 mb-1">{cat.name}</h3>
            <p className="text-sm text-mist-500 mb-3">{cat.description}</p>
            <p className="text-xs text-mist-900 font-medium mb-4">{cat.cars} vehicles</p>
            <div className="flex gap-2">
              <button className="text-xs text-black font-medium hover:underline">Edit</button>
              <button className="text-xs text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
