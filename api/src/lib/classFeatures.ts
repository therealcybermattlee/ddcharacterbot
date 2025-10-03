// D&D 5e Class Features by Level
// Static data to provide class features through the API

import type { ClassFeature } from '../types';

export const CLASS_FEATURES: Record<string, ClassFeature[]> = {
  fighter: [
    {
      name: 'Fighting Style',
      level: 1,
      description: 'You adopt a particular style of fighting as your specialty. Choose one of the following options: Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.',
      type: 'feature'
    },
    {
      name: 'Second Wind',
      level: 1,
      description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.',
      type: 'feature'
    },
    {
      name: 'Action Surge',
      level: 2,
      description: 'Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.',
      type: 'feature'
    },
    {
      name: 'Martial Archetype',
      level: 3,
      description: 'At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques, such as Champion, Battle Master, or Eldritch Knight.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Extra Attack',
      level: 5,
      description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 6,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Martial Archetype Feature',
      level: 7,
      description: 'At 7th level, you gain a feature granted by your Martial Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Indomitable',
      level: 9,
      description: 'Beginning at 9th level, you can reroll a saving throw that you fail. You must use the new roll, and you can\'t use this feature again until you finish a long rest.',
      type: 'feature'
    },
    {
      name: 'Martial Archetype Feature',
      level: 10,
      description: 'At 10th level, you gain a feature granted by your Martial Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Extra Attack (2)',
      level: 11,
      description: 'At 11th level, you can attack three times whenever you take the Attack action on your turn.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Indomitable (two uses)',
      level: 13,
      description: 'At 13th level, you can use Indomitable twice between long rests.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 14,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Martial Archetype Feature',
      level: 15,
      description: 'At 15th level, you gain a feature granted by your Martial Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Action Surge (two uses)',
      level: 17,
      description: 'At 17th level, you can use Action Surge twice before a rest, but only once on the same turn.',
      type: 'feature'
    },
    {
      name: 'Indomitable (three uses)',
      level: 17,
      description: 'At 17th level, you can use Indomitable three times between long rests.',
      type: 'feature'
    },
    {
      name: 'Martial Archetype Feature',
      level: 18,
      description: 'At 18th level, you gain a feature granted by your Martial Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Extra Attack (3)',
      level: 20,
      description: 'At 20th level, you can attack four times whenever you take the Attack action on your turn.',
      type: 'feature'
    }
  ],

  wizard: [
    {
      name: 'Spellcasting',
      level: 1,
      description: 'As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power.',
      type: 'spell'
    },
    {
      name: 'Arcane Recovery',
      level: 1,
      description: 'You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover.',
      type: 'feature'
    },
    {
      name: 'Arcane Tradition',
      level: 2,
      description: 'When you reach 2nd level, you choose an arcane tradition, shaping your practice of magic through one of eight schools, such as Evocation or Abjuration.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Arcane Tradition Feature',
      level: 6,
      description: 'At 6th level, you gain a feature granted by your Arcane Tradition.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Arcane Tradition Feature',
      level: 10,
      description: 'At 10th level, you gain a feature granted by your Arcane Tradition.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Arcane Tradition Feature',
      level: 14,
      description: 'At 14th level, you gain a feature granted by your Arcane Tradition.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Spell Mastery',
      level: 18,
      description: 'At 18th level, you have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Signature Spells',
      level: 20,
      description: 'When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You can cast each of these spells once at 3rd level without expending a spell slot. When you do so, you can\'t do so again until you finish a short or long rest.',
      type: 'feature'
    }
  ],

  rogue: [
    {
      name: 'Expertise',
      level: 1,
      description: 'Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.',
      type: 'feature'
    },
    {
      name: 'Sneak Attack',
      level: 1,
      description: 'You know how to strike subtly and exploit a foe\'s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll.',
      type: 'feature'
    },
    {
      name: 'Thieves\' Cant',
      level: 1,
      description: 'During your rogue training you learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation.',
      type: 'feature'
    },
    {
      name: 'Cunning Action',
      level: 2,
      description: 'Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns to take the Dash, Disengage, or Hide action.',
      type: 'feature'
    }
  ],

  cleric: [
    {
      name: 'Spellcasting',
      level: 1,
      description: 'As a conduit for divine power, you can cast cleric spells.',
      type: 'spell'
    },
    {
      name: 'Divine Domain',
      level: 1,
      description: 'Choose one domain related to your deity, such as Life, Light, or War. Your choice grants you domain spells and other features when you choose it at 1st level.',
      type: 'subclass_feature'
    },
    {
      name: 'Channel Divinity',
      level: 2,
      description: 'At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects.',
      type: 'feature'
    }
  ],

  barbarian: [
    {
      name: 'Rage',
      level: 1,
      description: 'In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain advantage on Strength checks and saving throws, melee damage bonus, and resistance to bludgeoning, piercing, and slashing damage.',
      type: 'feature'
    },
    {
      name: 'Unarmored Defense',
      level: 1,
      description: 'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier.',
      type: 'feature'
    },
    {
      name: 'Reckless Attack',
      level: 2,
      description: 'Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly.',
      type: 'feature'
    },
    {
      name: 'Danger Sense',
      level: 2,
      description: 'At 2nd level, you gain an uncanny sense of when things nearby aren\'t as they should be, giving you an edge when you dodge away from danger.',
      type: 'feature'
    }
  ],

  bard: [
    {
      name: 'Spellcasting',
      level: 1,
      description: 'You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music.',
      type: 'spell'
    },
    {
      name: 'Bardic Inspiration',
      level: 1,
      description: 'You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you.',
      type: 'feature'
    },
    {
      name: 'Jack of All Trades',
      level: 2,
      description: 'Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn\'t already include your proficiency bonus.',
      type: 'feature'
    },
    {
      name: 'Song of Rest',
      level: 2,
      description: 'Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest.',
      type: 'feature'
    }
  ],

  ranger: [
    {
      name: 'Favored Enemy',
      level: 1,
      description: 'You have significant experience studying, tracking, hunting, and even talking to a certain type of creature.',
      type: 'feature'
    },
    {
      name: 'Natural Explorer',
      level: 1,
      description: 'You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions.',
      type: 'feature'
    },
    {
      name: 'Fighting Style',
      level: 2,
      description: 'At 2nd level, you adopt a particular style of fighting as your specialty. Choose from Archery, Defense, Dueling, or Two-Weapon Fighting.',
      type: 'feature'
    },
    {
      name: 'Spellcasting',
      level: 2,
      description: 'By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does.',
      type: 'spell'
    }
  ],

  paladin: [
    {
      name: 'Divine Sense',
      level: 1,
      description: 'The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears.',
      type: 'feature'
    },
    {
      name: 'Lay on Hands',
      level: 1,
      description: 'Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest.',
      type: 'feature'
    },
    {
      name: 'Fighting Style',
      level: 2,
      description: 'At 2nd level, you adopt a style of fighting as your specialty. Choose from Defense, Dueling, Great Weapon Fighting, or Protection.',
      type: 'feature'
    },
    {
      name: 'Spellcasting',
      level: 2,
      description: 'By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.',
      type: 'spell'
    },
    {
      name: 'Divine Smite',
      level: 2,
      description: 'Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target.',
      type: 'feature'
    }
  ],

  druid: [
    {
      name: 'Druidcraft',
      level: 1,
      description: 'You know the druidcraft cantrip.',
      type: 'spell'
    },
    {
      name: 'Spellcasting',
      level: 1,
      description: 'Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will.',
      type: 'spell'
    },
    {
      name: 'Wild Shape',
      level: 2,
      description: 'Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before.',
      type: 'feature'
    }
  ],

  monk: [
    {
      name: 'Unarmored Defense',
      level: 1,
      description: 'While you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.',
      type: 'feature'
    },
    {
      name: 'Martial Arts',
      level: 1,
      description: 'You can use Dexterity instead of Strength for attack and damage rolls of unarmed strikes and monk weapons, and you can roll a d4 in place of normal damage.',
      type: 'feature'
    },
    {
      name: 'Ki',
      level: 2,
      description: 'Starting at 2nd level, your training allows you to harness the mystic energy of ki. You can spend ki points to fuel various ki features.',
      type: 'feature'
    },
    {
      name: 'Unarmored Movement',
      level: 2,
      description: 'Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield.',
      type: 'feature'
    }
  ],

  sorcerer: [
    {
      name: 'Spellcasting',
      level: 1,
      description: 'An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic.',
      type: 'spell'
    },
    {
      name: 'Sorcerous Origin',
      level: 1,
      description: 'Choose a sorcerous origin, which describes the source of your innate magical power, such as Draconic Bloodline or Wild Magic.',
      type: 'subclass_feature'
    },
    {
      name: 'Font of Magic',
      level: 2,
      description: 'At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points.',
      type: 'feature'
    }
  ],

  warlock: [
    {
      name: 'Otherworldly Patron',
      level: 1,
      description: 'At 1st level, you have struck a pact with an otherworldly being, such as The Fiend, The Great Old One, or The Archfey.',
      type: 'subclass_feature'
    },
    {
      name: 'Pact Magic',
      level: 1,
      description: 'Your arcane research and the magic bestowed on you by your patron have given you facility with spells.',
      type: 'spell'
    },
    {
      name: 'Eldritch Invocations',
      level: 2,
      description: 'At 2nd level, you gain eldritch invocations of your choice. When you gain certain warlock levels, you gain additional invocations of your choice.',
      type: 'feature'
    }
  ]
};

// Helper function to get features for a specific class and level
export function getClassFeatures(className: string, level: number = 1): ClassFeature[] {
  const classKey = className.toLowerCase();
  const allFeatures = CLASS_FEATURES[classKey] || [];
  return allFeatures.filter(feature => feature.level <= level);
}

// Helper function to get features for a specific level only
export function getClassFeaturesAtLevel(className: string, level: number): ClassFeature[] {
  const classKey = className.toLowerCase();
  const allFeatures = CLASS_FEATURES[classKey] || [];
  return allFeatures.filter(feature => feature.level === level);
}
