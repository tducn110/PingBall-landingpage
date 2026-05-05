export function PaymentGuide() {
  return (
    <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
      <h3 className="text-blue-300 font-bold flex items-center gap-2 mb-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        Hướng dẫn nộp lệ phí
      </h3>
      <p className="text-slate-300 text-sm mb-3">
        Chuyển khoản <strong className="text-white">50,000 VNĐ</strong> vào:
      </p>
      <div className="bg-slate-800/60 rounded-xl px-4 py-3 font-mono text-sm space-y-1">
        <p>
          <span className="text-slate-400">Ngân hàng: </span>
          <strong className="text-white">Vietcombank</strong>
        </p>
        <p>
          <span className="text-slate-400">Số TK: </span>
          <strong className="text-orange-400">1029384756</strong>
        </p>
        <p>
          <span className="text-slate-400">Chủ TK: </span>
          <strong className="text-white">Nguyen Van A</strong>
        </p>
        <p>
          <span className="text-slate-400">Nội dung: </span>
          <strong className="text-orange-400">[Tên đội] - BB2026</strong>
        </p>
      </div>
      <p className="text-slate-400 text-xs mt-3">
        Sau đó đính kèm biên lai / ảnh chụp màn hình xác nhận chuyển khoản bên dưới.
      </p>
    </div>
  );
}
