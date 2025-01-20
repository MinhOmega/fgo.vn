import { motion } from "framer-motion";

const ShimmerCard = () => {
  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <div className="aspect-[3/2] w-full bg-gray-200 dark:bg-gray-800">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 -translate-x-full"
            animate={{
              translateX: ["0%", "100%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShimmerCard; 