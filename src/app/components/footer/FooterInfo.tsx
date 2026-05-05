function FooterInfoItem({
  label,
  primary,
  secondary,
  primaryColor = "text-white",
}: {
  label: string;
  primary: string;
  secondary: string;
  primaryColor?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-bold ${primaryColor}`}>{primary}</p>
      <p className="text-slate-400 text-sm">{secondary}</p>
    </div>
  );
}

export function FooterInfo() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 text-center">
      <FooterInfoItem label="Ngày thi đấu" primary="17/05/2026" secondary="Chủ Nhật · 8:00 sáng" />
      <div className="hidden sm:block w-px bg-slate-800" />
      <FooterInfoItem label="Địa điểm" primary="158A Lê Lợi" secondary="Hải Châu, Đà Nẵng" />
      <div className="hidden sm:block w-px bg-slate-800" />
      <FooterInfoItem label="Lệ phí" primary="25,000 VNĐ" secondary="Mỗi người" primaryColor="text-orange-400" />
    </div>
  );
}
