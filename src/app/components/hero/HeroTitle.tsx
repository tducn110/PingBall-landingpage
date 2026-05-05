import { motion } from "motion/react";

export function HeroTitle() {
  return (
    <motion.h1
      className="text-white mb-4 leading-tight"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="block text-4xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-lg">
        GIẢI BÓNG BÀN ĐÔI
      </span>
      <motion.span
        className="block text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-orange-400 drop-shadow-lg mt-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        VNUK 2026
      </motion.span>
    </motion.h1>
  );
}
