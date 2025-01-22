import { getImages } from "@/app/actions/image";
import { MetadataRoute } from 'next';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://fgo-vn.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const images = await getImages();

    if (!images || images.length === 0) {
      return [
        {
          url: DOMAIN,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 1,
        },
      ];
    }

    // Generate image page URLs
    const imageUrls = images.map((image) => ({
      url: `${DOMAIN}/i/${image.id}`,
      lastModified: new Date(image.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Add static pages
    const staticPages = [
      {
        url: DOMAIN,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      // Add other static pages here if needed
    ];

    return [...staticPages, ...imageUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least the static pages if image fetching fails
    return [
      {
        url: DOMAIN,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ];
  }
} 