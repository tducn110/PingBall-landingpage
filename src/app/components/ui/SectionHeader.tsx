interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center mb-14">
      <span className="text-orange-400 text-sm tracking-widest uppercase font-semibold">
        {eyebrow}
      </span>
      <h2 className="text-white mt-3 text-3xl md:text-4xl font-black">{title}</h2>
      <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full" />
      {subtitle && (
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
