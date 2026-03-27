"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
  { label: "Cars", sub: ["Luxury Sedans", "Sports Cars", "SUVs", "Convertibles"] },
  { label: "Villas", sub: ["Beachfront", "Mountain", "Private Estates"] },
  { label: "Events", sub: ["Corporate", "Weddings", "Private Parties"] },
  { label: "About", href: "/about", sub: [] },
  { label: "Contact", href: "/contact", sub: [] },
];

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const headerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target))
        setOpenDropdown(null);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
      <header className="absolute top-0 z-50 w-full px-4 sm:px-16 font-['Jost',sans-serif]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 gap-4">

          {/* LEFT NAV */}
          <nav className="hidden sm:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">

                {/* LINK ITEMS */}
                {item.sub.length === 0 ? (
                  <Link
                    href={item.href}
                    className="flex items-center px-3.5 py-2 text-[13.5px] tracking-[0.04em] rounded-md text-white/75 hover:text-white hover:bg-white/5 transition"
                  >
                    {item.label}
                  </Link>
                ) : (

                  /* DROPDOWN BUTTON */
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label
                        )
                      }
                      className={`flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] tracking-[0.04em] rounded-md transition
                      ${
                        openDropdown === item.label
                          ? "text-white bg-white/5"
                          : "text-white/75 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                      <ChevronIcon rotated={openDropdown === item.label} />
                    </button>

                    {openDropdown === item.label && (
                      <div className="absolute top-[calc(100%+10px)] left-0 min-w-[170px] bg-[#0f1319] border border-white/[0.09] rounded-xl p-1.5 shadow-[0_24px_48px_rgba(0,0,0,0.55)] z-[300]">
                        {item.sub.map((s) => (
                          <div
                            key={s}
                            className="px-3.5 py-2.5 text-[13px] text-white/60 rounded-md cursor-pointer hover:bg-white/[0.06] hover:text-white"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* LOGO */}
          <div className="flex sm:justify-center flex-shrink-0 order-first sm:order-none">
            <Link href="/">
              <Image src="/Logo.png" alt="Logo" width={40} height={40} />
            </Link>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="hidden sm:flex items-center justify-end gap-2.5 flex-1">
            <button className="hidden md:block px-4 py-2 text-[13px] text-white/80 border border-white/20 rounded-lg hover:border-white/50 hover:text-white hover:bg-white/[0.04]">
              Become a Partner
            </button>

            <button className="px-4 py-2 text-[13px] font-medium text-[#0a0d12] bg-white border border-white/80 rounded-lg hover:bg-transparent hover:text-white">
              Reserve Now
            </button>

            <button className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5">
              <UserIcon />
            </button>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden flex items-center justify-center w-9 h-9"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M16 4L4 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <Image src="/hamburger.png" alt="Menu" width={34} height={34} />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 bg-[#0a0d12] border-b border-white/[0.08] z-[45] pb-7">

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
                  <button
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === item.label ? null : item.label
                      )
                    }
                    className="flex justify-between w-full px-6 py-3 text-white/80"
                  >
                    {item.label}
                    <ChevronIcon rotated={mobileExpanded === item.label} />
                  </button>

                  {mobileExpanded === item.label && (
                    <div className="pl-9">
                      {item.sub.map((s) => (
                        <div
                          key={s}
                          className="py-2 text-white/50 hover:text-white"
                        >
                          {s}
                        </div>
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