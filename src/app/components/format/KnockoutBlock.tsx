import { FadeInView } from "../ui/FadeInView";

const ROUNDS = [
  { num: "4", label: "Trận Tứ Kết", sub: "8 đội → 4 đội" },
  { num: "2", label: "Trận Bán Kết", sub: "4 đội → 2 đội" },
  { num: "1", label: "Trận Chung Kết", sub: "2 đội → 🥇 Vô địch" },
];

export function KnockoutBlock() {
  return (
    <FadeInView>
      <div className="bg-gradient-to-br from-orange-900/20 to-slate-800/40 border border-orange-700/20 rounded-2xl p-6 md:p-8">
        <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
          <span>🏆</span> Vòng Knockout — Loại Trực Tiếp
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {ROUNDS.map((r, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-orange-400">{r.num}</p>
              <p className="text-white font-bold mt-1">{r.label}</p>
              <p className="text-slate-400 text-xs mt-1">{r.sub}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-orange-700/20 text-center flex flex-wrap items-center justify-center gap-2">
          <span className="text-slate-300 text-sm">Vòng bảng:</span>
          <span className="text-orange-400 font-black">20 trận</span>
          <span className="text-slate-500">+</span>
          <span className="text-slate-300 text-sm">Knockout:</span>
          <span className="text-orange-400 font-black">7 trận</span>
          <span className="text-slate-500">=</span>
          <span className="text-white font-black text-xl">27 trận tổng thể</span>
        </div>
      </div>
    </FadeInView>
  );
}
