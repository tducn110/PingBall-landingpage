import { FadeInView } from "../ui/FadeInView";

export function VenueBanner() {
  return (
    <FadeInView>
      <div className="bg-gradient-to-br from-blue-900/50 to-slate-800/80 border border-blue-700/30 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Location */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-white font-black text-xl mb-1">Địa điểm thi đấu</h3>
          <p className="text-blue-300 text-lg font-semibold">
            158A Lê Lợi, Hải Châu, Đà Nẵng
          </p>
          <p className="text-slate-400 mt-2 text-sm">
            BTC sẽ thông báo thêm chi tiết phòng / sân trước ngày thi đấu.
          </p>
        </div>

        <div className="hidden md:block w-px h-20 bg-blue-700/40" />

        {/* Time */}
        <div className="flex-shrink-0 text-center md:text-left">
          <h3 className="text-white font-black text-xl mb-1">Thời gian</h3>
          <p className="text-orange-400 text-3xl font-black">8:00</p>
          <p className="text-slate-300 font-semibold">Chủ Nhật, 17/05/2026</p>
        </div>
      </div>
    </FadeInView>
  );
}
