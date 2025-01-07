import Modal from "@/app/components/modal";
import { getImages } from "@/app/actions/image";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

// Generate static params for all image IDs
export async function generateStaticParams() {
  try {
    const images = await getImages();
    return images.map((image) => ({
      id: image.id,
    }));
  } catch (error) {
    console.error("Error generating static params for modal:", error);
    return []; // Return empty array if fetch fails
  }
}

export default async function PhotoModal({ params }: Props) {
  try {
    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout after 10 seconds'));
      }, 10000); // 10 second timeout
    });

    // Race between the fetch and timeout
    const images = await Promise.race([
      getImages(),
      timeoutPromise
    ]) as Awaited<ReturnType<typeof getImages>>;

    if (!images || images.length === 0) {
      console.error("No images returned from getImages");
      throw new Error("Failed to fetch images");
    }

    const photoId = params.id;
    const imageIndex = images.findIndex(img => img.id === photoId);

    if (imageIndex === -1) {
      notFound();
    }

    return (
      <div className="pointer-events-auto">
        <Modal images={images} initialIndex={imageIndex} />
      </div>
    );
  } catch (error) {
    console.error("Error in PhotoModal:", error);
    
    // Return a more user-friendly error component
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Unable to Load Images
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            There was a problem loading the image gallery. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}
