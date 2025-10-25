-- Performance Optimization Indexes
-- Migration 016: Additional indexes for query performance optimization
-- Target: Sub-100ms query performance for common operations

-- === Character Queries ===
-- Composite indexes for common character queries

-- Find characters by user and level range (common for filtering)
CREATE INDEX IF NOT EXISTS idx_characters_user_level
    ON characters(user_id, level);

-- Find characters by campaign and user (party roster)
-- Note: Only create if campaign_id column exists (0001 schema)
-- CREATE INDEX IF NOT EXISTS idx_characters_campaign_user
--     ON characters(campaign_id, user_id);

-- Search public characters by class_id (001 schema uses class_id)
CREATE INDEX IF NOT EXISTS idx_characters_public_class
    ON characters(is_public, class_id) WHERE is_public = TRUE;

-- === Campaign Queries ===
-- Campaign member lookups (only if campaigns tables exist - 0001 schema)
-- Note: These tables don't exist in 001 schema, skip for now
-- CREATE INDEX IF NOT EXISTS idx_campaign_members_user_id
--     ON campaign_members(user_id, campaign_id);

-- === Session Queries ===
-- Session history and tracking (only if session tables exist - 0001 schema)
-- CREATE INDEX IF NOT EXISTS idx_campaign_sessions_date_campaign
--     ON campaign_sessions(date, campaign_id);

-- === Equipment Queries ===
-- Inventory lookups by character (only if equipment tables exist - 0001 schema)
-- CREATE INDEX IF NOT EXISTS idx_character_equipment_equipped
--     ON character_equipment(character_id, is_equipped) WHERE is_equipped = TRUE;

-- Find attuned items (only if equipment tables exist - 0001 schema)
-- CREATE INDEX IF NOT EXISTS idx_character_equipment_attuned
--     ON character_equipment(character_id, is_attuned) WHERE is_attuned = TRUE;

-- === Spell Queries ===
-- Spell lookups and filtering

-- Find spells by level and school (spell selection UI)
CREATE INDEX IF NOT EXISTS idx_spells_level_school
    ON spells(level, school);

-- Find character's prepared spells (only if character_spells table exists - 0001 schema)
-- CREATE INDEX IF NOT EXISTS idx_character_spells_prepared
--     ON character_spells(character_id, is_prepared) WHERE is_prepared = TRUE;

-- === Reference Data Queries ===
-- Races, classes, backgrounds

-- Search races by source (PHB, Volo's, etc.)
CREATE INDEX IF NOT EXISTS idx_races_source_homebrew
    ON races(source, is_homebrew);

-- Search classes by source
CREATE INDEX IF NOT EXISTS idx_classes_source_homebrew
    ON classes(source, is_homebrew);

-- Search backgrounds by source
CREATE INDEX IF NOT EXISTS idx_backgrounds_source_homebrew
    ON backgrounds(source, is_homebrew);

-- === User & Authentication ===
-- Session lookups

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_expires
    ON user_sessions(user_id, expires_at);

-- === Analytics Queries ===
-- Usage analytics aggregation (only if usage_analytics table exists - 0001 schema)
-- CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_event
--     ON usage_analytics(user_id, event_type, timestamp);

-- CREATE INDEX IF NOT EXISTS idx_usage_analytics_campaign_event
--     ON usage_analytics(campaign_id, event_type, timestamp);

-- === Character Progression ===
-- Level history tracking (only if character_progression table exists - 0001 schema)
-- CREATE INDEX IF NOT EXISTS idx_character_progression_level
--     ON character_progression(character_id, level, timestamp);

-- === Character Analytics ===
-- Analytics for 001 schema (uses character_analytics table)
CREATE INDEX IF NOT EXISTS idx_character_analytics_character
    ON character_analytics(character_id, event_type, timestamp);

-- === Covering Indexes ===
-- Include commonly queried columns to avoid table lookups

-- Character list query optimization
-- CREATE INDEX IF NOT EXISTS idx_characters_list_covering
--     ON characters(user_id, id, name, level, character_class, race);
-- Note: SQLite doesn't support INCLUDE clause, but we can simulate with composite

-- === Partial Indexes ===
-- Indexes for filtered queries (already implemented above with WHERE clauses)

-- === Performance Notes ===
-- 1. Composite indexes should match query WHERE clause column order
-- 2. Partial indexes reduce index size for filtered queries
-- 3. Covering indexes eliminate table lookups but increase write overhead
-- 4. Balance index count vs. write performance (max ~10-15 indexes per table)
-- 5. Monitor query plans with EXPLAIN QUERY PLAN
-- 6. Periodically ANALYZE tables to update statistics

-- ANALYZE command updates SQLite query optimizer statistics
-- Run periodically in production
-- ANALYZE;
