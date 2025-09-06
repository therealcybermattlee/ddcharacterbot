-- D&D 5e Reference Data Population
-- Migration 0002: Populate races, classes, and backgrounds with D&D 5e SRD data

-- Clear existing data (if any)
DELETE FROM races;
DELETE FROM classes;
DELETE FROM backgrounds;

-- Insert D&D 5e Races
-- Human (Variant)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('human-variant', 'Human (Variant)', 'Medium', 30, 
'{"constitution": 1, "intelligence": 1}', 
'[{"name": "Versatile", "description": "Humans gain proficiency in one skill of their choice and one additional language.", "type": "feature"}, {"name": "Feat", "description": "Humans gain a bonus feat at 1st level.", "type": "feature"}]',
'["Common"]',
'{"skills": ["Insight"]}',
'phb', false);

-- Elf (High)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('elf-high', 'High Elf', 'Medium', 30,
'{"dexterity": 2, "intelligence": 1}',
'[{"name": "Darkvision", "description": "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Keen Senses", "description": "You have proficiency in the Perception skill.", "type": "feature"}, {"name": "Fey Ancestry", "description": "You have advantage on saving throws against being charmed, and magic cannot put you to sleep.", "type": "resistance"}, {"name": "Trance", "description": "Elves don''t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.", "type": "feature"}, {"name": "Cantrip", "description": "You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.", "type": "cantrip"}]',
'["Common", "Elvish"]',
'{"skills": ["Perception"], "weapons": ["longswords", "shortbows", "longbows", "shortswords"]}',
'phb', false);

-- Elf (Wood)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('elf-wood', 'Wood Elf', 'Medium', 35,
'{"dexterity": 2, "wisdom": 1}',
'[{"name": "Darkvision", "description": "Accustomed to twilit forests and the night sky, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Keen Senses", "description": "You have proficiency in the Perception skill.", "type": "feature"}, {"name": "Fey Ancestry", "description": "You have advantage on saving throws against being charmed, and magic cannot put you to sleep.", "type": "resistance"}, {"name": "Trance", "description": "Elves don''t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day.", "type": "feature"}, {"name": "Mask of the Wild", "description": "You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.", "type": "feature"}]',
'["Common", "Elvish"]',
'{"skills": ["Perception"], "weapons": ["longswords", "shortbows", "longbows", "shortswords"]}',
'phb', false);

-- Dwarf (Mountain)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('dwarf-mountain', 'Mountain Dwarf', 'Medium', 25,
'{"constitution": 2, "strength": 2}',
'[{"name": "Darkvision", "description": "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Dwarven Resilience", "description": "You have advantage on saving throws against poison, and you have resistance against poison damage.", "type": "resistance"}, {"name": "Dwarven Combat Training", "description": "You have proficiency with battleaxes, handaxes, light hammers, and warhammers.", "type": "feature"}, {"name": "Stonecunning", "description": "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.", "type": "feature"}]',
'["Common", "Dwarvish"]',
'{"weapons": ["battleaxes", "handaxes", "light hammers", "warhammers"], "armor": ["light armor", "medium armor"]}',
'phb', false);

-- Dwarf (Hill)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('dwarf-hill', 'Hill Dwarf', 'Medium', 25,
'{"constitution": 2, "wisdom": 1}',
'[{"name": "Darkvision", "description": "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Dwarven Resilience", "description": "You have advantage on saving throws against poison, and you have resistance against poison damage.", "type": "resistance"}, {"name": "Dwarven Combat Training", "description": "You have proficiency with battleaxes, handaxes, light hammers, and warhammers.", "type": "feature"}, {"name": "Stonecunning", "description": "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check.", "type": "feature"}, {"name": "Dwarven Toughness", "description": "Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.", "type": "feature"}]',
'["Common", "Dwarvish"]',
'{"weapons": ["battleaxes", "handaxes", "light hammers", "warhammers"]}',
'phb', false);

-- Halfling (Lightfoot)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('halfling-lightfoot', 'Lightfoot Halfling', 'Small', 25,
'{"dexterity": 2, "charisma": 1}',
'[{"name": "Lucky", "description": "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.", "type": "feature"}, {"name": "Brave", "description": "You have advantage on saving throws against being frightened.", "type": "resistance"}, {"name": "Halfling Nimbleness", "description": "You can move through the space of any creature that is of a size larger than yours.", "type": "feature"}, {"name": "Naturally Stealthy", "description": "You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.", "type": "feature"}]',
'["Common", "Halfling"]',
'{}',
'phb', false);

-- Halfling (Stout)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('halfling-stout', 'Stout Halfling', 'Small', 25,
'{"dexterity": 2, "constitution": 1}',
'[{"name": "Lucky", "description": "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.", "type": "feature"}, {"name": "Brave", "description": "You have advantage on saving throws against being frightened.", "type": "resistance"}, {"name": "Halfling Nimbleness", "description": "You can move through the space of any creature that is of a size larger than yours.", "type": "feature"}, {"name": "Stout Resilience", "description": "You have advantage on saving throws against poison, and you have resistance against poison damage.", "type": "resistance"}]',
'["Common", "Halfling"]',
'{}',
'phb', false);

-- Dragonborn
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('dragonborn', 'Dragonborn', 'Medium', 30,
'{"strength": 2, "charisma": 1}',
'[{"name": "Draconic Ancestry", "description": "You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type.", "type": "feature"}, {"name": "Breath Weapon", "description": "You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.", "type": "feature"}, {"name": "Damage Resistance", "description": "You have resistance to the damage type associated with your draconic ancestry.", "type": "resistance"}]',
'["Common", "Draconic"]',
'{}',
'phb', false);

-- Gnome (Forest)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('gnome-forest', 'Forest Gnome', 'Small', 25,
'{"intelligence": 2, "dexterity": 1}',
'[{"name": "Darkvision", "description": "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Gnome Cunning", "description": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.", "type": "resistance"}, {"name": "Natural Illusionist", "description": "You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.", "type": "cantrip"}, {"name": "Speak with Small Beasts", "description": "Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.", "type": "feature"}]',
'["Common", "Gnomish"]',
'{}',
'phb', false);

-- Gnome (Rock)
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('gnome-rock', 'Rock Gnome', 'Small', 25,
'{"intelligence": 2, "constitution": 1}',
'[{"name": "Darkvision", "description": "Accustomed to life underground, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Gnome Cunning", "description": "You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.", "type": "resistance"}, {"name": "Artificer''s Lore", "description": "Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus.", "type": "feature"}, {"name": "Tinker", "description": "You have proficiency with artisan''s tools (tinker''s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device.", "type": "feature"}]',
'["Common", "Gnomish"]',
'{"tools": ["tinker''s tools"]}',
'phb', false);

-- Half-Elf
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('half-elf', 'Half-Elf', 'Medium', 30,
'{"charisma": 2}',
'[{"name": "Darkvision", "description": "Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Fey Ancestry", "description": "You have advantage on saving throws against being charmed, and magic cannot put you to sleep.", "type": "resistance"}, {"name": "Skill Versatility", "description": "You gain proficiency in two skills of your choice.", "type": "feature"}]',
'["Common", "Elvish"]',
'{}',
'phb', false);

-- Half-Orc
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('half-orc', 'Half-Orc', 'Medium', 30,
'{"strength": 2, "constitution": 1}',
'[{"name": "Darkvision", "description": "Thanks to your orc blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Menacing", "description": "You gain proficiency in the Intimidation skill.", "type": "feature"}, {"name": "Relentless Endurance", "description": "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can''t use this feature again until you finish a long rest.", "type": "feature"}, {"name": "Savage Attacks", "description": "When you score a critical hit with a melee weapon attack, you can roll one of the weapon''s damage dice one additional time and add it to the extra damage of the critical hit.", "type": "feature"}]',
'["Common", "Orc"]',
'{"skills": ["Intimidation"]}',
'phb', false);

-- Tiefling
INSERT INTO races (id, name, size, speed, ability_score_bonuses, traits, languages, proficiencies, source, is_homebrew) VALUES 
('tiefling', 'Tiefling', 'Medium', 30,
'{"intelligence": 1, "charisma": 2}',
'[{"name": "Darkvision", "description": "Thanks to your infernal heritage, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light.", "type": "sense"}, {"name": "Hellish Resistance", "description": "You have resistance to fire damage.", "type": "resistance"}, {"name": "Infernal Legacy", "description": "You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait and regain the ability to do so when you finish a long rest. When you reach 5th level, you can cast the darkness spell once with this trait and regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for these spells.", "type": "spell"}]',
'["Common", "Infernal"]',
'{}',
'phb', false);

-- Insert D&D 5e Classes
-- Fighter
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('fighter', 'Fighter', 'd10', 
'["Strength", "Dexterity"]',
'["Strength", "Constitution"]',
'["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"]',
2,
'["All armor", "shields"]',
'["Simple weapons", "martial weapons"]',
'[]',
'{"armor": ["chain mail"], "weapons": ["martial weapon", "shield"], "packs": ["dungeoneer''s pack"], "other": ["light crossbow", "20 bolts"]}',
null,
'phb', false);

-- Wizard
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('wizard', 'Wizard', 'd6',
'["Intelligence"]',
'["Intelligence", "Wisdom"]',
'["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"]',
2,
'[]',
'["Daggers", "darts", "slings", "quarterstaffs", "light crossbows"]',
'[]',
'{"weapons": ["quarterstaff", "dagger"], "other": ["component pouch", "spellbook"], "packs": ["scholar''s pack"]}',
'Intelligence',
'phb', false);

-- Rogue
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('rogue', 'Rogue', 'd8',
'["Dexterity"]',
'["Dexterity", "Intelligence"]',
'["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"]',
4,
'["Light armor"]',
'["Simple weapons", "hand crossbows", "longswords", "rapiers", "shortswords"]',
'["Thieves'' tools"]',
'{"armor": ["leather armor"], "weapons": ["shortsword", "shortsword", "shortbow", "20 arrows"], "tools": ["thieves'' tools"], "packs": ["burglar''s pack"]}',
null,
'phb', false);

-- Cleric
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('cleric', 'Cleric', 'd8',
'["Wisdom"]',
'["Wisdom", "Charisma"]',
'["History", "Insight", "Medicine", "Persuasion", "Religion"]',
2,
'["Light armor", "medium armor", "shields"]',
'["Simple weapons"]',
'[]',
'{"armor": ["scale mail", "shield"], "weapons": ["mace", "light crossbow", "20 bolts"], "other": ["holy symbol"], "packs": ["priest''s pack"]}',
'Wisdom',
'phb', false);

-- Ranger
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('ranger', 'Ranger', 'd10',
'["Dexterity", "Wisdom"]',
'["Strength", "Dexterity"]',
'["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"]',
3,
'["Light armor", "medium armor", "shields"]',
'["Simple weapons", "martial weapons"]',
'[]',
'{"armor": ["scale mail"], "weapons": ["shortsword", "shortsword", "longbow", "20 arrows"], "packs": ["dungeoneer''s pack"]}',
'Wisdom',
'phb', false);

-- Barbarian
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('barbarian', 'Barbarian', 'd12',
'["Strength"]',
'["Strength", "Constitution"]',
'["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"]',
2,
'["Light armor", "medium armor", "shields"]',
'["Simple weapons", "martial weapons"]',
'[]',
'{"weapons": ["greataxe", "handaxe", "handaxe"], "other": ["4 javelins"], "packs": ["explorer''s pack"]}',
null,
'phb', false);

-- Bard
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('bard', 'Bard', 'd8',
'["Charisma"]',
'["Dexterity", "Charisma"]',
'["Deception", "History", "Investigation", "Persuasion", "Sleight of Hand"]',
3,
'["Light armor"]',
'["Simple weapons", "hand crossbows", "longswords", "rapiers", "shortswords"]',
'["Three musical instruments of your choice"]',
'{"armor": ["leather armor"], "weapons": ["rapier", "longsword", "dagger", "dagger"], "tools": ["lute"], "packs": ["entertainer''s pack"]}',
'Charisma',
'phb', false);

-- Druid
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('druid', 'Druid', 'd8',
'["Wisdom"]',
'["Intelligence", "Wisdom"]',
'["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"]',
2,
'["Light armor", "medium armor", "shields (non-metal)"]',
'["Clubs", "daggers", "darts", "javelins", "maces", "quarterstaffs", "scimitars", "sickles", "slings", "spears"]',
'["Herbalism kit"]',
'{"armor": ["leather armor"], "weapons": ["scimitar", "shield"], "other": ["druidcraft"], "packs": ["explorer''s pack"]}',
'Wisdom',
'phb', false);

-- Monk
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('monk', 'Monk', 'd8',
'["Dexterity", "Wisdom"]',
'["Strength", "Dexterity"]',
'["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"]',
2,
'[]',
'["Simple weapons", "shortswords"]',
'["One type of artisan''s tools or one musical instrument"]',
'{"weapons": ["shortsword", "10 darts"], "packs": ["dungeoneer''s pack"]}',
null,
'phb', false);

-- Paladin
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('paladin', 'Paladin', 'd10',
'["Strength", "Charisma"]',
'["Wisdom", "Charisma"]',
'["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"]',
2,
'["All armor", "shields"]',
'["Simple weapons", "martial weapons"]',
'[]',
'{"armor": ["chain mail"], "weapons": ["martial weapon", "shield"], "other": ["holy symbol", "5 javelins"], "packs": ["explorer''s pack"]}',
'Charisma',
'phb', false);

-- Sorcerer
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('sorcerer', 'Sorcerer', 'd6',
'["Charisma"]',
'["Constitution", "Charisma"]',
'["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"]',
2,
'[]',
'["Daggers", "darts", "slings", "quarterstaffs", "light crossbows"]',
'[]',
'{"weapons": ["light crossbow", "20 bolts", "dagger", "dagger"], "other": ["component pouch"], "packs": ["dungeoneer''s pack"]}',
'Charisma',
'phb', false);

-- Warlock
INSERT INTO classes (id, name, hit_die, primary_ability, saving_throw_proficiencies, skill_proficiencies, skill_choices, armor_proficiencies, weapon_proficiencies, tool_proficiencies, starting_equipment, spellcasting_ability, source, is_homebrew) VALUES 
('warlock', 'Warlock', 'd8',
'["Charisma"]',
'["Wisdom", "Charisma"]',
'["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"]',
2,
'["Light armor"]',
'["Simple weapons"]',
'[]',
'{"armor": ["leather armor"], "weapons": ["light crossbow", "20 bolts", "simple weapon", "dagger", "dagger"], "other": ["component pouch"], "packs": ["scholar''s pack"]}',
'Charisma',
'phb', false);

-- Insert D&D 5e Backgrounds
-- Acolyte
INSERT INTO backgrounds (id, name, description, skill_proficiencies, language_choices, tool_proficiencies, starting_equipment, feature_name, feature_description, suggested_characteristics, source, is_homebrew) VALUES 
('acolyte', 'Acolyte', 'You have spent your life in the service of a temple to a specific god or pantheon of gods.',
'["Insight", "Religion"]', 2, '[]',
'{"items": ["holy symbol", "prayer book", "5 sticks of incense", "vestments", "set of common clothes", "belt pouch"], "gp": 15}',
'Shelter of the Faithful',
'As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity.',
'{"personalityTraits": ["I idolize a particular hero of my faith.", "I can find common ground between the fiercest enemies."], "ideals": ["Tradition. The ancient traditions must be preserved.", "Charity. I always try to help those in need."], "bonds": ["I would die to recover an ancient relic of my faith.", "I will someday get revenge on the corrupt temple hierarchy."], "flaws": ["I judge others harshly, and myself even more severely.", "I put too much trust in those who wield power within my temple."]}',
'phb', false);

-- Criminal
INSERT INTO backgrounds (id, name, description, skill_proficiencies, language_choices, tool_proficiencies, starting_equipment, feature_name, feature_description, suggested_characteristics, source, is_homebrew) VALUES 
('criminal', 'Criminal', 'You are an experienced criminal with a history of breaking the law.',
'["Deception", "Stealth"]', 0, '["Thieves'' tools", "Gaming set"]',
'{"items": ["crowbar", "set of dark common clothes including a hood", "belt pouch"], "gp": 15}',
'Criminal Contact',
'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals.',
'{"personalityTraits": ["I always have a plan for what to do when things go wrong.", "I am always calm, no matter what the situation."], "ideals": ["Honor. I don''t steal from others in the trade.", "Freedom. Chains are meant to be broken."], "bonds": ["I''m trying to pay off an old debt I owe to a generous benefactor.", "My ill-gotten gains go to support my family."], "flaws": ["When I see something valuable, I can''t think about anything but how to steal it.", "When faced with a choice between money and my friends, I usually choose the money."]}',
'phb', false);

-- Folk Hero
INSERT INTO backgrounds (id, name, description, skill_proficiencies, language_choices, tool_proficiencies, starting_equipment, feature_name, feature_description, suggested_characteristics, source, is_homebrew) VALUES 
('folk-hero', 'Folk Hero', 'You come from a humble social rank, but you are destined for so much more.',
'["Animal Handling", "Survival"]', 0, '["Artisan''s tools", "Vehicles (land)"]',
'{"items": ["artisan''s tools", "shovel", "set of artisan''s tools", "set of common clothes", "belt pouch"], "gp": 10}',
'Rustic Hospitality',
'Since you come from the ranks of the common folk, you fit in among them with ease.',
'{"personalityTraits": ["I judge people by their actions, not their words.", "If someone is in trouble, I''m always ready to lend help."], "ideals": ["Respect. People deserve to be treated with dignity and respect.", "Fairness. No one should get preferential treatment before the law."], "bonds": ["I have a family, but I have no idea where they are.", "I worked the land, I love the land, and I will protect the land."], "flaws": ["The tyrant who rules my land will stop at nothing to see me killed.", "I''m convinced of the significance of my destiny, and blind to my shortcomings."]}',
'phb', false);

-- Noble
INSERT INTO backgrounds (id, name, description, skill_proficiencies, language_choices, tool_proficiencies, starting_equipment, feature_name, feature_description, suggested_characteristics, source, is_homebrew) VALUES 
('noble', 'Noble', 'You understand wealth, power, and privilege.',
'["History", "Persuasion"]', 1, '["Gaming set"]',
'{"items": ["set of fine clothes", "signet ring", "scroll of pedigree", "purse"], "gp": 25}',
'Position of Privilege',
'Thanks to your noble birth, people are inclined to think the best of you.',
'{"personalityTraits": ["My eloquent flattery makes everyone I talk to feel like the most wonderful and important person in the world.", "Despite my noble birth, I do not place myself above other folk."], "ideals": ["Respect. Respect is due to me because of my position, but all people regardless of station deserve to be treated with dignity.", "Noble Obligation. It is my duty to protect and care for the people beneath me."], "bonds": ["I will face any challenge to win the approval of my family.", "My house''s alliance with another noble family must be sustained at all costs."], "flaws": ["I secretly believe that everyone is beneath me.", "I hide a truly scandalous secret that could ruin my family forever."]}',
'phb', false);

-- Sage
INSERT INTO backgrounds (id, name, description, skill_proficiencies, language_choices, tool_proficiencies, starting_equipment, feature_name, feature_description, suggested_characteristics, source, is_homebrew) VALUES 
('sage', 'Sage', 'You spent years learning the lore of the multiverse.',
'["Arcana", "History"]', 2, '[]',
'{"items": ["bottle of black ink", "quill", "small knife", "letter from dead colleague", "set of common clothes", "belt pouch"], "gp": 10}',
'Researcher',
'When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it.',
'{"personalityTraits": ["I use polysyllabic words that convey the impression of great erudition.", "I''ve read every book in the world''s greatest libraries— or I like to boast that I have."], "ideals": ["Knowledge. The path to power and self-improvement is through knowledge.", "Beauty. What is beautiful points us beyond itself toward what is true."], "bonds": ["It is my duty to protect my students.", "I have an ancient text that holds terrible secrets that must not fall into the wrong hands."], "flaws": ["I am easily distracted by the promise of information.", "Most people scream and run when they see a demon. I stop and take notes on its anatomy."]}',
'phb', false);

-- Soldier
INSERT INTO backgrounds (id, name, description, skill_proficiencies, language_choices, tool_proficiencies, starting_equipment, feature_name, feature_description, suggested_characteristics, source, is_homebrew) VALUES 
('soldier', 'Soldier', 'War has been your life for as long as you care to remember.',
'["Athletics", "Intimidation"]', 0, '["Gaming set", "Vehicles (land)"]',
'{"items": ["insignia of rank", "trophy taken from fallen enemy", "deck of cards", "set of common clothes", "belt pouch"], "gp": 10}',
'Military Rank',
'You have a military rank from your career as a soldier.',
'{"personalityTraits": ["I''m always polite and respectful.", "I''m haunted by memories of war. I can''t get the images of violence out of my mind."], "ideals": ["Greater Good. Our lot is to lay down our lives in defense of others.", "Responsibility. I do what I must and obey just authority."], "bonds": ["I would still lay down my life for the people I served with.", "Someone saved my life on the battlefield. To this day, I will never leave a friend behind."], "flaws": ["The monstrous enemy we faced in battle still leaves me quivering with fear.", "I have little respect for anyone who is not a proven warrior."]}',
'phb', false);