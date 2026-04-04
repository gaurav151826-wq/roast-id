-- ══════════════════════════════════════════════════════════════
-- ROAST LICENSE — Complete Database Schema + Seed Data
-- Run this in Supabase SQL Editor for a fresh project
-- ══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ TABLE 1: roast_licenses (main card data)                    │
-- └─────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS roast_licenses (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(50) NOT NULL,
  status          VARCHAR(50) NOT NULL,
  achievements    TEXT,                          -- JSON string array e.g. '["Watched 100 Reels","Stayed in bed 12 hours"]'
  luck_level      INTEGER NOT NULL DEFAULT 50,
  issue_id        VARCHAR(10) NOT NULL,          -- Unique card identifier e.g. "RL4X8K2M"
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Index for fast card lookups by issue_id (used by /api/card?id=...)
CREATE INDEX IF NOT EXISTS idx_roast_licenses_issue_id ON roast_licenses (issue_id);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ TABLE 2: roast_card_extras (brain rot level per card)       │
-- │ Separate table because brain_rot_level was added later      │
-- │ Joined with roast_licenses via issue_id                     │
-- └─────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS roast_card_extras (
  id              SERIAL PRIMARY KEY,
  issue_id        VARCHAR(10) NOT NULL,          -- Links to roast_licenses.issue_id
  brain_rot_level INTEGER NOT NULL DEFAULT 50,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_roast_card_extras_issue_id ON roast_card_extras (issue_id);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ ENABLE ROW LEVEL SECURITY (required by Supabase)            │
-- │ These policies allow full public read/write via service key  │
-- └─────────────────────────────────────────────────────────────┘
ALTER TABLE roast_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE roast_card_extras ENABLE ROW LEVEL SECURITY;

-- Allow all operations for service_role (API routes use service key)
CREATE POLICY "service_role_all_roast_licenses" ON roast_licenses
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_roast_card_extras" ON roast_card_extras
  FOR ALL USING (true) WITH CHECK (true);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ SEED DATA: 12 sample roast licenses                         │
-- └─────────────────────────────────────────────────────────────┘
INSERT INTO roast_licenses (name, status, achievements, luck_level, issue_id) VALUES
  ('Alex',    'Legibly Cooked',       '["Stayed in bed 12 hours","Watched 100 Reels"]',                                15, 'RL4X8K2M'),
  ('Jordan',  'Professional Yapper',  '["Ignored a ''Seen'' message","Survived on 2 hours sleep"]',                    62, 'RL7N3Q9T'),
  ('Sam',     '3 AM Overthinker',     '["Survived on 2 hours sleep","Stayed in bed 12 hours","Watched 100 Reels"]',    42, 'OT9R1L5P'),
  ('Riley',   '100% Simp',            '["Ignored a ''Seen'' message","Watched 100 Reels"]',                            45, 'CH3M8W6J'),
  ('Morgan',  'Broke Legend',          '["Stayed in bed 12 hours","Survived on 2 hours sleep"]',                        73, 'CK5F2A8D'),
  ('Taylor',  'Legibly Cooked',       '["Watched 100 Reels","Survived on 2 hours sleep"]',                             8,  'HU7B4G9K'),
  ('Casey',   'Professional Yapper',  '["Ignored a ''Seen'' message"]',                                                55, 'OT2N6X1R'),
  ('Avery',   '3 AM Overthinker',     '["Survived on 2 hours sleep","Watched 100 Reels"]',                             33, 'CH8P3Y7W'),
  ('Dakota',  'Broke Legend',          '["Stayed in bed 12 hours","Ignored a ''Seen'' message"]',                       81, 'CK1V9H4S'),
  ('Jamie',   '100% Simp',            '["Watched 100 Reels","Ignored a ''Seen'' message","Stayed in bed 12 hours"]',   41, 'HU6D2M8T'),
  ('Skyler',  'Legibly Cooked',       '["Sent ''Omw'' while in bed","Googled ''Am I cooked''"]',                       12, 'SK3P7Q1R'),
  ('Quinn',   '3 AM Overthinker',     '["Stalked an ex''s profile","Replied ''lol'' to a serious text"]',              28, 'QN8W2V5X');

-- ┌─────────────────────────────────────────────────────────────┐
-- │ SEED DATA: Brain rot levels for each card                   │
-- └─────────────────────────────────────────────────────────────┘
INSERT INTO roast_card_extras (issue_id, brain_rot_level) VALUES
  ('RL4X8K2M', 78),
  ('RL7N3Q9T', 45),
  ('OT9R1L5P', 92),
  ('CH3M8W6J', 33),
  ('CK5F2A8D', 88),
  ('HU7B4G9K', 25),
  ('OT2N6X1R', 67),
  ('CH8P3Y7W', 55),
  ('CK1V9H4S', 95),
  ('HU6D2M8T', 15),
  ('SK3P7Q1R', 85),
  ('QN8W2V5X', 71);

-- ══════════════════════════════════════════════════════════════
-- DONE! Your database is ready.
--
-- Tables created:
--   1. roast_licenses    — Main card data (name, status, achievements, luck, issue_id)
--   2. roast_card_extras — Brain rot level per card (linked via issue_id)
--
-- API routes that use these tables:
--   GET  /api/licenses   — List recent licenses (roast_licenses)
--   POST /api/licenses   — Create new license (roast_licenses + roast_card_extras)
--   GET  /api/card?id=X  — Fetch single card by issue_id (joins both tables)
--   GET  /api/stats       — Aggregate stats (roast_licenses)
-- ══════════════════════════════════════════════════════════════
