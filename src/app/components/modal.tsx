"use client";

import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import useKeypress from "react-use-keypress";
import SharedModal from "./shared-modal";
import { Image as ImageType } from "@prisma/client";

interface ModalProps {
  images: ImageType[];
  initialIndex: number;
  onClose: () => void;
}

const Modal = ({ images, initialIndex, onClose }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<number>(0);
  const [curIndex, setCurIndex] = useState<number>(initialIndex);

  const changePhotoId = useCallback(
    (newVal: number): void => {
      if (newVal > curIndex) {
        setDirection(1);
      } else {
        setDirection(-1);
      }
      setCurIndex(newVal);
    },
    [curIndex],
  );

  useKeypress("ArrowRight", () => {
    if (curIndex + 1 < images.length) {
      changePhotoId(curIndex + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (curIndex > 0) {
      changePhotoId(curIndex - 1);
    }
  });

  useKeypress("Escape", onClose);

  return (
    <Dialog
      static
      open={true}
      onClose={onClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div ref={overlayRef} className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl" aria-hidden="true">
        <motion.div 
          key="backdrop" 
          className="h-full w-full" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      </div>
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={onClose}
        navigation={true}
      />
    </Dialog>
  );
}

export default Modal;