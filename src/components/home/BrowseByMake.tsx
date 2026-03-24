import Link from "next/link"

const brands = [
  { name: "Rolls-Royce", slug: "rolls-royce" },
  { name: "Bentley", slug: "bentley" },
  { name: "Aston Martin", slug: "aston-martin" },
  { name: "Lamborghini", slug: "lamborghini" },
  { name: "Ferrari", slug: "ferrari" },
  { name: "McLaren", slug: "mclaren" },
  { name: "Porsche", slug: "porsche" },
  { name: "Mercedes", slug: "mercedes" },
  { name: "BMW", slug: "bmw" },
  { name: "Range Rover", slug: "range-rover" },
  { name: "Cadillac", slug: "cadillac" },
  { name: "Corvette", slug: "corvette" },
  { name: "Tesla", slug: "tesla" },
  { name: "Audi", slug: "audi" },
  { name: "Rivian", slug: "rivian" },
  { name: "Hummer", slug: "hummer" },
]

export default function BrowseByMake() {
  return (
    <section className="py-20 px-4 bg-[#111]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by <span className="text-[#dbb241]">Make</span></h2>
          <div className="w-16 h-1 bg-[#dbb241] mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/cars?brand=${brand.slug}`}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 text-center hover:border-[#dbb241] hover:shadow-[0_0_15px_rgba(219,178,65,0.1)] transition-all group"
            >
              <div className="w-12 h-12 bg-[#2a2a2a] rounded-full mx-auto mb-3 flex items-center justify-center text-[#dbb241] font-bold text-sm group-hover:bg-[#dbb241]/10 transition-colors">
                {brand.name.charAt(0)}
              </div>
              <p className="text-xs text-gray-300 group-hover:text-[#dbb241] transition-colors">{brand.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
