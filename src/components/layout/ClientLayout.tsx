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
  const isCarSlugPage =
    segments[0] === "cars" &&
    segments.length === 2 &&
    !carStaticPages.has(segments[1].toLowerCase());

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

  // Car detail layout: only /cars/[slug]
  if (isCarSlugPage) {
    return (
      <SessionProvider>
        <AccountHeader />
        <main className="min-h-screen">{children}</main>
        <Footer />
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