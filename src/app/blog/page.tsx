"use client";

import { useState } from "react";
import Banner from "@/components/ui/Banner";
import ArticleCard, { Article } from "@/components/ui/ArticleCard";

type BlogCategory = "All" | "Exotic Cars" | "Luxury Villas" | "Events" | "Lifestyle & Travel" | "News & Updates";

const categories: BlogCategory[] = [
  "All", "Exotic Cars", "Luxury Villas", "Events", "Lifestyle & Travel", "News & Updates",
];

const articles: Article[] = [
  {
    id: 1,
    category: "Exotic Cars",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    title: "The 5 Most Iconic Exotic Cars to Drive in 2025",
    excerpt: "From Lamborghinis to McLarens — discover the supercars that dominate the luxury scene this year.",
    date: "Dec 15, 2024",
    readTime: "15 min read",
    slug: "iconic-exotic-cars-2025",
  },
  {
    id: 2,
    category: "Events",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    title: "Design Dreams: Inside LA's Most Stunning Modern Villas",
    excerpt: "A look into architectural masterpieces, celebrity residences, and breathtaking dreamscapes.",
    date: "Dec 15, 2024",
    readTime: "15 min read",
    slug: "la-modern-villa-design",
  },
  {
    id: 3,
    category: "Events",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80",
    title: "Hollywood Nights: The Rise of Private Party Culture in LA",
    excerpt: "Tap into the secret ropes and explore why LA has exclusive social gatherings of the season.",
    date: "Dec 15, 2024",
    readTime: "15 min read",
    slug: "hollywood-private-parties",
  },
  {
    id: 4,
    category: "Exotic Cars",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
    title: "Supercar Showdown: Ferrari vs Lamborghini in 2025",
    excerpt: "From scenic drives in exotic cars to fine dining under city lights — which icon wins the crown?",
    date: "Dec 15, 2024",
    readTime: "15 min read",
    slug: "ferrari-vs-lamborghini-2025",
  },
  {
    id: 5,
    category: "Lifestyle & Travel",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    title: "How to Plan the Perfect Luxury Weekend in Los Angeles",
    excerpt: "From sunset cruises to VIP dinners — here's exactly how to spend 48 hours in peak luxury.",
    date: "Dec 15, 2024",
    readTime: "15 min read",
    slug: "luxury-weekend-la",
  },
  {
    id: 6,
    category: "Events",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    title: "Inside LA's Most Exclusive Nightclubs",
    excerpt: "Experience the top venues redefining Los Angeles nightlife from Delilah's Art Deco vibes to Parisian elegance.",
    date: "Dec 15, 2024",
    readTime: "15 min read",
    slug: "la-exclusive-nightclubs",
  },
];

const INITIAL_COUNT = 6;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filtered = articles.filter((a) => {
    const matchCategory = activeCategory === "All" || a.category === activeCategory;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat: BlogCategory) => {
    setActiveCategory(cat);
    setVisibleCount(INITIAL_COUNT);
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
          onSearch: (val) => setSearch(val),
        }}
      />
      <div className="bg-[#f7f7f8]">
        
      
      {/* Category filters */}
      <div className="w-full relative top-32">
        <div className="w-full mx-auto bg-white py-4 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 border border-gray-100 text-mist-600 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <section className="w-full py-14 sm:px-16 lg:px-20 px-10 mt-40">
        <div className="">

          <h2 className="text-3xl font-bold text-mist-900 text-center tracking-tight mb-10">
            Featured Articles
          </h2>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mist-400 text-sm">No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visible.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onReadMore={(a) => console.log("Navigate to:", a.slug)}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </section>
      <section className="w-full py-14 sm:px-16 lg:px-20 px-10">
        <div className="">

          <h2 className="text-3xl font-bold text-mist-900 text-center tracking-tight mb-10">
            All Articles
          </h2>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mist-400 text-sm">No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visible.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onReadMore={(a) => console.log("Navigate to:", a.slug)}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + INITIAL_COUNT)}
                    className="bg-gray-900 text-white text-[13px] font-semibold px-8 py-3 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

        
      </div>

      {/* CTA Banner */}
      <div className="w-full bg-white sm:px-16 lg:px-20 px-10 py-20">
        <div className="overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 ">

          {/* Left text */}
          <div className="flex flex-col gap-3 max-w-md">
            <h3 className="text-4xl font-bold text-mist-900 leading-snug">
              Ready for Your Next Luxury Experience?
            </h3>
            <p className="text-base text-mist-400 leading-relaxed">
              Explore our exclusive collection of luxury cars, villas, and nightlife experiences — tailored just for you.
            </p>
            <button className="w-fit mt-2 bg-gray-900 text-white text-base px-6 py-2.5 rounded-xl hover:bg-gray-700 transition-colors duration-200">
              Reserve Now
            </button>
          </div>

          {/* Right image */}
          <div className="w-full sm:w-md h-72 rounded-2xl overflow-hidden flex-shrink-0">
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