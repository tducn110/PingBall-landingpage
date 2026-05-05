import { supabase } from "../lib/supabase";
import type { Team } from "../types";

export interface RegisterTeamInput {
  tournament_id: string;
  group_id: string;
  name: string;
  player1_name: string;
  player1_student_id: string;
  player1_phone: string;
  player2_name: string;
  player2_student_id: string;
  payment_proof_url?: string;
}

export async function registerTeam(input: RegisterTeamInput): Promise<Team> {
  const { data, error } = await supabase
    .from("teams")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTeams(
  tournamentId: string,
  groupId?: string
): Promise<Team[]> {
  let query = supabase
    .from("teams")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("created_at", { ascending: true });

  if (groupId) {
    query = query.eq("group_id", groupId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateTeamName(
  teamId: string,
  name: string
): Promise<void> {
  const { error } = await supabase
    .from("teams")
    .update({ name })
    .eq("id", teamId);

  if (error) throw error;
}

export async function deleteTeam(teamId: string): Promise<void> {
  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) throw error;
}

export async function updateTeamStatus(
  teamId: string,
  status: "pending" | "confirmed" | "rejected"
): Promise<void> {
  const { error } = await supabase
    .from("teams")
    .update({ status })
    .eq("id", teamId);

  if (error) throw error;
}
