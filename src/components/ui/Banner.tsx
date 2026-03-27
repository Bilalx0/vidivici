"use client";

import { Search } from "lucide-react";
import { ReactNode, FormEvent } from "react";

interface SearchBarConfig {
  placeholder?: string;
  buttonLabel?: string;
  onSearch?: (value: string) => void;
  renderCustom?: () => ReactNode;
}

interface BannerProps {
  heading: string;
  description?: string | false;
  image?: string;
  height?: string;
  overlay?: string;
  searchBar?: SearchBarConfig | false;
}

interface DefaultSearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
  onSearch?: (value: string) => void;
}

function DefaultSearchBar({
  placeholder = "Search...",
  onSearch,
}: DefaultSearchBarProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    onSearch?.(input.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto"
    >
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/40 transition-all duration-300 focus-within:border-white/60"
        style={{
          background: "rgba(255, 255, 255, 0.22)",
          backdropFilter: "blur(100px) saturate(200%)",
          WebkitBackdropFilter: "blur(60px) saturate(200%)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          className="shrink-0 text-white/70"
        >
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          name="search"
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white text-[15px] tracking-wide outline-none border-none"
          style={{ caretColor: "white" }}
        />
      </div>
    </form>
  );
}

export default function Banner({
  heading,
  description = false,
  image = "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=80",
  height = "h-64",
  searchBar = false,
}: BannerProps) {
  return (
    <div className={`relative w-full ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background image */}
      <img
        src={image}
        alt={heading}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-2xl mx-auto gap-3">
        <h1 className="text-3xl sm:text-5xl text-white tracking-tight drop-shadow-md font-medium">
          {heading}
        </h1>

        {description !== false && description && (
          <p className="text-sm text-white/70 leading-relaxed max-w-md">
            {description}
          </p>
        )}

        {searchBar !== false && (
          <div className="w-full mt-2">
            {searchBar.renderCustom ? (
              searchBar.renderCustom()
            ) : (
              <DefaultSearchBar
                placeholder={searchBar.placeholder}
                buttonLabel={searchBar.buttonLabel}
                onSearch={searchBar.onSearch}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}