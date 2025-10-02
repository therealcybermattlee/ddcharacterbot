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
    },
    {
      id: 'fighter-eldritch-knight',
      name: 'Eldritch Knight',
      description: 'Eldritch Knights combine martial prowess with arcane magic.',
      features: [
        {
          name: 'Spellcasting',
          level: 3,
          description: 'You learn to cast spells from the wizard spell list.',
          type: 'subclass_feature',
          subclass: 'Eldritch Knight'
        },
        {
          name: 'Weapon Bond',
          level: 3,
          description: 'You can bond with up to two weapons and summon them as a bonus action.',
          type: 'subclass_feature',
          subclass: 'Eldritch Knight'
        }
      ]
    },
    {
      id: 'fighter-arcane-archer',
      name: 'Arcane Archer',
      description: 'Arcane Archers imbue their arrows with magical effects.',
      features: [
        {
          name: 'Arcane Shot',
          level: 3,
          description: 'You learn to unleash special magical effects with your arrows.',
          type: 'subclass_feature',
          subclass: 'Arcane Archer'
        },
        {
          name: 'Magic Arrow',
          level: 7,
          description: 'Your arrows count as magical for overcoming resistance.',
          type: 'subclass_feature',
          subclass: 'Arcane Archer'
        }
      ]
    },
    {
      id: 'fighter-cavalier',
      name: 'Cavalier',
      description: 'Cavaliers are expert mounted combatants and defenders.',
      features: [
        {
          name: 'Born to the Saddle',
          level: 3,
          description: 'You have advantage on saving throws to avoid falling off your mount.',
          type: 'subclass_feature',
          subclass: 'Cavalier'
        },
        {
          name: 'Unwavering Mark',
          level: 3,
          description: 'You excel at foiling attacks and protecting allies.',
          type: 'subclass_feature',
          subclass: 'Cavalier'
        }
      ]
    },
    {
      id: 'fighter-samurai',
      name: 'Samurai',
      description: 'Samurai are disciplined warriors who channel their fighting spirit.',
      features: [
        {
          name: 'Fighting Spirit',
          level: 3,
          description: 'You can give yourself advantage on weapon attacks and gain temporary hit points.',
          type: 'subclass_feature',
          subclass: 'Samurai'
        },
        {
          name: 'Elegant Courtier',
          level: 7,
          description: 'You gain proficiency in Wisdom saving throws and add your Wisdom modifier to Charisma checks.',
          type: 'subclass_feature',
          subclass: 'Samurai'
        }
      ]
    },
    {
      id: 'fighter-psi-warrior',
      name: 'Psi Warrior',
      description: 'Psi Warriors use psionic energy to augment their combat abilities.',
      features: [
        {
          name: 'Psionic Power',
          level: 3,
          description: 'You harbor a wellspring of psionic energy within yourself.',
          type: 'subclass_feature',
          subclass: 'Psi Warrior'
        },
        {
          name: 'Telekinetic Adept',
          level: 7,
          description: 'You can use your psionic energy to move objects and creatures.',
          type: 'subclass_feature',
          subclass: 'Psi Warrior'
        }
      ]
    },
    {
      id: 'fighter-rune-knight',
      name: 'Rune Knight',
      description: 'Rune Knights use ancient giant runes to enhance their martial abilities.',
      features: [
        {
          name: 'Rune Carver',
          level: 3,
          description: 'You learn to inscribe runes on your equipment that grant magical benefits.',
          type: 'subclass_feature',
          subclass: 'Rune Knight'
        },
        {
          name: 'Giant\'s Might',
          level: 3,
          description: 'You can grow larger using giant magic.',
          type: 'subclass_feature',
          subclass: 'Rune Knight'
        }
      ]
    },
    {
      id: 'fighter-echo-knight',
      name: 'Echo Knight',
      description: 'Echo Knights manifest echoes of themselves from alternate timelines.',
      features: [
        {
          name: 'Manifest Echo',
          level: 3,
          description: 'You can summon an echo of yourself from an unrealized timeline.',
          type: 'subclass_feature',
          subclass: 'Echo Knight'
        },
        {
          name: 'Unleash Incarnation',
          level: 3,
          description: 'You can make additional attacks from your echo\'s position.',
          type: 'subclass_feature',
          subclass: 'Echo Knight'
        }
      ]
    },
    {
      id: 'fighter-purple-dragon-knight',
      name: 'Purple Dragon Knight',
      description: 'Purple Dragon Knights inspire and heal their allies in battle.',
      features: [
        {
          name: 'Rallying Cry',
          level: 3,
          description: 'When you use Second Wind, allies regain hit points.',
          type: 'subclass_feature',
          subclass: 'Purple Dragon Knight'
        },
        {
          name: 'Royal Envoy',
          level: 7,
          description: 'You gain proficiency in Persuasion and expertise if already proficient.',
          type: 'subclass_feature',
          subclass: 'Purple Dragon Knight'
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
    },
    {
      id: 'wizard-conjuration',
      name: 'School of Conjuration',
      description: 'Conjurers summon creatures and objects from thin air.',
      features: [
        {
          name: 'Conjuration Savant',
          level: 2,
          description: 'The gold and time you must spend to copy a conjuration spell into your spellbook is halved.',
          type: 'subclass_feature',
          subclass: 'School of Conjuration'
        },
        {
          name: 'Minor Conjuration',
          level: 2,
          description: 'You can conjure inanimate objects.',
          type: 'subclass_feature',
          subclass: 'School of Conjuration'
        }
      ]
    },
    {
      id: 'wizard-divination',
      name: 'School of Divination',
      description: 'Diviners peer into the future and uncover hidden truths.',
      features: [
        {
          name: 'Divination Savant',
          level: 2,
          description: 'The gold and time you must spend to copy a divination spell into your spellbook is halved.',
          type: 'subclass_feature',
          subclass: 'School of Divination'
        },
        {
          name: 'Portent',
          level: 2,
          description: 'You can replace any attack roll, saving throw, or ability check with one of your portent rolls.',
          type: 'subclass_feature',
          subclass: 'School of Divination'
        }
      ]
    },
    {
      id: 'wizard-enchantment',
      name: 'School of Enchantment',
      description: 'Enchanters control and charm the minds of others.',
      features: [
        {
          name: 'Enchantment Savant',
          level: 2,
          description: 'The gold and time you must spend to copy an enchantment spell into your spellbook is halved.',
          type: 'subclass_feature',
          subclass: 'School of Enchantment'
        },
        {
          name: 'Hypnotic Gaze',
          level: 2,
          description: 'You can hypnotize a creature you can see within 5 feet.',
          type: 'subclass_feature',
          subclass: 'School of Enchantment'
        }
      ]
    },
    {
      id: 'wizard-illusion',
      name: 'School of Illusion',
      description: 'Illusionists create and manipulate false realities.',
      features: [
        {
          name: 'Illusion Savant',
          level: 2,
          description: 'The gold and time you must spend to copy an illusion spell into your spellbook is halved.',
          type: 'subclass_feature',
          subclass: 'School of Illusion'
        },
        {
          name: 'Improved Minor Illusion',
          level: 2,
          description: 'You learn the minor illusion cantrip and can create both sound and image with a single casting.',
          type: 'subclass_feature',
          subclass: 'School of Illusion'
        }
      ]
    },
    {
      id: 'wizard-necromancy',
      name: 'School of Necromancy',
      description: 'Necromancers manipulate the forces of life and death.',
      features: [
        {
          name: 'Necromancy Savant',
          level: 2,
          description: 'The gold and time you must spend to copy a necromancy spell into your spellbook is halved.',
          type: 'subclass_feature',
          subclass: 'School of Necromancy'
        },
        {
          name: 'Grim Harvest',
          level: 2,
          description: 'You regain hit points when you kill creatures with spells.',
          type: 'subclass_feature',
          subclass: 'School of Necromancy'
        }
      ]
    },
    {
      id: 'wizard-transmutation',
      name: 'School of Transmutation',
      description: 'Transmuters alter the properties of creatures and objects.',
      features: [
        {
          name: 'Transmutation Savant',
          level: 2,
          description: 'The gold and time you must spend to copy a transmutation spell into your spellbook is halved.',
          type: 'subclass_feature',
          subclass: 'School of Transmutation'
        },
        {
          name: 'Minor Alchemy',
          level: 2,
          description: 'You can temporarily alter the physical properties of one nonmagical object.',
          type: 'subclass_feature',
          subclass: 'School of Transmutation'
        }
      ]
    },
    {
      id: 'wizard-war-magic',
      name: 'War Magic',
      description: 'War Mages blend magic and martial skill for battlefield effectiveness.',
      features: [
        {
          name: 'Arcane Deflection',
          level: 2,
          description: 'You can use your reaction to add +2 to your AC or +4 to a saving throw.',
          type: 'subclass_feature',
          subclass: 'War Magic'
        },
        {
          name: 'Tactical Wit',
          level: 2,
          description: 'You add your Intelligence modifier to your initiative rolls.',
          type: 'subclass_feature',
          subclass: 'War Magic'
        }
      ]
    },
    {
      id: 'wizard-order-of-scribes',
      name: 'Order of Scribes',
      description: 'Scribes have awakened sentient spellbooks and master written magic.',
      features: [
        {
          name: 'Wizardly Quill',
          level: 2,
          description: 'You can magically create a quill that transcribes spells rapidly.',
          type: 'subclass_feature',
          subclass: 'Order of Scribes'
        },
        {
          name: 'Awakened Spellbook',
          level: 2,
          description: 'Your spellbook is sentient and you can change spell damage types.',
          type: 'subclass_feature',
          subclass: 'Order of Scribes'
        }
      ]
    },
    {
      id: 'wizard-bladesinging',
      name: 'Bladesinging',
      description: 'Bladesingers blend swordplay with wizardry in an elegant martial art.',
      features: [
        {
          name: 'Training in War and Song',
          level: 2,
          description: 'You gain proficiency with light armor and one type of one-handed melee weapon.',
          type: 'subclass_feature',
          subclass: 'Bladesinging'
        },
        {
          name: 'Bladesong',
          level: 2,
          description: 'You can invoke an ancient elven magic called the Bladesong.',
          type: 'subclass_feature',
          subclass: 'Bladesinging'
        }
      ]
    },
    {
      id: 'wizard-chronurgy',
      name: 'Chronurgy Magic',
      description: 'Chronurgists manipulate time itself to gain tactical advantages.',
      features: [
        {
          name: 'Chronal Shift',
          level: 2,
          description: 'You can force a creature to reroll an attack, ability check, or saving throw.',
          type: 'subclass_feature',
          subclass: 'Chronurgy Magic'
        },
        {
          name: 'Temporal Awareness',
          level: 2,
          description: 'You add your Intelligence modifier to your initiative rolls.',
          type: 'subclass_feature',
          subclass: 'Chronurgy Magic'
        }
      ]
    },
    {
      id: 'wizard-graviturgy',
      name: 'Graviturgy Magic',
      description: 'Graviturgists manipulate gravity and mass.',
      features: [
        {
          name: 'Adjust Density',
          level: 2,
          description: 'You can manipulate the weight of creatures and objects.',
          type: 'subclass_feature',
          subclass: 'Graviturgy Magic'
        },
        {
          name: 'Gravitational Well',
          level: 6,
          description: 'Your spells can create a gravitational pull.',
          type: 'subclass_feature',
          subclass: 'Graviturgy Magic'
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
