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
  onNavClick?: () => void
}

export default function AccountSidebar({ name, email, profileImage, onNavClick }: AccountSidebarProps) {
  const pathname = usePathname()
  const initials = (name || email || "U").charAt(0).toUpperCase()

  return (
    <aside className="w-full lg:w-80 2xl:w-96 flex-shrink-0 lg:sticky lg:top-16 2xl:top-28 lg:self-start">
      <div className="bg-white border border-mist-200 overflow-hidden">

        {/* ── Avatar + Name ─────────────────────────────────── */}
        <div className="flex flex-col items-center text-center px-6 2xl:px-8 pt-8 2xl:pt-12 pb-6 2xl:pb-8">
          <div className="w-20 2xl:w-28 h-20 2xl:h-28 rounded-full bg-mist-100 flex items-center justify-center text-2xl 2xl:text-4xl font-bold text-mist-400 mb-4 2xl:mb-6 overflow-hidden ring-2 ring-mist-100">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileImage} alt="Profile" loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <p className="font-semibold text-mist-900 text-base 2xl:text-2xl leading-tight">{name || "User"}</p>
          <p className="text-sm 2xl:text-xl text-mist-400 mt-0.5 2xl:mt-2">{name || email}</p>
        </div>

        {/* ── Nav Items ─────────────────────────────────────── */}
        <nav className="border-t border-b border-mist-100">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onNavClick?.()}
                className={`flex items-center justify-between px-6 2xl:px-8 py-4 2xl:py-6 my-2 2xl:my-3 text-sm 2xl:text-xl border-b border-mist-100 transition-colors ${
                  isActive
                    ? "bg-mist-900 text-white font-semibold"
                    : "text-mist-600 hover:bg-mist-50 hover:text-mist-900 font-normal"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="2xl:w-3 2xl:h-5">
                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Logout ────────────────────────────────────────── */}
        <div className="px-6 2xl:px-8 py-5 2xl:py-8">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2.5 2xl:gap-4 text-sm 2xl:text-xl text-mist-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} className="2xl:w-6 2xl:h-6" />
            Logout
          </button>
        </div>

      </div>
    </aside>
  )
}