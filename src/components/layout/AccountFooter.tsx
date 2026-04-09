import Link from "next/link"

export default function FooterBottom() {
  return (
    <div className="border-t border-mist-100 bg-white">
      <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 py-4 2xl:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 2xl:gap-6">

        {/* Left: Copyright + Links */}
        <p className="text-xs 2xl:text-xl text-mist-400 text-center sm:text-left">
          ©2025 <span className="font-semibold text-mist-700">Vidi Vici.</span> All rights reserved.
          {" · "}
          <Link href="/privacy" className="hover:text-mist-700 transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-mist-700 transition-colors">Terms</Link>
          {" · "}
          <Link href="/sitemap" className="hover:text-mist-700 transition-colors">Sitemap</Link>
        </p>

        {/* Right: Payment icons */}
        <div className="flex items-center gap-2 2xl:gap-4">
          {/* Visa */}
          <div className="flex items-center justify-center h-6 2xl:h-10 px-2 2xl:px-4 bg-white border border-mist-200 rounded 2xl:rounded-lg">
            <svg viewBox="0 0 50 16" className="h-3.5 2xl:h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text>
            </svg>
          </div>

          {/* PayPal */}
          <div className="flex items-center justify-center h-6 2xl:h-10 px-2 2xl:px-4 bg-white border border-mist-200 rounded 2xl:rounded-lg">
            <svg viewBox="0 0 60 16" className="h-3.5 2xl:h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#003087">Pay</text>
              <text x="20" y="13" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#009CDE">Pal</text>
            </svg>
          </div>

          {/* Shop Pay */}
          <div className="flex items-center justify-center h-6 2xl:h-10 px-2.5 2xl:px-4 bg-[#5a31f4] rounded 2xl:rounded-lg">
            <span className="text-white text-[10px] 2xl:text-lg font-bold tracking-tight">shop</span>
          </div>

          {/* Google Pay */}
          <div className="flex items-center justify-center h-6 2xl:h-10 px-2 2xl:px-4 bg-white border border-mist-200 rounded 2xl:rounded-lg">
            <svg viewBox="0 0 52 16" className="h-3.5 2xl:h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="13" fontFamily="Arial" fontSize="10" fill="#4285F4" fontWeight="500">G</text>
              <text x="9" y="13" fontFamily="Arial" fontSize="10" fill="#5F6368" fontWeight="500">Pay</text>
            </svg>
          </div>

          {/* Mastercard */}
          <div className="flex items-center justify-center h-6 2xl:h-10 w-9 2xl:w-14 bg-white border border-mist-200 rounded 2xl:rounded-lg">
            <div className="flex -space-x-2 2xl:-space-x-3">
              <div className="w-4 2xl:w-6 h-4 2xl:h-6 rounded-full bg-[#EB001B] opacity-90" />
              <div className="w-4 2xl:w-6 h-4 2xl:h-6 rounded-full bg-[#F79E1B] opacity-90" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}