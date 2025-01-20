import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageType } from "@prisma/client";
import { useState } from "react";

interface ImageCardProps {
  image: ImageType;
  index: number;
  variants: Variants;
}

const ImageCard = ({ image, index, variants }: ImageCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link href={`/i/${image.id}`} scroll={false}>
      <motion.div
        variants={variants}
        layoutId={image.id}
        data-image-id={image.id}
        className="group relative block w-full rounded-lg shadow-highlight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden"
        aria-label={`Xem chi tiết hình ảnh ${image.code}`}
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
          {/* Blurred placeholder */}
          <div 
            className={`
              absolute inset-0 transition-opacity duration-300 ease-in-out
              ${imageLoading ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <Image
              src={image.url}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw,
                     (max-width: 1280px) 50vw,
                     (max-width: 1536px) 33vw,
                     25vw"
              className="scale-110 blur-2xl"
              priority={index < 4} // Prioritize first 4 images
            />
          </div>

          {/* Main image */}
          <Image
            alt={`Hình ảnh FGO ${image.code}`}
            className={`
              transform rounded-lg transition will-change-auto
              ${imageLoading ? 'opacity-0' : 'opacity-100'}
            `}
            style={{ transform: "translate3d(0, 0, 0)" }}
            src={image.url}
            fill
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1280px) 50vw,
                   (max-width: 1536px) 33vw,
                   25vw"
            quality={85}
            onLoad={() => setImageLoading(false)}
            priority={index < 4} // Prioritize first 4 images
          />

          {/* Hover effects remain the same */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-y-full rotate-45 group-hover:-translate-y-full transition-transform duration-1000"
            style={{
              width: '200%',
              left: '-50%'
            }}
          />
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
          >
            <span className="text-white text-2xl font-bold">
              {image.code}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ImageCard; 