import Link from "next/link"
import { Calendar, Clock, RefreshCw, ChevronRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Contact from "@/components/home/Contact"

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

  const featuredPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      category: true,
      createdAt: true,
    },
  })

  // Split content into paragraphs for rendering
  const paragraphs = post.content.split(/\n\n+/).filter(Boolean)

  return (
    <div className="bg-white min-h-screen w-full">
      <section className="w-full px-6 sm:px-16 lg:px-20 2xl:px-38 pt-24 2xl:pt-32 pb-16 2xl:pb-28">
        <div className="">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm 2xl
        
        
        
        
        text-mist-400 mb-6 2xl:mb-10">
          <Link href="/" className="hover:text-mist-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-mist-600 transition-colors">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-mist-600 truncate max-w-60 sm:max-w-90">{post.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight tracking-tight mb-4 2xl:mb-6">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm 2xl:text-xl text-mist-400 mb-8 2xl:mb-12">
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
          <div className="rounded-2xl 2xl:rounded-3xl overflow-hidden mb-10 2xl:mb-14">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto max-h-130 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="max-w-none">
          {paragraphs.map((para, i) => {
            // Handle headings
            if (para.startsWith("# ")) {
              return <h2 key={i} className="text-2xl sm:text-3xl 2xl:text-5xl font-bold text-mist-900 mt-9 2xl:mt-14 mb-4 2xl:mb-6 leading-tight">{para.slice(2)}</h2>
            }
            if (para.startsWith("## ")) {
              return <h3 key={i} className="text-xl sm:text-2xl 2xl:text-4xl font-bold text-mist-900 mt-7 2xl:mt-12 mb-3 2xl:mb-5 leading-tight">{para.slice(3)}</h3>
            }
            if (para.startsWith("### ")) {
              return <h4 key={i} className="text-lg sm:text-xl 2xl:text-3xl font-semibold text-mist-900 mt-6 2xl:mt-10 mb-2 2xl:mb-4 leading-tight">{para.slice(4)}</h4>
            }
            // Handle lists
            if (para.match(/^[-*] /m)) {
              const items = para.split(/\n/).filter(Boolean).map((line) => line.replace(/^[-*] /, ""))
              return (
                <ul key={i} className="list-disc list-inside space-y-1.5 text-mist-600 text-base sm:text-lg 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                  {items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )
            }
            return (
              <p key={i} className="text-mist-600 text-base sm:text-lg 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                {para}
              </p>
            )
          })}
        </article>

        {featuredPosts.length > 0 && (
          <section className="mt-14 2xl:mt-24 pt-10 2xl:pt-14 border-t border-mist-100">
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 tracking-tight mb-8 2xl:mb-12">
              Featured Articles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 2xl:gap-8">
              {featuredPosts.map((item) => {
                const cardReadTime = item.content
                  ? `${Math.max(1, Math.ceil(item.content.split(/\s+/).length / 200))} min read`
                  : "5 min read"
                const cardDate = new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })

                return (
                  <Link
                    key={item.id}
                    href={`/blog/${item.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-mist-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="h-44 2xl:h-56 overflow-hidden">
                      <img
                        src={item.coverImage || "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col gap-3 p-4 2xl:p-6 flex-1">
                      <span className="w-fit text-[11px] 2xl:text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {item.category || "News & Updates"}
                      </span>

                      <h3 className="text-[15px] 2xl:text-2xl font-bold text-mist-900 leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-[12.5px] 2xl:text-xl text-mist-400 leading-relaxed line-clamp-3 flex-1">
                        {item.excerpt || "Explore this article for luxury insights and travel inspiration."}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-mist-100 mt-auto">
                        <div className="flex items-center gap-3 text-[11px] 2xl:text-base text-mist-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} /> {cardDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {cardReadTime}
                          </span>
                        </div>
                        <span className="flex items-center gap-0.5 text-[12px] 2xl:text-lg font-semibold text-mist-700 group-hover:text-mist-900 transition-colors">
                          Read More <ChevronRight size={13} strokeWidth={2.5} />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-12 2xl:mt-16 pt-8 2xl:pt-10 border-t border-mist-100">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm 2xl:text-xl font-medium text-mist-500 hover:text-mist-900 transition-colors">
            ← Back to all articles
          </Link>
        </div>
        </div>
      </section>
      <Contact />
    </div>
  )
}
