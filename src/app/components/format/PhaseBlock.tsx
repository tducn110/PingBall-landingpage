import { ReactNode } from "react";
import { FadeInView } from "../ui/FadeInView";

interface PhaseBlockProps {
  number: string | number;
  title: string;
  subtitle: string;
  numberBg: string;
  children: ReactNode;
}

export function PhaseBlock({
  number,
  title,
  subtitle,
  numberBg,
  children,
}: PhaseBlockProps) {
  return (
    <FadeInView direction="up">
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 md:p-8">
        {/* Phase header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${numberBg}`}
          >
            {number}
          </div>
          <div>
            <h3 className="text-white font-black text-lg">{title}</h3>
            <p className="text-slate-400 text-sm">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </FadeInView>
  );
}
