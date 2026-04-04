"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import AccountSidebar from "@/components/layout/AccountSidebar"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [mobilePopupOpen, setMobilePopupOpen] = useState(false)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetch("/api/account/profile")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.image) setProfileImage(data.image)
        })
        .catch(() => {})
    }
  }, [session])

  // Auto-open mobile popup on route changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      // Deep-link to a sub-page → auto-open on mobile
      if (pathname !== "/account") {
        setMobilePopupOpen(true)
      }
      return
    }
    // Subsequent navigations always open the popup
    setMobilePopupOpen(true)
  }, [pathname])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-mist-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-mist-200 border-t-mist-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session?.user) return null

  const { user } = session

  const isDocumentsPage = pathname.startsWith("/account/documents")

  const pageTitle = pathname.startsWith("/account/documents/add-license")
    ? "Add Driving License"
    : pathname.startsWith("/account/documents/add-insurance")
    ? "Add Insurance Policy"
    : pathname.startsWith("/account/documents/add-id")
    ? "Add ID / Passport"
    : "Documents"

  return (
    <>
      {/* CONTENT */}
      <div className="bg-mist-100 min-h-screen pt-16 2xl:pt-28">
        <div className="w-full mx-auto 2xl:max-w-[1920px]">
          <div className="flex flex-col lg:flex-row gap-3">

            {/* SIDEBAR */}
            <AccountSidebar
              name={user.name}
              email={user.email}
              profileImage={profileImage}
              onNavClick={() => setMobilePopupOpen(true)}
            />

            {/* PAGE CONTENT — desktop: inline  |  mobile: full-screen popup */}
            <main
              className={`
                flex-1 min-w-0 pr-0 sm:pr-3 lg:pr-8 2xl:pr-20 pb-6 lg:pb-8 2xl:pb-12
                ${mobilePopupOpen ? "fixed inset-0 z-50 bg-white overflow-y-auto" : "hidden"}
                lg:block lg:static lg:inset-auto lg:z-auto lg:bg-transparent lg:overflow-visible
              `}
            >
              {/* Mobile popup header — only on documents pages */}
              {isDocumentsPage && (
                <div className="lg:hidden sticky top-0 z-10 flex items-center gap-3 bg-white border-b border-mist-200 px-5 py-3.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setMobilePopupOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-mist-500 hover:bg-mist-100 hover:text-mist-700 transition-colors"
                    aria-label="Back"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-semibold text-mist-900">{pageTitle}</h3>
                </div>
              )}

              {/* Non-documents: show a back button only */}
              {!isDocumentsPage && (
                <div className="lg:hidden sticky top-0 z-10 flex items-center bg-white border-b border-mist-200 px-5 py-3.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setMobilePopupOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-mist-500 hover:bg-mist-100 hover:text-mist-700 transition-colors"
                    aria-label="Back"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              )}

              <div className={mobilePopupOpen ? "px-4 py-4 lg:px-0 lg:py-0" : ""}>
                {children}
              </div>
            </main>

          </div>
        </div>
      </div>
    </>
  )
}