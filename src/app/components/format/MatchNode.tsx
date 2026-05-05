type MatchHighlight = "winner" | "loser" | "decider" | "neutral";

interface MatchNodeProps {
  match: string;
  team1: string;
  team2: string;
  result?: string;
  highlight?: MatchHighlight;
}

const HIGHLIGHT_STYLES: Record<MatchHighlight, string> = {
  winner: "border-green-500/50 bg-green-900/20",
  loser: "border-red-500/50 bg-red-900/20",
  decider: "border-orange-500/50 bg-orange-900/20",
  neutral: "border-slate-600/50 bg-slate-800/60",
};

export function MatchNode({
  match,
  team1,
  team2,
  result,
  highlight = "neutral",
}: MatchNodeProps) {
  return (
    <div className={`rounded-xl border p-4 ${HIGHLIGHT_STYLES[highlight]}`}>
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-3">
        {match}
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
          <span className="text-white font-semibold text-sm">{team1}</span>
        </div>
        <span className="text-slate-500 text-xs pl-4">VS</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
          <span className="text-white font-semibold text-sm">{team2}</span>
        </div>
      </div>
      {result && (
        <p className="mt-3 pt-3 border-t border-slate-600/40 text-xs text-slate-300 leading-relaxed">
          {result}
        </p>
      )}
    </div>
  );
}
