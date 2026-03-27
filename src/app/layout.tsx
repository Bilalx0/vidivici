import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300","400","500","600","700"],
});

export const metadata: Metadata = {
  title: "Falcon Car Rental | Exotic & Luxury Car Rental Los Angeles",
  description:
    "Premium luxury and exotic car rental in Los Angeles and Miami. Rent Lamborghini, Ferrari, Rolls-Royce, Bentley, Porsche and more. Free delivery available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}