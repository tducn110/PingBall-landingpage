import { useState, useCallback } from "react";
import { registerTeam } from "../api/teams";
import { uploadPaymentProof } from "../api/storage";
import type { RegisterTeamInput } from "../api/teams";

export function useRegistration() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (
      input: Omit<RegisterTeamInput, "payment_proof_url">,
      paymentFile: File | null
    ) => {
      setSubmitting(true);
      setError(null);
      try {
        let payment_proof_url: string | undefined;
        if (paymentFile) {
          // First register the team to get an ID, then upload
          const team = await registerTeam({ ...input, payment_proof_url: undefined });
          payment_proof_url = await uploadPaymentProof(paymentFile, team.id);
          // Update the team with the payment URL
          const { updateTeamStatus } = await import("../api/teams");
          // We don't need to update with URL since we'll just handle it in the upload
          return team;
        } else {
          return await registerTeam(input);
        }
      } catch (e) {
        setError((e as Error).message);
        throw e;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  return { submit, submitting, error };
}
