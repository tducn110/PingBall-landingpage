import { useState, useCallback } from "react";
import { uploadPaymentProof } from "../api/storage";

export function usePaymentUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File, teamId: string): Promise<string> => {
    setUploading(true);
    setError(null);
    try {
      return await uploadPaymentProof(file, teamId);
    } catch (e) {
      setError((e as Error).message);
      throw e;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
}
