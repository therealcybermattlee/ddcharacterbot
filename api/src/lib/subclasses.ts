// D&D 5e Subclasses by Class
// Static data to provide subclass information through the API

import type { Subclass } from '../types';

export const SUBCLASSES: Record<string, Subclass[]> = {
  fighter: [
    {
      id: 'fighter-champion',
      name: 'Champion',
      description: 'Champions focus on physical excellence and devastating attacks.',
      features: [
        {
          name: 'Improved Critical',
          level: 3,
          description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.',
          type: 'subclass_feature',
          subclass: 'Champion'
        },
        {
          name: 'Remarkable Athlete',
          level: 7,
          description: 'You can add half your proficiency bonus to any Strength, Dexterity, or Constitution check you make that doesn\'t already use your proficiency bonus.',
          type: 'subclass_feature',
          subclass: 'Champion'
        }
      ]
    },
    {
      id: 'fighter-battle-master',
      name: 'Battle Master',
      description: 'Battle Masters are skilled tacticians who use superiority dice to execute powerful maneuvers.',
      features: [
        {
          name: 'Combat Superiority',
          level: 3,
          description: 'You learn maneuvers that are fueled by special dice called superiority dice.',
          type: 'subclass_feature',
          subclass: 'Battle Master'
        },
        {
          name: 'Know Your Enemy',
          level: 7,
          description: 'If you spend at least 1 minute observing or interacting with another creature, you can learn certain information about its capabilities.',
          type: 'subclass_feature',
          subclass: 'Battle Master'
        }
      ]
    }
  ],

  wizard: [
    {
      id: 'wizard-evocation',
      name: 'School of Evocation',
      description: 'Evokers focus on creating powerful elemental effects.',
      features: [
        {
          name: 'Evocation Savant',
          level: 2,
          description: 'The gold and time you must spend to copy an evocation spell into your spellbook is halved.',
          type: 'subclass_feature',
          subclass: 'School of Evocation'
        },
        {
          name: 'Sculpt Spells',
          level: 2,
          description: 'You can create pockets of relative safety within the effects of your evocation spells.',
          type: 'subclass_feature',
          subclass: 'School of Evocation'
        }
      ]
    },
    {
      id: 'wizard-abjuration',
      name: 'School of Abjuration',
      description: 'Abjurers specialize in protective magic and wards.',
      features: [
        {
          name: 'Abjuration Savant',
          level: 2,
          description: 'The gold and time you must spend to copy an abjuration spell into your spellbook is halved.',
          type: 'subclass_feature',
          subclass: 'School of Abjuration'
        },
        {
          name: 'Arcane Ward',
          level: 2,
          description: 'You can weave magic around yourself for protection.',
          type: 'subclass_feature',
          subclass: 'School of Abjuration'
        }
      ]
    }
  ],

  rogue: [
    {
      id: 'rogue-thief',
      name: 'Thief',
      description: 'Thieves are skilled at stealing and have unmatched agility.',
      features: [
        {
          name: 'Fast Hands',
          level: 3,
          description: 'You can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves\' tools, or take the Use an Object action.',
          type: 'subclass_feature',
          subclass: 'Thief'
        },
        {
          name: 'Second-Story Work',
          level: 3,
          description: 'You gain the ability to climb faster than normal; climbing no longer costs you extra movement.',
          type: 'subclass_feature',
          subclass: 'Thief'
        }
      ]
    },
    {
      id: 'rogue-assassin',
      name: 'Assassin',
      description: 'Assassins focus on dealing deadly damage to unsuspecting foes.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 3,
          description: 'You gain proficiency with the disguise kit and the poisoner\'s kit.',
          type: 'subclass_feature',
          subclass: 'Assassin'
        },
        {
          name: 'Assassinate',
          level: 3,
          description: 'You have advantage on attack rolls against any creature that hasn\'t taken a turn in the combat yet.',
          type: 'subclass_feature',
          subclass: 'Assassin'
        }
      ]
    }
  ],

  cleric: [
    {
      id: 'cleric-life',
      name: 'Life Domain',
      description: 'Life domain clerics focus on healing and protecting others.',
      features: [
        {
          name: 'Bonus Proficiency',
          level: 1,
          description: 'You gain proficiency with heavy armor.',
          type: 'subclass_feature',
          subclass: 'Life Domain'
        },
        {
          name: 'Disciple of Life',
          level: 1,
          description: 'Your healing spells are more effective.',
          type: 'subclass_feature',
          subclass: 'Life Domain'
        }
      ]
    },
    {
      id: 'cleric-war',
      name: 'War Domain',
      description: 'War domain clerics are skilled in combat and inspire others in battle.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 1,
          description: 'You gain proficiency with martial weapons and heavy armor.',
          type: 'subclass_feature',
          subclass: 'War Domain'
        },
        {
          name: 'War Priest',
          level: 1,
          description: 'When you use the Attack action, you can make one weapon attack as a bonus action.',
          type: 'subclass_feature',
          subclass: 'War Domain'
        }
      ]
    }
  ],

  barbarian: [
    {
      id: 'barbarian-berserker',
      name: 'Path of the Berserker',
      description: 'Berserkers channel their rage into unmatched fury.',
      features: [
        {
          name: 'Frenzy',
          level: 3,
          description: 'You can go into a frenzy when you rage, making a single melee weapon attack as a bonus action on each of your turns after this one.',
          type: 'subclass_feature',
          subclass: 'Path of the Berserker'
        }
      ]
    },
    {
      id: 'barbarian-totem-warrior',
      name: 'Path of the Totem Warrior',
      description: 'Totem warriors draw spiritual power from animal spirits.',
      features: [
        {
          name: 'Spirit Seeker',
          level: 3,
          description: 'You can cast the beast sense and speak with animals spells as rituals.',
          type: 'subclass_feature',
          subclass: 'Path of the Totem Warrior'
        },
        {
          name: 'Totem Spirit',
          level: 3,
          description: 'You choose a totem spirit and gain its feature.',
          type: 'subclass_feature',
          subclass: 'Path of the Totem Warrior'
        }
      ]
    }
  ],

  bard: [
    {
      id: 'bard-lore',
      name: 'College of Lore',
      description: 'Bards of the College of Lore collect knowledge and use magic to confuse and harm their foes.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 3,
          description: 'You gain proficiency with three skills of your choice.',
          type: 'subclass_feature',
          subclass: 'College of Lore'
        },
        {
          name: 'Cutting Words',
          level: 3,
          description: 'You learn how to use your wit to distract, confuse, and otherwise sap the confidence of others.',
          type: 'subclass_feature',
          subclass: 'College of Lore'
        }
      ]
    },
    {
      id: 'bard-valor',
      name: 'College of Valor',
      description: 'Bards of the College of Valor are daring warriors and inspire heroism.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 3,
          description: 'You gain proficiency with medium armor, shields, and martial weapons.',
          type: 'subclass_feature',
          subclass: 'College of Valor'
        },
        {
          name: 'Combat Inspiration',
          level: 3,
          description: 'A creature that has a Bardic Inspiration die can use it to add to a weapon damage roll or to their AC.',
          type: 'subclass_feature',
          subclass: 'College of Valor'
        }
      ]
    }
  ],

  ranger: [
    {
      id: 'ranger-hunter',
      name: 'Hunter',
      description: 'Hunters specialize in fighting specific types of foes.',
      features: [
        {
          name: 'Hunter\'s Prey',
          level: 3,
          description: 'You gain one of the following features: Colossus Slayer, Giant Killer, or Horde Breaker.',
          type: 'subclass_feature',
          subclass: 'Hunter'
        }
      ]
    },
    {
      id: 'ranger-beast-master',
      name: 'Beast Master',
      description: 'Beast masters form a bond with an animal companion.',
      features: [
        {
          name: 'Ranger\'s Companion',
          level: 3,
          description: 'You gain a beast companion that accompanies you on your adventures.',
          type: 'subclass_feature',
          subclass: 'Beast Master'
        }
      ]
    }
  ],

  paladin: [
    {
      id: 'paladin-devotion',
      name: 'Oath of Devotion',
      description: 'Paladins who take the Oath of Devotion are committed to the ideals of justice and honor.',
      features: [
        {
          name: 'Sacred Weapon',
          level: 3,
          description: 'You can use your Channel Divinity to imbue one weapon with positive energy.',
          type: 'subclass_feature',
          subclass: 'Oath of Devotion'
        },
        {
          name: 'Turn the Unholy',
          level: 3,
          description: 'You can use your Channel Divinity to turn fiends and undead.',
          type: 'subclass_feature',
          subclass: 'Oath of Devotion'
        }
      ]
    },
    {
      id: 'paladin-vengeance',
      name: 'Oath of Vengeance',
      description: 'Paladins who take the Oath of Vengeance are driven by their desire to punish wrongdoers.',
      features: [
        {
          name: 'Abjure Enemy',
          level: 3,
          description: 'You can use your Channel Divinity to utter a vow of enmity against a creature you can see.',
          type: 'subclass_feature',
          subclass: 'Oath of Vengeance'
        },
        {
          name: 'Vow of Enmity',
          level: 3,
          description: 'You can use your Channel Divinity to gain advantage on attack rolls against a creature.',
          type: 'subclass_feature',
          subclass: 'Oath of Vengeance'
        }
      ]
    }
  ],

  druid: [
    {
      id: 'druid-land',
      name: 'Circle of the Land',
      description: 'Druids of the Circle of the Land are mystics and sages.',
      features: [
        {
          name: 'Bonus Cantrip',
          level: 2,
          description: 'You learn one additional druid cantrip of your choice.',
          type: 'subclass_feature',
          subclass: 'Circle of the Land'
        },
        {
          name: 'Natural Recovery',
          level: 2,
          description: 'During a short rest, you can recover some of your magical energy.',
          type: 'subclass_feature',
          subclass: 'Circle of the Land'
        }
      ]
    },
    {
      id: 'druid-moon',
      name: 'Circle of the Moon',
      description: 'Druids of the Circle of the Moon are fierce guardians of the wild.',
      features: [
        {
          name: 'Combat Wild Shape',
          level: 2,
          description: 'You can use Wild Shape as a bonus action and use it to transform into more powerful beasts.',
          type: 'subclass_feature',
          subclass: 'Circle of the Moon'
        },
        {
          name: 'Circle Forms',
          level: 2,
          description: 'You can transform into beasts with a challenge rating as high as 1.',
          type: 'subclass_feature',
          subclass: 'Circle of the Moon'
        }
      ]
    }
  ],

  monk: [
    {
      id: 'monk-open-hand',
      name: 'Way of the Open Hand',
      description: 'Monks of the Way of the Open Hand are masters of unarmed combat.',
      features: [
        {
          name: 'Open Hand Technique',
          level: 3,
          description: 'You can manipulate your enemy\'s ki when you harness your own.',
          type: 'subclass_feature',
          subclass: 'Way of the Open Hand'
        }
      ]
    },
    {
      id: 'monk-shadow',
      name: 'Way of Shadow',
      description: 'Monks of the Way of Shadow practice stealth and deception.',
      features: [
        {
          name: 'Shadow Arts',
          level: 3,
          description: 'You can use your ki to duplicate the effects of certain spells.',
          type: 'subclass_feature',
          subclass: 'Way of Shadow'
        }
      ]
    }
  ],

  sorcerer: [
    {
      id: 'sorcerer-draconic',
      name: 'Draconic Bloodline',
      description: 'Your innate magic comes from draconic magic that was mingled with your blood.',
      features: [
        {
          name: 'Dragon Ancestor',
          level: 1,
          description: 'You choose one type of dragon as your ancestor.',
          type: 'subclass_feature',
          subclass: 'Draconic Bloodline'
        },
        {
          name: 'Draconic Resilience',
          level: 1,
          description: 'Your hit point maximum increases by 1, and it increases by 1 again whenever you gain a level.',
          type: 'subclass_feature',
          subclass: 'Draconic Bloodline'
        }
      ]
    },
    {
      id: 'sorcerer-wild',
      name: 'Wild Magic',
      description: 'Your innate magic comes from the wild forces of chaos.',
      features: [
        {
          name: 'Wild Magic Surge',
          level: 1,
          description: 'Your spellcasting can unleash surges of untamed magic.',
          type: 'subclass_feature',
          subclass: 'Wild Magic'
        },
        {
          name: 'Tides of Chaos',
          level: 1,
          description: 'You can manipulate the forces of chance to gain advantage on one attack roll, ability check, or saving throw.',
          type: 'subclass_feature',
          subclass: 'Wild Magic'
        }
      ]
    }
  ],

  warlock: [
    {
      id: 'warlock-fiend',
      name: 'The Fiend',
      description: 'You have made a pact with a fiend from the lower planes.',
      features: [
        {
          name: 'Dark One\'s Blessing',
          level: 1,
          description: 'When you reduce a hostile creature to 0 hit points, you gain temporary hit points.',
          type: 'subclass_feature',
          subclass: 'The Fiend'
        }
      ]
    },
    {
      id: 'warlock-archfey',
      name: 'The Archfey',
      description: 'Your patron is a lord or lady of the fey.',
      features: [
        {
          name: 'Fey Presence',
          level: 1,
          description: 'You can cause each creature in a 10-foot cube to make a Wisdom saving throw or be charmed or frightened.',
          type: 'subclass_feature',
          subclass: 'The Archfey'
        }
      ]
    },
    {
      id: 'warlock-great-old-one',
      name: 'The Great Old One',
      description: 'Your patron is a mysterious entity from the Far Realm.',
      features: [
        {
          name: 'Awakened Mind',
          level: 1,
          description: 'You can communicate telepathically with any creature you can see within 30 feet.',
          type: 'subclass_feature',
          subclass: 'The Great Old One'
        }
      ]
    }
  ]
};

// Helper function to get subclasses for a specific class
export function getSubclasses(className: string): Subclass[] {
  const classKey = className.toLowerCase();
  return SUBCLASSES[classKey] || [];
}

// Helper function to get a specific subclass by ID
export function getSubclass(subclassId: string): Subclass | undefined {
  for (const subclassList of Object.values(SUBCLASSES)) {
    const subclass = subclassList.find(s => s.id === subclassId);
    if (subclass) return subclass;
  }
  return undefined;
}
