"use client";

import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import SharedModal from "./shared-modal";
import { Image as ImageType } from "@prisma/client";

interface ModalProps {
  images: ImageType[];
  initialIndex: number;
}

const Modal = ({ images, initialIndex }: ModalProps) => {
  const router = useRouter();

  const onClose = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <Dialog
      static
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full w-full" 
        />
      </div>
      <SharedModal
        index={initialIndex}
        images={images}
        changePhotoId={(newIndex) => {
          router.push(`/i/${images[newIndex].id}`, { scroll: false });
        }}
        closeModal={onClose}
        navigation={true}
      />
    </Dialog>
  );
};

export default Modal;