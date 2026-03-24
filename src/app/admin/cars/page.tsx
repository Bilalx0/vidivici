import Link from "next/link"

const sampleCars = [
  { id: "1", name: "Lamborghini Hurac\u00e1n EVO", brand: "Lamborghini", category: "Supercar", price: 1500, status: "Available" },
  { id: "2", name: "Ferrari 488 Spider", brand: "Ferrari", category: "Supercar", price: 1800, status: "Available" },
  { id: "3", name: "Rolls-Royce Cullinan", brand: "Rolls-Royce", category: "Ultra-Luxury", price: 2500, status: "Rented" },
  { id: "4", name: "Porsche 911 Turbo S", brand: "Porsche", category: "Coupe/Sports", price: 1200, status: "Available" },
  { id: "5", name: "Mercedes-AMG G63", brand: "Mercedes", category: "SUV", price: 1100, status: "Maintenance" },
  { id: "6", name: "Bentley Continental GT", brand: "Bentley", category: "Ultra-Luxury", price: 1400, status: "Available" },
]

export default function AdminCarsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Cars</h1>
        <Link href="/admin/cars/new" className="bg-black text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
          + Add New Car
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="px-6 py-3">Car</th>
                <th className="px-6 py-3">Brand</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price/Day</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleCars.map((car) => (
                <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">IMG</div>
                      <span className="text-sm font-medium text-gray-900">{car.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{car.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{car.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">${car.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      car.status === "Available" ? "bg-green-50 text-green-600" :
                      car.status === "Rented" ? "bg-blue-50 text-blue-600" :
                      "bg-orange-50 text-orange-600"
                    }`}>{car.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/cars/${car.id}/edit`} className="text-xs text-black font-medium hover:underline">Edit</Link>
                      <button className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
