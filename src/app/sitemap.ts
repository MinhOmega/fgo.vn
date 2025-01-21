import { getImages } from "@/app/actions/image";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://fgo-vn.vercel.app';
const TIMEOUT_DURATION = 30000;

const createTimeoutPromise = () => 
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${TIMEOUT_DURATION/1000} seconds`));
    }, TIMEOUT_DURATION);
  });

export default async function sitemap() {
  try {
    // Fetch images with timeout handling
    const images = await Promise.race([
      getImages(),
      createTimeoutPromise()
    ]) as Awaited<ReturnType<typeof getImages>>;

    if (!images) return [];

    // Generate image page URLs
    const imageUrls = images.map((image) => ({
      url: `${DOMAIN}/i/${image.id}`,
      lastModified: new Date(image.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Add static pages
    const staticPages = [
      {
        url: DOMAIN,
        lastModified: new Date(),
        changeFrequency: 'daily',
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
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
} 