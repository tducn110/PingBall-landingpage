import { useState, useEffect, useCallback } from "react";
import { getCurrentTournament, createTournament } from "../api/tournaments";
import type { Tournament } from "../types";

export function useTournament() {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const t = await getCurrentTournament();
      setTournament(t);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { tournament, loading, error, refetch: fetch, createTournament };
}
