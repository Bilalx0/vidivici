import Link from "next/link"
import { FileText } from "lucide-react"

const samplePosts = [
  { title: "Wrap Up Winter in Style: The Best Luxury Winter Road Trips from Los Angeles", slug: "luxury-winter-road-trips-la", excerpt: "Discover the most scenic winter driving routes from LA in a luxury exotic car.", date: "2024-12-15" },
  { title: "Lamborghini Urus S vs Urus SE: What's the Real Difference?", slug: "lamborghini-urus-s-vs-se", excerpt: "A detailed comparison of Lamborghini's two flagship SUV variants.", date: "2024-12-01" },
  { title: "The FALCON Difference: What Sets Falcon Car Rental Apart", slug: "falcon-difference", excerpt: "Learn why Falcon Car Rental is the premier choice for exotic car rentals in LA.", date: "2024-11-20" },
  { title: "5 Exotic Cars That Depreciated the Least in 2024", slug: "exotic-cars-least-depreciation-2024", excerpt: "Which exotic cars held their value best? Here are the top 5 performers.", date: "2024-11-10" },
]

export default function BlogPage() {
  return (
    <div>
      <section className="py-16 px-4 bg-gradient-to-b from-[#111] to-[#0a0a0a] text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Falcon <span className="text-[#dbb241]">Lifestyle Blog</span></h1>
        <p className="text-gray-400">News, tips, and stories from the world of exotic cars</p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {samplePosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#dbb241]/50 transition-all group">
              <div className="h-48 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
                <FileText size={32} className="text-gray-700" />
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-500 mb-2">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                <h2 className="text-lg font-semibold text-white group-hover:text-[#dbb241] transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-gray-400 mb-4">{post.excerpt}</p>
                <span className="text-sm text-[#dbb241] font-medium">Read More</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-12">
          <button className="bg-[#dbb241] text-black w-10 h-10 rounded font-semibold text-sm">1</button>
          <button className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 w-10 h-10 rounded text-sm hover:border-[#dbb241]">2</button>
        </div>
      </section>
    </div>
  )
}
