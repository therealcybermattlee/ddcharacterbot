// D&D 5e Class Features by Level
// Static data to supplement the backend API which doesn't include class features

import { ClassFeature } from '../types/dnd5e'

export const CLASS_FEATURES: Record<string, ClassFeature[]> = {
  fighter: [
    {
      id: 'fighting-style',
      name: 'Fighting Style',
      description: 'You adopt a particular style of fighting as your specialty. Choose one of the following options: Archery, Defense, Dueling, Great Weapon Fighting, Protection, or Two-Weapon Fighting.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'second-wind',
      name: 'Second Wind',
      description: 'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.',
      level: 1,
      type: 'bonus'
    },
    {
      id: 'action-surge',
      name: 'Action Surge',
      description: 'Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.',
      level: 2,
      type: 'active'
    },
    {
      id: 'martial-archetype',
      name: 'Martial Archetype',
      description: 'At 3rd level, you choose an archetype that you strive to emulate in your combat styles and techniques, such as Champion, Battle Master, or Eldritch Knight.',
      level: 3,
      type: 'passive'
    },
    {
      id: 'ability-score-improvement-4',
      name: 'Ability Score Improvement',
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      level: 4,
      type: 'passive'
    },
    {
      id: 'extra-attack',
      name: 'Extra Attack',
      description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
      level: 5,
      type: 'passive'
    }
  ],

  wizard: [
    {
      id: 'spellcasting',
      name: 'Spellcasting',
      description: 'As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'arcane-recovery',
      name: 'Arcane Recovery',
      description: 'You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover.',
      level: 1,
      type: 'active'
    },
    {
      id: 'arcane-tradition',
      name: 'Arcane Tradition',
      description: 'When you reach 2nd level, you choose an arcane tradition, shaping your practice of magic through one of eight schools, such as Evocation or Abjuration.',
      level: 2,
      type: 'passive'
    },
    {
      id: 'cantrip-formulas',
      name: 'Cantrip Formulas',
      description: 'At 3rd level, you have scribed a set of arcane formulas in your spellbook that you can cast as rituals.',
      level: 3,
      type: 'passive'
    }
  ],

  rogue: [
    {
      id: 'expertise',
      name: 'Expertise',
      description: 'Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\' tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'sneak-attack',
      name: 'Sneak Attack',
      description: 'You know how to strike subtly and exploit a foe\'s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'thieves-cant',
      name: 'Thieves\' Cant',
      description: 'During your rogue training you learned thieves\' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'cunning-action',
      name: 'Cunning Action',
      description: 'Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns to take the Dash, Disengage, or Hide action.',
      level: 2,
      type: 'bonus'
    }
  ],

  cleric: [
    {
      id: 'spellcasting',
      name: 'Spellcasting',
      description: 'As a conduit for divine power, you can cast cleric spells.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'divine-domain',
      name: 'Divine Domain',
      description: 'Choose one domain related to your deity, such as Life, Light, or War. Your choice grants you domain spells and other features when you choose it at 1st level.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'channel-divinity',
      name: 'Channel Divinity',
      description: 'At 2nd level, you gain the ability to channel divine energy directly from your deity, using that energy to fuel magical effects.',
      level: 2,
      type: 'active'
    }
  ],

  barbarian: [
    {
      id: 'rage',
      name: 'Rage',
      description: 'In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action. While raging, you gain advantage on Strength checks and saving throws, melee damage bonus, and resistance to bludgeoning, piercing, and slashing damage.',
      level: 1,
      type: 'bonus'
    },
    {
      id: 'unarmored-defense',
      name: 'Unarmored Defense',
      description: 'While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'reckless-attack',
      name: 'Reckless Attack',
      description: 'Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly.',
      level: 2,
      type: 'active'
    },
    {
      id: 'danger-sense',
      name: 'Danger Sense',
      description: 'At 2nd level, you gain an uncanny sense of when things nearby aren\'t as they should be, giving you an edge when you dodge away from danger.',
      level: 2,
      type: 'passive'
    }
  ],

  bard: [
    {
      id: 'spellcasting',
      name: 'Spellcasting',
      description: 'You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'bardic-inspiration',
      name: 'Bardic Inspiration',
      description: 'You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you.',
      level: 1,
      type: 'bonus'
    },
    {
      id: 'jack-of-all-trades',
      name: 'Jack of All Trades',
      description: 'Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn\'t already include your proficiency bonus.',
      level: 2,
      type: 'passive'
    },
    {
      id: 'song-of-rest',
      name: 'Song of Rest',
      description: 'Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest.',
      level: 2,
      type: 'active'
    }
  ],

  ranger: [
    {
      id: 'favored-enemy',
      name: 'Favored Enemy',
      description: 'You have significant experience studying, tracking, hunting, and even talking to a certain type of creature.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'natural-explorer',
      name: 'Natural Explorer',
      description: 'You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'fighting-style',
      name: 'Fighting Style',
      description: 'At 2nd level, you adopt a particular style of fighting as your specialty. Choose from Archery, Defense, Dueling, or Two-Weapon Fighting.',
      level: 2,
      type: 'passive'
    },
    {
      id: 'spellcasting',
      name: 'Spellcasting',
      description: 'By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does.',
      level: 2,
      type: 'passive'
    }
  ],

  paladin: [
    {
      id: 'divine-sense',
      name: 'Divine Sense',
      description: 'The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears.',
      level: 1,
      type: 'active'
    },
    {
      id: 'lay-on-hands',
      name: 'Lay on Hands',
      description: 'Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest.',
      level: 1,
      type: 'active'
    },
    {
      id: 'fighting-style',
      name: 'Fighting Style',
      description: 'At 2nd level, you adopt a style of fighting as your specialty. Choose from Defense, Dueling, Great Weapon Fighting, or Protection.',
      level: 2,
      type: 'passive'
    },
    {
      id: 'spellcasting',
      name: 'Spellcasting',
      description: 'By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.',
      level: 2,
      type: 'passive'
    },
    {
      id: 'divine-smite',
      name: 'Divine Smite',
      description: 'Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target.',
      level: 2,
      type: 'active'
    }
  ],

  druid: [
    {
      id: 'druidcraft',
      name: 'Druidcraft',
      description: 'You know the druidcraft cantrip.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'spellcasting',
      name: 'Spellcasting',
      description: 'Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'wild-shape',
      name: 'Wild Shape',
      description: 'Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before.',
      level: 2,
      type: 'active'
    }
  ],

  monk: [
    {
      id: 'unarmored-defense',
      name: 'Unarmored Defense',
      description: 'While you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'martial-arts',
      name: 'Martial Arts',
      description: 'You can use Dexterity instead of Strength for attack and damage rolls of unarmed strikes and monk weapons, and you can roll a d4 in place of normal damage.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'ki',
      name: 'Ki',
      description: 'Starting at 2nd level, your training allows you to harness the mystic energy of ki. You can spend ki points to fuel various ki features.',
      level: 2,
      type: 'active'
    },
    {
      id: 'unarmored-movement',
      name: 'Unarmored Movement',
      description: 'Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield.',
      level: 2,
      type: 'passive'
    }
  ],

  sorcerer: [
    {
      id: 'spellcasting',
      name: 'Spellcasting',
      description: 'An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'sorcerous-origin',
      name: 'Sorcerous Origin',
      description: 'Choose a sorcerous origin, which describes the source of your innate magical power, such as Draconic Bloodline or Wild Magic.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'font-of-magic',
      name: 'Font of Magic',
      description: 'At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points.',
      level: 2,
      type: 'active'
    }
  ],

  warlock: [
    {
      id: 'otherworldly-patron',
      name: 'Otherworldly Patron',
      description: 'At 1st level, you have struck a pact with an otherworldly being, such as The Fiend, The Great Old One, or The Archfey.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'pact-magic',
      name: 'Pact Magic',
      description: 'Your arcane research and the magic bestowed on you by your patron have given you facility with spells.',
      level: 1,
      type: 'passive'
    },
    {
      id: 'eldritch-invocations',
      name: 'Eldritch Invocations',
      description: 'At 2nd level, you gain eldritch invocations of your choice. When you gain certain warlock levels, you gain additional invocations of your choice.',
      level: 2,
      type: 'passive'
    }
  ]
}

// Helper function to get features for a specific class and level
export function getClassFeatures(className: string, level: number): ClassFeature[] {
  const classKey = className.toLowerCase()
  const allFeatures = CLASS_FEATURES[classKey] || []
  return allFeatures.filter(feature => feature.level <= level)
}

// Helper function to get features for a specific level only
export function getClassFeaturesAtLevel(className: string, level: number): ClassFeature[] {
  const classKey = className.toLowerCase()
  const allFeatures = CLASS_FEATURES[classKey] || []
  return allFeatures.filter(feature => feature.level === level)
}

// Helper function to get all available class names
export function getAvailableClassNames(): string[] {
  return Object.keys(CLASS_FEATURES)
}