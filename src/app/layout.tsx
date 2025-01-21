import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { Viewport } from 'next'

// Optimize font loading
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Add viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export { metadata } from './layout-metadata';

// Move structuredData outside component to prevent recreation on each render
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebSite", "ImageGallery"], // Combine types for better SEO
      "@id": "https://fgo-gallery.vercel.app/#website",
      "name": "Thư Viện Ảnh FGO",
      "url": "https://fgo-gallery.vercel.app",
      "description": "Kho hình ảnh Fate/Grand Order chất lượng cao, lưu trữ vĩnh viễn",
      "image": "https://fgo-gallery.vercel.app/og-image.png",
      "inLanguage": "vi-VN",
      "potentialAction": [{
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://fgo-gallery.vercel.app/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }]
    },
    {
      "@type": "ImageGallery",
      "@id": "https://fgo-gallery.vercel.app/#gallery",
      "name": "Bộ Sưu Tập Ảnh FGO",
      "description": "Thư viện hình ảnh Fate/Grand Order với chất lượng cao nhất",
      "image": "https://fgo-gallery.vercel.app/og-image.png",
      "url": "https://fgo-gallery.vercel.app"
    }
  ]
};

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html 
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable}`}
      // Add dark mode support
      data-theme="light"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Schema.org markup for rich results */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      </head>
      <body 
        className="min-h-screen antialiased bg-white dark:bg-gray-900"
        // Add better accessibility
        role="document"
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:p-4"
        >
          Chuyển đến nội dung chính
        </a>
        
        <main id="main-content">
          {children}
          {modal}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
