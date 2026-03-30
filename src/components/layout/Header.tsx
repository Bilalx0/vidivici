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
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="7" r="3.5" stroke="white" strokeWidth="1.5" />
    <path
      d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const NAV_ITEMS = [
  {
    label: "Cars",
    href: "/cars",
    sub: [
      { label: "Insurance Replacement", href: "/cars/insurance" },
      { label: "Drive the Extraordinary", href: "/cars/drive-the-extraordinary" },
      { label: "Long-Term Rental", href: "/cars/long-term" },
      { label: "Experience", href: "/cars/experience" },
    ],
  },
  {
    label: "Villas",
    href: "/villas",
    sub: [
      { label: "Browse All Villas", href: "/villas" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    sub: [
      { label: "Browse All Events", href: "/events" },
      { label: "Ballroom", href: "/events/ballroom" },
      { label: "Weddings", href: "/wedding-villas" },
    ],
  },
  { label: "About", href: "/about", sub: [] },
  { label: "Contact", href: "/contact", sub: [] },
];

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
    <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function Header() {
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

  // Pages with dark hero where header can start transparent
  const hasDarkHero = pathname === "/" || pathname === "/partner";
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);


  return (
    <div ref={headerRef}>
      {/* HEADER */}
      <header className={`fixed top-0 z-50 w-full sm:px-16 lg:px-20 px-6 transition-colors duration-300 ${showBg ? "bg-[#0a0d12]/95 backdrop-blur-md border-b border-white/[0.06]" : ""}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 gap-4">

          {/* LEFT NAV */}
          <nav className="hidden sm:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.sub.length > 0 && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {/* NAV LINK — always clickable */}
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] tracking-[0.04em] rounded-md transition
                  ${
                    openDropdown === item.label
                      ? "text-white bg-white/5"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {item.sub.length > 0 && <ChevronIcon rotated={openDropdown === item.label} />}
                </Link>

                {/* DROPDOWN — hover only */}
                {item.sub.length > 0 && openDropdown === item.label && (
                  <div className="absolute top-[calc(100%+4px)] left-0 min-w-[200px] bg-[#0f1319] border border-white/[0.09] rounded-xl p-1.5 shadow-[0_24px_48px_rgba(0,0,0,0.55)] z-[300]">
                    {item.sub.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-3.5 py-2.5 text-[13px] text-white/60 rounded-md hover:bg-white/[0.06] hover:text-white transition"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* LOGO */}
          <div className="flex justify-center flex-shrink-0">
            <Link href="/">
              <Image src="/Logo.png" alt="Logo" width={40} height={40} />
            </Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="hidden sm:flex items-center justify-end gap-2.5 flex-1">
            {/* SEARCH */}
            {searchOpen ? (
              <form
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-lg overflow-hidden"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cars..."
                  className="bg-transparent px-3 py-1.5 text-[13px] text-white placeholder-white/40 outline-none w-40"
                  autoFocus
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                />
                <button type="submit" className="pr-2.5 text-white/60 hover:text-white">
                  <SearchIcon />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 text-white/70 hover:text-white"
              >
                <SearchIcon />
              </button>
            )}
            <button className="hidden md:block px-4 py-2 text-[13px] text-white/80 border border-white/20 rounded-lg hover:border-white/50 hover:text-white hover:bg-white/[0.04]">
              Become a Partner
            </button>

            <Link href="/booking" className="px-4 py-2 text-[13px] font-medium text-[#0a0d12] bg-white border border-white/80 rounded-lg hover:bg-mist-50 cursor-pointer transition">
              Reserve Now
            </Link>

            <Link
              href={session?.user ? "/account" : "/login"}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5"
            >
              <UserIcon />
            </Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden flex flex-col gap-[5px] w-9 h-9"
          >
            <span
              className="block w-[22px] h-[1.5px] bg-white"
              style={{
                transform: mobileOpen
                  ? "rotate(45deg) translate(0,6.5px)"
                  : "none",
              }}
            />
            <span
              className="block w-[22px] h-[1.5px] bg-white"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="block w-[22px] h-[1.5px] bg-white"
              style={{
                transform: mobileOpen
                  ? "rotate(-45deg) translate(0,-6.5px)"
                  : "none",
              }}
            />
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

              {item.sub.length === 0 ? (
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
                      {item.sub.map((s) => (
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