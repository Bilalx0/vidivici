"use client"

import { useState } from "react"

const brandsList = [
  { id: "1", name: "Rolls-Royce", description: "The pinnacle of luxury automotive engineering", cars: 3 },
  { id: "2", name: "Bentley", description: "Handcrafted luxury and performance", cars: 2 },
  { id: "3", name: "Lamborghini", description: "Italian supercar excellence", cars: 4 },
  { id: "4", name: "Ferrari", description: "The prancing horse of performance", cars: 3 },
  { id: "5", name: "McLaren", description: "Formula 1 technology for the road", cars: 2 },
  { id: "6", name: "Porsche", description: "German engineering perfection", cars: 3 },
  { id: "7", name: "Mercedes", description: "The best or nothing", cars: 4 },
  { id: "8", name: "BMW", description: "The ultimate driving machine", cars: 2 },
]

export default function AdminBrandsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Brands</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
          {showForm ? "Cancel" : "+ Add Brand"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Brand Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Logo (Upload)</label>
              <input type="file" accept="image/*" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Description</label>
              <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:border-black focus:outline-none resize-none" />
            </div>
          </div>
          <button className="mt-4 bg-black text-white px-6 py-2 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">Save Brand</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {brandsList.map((brand) => (
          <div key={brand.id} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-900 font-bold text-xl">
              {brand.name.charAt(0)}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{brand.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{brand.description}</p>
            <p className="text-xs text-gray-900 font-medium mb-3">{brand.cars} vehicles</p>
            <div className="flex justify-center gap-3">
              <button className="text-xs text-black font-medium hover:underline">Edit</button>
              <button className="text-xs text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
