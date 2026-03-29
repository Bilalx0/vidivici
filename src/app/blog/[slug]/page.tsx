import Link from "next/link"
import { Calendar, Clock, RefreshCw, ChevronRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  })

  if (!post) notFound()

  const readTime = post.content
    ? `${Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read`
    : "5 min read"

  const createdDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })
  const updatedDate = new Date(post.updatedAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })
  const showUpdated = post.updatedAt.getTime() - post.createdAt.getTime() > 86400000

  // Split content into paragraphs for rendering
  const paragraphs = post.content.split(/\n\n+/).filter(Boolean)

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-mist-400 mb-8">
          <Link href="/" className="hover:text-mist-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-mist-600 transition-colors">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-mist-600 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-mist-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-mist-400 mb-8">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {createdDate}
          </span>
          {showUpdated && (
            <span className="flex items-center gap-1.5">
              <RefreshCw size={14} />
              Updated {updatedDate}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {readTime}
          </span>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto max-h-[450px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          {paragraphs.map((para, i) => {
            // Handle headings
            if (para.startsWith("# ")) {
              return <h2 key={i} className="text-2xl font-bold text-mist-900 mt-8 mb-4">{para.slice(2)}</h2>
            }
            if (para.startsWith("## ")) {
              return <h3 key={i} className="text-xl font-bold text-mist-900 mt-6 mb-3">{para.slice(3)}</h3>
            }
            if (para.startsWith("### ")) {
              return <h4 key={i} className="text-lg font-semibold text-mist-900 mt-5 mb-2">{para.slice(4)}</h4>
            }
            // Handle lists
            if (para.match(/^[-*] /m)) {
              const items = para.split(/\n/).filter(Boolean).map((line) => line.replace(/^[-*] /, ""))
              return (
                <ul key={i} className="list-disc list-inside space-y-1 text-mist-600 leading-relaxed mb-4">
                  {items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )
            }
            return (
              <p key={i} className="text-mist-600 leading-relaxed mb-4">
                {para}
              </p>
            )
          })}
        </article>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-mist-100">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-mist-500 hover:text-mist-900 transition-colors">
            ← Back to all articles
          </Link>
        </div>
      </div>
    </div>
  )
}
