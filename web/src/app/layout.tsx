import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : typeof process !== "undefined" && process.env.VERCEL_URL
        ? new URL(`https://${process.env.VERCEL_URL}`)
        : new URL("https://edaphic.xyz"),
  title: {
    default: "Edaphic",
    template: "%s · Edaphic",
  },
  description:
    "of, produced by, or influenced by the soil. AI-native venture studio.",
  applicationName: "Edaphic",
  keywords: [
    "Edaphic",
    "AI-native venture studio",
    "soil",
    "design",
    "technology",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edaphic.xyz/",
    siteName: "Edaphic",
    title: "Edaphic",
    description:
      "of, produced by, or influenced by the soil. AI-native venture studio.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edaphic",
    description:
      "of, produced by, or influenced by the soil. AI-native venture studio.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg" },
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-white text-neutral-900 dark:bg-black dark:text-neutral-100`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
