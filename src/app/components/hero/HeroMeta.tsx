import { motion } from "motion/react";

const META_ITEMS = [
  {
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    label: "Chủ Nhật, 17/05/2026",
    style: "bg-white/10 border-white/20",
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    label: "8:00 sáng",
    style: "bg-white/10 border-white/20",
  },
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "158A Lê Lợi, Đà Nẵng",
    style: "bg-white/10 border-white/20",
  },
];

function MetaPill({
  icon,
  label,
  style,
}: {
  icon: string;
  label: string;
  style: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 backdrop-blur-sm border rounded-xl px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base ${style}`}
    >
      <svg
        className="w-5 h-5 text-orange-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span className="text-white font-semibold">{label}</span>
    </div>
  );
}

export function HeroMeta() {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.75 }}
    >
      {META_ITEMS.map((item, i) => (
        <MetaPill key={i} {...item} />
      ))}
      {/* Fee pill */}
      <div className="flex items-center gap-2 bg-orange-500/30 backdrop-blur-sm border border-orange-400/50 rounded-xl px-3 sm:px-5 py-2.5 sm:py-3">
        <svg
          className="w-5 h-5 text-orange-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-orange-200 font-semibold">25,000 VNĐ / người</span>
      </div>
    </motion.div>
  );
}
