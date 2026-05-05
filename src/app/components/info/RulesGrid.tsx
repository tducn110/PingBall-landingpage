import { FadeInView } from "../ui/FadeInView";
import { RuleCard } from "./RuleCard";

const RULES = [
  {
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Đúng giờ là tôn trọng",
    desc: "VĐV đến trễ 10 phút so với giờ thi đấu sẽ bị xử thua trận đó. Hãy đến sớm để khởi động!",
    iconColor: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Tuân thủ luật bóng bàn",
    desc: "Mọi trận đấu tuân theo luật bóng bàn hiện hành. Quyết định của BTC là quyết định cuối cùng.",
    iconColor: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    iconPath:
      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Thi đấu đôi",
    desc: "Mỗi đội gồm 2 vận động viên. Cả hai phải đăng ký và hoàn tất lệ phí trước khi thi đấu.",
    iconColor: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    iconPath:
      "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Lệ phí tham dự",
    desc: "50,000 VNĐ/đôi. Vui lòng chuyển khoản trước và đính kèm biên lai khi đăng ký.",
    iconColor: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
];

export function RulesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
      {RULES.map((rule, i) => (
        <FadeInView key={i} delay={i * 0.1}>
          <RuleCard {...rule} />
        </FadeInView>
      ))}
    </div>
  );
}
