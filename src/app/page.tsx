"use client";

import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getImages } from "./actions/image";
import { Image as ImageType } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import debounce from "lodash/debounce";
import Modal from "./components/modal";

// Move Fuse options outside component to avoid recreation
const fuseOptions = {
  keys: ["code", "number"],
  threshold: 0.4,
  includeScore: true,
};

export default function Home() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fuse, setFuse] = useState<Fuse<ImageType> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Initialize Fuse instance after images are loaded
  useEffect(() => {
    if (images.length > 0) {
      setFuse(new Fuse(images, fuseOptions));
    }
  }, [images]);

  // Fetch images
  useEffect(() => {
    let mounted = true;

    const fetchImages = async () => {
      try {
        const fetchedImages = await getImages();
        if (mounted) {
          setImages(fetchedImages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImages();

    return () => {
      mounted = false;
    };
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Get filtered results using debounced query
  const filteredImages = useMemo(() => {
    if (!debouncedSearchQuery || !fuse) return images;
    return fuse.search(debouncedSearchQuery).map(result => result.item);
  }, [debouncedSearchQuery, images, fuse]);

  const handleImageClick = useCallback((imageId: string) => {
    const index = images.findIndex(img => img.id === imageId);
    if (index !== -1) {
      setSelectedImageIndex(index);
      setModalOpen(true);
    }
  }, [images]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <main className="mx-auto max-w-[1960px] p-4" role="main">
        {/* Search Input */}
        <div className="mb-8 relative max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc số..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
        >
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col items-center justify-end gap-4 rounded-lg bg-white/10 dark:bg-gray-800/50 px-6 pb-16 pt-16 text-center shadow-highlight"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black dark:from-gray-900/0 dark:via-gray-900 dark:to-gray-900"></span>
            </div>
            <h1 className="mt-8 mb-4 text-2xl font-bold text-gray-900 dark:text-white">Thư Viện Ảnh FGO</h1>
            <p className="max-w-[40ch] text-gray-700 dark:text-gray-300 sm:max-w-[32ch]">
              Duyệt và khám phá bộ sưu tập hình ảnh FGO
            </p>
          </motion.div>

          {/* Image Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex justify-center items-center py-20"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </motion.div>
            ) : filteredImages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full text-center py-20"
              >
                <p className="text-gray-500 dark:text-gray-400">Không tìm thấy hình ảnh</p>
              </motion.div>
            ) : (
              filteredImages.map((image, index) => (
                <motion.button
                  key={image.id}
                  variants={itemVariants}
                  layoutId={image.id}
                  onClick={() => handleImageClick(image.id)}
                  className="group relative block w-full rounded-lg shadow-highlight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Xem chi tiết hình ảnh ${image.code}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }}
                >
                  <div className="relative aspect-[3/2]">
                    <Image
                      alt={`Hình ảnh FGO ${image.code}`}
                      className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 group-focus:brightness-110"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      src={image.url}
                      fill
                      sizes="(max-width: 640px) 100vw,
                             (max-width: 1280px) 50vw,
                             (max-width: 1536px) 33vw,
                             25vw"
                      priority
                      loading="eager"
                      quality={85}
                    />
                  </div>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && images.length > 0 && (
          <Modal 
            images={images}
            initialIndex={selectedImageIndex}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}
