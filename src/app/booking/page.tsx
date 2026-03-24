import Link from "next/link"
import { ImageOff } from "lucide-react"

const sampleBookings = [
  { id: "BK-001", car: "Lamborghini Huracán EVO", startDate: "2024-12-15", endDate: "2024-12-18", total: 4500, status: "Confirmed", payment: "Paid" },
  { id: "BK-002", car: "Ferrari 488 Spider", startDate: "2024-11-20", endDate: "2024-11-23", total: 5400, status: "Completed", payment: "Paid" },
  { id: "BK-003", car: "Porsche 911 Turbo S", startDate: "2024-12-25", endDate: "2024-12-28", total: 3600, status: "Pending", payment: "Unpaid" },
]

export default function BookingsPage() {
  return (
    <div className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My <span className="text-[#dbb241]">Bookings</span></h1>

        {sampleBookings.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
            <p className="text-gray-400 mb-4">You haven&apos;t made any bookings yet.</p>
            <Link href="/cars" className="bg-[#dbb241] text-black px-6 py-2.5 rounded font-semibold hover:bg-[#c9a238] transition-colors inline-block">Browse Cars</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sampleBookings.map((booking) => (
              <div key={booking.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-20 h-16 bg-[#2a2a2a] rounded flex items-center justify-center flex-shrink-0"><ImageOff size={20} className="text-gray-600" /></div>
                <div className="flex-1">
                  <p className="text-xs text-[#dbb241] mb-1">{booking.id}</p>
                  <h3 className="text-base font-semibold">{booking.car}</h3>
                  <p className="text-sm text-gray-400">{booking.startDate} - {booking.endDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#dbb241]">${booking.total.toLocaleString()}</p>
                  <div className="flex gap-2 justify-end mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      booking.status === "Confirmed" ? "bg-blue-500/10 text-blue-400" :
                      booking.status === "Completed" ? "bg-green-500/10 text-green-400" :
                      "bg-yellow-500/10 text-yellow-400"
                    }`}>{booking.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      booking.payment === "Paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>{booking.payment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
