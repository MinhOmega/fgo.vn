import { MetadataRoute } from 'next';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://fgo-vn.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
} 