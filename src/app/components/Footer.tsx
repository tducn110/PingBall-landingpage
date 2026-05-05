import { FooterBrand } from "./footer/FooterBrand";
import { FooterInfo } from "./footer/FooterInfo";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 py-12">
      <div className="max-w-6xl mx-auto pl-2 pr-4">
        <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-8">
          <FooterBrand />
          <div className="flex-1 flex justify-center">
            <FooterInfo />
          </div>
          <div className="hidden md:block" />
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col items-center gap-2">
          <p className="text-slate-600 text-xs">
            © 2026 VNUK · Giải Bóng Bàn Đôi · Mọi quyết định của Ban Tổ Chức là quyết định cuối cùng.
          </p>
          <a
            href="https://instagram.com/tdu._cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
          >
            IG: tdu._cn
          </a>
        </div>
      </div>
    </footer>
  );
}
