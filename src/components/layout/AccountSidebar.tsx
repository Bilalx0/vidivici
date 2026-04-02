"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { User, CalendarDays, Heart, FileText, CreditCard, LogOut } from "lucide-react"

const NAV_ITEMS = [
  { label: "Personal Information", href: "/account",                  icon: User        },
  { label: "My Bookings",          href: "/account/bookings",         icon: CalendarDays },
  { label: "My Wishlist",          href: "/account/wishlist",         icon: Heart       },
  { label: "Documents",            href: "/account/documents",        icon: FileText    },
  { label: "Payment Methods",      href: "/account/payment-methods",  icon: CreditCard  },
]

interface AccountSidebarProps {
  name: string | null | undefined
  email: string | null | undefined
  profileImage: string | null
}

export default function AccountSidebar({ name, email, profileImage }: AccountSidebarProps) {
  const pathname = usePathname()
  const initials = (name || email || "U").charAt(0).toUpperCase()

  return (
    <aside className="w-full lg:w-80 2xl:w-96 flex-shrink-0 lg:sticky lg:top-16 2xl:top-28 lg:self-start">
      <div className="bg-white border border-mist-200 overflow-hidden">

        {/* ── Avatar + Name ─────────────────────────────────── */}
        <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
          <div className="w-20 h-20 rounded-full bg-mist-100 flex items-center justify-center text-2xl font-bold text-mist-400 mb-4 overflow-hidden ring-2 ring-mist-100">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <p className="font-semibold text-mist-900 text-base leading-tight">{name || "User"}</p>
          <p className="text-sm text-mist-400 mt-0.5">{name || email}</p>
        </div>

        {/* ── Nav Items ─────────────────────────────────────── */}
        <nav className="border-t border-b border-mist-100">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-6 py-4 my-2 text-sm border-b border-mist-100 transition-colors ${
                  isActive
                    ? "bg-mist-900 text-white font-semibold"
                    : "text-mist-600 hover:bg-mist-50 hover:text-mist-900 font-normal"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Logout ────────────────────────────────────────── */}
        <div className="px-6 py-5">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2.5 text-sm text-mist-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

      </div>
    </aside>
  )
}