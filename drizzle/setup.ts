import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

const c = postgres(DATABASE_URL, { prepare: false });

async function main() {
  try {
    // 1. Enable RLS
    console.log("1. Enabling RLS...");
    await c`ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY`;
    await c`ALTER TABLE teams ENABLE ROW LEVEL SECURITY`;
    await c`ALTER TABLE matches ENABLE ROW LEVEL SECURITY`;
    console.log("   DONE");

    // 2. Tournament policies
    console.log("2. Tournament policies...");
    const cap = (s: TemplateStringsArray, ...v: any[]) => c.unsafe(String.raw(s, ...v));
    await cap`DO $$ BEGIN CREATE POLICY "t_select" ON tournaments FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    await cap`DO $$ BEGIN CREATE POLICY "t_insert" ON tournaments FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    await cap`DO $$ BEGIN CREATE POLICY "t_update" ON tournaments FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    console.log("   DONE");

    // 3. Team policies
    console.log("3. Team policies...");
    await cap`DO $$ BEGIN CREATE POLICY "te_select" ON teams FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    await cap`DO $$ BEGIN CREATE POLICY "te_insert" ON teams FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    await cap`DO $$ BEGIN CREATE POLICY "te_update" ON teams FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    await cap`DO $$ BEGIN CREATE POLICY "te_delete" ON teams FOR DELETE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    console.log("   DONE");

    // 4. Match policies
    console.log("4. Match policies...");
    await cap`DO $$ BEGIN CREATE POLICY "m_select" ON matches FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    await cap`DO $$ BEGIN CREATE POLICY "m_insert" ON matches FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    await cap`DO $$ BEGIN CREATE POLICY "m_update" ON matches FOR UPDATE USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
    console.log("   DONE");

    // 5. Storage bucket
    console.log("5. Storage bucket...");
    try {
      await c.unsafe(`INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true) ON CONFLICT (id) DO NOTHING`);
      console.log("   DONE");
    } catch (e: any) { console.log("   SKIP:", e.message); }

    // 6. Storage policies
    console.log("6. Storage policies...");
    try {
      await cap`DO $$ BEGIN CREATE POLICY "s_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-proofs'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
      await cap`DO $$ BEGIN CREATE POLICY "s_select" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
      console.log("   DONE");
    } catch (e: any) { console.log("   SKIP:", e.message); }

    // 7. Default tournament
    console.log("7. Tournament...");
    const r = await c`SELECT id FROM tournaments WHERE year = 2026 LIMIT 1`;
    if (r.length === 0) {
      await c`INSERT INTO tournaments (id, name, year, status) VALUES (gen_random_uuid(), 'VNUK 2026', 2026, 'upcoming')`;
      console.log("   Created 'VNUK 2026'");
    } else {
      console.log("   Already exists");
    }

    console.log("\nAll done!");
  } catch (e: any) {
    console.error("FAIL:", e.message);
  } finally {
    await c.end();
  }
}

main();
