import { supabase } from "../lib/supabase";
import type { Tournament } from "../types";

export async function getCurrentTournament(): Promise<Tournament | null> {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createTournament(
  name: string,
  year: number
): Promise<Tournament> {
  const { data, error } = await supabase
    .from("tournaments")
    .insert({ name, year })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTournamentStatus(
  id: string,
  status: Tournament["status"]
): Promise<void> {
  const { error } = await supabase
    .from("tournaments")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}
