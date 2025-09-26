-- Expand class skill choices to include all D&D 5e skills
-- This allows players to choose any skill proficiency during character creation

-- All D&D 5e skills
-- Strength: Athletics
-- Dexterity: Acrobatics, Sleight of Hand, Stealth
-- Intelligence: Arcana, History, Investigation, Nature, Religion
-- Wisdom: Animal Handling, Insight, Medicine, Perception, Survival
-- Charisma: Deception, Intimidation, Performance, Persuasion

-- Update all classes to allow choice from all skills
UPDATE classes SET skill_proficiencies = '["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"]'
WHERE id IN ('barbarian', 'fighter', 'wizard', 'rogue', 'ranger', 'cleric', 'paladin', 'warlock', 'bard', 'druid', 'monk', 'sorcerer');