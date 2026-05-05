import { FooterBrand } from "./footer/FooterBrand";
import { FooterInfo } from "./footer/FooterInfo";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-start gap-8">
          <FooterBrand />
          <FooterInfo />
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800/60 text-center">
          <p className="text-slate-600 text-xs">
            © 2026 VNUK · Giải Bóng Bàn Đôi · Mọi quyết định của Ban Tổ Chức là quyết định cuối cùng.
          </p>
        </div>
      </div>
    </footer>
  );
}
