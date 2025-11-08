-- Add backgrounds from The Book of Many Things (2023)
-- These are official D&D 5e backgrounds that offer feat selection

INSERT OR REPLACE INTO backgrounds (
  id,
  name,
  skill_proficiencies,
  language_proficiencies,
  tool_proficiencies,
  equipment,
  feature_name,
  feature_description,
  personality_traits,
  ideals,
  bonds,
  flaws,
  source
) VALUES

-- Ruined
('ruined', 'Ruined', '["Stealth", "Survival"]', '["One of your choice"]', '["One type of gaming set"]', '{"items": ["cracked hourglass", "rusty manacles", "half-empty bottle", "hunting trap", "gaming set of your choice", "traveler''s clothes", "pouch"], "money": "13 gp"}', 'Still Standing', 'You gain one feat of your choice: Alert, Skilled, or Tough. This represents how you have survived your downfall - whether through vigilance, adaptability, or sheer resilience.', '["I have a tell that reveals when I''m thinking about my past", "I keep a memento from my former life that I refuse to part with", "I''m haunted by the faces of those I lost", "I''m always looking over my shoulder, expecting my past to catch up", "I''ve become cynical about others'' fortunes, knowing how quickly things can change", "I''m desperate to regain what I once had, no matter the cost"]', '["Redemption: I will reclaim what was taken from me", "Survival: The only thing that matters is staying alive", "Humility: My fall taught me the value of what I took for granted", "Revenge: Someone is responsible for my ruin, and they will pay", "Acceptance: The past is gone; I must forge a new path", "Independence: I''ll never again rely on anyone but myself"]', '["I lost someone dear to me, and I''ll do anything to find them again", "A rival or enemy engineered my downfall, and I seek justice", "I carry a trinket from my former life as a reminder of what I''ve lost", "There''s someone from my past who I owe a great debt", "I had to leave behind people who depended on me", "The only thing I have left is my word, and I''ll keep it no matter what"]', '["I find it hard to trust anyone, even those trying to help me", "I''m reckless with money, having lost everything once already", "I can''t let go of my former status and act as if I still have it", "I''m bitter about my misfortune and resent those who still have what I lost", "I''ll do anything to avoid returning to poverty or obscurity", "I drink or gamble to forget my past"]', 'BoMT');
