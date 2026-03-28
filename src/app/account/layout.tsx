"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { User, CalendarDays, Heart, FileText, CreditCard, LogOut } from "lucide-react"

const SIDEBAR_ITEMS = [
  { label: "Personal Information", href: "/account", icon: User },
  { label: "My Bookings", href: "/account/bookings", icon: CalendarDays },
  { label: "My Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Documents", href: "/account/documents", icon: FileText },
  { label: "Payment Methods", href: "/account/payment-methods", icon: CreditCard },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user) return null

  const user = session.user
  const initials = (user.name || user.email || "U").charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* Avatar + Name */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500 mb-3">
                  {initials}
                </div>
                <p className="font-semibold text-gray-900 text-lg">{user.name || "User"}</p>
                <p className="text-sm text-gray-400">{user.name || user.email}</p>
              </div>

              {/* Nav Links */}
              <nav className="mt-4 space-y-1">
                {SIDEBAR_ITEMS.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                      {isActive && (
                        <svg className="ml-auto" width="6" height="10" viewBox="0 0 6 10" fill="none">
                          <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Logout */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition w-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
