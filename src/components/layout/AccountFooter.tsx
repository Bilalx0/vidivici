import Link from "next/link"

export default function FooterBottom() {
  return (
    <div className="border-t border-mist-100 bg-white">
      <div className="sm:px-16 lg:px-20 px-6 2xl:px-32 py-4 2xl:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 2xl:gap-6">

        {/* Left: Copyright + Links */}
        <p className="text-xs 2xl:text-lg text-mist-400 text-center sm:text-left">
          ©2025 <span className="font-semibold text-mist-700">Vidi Vici.</span> All rights reserved.
          {" · "}
          <Link href="/privacy" className="hover:text-mist-700 transition-colors">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-mist-700 transition-colors">Terms</Link>
          {" · "}
          <Link href="/sitemap" className="hover:text-mist-700 transition-colors">Sitemap</Link>
        </p>

        {/* Payment Cards - Using PNG images */}
          <div className="flex items-center gap-2 2xl:gap-4">
            <img 
              src="/card1.png" 
              alt="Visa" 
              className="h-4 sm:h-6 2xl:h-9 w-auto object-contain rounded"
            />
            <img 
              src="/card2.png" 
              alt="PayPal" 
              className="h-4 sm:h-5 2xl:h-7 w-auto object-contain rounded"
            />
            <img 
              src="/card3.png" 
              alt="Shop Pay" 
              className="h-4 sm:h-5 2xl:h-7 w-auto object-contain rounded"
            />
            <img 
              src="/card4.png" 
              alt="Google Pay" 
              className="h-4 sm:h-5 2xl:h-7 w-auto object-contain rounded"
            />
            <img 
              src="/card5.png" 
              alt="Mastercard" 
              className="h-4 sm:h-5 2xl:h-7 w-auto object-contain rounded"
            />
          </div>

      </div>
    </div>
  )
}