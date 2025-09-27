-- Add Unearthed Arcana Gothic Lineages
-- These are playtest races from UA 2021: Gothic Lineages
-- Source: https://media.wizards.com/2021/dnd/downloads/UA2021_GothicLineages.pdf

-- First, add is_unearthed_arcana column to races table if it doesn't exist
-- This will help distinguish UA content from official published content
ALTER TABLE races ADD COLUMN is_unearthed_arcana BOOLEAN DEFAULT FALSE;

-- Gothic Lineages - these use the new lineage system with flexible ability scores
INSERT OR REPLACE INTO races (id, name, ability_score_increase, traits, proficiencies, languages, size, speed, source, is_unearthed_arcana) VALUES

-- Dhampir
('dhampir', 'Dhampir', '{"choice": "+2 to one ability, +1 to another"}', '["Ancestral Legacy: Choose one skill proficiency and one tool proficiency or language", "Deathless Nature: No need to breathe, advantage on saves vs disease and poison, resistance to poison damage", "Spider Climb: Climbing speed equal to walking speed, can climb difficult surfaces and ceilings", "Vampiric Bite: Fangs are natural weapon (1d4 + Str/Dex piercing), can heal HP equal to damage dealt (proficiency bonus times per long rest)", "Darkvision: 60 feet"]', '[]', '["Common", "choice of one other language"]', 'Medium', 35, 'UA2021', TRUE),

-- Hexblood
('hexblood', 'Hexblood', '{"choice": "+2 to one ability, +1 to another"}', '["Ancestral Legacy: Choose one skill proficiency and one tool proficiency or language", "Fey Resilience: Advantage on saves against being charmed, magic cannot put you to sleep", "Hex Magic: Know Disguise Self and Hex spells, choose Int/Wis/Cha as spellcasting ability", "Magic Token: Create magic tokens as focus for spells, can scry through them", "Darkvision: 60 feet"]', '[]', '["Common", "choice of one other language"]', 'Medium', 30, 'UA2021', TRUE),

-- Reborn
('reborn', 'Reborn', '{"choice": "+2 to one ability, +1 to another"}', '["Ancestral Legacy: Choose one skill proficiency and one tool proficiency or language", "Deathless Nature: No need to eat/drink/breathe/sleep, advantage on saves vs disease and poison, resistance to poison damage", "Knowledge from a Past Life: Add 1d6 to ability checks using skills (proficiency bonus times per long rest)", "Darkvision: 60 feet"]', '[]', '["Common", "choice of one other language"]', 'Medium', 30, 'UA2021', TRUE);