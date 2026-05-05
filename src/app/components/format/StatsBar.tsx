import { FadeInView } from "../ui/FadeInView";
import { StatCard } from "./StatCard";

const STATS = [
  { icon: "👥", value: "4", label: "Đội / Bảng" },
  { icon: "🏓", value: "5", label: "Trận / Bảng" },
  { icon: "📊", value: "20", label: "Tổng trận V.Bảng" },
  { icon: "🏆", value: "27", label: "Tổng trận Giải" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      {STATS.map((s, i) => (
        <FadeInView key={i} delay={i * 0.08} direction="up">
          <StatCard {...s} />
        </FadeInView>
      ))}
    </div>
  );
}
