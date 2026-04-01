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

        .search-input:focus { outline: none; }
      `}</style>

      <section
        className="relative w-full min-h-screen 2xl:min-h-[1200px] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/main.png')" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
        />

        {/* Content - Increased max-width and top margin for 2xl */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl 2xl:max-w-7xl mx-auto mt-20 2xl:mt-32">

          {/* Heading - Scaled to 9xl for high-res impact */}
          <h1 className="hero-title text-white font-semibold mb-5 2xl:mb-12 text-3xl sm:text-5xl 2xl:text-8xl leading-snug 2xl:leading-[1.1]">
            Experience Luxury Like Never Before with Vidi Vici
          </h1>

          {/* Subheading - Scaled to 4xl */}
          <p className="hero-sub text-mist-300 font-extralight leading-relaxed mb-10 2xl:mb-20 text-base sm:text-xl 2xl:text-3xl px-0 sm:px-8 2xl:px-24">
            Exotic cars and luxury villas in Los Angeles, curated for those who
            demand the extraordinary.
          </p>

          {/* Search bar - Scaled width, padding, and icons */}
          <div className="hero-search w-full max-w-lg 2xl:max-w-4xl">
            <div
              className="flex items-center gap-3 2xl:gap-6 px-5 py-3 2xl:px-10 2xl:py-5 rounded-2xl 2xl:rounded-3xl border border-white/40 transition-all duration-300 focus-within:border-white/60"
              style={{
                background: "rgba(255, 255, 255, 0.22)",
                backdropFilter: "blur(100px) saturate(200%)",
                WebkitBackdropFilter: "blur(60px) saturate(200%)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <svg
                width="20" height="20" viewBox="0 0 20 20" fill="none"
                className="shrink-0 text-white/70 2xl:w-10 2xl:h-10"
              >
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search cars, villas, or events..."
                className="flex-1 bg-transparent placeholder:text-white/60 text-white tracking-wide outline-none border-none text-sm sm:text-base 2xl:text-2xl"
              />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}