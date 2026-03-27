const bookings = [
  { id: "BK-001", customer: "James R.", email: "james@email.com", car: "Lamborghini Hurac\u00e1n EVO", dates: "Dec 15-18, 2024", total: "$4,500", status: "Confirmed", payment: "Paid" },
  { id: "BK-002", customer: "Sarah M.", email: "sarah@email.com", car: "Rolls-Royce Cullinan", dates: "Dec 14-17, 2024", total: "$7,500", status: "Active", payment: "Paid" },
  { id: "BK-003", customer: "Michael T.", email: "michael@email.com", car: "Ferrari 488 Spider", dates: "Dec 10-13, 2024", total: "$5,400", status: "Completed", payment: "Paid" },
  { id: "BK-004", customer: "Emily K.", email: "emily@email.com", car: "Porsche 911 Turbo S", dates: "Dec 20-23, 2024", total: "$3,600", status: "Pending", payment: "Unpaid" },
  { id: "BK-005", customer: "David L.", email: "david@email.com", car: "Mercedes-AMG G63", dates: "Dec 22-25, 2024", total: "$3,300", status: "Cancelled", payment: "Refunded" },
]

export default function AdminBookingsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-mist-900">Manage Bookings</h1>
        <select className="bg-white border border-gray-200 text-mist-900 text-sm px-3 py-2 rounded focus:border-black focus:outline-none">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-mist-500 border-b border-gray-200">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Car</th>
                <th className="px-6 py-3">Dates</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-mist-900">{b.id}</td>
                  <td className="px-6 py-4"><p className="text-sm text-mist-900">{b.customer}</p><p className="text-xs text-mist-400">{b.email}</p></td>
                  <td className="px-6 py-4 text-sm text-mist-600">{b.car}</td>
                  <td className="px-6 py-4 text-sm text-mist-500">{b.dates}</td>
                  <td className="px-6 py-4 text-sm font-medium text-mist-900">{b.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      b.status === "Confirmed" ? "bg-blue-50 text-blue-600" :
                      b.status === "Active" ? "bg-green-50 text-green-600" :
                      b.status === "Completed" ? "bg-gray-100 text-mist-600" :
                      b.status === "Cancelled" ? "bg-red-50 text-red-600" :
                      "bg-yellow-50 text-yellow-600"
                    }`}>{b.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      b.payment === "Paid" ? "bg-green-50 text-green-600" :
                      b.payment === "Refunded" ? "bg-purple-50 text-purple-600" :
                      "bg-yellow-50 text-yellow-600"
                    }`}>{b.payment}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs text-black font-medium hover:underline">View</button>
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
