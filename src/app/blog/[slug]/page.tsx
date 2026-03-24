import Link from "next/link"
import { FileText } from "lucide-react"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <div className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-sm text-[#dbb241] hover:underline mb-6 inline-block">Back to Blog</Link>

        <div className="h-64 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl flex items-center justify-center mb-8">
          <FileText size={48} className="text-gray-700" />
        </div>

        <p className="text-sm text-gray-500 mb-2">December 15, 2024 &bull; By Falcon Car Rental</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h1>

        <div className="prose prose-invert max-w-none space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-gray-400 leading-relaxed">
            This is placeholder content. In production, blog post content will be loaded from the database and rendered with proper formatting, images, and styling.
          </p>
        </div>
      </div>
    </div>
  )
}
