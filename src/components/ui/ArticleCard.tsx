"use client";

import { Calendar, Clock, ChevronRight } from "lucide-react";

export interface Article {
  id: number;
  category: string;
  image: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug?: string;
}

interface ArticleCardProps {
  article: Article;
  onReadMore?: (article: Article) => void;
}

export default function ArticleCard({ article, onReadMore }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-3xl 2xl:rounded-3xl overflow-hidden border border-mist-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer w-xs 2xl:w-[500px] flex-shrink-0">

      {/* Image */}
      <div className="h-48 2xl:h-[320px] overflow-hidden p-3 2xl:p-5">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl 2xl:rounded-2xl"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 2xl:gap-4 px-6 2xl:px-9 pt-3.5 2xl:pt-6 pb-4 2xl:pb-7 flex-1">

        {/* Category pill */}
        <span className="w-fit text-[11px] 2xl:text-sm font-semibold text-blue-600 bg-blue-50 px-3 2xl:px-4 py-1 2xl:py-2 rounded-full">
          {article.category}
        </span>

        {/* Title */}
        <h3 className="text-lg sm:text-xl 2xl:text-[1.6rem] font-semibold text-mist-900 leading-snug -mt-0.5">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm 2xl:text-[1.05rem] text-mist-600 leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Divider */}
        <div className="h-px bg-mist-100 mt-0.5 2xl:mt-1" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-0.5 2xl:mt-1">
          <div className="flex items-center gap-3 text-xs 2xl:text-[0.9rem] text-mist-500">
            <span className="flex items-center gap-1 2xl:gap-2">
              <Calendar size={11} className="2xl:w-4 2xl:h-4" /> {article.date}
            </span>
            <span className="flex items-center gap-1 2xl:gap-2">
              <Clock size={11} className="2xl:w-4 2xl:h-4" /> {article.readTime}
            </span>
          </div>
          <button
            onClick={() => onReadMore?.(article)}
            className="flex items-center gap-1 2xl:gap-2.5 text-sm 2xl:text-[1.05rem] text-mist-500 hover:text-mist-900 transition-colors font-semibold"
          >
            Read More <ChevronRight size={11} className="2xl:w-5 2xl:h-5" strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}