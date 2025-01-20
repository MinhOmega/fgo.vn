"use client";

import downloadPhoto from "@/utils/downloadPhoto";
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Image as ImageType } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Keyboard, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLastViewedPhoto } from "@/utils/useLastViewedPhoto";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface SharedModalProps {
  index: number;
  images: ImageType[];
  changePhotoId: (newIndex: number) => void;
  closeModal: () => void;
  navigation: boolean;
}

const SharedModal = ({ index, images, changePhotoId, closeModal, navigation }: SharedModalProps) => {
  const [loaded, setLoaded] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const { setPhotoId, setViewedImageIndex } = useLastViewedPhoto();

  const currentImage = images[index];

  useEffect(() => {
    if (mainSwiperRef.current && mainSwiperRef.current.activeIndex !== index) {
      mainSwiperRef.current.slideTo(index, 300); // Add smooth animation duration
    }
  }, [index]);

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.activeIndex;
    if (newIndex !== index) {
      changePhotoId(newIndex);
      // Update last viewed photo when sliding
      setPhotoId(images[newIndex].id);
      setViewedImageIndex(newIndex);
    }
  };

  // Update when modal is first opened
  useEffect(() => {
    setPhotoId(currentImage.id);
    setViewedImageIndex(index);
  }, [currentImage.id, index, setPhotoId, setViewedImageIndex]);

  const handleDownload = () => {
    if (!currentImage.url) return;
    downloadPhoto(currentImage.url, `${currentImage.code}.jpg`);
  };

  if (!currentImage) return null;

  return (
    <div className="relative z-50 flex aspect-[3/2] w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto">
      {/* Main image swiper */}
      <div className="relative w-full overflow-hidden">
        <Swiper
          onBeforeInit={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          initialSlide={index}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          keyboard={{
            enabled: true,
          }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs, Keyboard]}
          onSlideChange={handleSlideChange}
          className="mainSwiper h-full"
          speed={300}
          lazyPreloadPrevNext={5}
        >
          {images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="relative flex aspect-[3/2] items-center justify-center">
                {/* Blurred placeholder */}
                <div
                  className={`
                    absolute inset-0 transition-opacity duration-300 ease-in-out
                    ${imageLoading ? "opacity-100" : "opacity-0"}
                  `}
                >
                  <Image
                    src={image.url}
                    width={20} // Small size for blur placeholder
                    height={13}
                    alt=""
                    className="w-full h-full object-cover scale-110 blur-2xl"
                    priority
                  />
                </div>

                {/* Main image */}
                <Image
                  src={image.url}
                  width={navigation ? 1280 : 1920}
                  height={navigation ? 853 : 1280}
                  priority
                  alt={`Image ${image.code} - ${image.folder}`}
                  onLoad={() => {
                    setImageLoading(false);
                    setLoaded(true);
                  }}
                  className={`
                    object-contain transition-opacity duration-300 ease-in-out
                    ${imageLoading ? "opacity-0" : "opacity-100"}
                  `}
                />
              </div>
            </SwiperSlide>
          ))}

          {/* Custom navigation buttons - Updated with centered HeroIcons */}
          <div className="swiper-button-prev !flex !items-center !justify-center !text-white !bg-black/50 !w-10 !h-10 !rounded-full !backdrop-blur-lg hover:!bg-black/75 after:!content-[''] !left-4">
            <ChevronLeftIcon className="h-6 w-6 text-white" />
            <span className="sr-only">Previous slide</span>
          </div>
          <div className="swiper-button-next !flex !items-center !justify-center !text-white !bg-black/50 !w-10 !h-10 !rounded-full !backdrop-blur-lg hover:!bg-black/75 after:!content-[''] !right-4">
            <ChevronRightIcon className="h-6 w-6 text-white" />
            <span className="sr-only">Next slide</span>
          </div>
        </Swiper>

        {/* Controls overlay - Moved inside the main swiper container */}
        {loaded && (
          <div className="absolute top-0 left-0 right-0 z-50">
            <div className="h-16 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex justify-between items-center h-full px-4">
                {/* Left controls */}
                <button
                  onClick={closeModal}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  title="Close gallery"
                  aria-label="Close gallery"
                >
                  {navigation ? <XMarkIcon className="h-5 w-5" /> : <ArrowUturnLeftIcon className="h-5 w-5" />}
                </button>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                  <a
                    href={currentImage.url}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                    target="_blank"
                    title="Open fullsize version"
                    rel="noreferrer"
                    aria-label="Open fullsize version in new tab"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </a>
                  <button
                    onClick={handleDownload}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                    title="Download fullsize version"
                    aria-label="Download fullsize version"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Swiper */}
      {navigation && images && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-black/80">
          <div className="mx-auto py-4 px-2 max-w-[1200px]">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              slidesPerView="auto"
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumbSwiper !h-[70px]" // Fixed height
              slideToClickedSlide={true} // Enable click navigation
              centerInsufficientSlides={true}
              lazyPreloadPrevNext={5}
              breakpoints={{
                320: {
                  slidesPerView: 3,
                },
                640: {
                  slidesPerView: 5,
                },
                1024: {
                  slidesPerView: 8,
                },
              }}
            >
              {images.map((image) => (
                <SwiperSlide key={image.id} className="!w-[100px] !h-[70px] select-none">
                  <div
                    className={`
                      relative h-full w-full rounded-md overflow-hidden cursor-pointer
                      transition-all duration-200 ease-in-out
                      ${
                        image.id === currentImage.id
                          ? "ring-2 ring-blue-500 scale-[1.02]"
                          : "hover:ring-2 hover:ring-blue-400/50"
                      }
                    `}
                    role="button"
                    tabIndex={0}
                    aria-label={`View image ${image.code}`}
                  >
                    <Image
                      alt={`Thumbnail ${image.code} from ${image.folder}`}
                      width={100}
                      height={70}
                      className={`
                        h-full w-full object-cover bg-gray-900
                        transition-opacity duration-200
                        ${image.id === currentImage.id ? "opacity-100" : "opacity-60 hover:opacity-90"}
                      `}
                      src={image.url}
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedModal;
