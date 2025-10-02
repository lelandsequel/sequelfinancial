import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "AmCorCo - Revolutionary Oil Spill Remediation Technology",
  description: "Plant-based oil spill cleanup solution that converts chemicals to H2O and CO2. Safer, cleaner, and more effective than traditional methods. Featured in Engineering 10.",
  keywords: "oil spill cleanup, environmental remediation, plant-based absorbent, Amcor Sorbe, bioremediation, eco-friendly cleanup",
  authors: [{ name: "AmCorCo" }],
  openGraph: {
    title: "AmCorCo - Revolutionary Oil Spill Remediation",
    description: "Plant-based solution for oil spill cleanup. Converts harmful chemicals to H2O and CO2 through natural bioremediation.",
    type: "website",
    locale: "en_US",
    siteName: "AmCorCo",
  },
  twitter: {
    card: "summary_large_image",
    title: "AmCorCo - Revolutionary Oil Spill Remediation",
    description: "Plant-based solution for oil spill cleanup. Eco-friendly and effective.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1E5A6E" />
      </head>
      <body className="font-sans">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
