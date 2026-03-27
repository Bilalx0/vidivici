"use client";

import { useState } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

const PayPalIcon = () => (
  <svg width="36" height="22" viewBox="0 0 80 30" fill="none">
    <rect width="80" height="30" rx="4" fill="#003087" />
    <text x="8" y="21" fontSize="14" fontWeight="700" fill="#009cde" fontFamily="Arial">Pay</text>
    <text x="32" y="21" fontSize="14" fontWeight="700" fill="#012169" fontFamily="Arial">Pal</text>
  </svg>
);

const VisaIcon = () => (
  <svg width="36" height="22" viewBox="0 0 80 30" fill="none">
    <rect width="80" height="30" rx="4" fill="#1a1f71" />
    <text x="12" y="22" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial" letterSpacing="1">VISA</text>
  </svg>
);

const ShopPayIcon = () => (
  <svg width="36" height="22" viewBox="0 0 80 30" fill="none">
    <rect width="80" height="30" rx="4" fill="#5a31f4" />
    <text x="6" y="21" fontSize="11" fontWeight="700" fill="white" fontFamily="Arial">Shop Pay</text>
  </svg>
);

const GPayIcon = () => (
  <svg width="36" height="22" viewBox="0 0 80 30" fill="none">
    <rect width="80" height="30" rx="4" fill="white" />
    <text x="8" y="21" fontSize="13" fontWeight="700" fill="#5f6368" fontFamily="Arial">G</text>
    <text x="22" y="21" fontSize="13" fontWeight="700" fill="#4285F4" fontFamily="Arial">P</text>
    <text x="33" y="21" fontSize="13" fontWeight="700" fill="#EA4335" fontFamily="Arial">a</text>
    <text x="43" y="21" fontSize="13" fontWeight="700" fill="#FBBC05" fontFamily="Arial">y</text>
  </svg>
);

const MasterCardIcon = () => (
  <svg width="36" height="22" viewBox="0 0 80 30" fill="none">
    <rect width="80" height="30" rx="4" fill="#252525" />
    <circle cx="30" cy="15" r="9" fill="#EB001B" />
    <circle cx="50" cy="15" r="9" fill="#F79E1B" />
    <path d="M40 8a9 9 0 0 1 0 14 9 9 0 0 1 0-14z" fill="#FF5F00" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <>

      <footer className="w-full bg-[#1a1a1a] text-white">
       

        {/* Top section */}
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pb-8 border-b border-white/10">

            {/* Logo + brand */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Logo mark */}
              <div className="w-14 h-14">
                <Image src="/logo.png" alt="Vidi Vici Logo" width={56} height={56} />
              </div>
              <div>
                <p className="text-xl font-black tracking-wide">Vidi Vici</p>
                <p className="text-[11px] tracking-[0.25em] text-white/50 uppercase">Rental</p>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-[13px] text-white/50 leading-relaxed max-w-xs lg:max-w-sm lg:text-right">
              Experience the pinnacle of luxury and adventure with our exclusive fleet of exotic cars, premium
              villas, and world-class events — crafted for unforgettable moments.
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-10 border-b border-white/10">

            <FooterCol
              title="Company"
              links={[
                { label: "About Us", href: "/about" },
                { label: "Reserve Now", href: "#" },
                { label: "Become a Partner", href: "/partner" },
                { label: "FAQs", href: "/faqs" },
                { label: "Blogs", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ]}
            />

            <FooterCol
              title="Services"
              links={[
                "Cars", "Villas", "Events",
                "Luxury Car Rental", "Corporate Car Rental",
                "Luxury Airport Transfer", "Wedding Car Rental",
                "Prom Car Rental", "Long-Term Car Rental",
                "Insurance Replacement Vehicle",
                "Film, TV & Video Car & House Rental",
              ]}
            />

            <FooterCol
              title="By Brand"
              links={[
                "Ferrari", "Lamborghini", "Rolls Royce",
                "Bentley", "Porsche", "Tesla", "Audi",
                "Cadillac", "McLaren", "Range Rover",
                "BMW", "Aston Martin", "Mercedes", "Corvette",
              ]}
            />

            <FooterCol
              title="By Type"
              links={[
                "Supercar", "SUV", "Convertible",
                "Chauffeur", "Ultra-Luxury", "EV",
                "Coupe | Sports", "Sedan | 4-Door",
              ]}
            />

            {/* Newsletter + Social */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
              <p className="text-[12px] font-bold text-white/80 uppercase tracking-wide">
                Subscribe for VIP updates & exclusive offers
              </p>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2.5 text-[12px] text-white placeholder-white/30 outline-none focus:border-white/40"
                />
                <button className="bg-white text-mist-900 text-[12px] font-bold px-4 py-2.5 rounded-r-lg hover:bg-gray-100 transition-colors flex-shrink-0">
                  Subscribe
                </button>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3 mt-1">
                {[
                  { icon: <Facebook size={16} />, label: "Facebook" },
                  { icon: <Instagram size={16} />, label: "Instagram" },
                  { icon: <TikTokIcon />, label: "TikTok" },
                  { icon: <Youtube size={16} />, label: "YouTube" },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <p className="text-[12px] text-white/40 text-center sm:text-left">
              ©2026 <span className="font-bold text-white/60">Vidi Vici.</span> All rights reserved.
              {" · "}
              <a href="#" className="hover:text-white/80 transition-colors">Privacy</a>
              {" · "}
              <a href="#" className="hover:text-white/80 transition-colors">Terms</a>
              {" · "}
              <a href="#" className="hover:text-white/80 transition-colors">Sitemap</a>
            </p>

            {/* Payment icons */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <VisaIcon />
              <PayPalIcon />
              <ShopPayIcon />
              <GPayIcon />
              <MasterCardIcon />
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-white/80 uppercase tracking-wide">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => {
          const label = typeof link === "string" ? link : link.label;
          const href = typeof link === "string" ? "#" : link.href;
          return (
            <li key={label}>
              <a
                href={href}
                className="text-[12px] text-white/40 hover:text-white/80 transition-colors duration-150 leading-snug"
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}