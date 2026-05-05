const required = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const SUPABASE_URL = required("VITE_SUPABASE_URL");
export const SUPABASE_ANON_KEY = required("VITE_SUPABASE_ANON_KEY");
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "ictbongban2026";
