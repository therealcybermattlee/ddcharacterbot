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
    },
    {
      name: 'Roguish Archetype',
      level: 3,
      description: 'At 3rd level, you choose an archetype that you emulate in the exercise of your rogue abilities, such as Thief, Assassin, or Arcane Trickster.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Uncanny Dodge',
      level: 5,
      description: 'Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack\'s damage against you.',
      type: 'feature'
    },
    {
      name: 'Expertise',
      level: 6,
      description: 'At 6th level, you can choose two more of your proficiencies to gain the benefits of Expertise.',
      type: 'feature'
    },
    {
      name: 'Evasion',
      level: 7,
      description: 'Beginning at 7th level, you can nimbly dodge out of the way of certain area effects. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Roguish Archetype Feature',
      level: 9,
      description: 'At 9th level, you gain a feature granted by your Roguish Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 10,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Reliable Talent',
      level: 11,
      description: 'By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Roguish Archetype Feature',
      level: 13,
      description: 'At 13th level, you gain a feature granted by your Roguish Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Blindsense',
      level: 14,
      description: 'Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.',
      type: 'feature'
    },
    {
      name: 'Slippery Mind',
      level: 15,
      description: 'By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Roguish Archetype Feature',
      level: 17,
      description: 'At 17th level, you gain a feature granted by your Roguish Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Elusive',
      level: 18,
      description: 'Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren\'t incapacitated.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Stroke of Luck',
      level: 20,
      description: 'At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.',
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
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Destroy Undead',
      level: 5,
      description: 'Starting at 5th level, when an undead fails its saving throw against your Turn Undead feature, the creature is instantly destroyed if its challenge rating is at or below a certain threshold.',
      type: 'feature'
    },
    {
      name: 'Channel Divinity (2/rest)',
      level: 6,
      description: 'At 6th level, you can use your Channel Divinity twice between rests.',
      type: 'feature'
    },
    {
      name: 'Divine Domain Feature',
      level: 6,
      description: 'At 6th level, you gain a feature granted by your Divine Domain.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Divine Domain Feature',
      level: 8,
      description: 'At 8th level, you gain a feature granted by your Divine Domain.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Divine Domain Feature',
      level: 17,
      description: 'At 17th level, you gain a feature granted by your Divine Domain.',
      type: 'subclass_feature'
    },
    {
      name: 'Channel Divinity (3/rest)',
      level: 18,
      description: 'At 18th level, you can use your Channel Divinity three times between rests.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Divine Intervention Improvement',
      level: 20,
      description: 'At 20th level, your call for divine intervention succeeds automatically, no roll required.',
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
    },
    {
      name: 'Primal Path',
      level: 3,
      description: 'At 3rd level, you choose a path that shapes the nature of your rage, such as the Path of the Berserker or the Path of the Totem Warrior.',
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
      name: 'Fast Movement',
      level: 5,
      description: 'Starting at 5th level, your speed increases by 10 feet while you aren\'t wearing heavy armor.',
      type: 'feature'
    },
    {
      name: 'Primal Path Feature',
      level: 6,
      description: 'At 6th level, you gain a feature granted by your Primal Path.',
      type: 'subclass_feature'
    },
    {
      name: 'Feral Instinct',
      level: 7,
      description: 'By 7th level, your instincts are so honed that you have advantage on initiative rolls. Additionally, if you are surprised at the start of combat and aren\'t incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Brutal Critical',
      level: 9,
      description: 'Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.',
      type: 'feature'
    },
    {
      name: 'Primal Path Feature',
      level: 10,
      description: 'At 10th level, you gain a feature granted by your Primal Path.',
      type: 'subclass_feature'
    },
    {
      name: 'Relentless Rage',
      level: 11,
      description: 'Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while raging and don\'t die outright, you can make a DC 10 Constitution saving throw.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Brutal Critical (2 dice)',
      level: 13,
      description: 'At 13th level, you can roll two additional weapon damage dice when determining the extra damage for a critical hit with a melee attack.',
      type: 'feature'
    },
    {
      name: 'Primal Path Feature',
      level: 14,
      description: 'At 14th level, you gain a feature granted by your Primal Path.',
      type: 'subclass_feature'
    },
    {
      name: 'Persistent Rage',
      level: 15,
      description: 'Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Brutal Critical (3 dice)',
      level: 17,
      description: 'At 17th level, you can roll three additional weapon damage dice when determining the extra damage for a critical hit with a melee attack.',
      type: 'feature'
    },
    {
      name: 'Indomitable Might',
      level: 18,
      description: 'Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Primal Champion',
      level: 20,
      description: 'At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.',
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
    },
    {
      name: 'Bard College',
      level: 3,
      description: 'At 3rd level, you delve into the advanced techniques of a bard college of your choice, such as the College of Lore or the College of Valor.',
      type: 'subclass_feature'
    },
    {
      name: 'Expertise',
      level: 3,
      description: 'At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Bardic Inspiration (d8)',
      level: 5,
      description: 'At 5th level, your Bardic Inspiration die changes to a d8.',
      type: 'feature'
    },
    {
      name: 'Font of Inspiration',
      level: 5,
      description: 'Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.',
      type: 'feature'
    },
    {
      name: 'Countercharm',
      level: 6,
      description: 'At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects.',
      type: 'feature'
    },
    {
      name: 'Bard College Feature',
      level: 6,
      description: 'At 6th level, you gain a feature granted by your Bard College.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Bardic Inspiration (d10)',
      level: 10,
      description: 'At 10th level, your Bardic Inspiration die changes to a d10.',
      type: 'feature'
    },
    {
      name: 'Expertise',
      level: 10,
      description: 'At 10th level, you can choose two more of your skill proficiencies to gain the benefits of Expertise.',
      type: 'feature'
    },
    {
      name: 'Magical Secrets',
      level: 10,
      description: 'By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any class, including this one. A spell you choose must be of a level you can cast.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Bard College Feature',
      level: 14,
      description: 'At 14th level, you gain a feature granted by your Bard College.',
      type: 'subclass_feature'
    },
    {
      name: 'Magical Secrets',
      level: 14,
      description: 'At 14th level, you learn two additional spells from any class.',
      type: 'feature'
    },
    {
      name: 'Bardic Inspiration (d12)',
      level: 15,
      description: 'At 15th level, your Bardic Inspiration die changes to a d12.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Magical Secrets',
      level: 18,
      description: 'At 18th level, you learn two additional spells from any class.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Superior Inspiration',
      level: 20,
      description: 'At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.',
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
    },
    {
      name: 'Ranger Archetype',
      level: 3,
      description: 'At 3rd level, you choose an archetype that you strive to emulate, such as the Hunter or Beast Master.',
      type: 'subclass_feature'
    },
    {
      name: 'Primeval Awareness',
      level: 3,
      description: 'Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you.',
      type: 'feature'
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
      name: 'Favored Enemy and Natural Explorer improvements',
      level: 6,
      description: 'At 6th level, you gain an additional favored enemy and favored terrain.',
      type: 'feature'
    },
    {
      name: 'Ranger Archetype Feature',
      level: 7,
      description: 'At 7th level, you gain a feature granted by your Ranger Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Land\'s Stride',
      level: 8,
      description: 'Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement.',
      type: 'feature'
    },
    {
      name: 'Natural Explorer improvement',
      level: 10,
      description: 'At 10th level, you gain an additional favored terrain.',
      type: 'feature'
    },
    {
      name: 'Ranger Archetype Feature',
      level: 11,
      description: 'At 11th level, you gain a feature granted by your Ranger Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Favored Enemy improvement',
      level: 14,
      description: 'At 14th level, you gain an additional favored enemy.',
      type: 'feature'
    },
    {
      name: 'Ranger Archetype Feature',
      level: 15,
      description: 'At 15th level, you gain a feature granted by your Ranger Archetype.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Foe Slayer',
      level: 20,
      description: 'At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies.',
      type: 'feature'
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
    },
    {
      name: 'Divine Health',
      level: 3,
      description: 'By 3rd level, the divine magic flowing through you makes you immune to disease.',
      type: 'feature'
    },
    {
      name: 'Sacred Oath',
      level: 3,
      description: 'When you reach 3rd level, you swear the oath that binds you as a paladin forever.',
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
      name: 'Aura of Protection',
      level: 6,
      description: 'Whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier.',
      type: 'feature'
    },
    {
      name: 'Sacred Oath Feature',
      level: 7,
      description: 'At 7th level, you gain a feature granted by your Sacred Oath.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Aura of Courage',
      level: 10,
      description: 'Starting at 10th level, you and friendly creatures within 10 feet of you can\'t be frightened while you are conscious.',
      type: 'feature'
    },
    {
      name: 'Improved Divine Smite',
      level: 11,
      description: 'By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Cleansing Touch',
      level: 14,
      description: 'Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.',
      type: 'feature'
    },
    {
      name: 'Sacred Oath Feature',
      level: 15,
      description: 'At 15th level, you gain a feature granted by your Sacred Oath.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Aura Improvements',
      level: 18,
      description: 'At 18th level, the range of your auras increases to 30 feet.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Sacred Oath Feature',
      level: 20,
      description: 'At 20th level, you gain the capstone feature of your Sacred Oath.',
      type: 'subclass_feature'
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
      name: 'Druid Circle',
      level: 2,
      description: 'At 2nd level, you choose to identify with a circle of druids, such as the Circle of the Land.',
      type: 'subclass_feature'
    },
    {
      name: 'Wild Shape',
      level: 2,
      description: 'Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Wild Shape Improvement',
      level: 4,
      description: 'At 4th level, your Wild Shape improves. You can use it to transform into a beast with a challenge rating as high as 1/2.',
      type: 'feature'
    },
    {
      name: 'Druid Circle Feature',
      level: 6,
      description: 'At 6th level, you gain a feature granted by your Druid Circle.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Wild Shape Improvement',
      level: 8,
      description: 'At 8th level, you can use your action to magically assume the shape of a beast with a challenge rating as high as 1.',
      type: 'feature'
    },
    {
      name: 'Druid Circle Feature',
      level: 10,
      description: 'At 10th level, you gain a feature granted by your Druid Circle.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Druid Circle Feature',
      level: 14,
      description: 'At 14th level, you gain a feature granted by your Druid Circle.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Timeless Body',
      level: 18,
      description: 'Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.',
      type: 'feature'
    },
    {
      name: 'Beast Spells',
      level: 18,
      description: 'Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Archdruid',
      level: 20,
      description: 'At 20th level, you can use your Wild Shape an unlimited number of times. Additionally, you can ignore the verbal and somatic components of your druid spells.',
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
    },
    {
      name: 'Monastic Tradition',
      level: 3,
      description: 'When you reach 3rd level, you commit yourself to a monastic tradition, such as the Way of the Open Hand.',
      type: 'subclass_feature'
    },
    {
      name: 'Deflect Missiles',
      level: 3,
      description: 'Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Slow Fall',
      level: 4,
      description: 'Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.',
      type: 'feature'
    },
    {
      name: 'Extra Attack',
      level: 5,
      description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.',
      type: 'feature'
    },
    {
      name: 'Stunning Strike',
      level: 5,
      description: 'Starting at 5th level, you can interfere with the flow of ki in an opponent\'s body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike.',
      type: 'feature'
    },
    {
      name: 'Ki-Empowered Strikes',
      level: 6,
      description: 'Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.',
      type: 'feature'
    },
    {
      name: 'Monastic Tradition Feature',
      level: 6,
      description: 'At 6th level, you gain a feature granted by your Monastic Tradition.',
      type: 'subclass_feature'
    },
    {
      name: 'Evasion',
      level: 7,
      description: 'At 7th level, your instinctive agility lets you dodge out of the way of certain area effects. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw.',
      type: 'feature'
    },
    {
      name: 'Stillness of Mind',
      level: 7,
      description: 'Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Unarmored Movement Improvement',
      level: 9,
      description: 'At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.',
      type: 'feature'
    },
    {
      name: 'Purity of Body',
      level: 10,
      description: 'At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison.',
      type: 'feature'
    },
    {
      name: 'Monastic Tradition Feature',
      level: 11,
      description: 'At 11th level, you gain a feature granted by your Monastic Tradition.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Tongue of the Sun and Moon',
      level: 13,
      description: 'Starting at 13th level, you learn to touch the ki of other minds so that you understand all spoken languages.',
      type: 'feature'
    },
    {
      name: 'Diamond Soul',
      level: 14,
      description: 'Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.',
      type: 'feature'
    },
    {
      name: 'Timeless Body',
      level: 15,
      description: 'At 15th level, your ki sustains you so that you suffer none of the frailty of old age, and you can\'t be aged magically.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Monastic Tradition Feature',
      level: 17,
      description: 'At 17th level, you gain a feature granted by your Monastic Tradition.',
      type: 'subclass_feature'
    },
    {
      name: 'Empty Body',
      level: 18,
      description: 'Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Perfect Self',
      level: 20,
      description: 'At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points.',
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
    },
    {
      name: 'Metamagic',
      level: 3,
      description: 'At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two Metamagic options of your choice.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Sorcerous Origin Feature',
      level: 6,
      description: 'At 6th level, you gain a feature granted by your Sorcerous Origin.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Metamagic',
      level: 10,
      description: 'At 10th level, you learn an additional Metamagic option.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Sorcerous Origin Feature',
      level: 14,
      description: 'At 14th level, you gain a feature granted by your Sorcerous Origin.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Metamagic',
      level: 17,
      description: 'At 17th level, you learn an additional Metamagic option.',
      type: 'feature'
    },
    {
      name: 'Sorcerous Origin Feature',
      level: 18,
      description: 'At 18th level, you gain a feature granted by your Sorcerous Origin.',
      type: 'subclass_feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Sorcerous Restoration',
      level: 20,
      description: 'At 20th level, you regain 4 expended sorcery points whenever you finish a short rest.',
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
    },
    {
      name: 'Pact Boon',
      level: 3,
      description: 'At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice: Pact of the Chain, Pact of the Blade, or Pact of the Tome.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 4,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Eldritch Invocations',
      level: 5,
      description: 'At 5th level, you gain an additional Eldritch Invocation.',
      type: 'feature'
    },
    {
      name: 'Otherworldly Patron Feature',
      level: 6,
      description: 'At 6th level, you gain a feature granted by your Otherworldly Patron.',
      type: 'subclass_feature'
    },
    {
      name: 'Eldritch Invocations',
      level: 7,
      description: 'At 7th level, you gain an additional Eldritch Invocation.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 8,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Eldritch Invocations',
      level: 9,
      description: 'At 9th level, you gain an additional Eldritch Invocation.',
      type: 'feature'
    },
    {
      name: 'Otherworldly Patron Feature',
      level: 10,
      description: 'At 10th level, you gain a feature granted by your Otherworldly Patron.',
      type: 'subclass_feature'
    },
    {
      name: 'Mystic Arcanum (6th level)',
      level: 11,
      description: 'At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum.',
      type: 'spell'
    },
    {
      name: 'Ability Score Improvement',
      level: 12,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Eldritch Invocations',
      level: 12,
      description: 'At 12th level, you gain an additional Eldritch Invocation.',
      type: 'feature'
    },
    {
      name: 'Mystic Arcanum (7th level)',
      level: 13,
      description: 'At 13th level, you gain a 7th-level spell from the warlock spell list as a Mystic Arcanum.',
      type: 'spell'
    },
    {
      name: 'Otherworldly Patron Feature',
      level: 14,
      description: 'At 14th level, you gain a feature granted by your Otherworldly Patron.',
      type: 'subclass_feature'
    },
    {
      name: 'Mystic Arcanum (8th level)',
      level: 15,
      description: 'At 15th level, you gain an 8th-level spell from the warlock spell list as a Mystic Arcanum.',
      type: 'spell'
    },
    {
      name: 'Eldritch Invocations',
      level: 15,
      description: 'At 15th level, you gain an additional Eldritch Invocation.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 16,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Mystic Arcanum (9th level)',
      level: 17,
      description: 'At 17th level, you gain a 9th-level spell from the warlock spell list as a Mystic Arcanum.',
      type: 'spell'
    },
    {
      name: 'Eldritch Invocations',
      level: 18,
      description: 'At 18th level, you gain an additional Eldritch Invocation.',
      type: 'feature'
    },
    {
      name: 'Ability Score Improvement',
      level: 19,
      description: 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1.',
      type: 'asi'
    },
    {
      name: 'Eldritch Master',
      level: 20,
      description: 'At 20th level, you can draw on your inner reserve of mystical power while entreating your patron to regain expended spell slots. You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature.',
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
