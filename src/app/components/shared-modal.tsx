import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "@/utils/animationVariants";
import downloadPhoto from "@/utils/downloadPhoto";
import { Image as ImageType } from "@prisma/client";

interface SharedModalProps {
  index: number;
  images?: ImageType[];
  currentPhoto?: ImageType;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}

const SharedModal = ({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const filteredImages = useMemo(() => {
    if (!images) return [];

    const start = Math.max(0, index - 15);
    const end = Math.min(images.length, index + 15);
    return images.slice(start, end);
  }, [images, index]);

  const handleSwipeLeft = useCallback(() => {
    if (index < (images?.length ?? 0) - 1) {
      changePhotoId(index + 1);
    }
  }, [changePhotoId, index, images?.length]);

  const handleSwipeRight = useCallback(() => {
    if (index > 0) {
      changePhotoId(index - 1);
    }
  }, [changePhotoId, index]);

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: true,
  });

  const currentImage = images ? images[index] : currentPhoto;

  // Add ref for scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Sync thumbnail scroll with main image
  useEffect(() => {
    if (scrollContainerRef.current && navigation) {
      const selectedThumb = document.getElementById(`thumb-${currentImage?.id}`);
      if (selectedThumb) {
        const container = scrollContainerRef.current;
        const containerWidth = container.offsetWidth;
        const thumbWidth = selectedThumb.offsetWidth;
        const thumbLeft = selectedThumb.offsetLeft;
        
        // Calculate center position
        const scrollPosition = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
        
        // Limit scroll range
        const maxScroll = container.scrollWidth - containerWidth;
        const limitedScroll = Math.max(0, Math.min(scrollPosition, maxScroll));
        
        container.scrollTo({
          left: limitedScroll,
          behavior: 'smooth'
        });
      }
    }
  }, [index, currentImage?.id, navigation]);

  // Mouse events for dragging thumbnails
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 0.75; // Reduced multiplier for smoother scrolling
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };
  
  if (!currentImage) return null;

  const handleDownload = () => {
    if (!currentImage.url) return;
    downloadPhoto(currentImage.url, `${currentImage.code}.jpg`);
  };

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="relative z-50 flex aspect-[3/2] w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto"
        {...handlers}
      >
        {/* Main image */}
        <div className="w-full overflow-hidden">
          <div className="relative flex aspect-[3/2] items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute"
              >
                <Image
                  src={currentImage.url}
                  width={navigation ? 1280 : 1920}
                  height={navigation ? 853 : 1280}
                  priority
                  alt={`Image ${currentImage.code}`}
                  onLoad={() => setLoaded(true)}
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons + bottom nav bar */}
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
          {loaded && (
            <div className="relative aspect-[3/2] max-h-full w-full">
              {navigation && (
                <>
                  {index > 0 && (
                    <button
                      className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(index - 1)}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                  )}
                  {index + 1 < (images?.length ?? 0) && (
                    <button
                      className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(index + 1)}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}
              <div className="absolute top-0 right-0 flex items-center gap-2 p-3 text-white">
                <a
                  href={currentImage.url}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  target="_blank"
                  title="Open fullsize version"
                  rel="noreferrer"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </a>
                <button
                  onClick={handleDownload}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  title="Download fullsize version"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute top-0 left-0 flex items-center gap-2 p-3 text-white">
                <button
                  onClick={closeModal}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                >
                  {navigation ? <XMarkIcon className="h-5 w-5" /> : <ArrowUturnLeftIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Nav bar */}
          {navigation && filteredImages && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div 
                initial={false} 
                className="mx-auto mb-6 flex h-28 items-center justify-center"
              >
                <div className="relative w-full max-w-[900px]">
                  <div 
                    ref={scrollContainerRef}
                    className="flex gap-3 px-4 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  >
                    <AnimatePresence initial={false}>
                      {filteredImages.map((image) => {
                        const isSelected = images?.findIndex(img => img.id === image.id) === index;

                        return (
                          <motion.button
                            id={`thumb-${image.id}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                              opacity: 1,
                              scale: isSelected ? 1.1 : 1,
                              transition: { duration: 0.3, ease: "easeOut" },
                            }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            onClick={() => {
                              if (!isDragging) {
                                const newIndex = images?.findIndex(img => img.id === image.id) ?? 0;
                                changePhotoId(newIndex);
                              }
                            }}
                            key={image.id}
                            className={`
                              relative flex-shrink-0 rounded-lg overflow-hidden
                              transition-all duration-300 ease-out
                              ${isSelected 
                                ? "shadow-xl transform -translate-y-2 scale-105 border-2 border-white/50" 
                                : "shadow-md hover:shadow-lg hover:-translate-y-1 border border-white/10 hover:border-white/30"
                              }
                            `}
                            style={{
                              width: "120px", 
                              height: "80px",
                            }}
                          >
                            <Image
                              alt={`Thumbnail ${image.code}`}
                              width={240}
                              height={160}
                              className={`
                                h-full w-full object-cover transition-all duration-300
                                ${isSelected
                                  ? "brightness-110 contrast-110" 
                                  : "brightness-75 hover:brightness-90 contrast-75 hover:contrast-90"
                                }
                              `}
                              src={image.url}
                              priority={isSelected}
                            />
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
};

export default SharedModal;
