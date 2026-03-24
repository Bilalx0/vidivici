import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700"], // optional but recommended
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
      <body className={`${raleway.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}