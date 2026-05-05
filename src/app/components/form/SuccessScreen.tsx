import { motion } from "motion/react";

interface SuccessScreenProps {
  name1: string;
  name2: string;
  phone: string;
  onReset: () => void;
}

export function SuccessScreen({ name1, name2, phone, onReset }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-green-900/20 border border-green-500/30 rounded-3xl p-12 text-center"
    >
      {/* Checkmark */}
      <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400/40 flex items-center justify-center mx-auto mb-6">
        <motion.svg
          className="w-10 h-10 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </motion.svg>
      </div>

      <h3 className="text-white font-black text-2xl mb-3">Đăng ký thành công! 🎉</h3>

      <p className="text-slate-300 leading-relaxed mb-6">
        Chúc mừng đội{" "}
        <strong className="text-white">{name1}</strong>
        {" & "}
        <strong className="text-white">{name2}</strong>{" "}
        đã đăng ký tham dự Giải Bóng Bàn Đôi VNUK 2026!
      </p>

      <p className="text-slate-400 text-sm">
        BTC sẽ liên hệ qua số{" "}
        <strong className="text-white">{phone}</strong>{" "}
        để xác nhận và thông báo lịch thi đấu.
      </p>

      <div className="mt-8 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
        <p className="text-orange-300 text-sm">
          📅 Hẹn gặp lúc{" "}
          <strong>8:00 sáng Chủ Nhật, 17/05/2026</strong>{" "}
          tại 158A Lê Lợi, Hải Châu, Đà Nẵng!
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-6 text-slate-400 hover:text-white text-sm underline transition-colors"
      >
        Đăng ký thêm một đội khác
      </button>
    </motion.div>
  );
}
