import { motion } from "motion/react";

export function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 rounded-full px-4 py-1.5 mb-8"
    >
      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
      <span className="text-orange-300 text-sm tracking-widest uppercase font-medium">
        VNUK · Đà Nẵng 2026
      </span>
    </motion.div>
  );
}
