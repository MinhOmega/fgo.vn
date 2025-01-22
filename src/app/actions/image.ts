"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache, unstable_cacheLife as cacheLife } from "next/cache";

// Define types more precisely
type ImageData = {
  id: string;
  code: string;
  number: number;
  url: string;
  folder: string;
  created_at: Date;
  updated_at: Date;
};

// Cache key and options
const CACHE_TAG = "images";
const CACHE_REVALIDATE_TIME = 3600; // 1 hour in seconds

// Get all images from database
export const getImages = async (): Promise<ImageData[]> => {
  'use cache'
  cacheLife('days')
  try {
    const images = await prisma.image.findMany({
      orderBy: {
        number: "asc",
      },
      select: {
        id: true,
        code: true,
        number: true,
        url: true,
        folder: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!images || images.length === 0) {
      return [];
    }

    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

// Helper function to get a single image by ID (with caching)
export const getImageById = async (id: string): Promise<ImageData | null> => {
  'use cache'
  cacheLife('days')
  return unstable_cache(
    async () => {
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
          },
        });

        return image;
      } catch (error) {
        console.error(`Error fetching image with ID ${id}:`, error);
        return null;
      }
    },
    [`${CACHE_TAG}-${id}`],
    {
      revalidate: CACHE_REVALIDATE_TIME,
      tags: [CACHE_TAG, `${CACHE_TAG}-${id}`],
    },
  )();
};
