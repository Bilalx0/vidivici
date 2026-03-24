import Link from "next/link"
import { Car, CalendarDays, DollarSign, Key } from "lucide-react"

const stats = [
  { label: "Total Cars", value: "24", change: "+3 this month", icon: Car },
  { label: "Total Bookings", value: "156", change: "+12 this week", icon: CalendarDays },
  { label: "Revenue", value: "$284,500", change: "+18% vs last month", icon: DollarSign },
  { label: "Active Rentals", value: "8", change: "Currently out", icon: Key },
]

const recentBookings = [
  { id: "BK-001", customer: "James R.", car: "Lamborghini Hurac\u00e1n", date: "2024-12-15", total: "$4,500", status: "Confirmed" },
  { id: "BK-002", customer: "Sarah M.", car: "Rolls-Royce Cullinan", date: "2024-12-14", total: "$7,500", status: "Active" },
  { id: "BK-003", customer: "Michael T.", car: "Ferrari 488 Spider", date: "2024-12-13", total: "$5,400", status: "Completed" },
  { id: "BK-004", customer: "Emily K.", car: "Porsche 911 Turbo S", date: "2024-12-12", total: "$3,600", status: "Pending" },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon size={18} className="text-gray-600" />
                </div>
                <span className="text-xs text-gray-400">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 mb-10">
        <Link href="/admin/cars/new" className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">+ Add Car</Link>
        <Link href="/admin/messages" className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm hover:border-gray-400 transition-colors">View Messages</Link>
        <Link href="/admin/blog/new" className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm hover:border-gray-400 transition-colors">New Blog Post</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Car</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{b.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.car}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{b.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      b.status === "Confirmed" ? "bg-blue-50 text-blue-600" :
                      b.status === "Active" ? "bg-green-50 text-green-600" :
                      b.status === "Completed" ? "bg-gray-100 text-gray-600" :
                      "bg-yellow-50 text-yellow-600"
                    }`}>{b.status}</span>
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
