'use server'

import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

export const getImages = unstable_cache(
  async () => {
    const timeLabel = new Date().toISOString();
    console.time(timeLabel);
    
    try {
      // Add timeout to Prisma query
      const images = await Promise.race([
        prisma.image.findMany({
          orderBy: {
            number: 'asc',
          },
          select: {
            id: true,
            code: true,
            number: true,
            url: true,
            folder: true,
            created_at: true,
            updated_at: true,
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 5000)
        )
      ]) as Awaited<ReturnType<typeof prisma.image.findMany>>;

      console.timeEnd(timeLabel);
      
      if (!images) {
        throw new Error('No images returned from database');
      }

      return images.map(image => ({
        ...image,
        created_at: image.created_at ?? new Date(),
        updated_at: image.updated_at ?? new Date()
      }));
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error; // Re-throw to handle in the component
    }
  },
  ['images-list'],
  {
    revalidate: 60, // Cache for 1 minute instead of 1 hour to prevent stale data
    tags: ['images'],
  }
);

export const getImageById = unstable_cache(
  async (id: string) => {
    try {
      const image = await prisma.image.findUnique({
        where: { id },
        select: {
          id: true,
          code: true,
          number: true,
          url: true,
          folder: true,
          created_at: true,
          updated_at: true,
        }
      })

      if (!image) return null

      return {
        ...image,
        created_at: image.created_at ?? new Date(),
        updated_at: image.updated_at ?? new Date()
      }
    } catch (error) {
      console.error('Error fetching image:', error)
      return null
    }
  },
  ['image-detail'],
  {
    revalidate: 60,
    tags: ['image'],
  }
) 