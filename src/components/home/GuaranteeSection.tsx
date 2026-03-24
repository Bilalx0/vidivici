import { DollarSign, Headphones, RotateCcw, MapPin, Shield } from "lucide-react"

const guarantees = [
  { icon: DollarSign, title: "Best Price Guarantee", desc: "Competitive pricing with no hidden charges" },
  { icon: Headphones, title: "24/7 Customer Support", desc: "Round the clock assistance whenever you need" },
  { icon: RotateCcw, title: "Free Cancellation", desc: "Cancel within 24 hours at no cost" },
  { icon: MapPin, title: "Flexible Delivery & Pickup", desc: "We deliver anywhere in the greater LA area" },
  { icon: Shield, title: "Premium Insurance Options", desc: "Comprehensive coverage for peace of mind" },
]

export default function GuaranteeSection() {
  return (
    <section className="py-20 px-4 bg-[#111]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-[#dbb241]">Guarantee</span></h2>
          <div className="w-16 h-1 bg-[#dbb241] mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {guarantees.map((g) => {
            const Icon = g.icon
            return (
              <div key={g.title} className="text-center p-6">
                <div className="w-12 h-12 bg-[#dbb241]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-[#dbb241]" />
                </div>
                <h3 className="text-sm font-semibold text-[#dbb241] mb-2">{g.title}</h3>
                <p className="text-xs text-gray-500">{g.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
