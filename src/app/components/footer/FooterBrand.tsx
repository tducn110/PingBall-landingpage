export function FooterBrand() {
  return (
    <div className="text-center md:text-left">
      <div className="flex items-center gap-3 justify-center md:justify-start">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
          <span className="text-xl">🏓</span>
        </div>
        <div>
          <p className="text-white font-black tracking-tight">VNUK</p>
          <p className="text-slate-400 text-xs">Bóng Bàn Đôi 2026</p>
        </div>
      </div>
      <p className="text-slate-500 text-xs mt-3 max-w-xs">
        Giải đấu bóng bàn đôi thường niên do VNUK tổ chức, kết nối cộng đồng sinh viên và cán bộ.
      </p>
    </div>
  );
}
