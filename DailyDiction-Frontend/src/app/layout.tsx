import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dailydiction.id"),
  title: {
    default: "Daily Diction - Portal Berita & Ulasan Game",
    template: "%s | Daily Diction",
  },
  description:
    "Pusat informasi berita game, rilisan konsol, hardware PC, ulasan game, dan tren pop-culture terbaru.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://dailydiction.id",
    siteName: "Daily Diction",
    title: "Daily Diction - Portal Berita & Ulasan Game",
    description:
      "Pusat informasi berita game, rilisan konsol, hardware PC, ulasan game, dan tren pop-culture terbaru.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* AdSense HTML murni */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9670478748166310"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}

        {/* Twitter / X Widget */}
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P9HSCRGS84"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P9HSCRGS84');
            `,
          }}
        />
      </body>
    </html>
  );
}