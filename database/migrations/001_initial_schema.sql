-- D&D Character Manager Database Schema
-- Initial schema creation for D&D 5e reference data and character management

-- Classes table
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

-- Races table
CREATE TABLE IF NOT EXISTS races (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  size TEXT NOT NULL, -- 'Small', 'Medium', 'Large'
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

-- Backgrounds table
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

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  experience_points INTEGER NOT NULL DEFAULT 0,
  class_id TEXT NOT NULL,
  race_id TEXT NOT NULL,
  background_id TEXT NOT NULL,

  -- Ability scores
  strength INTEGER NOT NULL,
  dexterity INTEGER NOT NULL,
  constitution INTEGER NOT NULL,
  intelligence INTEGER NOT NULL,
  wisdom INTEGER NOT NULL,
  charisma INTEGER NOT NULL,

  -- Derived stats
  armor_class INTEGER NOT NULL,
  hit_points INTEGER NOT NULL,
  hit_point_maximum INTEGER NOT NULL,
  speed INTEGER NOT NULL,

  -- Proficiencies and features (JSON)
  skill_proficiencies TEXT NOT NULL, -- JSON object
  saving_throw_proficiencies TEXT NOT NULL, -- JSON array
  languages TEXT NOT NULL, -- JSON array
  tool_proficiencies TEXT NOT NULL, -- JSON array
  weapon_proficiencies TEXT NOT NULL, -- JSON array
  armor_proficiencies TEXT NOT NULL, -- JSON array

  -- Character details
  personality_traits TEXT, -- JSON array
  ideals TEXT, -- JSON array
  bonds TEXT, -- JSON array
  flaws TEXT, -- JSON array
  backstory TEXT,

  -- Equipment and spells (JSON)
  equipment TEXT NOT NULL, -- JSON object
  spells_known TEXT, -- JSON array of spell IDs
  spell_slots TEXT, -- JSON object with slot levels

  -- Metadata
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (race_id) REFERENCES races(id),
  FOREIGN KEY (background_id) REFERENCES backgrounds(id)
);

-- Spells table (for future spell system)
CREATE TABLE IF NOT EXISTS spells (
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
  classes TEXT NOT NULL, -- JSON array of class IDs that can learn this spell
  source TEXT NOT NULL DEFAULT 'PHB',
  is_homebrew BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Session management
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Analytics tables
CREATE TABLE IF NOT EXISTS character_analytics (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'created', 'level_up', 'ability_score_change', etc.
  event_data TEXT NOT NULL, -- JSON object with event details
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_class_id ON characters(class_id);
CREATE INDEX IF NOT EXISTS idx_characters_race_id ON characters(race_id);
CREATE INDEX IF NOT EXISTS idx_characters_background_id ON characters(background_id);
CREATE INDEX IF NOT EXISTS idx_characters_level ON characters(level);
CREATE INDEX IF NOT EXISTS idx_characters_public ON characters(is_public);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_character_analytics_character_id ON character_analytics(character_id);
CREATE INDEX IF NOT EXISTS idx_character_analytics_event_type ON character_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_character_analytics_timestamp ON character_analytics(timestamp);

CREATE INDEX IF NOT EXISTS idx_classes_name ON classes(name);
CREATE INDEX IF NOT EXISTS idx_classes_source ON classes(source);
CREATE INDEX IF NOT EXISTS idx_classes_homebrew ON classes(is_homebrew);

CREATE INDEX IF NOT EXISTS idx_races_name ON races(name);
CREATE INDEX IF NOT EXISTS idx_races_source ON races(source);
CREATE INDEX IF NOT EXISTS idx_races_homebrew ON races(is_homebrew);

CREATE INDEX IF NOT EXISTS idx_backgrounds_name ON backgrounds(name);
CREATE INDEX IF NOT EXISTS idx_backgrounds_source ON backgrounds(source);
CREATE INDEX IF NOT EXISTS idx_backgrounds_homebrew ON backgrounds(is_homebrew);

CREATE INDEX IF NOT EXISTS idx_spells_name ON spells(name);
CREATE INDEX IF NOT EXISTS idx_spells_level ON spells(level);
CREATE INDEX IF NOT EXISTS idx_spells_school ON spells(school);
CREATE INDEX IF NOT EXISTS idx_spells_source ON spells(source);
CREATE INDEX IF NOT EXISTS idx_spells_homebrew ON spells(is_homebrew);