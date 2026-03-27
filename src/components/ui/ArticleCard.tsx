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
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer">

      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">

        {/* Category pill */}
        <span className="w-fit text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {article.category}
        </span>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-mist-900 leading-snug">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[12.5px] text-mist-400 leading-relaxed line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3 text-[11px] text-mist-400">
            <span className="flex items-center gap-1">
              <Calendar size={11} /> {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {article.readTime}
            </span>
          </div>
          <button
            onClick={() => onReadMore?.(article)}
            className="flex items-center gap-0.5 text-[12px] font-semibold text-mist-700 hover:text-mist-900 transition-colors"
          >
            Read More <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}