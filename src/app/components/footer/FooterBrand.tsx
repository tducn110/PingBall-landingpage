import vnukLogo from "../../../imports/VNUK + ĐHĐN COLOR.png";

export function FooterBrand() {
  return (
    <div className="text-center md:text-left">
      <div className="flex flex-col items-center md:items-start gap-3">
        <div className="bg-white rounded-lg p-2">
          <img
            src={vnukLogo}
            alt="VNUK Đại Học Đà Nẵng"
            className="h-10 w-auto"
          />
        </div>
        <p className="text-slate-400 text-xs">Bóng Bàn Đôi 2026</p>
      </div>
      <p className="text-slate-500 text-xs mt-3 max-w-xs">
        Giải đấu bóng bàn đôi thường niên do VNUK tổ chức, kết nối cộng đồng sinh viên và cán bộ.
      </p>
    </div>
  );
}
