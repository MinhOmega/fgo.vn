import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FGO Image Gallery",
  description: "Browse and explore the FGO image collection featuring high quality artwork",
  openGraph: {
    title: "FGO Image Gallery",
    description: "Browse and explore the FGO image collection featuring high quality artwork",
    images: [{
      url: "https://fgo-gallery.vercel.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "FGO Gallery Preview"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "FGO Image Gallery",
    description: "Browse and explore the FGO image collection featuring high quality artwork",
    images: ["https://fgo-gallery.vercel.app/og-image.png"]
  }
}; 