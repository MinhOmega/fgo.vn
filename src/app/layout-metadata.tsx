import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://fgo-gallery.vercel.app'),
  title: {
    template: '%s | Thư Viện Ảnh FGO',
    default: 'Thư Viện Ảnh FGO - Kho Hình Ảnh Fate/Grand Order Chất Lượng Cao'
  },
  description: 'Khám phá bộ sưu tập hình ảnh Fate/Grand Order (FGO) chất lượng cao, cập nhật liên tục. Tải và lưu trữ vĩnh viễn các artwork servant, craft essence và nhiều hơn nữa.',
  keywords: [
    'FGO', 'Fate Grand Order', 'Thư viện Ảnh FGO', 'Hình Ảnh FGO', 
    'Artwork FGO', 'Servant FGO', 'Craft Essence', 'Game mobile Nhật Bản',
    'Fate/Grand Order Việt Nam', 'FGO Việt Nam', 'Ảnh FGO HD',
    'Fate Series', 'Type-Moon', 'Anime Game', 'Gacha Game'
  ],
  authors: [{ name: 'FGO Gallery Team' }],
  creator: 'FGO Gallery Team',
  publisher: 'FGO Gallery',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Thư Viện Ảnh FGO',
    title: 'Thư Viện Ảnh FGO - Kho Hình Ảnh Fate/Grand Order Chất Lượng Cao',
    description: 'Khám phá bộ sưu tập hình ảnh Fate/Grand Order (FGO) chất lượng cao, cập nhật liên tục. Tải và lưu trữ vĩnh viễn các artwork servant, craft essence và nhiều hơn nữa.',
    locale: 'vi_VN',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Xem trước Thư viện FGO'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thư Viện Ảnh FGO - Kho Hình Ảnh FGO Chất Lượng Cao',
    description: 'Khám phá bộ sưu tập hình ảnh Fate/Grand Order (FGO) chất lượng cao, cập nhật liên tục.',
    images: ['/og-image.png'],
    creator: '@fgogallery',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://fgo-gallery.vercel.app',
    languages: {
      'vi-VN': 'https://fgo-gallery.vercel.app',
      'en-US': 'https://fgo-gallery.vercel.app/en'
    }
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'baidu-site-verification': 'your-baidu-code',
    'yandex-verification': 'your-yandex-code',
    'facebook-domain-verification': 'your-facebook-code',
  },
}; 