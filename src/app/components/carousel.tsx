import Image from "next/image";
import { useRouter } from "next/navigation";
import useKeypress from "react-use-keypress";
import { useLastViewedPhoto } from "@/utils/useLastViewedPhoto";
import SharedModal from "./shared-modal";
import { Image as ImageType } from "@prisma/client";
import { useCallback } from "react";

interface CarouselProps {
  index: number;
  currentPhoto: ImageType;
}

export default function Carousel({ index, currentPhoto }: CarouselProps): JSX.Element {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();

  const closeModal = useCallback((): void => {
    setLastViewedPhoto(currentPhoto.id);
    router.push("/", {});
  }, [currentPhoto.id, router, setLastViewedPhoto]);

  const changePhotoId = useCallback((newVal: number): number => {
    return newVal;
  }, []);

  useKeypress("Escape", closeModal);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
        type="button"
        aria-label="Close modal"
      >
        <Image
          src={currentPhoto.blurDataUrl}
          className="pointer-events-none h-full w-full"
          alt="blurred background"
          fill
          priority
          quality={60}
        />
      </button>
      <SharedModal
        index={index}
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={true}
      />
    </div>
  );
}
