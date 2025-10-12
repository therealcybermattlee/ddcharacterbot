/**
 * D&D 5e Feats
 * Comprehensive feat database for character creation
 * Source: Player's Handbook (PHB), Xanathar's Guide to Everything (XGE), Tasha's Cauldron of Everything (TCE)
 */

export interface FeatPrerequisites {
  abilityScore?: { ability: string; minimum: number }
  proficiency?: string
  spellcasting?: boolean
  level?: number
  race?: string
}

export interface Feat {
  id: string
  name: string
  description: string
  benefits: string[]
  prerequisites?: FeatPrerequisites
  source: string
  category: 'combat' | 'utility' | 'spellcasting' | 'social' | 'mobility' | 'racial'
  abilityScoreIncrease?: {
    options: string[]
    amount: number
    count: number
  }
}

export const FEATS: Feat[] = [
  // Combat Feats
  {
    id: 'alert',
    name: 'Alert',
    description: 'Always on the lookout for danger, you gain the following benefits.',
    benefits: [
      'You gain a +5 bonus to initiative.',
      'You can\'t be surprised while you are conscious.',
      'Other creatures don\'t gain advantage on attack rolls against you as a result of being unseen by you.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'athlete',
    name: 'Athlete',
    description: 'You have undergone extensive physical training to gain the following benefits.',
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
      'When you are prone, standing up uses only 5 feet of your movement.',
      'Climbing doesn\'t cost you extra movement.',
      'You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'dexterity'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'mobility'
  },
  {
    id: 'charger',
    name: 'Charger',
    description: 'When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack\'s damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove and you succeed).',
    benefits: [
      'After Dashing, use a bonus action to make a melee weapon attack or shove.',
      'If you moved at least 10 feet straight, gain +5 damage or push target 10 feet.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'crossbow_expert',
    name: 'Crossbow Expert',
    description: 'Thanks to extensive practice with the crossbow, you gain the following benefits.',
    benefits: [
      'You ignore the loading quality of crossbows with which you are proficient.',
      'Being within 5 feet of a hostile creature doesn\'t impose disadvantage on your ranged attack rolls.',
      'When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'defensive_duelist',
    name: 'Defensive Duelist',
    description: 'When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you.',
    benefits: [
      'Use reaction to add proficiency bonus to AC against one melee attack.',
      'Must be wielding a finesse weapon you\'re proficient with.'
    ],
    prerequisites: {
      abilityScore: { ability: 'dexterity', minimum: 13 }
    },
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'dual_wielder',
    name: 'Dual Wielder',
    description: 'You master fighting with two weapons, gaining the following benefits.',
    benefits: [
      'You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand.',
      'You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren\'t light.',
      'You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'durable',
    name: 'Durable',
    description: 'Hardy and resilient, you gain the following benefits.',
    benefits: [
      'Increase your Constitution score by 1, to a maximum of 20.',
      'When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals twice your Constitution modifier (minimum of 2).'
    ],
    abilityScoreIncrease: {
      options: ['constitution'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'utility'
  },
  {
    id: 'elemental_adept',
    name: 'Elemental Adept',
    description: 'When you gain this feat, choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.',
    benefits: [
      'Choose one damage type: acid, cold, fire, lightning, or thunder.',
      'Your spells ignore resistance to the chosen damage type.',
      'Treat any 1 on damage dice as a 2 for spells of the chosen type.'
    ],
    prerequisites: {
      spellcasting: true
    },
    source: 'PHB',
    category: 'spellcasting'
  },
  {
    id: 'grappler',
    name: 'Grappler',
    description: 'You\'ve developed the skills necessary to hold your own in close-quarters grappling.',
    benefits: [
      'You have advantage on attack rolls against a creature you are grappling.',
      'You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.'
    ],
    prerequisites: {
      abilityScore: { ability: 'strength', minimum: 13 }
    },
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'great_weapon_master',
    name: 'Great Weapon Master',
    description: 'You\'ve learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes.',
    benefits: [
      'On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action.',
      'Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack\'s damage.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'heavily_armored',
    name: 'Heavily Armored',
    description: 'You have trained to master the use of heavy armor, gaining the following benefits.',
    benefits: [
      'Increase your Strength score by 1, to a maximum of 20.',
      'You gain proficiency with heavy armor.'
    ],
    prerequisites: {
      proficiency: 'Medium armor'
    },
    abilityScoreIncrease: {
      options: ['strength'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'heavy_armor_master',
    name: 'Heavy Armor Master',
    description: 'You can use your armor to deflect strikes that would kill others.',
    benefits: [
      'Increase your Strength score by 1, to a maximum of 20.',
      'While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from nonmagical weapons is reduced by 3.'
    ],
    prerequisites: {
      proficiency: 'Heavy armor'
    },
    abilityScoreIncrease: {
      options: ['strength'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'inspiring_leader',
    name: 'Inspiring Leader',
    description: 'You can spend 10 minutes inspiring your companions, shoring up their resolve to fight. When you do so, choose up to six friendly creatures (which can include yourself) within 30 feet of you who can see or hear you and who can understand you. Each creature can gain temporary hit points equal to your level + your Charisma modifier. A creature can\'t gain temporary hit points from this feat again until it has finished a short or long rest.',
    benefits: [
      'Spend 10 minutes to inspire up to 6 allies within 30 feet.',
      'Each creature gains temporary HP equal to your level + Charisma modifier.',
      'Can be used once per short or long rest per creature.'
    ],
    prerequisites: {
      abilityScore: { ability: 'charisma', minimum: 13 }
    },
    source: 'PHB',
    category: 'social'
  },
  {
    id: 'keen_mind',
    name: 'Keen Mind',
    description: 'You have a mind that can track time, direction, and detail with uncanny precision.',
    benefits: [
      'Increase your Intelligence score by 1, to a maximum of 20.',
      'You always know which way is north.',
      'You always know the number of hours left before the next sunrise or sunset.',
      'You can accurately recall anything you have seen or heard within the past month.'
    ],
    abilityScoreIncrease: {
      options: ['intelligence'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'utility'
  },
  {
    id: 'lightly_armored',
    name: 'Lightly Armored',
    description: 'You have trained to master the use of light armor, gaining the following benefits.',
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
      'You gain proficiency with light armor.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'dexterity'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'linguist',
    name: 'Linguist',
    description: 'You have studied languages and codes, gaining the following benefits.',
    benefits: [
      'Increase your Intelligence score by 1, to a maximum of 20.',
      'You learn three languages of your choice.',
      'You can ably create written ciphers. Others can\'t decipher a code you create unless you teach them, they succeed on an Intelligence check (DC equal to your Intelligence score + your proficiency bonus), or they use magic to decipher it.'
    ],
    abilityScoreIncrease: {
      options: ['intelligence'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'utility'
  },
  {
    id: 'lucky',
    name: 'Lucky',
    description: 'You have inexplicable luck that seems to kick in at just the right moment.',
    benefits: [
      'You have 3 luck points. Whenever you make an attack roll, ability check, or saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw.',
      'You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker\'s roll or yours.',
      'You regain your expended luck points when you finish a long rest.'
    ],
    source: 'PHB',
    category: 'utility'
  },
  {
    id: 'mage_slayer',
    name: 'Mage Slayer',
    description: 'You have practiced techniques in melee combat against spellcasters.',
    benefits: [
      'When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature.',
      'When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration.',
      'You have advantage on saving throws against spells cast by creatures within 5 feet of you.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'magic_initiate',
    name: 'Magic Initiate',
    description: 'Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class\'s spell list. In addition, choose one 1st-level spell from that same list. You learn that spell and can cast it at its lowest level. Once you cast it, you must finish a long rest before you can cast it again using this feat.',
    benefits: [
      'Choose a spellcasting class (bard, cleric, druid, sorcerer, warlock, or wizard).',
      'Learn two cantrips from that class\'s spell list.',
      'Learn one 1st-level spell from that class\'s spell list.',
      'Cast the 1st-level spell once per long rest.',
      'Your spellcasting ability for these spells depends on the class you chose: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; Intelligence for wizard.'
    ],
    source: 'PHB',
    category: 'spellcasting'
  },
  {
    id: 'martial_adept',
    name: 'Martial Adept',
    description: 'You have martial training that allows you to perform special combat maneuvers.',
    benefits: [
      'You learn two maneuvers of your choice from among those available to the Battle Master archetype in the fighter class. If a maneuver you use requires your target to make a saving throw to resist the maneuver\'s effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice).',
      'You gain one superiority die, which is a d6 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers. A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'medium_armor_master',
    name: 'Medium Armor Master',
    description: 'You have practiced moving in medium armor to gain the following benefits.',
    benefits: [
      'Wearing medium armor doesn\'t impose disadvantage on your Dexterity (Stealth) checks.',
      'When you wear medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher.'
    ],
    prerequisites: {
      proficiency: 'Medium armor'
    },
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description: 'You are exceptionally speedy and agile.',
    benefits: [
      'Your speed increases by 10 feet.',
      'When you use the Dash action, difficult terrain doesn\'t cost you extra movement on that turn.',
      'When you make a melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not.'
    ],
    source: 'PHB',
    category: 'mobility'
  },
  {
    id: 'moderately_armored',
    name: 'Moderately Armored',
    description: 'You have trained to master the use of medium armor and shields, gaining the following benefits.',
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
      'You gain proficiency with medium armor and shields.'
    ],
    prerequisites: {
      proficiency: 'Light armor'
    },
    abilityScoreIncrease: {
      options: ['strength', 'dexterity'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'mounted_combatant',
    name: 'Mounted Combatant',
    description: 'You are a dangerous foe to face while mounted.',
    benefits: [
      'You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount.',
      'You can force an attack targeted at your mount to target you instead.',
      'If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'observant',
    name: 'Observant',
    description: 'Quick to notice details of your environment, you gain the following benefits.',
    benefits: [
      'Increase your Intelligence or Wisdom score by 1, to a maximum of 20.',
      'If you can see a creature\'s mouth while it is speaking a language you understand, you can interpret what it\'s saying by reading its lips.',
      'You have a +5 bonus to your passive Wisdom (Perception) and passive Intelligence (Investigation) scores.'
    ],
    abilityScoreIncrease: {
      options: ['intelligence', 'wisdom'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'utility'
  },
  {
    id: 'polearm_master',
    name: 'Polearm Master',
    description: 'You can keep your enemies at bay with reach weapons.',
    benefits: [
      'When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack. The weapon\'s damage die for this attack is a d4, and it deals bludgeoning damage.',
      'While you are wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'resilient',
    name: 'Resilient',
    description: 'Choose one ability score. You gain the following benefits.',
    benefits: [
      'Increase the chosen ability score by 1, to a maximum of 20.',
      'You gain proficiency in saving throws using the chosen ability.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'utility'
  },
  {
    id: 'ritual_caster',
    name: 'Ritual Caster',
    description: 'You have learned a number of spells that you can cast as rituals.',
    benefits: [
      'Choose one of the following classes: bard, cleric, druid, sorcerer, warlock, or wizard. You must choose your spells from that class\'s spell list, and the spells you choose must have the ritual tag. The class you choose also determines your spellcasting ability for these spells: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; Intelligence for wizard.',
      'You acquire a ritual book holding two 1st-level spells that have the ritual tag. Choose one of the following classes: bard, cleric, druid, sorcerer, warlock, or wizard. You must choose your spells from that class\'s spell list, and the spells you choose must have the ritual tag.',
      'If you come across a spell in written form, such as a magical spell scroll or a wizard\'s spellbook, you might be able to add it to your ritual book. The spell must be on the spell list for the class you chose, the spell\'s level can be no higher than half your level (rounded up), and it must have the ritual tag. The process of copying the spell into your ritual book takes 2 hours per level of the spell, and costs 50 gp per level. The cost represents material components you expend as you experiment with the spell to master it, as well as the fine inks you need to record it.'
    ],
    prerequisites: {
      abilityScore: { ability: 'intelligence', minimum: 13 }
    },
    source: 'PHB',
    category: 'spellcasting'
  },
  {
    id: 'savage_attacker',
    name: 'Savage Attacker',
    description: 'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total.',
    benefits: [
      'Once per turn, reroll melee weapon damage dice and use either result.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'You have mastered techniques to take advantage of every drop in any enemy\'s guard.',
    benefits: [
      'When you hit a creature with an opportunity attack, the creature\'s speed becomes 0 for the rest of the turn.',
      'Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.',
      'When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn\'t have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'You have mastered ranged weapons and can make shots that others find impossible.',
    benefits: [
      'Attacking at long range doesn\'t impose disadvantage on your ranged weapon attack rolls.',
      'Your ranged weapon attacks ignore half cover and three-quarters cover.',
      'Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack\'s damage.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'shield_master',
    name: 'Shield Master',
    description: 'You use shields not just for protection but also for offense.',
    benefits: [
      'If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield.',
      'If you aren\'t incapacitated, you can add your shield\'s AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you.',
      'If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interposing your shield between yourself and the source of the effect.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'skilled',
    name: 'Skilled',
    description: 'You gain proficiency in any combination of three skills or tools of your choice.',
    benefits: [
      'Gain proficiency in any combination of three skills or tools of your choice.'
    ],
    source: 'PHB',
    category: 'utility'
  },
  {
    id: 'skulker',
    name: 'Skulker',
    description: 'You are expert at slinking through shadows.',
    benefits: [
      'You can try to hide when you are lightly obscured from the creature from which you are hiding.',
      'When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn\'t reveal your position.',
      'Dim light doesn\'t impose disadvantage on your Wisdom (Perception) checks relying on sight.'
    ],
    prerequisites: {
      abilityScore: { ability: 'dexterity', minimum: 13 }
    },
    source: 'PHB',
    category: 'utility'
  },
  {
    id: 'spell_sniper',
    name: 'Spell Sniper',
    description: 'You have learned techniques to enhance your attacks with certain kinds of spells.',
    benefits: [
      'When you cast a spell that requires you to make an attack roll, the spell\'s range is doubled.',
      'Your ranged spell attacks ignore half cover and three-quarters cover.',
      'You learn one cantrip that requires an attack roll. Choose the cantrip from the bard, cleric, druid, sorcerer, warlock, or wizard spell list. Your spellcasting ability for this cantrip depends on the spell list you chose from: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; Intelligence for wizard.'
    ],
    prerequisites: {
      spellcasting: true
    },
    source: 'PHB',
    category: 'spellcasting'
  },
  {
    id: 'tavern_brawler',
    name: 'Tavern Brawler',
    description: 'Accustomed to rough-and-tumble fighting using whatever weapons happen to be at hand, you gain the following benefits.',
    benefits: [
      'Increase your Strength or Constitution score by 1, to a maximum of 20.',
      'You are proficient with improvised weapons.',
      'Your unarmed strike uses a d4 for damage.',
      'When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'constitution'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'tough',
    name: 'Tough',
    description: 'Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.',
    benefits: [
      'Increase your hit point maximum by 2 × your level.',
      'Gain an additional 2 hit points whenever you level up.'
    ],
    source: 'PHB',
    category: 'combat'
  },
  {
    id: 'war_caster',
    name: 'War Caster',
    description: 'You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits.',
    benefits: [
      'You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage.',
      'You can perform the somatic components of spells even when you have weapons or a shield in one or both hands.',
      'When a hostile creature\'s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature.'
    ],
    prerequisites: {
      spellcasting: true
    },
    source: 'PHB',
    category: 'spellcasting'
  },
  {
    id: 'weapon_master',
    name: 'Weapon Master',
    description: 'You have practiced extensively with a variety of weapons, gaining the following benefits.',
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
      'You gain proficiency with four weapons of your choice. Each one must be a simple or a martial weapon.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'dexterity'],
      amount: 1,
      count: 1
    },
    source: 'PHB',
    category: 'combat'
  },

  // Racial Feats (Common for 2024 backgrounds)
  {
    id: 'elven_accuracy',
    name: 'Elven Accuracy',
    description: 'The accuracy of elves is legendary, especially that of elf archers and spellcasters.',
    benefits: [
      'Increase your Dexterity, Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      'Whenever you have advantage on an attack roll using Dexterity, Intelligence, Wisdom, or Charisma, you can reroll one of the dice once.'
    ],
    prerequisites: {
      race: 'Elf or Half-Elf'
    },
    abilityScoreIncrease: {
      options: ['dexterity', 'intelligence', 'wisdom', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'XGE',
    category: 'racial'
  },
  {
    id: 'fade_away',
    name: 'Fade Away',
    description: 'Your people are clever, with a knack for illusion magic.',
    benefits: [
      'Increase your Dexterity or Intelligence score by 1, to a maximum of 20.',
      'Immediately after you take damage, you can use a reaction to magically become invisible until the end of your next turn or until you attack, deal damage, or force someone to make a saving throw. Once you use this ability, you can\'t do so again until you finish a short or long rest.'
    ],
    prerequisites: {
      race: 'Gnome'
    },
    abilityScoreIncrease: {
      options: ['dexterity', 'intelligence'],
      amount: 1,
      count: 1
    },
    source: 'XGE',
    category: 'racial'
  },
  {
    id: 'dwarven_fortitude',
    name: 'Dwarven Fortitude',
    description: 'You have the blood of dwarf heroes flowing through your veins.',
    benefits: [
      'Increase your Constitution score by 1, to a maximum of 20.',
      'Whenever you take the Dodge action in combat, you can spend one Hit Die to heal yourself. Roll the die, add your Constitution modifier, and regain a number of hit points equal to the total (minimum of 1).'
    ],
    prerequisites: {
      race: 'Dwarf'
    },
    abilityScoreIncrease: {
      options: ['constitution'],
      amount: 1,
      count: 1
    },
    source: 'XGE',
    category: 'racial'
  },
  {
    id: 'orcish_fury',
    name: 'Orcish Fury',
    description: 'Your fury burns tirelessly.',
    benefits: [
      'Increase your Strength or Constitution score by 1, to a maximum of 20.',
      'When you hit with an attack using a simple or martial weapon, you can roll one of the weapon\'s damage dice an additional time and add it as extra damage of the weapon\'s damage type. Once you use this ability, you can\'t use it again until you finish a short or long rest.',
      'Immediately after you use your Relentless Endurance trait, you can use your reaction to make one weapon attack.'
    ],
    prerequisites: {
      race: 'Half-Orc'
    },
    abilityScoreIncrease: {
      options: ['strength', 'constitution'],
      amount: 1,
      count: 1
    },
    source: 'XGE',
    category: 'racial'
  },
  {
    id: 'second_chance',
    name: 'Second Chance',
    description: 'Fortune favors you when someone tries to strike you.',
    benefits: [
      'Increase your Dexterity, Constitution, or Charisma score by 1, to a maximum of 20.',
      'When a creature you can see hits you with an attack roll, you can use your reaction to force that creature to reroll. Once you use this ability, you can\'t use it again until you roll initiative at the start of combat or until you finish a short or long rest.'
    ],
    prerequisites: {
      race: 'Halfling'
    },
    abilityScoreIncrease: {
      options: ['dexterity', 'constitution', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'XGE',
    category: 'racial'
  },
  {
    id: 'dragon_fear',
    name: 'Dragon Fear',
    description: 'When angered, you radiate menace.',
    benefits: [
      'Increase your Strength, Constitution, or Charisma score by 1, to a maximum of 20.',
      'Instead of exhaling destructive energy, you can expend a use of your Breath Weapon trait to roar, forcing each creature of your choice within 30 feet of you to make a Wisdom saving throw (DC 8 + your proficiency bonus + your Charisma modifier). A target automatically succeeds on the save if it can\'t hear or see you. On a failed save, a target becomes frightened of you for 1 minute. If the frightened target takes any damage, it can repeat the saving throw, ending the effect on itself on a success.'
    ],
    prerequisites: {
      race: 'Dragonborn'
    },
    abilityScoreIncrease: {
      options: ['strength', 'constitution', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'XGE',
    category: 'racial'
  },
  {
    id: 'dragon_hide',
    name: 'Dragon Hide',
    description: 'You manifest scales and claws reminiscent of your draconic ancestors.',
    benefits: [
      'Increase your Strength, Constitution, or Charisma score by 1, to a maximum of 20.',
      'Your scales harden. While you aren\'t wearing armor, you can calculate your AC as 13 + your Dexterity modifier. You can use a shield and still gain this benefit.',
      'You grow retractable claws from the tips of your fingers. Extending or retracting the claws requires no action. The claws are natural weapons, which you can use to make unarmed strikes. If you hit with them, you deal slashing damage equal to 1d4 + your Strength modifier, instead of the normal bludgeoning damage for an unarmed strike.'
    ],
    prerequisites: {
      race: 'Dragonborn'
    },
    abilityScoreIncrease: {
      options: ['strength', 'constitution', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'XGE',
    category: 'racial'
  },

  // Tasha's Cauldron of Everything Feats
  {
    id: 'fey_touched',
    name: 'Fey Touched',
    description: 'Your exposure to the Feywild\'s magic has changed you, granting you the following benefits.',
    benefits: [
      'Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      'You learn the misty step spell and one 1st-level spell of your choice. The 1st-level spell must be from the divination or enchantment school of magic. You can cast each of these spells without expending a spell slot. Once you cast either of these spells in this way, you can\'t cast that spell in this way again until you finish a long rest. You can also cast these spells using spell slots you have of the appropriate level. The spells\' spellcasting ability is the ability increased by this feat.'
    ],
    abilityScoreIncrease: {
      options: ['intelligence', 'wisdom', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'spellcasting'
  },
  {
    id: 'shadow_touched',
    name: 'Shadow Touched',
    description: 'Your exposure to the Shadowfell\'s magic has changed you, granting you the following benefits.',
    benefits: [
      'Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      'You learn the invisibility spell and one 1st-level spell of your choice. The 1st-level spell must be from the illusion or necromancy school of magic. You can cast each of these spells without expending a spell slot. Once you cast either of these spells in this way, you can\'t cast that spell in this way again until you finish a long rest. You can also cast these spells using spell slots you have of the appropriate level. The spells\' spellcasting ability is the ability increased by this feat.'
    ],
    abilityScoreIncrease: {
      options: ['intelligence', 'wisdom', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'spellcasting'
  },
  {
    id: 'telekinetic',
    name: 'Telekinetic',
    description: 'You learn to move things with your mind, granting you the following benefits.',
    benefits: [
      'Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      'You learn the mage hand cantrip. You can cast it without verbal or somatic components, and you can make the spectral hand invisible. If you already know this spell, its range increases by 30 feet when you cast it. Its spellcasting ability is the ability increased by this feat.',
      'As a bonus action, you can try to telekinetically shove one creature you can see within 30 feet of you. When you do so, the target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + the ability modifier of the score increased by this feat) or be moved 5 feet toward you or away from you. A creature can willingly fail this save.'
    ],
    abilityScoreIncrease: {
      options: ['intelligence', 'wisdom', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'spellcasting'
  },
  {
    id: 'telepathic',
    name: 'Telepathic',
    description: 'You awaken the ability to mentally connect with others, granting you the following benefits.',
    benefits: [
      'Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
      'You can speak telepathically to any creature you can see within 60 feet of you. Your telepathic utterances are in a language you know, and the creature understands you only if it knows that language. Your communication doesn\'t give the creature the ability to respond to you telepathically.',
      'You can cast the detect thoughts spell, requiring no spell slot or components, and you must finish a long rest before you can cast it this way again. Your spellcasting ability for the spell is the ability increased by this feat. If you have spell slots of 2nd level or higher, you can cast this spell with them.'
    ],
    abilityScoreIncrease: {
      options: ['intelligence', 'wisdom', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'spellcasting'
  },
  {
    id: 'crusher',
    name: 'Crusher',
    description: 'You are practiced in the art of crushing your enemies, granting you the following benefits.',
    benefits: [
      'Increase your Strength or Constitution score by 1, to a maximum of 20.',
      'Once per turn, when you hit a creature with an attack that deals bludgeoning damage, you can move it 5 feet to an unoccupied space, provided the target is no more than one size larger than you.',
      'When you score a critical hit that deals bludgeoning damage to a creature, attack rolls against that creature are made with advantage until the start of your next turn.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'constitution'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'combat'
  },
  {
    id: 'piercer',
    name: 'Piercer',
    description: 'You have achieved a penetrating precision in combat, granting you the following benefits.',
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
      'Once per turn, when you hit a creature with an attack that deals piercing damage, you can reroll one of the attack\'s damage dice, and you must use the new roll.',
      'When you score a critical hit that deals piercing damage to a creature, you can roll one additional damage die when determining the extra piercing damage the target takes.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'dexterity'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'combat'
  },
  {
    id: 'slasher',
    name: 'Slasher',
    description: 'You\'ve learned where to cut to have the greatest results, granting you the following benefits.',
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
      'Once per turn when you hit a creature with an attack that deals slashing damage, you can reduce the speed of the target by 10 feet until the start of your next turn.',
      'When you score a critical hit that deals slashing damage to a creature, you grievously wound it. Until the start of your next turn, the target has disadvantage on all attack rolls.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'dexterity'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'combat'
  },
  {
    id: 'chef',
    name: 'Chef',
    description: 'Time and effort spent mastering the culinary arts has paid off, granting you the following benefits.',
    benefits: [
      'Increase your Constitution or Wisdom score by 1, to a maximum of 20.',
      'You gain proficiency with cook\'s utensils if you don\'t already have it.',
      'As part of a short rest, you can cook special food, provided you have ingredients and cook\'s utensils on hand. You can prepare enough of this food for a number of creatures equal to 4 + your proficiency bonus. At the end of the short rest, any creature who eats the food and spends one or more Hit Dice to regain hit points regains an extra 1d8 hit points.',
      'With one hour of work or when you finish a long rest, you can cook a number of treats equal to your proficiency bonus. These special treats last 8 hours after being made. A creature can use a bonus action to eat one of those treats to gain temporary hit points equal to your proficiency bonus.'
    ],
    abilityScoreIncrease: {
      options: ['constitution', 'wisdom'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'utility'
  },
  {
    id: 'gunner',
    name: 'Gunner',
    description: 'You have a quick hand and keen eye when employing firearms, granting you the following benefits.',
    benefits: [
      'Increase your Dexterity score by 1, to a maximum of 20.',
      'You gain proficiency with firearms.',
      'You ignore the loading property of firearms.',
      'Being within 5 feet of a hostile creature doesn\'t impose disadvantage on your ranged attack rolls.'
    ],
    abilityScoreIncrease: {
      options: ['dexterity'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'combat'
  },
  {
    id: 'practiced_expert',
    name: 'Practiced Expert',
    description: 'You have honed your proficiency with particular skills, granting you the following benefits.',
    benefits: [
      'Increase one ability score of your choice by 1, to a maximum of 20.',
      'You gain proficiency in one skill of your choice.',
      'Choose one skill in which you have proficiency. You gain expertise with that skill, which means your proficiency bonus is doubled for any ability check you make with it. The skill you choose must be one that isn\'t already benefiting from a feature, such as Expertise, that doubles your proficiency bonus.'
    ],
    abilityScoreIncrease: {
      options: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
      amount: 1,
      count: 1
    },
    source: 'TCE',
    category: 'utility'
  },
  {
    id: 'poisoner',
    name: 'Poisoner',
    description: 'You can prepare and deliver deadly poisons, granting you the following benefits.',
    benefits: [
      'When you make a damage roll that deals poison damage, it ignores resistance to poison damage.',
      'You can apply poison to a weapon or piece of ammunition as a bonus action, instead of an action.',
      'You gain proficiency with the poisoner\'s kit if you don\'t already have it. With one hour of work using a poisoner\'s kit and expending 50 gp worth of materials, you can create a number of doses of potent poison equal to your proficiency bonus. Once applied to a weapon or piece of ammunition, the poison retains its potency for 1 minute or until you hit with the weapon or ammunition. When a creature takes damage from the coated weapon or ammunition, that creature must succeed on a DC 14 Constitution saving throw or take 2d8 poison damage and become poisoned until the end of your next turn.'
    ],
    source: 'TCE',
    category: 'utility'
  },
  {
    id: 'fighting_initiate',
    name: 'Fighting Initiate',
    description: 'Your martial training has helped you develop a particular style of fighting.',
    benefits: [
      'You learn one Fighting Style option of your choice from the fighter class. If you already have a style, the one you choose must be different.',
      'Whenever you reach a level that grants the Ability Score Improvement feature, you can replace this feat\'s fighting style with another one from the fighter class that you don\'t have.'
    ],
    prerequisites: {
      proficiency: 'Martial weapon or unarmed strike'
    },
    source: 'TCE',
    category: 'combat'
  }
]

// Helper Functions

/**
 * Get all feats
 */
export function getAllFeats(): Feat[] {
  return FEATS
}

/**
 * Get feats by category
 */
export function getFeatsByCategory(category: Feat['category']): Feat[] {
  return FEATS.filter(feat => feat.category === category)
}

/**
 * Get a feat by ID
 */
export function getFeatById(featId: string): Feat | undefined {
  return FEATS.find(feat => feat.id === featId)
}

/**
 * Search feats by name or description
 */
export function searchFeats(query: string): Feat[] {
  const lowercaseQuery = query.toLowerCase()
  return FEATS.filter(
    feat =>
      feat.name.toLowerCase().includes(lowercaseQuery) ||
      feat.description.toLowerCase().includes(lowercaseQuery) ||
      feat.benefits.some(benefit => benefit.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * Get feats with ability score increases
 */
export function getFeatsWithASI(): Feat[] {
  return FEATS.filter(feat => feat.abilityScoreIncrease !== undefined)
}

/**
 * Get feats without prerequisites
 */
export function getFeatsWithoutPrerequisites(): Feat[] {
  return FEATS.filter(feat => !feat.prerequisites)
}

/**
 * Check if character meets feat prerequisites
 */
export function meetsPrerequisites(
  feat: Feat,
  characterData: {
    abilityScores?: Record<string, number>
    class?: string
    race?: string
    proficiencies?: string[]
    level?: number
  }
): boolean {
  if (!feat.prerequisites) return true

  const { prerequisites } = feat
  const { abilityScores = {}, race = '', proficiencies = [], level = 1 } = characterData

  // Check ability score requirement
  if (prerequisites.abilityScore) {
    const { ability, minimum } = prerequisites.abilityScore
    const score = abilityScores[ability] || 10
    if (score < minimum) return false
  }

  // Check proficiency requirement
  if (prerequisites.proficiency) {
    if (!proficiencies.includes(prerequisites.proficiency)) return false
  }

  // Check spellcasting requirement
  if (prerequisites.spellcasting) {
    const spellcastingClasses = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard']
    if (!spellcastingClasses.includes(characterData.class?.toLowerCase() || '')) return false
  }

  // Check level requirement
  if (prerequisites.level) {
    if (level < prerequisites.level) return false
  }

  // Check race requirement
  if (prerequisites.race) {
    if (!race.toLowerCase().includes(prerequisites.race.toLowerCase())) return false
  }

  return true
}

/**
 * Get feats available to a character (meets all prerequisites)
 */
export function getAvailableFeats(characterData: {
  abilityScores?: Record<string, number>
  class?: string
  race?: string
  proficiencies?: string[]
  level?: number
}): Feat[] {
  return FEATS.filter(feat => meetsPrerequisites(feat, characterData))
}

/**
 * Get feat statistics
 */
export function getFeatStats() {
  return {
    total: FEATS.length,
    byCategory: {
      combat: FEATS.filter(f => f.category === 'combat').length,
      utility: FEATS.filter(f => f.category === 'utility').length,
      spellcasting: FEATS.filter(f => f.category === 'spellcasting').length,
      social: FEATS.filter(f => f.category === 'social').length,
      mobility: FEATS.filter(f => f.category === 'mobility').length,
      racial: FEATS.filter(f => f.category === 'racial').length
    },
    withASI: getFeatsWithASI().length,
    withPrerequisites: FEATS.filter(f => f.prerequisites).length,
    sources: {
      PHB: FEATS.filter(f => f.source === 'PHB').length,
      XGE: FEATS.filter(f => f.source === 'XGE').length,
      TCE: FEATS.filter(f => f.source === 'TCE').length
    }
  }
}

/**
 * Get feat categories
 */
export function getFeatCategories(): string[] {
  return ['combat', 'utility', 'spellcasting', 'social', 'mobility', 'racial']
}
