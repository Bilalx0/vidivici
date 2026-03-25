import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="42" height="42" rx="6" stroke="white" strokeWidth="1.5" />
    <g transform="translate(8, 8)">
      <path d="M4 4 L14 4 L14 8 L8 8 L8 14 L4 14 Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 4 L14 4 L14 8 L20 8 L20 14 L24 14 Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 24 L14 24 L14 20 L8 20 L8 14 L4 14 Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 24 L14 24 L14 20 L20 20 L20 14 L24 14 Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  </svg>
);

// inline style used here because Tailwind can't do dynamic rotate from props
const ChevronIcon = ({ rotated }) => (
  <svg
    width="12" height="12" viewBox="0 0 12 12" fill="none"
    className="shrink-0 transition-transform duration-300"
    style={{ transform: rotated ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="7" r="3.5" stroke="white" strokeWidth="1.5" />
    <path d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NAV_ITEMS = [
  { label: "Cars",    sub: ["Luxury Sedans", "Sports Cars", "SUVs", "Convertibles"] },
  { label: "Villas",  sub: ["Beachfront", "Mountain", "Private Estates"] },
  { label: "Events",  sub: ["Corporate", "Weddings", "Private Parties"] },
  { label: "About",   sub: ["Our Story", "Team", "Press"] },
  { label: "Contact", sub: [] },
];

export default function Header() {
  const [openDropdown, setOpenDropdown]     = useState(null);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const headerRef = useRef(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target))
        setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div ref={headerRef}>
      {/* ── Top bar ── */}
      <header className=" top-0 z-50 bg-transparent font-['Jost',sans-serif] absolute w-full px-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 h-16 gap-4">

          {/* Left nav — hidden on mobile */}
          <nav className="hidden sm:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                <button
                  onClick={() =>
                    item.sub.length
                      ? setOpenDropdown(openDropdown === item.label ? null : item.label)
                      : null
                  }
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] tracking-[0.04em] font-normal rounded-md whitespace-nowrap transition-colors duration-200 cursor-pointer border-none
                    ${openDropdown === item.label
                      ? "text-white bg-white/5"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item.label}
                  {item.sub.length > 0 && <ChevronIcon rotated={openDropdown === item.label} />}
                </button>

                {/* Dropdown */}
                {item.sub.length > 0 && openDropdown === item.label && (
                  <div className="absolute top-[calc(100%+10px)] left-0 min-w-[170px] bg-[#0f1319] border border-white/[0.09] rounded-xl p-1.5 shadow-[0_24px_48px_rgba(0,0,0,0.55)] z-[300] animate-[dropIn_0.18s_ease_forwards]">
                    {item.sub.map((s) => (
                      <div
                        key={s}
                        className="px-3.5 py-2.5 text-[13px] text-white/60 rounded-md cursor-pointer whitespace-nowrap transition-colors duration-150 hover:bg-white/[0.06] hover:text-white"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Center logo */}
          <div className="flex items-center justify-center shrink-0 opacity-[0.92] hover:opacity-100 transition-opacity duration-200 cursor-pointer">
            <Image src="/Logo.png" alt="Logo" width={40} height={40} />
          </div>

          {/* Right actions — hidden on mobile */}
          <div className="hidden sm:flex items-center justify-end gap-2.5 flex-1">
            <button className="hidden md:block px-4 py-2 text-[13px] tracking-[0.04em] font-normal text-white/80 border border-white/20 rounded-lg whitespace-nowrap transition-all duration-200 hover:border-white/50 hover:text-white hover:bg-white/[0.04] cursor-pointer bg-transparent">
              Become a Partner
            </button>
            <button className="px-4 py-2 text-[13px] tracking-[0.04em] font-medium text-[#0a0d12] border border-white/80 rounded-lg whitespace-nowrap transition-all duration-200 hover:bg-transparent hover:text-white cursor-pointer bg-white">
              Reserve Now
            </button>
            <button className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 shrink-0 transition-all duration-200 hover:border-white/50 hover:bg-white/5 cursor-pointer bg-transparent">
              <UserIcon />
            </button>
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="sm:hidden flex flex-col justify-center gap-[5px] w-9 h-9 p-1 shrink-0 bg-transparent border-none cursor-pointer"
          >
            {/* inline style: Tailwind can't do dynamic translate+rotate combos */}
            <span className="block w-[22px] h-[1.5px] bg-white/80 rounded-sm transition-all duration-300"
              style={{ transform: mobileOpen ? "rotate(45deg) translate(0, 6.5px)" : "none" }} />
            <span className="block w-[22px] h-[1.5px] bg-white/80 rounded-sm transition-all duration-300"
              style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-[22px] h-[1.5px] bg-white/80 rounded-sm transition-all duration-300"
              style={{ transform: mobileOpen ? "rotate(-45deg) translate(0, -6.5px)" : "none" }} />
          </button>

        </div>
      </header>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="sm:hidden fixed inset-0 bg-black/55 z-40 animate-[fadeIn_0.2s_ease]"
        />
      )}

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 bg-[#0a0d12] border-b border-white/[0.08] z-[45] pb-7 max-h-[calc(100vh-64px)] overflow-y-auto animate-[slideDown_0.22s_ease]">
          {NAV_ITEMS.map((item, i) => (
            <div key={item.label}>
              <button
                onClick={() =>
                  item.sub.length
                    ? setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                    : setMobileOpen(false)
                }
                className="flex items-center justify-between w-full px-6 py-3.5 text-[15px] tracking-[0.03em] font-normal text-white/80 hover:text-white transition-colors duration-150 bg-transparent border-none cursor-pointer text-left"
              >
                {item.label}
                {item.sub.length > 0 && <ChevronIcon rotated={mobileExpanded === item.label} />}
              </button>

              {/* Accordion sub-items — inline style: dynamic maxHeight can't be done in Tailwind */}
              {item.sub.length > 0 && (
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: mobileExpanded === item.label ? `${item.sub.length * 44}px` : "0px",
                    opacity: mobileExpanded === item.label ? 1 : 0,
                  }}
                >
                  {item.sub.map((s) => (
                    <button
                      key={s}
                      onClick={() => setMobileOpen(false)}
                      className="block w-full pl-9 pr-6 py-2.5 text-[13.5px] text-white/45 hover:text-white/85 transition-colors duration-150 bg-transparent border-none cursor-pointer text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {i < NAV_ITEMS.length - 1 && (
                <div className="h-px bg-white/[0.06] mx-6 my-1" />
              )}
            </div>
            ))}

            <div className="h-px bg-white/[0.06] mx-6 my-4" />
            <div className="flex flex-col gap-2.5 px-6">
            <button className="w-full py-3 text-[14px] tracking-[0.04em] text-white/80 border border-white/20 rounded-lg transition-all duration-200 hover:border-white/50 hover:text-white hover:bg-white/[0.04] cursor-pointer bg-transparent">
              Become a Partner
            </button>
            <button className="w-full py-3 text-[14px] tracking-[0.04em] font-medium text-white border border-white/80 rounded-lg transition-all duration-200 hover:bg-transparent hover:text-white cursor-pointer bg-white text-[#0a0d12]">
              Reserve Now
            </button>
            </div>
          </div>
          )}

          {/* Keyframe animations — only for things Tailwind doesn't ship by default */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}