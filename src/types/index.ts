export interface Tournament {
  id: string;
  name: string;
  year: number;
  status: "upcoming" | "active" | "completed";
  created_at: string;
}

export interface Team {
  id: string;
  tournament_id: string;
  group_id: "A" | "B" | "C" | "D";
  name: string;
  player1_name: string;
  player1_student_id: string | null;
  player1_phone: string;
  player2_name: string;
  player2_student_id: string | null;
  payment_proof_url: string | null;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  group_id: "A" | "B" | "C" | "D";
  round: number;
  match_number: number;
  team1_id: string | null;
  team2_id: string | null;
  winner_id: string | null;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface TeamSlot {
  name: string;
}

export interface MatchResult {
  winnerId: 0 | 1 | null;
}

export interface GroupData {
  teams: TeamSlot[];
  results: MatchResult[];
}

export type TournamentData = Record<string, GroupData>;

export interface StandingRow {
  teamIdx: number;
  name: string;
  wins: number;
  losses: number;
  status: "1st" | "2nd" | "elim" | "";
}

export interface RegistrationData {
  player1_name: string;
  player1_student_id: string;
  player1_phone: string;
  player2_name: string;
  player2_student_id: string;
  paymentFile: File | null;
}
