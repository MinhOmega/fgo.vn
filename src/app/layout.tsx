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
  title: "Thư Viện Ảnh FGO",
  description: "Duyệt và khám phá bộ sưu tập hình ảnh FGO chất lượng cao",
  openGraph: {
    title: "Thư Viện Ảnh FGO",
    description: "Duyệt và khám phá bộ sưu tập hình ảnh FGO chất lượng cao",
    images: [{
      url: "https://fgo-gallery.vercel.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "Xem trước Thư viện FGO"
    }]
  },
  twitter: {
    card: "summary_large_image", 
    title: "Thư Viện Ảnh FGO",
    description: "Duyệt và khám phá bộ sưu tập hình ảnh FGO chất lượng cao",
    images: ["https://fgo-gallery.vercel.app/og-image.png"]
  }
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {modal}
      </body>
    </html>
  );
}
