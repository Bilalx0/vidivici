export default function Hero() {
  return (
    <>
      <style>{`

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }

        .hero-title {
          animation: fadeUp 0.9s ease forwards;
          animation-delay: 0.1s;
          opacity: 0;
        }
        .hero-sub {
          animation: fadeUp 0.9s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        .hero-search {
          animation: fadeUp 0.9s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        .hero-chevron {
          animation: fadeIn 1s ease forwards, bounce-slow 2s ease-in-out 1.2s infinite;
          opacity: 0;
          animation-delay: 0.9s, 1.2s;
        }

        .search-input::placeholder { color: rgba(255,255,255,0.45); }
        .search-input:focus { outline: none; }
      `}</style>

      <section
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-0"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/main.png')" }}
        />

        {/* Dark overlay — heavier at top/bottom, lighter in middle to let image breathe */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

        {/* Subtle vignette on sides */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto mt-20">

          {/* Heading */}
          <h1
            className="hero-title text-white font-bold leading-[1.12] mb-5 text-4xl sm:text-5xl md:text-5xl"
          >
            Experience Luxury Like<br />
            Never Before with Vidi Vici
          </h1>

          {/* Subheading */}
          <p
            className="hero-sub text-white/75 font-extralight leading-relaxed mb-10 text-xl px-8"
          >
            Exotic cars and luxury villas in Los Angeles, curated for those who
            demand the extraordinary.
          </p>

          {/* Search bar */}
          <div className="hero-search w-full max-w-[440px]">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md transition-all duration-300 focus-within:bg-white/15 focus-within:border-white/35">
              {/* Search icon */}
              <svg
                width="18" height="18" viewBox="0 0 20 20" fill="none"
                className="shrink-0 text-white/50"
              >
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search cars, villas, or events..."
                className="search-input flex-1 bg-transparent text-white text-[14px] tracking-[0.02em] font-light border-none"
                style={{ fontFamily: "'Jost', sans-serif" }}
              />
            </div>
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="hero-chevron absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/50">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>
    </>
  );
}