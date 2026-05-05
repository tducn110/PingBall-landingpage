import { FadeInView } from "./ui/FadeInView";
import { SectionHeader } from "./ui/SectionHeader";
import { StatsBar } from "./format/StatsBar";
import { MatchNode } from "./format/MatchNode";
import { PhaseBlock } from "./format/PhaseBlock";
import { KnockoutBlock } from "./format/KnockoutBlock";

export function TournamentFormat() {
  return (
    <section id="format" className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        <FadeInView>
          <SectionHeader
            eyebrow="Thể thức thi đấu"
            title="CÁCH THỨC VẬN HÀNH"
            subtitle={
              `Giải đấu sử dụng hệ thống Double-Elimination theo bảng — không cần chỉ số phụ, minh bạch và công bằng tuyệt đối.`
            }
          />
        </FadeInView>

        <StatsBar />

        <div className="space-y-8 mb-16">
          {/* Round 1 */}
          <PhaseBlock
            number={1}
            title="Vòng 1 — Phân nhánh Sơ cấp"
            subtitle="Tạo ra 2 nhánh Thắng và 2 nhánh Thua"
            numberBg="bg-blue-600"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MatchNode
                match="Trận 1"
                team1="Đội 1 (Đ1)"
                team2="Đội 2 (Đ2)"
                result="→ Người thắng vào Nhánh Thắng · Người thua vào Nhánh Thua"
              />
              <MatchNode
                match="Trận 2"
                team1="Đội 3 (Đ3)"
                team2="Đội 4 (Đ4)"
                result="→ Người thắng vào Nhánh Thắng · Người thua vào Nhánh Thua"
              />
            </div>
          </PhaseBlock>

          {/* Round 2 */}
          <PhaseBlock
            number={2}
            title="Vòng 2 — Xác định Nhất Bảng & Kích hoạt Loại trừ"
            subtitle="Nút thắt quan trọng nhất của hệ thống"
            numberBg="bg-orange-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MatchNode
                match="Trận 3 · Trận Nhất Bảng"
                team1="Thắng 1 (winner Trận 1)"
                team2="Thắng 2 (winner Trận 2)"
                result="🏆 Người thắng → Nhất Bảng, đi thẳng Tứ Kết · ↓ Người thua → Rơi xuống Trận Sinh Tử"
                highlight="winner"
              />
              <MatchNode
                match="Trận 4 · Trận Sàng lọc"
                team1="Thua 1 (loser Trận 1)"
                team2="Thua 2 (loser Trận 2)"
                result="💀 Người thua → Bị loại (0–2) · ✅ Người thắng → Bước vào Trận Sinh Tử"
                highlight="loser"
              />
            </div>
          </PhaseBlock>

          {/* Round 3 */}
          <PhaseBlock
            number={3}
            title="Vòng 3 — Trận chiến Sinh Tử"
            subtitle="Định đoạt tấm vé cuối cùng vào Tứ Kết"
            numberBg="bg-red-500"
          >
            <div className="max-w-sm">
              <MatchNode
                match="Trận 5 · Decider Match"
                team1="Kẻ thua Trận 3"
                team2="Kẻ thắng Trận 4"
                result="🎯 Người thắng → Nhì Bảng, tiến vào Tứ Kết · ❌ Người thua → Bị loại"
                highlight="decider"
              />
            </div>
          </PhaseBlock>
        </div>

        <KnockoutBlock />
      </div>
    </section>
  );
}
