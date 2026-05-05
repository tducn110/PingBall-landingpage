interface AgreementBoxProps {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}

export function AgreementBox({ checked, onToggle, error }: AgreementBoxProps) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        error
          ? "border-red-500/50 bg-red-900/10"
          : "border-slate-700/40 bg-slate-800/40"
      }`}
    >
      <label className="flex items-start gap-3 cursor-pointer group">
        {/* Custom checkbox */}
        <div
          onClick={onToggle}
          className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${
            checked
              ? "bg-orange-500 border-orange-500"
              : "border-slate-500 group-hover:border-orange-400"
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <span className="text-slate-300 text-sm leading-relaxed">
          Tôi/chúng tôi cam kết đã đọc kỹ, hiểu rõ và đồng ý tuân thủ mọi điều lệ
          và quyết định của{" "}
          <strong className="text-white">
            Ban Tổ Chức Giải Bóng Bàn Đôi VNUK 2026
          </strong>
          .
        </span>
      </label>

      {error && (
        <p className="text-red-400 text-xs mt-2 pl-8">{error}</p>
      )}
    </div>
  );
}
