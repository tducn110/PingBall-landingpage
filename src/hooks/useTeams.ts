import { useState, useEffect, useCallback } from "react";
import { getTeams, updateTeamName } from "../api/teams";
import type { Team } from "../types";

export function useTeams(tournamentId: string | null, groupId?: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!tournamentId) {
      setTeams([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getTeams(tournamentId, groupId);
      setTeams(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [tournamentId, groupId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const rename = useCallback(
    async (teamId: string, name: string) => {
      await updateTeamName(teamId, name);
      setTeams((prev) =>
        prev.map((t) => (t.id === teamId ? { ...t, name } : t))
      );
    },
    []
  );

  return { teams, loading, error, refetch: fetch, rename };
}
