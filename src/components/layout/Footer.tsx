import Link from "next/link"

const brands = [
  { name: "Rolls-Royce", slug: "rolls-royce" }, { name: "Bentley", slug: "bentley" },
  { name: "Aston Martin", slug: "aston-martin" }, { name: "Lamborghini", slug: "lamborghini" },
  { name: "Ferrari", slug: "ferrari" }, { name: "McLaren", slug: "mclaren" },
  { name: "Porsche", slug: "porsche" }, { name: "Mercedes", slug: "mercedes" },
  { name: "BMW", slug: "bmw" }, { name: "Range Rover", slug: "range-rover" },
  { name: "Cadillac", slug: "cadillac" }, { name: "Corvette", slug: "corvette" },
  { name: "Tesla", slug: "tesla" }, { name: "Audi", slug: "audi" },
  { name: "Rivian", slug: "rivian" }, { name: "Hummer", slug: "hummer" },
]

const categories = [
  { name: "Supercar", slug: "supercar" }, { name: "Convertible", slug: "convertible" },
  { name: "SUV", slug: "suv" }, { name: "Chauffeur", slug: "chauffeur" },
  { name: "EV", slug: "ev" }, { name: "Coupe/Sports", slug: "coupe-sports" },
  { name: "Sedan", slug: "sedan" }, { name: "Ultra-Luxury", slug: "ultra-luxury" },
]

export default function Footer() {
  return (
    <footer className="bg-[#111] border-t border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-[#dbb241] tracking-wider mb-4">FALCON</h3>
            <p className="text-sm text-gray-400 mb-4">Premium luxury & exotic car rental in Los Angeles and Miami.</p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>499 N Canon Dr, Beverly Hills, CA 90210</p>
              <p>+1-310-887-7005</p>
              <p>info@falconcarrental.com</p>
              <p className="mt-3">Mon-Fri: 8am - 8pm</p>
              <p>Sat-Sun: 8am - 6pm</p>
            </div>
            {/* Social */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-[#dbb241] transition-colors text-sm">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-[#dbb241] transition-colors text-sm">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-[#dbb241] transition-colors text-sm">YouTube</a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[#dbb241] font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/faqs" className="text-sm text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">Reserve Now</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Rental Types */}
          <div>
            <h4 className="text-[#dbb241] font-semibold mb-4 text-sm uppercase tracking-wider">Rental Types</h4>
            <ul className="space-y-2">
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">One Day Rental</Link></li>
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">High End Rental</Link></li>
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">Long Term Rental</Link></li>
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">Luxury Rental</Link></li>
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">Weddings</Link></li>
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">Proms</Link></li>
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">Production</Link></li>
              <li><Link href="/cars" className="text-sm text-gray-400 hover:text-white transition-colors">One-way Rental</Link></li>
            </ul>
          </div>

          {/* Makes */}
          <div>
            <h4 className="text-[#dbb241] font-semibold mb-4 text-sm uppercase tracking-wider">Makes</h4>
            <ul className="space-y-2">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/cars?brand=${b.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">{b.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[#dbb241] font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/cars?category=${c.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2a2a2a] py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">&copy; 2024 Falcon Car Rental. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
