import { supabase } from "../lib/supabase";
import type { Match } from "../types";

export async function getMatches(
  tournamentId: string,
  groupId?: string
): Promise<Match[]> {
  let query = supabase
    .from("matches")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("match_number", { ascending: true });

  if (groupId) {
    query = query.eq("group_id", groupId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateMatchResult(
  matchId: string,
  winnerId: string | null
): Promise<void> {
  const status = winnerId ? "completed" : "pending";
  const { error } = await supabase
    .from("matches")
    .update({ winner_id: winnerId, status, updated_at: new Date().toISOString() })
    .eq("id", matchId);

  if (error) throw error;
}

export async function resetGroupMatches(
  tournamentId: string,
  groupId: string
): Promise<void> {
  const { error } = await supabase
    .from("matches")
    .update({ winner_id: null, status: "pending", updated_at: new Date().toISOString() })
    .eq("tournament_id", tournamentId)
    .eq("group_id", groupId);

  if (error) throw error;
}

export async function initializeGroupMatches(
  tournamentId: string,
  groupId: string,
  teamIds: [string, string, string, string]
): Promise<void> {
  const matchEntries = [
    { round: 1, match_number: 1, team1_id: teamIds[0], team2_id: teamIds[1] },
    { round: 1, match_number: 2, team1_id: teamIds[2], team2_id: teamIds[3] },
  ];

  // Create initial matches; subsequent rounds are populated when results come in
  const { error } = await supabase.from("matches").insert(
    matchEntries.map((m) => ({
      tournament_id: tournamentId,
      group_id: groupId,
      ...m,
    }))
  );

  if (error) throw error;
}
