"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import Header from "./Header";
import Footer from "./Footer";
import ChatBot from "@/components/ChatBot";

import AccountHeader from "./AccountHeader";
import AccountFooter from "./AccountFooter";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isAccount = pathname.startsWith("/account");
  const isAuth = pathname === "/login" || pathname === "/register";

  const segments = pathname.split("/").filter(Boolean);

  const carStaticPages = new Set(["experience", "extraordinary", "insurance", "longterm"]);
  const eventStaticPages = new Set(["ballroom"]);

  const isHyphenSlug = (slug: string) => slug.includes("-") && !slug.includes("_");

const isCarSlugPage =
  segments[0] === "cars" &&
  segments.length === 2 &&
  !carStaticPages.has(segments[1].toLowerCase()) &&
  isHyphenSlug(segments[1]);  // ← added

const isVillaSlugPage =
  segments[0] === "villas" &&
  segments.length === 2 &&
  isHyphenSlug(segments[1]);  // ← added

const isBlogSlugPage =
  segments[0] === "blog" &&
  segments.length === 2 &&
  isHyphenSlug(segments[1]);  // ← added

  const isEventSlugPage =
    segments[0] === "events" &&
    segments.length === 2 &&
    !eventStaticPages.has(segments[1].toLowerCase());

  const isBooking = pathname === "/booking" || pathname.startsWith("/booking/");

  // Admin layout
  if (isAdmin) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  // Account + Login/Register layout
  if (isAccount || isAuth) {
    return (
      <SessionProvider>
        <AccountHeader />
        <main className="min-h-screen">{children}</main>
        <AccountFooter />
        <ChatBot />
      </SessionProvider>
    );
  }

  // Booking layout: center dark logo only + account footer
  if (isBooking) {
    return (
      <SessionProvider>
        <header className="sticky top-0 z-50 bg-white border-b border-mist-200">
          <div className="h-20 flex items-center justify-center">
            <Link href="/" className="relative w-10 h-10">
              <Image src="/Logo 2.png" alt="Vidi Vici" fill className="object-contain" />
            </Link>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <AccountFooter />
      </SessionProvider>
    );
  }

  // Car/Villa detail: no ChatBot
  if (isCarSlugPage || isVillaSlugPage || isBlogSlugPage) {
    return (
      <SessionProvider>
        <AccountHeader />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </SessionProvider>
    );
  }

  // Event detail: keep ChatBot
  if (isEventSlugPage) {
    return (
      <SessionProvider>
        <AccountHeader />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatBot />
      </SessionProvider>
    );
  }

  // Default website layout
  return (
    <SessionProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ChatBot />
    </SessionProvider>
  );
}