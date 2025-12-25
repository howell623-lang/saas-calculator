import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Micro SaaS Factory | JSON-driven calculators",
  description:
    "A JSON-driven micro SaaS factory that ships SEO-friendly calculators with zero-code deployments.",
  other: {
    "google-adsense-account": "ca-pub-1856020780538432",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1856020780538432"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).onload = function () {
                console.log("AdSense script loaded");
              };
              window.onerror = function(message, source, lineno, colno, error) {
                if (message.includes('adsbygoogle') || (source && source.includes('googlesyndication'))) {
                  console.error('AdSense Error:', message, source, lineno, colno, error);
                }
              };
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
