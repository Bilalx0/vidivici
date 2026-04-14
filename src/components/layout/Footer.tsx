"use client";

import { useState } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

// --- CUSTOM SVG COMPONENTS ---

const TikTokIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

export default function Footer() {
  const NO_MARGIN_PATHS = ["/partner", "/faqs", "/blog", "/contact", "/events"];

  const [email, setEmail] = useState("");

   const pathname = usePathname();

  const noMargin = NO_MARGIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  return (
    <footer className={`relative w-full bg-[#1a1a1a] text-white overflow-hidden ${noMargin ? "" : "mt-24 2xl:mt-48"}`}>

      {/* Decorative Vectors - Pinned for 2XL Visibility */}
      <img
        src="/Vector 6.png"
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-40 2xl:top-60 h-[45%] sm:h-[70%] 2xl:h-[85%] w-auto object-contain object-left pointer-events-none select-none opacity-30 2xl:opacity-40"
      />
      <img
        src="/Vector 6.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 -top-20 2xl:-top-40 h-[45%] sm:h-[70%] 2xl:h-[85%] w-auto object-contain object-right pointer-events-none select-none rotate-180 opacity-30 2xl:opacity-40"
      />

      <div className="sm:px-16 lg:px-20 px-6 2xl:px-32 pt-14 2xl:pt-20 pb-8 2xl:pb-12 relative z-10">

        {/* Top Branding Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 2xl:gap-12 pb-10 2xl:pb-16 border-b border-white/10">
          <div className="flex items-center gap-6 2xl:gap-8 flex-shrink-0">
            <div className="flex-shrink-0">
              <Image src="/Logo.png" alt="Vidi Vici Logo" width={80} height={80} className="2xl:w-20 2xl:h-20" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl 2xl:text-4xl font-normal tracking-wide leading-tight">Vidi Vici</p>
              <p className="text-xs sm:text-base 2xl:text-lg tracking-[0.5rem] 2xl:tracking-[1rem] text-[#EDEDED] uppercase mt-1">Rental</p>
            </div>
          </div>

          <p className="text-[13px] 2xl:text-lg text-mist-300 leading-relaxed max-w-sm 2xl:max-w-xl lg:text-right">
            Experience the pinnacle of luxury and adventure with our exclusive
            fleet of exotic cars, premium villas, and world-class events —
            crafted for unforgettable moments.
          </p>
        </div>

        {/* Links Navigation - Mobile */}
        <div className="sm:hidden py-12 border-b border-white/10">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-8">
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
                 { label: "Cars", href: "/cars" },
                  { label: "Insurance Replacement", href: "/cars/insurance" },
                  { label: "Long-Term Car Rental", href: "/cars/longterm" },

                  { label: "Villas", href: "/villas" },
                  { label: "Events", href: "/events" },
                  { label: "Airport Transfer", href: "/cars/airport_transfer" },
                  { label: "Wedding Car Rental", href: "/cars/wedding_car_rental" },

                  { label: "Luxury Car Rental", href: "/cars/luxury_car_rental" },
                  { label: "Corporate Car Rental", href: "/cars/corporate_car_rental" },
                  { label: "Prom Car Rental", href: "/cars/prom_car_rental" },
                  { label: "Film, TV & Video Car Rental", href: "/cars/film_tv_car_rental" },
                  { label: "Film, TV & Video House Rental", href: "/film-tv-production" },
                  { label: "Ballroom", href: "/ballroom" },
                  { label: "Fifa World Cup 2026", href:"/fifa-world-cup" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-8">
              <FooterCol
                title="By Brand"
                links={[
                  { label: "Ferrari", href: "/cars?make=Ferrari" },
                  { label: "Lamborghini", href: "/cars?make=Lamborghini" },
                  { label: "Rolls Royce", href: "/cars?make=Rolls-Royce" },
                  { label: "Bentley", href: "/cars?make=Bentley" },
                  { label: "Porsche", href: "/cars?make=Porsche" },
                  { label: "Tesla", href: "/cars?make=Tesla" },
                  { label: "Audi", href: "/cars?make=Audi" },
                  { label: "McLaren", href: "/cars?make=McLaren" },
                  { label: "Range Rover", href: "/cars?make=Range%20Rover" },
                  { label: "Mercedes", href: "/cars?make=Mercedes" },
                ]}
              />

              <FooterCol
                title="By Type"
                links={[
                  { label: "Supercar", href: "/cars?category=Supercar" },
                  { label: "SUV", href: "/cars?category=SUV" },
                  { label: "Convertible", href: "/cars?category=Convertible" },
                  { label: "Chauffeur", href: "/cars?category=Chauffeur" },
                  { label: "Ultra-Luxury", href: "/cars?category=Ultra-Luxury" },
                  { label: "EV", href: "/cars?category=EV" },
                  { label: "Coupe | Sports", href: "/cars?category=Coupe%20%7C%20Sports" },
                  { label: "Sedan | 4-Door", href: "/cars?category=Sedan%20%7C%204-Door" },
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <p className="text-[12px] 2xl:text-sm font-normal text-white/80 uppercase tracking-wide">Subscribe for VIP updates & offers</p>

            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 focus-within:border-white/40 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-white placeholder-white/40 text-[12px] 2xl:text-sm px-3"
              />
              <button className="bg-white text-mist-900 text-[12px] 2xl:text-sm font-normal px-5 2xl:px-6 py-2 2xl:py-2.5 rounded-md hover:bg-mist-100 transition-colors flex-shrink-0">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-3 mt-1">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all">
                  <Icon size={16} className="2xl:w-5 2xl:h-5" />
                </button>
              ))}
              <button className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white">
                <div className="w-4 h-4 2xl:w-5 2xl:h-5"><TikTokIcon /></div>
              </button>
            </div>
          </div>
        </div>

        {/* Links Navigation Grid - Tablet and Up */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-8 2xl:gap-12 py-12 2xl:py-20 border-b border-white/10">
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
                  { label: "Cars", href: "/cars" },
                  { label: "Insurance Replacement", href: "/cars/insurance" },
                  { label: "Long-Term Car Rental", href: "/cars/longterm" },

                  { label: "Villas", href: "/villas" },
                  { label: "Events", href: "/events" },
                  { label: "Airport Transfer", href: "/cars/airport_transfer" },
                  { label: "Wedding Car Rental", href: "/cars/wedding_car_rental" },

                  { label: "Luxury Car Rental", href: "/cars/luxury_car_rental" },
                  { label: "Corporate Car Rental", href: "/cars/corporate_car_rental" },
                  { label: "Prom Car Rental", href: "/cars/prom_car_rental" },
                  { label: "Film, TV & Video Car Rental", href: "/cars/film_tv_car_rental" },
                  { label: "Film, TV & Video House Rental", href: "/film-tv-production" },
                  { label: "Ballroom", href: "/ballroom" },
                  { label: "Fifa World Cup 2026", href:"/fifa-world-cup" },
                ]}
          />

          <FooterCol
            title="By Brand"
            links={[
              { label: "Ferrari", href: "/cars?make=Ferrari" },
              { label: "Lamborghini", href: "/cars?make=Lamborghini" },
              { label: "Rolls Royce", href: "/cars?make=Rolls-Royce" },
              { label: "Bentley", href: "/cars?make=Bentley" },
              { label: "Porsche", href: "/cars?make=Porsche" },
              { label: "Tesla", href: "/cars?make=Tesla" },
              { label: "Audi", href: "/cars?make=Audi" },
              { label: "McLaren", href: "/cars?make=McLaren" },
              { label: "Range Rover", href: "/cars?make=Range%20Rover" },
              { label: "Mercedes", href: "/cars?make=Mercedes" },
            ]}
          />

          <FooterCol
            title="By Type"
            links={[
              { label: "Supercar", href: "/cars?category=Supercar" },
              { label: "SUV", href: "/cars?category=SUV" },
              { label: "Convertible", href: "/cars?category=Convertible" },
              { label: "Chauffeur", href: "/cars?category=Chauffeur" },
              { label: "Ultra-Luxury", href: "/cars?category=Ultra-Luxury" },
              { label: "EV", href: "/cars?category=EV" },
              { label: "Coupe | Sports", href: "/cars?category=Coupe%20%7C%20Sports" },
              { label: "Sedan | 4-Door", href: "/cars?category=Sedan%20%7C%204-Door" },
            ]}
          />

          {/* Newsletter & Socials */}
          <div className="sm:col-span-3 lg:col-span-2 flex flex-col gap-4 2xl:gap-6">
            <p className="text-[12px] 2xl:text-sm font-normal text-white/80 uppercase tracking-wide">Subscribe for VIP updates & offers</p>

            <div className="flex items-center bg-white/10 border border-white/20 rounded-lg 2xl:rounded-xl px-2 2xl:px-3 py-1.5 2xl:py-2.5 focus-within:border-white/40 transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-white placeholder-white/40 text-[12px] 2xl:text-sm px-3"
              />
              <button className="bg-white text-mist-900 text-[12px] 2xl:text-sm font-normal px-5 2xl:px-6 py-2 2xl:py-2.5 rounded-md 2xl:rounded-lg hover:bg-mist-100 transition-colors flex-shrink-0">
                Subscribe
              </button>
            </div>

            <div className="flex items-center gap-3 2xl:gap-4 mt-1">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all">
                  <Icon size={16} className="2xl:w-5 2xl:h-5" />
                </button>
              ))}
              <button className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white">
                <div className="w-4 h-4 2xl:w-5 2xl:h-5"><TikTokIcon /></div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal, and Payment Cards */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-8 2xl:pt-12">

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 2xl:gap-8">
            <p className="text-[12px] 2xl:text-lg text-white/40 text-center sm:text-left">
              ©2026 <span className="font-normal text-white/60">Vidi Vici.</span> All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-[11px] 2xl:text-lg text-white/30 italic">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <span className="mx-1">·</span>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <span className="mx-1">·</span>
              <a href="/sitemap" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>

          {/* Payment Cards - Using PNG images */}
          <div className="flex items-center gap-2 2xl:gap-4">
            <img 
              src="/card1.png" 
              alt="Visa" 
              className="h-5 sm:h-6 2xl:h-9 w-auto object-contain rounded"
            />
            <img 
              src="/card2.png" 
              alt="PayPal" 
              className="h-5 sm:h-6 2xl:h-9 w-auto object-contain rounded"
            />
            <img 
              src="/card3.png" 
              alt="Shop Pay" 
              className="h-5 sm:h-6 2xl:h-9 w-auto object-contain rounded"
            />
            <img 
              src="/card4.png" 
              alt="Google Pay" 
              className="h-5 sm:h-6 2xl:h-9 w-auto object-contain rounded"
            />
            <img 
              src="/card5.png" 
              alt="Mastercard" 
              className="h-5 sm:h-6 2xl:h-9 w-auto object-contain rounded"
            />
          </div>

        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="flex flex-col gap-3 2xl:gap-5">
      <p className="text-[12px] 2xl:text-sm font-normal text-white/80 uppercase tracking-wide">{title}</p>
      <ul className="flex flex-col gap-2 2xl:gap-3">
        {links.map((link) => {
          const label = typeof link === "string" ? link : link.label;
          const href = typeof link === "string" ? "#" : link.href;
          return (
            <li key={label}>
              <a href={href} className="text-[12px] 2xl:text-lg text-[#EDEDED]/70 hover:text-[#EDEDED] transition-colors duration-150 leading-snug">
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}