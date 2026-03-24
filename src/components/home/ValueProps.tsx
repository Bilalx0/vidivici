import { Truck, Sparkles, Eye } from "lucide-react"

const props = [
  {
    icon: Truck,
    title: "Convenience",
    description: "No counter, no long lines. We deliver the car to you at the airport, home, or hotel.",
  },
  {
    icon: Sparkles,
    title: "Quality",
    description: "Always extra clean, always in top condition. Every car is meticulously maintained.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "No hidden fees, transparent pricing & ready to roll. What you see is what you pay.",
  },
]

export default function ValueProps() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {props.map((prop) => {
            const Icon = prop.icon
            return (
              <div
                key={prop.title}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-center hover:border-[#dbb241]/30 transition-colors"
              >
                <div className="w-12 h-12 bg-[#dbb241]/10 rounded-lg flex items-center justify-center mx-auto mb-5">
                  <Icon size={22} className="text-[#dbb241]" />
                </div>
                <h3 className="text-xl font-semibold text-[#dbb241] mb-3">{prop.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{prop.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
