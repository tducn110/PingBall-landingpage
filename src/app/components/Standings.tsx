import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FadeInView } from "./ui/FadeInView";
import { SectionHeader } from "./ui/SectionHeader";
import { Lock, Unlock, Trophy, X, Shield, Check, RefreshCw, Edit3, Loader2, Swords } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTeams } from "../../hooks/useTeams";
import { useMatches } from "../../hooks/useMatches";
import { useTournament } from "../../hooks/useTournament";
import { updateTeamName } from "../../api/teams";
import { MATCH_META, GROUP_IDS } from "../../lib/config";
import type { GroupId } from "../../lib/config";
import type { GroupData, MatchResult, StandingRow, TeamSlot } from "../../types";

// ─── Default data for when no tournament exists yet ──────────────────────────
function makeGroup(id: string, names?: string[], results?: (0 | 1 | null)[]): GroupData {
  return {
    teams: Array.from({ length: 4 }, (_, i) => ({
      name: names?.[i] ?? `Đội ${id}${i + 1}`,
    })),
    results: Array.from({ length: 5 }, (_, i) => ({
      winnerId: (results?.[i] ?? null) as 0 | 1 | null,
    })),
  };
}

const INITIAL_DATA: Record<string, GroupData> = {
  A: makeGroup("A"),
  B: makeGroup("B"),
  C: makeGroup("C"),
  D: makeGroup("D"),
};

// ─── Logic: Resolve team index in each match ──────────────────────────────────
function resolveSlot(data: GroupData, matchIdx: number, slot: 0 | 1): number | null {
  const r = data.results;
  const r0 = r[0].winnerId, r1 = r[1].winnerId;
  const w0 = r0 !== null ? (r0 === 0 ? 0 : 1) : null;
  const l0 = r0 !== null ? (r0 === 0 ? 1 : 0) : null;
  const w1 = r1 !== null ? (r1 === 0 ? 2 : 3) : null;
  const l1 = r1 !== null ? (r1 === 0 ? 3 : 2) : null;

  if (matchIdx === 0) return slot === 0 ? 0 : 1;
  if (matchIdx === 1) return slot === 0 ? 2 : 3;
  if (matchIdx === 2) {
    if (w0 === null || w1 === null) return null;
    return slot === 0 ? w0 : w1;
  }
  if (matchIdx === 3) {
    if (l0 === null || l1 === null) return null;
    return slot === 0 ? l0 : l1;
  }
  if (matchIdx === 4) {
    const r2 = r[2].winnerId, r3 = r[3].winnerId;
    if (w0 === null || w1 === null || l0 === null || l1 === null || r2 === null || r3 === null) return null;
    const lM2 = r2 === 0 ? w1 : w0;
    const wM3 = r3 === 0 ? l0 : l1;
    return slot === 0 ? lM2 : wM3;
  }
  return null;
}

// ─── Logic: Compute standings ─────────────────────────────────────────────────
function computeStandings(data: GroupData): StandingRow[] {
  const { teams, results: r } = data;
  const wins = [0, 0, 0, 0];
  const losses = [0, 0, 0, 0];
  const status: ("1st" | "2nd" | "elim" | "")[] = ["", "", "", ""];

  const r0 = r[0].winnerId, r1 = r[1].winnerId;
  const w0 = r0 !== null ? (r0 === 0 ? 0 : 1) : null;
  const l0 = r0 !== null ? (r0 === 0 ? 1 : 0) : null;
  const w1 = r1 !== null ? (r1 === 0 ? 2 : 3) : null;
  const l1 = r1 !== null ? (r1 === 0 ? 3 : 2) : null;

  if (w0 !== null) { wins[w0]++; losses[l0!]++; }
  if (w1 !== null) { wins[w1]++; losses[l1!]++; }

  const r2 = r[2].winnerId;
  const wM2 = (r2 !== null && w0 !== null && w1 !== null) ? (r2 === 0 ? w0 : w1) : null;
  const lM2 = (r2 !== null && w0 !== null && w1 !== null) ? (r2 === 0 ? w1 : w0) : null;
  if (wM2 !== null) { wins[wM2]++; losses[lM2!]++; status[wM2] = "1st"; }

  const r3 = r[3].winnerId;
  const wM3 = (r3 !== null && l0 !== null && l1 !== null) ? (r3 === 0 ? l0 : l1) : null;
  const lM3 = (r3 !== null && l0 !== null && l1 !== null) ? (r3 === 0 ? l1 : l0) : null;
  if (wM3 !== null) { wins[wM3]++; losses[lM3!]++; }
  if (lM3 !== null) status[lM3] = "elim";

  const r4 = r[4].winnerId;
  if (r4 !== null && lM2 !== null && wM3 !== null) {
    const wM4 = r4 === 0 ? lM2 : wM3;
    const lM4 = r4 === 0 ? wM3 : lM2;
    wins[wM4]++; losses[lM4]++;
    status[wM4] = "2nd";
    status[lM4] = "elim";
  }

  return teams
    .map((t, i) => ({ teamIdx: i, name: t.name || `Đội ${i + 1}`, wins: wins[i], losses: losses[i], status: status[i] }))
    .sort((a, b) => {
      const order: Record<string, number> = { "1st": 0, "2nd": 1, "": 2, "elim": 3 };
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return b.wins - a.wins || a.losses - b.losses;
    });
}

// ─── Convert Supabase match data to GroupData format (local fallback) ─────────
function supabaseToGroupData(
  teams: { id: string; name: string }[],
  matches: { match_number: number; team1_id: string | null; team2_id: string | null; winner_id: string | null }[]
): GroupData {
  const teamSlots: TeamSlot[] = Array.from({ length: 4 }, (_, i) => ({
    name: teams[i]?.name ?? `Đội ${i + 1}`,
  }));

  const results: MatchResult[] = Array.from({ length: 5 }, (_, i) => {
    const m = matches.find((x) => x.match_number === i + 1);
    if (!m || m.winner_id === null) return { winnerId: null };
    const winnerIsTeam1 = m.winner_id === m.team1_id;
    return { winnerId: winnerIsTeam1 ? 0 : 1 };
  });

  return { teams: teamSlots, results };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Standings() {
  const { tournament, loading: tLoading } = useTournament();
  const tournamentId = tournament?.id ?? null;

  const [activeGroup, setActiveGroup] = useState<GroupId>("A");
  const { teams, loading: teamsLoading, rename, refetch: refetchTeams } = useTeams(tournamentId, activeGroup);
  const { matches, loading: matchesLoading, setWinner, resetGroup } = useMatches(tournamentId, activeGroup);
  const { isAdmin, login, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [adminTab, setAdminTab] = useState<"teams" | "matches" | "ko">("matches");
  const [savedFlash, setSavedFlash] = useState(false);
  const [localTeams, setLocalTeams] = useState(INITIAL_DATA);

  // ── Knockout bracket local state ─────────────────────────────────────────
  const [knockout, setKnockout] = useState<{
    quarterFinals: { team1: string; team2: string; winner: string | null }[];
    semiFinals: { team1: string; team2: string; winner: string | null }[];
    final: { team1: string; team2: string; winner: string | null };
    champion: string | null;
  }>(() => {
    try {
      const saved = localStorage.getItem("pingball_knockout");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      quarterFinals: [
        { team1: "Nhất A", team2: "Nhì B", winner: null },
        { team1: "Nhất B", team2: "Nhì A", winner: null },
        { team1: "Nhất C", team2: "Nhì D", winner: null },
        { team1: "Nhất D", team2: "Nhì C", winner: null },
      ],
      semiFinals: [
        { team1: "Thắng TK 1", team2: "Thắng TK 2", winner: null },
        { team1: "Thắng TK 3", team2: "Thắng TK 4", winner: null },
      ],
      final: { team1: "Thắng BK 1", team2: "Thắng BK 2", winner: null },
      champion: null,
    };
  });

  function saveKnockout(next: typeof knockout) {
    setKnockout(next);
    localStorage.setItem("pingball_knockout", JSON.stringify(next));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function setKnockoutWinner(
    round: "quarterFinals" | "semiFinals" | "final",
    idx: number,
    winner: string | null,
  ) {
    const next = { ...knockout };
    if (round === "final") {
      next.final = { ...next.final, winner };
      next.champion = winner;
    } else {
      const matches = [...next[round]];
      matches[idx] = { ...matches[idx], winner };
      (next as any)[round] = matches;

      // Propagate to next round
      if (round === "quarterFinals") {
        const w0 = matches[0].winner;
        const w1 = matches[1].winner;
        const w2 = matches[2].winner;
        const w3 = matches[3].winner;
        next.semiFinals[0] = { ...next.semiFinals[0], team1: w0 ?? "Thắng TK 1", team2: w1 ?? "Thắng TK 2" };
        next.semiFinals[1] = { ...next.semiFinals[1], team1: w2 ?? "Thắng TK 3", team2: w3 ?? "Thắng TK 4" };
      }
      if (round === "semiFinals") {
        const sf0 = matches[0].winner;
        const sf1 = matches[1].winner;
        next.final = { ...next.final, team1: sf0 ?? "Thắng BK 1", team2: sf1 ?? "Thắng BK 2" };
      }
    }
    saveKnockout(next);
  }

  // Merge Supabase data into group data format
  const groupData: GroupData =
    teams.length > 0 || matches.length > 0
      ? supabaseToGroupData(teams, matches)
      : localTeams[activeGroup];

  const standings = computeStandings(groupData);

  // ── Admin actions ──────────────────────────────────────────────────────────
  function handleUpdateTeamName(idx: number, name: string) {
    if (teams.length > 0 && teams[idx]) {
      rename(teams[idx].id, name);
    } else {
      // Fallback to local state if no supabase data yet
      setLocalTeams((d) => ({
        ...d,
        [activeGroup]: {
          ...d[activeGroup],
          teams: d[activeGroup].teams.map((t, i) => (i === idx ? { name } : t)),
        },
      }));
    }
  }

  async function handleSetMatchResult(matchIdx: number, winnerId: 0 | 1 | null) {
    if (matches.length > 0 && matches[matchIdx]) {
      const match = matches[matchIdx];
      const teamSlot0 = resolveSlot(groupData, matchIdx, 0);
      const teamSlot1 = resolveSlot(groupData, matchIdx, 1);
      const actualTeamIdx = winnerId === 0 ? teamSlot0 : teamSlot1;
      const team = actualTeamIdx !== null && actualTeamIdx < teams.length ? teams[actualTeamIdx] : null;
      await setWinner(match.id, team?.id ?? null);
    } else {
      // Fallback to local state
      setLocalTeams((d) => {
        const group = d[activeGroup];
        const newResults = group.results.map((r, i): MatchResult => {
          if (i === matchIdx) return { winnerId };
          if (matchIdx <= 1 && i >= 2) return { winnerId: null };
          if ((matchIdx === 2 || matchIdx === 3) && i === 4) return { winnerId: null };
          return r;
        });
        return { ...d, [activeGroup]: { ...group, results: newResults } };
      });
    }
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  async function handleResetGroup() {
    if (tournamentId) {
      await resetGroup(tournamentId, activeGroup);
    } else {
      setLocalTeams((d) => ({
        ...d,
        [activeGroup]: {
          ...d[activeGroup],
          results: Array.from({ length: 5 }, () => ({ winnerId: null })),
        },
      }));
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (login(password)) {
      setShowLoginModal(false);
      setPassword("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  }

  const loading = tLoading || teamsLoading || matchesLoading;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section id="standings" className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        <FadeInView>
          <SectionHeader
            eyebrow="Bảng xếp hạng"
            title="Kết quả & Thành tích"
            subtitle="Theo dõi bảng thắng/thua của các đội trong từng nhóm. Cập nhật theo thời gian thực."
          />
        </FadeInView>

        {/* Group Tabs */}
        <FadeInView delay={0.1}>
          <div className="flex gap-2 justify-center mb-10 flex-wrap">
            {GROUP_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setActiveGroup(id)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  activeGroup === id
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                Bảng {id}
              </button>
            ))}
          </div>
        </FadeInView>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && (
            <motion.div
              key={activeGroup}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* ── Standings Table ── */}
              <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-bold text-sm">Bảng {activeGroup} — Xếp hạng</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-800/60">
                        <th className="text-left px-5 py-3 text-slate-500">#</th>
                        <th className="text-left px-5 py-3 text-slate-500">Đội</th>
                        <th className="text-center px-4 py-3 text-green-400 font-bold">W</th>
                        <th className="text-center px-4 py-3 text-red-400 font-bold">L</th>
                        <th className="text-center px-4 py-3 text-slate-500">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row, rank) => (
                        <tr
                          key={row.teamIdx}
                          className={`border-b border-slate-800/40 transition-colors ${
                            row.status === "1st" ? "bg-orange-500/5" :
                            row.status === "2nd" ? "bg-blue-500/5" :
                            row.status === "elim" ? "opacity-50" : ""
                          }`}
                        >
                          <td className="px-5 py-4">
                            <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-black ${
                              rank === 0 ? "bg-orange-500 text-white" :
                              rank === 1 ? "bg-slate-600 text-white" :
                              "text-slate-500"
                            }`}>{rank + 1}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-white font-medium">{row.name}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-green-400 font-black">{row.wins}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-red-400 font-black">{row.losses}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {row.status === "1st" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                                🥇 Nhất bảng
                              </span>
                            )}
                            {row.status === "2nd" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                                🥈 Nhì bảng
                              </span>
                            )}
                            {row.status === "elim" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold">
                                ❌ Bị loại
                              </span>
                            )}
                            {row.status === "" && (
                              <span className="text-slate-600 text-xs">— Chưa xác định</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Match Results ── */}
              <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-2">
                  <span className="text-sm">⚡</span>
                  <span className="text-white font-bold text-sm">Bảng {activeGroup} — Kết quả trận đấu</span>
                </div>
                <div className="p-4 space-y-3">
                  {MATCH_META.map((meta, matchIdx) => {
                    const t1Idx = resolveSlot(groupData, matchIdx, 0);
                    const t2Idx = resolveSlot(groupData, matchIdx, 1);
                    const result = groupData.results[matchIdx].winnerId;
                    const isAvailable = t1Idx !== null && t2Idx !== null;
                    const t1Name = t1Idx !== null ? groupData.teams[t1Idx].name : "?";
                    const t2Name = t2Idx !== null ? groupData.teams[t2Idx].name : "?";

                    return (
                      <div
                        key={matchIdx}
                        className={`rounded-xl border p-3 transition-all ${
                          !isAvailable
                            ? "border-slate-800/40 opacity-40"
                            : result !== null
                            ? "border-slate-700/60 bg-slate-800/30"
                            : "border-slate-700/40 bg-slate-800/20"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full text-white font-bold ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="text-slate-500 text-xs">{meta.tag}</span>
                          {result !== null && isAvailable && (
                            <span className="ml-auto">
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`flex-1 text-right font-medium ${result === 0 ? "text-green-400" : "text-slate-300"}`}>
                            {t1Name}
                            {result === 0 && " 🏆"}
                          </span>
                          <span className="text-slate-600 font-black px-1">vs</span>
                          <span className={`flex-1 font-medium ${result === 1 ? "text-green-400" : "text-slate-300"}`}>
                            {t2Name}
                            {result === 1 && " 🏆"}
                          </span>
                        </div>
                        {!isAvailable && (
                          <p className="text-slate-600 text-xs mt-1 text-center">Chờ kết quả vòng trước...</p>
                        )}
                        {isAvailable && result === null && (
                          <p className="text-slate-500 text-xs mt-1 text-center italic">Chưa có kết quả</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Knockout Bracket ──────────────────────────────────────────────── */}
        <FadeInView delay={0.2}>
          <div className="mt-12 bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-2">
              <Swords className="w-4 h-4 text-orange-400" />
              <span className="text-white font-bold text-sm">Vòng Knockout</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tứ Kết */}
                <div>
                  <h4 className="text-orange-400 font-black text-sm mb-4 text-center">TỨ KẾT</h4>
                  <div className="space-y-3">
                    {knockout.quarterFinals.map((m, i) => (
                      <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className={m.winner === m.team1 ? "text-green-400 font-bold" : "text-slate-300"}>{m.team1}</span>
                          <span className="text-slate-600 font-black mx-2">vs</span>
                          <span className={m.winner === m.team2 ? "text-green-400 font-bold" : "text-slate-300"}>{m.team2}</span>
                        </div>
                        {m.winner ? (
                          <p className="text-green-400 text-xs mt-1 text-center">{m.winner} 🏆</p>
                        ) : (
                          <p className="text-slate-600 text-xs mt-1 text-center">— Chưa có kết quả</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bán Kết */}
                <div className="flex flex-col justify-center">
                  <h4 className="text-orange-400 font-black text-sm mb-4 text-center">BÁN KẾT</h4>
                  <div className="space-y-3">
                    {knockout.semiFinals.map((m, i) => (
                      <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className={m.winner === m.team1 ? "text-green-400 font-bold" : "text-slate-300"}>{m.team1}</span>
                          <span className="text-slate-600 font-black mx-2">vs</span>
                          <span className={m.winner === m.team2 ? "text-green-400 font-bold" : "text-slate-300"}>{m.team2}</span>
                        </div>
                        {m.winner ? (
                          <p className="text-green-400 text-xs mt-1 text-center">{m.winner} 🏆</p>
                        ) : (
                          <p className="text-slate-600 text-xs mt-1 text-center">— Chưa có kết quả</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chung Kết */}
                <div className="flex flex-col justify-center">
                  <h4 className="text-yellow-400 font-black text-sm mb-4 text-center">CHUNG KẾT</h4>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className={knockout.final.winner === knockout.final.team1 ? "text-green-400 font-bold" : "text-slate-200"}>{knockout.final.team1}</span>
                      <span className="text-slate-600 font-black mx-3">vs</span>
                      <span className={knockout.final.winner === knockout.final.team2 ? "text-green-400 font-bold" : "text-slate-200"}>{knockout.final.team2}</span>
                    </div>
                    {knockout.final.winner ? (
                      <p className="text-green-400 text-sm mt-2 text-center font-black">{knockout.final.winner} 🏆</p>
                    ) : (
                      <p className="text-slate-600 text-xs mt-2 text-center">— Chưa có kết quả</p>
                    )}
                    {knockout.champion && (
                      <div className="mt-3 pt-3 border-t border-yellow-500/20 text-center">
                        <p className="text-yellow-400 text-lg font-black flex items-center justify-center gap-2">
                          <Trophy className="w-5 h-5" />
                          {knockout.champion}
                        </p>
                        <p className="text-yellow-500/70 text-xs mt-1">VÔ ĐỊCH</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInView>

        {/* ── Admin Panel ─────────────────────────────────────────────────────── */}
        <FadeInView delay={0.3}>
          <div className="mt-10">
            {!isAdmin ? (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-400 text-xs py-2 px-4 rounded-lg hover:bg-slate-800/50 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Đăng nhập Admin để cập nhật kết quả
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-orange-500/30 rounded-2xl overflow-hidden shadow-lg shadow-orange-500/5"
              >
                {/* Admin Header */}
                <div className="px-6 py-4 bg-orange-500/10 border-b border-orange-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-bold text-sm">Chế độ Admin</span>
                    {savedFlash && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1 text-green-400 text-xs ml-2"
                      >
                        <Check className="w-3 h-3" /> Đã lưu
                      </motion.span>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="text-slate-500 hover:text-red-400 transition-colors text-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Đăng xuất
                  </button>
                </div>

                <div className="p-6">
                  {/* Group selector */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-slate-400 text-sm">Đang chỉnh sửa:</span>
                    <div className="flex gap-2">
                      {GROUP_IDS.map((id) => (
                        <button
                          key={id}
                          onClick={() => setActiveGroup(id)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            activeGroup === id
                              ? "bg-orange-500 text-white"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          Bảng {id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Admin Tabs */}
                  <div className="flex gap-1 mb-6 bg-slate-800/50 p-1 rounded-xl w-fit flex-wrap">
                    {(["matches", "teams", "ko"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAdminTab(tab)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                          adminTab === tab
                            ? "bg-slate-700 text-white"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {tab === "matches" ? "⚡ Kết quả trận đấu" : tab === "teams" ? "✏️ Tên đội" : "🏆 Knockout"}
                      </button>
                    ))}
                  </div>

                  {/* Tab: Match Results */}
                  {adminTab === "matches" && (
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <button
                          onClick={handleResetGroup}
                          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Reset tất cả kết quả bảng {activeGroup}
                        </button>
                      </div>
                      {MATCH_META.map((meta, matchIdx) => {
                        const t1Idx = resolveSlot(groupData, matchIdx, 0);
                        const t2Idx = resolveSlot(groupData, matchIdx, 1);
                        const isAvail = t1Idx !== null && t2Idx !== null;
                        const t1Name = t1Idx !== null ? groupData.teams[t1Idx].name : "Chờ vòng trước";
                        const t2Name = t2Idx !== null ? groupData.teams[t2Idx].name : "Chờ vòng trước";
                        const currentResult = groupData.results[matchIdx].winnerId;

                        return (
                          <div
                            key={matchIdx}
                            className={`rounded-xl border p-4 transition-all ${
                              !isAvail ? "border-slate-800 opacity-40 pointer-events-none" : "border-slate-700/60"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full text-white font-bold ${meta.color}`}>
                                {meta.label}
                              </span>
                              <span className="text-slate-500 text-xs">{meta.tag}</span>
                              {currentResult !== null && (
                                <button
                                  onClick={() => handleSetMatchResult(matchIdx, null)}
                                  className="ml-auto text-xs text-slate-600 hover:text-red-400 flex items-center gap-1 transition-colors"
                                >
                                  <X className="w-3 h-3" /> Xóa kết quả
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => handleSetMatchResult(matchIdx, 0)}
                                className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                  currentResult === 0
                                    ? "border-green-500 bg-green-500/15 text-green-400"
                                    : "border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                                }`}
                              >
                                {currentResult === 0 && <span className="mr-1">🏆</span>}
                                {t1Name}
                              </button>
                              <button
                                onClick={() => handleSetMatchResult(matchIdx, 1)}
                                className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                  currentResult === 1
                                    ? "border-green-500 bg-green-500/15 text-green-400"
                                    : "border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                                }`}
                              >
                                {currentResult === 1 && <span className="mr-1">🏆</span>}
                                {t2Name}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Tab: Team Names */}
                  {adminTab === "teams" && (
                    <div className="space-y-3">
                      <p className="text-slate-500 text-xs mb-4">
                        Nhập tên cặp đôi VĐV cho từng ô đội trong bảng {activeGroup}
                      </p>
                      {groupData.teams.map((team, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-slate-500 text-xs w-14 shrink-0">Đội {activeGroup}{idx + 1}</span>
                          <input
                            type="text"
                            value={team.name}
                            onChange={(e) => handleUpdateTeamName(idx, e.target.value)}
                            placeholder={`VD: Nguyễn A & Trần B`}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-orange-500/60 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab: Knockout Bracket */}
                  {adminTab === "ko" && (
                    <div className="space-y-6">
                      <p className="text-slate-500 text-xs">
                        Cập nhật kết quả vòng loại trực tiếp. Tứ Kết → Bán Kết → Chung Kết.
                      </p>

                      {/* Quarter Finals */}
                      <div>
                        <h4 className="text-orange-400 font-bold text-sm mb-3">TỨ KẾT</h4>
                        <div className="space-y-3">
                          {knockout.quarterFinals.map((m, i) => (
                            <div key={i} className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3">
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => setKnockoutWinner("quarterFinals", i, m.team1)}
                                  className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                    m.winner === m.team1
                                      ? "border-green-500 bg-green-500/15 text-green-400"
                                      : "border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                                  }`}
                                >
                                  {m.winner === m.team1 && <span className="mr-1">🏆</span>}
                                  {m.team1}
                                </button>
                                <button
                                  onClick={() => setKnockoutWinner("quarterFinals", i, m.team2)}
                                  className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                    m.winner === m.team2
                                      ? "border-green-500 bg-green-500/15 text-green-400"
                                      : "border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                                  }`}
                                >
                                  {m.winner === m.team2 && <span className="mr-1">🏆</span>}
                                  {m.team2}
                                </button>
                              </div>
                              {m.winner && (
                                <button
                                  onClick={() => setKnockoutWinner("quarterFinals", i, null)}
                                  className="text-xs text-slate-600 hover:text-red-400 mt-2 flex items-center gap-1 transition-colors"
                                >
                                  <X className="w-3 h-3" /> Xóa kết quả
                                </button>
                              )}
                              <div className="mt-2 flex gap-4">
                                <input
                                  type="text"
                                  value={m.team1}
                                  onChange={(e) => {
                                    const next = { ...knockout };
                                    const qf = [...next.quarterFinals];
                                    qf[i] = { ...qf[i], team1: e.target.value };
                                    next.quarterFinals = qf;
                                    setKnockout(next);
                                  }}
                                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500/60"
                                  placeholder="Đội 1"
                                />
                                <input
                                  type="text"
                                  value={m.team2}
                                  onChange={(e) => {
                                    const next = { ...knockout };
                                    const qf = [...next.quarterFinals];
                                    qf[i] = { ...qf[i], team2: e.target.value };
                                    next.quarterFinals = qf;
                                    setKnockout(next);
                                  }}
                                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500/60"
                                  placeholder="Đội 2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Semi Finals */}
                      <div>
                        <h4 className="text-orange-400 font-bold text-sm mb-3">BÁN KẾT</h4>
                        <div className="space-y-3">
                          {knockout.semiFinals.map((m, i) => (
                            <div key={i} className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3">
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => setKnockoutWinner("semiFinals", i, m.team1)}
                                  className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                    m.winner === m.team1
                                      ? "border-green-500 bg-green-500/15 text-green-400"
                                      : "border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                                  }`}
                                >
                                  {m.winner === m.team1 && <span className="mr-1">🏆</span>}
                                  {m.team1}
                                </button>
                                <button
                                  onClick={() => setKnockoutWinner("semiFinals", i, m.team2)}
                                  className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                    m.winner === m.team2
                                      ? "border-green-500 bg-green-500/15 text-green-400"
                                      : "border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                                  }`}
                                >
                                  {m.winner === m.team2 && <span className="mr-1">🏆</span>}
                                  {m.team2}
                                </button>
                              </div>
                              {m.winner && (
                                <button
                                  onClick={() => setKnockoutWinner("semiFinals", i, null)}
                                  className="text-xs text-slate-600 hover:text-red-400 mt-2 flex items-center gap-1 transition-colors"
                                >
                                  <X className="w-3 h-3" /> Xóa kết quả
                                </button>
                              )}
                              <div className="mt-2 flex gap-4">
                                <input
                                  type="text"
                                  value={m.team1}
                                  onChange={(e) => {
                                    const next = { ...knockout };
                                    const sf = [...next.semiFinals];
                                    sf[i] = { ...sf[i], team1: e.target.value };
                                    next.semiFinals = sf;
                                    setKnockout(next);
                                  }}
                                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500/60"
                                  placeholder="Đội 1"
                                />
                                <input
                                  type="text"
                                  value={m.team2}
                                  onChange={(e) => {
                                    const next = { ...knockout };
                                    const sf = [...next.semiFinals];
                                    sf[i] = { ...sf[i], team2: e.target.value };
                                    next.semiFinals = sf;
                                    setKnockout(next);
                                  }}
                                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500/60"
                                  placeholder="Đội 2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Final */}
                      <div>
                        <h4 className="text-yellow-400 font-bold text-sm mb-3">CHUNG KẾT</h4>
                        <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-xl p-3">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setKnockoutWinner("final", 0, knockout.final.team1)}
                              className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                knockout.final.winner === knockout.final.team1
                                  ? "border-green-500 bg-green-500/15 text-green-400"
                                  : "border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                              }`}
                            >
                              {knockout.final.winner === knockout.final.team1 && <span className="mr-1">🏆</span>}
                              {knockout.final.team1}
                            </button>
                            <button
                              onClick={() => setKnockoutWinner("final", 0, knockout.final.team2)}
                              className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                knockout.final.winner === knockout.final.team2
                                  ? "border-green-500 bg-green-500/15 text-green-400"
                                  : "border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                              }`}
                            >
                              {knockout.final.winner === knockout.final.team2 && <span className="mr-1">🏆</span>}
                              {knockout.final.team2}
                            </button>
                          </div>
                          {knockout.final.winner && (
                            <button
                              onClick={() => setKnockoutWinner("final", 0, null)}
                              className="text-xs text-slate-600 hover:text-red-400 mt-2 flex items-center gap-1 transition-colors"
                            >
                              <X className="w-3 h-3" /> Xóa kết quả
                            </button>
                          )}
                          <div className="mt-2 flex gap-4">
                            <input
                              type="text"
                              value={knockout.final.team1}
                              onChange={(e) => {
                                const next = { ...knockout };
                                next.final = { ...next.final, team1: e.target.value };
                                setKnockout(next);
                              }}
                              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500/60"
                              placeholder="Đội 1"
                            />
                            <input
                              type="text"
                              value={knockout.final.team2}
                              onChange={(e) => {
                                const next = { ...knockout };
                                next.final = { ...next.final, team2: e.target.value };
                                setKnockout(next);
                              }}
                              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-orange-500/60"
                              placeholder="Đội 2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </FadeInView>
      </div>

      {/* ── Login Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowLoginModal(false); setLoginError(false); setPassword(""); } }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Đăng nhập Admin</p>
                    <p className="text-slate-500 text-xs">Chỉ dành cho Ban Tổ Chức</p>
                  </div>
                </div>
                <button onClick={() => { setShowLoginModal(false); setLoginError(false); setPassword(""); }} className="text-slate-600 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
                    placeholder="Nhập mật khẩu admin..."
                    autoFocus
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none transition-colors ${
                      loginError ? "border-red-500" : "border-slate-700 focus:border-orange-500/60"
                    }`}
                  />
                  {loginError && (
                    <p className="text-red-400 text-xs mt-1.5">❌ Mật khẩu không đúng. Thử lại!</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Đăng nhập
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
