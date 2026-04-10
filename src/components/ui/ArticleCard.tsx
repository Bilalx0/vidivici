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
    <div className="bg-white rounded-2xl 2xl:rounded-2xl overflow-hidden border border-mist-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer w-full 2xl:w-[450px]">

      {/* Image */}
      <div className="h-48 2xl:h-[260px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 2xl:gap-4 p-5 2xl:p-6 flex-1">

        {/* Category pill */}
        <span className="w-fit text-[11px] 2xl:text-xs font-semibold text-blue-600 bg-blue-50 px-3 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full">
          {article.category}
        </span>

        {/* Title */}
        <h3 className="text-[15px] 2xl:text-lg font-bold text-mist-900 leading-snug">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[12.5px] 2xl:text-sm text-mist-400 leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 2xl:pt-4 border-t border-mist-100 mt-auto">
          <div className="flex items-center gap-3 text-[11px] 2xl:text-xs text-mist-400">
            <span className="flex items-center gap-1">
              <Calendar size={11} className="2xl:w-3.5 2xl:h-3.5" /> {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} className="2xl:w-3.5 2xl:h-3.5" /> {article.readTime}
            </span>
          </div>
          <button
            onClick={() => onReadMore?.(article)}
            className="flex items-center gap-0.5 text-[12px] 2xl:text-sm font-semibold text-mist-700 hover:text-mist-900 transition-colors"
          >
            Read More <ChevronRight size={13} className="2xl:w-4.5 2xl:h-4.5" strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}