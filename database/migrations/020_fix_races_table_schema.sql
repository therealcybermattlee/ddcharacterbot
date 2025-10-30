-- Fix races table schema to match API expectations and local database
-- Remote database has outdated schema with different column names

-- Drop old races table
DROP TABLE IF EXISTS races;

-- Recreate races table with correct schema
CREATE TABLE IF NOT EXISTS races (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  size TEXT NOT NULL,
  speed INTEGER NOT NULL DEFAULT 30,
  ability_score_increase TEXT NOT NULL, -- JSON object: {"strength": 1, "dexterity": 2}
  proficiencies TEXT NOT NULL, -- JSON object with skills, languages, tools
  traits TEXT NOT NULL, -- JSON array of racial traits
  languages TEXT NOT NULL, -- JSON array
  source TEXT NOT NULL DEFAULT 'PHB',
  is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_races_source ON races(source, is_homebrew);
CREATE INDEX IF NOT EXISTS idx_races_size ON races(size);
