-- D&D 5e Reference Data Seeding
-- Core classes, races, and backgrounds from Player's Handbook

-- Insert core D&D 5e classes
INSERT OR REPLACE INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source) VALUES

-- Barbarian
('barbarian', 'Barbarian', 12, '["strength"]', '["strength", "constitution"]', '["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"]', 2, '["Light armor", "Medium armor", "Shields"]', '["Simple weapons", "Martial weapons"]', '[]', '{"weapons": ["handaxe", "javelin"], "armor": ["leather_armor", "shield"], "equipment": ["explorers_pack", "javelin"]}', NULL, 'PHB'),

-- Fighter
('fighter', 'Fighter', 10, '["strength", "dexterity"]', '["strength", "constitution"]', '["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"]', 2, '["All armor", "Shields"]', '["Simple weapons", "Martial weapons"]', '[]', '{"weapons": ["longsword", "shield"], "armor": ["chain_mail"], "equipment": ["dungeoneers_pack", "light_crossbow", "handaxe"]}', NULL, 'PHB'),

-- Wizard
('wizard', 'Wizard', 6, '["intelligence"]', '["intelligence", "wisdom"]', '["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"]', 2, '[]', '["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"]', '[]', '{"weapons": ["quarterstaff", "dagger"], "armor": [], "equipment": ["scholars_pack", "spellbook", "component_pouch"]}', 'intelligence', 'PHB'),

-- Rogue
('rogue', 'Rogue', 8, '["dexterity"]', '["dexterity", "intelligence"]', '["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"]', 4, '["Light armor"]', '["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"]', '["Thieves tools"]', '{"weapons": ["rapier", "shortsword", "shortbow"], "armor": ["leather_armor"], "equipment": ["burglars_pack", "thieves_tools", "dagger"]}', NULL, 'PHB'),

-- Ranger
('ranger', 'Ranger', 10, '["dexterity", "wisdom"]', '["strength", "dexterity"]', '["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"]', 3, '["Light armor", "Medium armor", "Shields"]', '["Simple weapons", "Martial weapons"]', '[]', '{"weapons": ["scimitar", "shortsword", "longbow"], "armor": ["leather_armor"], "equipment": ["dungeoneers_pack", "quiver", "arrows"]}', 'wisdom', 'PHB'),

-- Cleric
('cleric', 'Cleric', 8, '["wisdom"]', '["wisdom", "charisma"]', '["History", "Insight", "Medicine", "Persuasion", "Religion"]', 2, '["Light armor", "Medium armor", "Shields"]', '["Simple weapons"]', '[]', '{"weapons": ["mace", "shield"], "armor": ["scale_mail"], "equipment": ["priests_pack", "holy_symbol"]}', 'wisdom', 'PHB'),

-- Paladin
('paladin', 'Paladin', 10, '["strength", "charisma"]', '["wisdom", "charisma"]', '["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"]', 2, '["All armor", "Shields"]', '["Simple weapons", "Martial weapons"]', '[]', '{"weapons": ["longsword", "shield"], "armor": ["chain_mail"], "equipment": ["paladins_pack", "javelin", "holy_symbol"]}', 'charisma', 'PHB'),

-- Warlock
('warlock', 'Warlock', 8, '["charisma"]', '["wisdom", "charisma"]', '["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"]', 2, '["Light armor"]', '["Simple weapons"]', '[]', '{"weapons": ["light_crossbow", "dagger"], "armor": ["leather_armor"], "equipment": ["scholars_pack", "component_pouch"]}', 'charisma', 'PHB'),

-- Sorcerer
('sorcerer', 'Sorcerer', 6, '["charisma"]', '["constitution", "charisma"]', '["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"]', 2, '[]', '["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"]', '[]', '{"weapons": ["light_crossbow", "dagger"], "armor": [], "equipment": ["dungeoneers_pack", "component_pouch"]}', 'charisma', 'PHB'),

-- Bard
('bard', 'Bard', 8, '["charisma"]', '["dexterity", "charisma"]', '[]', 3, '["Light armor"]', '["Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"]', '["Three musical instruments of choice"]', '{"weapons": ["rapier", "dagger"], "armor": ["leather_armor"], "equipment": ["entertainers_pack", "lute", "dagger"]}', 'charisma', 'PHB'),

-- Druid
('druid', 'Druid', 8, '["wisdom"]', '["intelligence", "wisdom"]', '["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"]', 2, '["Light armor", "Medium armor", "Shields (non-metal)"]', '["Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"]', '["Herbalism kit"]', '{"weapons": ["scimitar", "shield"], "armor": ["leather_armor"], "equipment": ["explorers_pack", "druidcraft_focus"]}', 'wisdom', 'PHB'),

-- Monk
('monk', 'Monk', 8, '["dexterity", "wisdom"]', '["strength", "dexterity"]', '["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"]', 2, '[]', '["Simple weapons", "Shortswords"]', '["One artisan tool or musical instrument"]', '{"weapons": ["shortsword", "dart"], "armor": [], "equipment": ["dungeoneers_pack", "dart"]}', NULL, 'PHB');

-- Insert core D&D 5e races
INSERT OR REPLACE INTO races (id, name, size, speed, ability_score_increase, proficiencies, traits, languages, source) VALUES

-- Human
('human', 'Human', 'Medium', 30, '{"strength": 1, "dexterity": 1, "constitution": 1, "intelligence": 1, "wisdom": 1, "charisma": 1}', '{"skills": [], "languages": ["Common", "one_extra"], "tools": []}', '["Extra Language", "Extra Skill"]', '["Common"]', 'PHB'),

-- Elf
('elf', 'Elf', 'Medium', 30, '{"dexterity": 2}', '{"skills": ["Perception"], "languages": ["Common", "Elvish"], "tools": []}', '["Darkvision", "Fey Ancestry", "Trance"]', '["Common", "Elvish"]', 'PHB'),

-- Dwarf
('dwarf', 'Dwarf', 'Medium', 25, '{"constitution": 2}', '{"skills": [], "languages": ["Common", "Dwarvish"], "tools": ["One artisan tool"]}', '["Darkvision", "Dwarven Resilience", "Stonecunning"]', '["Common", "Dwarvish"]', 'PHB'),

-- Halfling
('halfling', 'Halfling', 'Small', 25, '{"dexterity": 2}', '{"skills": [], "languages": ["Common", "Halfling"], "tools": []}', '["Lucky", "Brave", "Halfling Nimbleness"]', '["Common", "Halfling"]', 'PHB'),

-- Dragonborn
('dragonborn', 'Dragonborn', 'Medium', 30, '{"strength": 2, "charisma": 1}', '{"skills": [], "languages": ["Common", "Draconic"], "tools": []}', '["Draconic Ancestry", "Breath Weapon", "Damage Resistance"]', '["Common", "Draconic"]', 'PHB'),

-- Gnome
('gnome', 'Gnome', 'Small', 25, '{"intelligence": 2}', '{"skills": [], "languages": ["Common", "Gnomish"], "tools": []}', '["Darkvision", "Gnome Cunning"]', '["Common", "Gnomish"]', 'PHB'),

-- Half-Elf
('half-elf', 'Half-Elf', 'Medium', 30, '{"charisma": 2}', '{"skills": ["Two skills of choice"], "languages": ["Common", "Elvish", "one_extra"], "tools": []}', '["Darkvision", "Fey Ancestry", "Skill Versatility"]', '["Common", "Elvish"]', 'PHB'),

-- Half-Orc
('half-orc', 'Half-Orc', 'Medium', 30, '{"strength": 2, "constitution": 1}', '{"skills": ["Intimidation"], "languages": ["Common", "Orc"], "tools": []}', '["Darkvision", "Relentless Endurance", "Savage Attacks"]', '["Common", "Orc"]', 'PHB'),

-- Tiefling
('tiefling', 'Tiefling', 'Medium', 30, '{"intelligence": 1, "charisma": 2}', '{"skills": [], "languages": ["Common", "Infernal"], "tools": []}', '["Darkvision", "Hellish Resistance", "Infernal Legacy"]', '["Common", "Infernal"]', 'PHB');

-- Insert core D&D 5e backgrounds
INSERT OR REPLACE INTO backgrounds (id, name, skill_proficiencies, language_proficiencies, tool_proficiencies, equipment, feature_name, feature_description, personality_traits, ideals, bonds, flaws, source) VALUES

-- Acolyte
('acolyte', 'Acolyte', '["Insight", "Religion"]', '["Two of your choice"]', '[]', '{"items": ["holy symbol", "prayer book", "incense", "vestments", "common clothes", "belt pouch"], "money": "15 gp"}', 'Shelter of the Faithful', 'You and your companions can receive free healing and care at temples of your faith.', '["I idolize a particular hero of my faith", "I can find common ground between enemies", "I see omens in every event", "Nothing can shake my optimistic attitude"]', '["Tradition", "Charity", "Change", "Power", "Faith", "Aspiration"]', '["I would die to recover an ancient relic", "I owe my life to the priest who took me in", "Everything I do is for the common people", "I will someday get revenge on those who destroyed my temple"]', '["I judge others harshly", "I put too much trust in those who wield power", "My piety sometimes leads me to blindly trust", "I am inflexible in my thinking"]', 'PHB'),

-- Criminal
('criminal', 'Criminal', '["Deception", "Stealth"]', '[]', '["One type of gaming set", "Thieves tools"]', '{"items": ["crowbar", "dark clothes", "hood", "belt pouch"], "money": "15 gp"}', 'Criminal Contact', 'You have a reliable contact who acts as your liaison to a network of other criminals.', '["I always have a plan for when things go wrong", "I am always calm, no matter the situation", "The first thing I do is note the exits", "I would rather make a friend than an enemy"]', '["Honor", "Freedom", "Charity", "Greed", "People", "Redemption"]', '["I am trying to pay off an old debt", "My ill-gotten gains go to support my family", "Something important was taken from me", "I will become the greatest thief ever"]', '["When I see something valuable, I can''t think about anything else", "I can''t resist a face in trouble", "I have a ''tell'' when I lie", "I turn tail and run when things look bad"]', 'PHB'),

-- Folk Hero
('folk-hero', 'Folk Hero', '["Animal Handling", "Survival"]', '[]', '["One type of artisan tools", "Vehicles (land)"]', '{"items": ["artisan tools", "shovel", "iron pot", "common clothes", "belt pouch"], "money": "10 gp"}', 'Rustic Hospitality', 'Since you come from the ranks of the common folk, you fit in among them with ease.', '["I judge people by their actions, not their words", "If someone is in trouble, I''m always willing to help", "When I set my mind to something, I follow through", "I have a strong sense of fair play"]', '["Respect", "Fairness", "Freedom", "Might", "Sincerity", "Destiny"]', '["I have a family, but I have no idea where they are", "I worked the land, I love the land", "A proud noble once gave me a terrible beating", "My tools are symbols of my past life"]', '["The tyrant who rules my land will stop at nothing to see me killed", "I''m convinced of my own destiny", "I have trouble trusting in my allies", "I have a weakness for the vices of the city"]', 'PHB'),

-- Noble
('noble', 'Noble', '["History", "Persuasion"]', '["One of your choice"]', '["One type of gaming set"]', '{"items": ["fine clothes", "signet ring", "scroll of pedigree", "purse"], "money": "25 gp"}', 'Position of Privilege', 'Thanks to your noble birth, people are inclined to think the best of you.', '["My eloquent flattery makes everyone I talk to feel wonderful", "The common folk love me for my kindness", "No one could doubt my courage", "I take great pains to always look my best"]', '["Respect", "Responsibility", "Noble Obligation", "Power", "Family", "Noble Obligation"]', '["I will face any challenge to win approval of my family", "My house''s alliance with another is worth my life", "Nothing is more important than the other members of my family", "I am in love with the heir of another house"]', '["I secretly believe everyone is beneath me", "I hide shameful secret that could ruin my family", "I too often hear veiled insults where none exist", "I have an insatiable desire for carnal pleasures"]', 'PHB'),

-- Sage
('sage', 'Sage', '["Arcana", "History"]', '["Two of your choice"]', '[]', '{"items": ["bottle of black ink", "quill", "small knife", "letter", "common clothes", "belt pouch"], "money": "10 gp"}', 'Researcher', 'When you attempt to learn or recall a piece of lore, you know where and from whom you can obtain that information.', '["I use polysyllabic words that convey the impression of great erudition", "I''ve read every book in the world''s greatest libraries", "I am horribly awkward in social situations", "I am convinced that people are always trying to steal my secrets"]', '["Knowledge", "Beauty", "Logic", "No Limits", "Power", "Self-Improvement"]', '["It is my duty to protect my students", "I have an ancient text that holds terrible secrets", "I work to preserve a library from destruction", "My life''s work is a series of tomes related to a specific field"]', '["I am easily distracted by the promise of information", "Most people scream and run when they see a demon", "I overlook obvious solutions in favor of complicated ones", "I speak without really thinking through my words"]', 'PHB');

-- Add more backgrounds as needed...