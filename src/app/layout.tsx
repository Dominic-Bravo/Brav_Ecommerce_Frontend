import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { QueryProviders } from "@/providers/query-providers";
import { Toaster } from "sonner";

import "./globals.css";
import { Header } from "@/features/components/mainpage/Header";
import { Footer } from "@/features/components/mainpage/Footer";

// Configure DM Sans for body, buttons, navigation, prices, etc.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Configure Playfair Display for hero and section headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brav",
  description: "Premium fashion and technology products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-brav-white text-brav-charcoal">
        <QueryProviders>
          <Header />
          {children}
          <Footer/>
          <Toaster richColors position="top-center" />
        </QueryProviders>
      </body>
    </html>
  );
}
