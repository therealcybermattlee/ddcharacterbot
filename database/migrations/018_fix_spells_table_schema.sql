-- Fix spells table schema to match API expectations
-- Remote database has outdated schema with wrong column names

-- Drop old spells table (contains no production data yet)
DROP TABLE IF EXISTS spells;

-- Recreate spells table with correct schema
CREATE TABLE spells (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL,
  school TEXT NOT NULL,
  casting_time TEXT NOT NULL,
  range TEXT NOT NULL,
  components TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  at_higher_levels TEXT,
  classes TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'PHB',
  is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_spells_level ON spells(level);
CREATE INDEX IF NOT EXISTS idx_spells_school ON spells(school);
CREATE INDEX IF NOT EXISTS idx_spells_source ON spells(source, is_homebrew);
