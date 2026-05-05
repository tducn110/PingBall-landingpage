import { supabase } from "../lib/supabase";

const BUCKET = "payment-proofs";

export async function uploadPaymentProof(
  file: File,
  teamId: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `team-${teamId}/receipt.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
}

export function getPaymentProofUrl(filePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
