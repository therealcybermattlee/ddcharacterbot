-- Seed spell data with representative D&D 5e spells
-- Source: D&D 5e System Reference Document (SRD)

-- Cantrips (Level 0)
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, classes, source, is_homebrew)
VALUES
('fire_bolt', 'Fire Bolt', 0, 'Evocation', '1 action', '120 feet', 'V, S', 'Instantaneous',
'You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn''t being worn or carried. This spell''s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).',
'["sorcerer", "wizard"]', 'PHB', FALSE),

('mage_hand', 'Mage Hand', 0, 'Conjuration', '1 action', '30 feet', 'V, S', '1 minute',
'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial.',
'["bard", "sorcerer", "warlock", "wizard"]', 'PHB', FALSE),

('sacred_flame', 'Sacred Flame', 0, 'Evocation', '1 action', '60 feet', 'V, S', 'Instantaneous',
'Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw. The spell''s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).',
'["cleric"]', 'PHB', FALSE);

-- 1st Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, at_higher_levels, classes, source, is_homebrew)
VALUES
('magic_missile', 'Magic Missile', 1, 'Evocation', '1 action', '120 feet', 'V, S', 'Instantaneous',
'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.',
'When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.',
'["sorcerer", "wizard"]', 'PHB', FALSE),

('cure_wounds', 'Cure Wounds', 1, 'Evocation', '1 action', 'Touch', 'V, S', 'Instantaneous',
'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.',
'When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.',
'["bard", "cleric", "druid", "paladin", "ranger"]', 'PHB', FALSE),

('shield', 'Shield', 1, 'Abjuration', '1 reaction', 'Self', 'V, S', '1 round',
'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.',
NULL,
'["sorcerer", "wizard"]', 'PHB', FALSE);

-- 2nd Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, at_higher_levels, classes, source, is_homebrew)
VALUES
('invisibility', 'Invisibility', 2, 'Illusion', '1 action', 'Touch', 'V, S, M', 'Concentration, up to 1 hour',
'A creature you touch becomes invisible until the spell ends. Anything the target is wearing or carrying is invisible as long as it is on the target''s person. The spell ends for a target that attacks or casts a spell.',
'When you cast this spell using a spell slot of 3rd level or higher, you can target one additional creature for each slot level above 2nd.',
'["bard", "sorcerer", "warlock", "wizard"]', 'PHB', FALSE),

('hold_person', 'Hold Person', 2, 'Enchantment', '1 action', '60 feet', 'V, S, M', 'Concentration, up to 1 minute',
'Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.',
'When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd.',
'["bard", "cleric", "druid", "sorcerer", "warlock", "wizard"]', 'PHB', FALSE);

-- 3rd Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, at_higher_levels, classes, source, is_homebrew)
VALUES
('fireball', 'Fireball', 3, 'Evocation', '1 action', '150 feet', 'V, S, M', 'Instantaneous',
'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.',
'When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.',
'["sorcerer", "wizard"]', 'PHB', FALSE),

('counterspell', 'Counterspell', 3, 'Abjuration', '1 reaction', '60 feet', 'S', 'Instantaneous',
'You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell''s level. On a success, the creature''s spell fails and has no effect.',
'When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.',
'["sorcerer", "warlock", "wizard"]', 'PHB', FALSE);

-- 4th Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, at_higher_levels, classes, source, is_homebrew)
VALUES
('polymorph', 'Polymorph', 4, 'Transmutation', '1 action', '60 feet', 'V, S, M', 'Concentration, up to 1 hour',
'This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The transformation lasts for the duration, or until the target drops to 0 hit points or dies. The new form can be any beast whose challenge rating is equal to or less than the target''s.',
NULL,
'["bard", "druid", "sorcerer", "wizard"]', 'PHB', FALSE);

-- 5th Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, at_higher_levels, classes, source, is_homebrew)
VALUES
('cone_of_cold', 'Cone of Cold', 5, 'Evocation', '1 action', 'Self (60-foot cone)', 'V, S, M', 'Instantaneous',
'A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.',
'When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.',
'["sorcerer", "wizard"]', 'PHB', FALSE);

-- 6th Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, classes, source, is_homebrew)
VALUES
('chain_lightning', 'Chain Lightning', 6, 'Evocation', '1 action', '150 feet', 'V, S, M', 'Instantaneous',
'You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets, each of which must be within 30 feet of the first target. A target can be a creature or an object and can be targeted by only one of the bolts. A target must make a Dexterity saving throw. The target takes 10d8 lightning damage on a failed save, or half as much damage on a successful one.',
'["sorcerer", "wizard"]', 'PHB', FALSE);

-- 7th Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, classes, source, is_homebrew)
VALUES
('teleport', 'Teleport', 7, 'Conjuration', '1 action', '10 feet', 'V', 'Instantaneous',
'This spell instantly transports you and up to eight willing creatures of your choice that you can see within range, or a single object that you can see within range, to a destination you select. If you target an object, it must be able to fit entirely inside a 10-foot cube, and it can''t be held or carried by an unwilling creature.',
'["bard", "sorcerer", "wizard"]', 'PHB', FALSE);

-- 8th Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, classes, source, is_homebrew)
VALUES
('power_word_stun', 'Power Word Stun', 8, 'Enchantment', '1 action', '60 feet', 'V', 'Instantaneous',
'You speak a word of power that can overwhelm the mind of one creature you can see within range, leaving it dumbfounded. If the target has 150 hit points or fewer, it is stunned. Otherwise, the spell has no effect. The stunned target must make a Constitution saving throw at the end of each of its turns. On a successful save, this stunning effect ends.',
'["bard", "sorcerer", "warlock", "wizard"]', 'PHB', FALSE);

-- 9th Level Spells
INSERT INTO spells (id, name, level, school, casting_time, range, components, duration, description, classes, source, is_homebrew)
VALUES
('wish', 'Wish', 9, 'Conjuration', '1 action', 'Self', 'V', 'Instantaneous',
'Wish is the mightiest spell a mortal creature can cast. By simply speaking aloud, you can alter the very foundations of reality in accord with your desires. The basic use of this spell is to duplicate any other spell of 8th level or lower. You don''t need to meet any requirements in that spell, including costly components. The spell simply takes effect.',
'["sorcerer", "wizard"]', 'PHB', FALSE);
