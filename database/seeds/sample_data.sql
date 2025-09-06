-- Sample data for D&D Character Manager
-- This file provides example data for development and testing

-- Sample users
INSERT OR IGNORE INTO users (id, email, username, password_hash, display_name, is_active, email_verified) VALUES
('user-1', 'alice@example.com', 'alice_dm', '$2b$10$example_hash_1', 'Alice the DM', TRUE, TRUE),
('user-2', 'bob@example.com', 'bob_warrior', '$2b$10$example_hash_2', 'Bob the Bold', TRUE, TRUE),
('user-3', 'charlie@example.com', 'charlie_wizard', '$2b$10$example_hash_3', 'Charlie the Wise', TRUE, TRUE),
('user-4', 'diana@example.com', 'diana_rogue', '$2b$10$example_hash_4', 'Diana Shadow', TRUE, TRUE);

-- Sample campaign
INSERT OR IGNORE INTO campaigns (id, name, description, dm_id, status, max_players, start_date) VALUES
('campaign-1', 'The Lost Mines of Phandelver', 'A classic D&D 5e adventure for new and experienced players alike. The heroes must rescue Gundren Rockseeker and uncover the secrets of Wave Echo Cave.', 'user-1', 'active', 4, '2024-01-15');

-- Sample characters
INSERT OR IGNORE INTO characters (
    id, name, player_id, campaign_id, race, class, background, alignment, level,
    strength, dexterity, constitution, intelligence, wisdom, charisma,
    armor_class, hit_points_max, hit_points_current, personality_traits, ideals, bonds, flaws
) VALUES
(
    'char-1', 'Thorin Ironforge', 'user-2', 'campaign-1', 'Mountain Dwarf', 'Fighter', 'Soldier', 'Lawful Good', 3,
    16, 12, 15, 10, 13, 14,
    16, 28, 28,
    'I face problems head-on. A simple, direct solution is the best path to success.',
    'I fight for those who cannot fight for themselves.',
    'I would still lay down my life for the people I served with.',
    'The monstrous enemy we faced in battle still leaves me quivering with fear.'
),
(
    'char-2', 'Luna Starweaver', 'user-3', 'campaign-1', 'High Elf', 'Wizard', 'Sage', 'Neutral Good', 3,
    8, 14, 13, 16, 12, 11,
    12, 18, 18,
    'I am horribly, horribly awkward in social situations.',
    'Knowledge is power, and the key to all other forms of power.',
    'The workshop where I learned my trade is the most important place in the world to me.',
    'I overlook obvious solutions in favor of complicated ones.'
),
(
    'char-3', 'Whisper Nightblade', 'user-4', 'campaign-1', 'Half-Elf', 'Rogue', 'Criminal', 'Chaotic Neutral', 3,
    10, 16, 14, 12, 13, 15,
    14, 24, 24,
    'I always have a plan for what to do when things go wrong.',
    'I never target people who cant afford to lose a few coins.',
    'Someone I loved died because of a mistake I made. That will never happen again.',
    'When I see something valuable, I cant think about anything but how to steal it.'
);

-- Campaign memberships
INSERT OR IGNORE INTO campaign_members (id, campaign_id, user_id, character_id, role) VALUES
('member-1', 'campaign-1', 'user-1', NULL, 'dm'),
('member-2', 'campaign-1', 'user-2', 'char-1', 'player'),
('member-3', 'campaign-1', 'user-3', 'char-2', 'player'),
('member-4', 'campaign-1', 'user-4', 'char-3', 'player');

-- Sample session
INSERT OR IGNORE INTO sessions (id, campaign_id, session_number, title, summary, session_date, duration_minutes, experience_awarded) VALUES
(
    'session-1', 'campaign-1', 1, 'The Adventure Begins',
    'Our heroes met in the town of Neverwinter and were hired by Gundren Rockseeker to escort a wagon to Phandalin. On the way, they discovered an ambush site and tracked goblins to their hideout.',
    '2024-01-15 19:00:00', 240, 300
);

-- Character snapshots after first session
INSERT OR IGNORE INTO character_snapshots (id, character_id, session_id, snapshot_data, reason) VALUES
(
    'snapshot-1', 'char-1', 'session-1',
    '{"level": 1, "experience_points": 300, "hit_points_current": 12, "equipment_changes": ["Added shortsword", "Added javelin x2"]}',
    'Session end'
),
(
    'snapshot-2', 'char-2', 'session-1',
    '{"level": 1, "experience_points": 300, "hit_points_current": 8, "spells_used": ["Magic Missile"], "spell_slots_used": {"1": 1}}',
    'Session end'
),
(
    'snapshot-3', 'char-3', 'session-1',
    '{"level": 1, "experience_points": 300, "hit_points_current": 10, "equipment_changes": ["Found 50 gp"], "skills_used": ["Stealth", "Investigation"]}',
    'Session end'
);