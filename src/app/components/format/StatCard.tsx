interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

export function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-black text-orange-400">{value}</div>
      <div className="text-slate-400 text-xs mt-1 font-medium">{label}</div>
    </div>
  );
}
