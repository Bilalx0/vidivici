"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

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

const isVillaOrCarSlug =
  (segments[0] === "cars" && segments.length === 2) ||
  (segments[0] === "villas" && segments.length === 2) ||
  (segments[0] === "events" && segments.length === 2);

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

  // Villas + Cars layout
  if (isVillaOrCarSlug) {
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