import Modal from "@/app/components/modal";
import { getImages, getImageById } from "@/app/actions/image";
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
    const images = await getImages();
    const image = await getImageById(params.id);

    if (!image || !images || images.length === 0) {
      notFound();
    }

    const imageIndex = images.findIndex(img => img.id === params.id);

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
        </div>
      </div>
    );
  }
}
