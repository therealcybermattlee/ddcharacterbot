-- Add races from Volo's Guide to Monsters
-- These are the original Volo's Guide versions with fixed ability score increases
-- Updated versions can be found in Mordenkainen Presents: Monsters of the Multiverse

-- Aasimar
INSERT OR REPLACE INTO races (id, name, ability_score_bonuses, traits, proficiencies, languages, size, speed, source) VALUES
('aasimar', 'Aasimar', '{"charisma": 2}', '["Celestial Resistance: Resistance to necrotic and radiant damage", "Healing Hands: Touch a creature to heal HP equal to your level (1/long rest)", "Light Bearer: You know the Light cantrip", "Darkvision: 60 feet"]', '[]', '["Common", "Celestial"]', 'Medium', 30, 'VGtM'),

-- Firbolg
('firbolg', 'Firbolg', '{"wisdom": 2, "strength": 1}', '["Firbolg Magic: Cast Detect Magic and Disguise Self (1/short rest)", "Hidden Step: Bonus action to turn invisible until start of next turn (1/short rest)", "Powerful Build: Count as one size larger for carrying capacity", "Speech of Beast and Leaf: Limited communication with beasts and plants"]', '[]', '["Common", "Elvish", "Giant"]', 'Medium', 30, 'VGtM'),

-- Goliath
('goliath', 'Goliath', '{"strength": 2, "constitution": 1}', '["Natural Athlete: Proficiency in Athletics", "Stone''s Endurance: Use reaction to reduce damage by 1d12 + Con modifier (1/short rest)", "Powerful Build: Count as one size larger for carrying capacity", "Mountain Born: Acclimated to high altitude and cold climate"]', '["Athletics"]', '["Common", "Giant"]', 'Medium', 30, 'VGtM'),

-- Kenku
('kenku', 'Kenku', '{"dexterity": 2, "wisdom": 1}', '["Expert Forgery: Proficiency with forgery kits and advantage on forgery checks", "Kenku Training: Choose 2 skills from Acrobatics, Deception, Stealth, Sleight of Hand", "Mimicry: Can mimic sounds and voices you have heard"]', '["Forgery Kit"]', '["Common", "Aarakocra"]', 'Medium', 30, 'VGtM'),

-- Lizardfolk
('lizardfolk', 'Lizardfolk', '{"constitution": 2, "wisdom": 1}', '["Bite: 1d6 + Str piercing damage unarmed strike", "Cunning Artisan: Craft simple items from corpses", "Hold Breath: Hold breath for 15 minutes", "Hunter''s Lore: Choose 2 skills from Animal Handling, Nature, Perception, Stealth, Survival", "Natural Armor: 13 + Dex modifier AC when not wearing armor"]', '[]', '["Common", "Draconic"]', 'Medium', 30, 'VGtM'),

-- Tabaxi
('tabaxi', 'Tabaxi', '{"dexterity": 2, "charisma": 1}', '["Feline Agility: Double speed until end of turn (recharges when you don''t move)", "Cat''s Claws: Climbing speed of 20 feet", "Cat''s Talents: Proficiency in Perception and Stealth", "Claws: 1d4 + Str slashing damage unarmed strike", "Darkvision: 60 feet"]', '["Perception", "Stealth"]', '["Common", "choice of one other language"]', 'Medium', 30, 'VGtM'),

-- Triton
('triton', 'Triton', '{"strength": 1, "constitution": 1, "charisma": 1}', '["Amphibious: Can breathe air and water", "Control Air and Water: Cast Fog Cloud (1st), Gust of Wind (3rd), Wall of Water (5th) 1/long rest each", "Emissary of the Sea: Can communicate simple ideas with beasts with swimming speed", "Guardians of the Depths: Resistance to cold damage"]', '[]', '["Common", "Primordial"]', 'Medium', 30, 'VGtM');

-- Add "Monstrous Adventurers" races from Volo's Guide
-- These have simpler stat blocks but are fully playable

-- Bugbear
INSERT OR REPLACE INTO races (id, name, ability_score_bonuses, traits, proficiencies, languages, size, speed, source) VALUES
('bugbear', 'Bugbear', '{"strength": 2, "dexterity": 1}', '["Long-Limbed: Reach is 5 feet longer for melee attacks", "Powerful Build: Count as one size larger for carrying capacity", "Sneaky: Proficiency in Stealth", "Surprise Attack: Extra 2d6 damage when surprising a creature", "Darkvision: 60 feet"]', '["Stealth"]', '["Common", "Goblin"]', 'Medium', 30, 'VGtM'),

-- Goblin
('goblin', 'Goblin', '{"dexterity": 2, "constitution": 1}', '["Fury of the Small: Extra damage equal to your level to larger creature (1/short rest)", "Nimble Escape: Disengage or Hide as bonus action", "Darkvision: 60 feet"]', '[]', '["Common", "Goblin"]', 'Small', 30, 'VGtM'),

-- Hobgoblin
('hobgoblin', 'Hobgoblin', '{"constitution": 2, "intelligence": 1}', '["Martial Training: Proficiency with light armor and 2 martial weapons", "Saving Face: Add 1d4 to failed attack roll, ability check, or saving throw when ally can see you (1/short rest)", "Darkvision: 60 feet"]', '["Light Armor", "choice of 2 martial weapons"]', '["Common", "Goblin"]', 'Medium', 30, 'VGtM'),

-- Kobold
('kobold', 'Kobold', '{"dexterity": 2, "strength": -2}', '["Grovel, Cower, and Beg: Distract enemies as action, allies gain advantage on attacks (1/short rest)", "Pack Tactics: Advantage on attack rolls when ally is within 5 feet of target", "Sunlight Sensitivity: Disadvantage on attacks and Perception in sunlight", "Darkvision: 60 feet"]', '[]', '["Common", "Draconic"]', 'Small', 30, 'VGtM'),

-- Orc
('orc', 'Orc', '{"strength": 2, "constitution": 1, "intelligence": -2}', '["Aggressive: Bonus action to move toward hostile creature", "Menacing: Proficiency in Intimidation", "Relentless Endurance: Drop to 1 HP instead of 0 (1/long rest)", "Darkvision: 60 feet"]', '["Intimidation"]', '["Common", "Orc"]', 'Medium', 30, 'VGtM'),

-- Yuan-ti Pureblood
('yuan-ti-pureblood', 'Yuan-ti Pureblood', '{"charisma": 2, "intelligence": 1}', '["Innate Spellcasting: Know Poison Spray cantrip, cast Animal Friendship (snakes only) at will, cast Suggestion 1/long rest", "Magic Resistance: Advantage on saves against spells", "Poison Immunity: Immune to poison damage and poisoned condition", "Darkvision: 60 feet"]', '[]', '["Common", "Abyssal", "Draconic"]', 'Medium', 30, 'VGtM');