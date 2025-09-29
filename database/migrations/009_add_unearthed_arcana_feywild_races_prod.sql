-- Add Unearthed Arcana Folk of the Feywild Races (Production version)
-- These are playtest races from UA 2021: Folk of the Feywild
-- Source: https://media.wizards.com/2021/dnd/downloads/UA2021_FeyFolk.pdf

INSERT OR REPLACE INTO races (id, name, ability_score_bonuses, traits, proficiencies, languages, size, speed, source, is_unearthed_arcana) VALUES

-- Fairy
('fairy', 'Fairy', '{"choice": "+2 to one ability, +1 to another"}', '["Fairy Magic: Know Druidcraft cantrip, cast Faerie Fire at 3rd level, Enlarge/Reduce at 5th level (1/long rest each)", "Flight: Flying speed equal to walking speed, cannot fly if wearing medium or heavy armor", "Small Size: Can move through space of Medium or larger creature", "Darkvision: 60 feet"]', '[]', '["Common", "choice of one other language"]', 'Small', 30, 'UA2021', TRUE),

-- Hobgoblin (Feywild)
('hobgoblin-feywild', 'Hobgoblin (Feywild)', '{"constitution": 2, "intelligence": 1}', '["Fey Gift: As bonus action, give magic gift to willing creature within 5 feet (Help action, temp HP, or teleport), usable proficiency bonus times per long rest", "Fortune from the Many: When you miss attack or fail ability check or save, draw luck from allies within 30 feet to reroll", "Darkvision: 60 feet"]', '[]', '["Common", "Goblin"]', 'Medium', 30, 'UA2021', TRUE),

-- Owlfolk
('owlfolk', 'Owlfolk', '{"choice": "+2 to one ability, +1 to another"}', '["Flight: Flying speed equal to walking speed, cannot fly if wearing medium or heavy armor", "Silent Feathers: Proficiency in Stealth skill", "Keen Hearing and Sight: Advantage on Perception checks that rely on hearing or sight", "Darkvision: 120 feet"]', '["Stealth"]', '["Common", "choice of one other language"]', 'Medium', 30, 'UA2021', TRUE),

-- Rabbitfolk
('rabbitfolk', 'Rabbitfolk', '{"choice": "+2 to one ability, +1 to another"}', '["Hare-Trigger: Add proficiency bonus to initiative rolls", "Leporine Senses: Proficiency in Perception skill", "Lucky Footwork: When you fail Dexterity save, use reaction to roll 1d4 and add to save (proficiency bonus times per long rest)", "Rabbit Hop: Bonus action to jump distance equal to 5 times proficiency bonus without provoking opportunity attacks", "Darkvision: 60 feet"]', '["Perception"]', '["Common", "choice of one other language"]', 'Medium', 30, 'UA2021', TRUE);