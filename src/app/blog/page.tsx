"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Banner from "@/components/ui/Banner";
import ArticleCard, { Article } from "@/components/ui/ArticleCard";

type BlogCategory = "All" | "Exotic Cars" | "Luxury Villas" | "Events" | "Lifestyle & Travel" | "News & Updates";

const categories: BlogCategory[] = [
  "All", "Exotic Cars", "Luxury Villas", "Events", "Lifestyle & Travel", "News & Updates",
];

const FEATURED_LIMIT = 3;
const PAGE_SIZE = 6;

export default function BlogPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");
  const [search, setSearch] = useState("");
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---- Fetch featured articles (latest 3) ---- */
  useEffect(() => {
    fetch(`/api/blog?limit=${FEATURED_LIMIT}&featured=1`)
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((data) => {
        setFeaturedArticles(
          (data.posts || []).map((p: any) => mapPost(p))
        );
      })
      .catch(() => {});
  }, []);

  /* ---- Fetch articles with filters ---- */
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (search) params.set("search", search);

    fetch(`/api/blog?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { posts: [], total: 0 }))
      .then((data) => {
        const mapped = (data.posts || []).map((p: any) => mapPost(p));
        if (page === 1) {
          setAllArticles(mapped);
        } else {
          setAllArticles((prev) => [...prev, ...mapped]);
        }
        setHasMore(page < (data.pages || 1));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory, search, page]);

  const handleCategoryChange = (cat: BlogCategory) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const navigateToPost = (article: Article) => {
    router.push(`/blog/${article.slug}`);
  };

  return (
    <div className="w-full">
      {/* Banner */}
      <Banner
        heading="Blogs"
        description="Explore exclusive tips, travel inspiration, and the world of luxury living with Vidi Vici."
        image="/banner4.png"
        height="h-96"
        overlay="bg-bold/55"
        searchBar={{
          placeholder: "Search articles...",
          onSearch: handleSearch,
        }}
      />
      <div className="bg-[#f7f7f8]">

      {/* Category filters */}
      <div className="w-full ">
        <div className="w-full mx-auto bg-white py-4 2xl:py-10 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 2xl:px-6 py-2 2xl:py-3 rounded-lg 2xl:rounded-xl text-[12.5px] 2xl:text-xl transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-mist-900 text-white"
                  : "bg-mist-100 border border-mist-100 text-mist-600 hover:border-mist-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="w-full pt-14 2xl:pt-28 sm:px-16 lg:px-20 px-6 2xl:px-40">
          <h2 className="text-3xl sm:text-4xl 2xl:text-6xl  font-bold text-mist-900 text-center tracking-tight mb-10 2xl:mb-16">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-10 2xl:max-w-[1800px] 2xl:mx-auto">
            {featuredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onReadMore={navigateToPost}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className={`w-full py-14 2xl:py-28 sm:px-16 lg:px-20 px-6 2xl:px-40`}>
        <h2 className="text-3xl sm:text-4xl 2xl:text-6xl  font-bold text-mist-900 text-center tracking-tight mb-10 2xl:mb-16">
          All Articles
        </h2>

        {loading && allArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-mist-300 border-t-mist-900 rounded-full animate-spin mx-auto" />
          </div>
        ) : allArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-mist-500 text-sm 2xl:text-xl">No articles found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-10 2xl:max-w-[1800px] 2xl:mx-auto">
              {allArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onReadMore={navigateToPost}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10 2xl:mt-20">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="bg-mist-900 text-white text-[13px] 2xl:text-lg font-semibold px-8 2xl:px-12 py-3 2xl:py-4 rounded-full 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}

      </section>

      </div>

      {/* CTA Banner */}
      <div className="w-full bg-white sm:px-16 lg:px-20 px-6 py-20 2xl:py-40 2xl:px-32 ">
        <div className="overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 2xl:gap-12 ">
          <div className="flex flex-col gap-3 2xl:gap-6 max-w-md 2xl:max-w-xl">
            <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-snug">
              Ready for Your Next Luxury Experience?
            </h2>
            <p className="text-base 2xl:text-2xl text-mist-500 leading-relaxed">
              Explore our exclusive collection of luxury cars, villas, and nightlife experiences — tailored just for you.
            </p>
            <button onClick={() => router.push("/booking")} className="w-fit mt-2 bg-mist-900 text-white text-base 2xl:text-xl px-6 2xl:px-10 py-2.5 2xl:py-4 rounded-xl 2xl:rounded-2xl hover:bg-mist-700 transition-colors duration-200">
              Reserve Now
            </button>
          </div>
          <div className="w-full sm:w-md 2xl:w-4xl h-72 2xl:h-96 rounded-2xl 2xl:rounded-3xl overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80"
              alt="Luxury villa"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Map API post to Article type ---- */
function mapPost(p: any): Article {
  const readTime = p.content
    ? `${Math.max(1, Math.ceil(p.content.split(/\s+/).length / 200))} min read`
    : "5 min read";
  return {
    id: p.id,
    category: p.category || "News & Updates",
    image: p.coverImage || "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    title: p.title,
    excerpt: p.excerpt || "",
    date: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readTime,
    slug: p.slug,
  };
}