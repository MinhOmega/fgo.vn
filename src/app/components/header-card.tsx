import { motion, Variants } from "framer-motion";

interface HeaderCardProps {
  variants: Variants;
}

const HeaderCard = ({ variants }: HeaderCardProps) => {
  return (
    <motion.div
      variants={variants}
      className="relative flex flex-col items-center justify-end gap-4 rounded-lg bg-white/10 dark:bg-gray-800/50 px-6 pb-16 pt-16 text-center shadow-highlight"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black dark:from-gray-900/0 dark:via-gray-900 dark:to-gray-900"></span>
      </div>
      <h1 className="mt-8 mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Thư Viện Ảnh FGO
      </h1>
      <p className="max-w-[40ch] text-gray-700 dark:text-gray-300 sm:max-w-[32ch]">
        Duyệt và khám phá bộ sưu tập hình ảnh FGO
      </p>
    </motion.div>
  );
};

export default HeaderCard; 