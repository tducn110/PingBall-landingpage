import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HeroOrbs } from "./hero/HeroOrbs";
import { HeroBadge } from "./hero/HeroBadge";
import { HeroTitle } from "./hero/HeroTitle";
import { HeroSubtitle } from "./hero/HeroSubtitle";
import { HeroMeta } from "./hero/HeroMeta";
import { HeroCTA } from "./hero/HeroCTA";
import { ScrollIndicator } from "./ui/ScrollIndicator";

const BG_URL =
  "https://images.unsplash.com/photo-1774755461355-5c576a2e6030?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHRlbm5pcyUyMHBpbmclMjBwb25nJTIwYWN0aW9uJTIwc3BvcnR8ZW58MXx8fHwxNzc3ODIxNTYwfDA&ixlib=rb-4.1.0&q=80&w=1080";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background: slow parallax (moves at 30% speed)
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 250]);

  // Content layer: rises up as user scrolls (creates depth)
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0.4, 0.8], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.97]);

  // Gradient overlay fades darker as you scroll
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.82, 0.96]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url('${BG_URL}')` }}
          />
        </motion.div>
        {/* Dynamic gradient overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-900/85 to-slate-950/98"
        />
      </div>

      <HeroOrbs />

      {/* Content — rises up and fades on scroll */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto py-28"
      >
        <HeroBadge />
        <HeroTitle />
        <HeroSubtitle />
        <HeroMeta />
        <HeroCTA />
      </motion.div>

      <ScrollIndicator />
    </motion.section>
  );
}
