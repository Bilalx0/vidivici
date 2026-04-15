import { Outfit, Raleway } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300","400","500","600","700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400","500","600","700"],
});

export const metadata: Metadata = {
  title: "VIDIVICI | Exotic & Luxury Car Rental Los Angeles",
  description:
    "Premium luxury and exotic car rental in Los Angeles and Miami. Rent Lamborghini, Ferrari, Rolls-Royce, Bentley, Porsche and more.",
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${raleway.variable} antialiased font-outfit`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}