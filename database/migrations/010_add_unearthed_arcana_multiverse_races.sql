-- Add Unearthed Arcana Travelers of the Multiverse Races
-- These are playtest races from UA 2021: Travelers of the Multiverse
-- Source: https://media.wizards.com/2021/dnd/downloads/UA2021_TravelersoftheMultiverse.pdf

INSERT OR REPLACE INTO races (id, name, ability_score_increase, traits, proficiencies, languages, size, speed, source, is_unearthed_arcana) VALUES

-- Astral Elf
('astral-elf', 'Astral Elf', '{"choice": "+2 to one ability, +1 to another"}', '["Astral Fire: Know one cantrip from cleric, druid, or wizard spell list, cast 1st level spell from same list at 3rd level (1/long rest)", "Fey Ancestry: Advantage on saves against being charmed, magic cannot put you to sleep", "Keen Senses: Proficiency in Perception skill", "Starlight Step: Teleport 30 feet as bonus action (proficiency bonus times per long rest)", "Astral Trance: 4 hours of trance instead of 8 hours sleep", "Darkvision: 60 feet"]', '["Perception"]', '["Common", "Elvish"]', 'Medium', 30, 'UA2021', TRUE),

-- Autognome
('autognome', 'Autognome', '{"choice": "+2 to one ability, +1 to another"}', '["Armored Casing: AC 13 + Dex modifier when not wearing armor", "Built for Success: Add 1d4 to one attack roll, ability check, or save (proficiency bonus times per long rest)", "Healing Machine: Mending cantrip can target you and restore HP", "Mechanical Nature: Resistance to poison damage, immunity to disease, no need to eat/drink/breathe/sleep", "Sentry''s Rest: 6 hours of inactivity instead of 8 hours sleep", "Specialized Design: Choose one tool proficiency and one skill proficiency"]', '[]', '["Common", "choice of one other language"]', 'Small', 30, 'UA2021', TRUE),

-- Giff
('giff', 'Giff', '{"choice": "+2 to one ability, +1 to another"}', '["Astral Spark: Know Minor Illusion or Thaumaturgy cantrip", "Firearms Mastery: Proficiency with all firearms, ignore loading property", "Hippo Build: Count as one size larger for carrying capacity and push/drag/lift", "Damage Dealer: When you roll damage for attack with weapon, reroll any 1s (proficiency bonus times per long rest)"]', '[]', '["Common", "choice of one other language"]', 'Medium', 30, 'UA2021', TRUE),

-- Hadozee
('hadozee', 'Hadozee', '{"choice": "+2 to one ability, +1 to another"}', '["Dexterous Feet: Can use feet to manipulate objects, draw/sheathe weapons", "Glide: When falling at least 10 feet, can glide 5 feet horizontally for every 1 foot fallen", "Hadozee Dodge: When taking damage, reduce by 1d6 (proficiency bonus times per long rest)"]', '[]', '["Common", "choice of one other language"]', 'Medium', 30, 'UA2021', TRUE),

-- Plasmoid
('plasmoid', 'Plasmoid', '{"choice": "+2 to one ability, +1 to another"}', '["Amorphous: Can squeeze through 1-inch wide space if not wearing/carrying anything", "Darkvision: 60 feet", "Hold Breath: Can hold breath for 1 hour", "Natural Resilience: Resistance to acid and poison damage", "Shape Self: As action, reshape body (alter height/weight, change appearance, form pseudopods)"]', '[]', '["Common", "choice of one other language"]', 'Medium', 30, 'UA2021', TRUE),

-- Thri-kreen
('thri-kreen', 'Thri-kreen', '{"choice": "+2 to one ability, +1 to another"}', '["Chameleon Carapace: As action, change colors for advantage on Stealth checks", "Darkvision: 60 feet", "Secondary Arms: Two secondary arms that can manipulate objects but not attack or use magic items", "Sleepless: No need to sleep, take 4 hours of inactivity to gain benefits of long rest", "Thri-kreen Telepathy: Communicate telepathically with creatures within 120 feet"]', '[]', '["Common", "choice of one other language"]', 'Medium', 30, 'UA2021', TRUE);