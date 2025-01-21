import { motion, AnimatePresence, Variants } from "framer-motion";
import { Image as ImageType } from "@prisma/client";
import ImageCard from "./image-card";
import ShimmerCard from "./shimmer-card";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useCallback } from "react";
import { useLastViewedPhoto } from "@/utils/useLastViewedPhoto";

interface ImageGridProps {
  images: ImageType[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  containerVariants: Variants;
  itemVariants: Variants;
  children?: React.ReactNode;
}

const ImageGrid = ({ 
  images, 
  isLoading, 
  hasMore, 
  onLoadMore,
  containerVariants, 
  itemVariants,
  children 
}: ImageGridProps) => {
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    rootMargin: '1500px 0px',
    triggerOnce: false,
  });
  const { photoId, viewedImageIndex, setPhotoId, setViewedImageIndex } = useLastViewedPhoto();
  const loadingSentinelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      loadingSentinelRef.current = node;
      inViewRef(node);
    },
    [inViewRef]
  );

  useEffect(() => {
    const shouldLoadMore = inView && hasMore && !isLoading && !loadingRef.current;
    
    if (shouldLoadMore) {
      loadingRef.current = true;
      
      const loadMoreTimeout = setTimeout(() => {
        onLoadMore();
        loadingRef.current = false;
      }, 100);

      return () => {
        clearTimeout(loadMoreTimeout);
        loadingRef.current = false;
      };
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  // Scroll to last viewed photo
  useEffect(() => {
    if (photoId && viewedImageIndex !== null && gridRef.current) {
      const imageElements = gridRef.current.querySelectorAll('[data-image-id]');
      const targetElement = imageElements[viewedImageIndex];

      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Reset after scrolling
          setPhotoId(null);
          setViewedImageIndex(null);
        }, 100);
      }
    }
  }, [photoId, viewedImageIndex, setPhotoId, setViewedImageIndex]);

  return (
    <motion.div
      ref={gridRef}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      {/* Header Card */}
      {children}

      {/* Image Cards */}
      <AnimatePresence mode="wait">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            index={index}
            variants={itemVariants}
          />
        ))}
      </AnimatePresence>

      {/* Initial loading state */}
      {isLoading && (
        <>
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={`shimmer-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ShimmerCard />
            </motion.div>
          ))}
        </>
      )}

      {/* Loading sentinel and infinite scroll state */}
      {hasMore && (
        <div className="col-span-full">
          {/* Invisible loading sentinel */}
          <div
            ref={setRefs}
            className="h-px w-full"
            aria-hidden="true"
          />
          
          {/* Loading indicator */}
          {!isLoading && (
            <div className="py-8 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-full">
                {[...Array(2)].map((_, index) => (
                  <motion.div
                    key={`scroll-shimmer-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ShimmerCard />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {!isLoading && images.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="col-span-full text-center py-10"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Không tìm thấy hình ảnh
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImageGrid; 