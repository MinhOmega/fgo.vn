import Image from "next/image"
import { getImages } from "@/app/actions/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { unstable_cache } from 'next/cache';
import { headers } from 'next/headers';

type Props = {
  params: { id: string }
}

// Generate static params for all image IDs
export async function generateStaticParams() {
  try {
    const images = await getImages();
    return images.map((image) => ({
      id: image.id,
    }));
  } catch (error) {
    console.error("Error generating static params for image page:", error);
    return []; // Return empty array if fetch fails
  }
}

// Add dynamic indicator
export const dynamic = 'force-dynamic';

// Cache the metadata generation
const getMetadata = unstable_cache(
  async (id: string) => {
    try {
      const images = await getImages();
      const image = images.find(img => img.id === id);
      
      if (!image) {
        return {
          title: 'Không Tìm Thấy Hình Ảnh',
          description: 'Không thể tìm thấy hình ảnh được yêu cầu'
        }
      }

      return {
        title: `Hình Ảnh FGO ${image.code} | Thư Viện FGO`,
        description: `Xem chi tiết tác phẩm FGO ${image.code} từ thư mục ${image.folder}`,
        openGraph: {
          title: `Hình Ảnh FGO ${image.code}`,
          description: `Xem chi tiết tác phẩm FGO ${image.code}`,
          images: [image.url]
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo metadata:", error);
      return {
        title: 'Thư Viện FGO',
        description: 'Xem bộ sưu tập tác phẩm FGO'
      }
    }
  },
  ['image-metadata'],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ['image-metadata']
  }
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Force dynamic rendering by reading headers
  headers();
  return getMetadata(params.id);
}

export default async function ImagePage({ params }: Props) {
  try {
    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout after 10 seconds'));
      }, 10000);
    });

    // Race between the fetch and timeout
    const images = await Promise.race([
      getImages(),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof getImages>>;

    if (!images || images.length === 0) {
      throw new Error("Failed to fetch images");
    }

    const image = images.find(img => img.id === params.id);

    if (!image) {
      notFound();
    }

    return (
      <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
        <main className="max-w-4xl mx-auto" role="main">
          <Link 
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            aria-label="Return to gallery"
          >
            <span className="inline-block">←</span>
            Back to gallery
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-colors">
            <div className="relative aspect-video">
              <Image
                src={image.url}
                alt={`FGO artwork ${image.code} from folder ${image.folder}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                quality={90}
              />
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Image Details
              </h1>
              <div className="space-y-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="font-semibold text-gray-700 dark:text-gray-300">Code</dt>
                    <dd className="text-lg text-gray-900 dark:text-white mt-1">{image.code}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-700 dark:text-gray-300">Number</dt>
                    <dd className="text-lg text-gray-900 dark:text-white mt-1">{image.number}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-700 dark:text-gray-300">Folder</dt>
                    <dd className="text-lg text-gray-900 dark:text-white mt-1">{image.folder}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-700 dark:text-gray-300">Created</dt>
                    <dd className="text-gray-600 dark:text-gray-400 mt-1">
                      <time dateTime={new Date(image.created_at).toISOString()}>
                        {new Date(image.created_at).toLocaleDateString()}
                      </time>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-700 dark:text-gray-300">Last Updated</dt>
                    <dd className="text-gray-600 dark:text-gray-400 mt-1">
                      <time dateTime={new Date(image.updated_at).toISOString()}>
                        {new Date(image.updated_at).toLocaleDateString()}
                      </time>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in ImagePage:", error);
    throw error; // Let error.tsx handle the error display
  }
}