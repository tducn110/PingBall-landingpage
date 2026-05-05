import { motion } from "motion/react";

export function HeroSubtitle() {
  return (
    <motion.p
      className="text-blue-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      Sân chơi bóng bàn đôi sôi động dành cho sinh viên và cán bộ VNUK.
      <br />
      Tranh tài, kết nối và tỏa sáng!
    </motion.p>
  );
}
