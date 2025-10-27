-- Fix backgrounds table schema to match API expectations
-- Remote database has outdated schema with wrong column names

-- Drop old backgrounds table (will need to re-seed data later)
DROP TABLE IF EXISTS backgrounds;

-- Recreate backgrounds table with correct schema
CREATE TABLE IF NOT EXISTS backgrounds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  skill_proficiencies TEXT NOT NULL, -- JSON array
  language_proficiencies TEXT NOT NULL, -- JSON array
  tool_proficiencies TEXT NOT NULL, -- JSON array
  equipment TEXT NOT NULL, -- JSON object
  feature_name TEXT NOT NULL,
  feature_description TEXT NOT NULL,
  personality_traits TEXT NOT NULL, -- JSON array of options
  ideals TEXT NOT NULL, -- JSON array of options
  bonds TEXT NOT NULL, -- JSON array of options
  flaws TEXT NOT NULL, -- JSON array of options
  source TEXT NOT NULL DEFAULT 'PHB',
  is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_backgrounds_source ON backgrounds(source, is_homebrew);
