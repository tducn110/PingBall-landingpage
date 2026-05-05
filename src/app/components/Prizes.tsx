import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { FadeInView } from "./ui/FadeInView";
import firstPrizeImg from "../../imports/firstprize.png";
import secondPrizeImg from "../../imports/Tainghe-secondprize.png";
import thirdPrizeImg from "../../imports/thirdprize.png";
import secretImg from "../../imports/istockphoto-2193259015-612x612.jpg";

// ─── Floating particles ─────────────────────────────────────────────────────
function Particles({ color, count }: { color: string; count: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
        size: 2 + Math.random() * 4,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${color}`}
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            top: -10,
          }}
          animate={{
            y: ["0vh", "100vh"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Light beam ──────────────────────────────────────────────────────────────
function LightBeam({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <div className="absolute inset-x-0 top-0 overflow-hidden pointer-events-none" style={{ height: "60vh" }}>
      <motion.div
        className="mx-auto w-px"
        style={{
          boxShadow: `0 0 100px 40px ${color}`,
          background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
        }}
        initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
        animate={{ opacity: [0, 0.5, 0], scaleY: [0, 1.2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      />
    </div>
  );
}

// ─── Prize Card with secret overlay reveal ─────────────────────────────────
function PrizeCard({
  medal,
  title,
  subtitle,
  img,
  name,
  desc,
  border,
  size = "md",
  parallaxY,
}: {
  medal: string;
  title: string;
  subtitle: string;
  img: string;
  name: string;
  desc: string;
  border: string;
  size?: "lg" | "md";
  parallaxY: any;
}) {
  return (
    <motion.div
      style={{ y: parallaxY }}
      className={`relative group rounded-2xl border ${border} bg-slate-900/50 overflow-hidden ${
        size === "lg" ? "shadow-2xl shadow-orange-500/10" : "shadow-xl"
      }`}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >

      {/* ── Secret overlay (fades on hover) — hidden on mobile since hover doesn't work ── */}
      <div
        className="hidden sm:block absolute inset-0 z-20 transition-opacity duration-500 group-hover:opacity-0"
      >
        <img src={secretImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      {/* ── Actual content ── */}
      <div className="relative p-3 sm:p-4 flex flex-col items-center text-center bg-slate-950/85 rounded-2xl z-[1]">
        <motion.span
          className={`mb-1 sm:mb-2 ${size === "lg" ? "text-4xl sm:text-6xl" : "text-3xl sm:text-4xl"}`}
          whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
        >
          {medal}
        </motion.span>
        <h3 className={`text-white font-black mb-0.5 ${size === "lg" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>{title}</h3>
        <p className="text-slate-400 text-[10px] sm:text-xs mb-2 sm:mb-3">{subtitle}</p>

        {/* Product image — takes most space, minimal padding */}
        <div className="w-full rounded-xl overflow-hidden flex items-center justify-center mb-2 sm:mb-3 p-1 sm:p-2">
          <img src={img} alt={name} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" />
        </div>

        <p className="text-white font-bold text-xs sm:text-sm">{name}</p>
        <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Prize data ──────────────────────────────────────────────────────────────
const NH = {
  medal: "🥇", title: "NHẤT", subtitle: "1 giải",
  img: firstPrizeImg, name: "Gamesir Nova Lite",
  desc: "Tay cầm không dây + Receiver cho PC/Steam/NS/Mobile",
  border: "border-yellow-500/50", size: "lg" as const,
};

const NHI = {
  medal: "🥈", title: "NHÌ", subtitle: "1 giải",
  img: secondPrizeImg, name: "Anker Soundcore R50i A3949",
  desc: "Tai nghe Bluetooth không dây",
  border: "border-slate-400/40", size: "md" as const,
};

const BA = {
  medal: "🥉", title: "BA", subtitle: "2 giải",
  img: thirdPrizeImg, name: "Chuột Gaming Không Dây",
  desc: "Siêu nhẹ, 3 chế độ kết nối",
  border: "border-slate-700/60", size: "md" as const,
};

export function Prizes() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yNhi = useTransform(scrollYProgress, [0, 0.5], [40, -15]);
  const yNhat = useTransform(scrollYProgress, [0, 0.5], [20, -5]);
  const yBa = useTransform(scrollYProgress, [0, 0.5], [55, -20]);

  return (
    <section id="prizes" ref={sectionRef} className="relative py-24 bg-slate-950 overflow-hidden">
      <Particles color="bg-yellow-500/30" count={20} />
      <Particles color="bg-slate-400/20" count={10} />
      <LightBeam color="rgba(234,179,8,0.12)" delay={0} />
      <LightBeam color="rgba(148,163,184,0.06)" delay={2.5} />

      <div className="pl-4 pr-6 max-w-6xl mx-auto relative z-10">
        <FadeInView>
          <div className="text-center mb-16">
            <h2 className="text-white text-3xl md:text-5xl font-black">GIẢI THƯỞNG</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full" />
          </div>
        </FadeInView>

        {/* Desktop: Nhì left, Nhất center biggest, Ba right lower */}
        {/* Mobile: Nhất top biggest, Nhì+Ba side-by-side below */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
          <FadeInView className="order-2 lg:order-1 lg:mt-8 lg:w-[280px] w-[48%] max-w-[180px] sm:max-w-[220px] lg:max-w-none" delay={0.15}>
            <PrizeCard {...NHI} parallaxY={yNhi} />
          </FadeInView>

          <FadeInView className="order-1 lg:order-2 w-full max-w-[280px] sm:max-w-[350px] z-10" delay={0}>
            <PrizeCard {...NH} parallaxY={yNhat} />
          </FadeInView>

          <FadeInView className="order-3 lg:mt-16 lg:w-[280px] w-[48%] max-w-[180px] sm:max-w-[220px] lg:max-w-none" delay={0.25}>
            <PrizeCard {...BA} parallaxY={yBa} />
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
