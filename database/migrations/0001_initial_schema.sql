-- D&D Character Manager Database Schema
-- Migration 0001: Initial schema with complete D&D 5e data model

-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player', -- 'dm', 'player', 'observer'
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    dm_user_id TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    settings TEXT, -- JSON for campaign-specific settings
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dm_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_campaigns_dm_user_id ON campaigns(dm_user_id);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at);

-- Campaign Members
CREATE TABLE IF NOT EXISTS campaign_members (
    campaign_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player', -- 'dm', 'player', 'observer'
    joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (campaign_id, user_id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Characters
CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    campaign_id TEXT,
    
    -- Basic info
    race TEXT NOT NULL,
    character_class TEXT NOT NULL,
    background TEXT,
    alignment TEXT,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    
    -- Core ability scores
    strength INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    constitution INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    wisdom INTEGER DEFAULT 10,
    charisma INTEGER DEFAULT 10,
    
    -- Derived stats
    armor_class INTEGER DEFAULT 10,
    hit_points_max INTEGER DEFAULT 8,
    hit_points_current INTEGER DEFAULT 8,
    hit_points_temp INTEGER DEFAULT 0,
    speed INTEGER DEFAULT 30,
    
    -- Proficiencies and bonuses (JSON)
    skills TEXT, -- JSON: {acrobatics: {proficient: true, expertise: false}, ...}
    saving_throws TEXT, -- JSON: {strength: true, dexterity: false, ...}
    languages TEXT, -- JSON: ["Common", "Elvish", ...]
    tool_proficiencies TEXT, -- JSON: ["Smith's Tools", ...]
    
    -- Combat stats
    initiative_modifier INTEGER DEFAULT 0,
    proficiency_bonus INTEGER DEFAULT 2,
    
    -- Character details
    personality_traits TEXT,
    ideals TEXT,
    bonds TEXT,
    flaws TEXT,
    backstory TEXT,
    notes TEXT,
    
    -- Metadata
    is_public BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
);

CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_campaign_id ON characters(campaign_id);
CREATE INDEX idx_characters_level ON characters(level);

-- Character Classes (for multiclassing)
CREATE TABLE IF NOT EXISTS character_classes (
    id TEXT PRIMARY KEY,
    character_id TEXT NOT NULL,
    class_name TEXT NOT NULL,
    level INTEGER NOT NULL,
    subclass TEXT,
    hit_die TEXT DEFAULT 'd8',
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX idx_character_classes_character_id ON character_classes(character_id);

-- Character Progression History
CREATE TABLE IF NOT EXISTS character_progression (
    id TEXT PRIMARY KEY,
    character_id TEXT NOT NULL,
    level INTEGER NOT NULL,
    changes TEXT NOT NULL, -- JSON of what changed
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    session_notes TEXT,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX idx_character_progression_character_id ON character_progression(character_id);

-- Spells reference data
CREATE TABLE IF NOT EXISTS spells (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    level INTEGER NOT NULL,
    school TEXT NOT NULL,
    casting_time TEXT NOT NULL,
    range_distance TEXT NOT NULL,
    components TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT NOT NULL,
    higher_level TEXT,
    ritual BOOLEAN DEFAULT FALSE,
    concentration BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'phb',
    is_homebrew BOOLEAN DEFAULT FALSE,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_spells_level ON spells(level);
CREATE INDEX idx_spells_school ON spells(school);
CREATE INDEX idx_spells_name ON spells(name);

-- Equipment reference data
CREATE TABLE IF NOT EXISTS equipment (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'weapon', 'armor', 'gear', 'tool', 'consumable'
    category TEXT, -- 'simple weapon', 'martial weapon', 'light armor', etc.
    rarity TEXT DEFAULT 'common',
    description TEXT,
    properties TEXT, -- JSON for weapon properties, armor stats, etc.
    weight REAL DEFAULT 0,
    cost_gp REAL DEFAULT 0,
    damage TEXT, -- For weapons: "1d6", "1d8+1", etc.
    damage_type TEXT, -- 'slashing', 'piercing', 'bludgeoning', etc.
    ac_base INTEGER, -- For armor
    ac_bonus INTEGER, -- For shields/magic items
    source TEXT DEFAULT 'phb',
    is_homebrew BOOLEAN DEFAULT FALSE,
    created_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_equipment_type ON equipment(type);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_name ON equipment(name);

-- Character Spells (known/prepared)
CREATE TABLE IF NOT EXISTS character_spells (
    id TEXT PRIMARY KEY,
    character_id TEXT NOT NULL,
    spell_id TEXT NOT NULL,
    is_prepared BOOLEAN DEFAULT FALSE,
    is_always_prepared BOOLEAN DEFAULT FALSE, -- From race/class features
    source TEXT, -- 'class', 'race', 'feat', 'magic item'
    spell_level INTEGER, -- Can differ from base spell level for upcasting
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (spell_id) REFERENCES spells(id) ON DELETE CASCADE,
    UNIQUE(character_id, spell_id)
);

CREATE INDEX idx_character_spells_character_id ON character_spells(character_id);

-- Character Equipment Inventory
CREATE TABLE IF NOT EXISTS character_equipment (
    id TEXT PRIMARY KEY,
    character_id TEXT NOT NULL,
    equipment_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    is_equipped BOOLEAN DEFAULT FALSE,
    is_attuned BOOLEAN DEFAULT FALSE,
    custom_name TEXT, -- For renamed items
    custom_properties TEXT, -- JSON for modifications/enhancements
    container_id TEXT, -- For items inside bags/containers
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (container_id) REFERENCES character_equipment(id) ON DELETE SET NULL
);

CREATE INDEX idx_character_equipment_character_id ON character_equipment(character_id);

-- Campaign Sessions
CREATE TABLE IF NOT EXISTS campaign_sessions (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    session_number INTEGER NOT NULL,
    title TEXT,
    summary TEXT,
    date TEXT NOT NULL,
    duration_minutes INTEGER,
    notes TEXT,
    experience_awarded INTEGER DEFAULT 0,
    created_by TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(campaign_id, session_number)
);

CREATE INDEX idx_campaign_sessions_campaign_id ON campaign_sessions(campaign_id);
CREATE INDEX idx_campaign_sessions_date ON campaign_sessions(date);

-- Session Character Snapshots (for tracking changes)
CREATE TABLE IF NOT EXISTS session_character_snapshots (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    character_id TEXT NOT NULL,
    snapshot_data TEXT NOT NULL, -- JSON of character state
    experience_before INTEGER,
    experience_after INTEGER,
    level_before INTEGER,
    level_after INTEGER,
    FOREIGN KEY (session_id) REFERENCES campaign_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE(session_id, character_id)
);

-- Asset metadata (for R2 storage tracking)
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    owner_user_id TEXT NOT NULL,
    campaign_id TEXT,
    character_id TEXT,
    asset_type TEXT NOT NULL, -- 'avatar', 'map', 'handout', 'portrait'
    storage_path TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX idx_assets_owner_user_id ON assets(owner_user_id);
CREATE INDEX idx_assets_campaign_id ON assets(campaign_id);
CREATE INDEX idx_assets_character_id ON assets(character_id);

-- D&D 5e Reference Data Tables

-- Races
CREATE TABLE IF NOT EXISTS races (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    size TEXT NOT NULL,
    speed INTEGER DEFAULT 30,
    ability_score_bonuses TEXT, -- JSON: {strength: 1, constitution: 2}
    traits TEXT, -- JSON array of racial traits
    languages TEXT, -- JSON array
    proficiencies TEXT, -- JSON for skills/tools/weapons
    source TEXT DEFAULT 'phb',
    is_homebrew BOOLEAN DEFAULT FALSE
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    hit_die TEXT NOT NULL DEFAULT 'd8',
    primary_ability TEXT, -- JSON array of primary abilities
    saving_throw_proficiencies TEXT, -- JSON array
    skill_proficiencies TEXT, -- JSON: available skills to choose from
    skill_choices INTEGER DEFAULT 2,
    armor_proficiencies TEXT, -- JSON array
    weapon_proficiencies TEXT, -- JSON array
    tool_proficiencies TEXT, -- JSON array
    starting_equipment TEXT, -- JSON of starting gear
    spellcasting_ability TEXT, -- 'intelligence', 'wisdom', 'charisma', null
    source TEXT DEFAULT 'phb',
    is_homebrew BOOLEAN DEFAULT FALSE
);

-- Backgrounds
CREATE TABLE IF NOT EXISTS backgrounds (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    skill_proficiencies TEXT, -- JSON array
    language_choices INTEGER DEFAULT 0,
    tool_proficiencies TEXT, -- JSON array
    starting_equipment TEXT, -- JSON
    feature_name TEXT,
    feature_description TEXT,
    suggested_characteristics TEXT, -- JSON for personality traits, ideals, etc.
    source TEXT DEFAULT 'phb',
    is_homebrew BOOLEAN DEFAULT FALSE
);

-- Analytics and Statistics Tables

-- Usage analytics
CREATE TABLE IF NOT EXISTS usage_analytics (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'character_created', 'session_played', 'spell_cast', etc.
    user_id TEXT,
    campaign_id TEXT,
    character_id TEXT,
    metadata TEXT, -- JSON for additional event data
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
);

CREATE INDEX idx_usage_analytics_event_type ON usage_analytics(event_type);
CREATE INDEX idx_usage_analytics_timestamp ON usage_analytics(timestamp);
CREATE INDEX idx_usage_analytics_user_id ON usage_analytics(user_id);