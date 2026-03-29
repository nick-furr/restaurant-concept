import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://restaurant.nickfurr.com"),
  title: "The Grand Table",
  description:
    "Full-stack restaurant concept with online reservations, automated email confirmations via Resend, and a protected owner dashboard. Built with Next.js, TypeScript, and Supabase.",
  openGraph: {
    title: "The Grand Table",
    description:
      "Full-stack restaurant concept with online reservations, automated email confirmations via Resend, and a protected owner dashboard. Built with Next.js, TypeScript, and Supabase.",
    url: "https://restaurant.nickfurr.com",
    siteName: "Nick Furr — Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The Grand Table — Fine Dining Concept",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Grand Table",
    description:
      "Full-stack restaurant concept with online reservations, automated email confirmations via Resend, and a protected owner dashboard. Built with Next.js, TypeScript, and Supabase.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
