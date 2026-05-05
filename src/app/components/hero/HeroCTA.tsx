import { motion } from "motion/react";
import { GOOGLE_FORM_URL } from "../../constants";

export function HeroCTA() {
  return (
    <motion.div
      className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <a
        href={GOOGLE_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-xl font-black tracking-wide transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-400/40 hover:-translate-y-1 text-lg"
      >
        ĐĂNG KÝ NGAY
      </a>
      <a
        href="#standings"
        className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-10 py-4 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-1 text-lg"
      >
        Bảng xếp hạng
      </a>
    </motion.div>
  );
}