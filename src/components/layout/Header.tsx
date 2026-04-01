"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const ChevronIcon = ({ rotated }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className="shrink-0 transition-transform duration-300"
    style={{ transform: rotated ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <path
      d="M2.5 4.5L6 8L9.5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    {/* By using currentColor, the SVG matches the 'text-xxx' class of its parent */}
    <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CARS_MAKES_COL_1 = ["Rolls-Royce", "Bentley", "Aston Martin", "Lamborghini", "Ferrari", "McLaren", "Porsche", "Mercedes"];
const CARS_MAKES_COL_2 = ["BMW", "Range Rover", "Cadillac", "Corvette", "Tesla", "Audi", "Rivian"];
const CARS_CATEGORIES = ["Supercar", "Convertible", "SUV", "Chauffeur", "EV", "Coupe | Sports", "Sedan | 4-Door", "Ultra-Luxury"];

const NAV_ITEMS = [
  {
    label: "Cars",
    href: "/cars",
    carsMenu: true,
    sub: [],
  },
  {
    label: "Villas",
    href: "/villas",
    sub: [

    ],
  },
  {
    label: "Events",
    href: "/events",
    sub: [

    ],
  },
  {
    label: "About", href: "/about", sub: [{ label: "FAQs", href: "/faqs" },
    { label: "Blogs", href: "/blogs" },]
  },
  { label: "Contact", href: "/contact", sub: [] },
];

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
    <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function Header({ forceLight = false }: { forceLight?: boolean } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

 
  const showBg = scrolled;

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/cars?search=${encodeURIComponent(q)}`);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target))
        setOpenDropdown(null);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (forceLight) return;
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceLight]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isLightMode = forceLight || scrolled;
  return (
    <div ref={headerRef}>
      {/* HEADER - Increased height and padding for 2xl */}
      <header
        className={`fixed top-0 z-50 w-full sm:px-16 lg:px-20 px-6 2xl:px-32 transition-all duration-300 
        ${(forceLight || scrolled)
            ? "bg-mist-50/95 backdrop-blur-md border-b border-mist-200 py-0 shadow-sm"
            : "bg-transparent py-2 2xl:py-4"
          }`}
      >
        <div className="max-w-[1400px] 2xl:max-w-[1840px] mx-auto flex items-center justify-between h-16 2xl:h-28 gap-4">

          {/* LEFT NAV */}
          <nav className="hidden sm:flex items-center gap-0.5 2xl:gap-4 flex-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => (item.sub.length > 0 || item.carsMenu) && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 2xl:px-6 2xl:py-4 text-[13.5px] 2xl:text-[22px] font-medium tracking-[0.04em] rounded-md transition-colors
                  ${isLightMode
                      ? "text-mist-900 hover:bg-mist-200/50"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                    }
                  ${openDropdown === item.label ? (isLightMode ? "bg-mist-200" : "bg-white/10") : ""}`}
                >
                  {item.label}
                  {(item.sub.length > 0 || item.carsMenu) && (
                    <span className={isLightMode ? "text-mist-400" : "text-white/50"}>
                      <ChevronIcon rotated={openDropdown === item.label} />
                    </span>
                  )}
                </Link>

                {/* DROPDOWN */}
                {(item.sub.length > 0 || item.carsMenu) && openDropdown === item.label && (
                  item.carsMenu ? (
                    <div className="absolute top-[calc(100%+4px)] left-0 w-[480px] 2xl:w-[700px] bg-white border border-mist-200 rounded-2xl 2xl:rounded-3xl p-6 2xl:p-10 shadow-xl z-[300]">
                      <div className="flex gap-8 2xl:gap-12">
                        {/* Makes */}
                        <div className="flex-1">
                          <p className="text-[11px] 2xl:text-sm font-semibold text-mist-500 uppercase tracking-widest mb-3 2xl:mb-5">Makes</p>
                          <div className="grid grid-cols-2 gap-x-4 2xl:gap-x-8">
                            {[...CARS_MAKES_COL_1, ...CARS_MAKES_COL_2].map((make) => (
                              <Link
                                key={make}
                                href={`/cars?make=${encodeURIComponent(make)}`}
                                onClick={() => setOpenDropdown(null)}
                                className="py-1.5 2xl:py-2 text-[13.5px] 2xl:text-[17px] text-mist-700 hover:text-mist-900 transition-colors"
                              >
                                {make}
                              </Link>
                            ))}
                          </div>
                        </div>
                        {/* Divider */}
                        <div className="w-px bg-mist-200 self-stretch" />
                        {/* Categories */}
                        <div className="w-36 2xl:w-52 flex-shrink-0">
                          <p className="text-[11px] 2xl:text-sm font-semibold text-mist-500 uppercase tracking-widest mb-3 2xl:mb-5">Categories</p>
                          <div className="flex flex-col">
                            {CARS_CATEGORIES.map((cat) => (
                              <Link
                                key={cat}
                                href={`/cars?category=${encodeURIComponent(cat)}`}
                                onClick={() => setOpenDropdown(null)}
                                className="py-1.5 2xl:py-2 text-[13.5px] 2xl:text-[17px] text-mist-700 hover:text-mist-900 transition-colors"
                              >
                                {cat}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-[calc(100%+4px)] left-0 min-w-[200px] 2xl:min-w-[350px] bg-white border border-mist-200 rounded-xl 2xl:rounded-2xl p-1.5 2xl:p-4 shadow-xl z-[300]">
                      {item.sub.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-3.5 py-2.5 2xl:px-6 2xl:py-4 text-[13px] 2xl:text-[18px] text-mist-600 rounded-md hover:bg-mist-50 hover:text-mist-900 transition"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )
                )}
              </div>
            ))}
          </nav>

          {/* LOGO */}
          <div className="flex justify-center flex-shrink-0">
            <Link href="/">
              <div className="relative w-10 h-10 2xl:w-20 2xl:h-20">
                {/* Switch logo based on background if you have a dark version */}
                <Image
                  src={isLightMode ? "/Logo 2.png" : "/Logo.png"}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="hidden sm:flex items-center justify-end gap-2.5 2xl:gap-6 flex-1">
            
            <button className={`hidden md:block px-4 py-2 2xl:px-8 2xl:py-4 text-[13px] 2xl:text-[18px] border rounded-lg 2xl:rounded-xl transition
              ${isLightMode
                ? "text-mist-700 border-mist-200 hover:bg-mist-100"
                : "text-white/80 border-white/20 hover:border-white/50 hover:bg-white/5"}`}>
              Become a Partner
            </button>

            <Link href="/booking" className="px-4 py-2 2xl:px-8 2xl:py-4 text-[13px] 2xl:text-[18px] font-normal text-white bg-mist-900 rounded-lg 2xl:rounded-xl hover:bg-black transition shadow-md">
              Reserve Now
            </Link>

            <Link
              href={session?.user ? "/account" : "/login"}
              className={`flex items-center justify-center w-9 h-9 2xl:w-16 2xl:h-16 rounded-full border transition
                ${isLightMode
                  ? "border-mist-200 text-mist-900 hover:bg-mist-100"
                  : "border-white/20 text-white hover:bg-white/5"}`}
            >
              <div >
                <UserIcon />
              </div>
            </Link>
          </div>

          {/* MOBILE HAMBURGER - Color Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden flex flex-col gap-[5px] w-9 h-9 items-center justify-center">
            <span className={`block w-[22px] h-[1.5px] transition-colors ${isLightMode ? 'bg-mist-900' : 'bg-white'}`} style={{ transform: mobileOpen ? "rotate(45deg) translate(0,6.5px)" : "none" }} />
            <span className={`block w-[22px] h-[1.5px] transition-colors ${isLightMode ? 'bg-mist-900' : 'bg-white'}`} style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className={`block w-[22px] h-[1.5px] transition-colors ${isLightMode ? 'bg-mist-900' : 'bg-white'}`} style={{ transform: mobileOpen ? "rotate(-45deg) translate(0,-6.5px)" : "none" }} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 bg-[#0a0d12] border-b border-white/[0.08] z-[45] pb-7">

          {/* MOBILE SEARCH */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="mx-6 mt-4 mb-2 flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-lg overflow-hidden"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cars..."
              className="flex-1 bg-transparent px-3 py-2.5 text-[14px] text-white placeholder-white/40 outline-none"
            />
            <button type="submit" className="pr-3 text-white/60 hover:text-white">
              <SearchIcon />
            </button>
          </form>

          {NAV_ITEMS.map((item) => (
            <div key={item.label}>

              {item.sub.length === 0 && !item.carsMenu ? (
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3 text-[15px] text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <div className="flex items-center justify-between px-6 py-3">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-[15px] text-white/80 hover:text-white"
                    >
                      {item.label}
                    </Link>
                    <button onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}>
                      <ChevronIcon rotated={mobileExpanded === item.label} />
                    </button>
                  </div>

                  {mobileExpanded === item.label && (
                    <div className="pl-9">
                      {item.carsMenu ? (
                        <>
                          <p className="py-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest">Makes</p>
                          {[...CARS_MAKES_COL_1, ...CARS_MAKES_COL_2].map((make) => (
                            <Link key={make} href={`/cars?make=${encodeURIComponent(make)}`} onClick={() => setMobileOpen(false)} className="block py-2 text-white/50 hover:text-white text-[14px]">{make}</Link>
                          ))}
                          <p className="py-1.5 mt-2 text-[10px] font-semibold text-white/30 uppercase tracking-widest">Categories</p>
                          {CARS_CATEGORIES.map((cat) => (
                            <Link key={cat} href={`/cars?category=${encodeURIComponent(cat)}`} onClick={() => setMobileOpen(false)} className="block py-2 text-white/50 hover:text-white text-[14px]">{cat}</Link>
                          ))}
                        </>
                      ) : item.sub.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-white/50 hover:text-white text-[14px]"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
