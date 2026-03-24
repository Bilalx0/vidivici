"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LayoutDashboard, Car, FolderOpen, Tag, CalendarDays, FileText, HelpCircle, Star, Mail, Settings, ArrowLeft, Menu } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Cars", href: "/admin/cars", icon: Car },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Brands", href: "/admin/brands", icon: Tag },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 z-40 p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-black text-white p-2 rounded"
        >
          <Menu size={18} />
        </button>
      </div>

      <aside className={`fixed top-0 left-0 h-full bg-black z-30 transition-transform duration-200 w-64 ${collapsed ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="text-xl font-bold text-white tracking-wider">
            FALCON <span className="text-xs text-gray-400 font-normal">ADMIN</span>
          </Link>
        </div>

        <nav className="p-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setCollapsed(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white text-black font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={16} strokeWidth={1.5} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
