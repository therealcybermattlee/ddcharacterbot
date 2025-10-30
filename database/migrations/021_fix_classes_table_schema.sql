-- Fix classes table schema to match API expectations and local database
-- Remote database has outdated schema with hit_die as TEXT instead of INTEGER

-- Drop old classes table
DROP TABLE IF EXISTS classes;

-- Recreate classes table with correct schema
CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  hit_die INTEGER NOT NULL,
  primary_ability TEXT NOT NULL, -- JSON array
  saving_throw_proficiencies TEXT NOT NULL, -- JSON array
  skill_proficiencies TEXT NOT NULL, -- JSON array of available skills
  skill_choices INTEGER NOT NULL DEFAULT 0, -- Number of skill choices allowed
  armor_proficiencies TEXT NOT NULL, -- JSON array
  weapon_proficiencies TEXT NOT NULL, -- JSON array
  tool_proficiencies TEXT NOT NULL, -- JSON array
  starting_equipment TEXT NOT NULL, -- JSON object
  spellcasting_ability TEXT, -- Optional: 'intelligence', 'wisdom', 'charisma', etc.
  source TEXT NOT NULL DEFAULT 'PHB',
  is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_classes_source ON classes(source, is_homebrew);
CREATE INDEX IF NOT EXISTS idx_classes_spellcasting ON classes(spellcasting_ability) WHERE spellcasting_ability IS NOT NULL;
