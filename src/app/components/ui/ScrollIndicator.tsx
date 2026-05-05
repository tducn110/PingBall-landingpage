export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
      <span className="text-xs tracking-widest uppercase">Cuộn xuống</span>
      <div className="w-5 h-8 border-2 border-white/25 rounded-full flex items-start justify-center pt-1.5">
        <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
