import { useState, useEffect, useCallback } from "react";
import { getMatches, updateMatchResult, resetGroupMatches } from "../api/matches";
import type { Match } from "../types";

export function useMatches(tournamentId: string | null, groupId?: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!tournamentId) {
      setMatches([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getMatches(tournamentId, groupId);
      setMatches(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [tournamentId, groupId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const setWinner = useCallback(
    async (matchId: string, winnerId: string | null) => {
      await updateMatchResult(matchId, winnerId);
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? {
                ...m,
                winner_id: winnerId,
                status: winnerId ? ("completed" as const) : ("pending" as const),
              }
            : m
        )
      );
    },
    []
  );

  const resetGroup = useCallback(
    async (tournamentId: string, groupId: string) => {
      await resetGroupMatches(tournamentId, groupId);
      setMatches((prev) =>
        prev.map((m) =>
          m.group_id === groupId
            ? { ...m, winner_id: null, status: "pending" as const }
            : m
        )
      );
    },
    []
  );

  return { matches, loading, error, refetch: fetch, setWinner, resetGroup };
}
