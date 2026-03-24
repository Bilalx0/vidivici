import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "@/components/layout/ClientLayout"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Falcon Car Rental | Exotic & Luxury Car Rental Los Angeles",
  description: "Premium luxury and exotic car rental in Los Angeles and Miami. Rent Lamborghini, Ferrari, Rolls-Royce, Bentley, Porsche and more. Free delivery available.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
