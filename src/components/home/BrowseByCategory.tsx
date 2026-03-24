import Link from "next/link"

const categories = [
  { name: "Supercar", slug: "supercar", desc: "High-performance exotic supercars" },
  { name: "Convertible", slug: "convertible", desc: "Open-top luxury convertibles" },
  { name: "SUV", slug: "suv", desc: "Luxury SUVs and crossovers" },
  { name: "Chauffeur", slug: "chauffeur", desc: "Premium chauffeur services" },
  { name: "EV", slug: "ev", desc: "Electric vehicles" },
  { name: "Coupe/Sports", slug: "coupe-sports", desc: "Sports coupes and performance cars" },
  { name: "Sedan", slug: "sedan", desc: "Luxury sedans and 4-door vehicles" },
  { name: "Ultra-Luxury", slug: "ultra-luxury", desc: "The most exclusive luxury vehicles" },
]

export default function BrowseByCategory() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by <span className="text-[#dbb241]">Category</span></h2>
          <div className="w-16 h-1 bg-[#dbb241] mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/cars?category=${cat.slug}`}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 text-center hover:border-[#dbb241] hover:shadow-[0_0_20px_rgba(219,178,65,0.1)] transition-all group"
            >
              <div className="w-10 h-10 bg-[#dbb241]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-[#dbb241] font-bold text-sm">{cat.name.charAt(0)}</span>
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-[#dbb241] transition-colors mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
