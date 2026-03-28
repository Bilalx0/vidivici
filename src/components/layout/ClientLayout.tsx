"use client"

import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return <SessionProvider>{children}</SessionProvider>
  }

  return (
    <SessionProvider>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </SessionProvider>
  )
}
