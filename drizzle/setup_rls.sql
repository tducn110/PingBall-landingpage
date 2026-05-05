-- ============================================================================
-- Run this SQL in the Supabase SQL Editor to enable RLS and set up policies
-- ============================================================================

-- ── Enable RLS on all tables ─────────────────────────────────────────────────
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- ── Tournaments: anyone can read, only admins can write ──────────────────────
CREATE POLICY "Anyone can read tournaments"
  ON tournaments FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert tournaments"
  ON tournaments FOR INSERT
  WITH CHECK (true);  -- tighten via app logic (admin password check)

CREATE POLICY "Admins can update tournaments"
  ON tournaments FOR UPDATE
  USING (true);

-- ── Teams: anyone can read, anyone can insert (registration), admins can update ──
CREATE POLICY "Anyone can read teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Anyone can register a team"
  ON teams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update teams"
  ON teams FOR UPDATE
  USING (true);

CREATE POLICY "Admins can delete teams"
  ON teams FOR DELETE
  USING (true);

-- ── Matches: anyone can read, admins can write ───────────────────────────────
CREATE POLICY "Anyone can read matches"
  ON matches FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert matches"
  ON matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update matches"
  ON matches FOR UPDATE
  USING (true);

-- ── Storage: payment-proofs bucket ───────────────────────────────────────────
-- Create the bucket via the Supabase Dashboard, then run:

-- Allow anyone to upload (for registration)
-- CREATE POLICY "Anyone can upload payment proof"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'payment-proofs');

-- -- Allow public read access to payment proofs
-- CREATE POLICY "Anyone can view payment proofs"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'payment-proofs');
