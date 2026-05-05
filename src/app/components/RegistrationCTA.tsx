import { ExternalLink, QrCode } from "lucide-react";
import { FadeInView } from "./ui/FadeInView";
import { SectionHeader } from "./ui/SectionHeader";
import { GOOGLE_FORM_URL } from "../constants";
import qrCodeImg from "figma:asset/image-1.png";

export function RegistrationCTA() {
  return (
    <section id="register" className="py-20 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4">
        <FadeInView>
          <SectionHeader
            eyebrow="Tham gia ngay"
            title="Đăng ký Tham dự"
            subtitle="Quét mã QR hoặc bấm nút bên dưới để đăng ký qua Google Form. Sau khi đăng ký, vui lòng chuyển khoản lệ phí 25,000 VNĐ/người."
          />
        </FadeInView>

        <FadeInView delay={0.15}>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 flex flex-col md:flex-row gap-10 items-center justify-center">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-xl">
                <img
                  src={qrCodeImg}
                  alt="QR Code đăng ký Google Form"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <span className="text-slate-400 text-sm flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                Quét QR để đăng ký
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <div className="w-px h-16 bg-slate-700" />
              <span className="text-slate-500 text-xs font-medium">HOẶC</span>
              <div className="w-px h-16 bg-slate-700" />
            </div>
            <div className="md:hidden flex items-center gap-4 w-full">
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-slate-500 text-xs font-medium">HOẶC</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-6 text-center">
              <div>
                <h3 className="text-white mb-2">Bấm nút để mở Google Form</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Điền thông tin đội đôi, tải lên biên lai chuyển khoản và hoàn tất đăng ký trong vài phút.
                </p>
              </div>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 sm:px-10 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-400/40 hover:-translate-y-1"
              >
                <span className="text-lg">🏓</span>
                <span className="font-black tracking-wide text-lg">ĐĂNG KÝ NGAY</span>
                <ExternalLink className="w-5 h-5" />
              </a>
              <p className="text-slate-500 text-xs">
                * Link sẽ dẫn đến Google Form — mở tab mới
              </p>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
