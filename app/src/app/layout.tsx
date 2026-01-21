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
  title: "CalcPanda | Professional Online Calculators",
  description:
    "CalcPanda is a professional online calculation factory that provides accurate, SEO-friendly tools for finance, health, and engineering with real-world insights.",
  other: {
    "google-adsense-account": "ca-pub-1856020780538432",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "CalcPanda",
      "url": "https://calcpanda.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://calcpanda.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "name": "CalcPanda",
      "url": "https://calcpanda.com",
      "logo": "https://calcpanda.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-0199",
        "contactType": "Customer Service",
        "areaServed": "US",
        "availableLanguage": "En"
      },
      "sameAs": [
        "https://twitter.com/calcpanda",
        "https://www.facebook.com/calcpanda",
        "https://www.linkedin.com/company/calcpanda"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
