interface RuleCardProps {
  iconPath: string;
  title: string;
  desc: string;
  iconColor: string;
  bg: string;
}

export function RuleCard({ iconPath, title, desc, iconColor, bg }: RuleCardProps) {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-4 h-full ${bg}`}>
      <svg
        className={`w-6 h-6 flex-shrink-0 ${iconColor}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
      <div>
        <h3 className="text-white font-bold mb-1">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
