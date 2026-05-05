import { useScroll, useTransform, motion } from "motion/react";

export function HeroOrbs() {
  const { scrollY } = useScroll();
  // Each orb moves at a different speed for multi-layer depth
  const y1 = useTransform(scrollY, [0, 1000], [0, -180]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y4 = useTransform(scrollY, [0, 1000], [0, -220]);

  // Opacity fades out on scroll
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-1/4 right-[15%] w-24 h-24 rounded-full bg-orange-400/10 border border-orange-400/20 shadow-[0_0_60px_rgba(251,146,60,0.15)]"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute top-[35%] right-[30%] w-12 h-12 rounded-full bg-orange-400/15 border border-orange-400/30 shadow-[0_0_40px_rgba(251,146,60,0.2)]"
      />
      <motion.div
        style={{ y: y3, opacity }}
        className="absolute bottom-[25%] left-[12%] w-16 h-16 rounded-full bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
      />
      <motion.div
        style={{ y: y4, opacity }}
        className="absolute top-[20%] left-[20%] w-6 h-6 rounded-full bg-orange-400/20 border border-orange-400/40 shadow-[0_0_30px_rgba(251,146,60,0.25)]"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-[30%] right-[20%] w-10 h-10 rounded-full bg-white/8 border border-white/12 shadow-[0_0_35px_rgba(255,255,255,0.08)]"
      />
    </div>
  );
}
