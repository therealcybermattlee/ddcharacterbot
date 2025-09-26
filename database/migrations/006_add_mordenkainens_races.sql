-- Add races from Mordenkainen's Tome of Foes
-- These include the Gith races and additional elf/dwarf/tiefling subraces

-- Gith (base race) - Note: In actual D&D, players choose Githyanki or Githzerai directly
-- Githyanki
INSERT OR REPLACE INTO races (id, name, ability_score_bonuses, traits, proficiencies, languages, size, speed, source) VALUES
('githyanki', 'Githyanki', '{"strength": 2, "intelligence": 1}', '["Decadent Mastery: Proficiency with light and medium armor, shortswords, longswords, greatswords", "Githyanki Psionics: Know Mage Hand cantrip, cast Jump at 3rd level, Misty Step at 5th level (1/long rest each)", "Innate Spellcasting: Intelligence is spellcasting ability"]', '["Light Armor", "Medium Armor", "Shortsword", "Longsword", "Greatsword"]', '["Common", "Gith"]', 'Medium', 30, 'MToF'),

-- Githzerai
('githzerai', 'Githzerai', '{"wisdom": 2, "intelligence": 1}', '["Mental Discipline: Advantage on saves against charmed and frightened conditions", "Githzerai Psionics: Know Mage Hand cantrip, cast Shield at 3rd level, Detect Thoughts at 5th level (1/long rest each)", "Innate Spellcasting: Wisdom is spellcasting ability"]', '[]', '["Common", "Gith"]', 'Medium', 30, 'MToF');

-- Note: The following are subraces that extend existing races
-- In the current database structure, we'll add them as separate race entries
-- In a more advanced system, we'd implement a subrace relationship

-- Elf Subraces from Mordenkainen's Tome of Foes

-- Eladrin (Elf subrace)
INSERT OR REPLACE INTO races (id, name, ability_score_bonuses, traits, proficiencies, languages, size, speed, source) VALUES
('eladrin', 'Eladrin', '{"dexterity": 2, "charisma": 1}', '["Keen Senses: Proficiency in Perception", "Fey Ancestry: Advantage on saves against being charmed, magic cannot put you to sleep", "Trance: 4 hours of trance instead of 8 hours sleep", "Fey Step: Teleport 30 feet as bonus action (1/short rest)", "Shifting Seasons: Choose a season that affects your Fey Step", "Darkvision: 60 feet"]', '["Perception", "Longsword", "Shortbow", "Longbow", "Rapier"]', '["Common", "Elvish"]', 'Medium', 30, 'MToF'),

-- Sea Elf (Elf subrace)
('sea-elf', 'Sea Elf', '{"dexterity": 2, "constitution": 1}', '["Keen Senses: Proficiency in Perception", "Fey Ancestry: Advantage on saves against being charmed, magic cannot put you to sleep", "Trance: 4 hours of trance instead of 8 hours sleep", "Sea Elf Training: Proficiency with spears, tridents, light crossbows, nets", "Child of the Sea: Swimming speed 30 feet, can breathe air and water", "Friend of the Sea: Can communicate simple ideas with sea creatures", "Darkvision: 60 feet"]', '["Perception", "Spear", "Trident", "Light Crossbow", "Net"]', '["Common", "Elvish", "Aquan"]', 'Medium', 30, 'MToF'),

-- Shadar-kai (Elf subrace)
('shadar-kai', 'Shadar-kai', '{"dexterity": 2, "constitution": 1}', '["Keen Senses: Proficiency in Perception", "Fey Ancestry: Advantage on saves against being charmed, magic cannot put you to sleep", "Trance: 4 hours of trance instead of 8 hours sleep", "Necrotic Resistance: Resistance to necrotic damage", "Blessing of the Raven Queen: Teleport 30 feet as bonus action, resistance to all damage until start of next turn (1/long rest)", "Darkvision: 60 feet"]', '["Perception", "Longsword", "Shortbow", "Longbow", "Rapier"]', '["Common", "Elvish"]', 'Medium', 30, 'MToF');

-- Dwarf Subrace from Mordenkainen's Tome of Foes

-- Duergar (Gray Dwarf subrace)
INSERT OR REPLACE INTO races (id, name, ability_score_bonuses, traits, proficiencies, languages, size, speed, source) VALUES
('duergar', 'Duergar', '{"constitution": 2, "strength": 1}', '["Dwarven Resilience: Advantage on saves against poison, resistance to poison damage", "Stonecunning: Proficiency bonus doubled for Intelligence (History) checks related to stonework", "Superior Darkvision: Darkvision 120 feet", "Sunlight Sensitivity: Disadvantage on attacks and Perception in sunlight", "Duergar Magic: Cast Enlarge/Reduce on self at 3rd level, Invisibility on self at 5th level (1/long rest each)", "Extra Language: Speak Undercommon"]', '["Battleaxe", "Handaxe", "Light Hammer", "Warhammer"]', '["Common", "Dwarvish", "Undercommon"]', 'Medium', 25, 'MToF');

-- Tiefling Subraces from Mordenkainen's Tome of Foes
-- Note: These replace the default Asmodeus tiefling traits with different infernal heritage

-- Baalzebul Tiefling
INSERT OR REPLACE INTO races (id, name, ability_score_bonuses, traits, proficiencies, languages, size, speed, source) VALUES
('tiefling-baalzebul', 'Tiefling (Baalzebul)', '{"charisma": 2, "intelligence": 1}', '["Hellish Resistance: Resistance to fire damage", "Legacy of Maladomini: Know Thaumaturgy cantrip, cast Ray of Sickness at 3rd level, Crown of Madness at 5th level (1/long rest each)", "Innate Spellcasting: Charisma is spellcasting ability", "Darkvision: 60 feet"]', '[]', '["Common", "Infernal"]', 'Medium', 30, 'MToF'),

-- Dispater Tiefling
('tiefling-dispater', 'Tiefling (Dispater)', '{"charisma": 2, "dexterity": 1}', '["Hellish Resistance: Resistance to fire damage", "Legacy of Dis: Know Thaumaturgy cantrip, cast Disguise Self at 3rd level, Detect Thoughts at 5th level (1/long rest each)", "Innate Spellcasting: Charisma is spellcasting ability", "Darkvision: 60 feet"]', '[]', '["Common", "Infernal"]', 'Medium', 30, 'MToF'),

-- Fierna Tiefling
('tiefling-fierna', 'Tiefling (Fierna)', '{"charisma": 2, "wisdom": 1}', '["Hellish Resistance: Resistance to fire damage", "Legacy of Phlegethos: Know Friends cantrip, cast Charm Person at 3rd level, Suggestion at 5th level (1/long rest each)", "Innate Spellcasting: Charisma is spellcasting ability", "Darkvision: 60 feet"]', '[]', '["Common", "Infernal"]', 'Medium', 30, 'MToF'),

-- Glasya Tiefling
('tiefling-glasya', 'Tiefling (Glasya)', '{"charisma": 2, "dexterity": 1}', '["Hellish Resistance: Resistance to fire damage", "Legacy of Malbolge: Know Minor Illusion cantrip, cast Disguise Self at 3rd level, Invisibility at 5th level (1/long rest each)", "Innate Spellcasting: Charisma is spellcasting ability", "Darkvision: 60 feet"]', '[]', '["Common", "Infernal"]', 'Medium', 30, 'MToF'),

-- Levistus Tiefling
('tiefling-levistus', 'Tiefling (Levistus)', '{"charisma": 2, "constitution": 1}', '["Hellish Resistance: Resistance to fire damage", "Legacy of Stygia: Know Ray of Frost cantrip, cast Armor of Agathys at 3rd level, Darkness at 5th level (1/long rest each)", "Innate Spellcasting: Charisma is spellcasting ability", "Darkvision: 60 feet"]', '[]', '["Common", "Infernal"]', 'Medium', 30, 'MToF'),

-- Mammon Tiefling
('tiefling-mammon', 'Tiefling (Mammon)', '{"charisma": 2, "intelligence": 1}', '["Hellish Resistance: Resistance to fire damage", "Legacy of Minauros: Know Mage Hand cantrip, cast Tenser''s Floating Disk at 3rd level, Arcane Lock at 5th level (1/long rest each)", "Innate Spellcasting: Charisma is spellcasting ability", "Darkvision: 60 feet"]', '[]', '["Common", "Infernal"]', 'Medium', 30, 'MToF'),

-- Mephistopheles Tiefling
('tiefling-mephistopheles', 'Tiefling (Mephistopheles)', '{"charisma": 2, "intelligence": 1}', '["Hellish Resistance: Resistance to fire damage", "Legacy of Cania: Know Mage Hand cantrip, cast Burning Hands at 3rd level, Flame Blade at 5th level (1/long rest each)", "Innate Spellcasting: Charisma is spellcasting ability", "Darkvision: 60 feet"]', '[]', '["Common", "Infernal"]', 'Medium', 30, 'MToF'),

-- Zariel Tiefling
('tiefling-zariel', 'Tiefling (Zariel)', '{"charisma": 2, "strength": 1}', '["Hellish Resistance: Resistance to fire damage", "Legacy of Avernus: Know Thaumaturgy cantrip, cast Searing Smite at 3rd level, Branding Smite at 5th level (1/long rest each)", "Innate Spellcasting: Charisma is spellcasting ability", "Darkvision: 60 feet"]', '[]', '["Common", "Infernal"]', 'Medium', 30, 'MToF');