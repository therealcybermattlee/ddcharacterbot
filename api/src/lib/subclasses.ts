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
    },
    {
      id: 'rogue-arcane-trickster',
      name: 'Arcane Trickster',
      description: 'Arcane Tricksters blend rogue skills with enchantment and illusion magic.',
      features: [
        {
          name: 'Spellcasting',
          level: 3,
          description: 'You learn to cast spells from the wizard spell list, focusing on enchantment and illusion.',
          type: 'subclass_feature',
          subclass: 'Arcane Trickster'
        },
        {
          name: 'Mage Hand Legerdemain',
          level: 3,
          description: 'You can use your Mage Hand to pick locks and disarm traps at range.',
          type: 'subclass_feature',
          subclass: 'Arcane Trickster'
        }
      ]
    },
    {
      id: 'rogue-inquisitive',
      name: 'Inquisitive',
      description: 'Inquisitives excel at rooting out secrets and unraveling mysteries.',
      features: [
        {
          name: 'Ear for Deceit',
          level: 3,
          description: 'You develop a talent for picking out lies.',
          type: 'subclass_feature',
          subclass: 'Inquisitive'
        },
        {
          name: 'Eye for Detail',
          level: 3,
          description: 'You can use a bonus action to make a Wisdom (Perception) or Intelligence (Investigation) check.',
          type: 'subclass_feature',
          subclass: 'Inquisitive'
        }
      ]
    },
    {
      id: 'rogue-mastermind',
      name: 'Mastermind',
      description: 'Masterminds focus on people and their influence over them.',
      features: [
        {
          name: 'Master of Intrigue',
          level: 3,
          description: 'You gain proficiency with disguise kit, forgery kit, and one gaming set.',
          type: 'subclass_feature',
          subclass: 'Mastermind'
        },
        {
          name: 'Master of Tactics',
          level: 3,
          description: 'You can use the Help action as a bonus action.',
          type: 'subclass_feature',
          subclass: 'Mastermind'
        }
      ]
    },
    {
      id: 'rogue-scout',
      name: 'Scout',
      description: 'Scouts combine stealth with wilderness survival skills.',
      features: [
        {
          name: 'Skirmisher',
          level: 3,
          description: 'You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet.',
          type: 'subclass_feature',
          subclass: 'Scout'
        },
        {
          name: 'Survivalist',
          level: 3,
          description: 'You gain proficiency in Nature and Survival skills.',
          type: 'subclass_feature',
          subclass: 'Scout'
        }
      ]
    },
    {
      id: 'rogue-swashbuckler',
      name: 'Swashbuckler',
      description: 'Swashbucklers are daring duelists who combine agility with charm.',
      features: [
        {
          name: 'Fancy Footwork',
          level: 3,
          description: 'During your turn, if you make a melee attack, that creature can\'t make opportunity attacks against you.',
          type: 'subclass_feature',
          subclass: 'Swashbuckler'
        },
        {
          name: 'Rakish Audacity',
          level: 3,
          description: 'You add your Charisma modifier to your initiative rolls.',
          type: 'subclass_feature',
          subclass: 'Swashbuckler'
        }
      ]
    },
    {
      id: 'rogue-phantom',
      name: 'Phantom',
      description: 'Phantoms walk the line between life and death.',
      features: [
        {
          name: 'Whispers of the Dead',
          level: 3,
          description: 'You can gain a skill or tool proficiency for a short time from spirits.',
          type: 'subclass_feature',
          subclass: 'Phantom'
        },
        {
          name: 'Wails from the Grave',
          level: 3,
          description: 'When you deal Sneak Attack damage, you can harm another creature within 30 feet.',
          type: 'subclass_feature',
          subclass: 'Phantom'
        }
      ]
    },
    {
      id: 'rogue-soulknife',
      name: 'Soulknife',
      description: 'Soulknives manifest psionic blades and use telekinetic abilities.',
      features: [
        {
          name: 'Psionic Power',
          level: 3,
          description: 'You harbor a wellspring of psionic energy within yourself.',
          type: 'subclass_feature',
          subclass: 'Soulknife'
        },
        {
          name: 'Psychic Blades',
          level: 3,
          description: 'You can manifest psychic blades to make attacks.',
          type: 'subclass_feature',
          subclass: 'Soulknife'
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
    },
    {
      id: 'cleric-knowledge',
      name: 'Knowledge Domain',
      description: 'Knowledge clerics value learning and understanding above all.',
      features: [
        {
          name: 'Blessings of Knowledge',
          level: 1,
          description: 'You gain proficiency in two skills and expertise with them.',
          type: 'subclass_feature',
          subclass: 'Knowledge Domain'
        },
        {
          name: 'Channel Divinity: Knowledge of the Ages',
          level: 2,
          description: 'You can gain proficiency with a skill or tool for 10 minutes.',
          type: 'subclass_feature',
          subclass: 'Knowledge Domain'
        }
      ]
    },
    {
      id: 'cleric-light',
      name: 'Light Domain',
      description: 'Light clerics wield radiant power to burn away darkness.',
      features: [
        {
          name: 'Bonus Cantrip',
          level: 1,
          description: 'You gain the light cantrip.',
          type: 'subclass_feature',
          subclass: 'Light Domain'
        },
        {
          name: 'Warding Flare',
          level: 1,
          description: 'You can impose disadvantage on an attack roll against you.',
          type: 'subclass_feature',
          subclass: 'Light Domain'
        }
      ]
    },
    {
      id: 'cleric-nature',
      name: 'Nature Domain',
      description: 'Nature clerics channel the divine power of the natural world.',
      features: [
        {
          name: 'Acolyte of Nature',
          level: 1,
          description: 'You learn one druid cantrip and gain proficiency in Animal Handling, Nature, or Survival.',
          type: 'subclass_feature',
          subclass: 'Nature Domain'
        },
        {
          name: 'Bonus Proficiency',
          level: 1,
          description: 'You gain proficiency with heavy armor.',
          type: 'subclass_feature',
          subclass: 'Nature Domain'
        }
      ]
    },
    {
      id: 'cleric-tempest',
      name: 'Tempest Domain',
      description: 'Tempest clerics wield the power of storms and thunder.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 1,
          description: 'You gain proficiency with martial weapons and heavy armor.',
          type: 'subclass_feature',
          subclass: 'Tempest Domain'
        },
        {
          name: 'Wrath of the Storm',
          level: 1,
          description: 'You can strike back with divine power when hit by an attack.',
          type: 'subclass_feature',
          subclass: 'Tempest Domain'
        }
      ]
    },
    {
      id: 'cleric-trickery',
      name: 'Trickery Domain',
      description: 'Trickery clerics are masters of illusion and deception.',
      features: [
        {
          name: 'Blessing of the Trickster',
          level: 1,
          description: 'You can give a creature advantage on Dexterity (Stealth) checks.',
          type: 'subclass_feature',
          subclass: 'Trickery Domain'
        },
        {
          name: 'Channel Divinity: Invoke Duplicity',
          level: 2,
          description: 'You can create an illusory duplicate of yourself.',
          type: 'subclass_feature',
          subclass: 'Trickery Domain'
        }
      ]
    },
    {
      id: 'cleric-arcana',
      name: 'Arcana Domain',
      description: 'Arcana clerics study divine magic through the lens of arcane lore.',
      features: [
        {
          name: 'Arcane Initiate',
          level: 1,
          description: 'You gain proficiency in Arcana and learn two wizard cantrips.',
          type: 'subclass_feature',
          subclass: 'Arcana Domain'
        },
        {
          name: 'Channel Divinity: Arcane Abjuration',
          level: 2,
          description: 'You can turn aberrations, celestials, elementals, fey, or fiends.',
          type: 'subclass_feature',
          subclass: 'Arcana Domain'
        }
      ]
    },
    {
      id: 'cleric-forge',
      name: 'Forge Domain',
      description: 'Forge clerics are masters of craftsmanship and fire.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 1,
          description: 'You gain proficiency with heavy armor and smith\'s tools.',
          type: 'subclass_feature',
          subclass: 'Forge Domain'
        },
        {
          name: 'Blessing of the Forge',
          level: 1,
          description: 'You can magically enhance a piece of armor or a weapon.',
          type: 'subclass_feature',
          subclass: 'Forge Domain'
        }
      ]
    },
    {
      id: 'cleric-grave',
      name: 'Grave Domain',
      description: 'Grave clerics walk the line between life and death.',
      features: [
        {
          name: 'Circle of Mortality',
          level: 1,
          description: 'Your healing spells are more potent when healing creatures at 0 hit points.',
          type: 'subclass_feature',
          subclass: 'Grave Domain'
        },
        {
          name: 'Eyes of the Grave',
          level: 1,
          description: 'You can detect the presence of undead.',
          type: 'subclass_feature',
          subclass: 'Grave Domain'
        }
      ]
    },
    {
      id: 'cleric-order',
      name: 'Order Domain',
      description: 'Order clerics represent law, discipline, and devotion to society.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 1,
          description: 'You gain proficiency with heavy armor and either Intimidation or Persuasion.',
          type: 'subclass_feature',
          subclass: 'Order Domain'
        },
        {
          name: 'Voice of Authority',
          level: 1,
          description: 'When you cast a spell on an ally, they can use their reaction to make a weapon attack.',
          type: 'subclass_feature',
          subclass: 'Order Domain'
        }
      ]
    },
    {
      id: 'cleric-peace',
      name: 'Peace Domain',
      description: 'Peace clerics bring harmony and protect those in need.',
      features: [
        {
          name: 'Implement of Peace',
          level: 1,
          description: 'You gain proficiency in Insight, Performance, or Persuasion.',
          type: 'subclass_feature',
          subclass: 'Peace Domain'
        },
        {
          name: 'Emboldening Bond',
          level: 1,
          description: 'You can forge an empowering bond between allies.',
          type: 'subclass_feature',
          subclass: 'Peace Domain'
        }
      ]
    },
    {
      id: 'cleric-twilight',
      name: 'Twilight Domain',
      description: 'Twilight clerics protect against the terrors of the night.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 1,
          description: 'You gain proficiency with martial weapons and heavy armor.',
          type: 'subclass_feature',
          subclass: 'Twilight Domain'
        },
        {
          name: 'Eyes of Night',
          level: 1,
          description: 'You gain darkvision with no maximum range.',
          type: 'subclass_feature',
          subclass: 'Twilight Domain'
        }
      ]
    },
    {
      id: 'cleric-death',
      name: 'Death Domain',
      description: 'Death clerics are devoted to the forces of death and undeath.',
      features: [
        {
          name: 'Bonus Proficiency',
          level: 1,
          description: 'You gain proficiency with martial weapons.',
          type: 'subclass_feature',
          subclass: 'Death Domain'
        },
        {
          name: 'Reaper',
          level: 1,
          description: 'You learn one necromancy cantrip and can target two creatures with it.',
          type: 'subclass_feature',
          subclass: 'Death Domain'
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
    },
    {
      id: 'barbarian-ancestral-guardian',
      name: 'Path of the Ancestral Guardian',
      description: 'Ancestral Guardians call on the spirits of their ancestors to protect their allies.',
      features: [
        {
          name: 'Ancestral Protectors',
          level: 3,
          description: 'Spectral warriors appear when you rage and hinder enemies.',
          type: 'subclass_feature',
          subclass: 'Path of the Ancestral Guardian'
        },
        {
          name: 'Spirit Shield',
          level: 6,
          description: 'Your ancestral spirits can shield your allies from harm.',
          type: 'subclass_feature',
          subclass: 'Path of the Ancestral Guardian'
        }
      ]
    },
    {
      id: 'barbarian-storm-herald',
      name: 'Path of the Storm Herald',
      description: 'Storm Heralds channel primal spirits of nature into devastating auras.',
      features: [
        {
          name: 'Storm Aura',
          level: 3,
          description: 'You emanate a stormy aura while you rage.',
          type: 'subclass_feature',
          subclass: 'Path of the Storm Herald'
        },
        {
          name: 'Storm Soul',
          level: 6,
          description: 'You gain resistance to your chosen storm type.',
          type: 'subclass_feature',
          subclass: 'Path of the Storm Herald'
        }
      ]
    },
    {
      id: 'barbarian-zealot',
      name: 'Path of the Zealot',
      description: 'Zealots are warriors who channel divine fury into their attacks.',
      features: [
        {
          name: 'Divine Fury',
          level: 3,
          description: 'You deal extra radiant or necrotic damage when you rage.',
          type: 'subclass_feature',
          subclass: 'Path of the Zealot'
        },
        {
          name: 'Warrior of the Gods',
          level: 3,
          description: 'Spells that return you to life don\'t require material components.',
          type: 'subclass_feature',
          subclass: 'Path of the Zealot'
        }
      ]
    },
    {
      id: 'barbarian-beast',
      name: 'Path of the Beast',
      description: 'Barbarians of the Beast transform their rage into bestial power.',
      features: [
        {
          name: 'Form of the Beast',
          level: 3,
          description: 'When you rage, you can transform, gaining natural weapons.',
          type: 'subclass_feature',
          subclass: 'Path of the Beast'
        },
        {
          name: 'Bestial Soul',
          level: 6,
          description: 'Your bestial nature grants you enhanced senses and mobility.',
          type: 'subclass_feature',
          subclass: 'Path of the Beast'
        }
      ]
    },
    {
      id: 'barbarian-wild-magic',
      name: 'Path of Wild Magic',
      description: 'Wild Magic Barbarians tap into chaotic magical forces.',
      features: [
        {
          name: 'Magic Awareness',
          level: 3,
          description: 'You can sense the presence of magic around you.',
          type: 'subclass_feature',
          subclass: 'Path of Wild Magic'
        },
        {
          name: 'Wild Surge',
          level: 3,
          description: 'When you rage, roll on the Wild Magic table for random effects.',
          type: 'subclass_feature',
          subclass: 'Path of Wild Magic'
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
    },
    {
      id: 'bard-glamour',
      name: 'College of Glamour',
      description: 'Bards of Glamour wield fey magic to captivate and charm.',
      features: [
        {
          name: 'Mantle of Inspiration',
          level: 3,
          description: 'You can use a bonus action to grant temporary hit points and movement to allies.',
          type: 'subclass_feature',
          subclass: 'College of Glamour'
        },
        {
          name: 'Enthralling Performance',
          level: 3,
          description: 'You can charm creatures with your performance.',
          type: 'subclass_feature',
          subclass: 'College of Glamour'
        }
      ]
    },
    {
      id: 'bard-swords',
      name: 'College of Swords',
      description: 'Bards of Swords are skilled warriors who perform deadly blade flourishes.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 3,
          description: 'You gain proficiency with medium armor and scimitars.',
          type: 'subclass_feature',
          subclass: 'College of Swords'
        },
        {
          name: 'Blade Flourish',
          level: 3,
          description: 'You can perform special flourishes with your weapon attacks.',
          type: 'subclass_feature',
          subclass: 'College of Swords'
        }
      ]
    },
    {
      id: 'bard-whispers',
      name: 'College of Whispers',
      description: 'Bards of Whispers use their knowledge to manipulate and terrify.',
      features: [
        {
          name: 'Psychic Blades',
          level: 3,
          description: 'You can deal extra psychic damage with your weapon attacks.',
          type: 'subclass_feature',
          subclass: 'College of Whispers'
        },
        {
          name: 'Words of Terror',
          level: 3,
          description: 'You can magically frighten a creature.',
          type: 'subclass_feature',
          subclass: 'College of Whispers'
        }
      ]
    },
    {
      id: 'bard-creation',
      name: 'College of Creation',
      description: 'Bards of Creation channel the Song of Creation to manifest objects and creatures.',
      features: [
        {
          name: 'Mote of Potential',
          level: 3,
          description: 'Your Bardic Inspiration creates a mote that can provide additional benefits.',
          type: 'subclass_feature',
          subclass: 'College of Creation'
        },
        {
          name: 'Performance of Creation',
          level: 3,
          description: 'You can create nonmagical objects through your performance.',
          type: 'subclass_feature',
          subclass: 'College of Creation'
        }
      ]
    },
    {
      id: 'bard-eloquence',
      name: 'College of Eloquence',
      description: 'Bards of Eloquence master the art of oratory and persuasion.',
      features: [
        {
          name: 'Silver Tongue',
          level: 3,
          description: 'Your Charisma (Persuasion) and (Deception) checks can\'t be lower than 10.',
          type: 'subclass_feature',
          subclass: 'College of Eloquence'
        },
        {
          name: 'Unsettling Words',
          level: 3,
          description: 'You can expend a Bardic Inspiration to subtract from a creature\'s saving throw.',
          type: 'subclass_feature',
          subclass: 'College of Eloquence'
        }
      ]
    },
    {
      id: 'bard-spirits',
      name: 'College of Spirits',
      description: 'Bards of Spirits call upon the stories of the dead.',
      features: [
        {
          name: 'Guiding Whispers',
          level: 3,
          description: 'You can reach out to spirits for guidance.',
          type: 'subclass_feature',
          subclass: 'College of Spirits'
        },
        {
          name: 'Spiritual Focus',
          level: 3,
          description: 'You can use a spiritual focus to enhance your abilities.',
          type: 'subclass_feature',
          subclass: 'College of Spirits'
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
    },
    {
      id: 'ranger-gloom-stalker',
      name: 'Gloom Stalker',
      description: 'Gloom Stalkers are at home in the darkest places.',
      features: [
        {
          name: 'Dread Ambusher',
          level: 3,
          description: 'You gain a bonus to initiative and can attack as part of the Attack action on your first turn.',
          type: 'subclass_feature',
          subclass: 'Gloom Stalker'
        },
        {
          name: 'Umbral Sight',
          level: 3,
          description: 'You gain darkvision and are invisible to creatures that rely on darkvision.',
          type: 'subclass_feature',
          subclass: 'Gloom Stalker'
        }
      ]
    },
    {
      id: 'ranger-horizon-walker',
      name: 'Horizon Walker',
      description: 'Horizon Walkers guard the world against threats from other planes.',
      features: [
        {
          name: 'Detect Portal',
          level: 3,
          description: 'You can sense the presence of planar portals.',
          type: 'subclass_feature',
          subclass: 'Horizon Walker'
        },
        {
          name: 'Planar Warrior',
          level: 3,
          description: 'You can channel planar energy into your attacks.',
          type: 'subclass_feature',
          subclass: 'Horizon Walker'
        }
      ]
    },
    {
      id: 'ranger-monster-slayer',
      name: 'Monster Slayer',
      description: 'Monster Slayers hunt down creatures of the night and wielders of grim magic.',
      features: [
        {
          name: 'Hunter\'s Sense',
          level: 3,
          description: 'You can discern a creature\'s vulnerabilities.',
          type: 'subclass_feature',
          subclass: 'Monster Slayer'
        },
        {
          name: 'Slayer\'s Prey',
          level: 3,
          description: 'You can focus your ire on one foe.',
          type: 'subclass_feature',
          subclass: 'Monster Slayer'
        }
      ]
    },
    {
      id: 'ranger-fey-wanderer',
      name: 'Fey Wanderer',
      description: 'Fey Wanderers have been touched by the Feywild\'s magic.',
      features: [
        {
          name: 'Dreadful Strikes',
          level: 3,
          description: 'Your attacks can deal extra psychic damage.',
          type: 'subclass_feature',
          subclass: 'Fey Wanderer'
        },
        {
          name: 'Otherworldly Glamour',
          level: 3,
          description: 'Your fey presence makes you more charming.',
          type: 'subclass_feature',
          subclass: 'Fey Wanderer'
        }
      ]
    },
    {
      id: 'ranger-swarmkeeper',
      name: 'Swarmkeeper',
      description: 'Swarmkeepers are accompanied by a swarm of nature spirits.',
      features: [
        {
          name: 'Gathered Swarm',
          level: 3,
          description: 'A swarm of nature spirits aids you in battle.',
          type: 'subclass_feature',
          subclass: 'Swarmkeeper'
        },
        {
          name: 'Swarmkeeper Magic',
          level: 3,
          description: 'You learn additional spells.',
          type: 'subclass_feature',
          subclass: 'Swarmkeeper'
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
    },
    {
      id: 'paladin-ancients',
      name: 'Oath of the Ancients',
      description: 'Paladins who swear the Oath of the Ancients preserve life and light.',
      features: [
        {
          name: 'Nature\'s Wrath',
          level: 3,
          description: 'You can use your Channel Divinity to ensnare foes with spectral vines.',
          type: 'subclass_feature',
          subclass: 'Oath of the Ancients'
        },
        {
          name: 'Turn the Faithless',
          level: 3,
          description: 'You can use your Channel Divinity to turn fey and fiends.',
          type: 'subclass_feature',
          subclass: 'Oath of the Ancients'
        }
      ]
    },
    {
      id: 'paladin-conquest',
      name: 'Oath of Conquest',
      description: 'Paladins who take the Oath of Conquest seek to crush their enemies.',
      features: [
        {
          name: 'Conquering Presence',
          level: 3,
          description: 'You can use your Channel Divinity to frighten nearby creatures.',
          type: 'subclass_feature',
          subclass: 'Oath of Conquest'
        },
        {
          name: 'Guided Strike',
          level: 3,
          description: 'You can use your Channel Divinity to gain +10 to an attack roll.',
          type: 'subclass_feature',
          subclass: 'Oath of Conquest'
        }
      ]
    },
    {
      id: 'paladin-redemption',
      name: 'Oath of Redemption',
      description: 'Paladins who take the Oath of Redemption seek to redeem the wicked.',
      features: [
        {
          name: 'Emissary of Peace',
          level: 3,
          description: 'You can use your Channel Divinity to gain a bonus to Charisma (Persuasion) checks.',
          type: 'subclass_feature',
          subclass: 'Oath of Redemption'
        },
        {
          name: 'Rebuke the Violent',
          level: 3,
          description: 'You can use your Channel Divinity to punish those who use violence.',
          type: 'subclass_feature',
          subclass: 'Oath of Redemption'
        }
      ]
    },
    {
      id: 'paladin-glory',
      name: 'Oath of Glory',
      description: 'Paladins who take the Oath of Glory believe in athletic and heroic excellence.',
      features: [
        {
          name: 'Peerless Athlete',
          level: 3,
          description: 'You can use your Channel Divinity to enhance your athleticism.',
          type: 'subclass_feature',
          subclass: 'Oath of Glory'
        },
        {
          name: 'Inspiring Smite',
          level: 3,
          description: 'When you use Divine Smite, you distribute temporary hit points to allies.',
          type: 'subclass_feature',
          subclass: 'Oath of Glory'
        }
      ]
    },
    {
      id: 'paladin-watchers',
      name: 'Oath of the Watchers',
      description: 'Paladins who swear the Oath of the Watchers guard against extraplanar threats.',
      features: [
        {
          name: 'Watcher\'s Will',
          level: 3,
          description: 'You can use your Channel Divinity to grant allies advantage on Intelligence, Wisdom, and Charisma saving throws.',
          type: 'subclass_feature',
          subclass: 'Oath of the Watchers'
        },
        {
          name: 'Abjure the Extraplanar',
          level: 3,
          description: 'You can use your Channel Divinity to turn aberrations, celestials, elementals, fey, and fiends.',
          type: 'subclass_feature',
          subclass: 'Oath of the Watchers'
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
    },
    {
      id: 'druid-dreams',
      name: 'Circle of Dreams',
      description: 'Druids of Dreams are connected to the Feywild and its dreamlike magic.',
      features: [
        {
          name: 'Balm of the Summer Court',
          level: 2,
          description: 'You can heal and grant temporary hit points to allies.',
          type: 'subclass_feature',
          subclass: 'Circle of Dreams'
        },
        {
          name: 'Hearth of Moonlight and Shadow',
          level: 6,
          description: 'You can create a protective sphere during rests.',
          type: 'subclass_feature',
          subclass: 'Circle of Dreams'
        }
      ]
    },
    {
      id: 'druid-shepherd',
      name: 'Circle of the Shepherd',
      description: 'Druids of the Shepherd guard and commune with the spirits of nature.',
      features: [
        {
          name: 'Speech of the Woods',
          level: 2,
          description: 'You can speak with beasts and they understand you.',
          type: 'subclass_feature',
          subclass: 'Circle of the Shepherd'
        },
        {
          name: 'Spirit Totem',
          level: 2,
          description: 'You can summon spirit totems to aid your allies.',
          type: 'subclass_feature',
          subclass: 'Circle of the Shepherd'
        }
      ]
    },
    {
      id: 'druid-spores',
      name: 'Circle of Spores',
      description: 'Druids of Spores see death and decay as part of the natural cycle.',
      features: [
        {
          name: 'Halo of Spores',
          level: 2,
          description: 'You can deal necrotic damage to creatures within 10 feet.',
          type: 'subclass_feature',
          subclass: 'Circle of Spores'
        },
        {
          name: 'Symbiotic Entity',
          level: 2,
          description: 'You can use Wild Shape to gain temporary hit points and boost your spores.',
          type: 'subclass_feature',
          subclass: 'Circle of Spores'
        }
      ]
    },
    {
      id: 'druid-stars',
      name: 'Circle of Stars',
      description: 'Druids of Stars draw power from starlight and constellations.',
      features: [
        {
          name: 'Star Map',
          level: 2,
          description: 'You create a star map that aids your spellcasting.',
          type: 'subclass_feature',
          subclass: 'Circle of Stars'
        },
        {
          name: 'Starry Form',
          level: 2,
          description: 'You can transform into a constellation form.',
          type: 'subclass_feature',
          subclass: 'Circle of Stars'
        }
      ]
    },
    {
      id: 'druid-wildfire',
      name: 'Circle of Wildfire',
      description: 'Druids of Wildfire see destruction as necessary for renewal.',
      features: [
        {
          name: 'Summon Wildfire Spirit',
          level: 2,
          description: 'You can summon a wildfire spirit to aid you.',
          type: 'subclass_feature',
          subclass: 'Circle of Wildfire'
        },
        {
          name: 'Enhanced Bond',
          level: 6,
          description: 'You can use your wildfire spirit to teleport and heal.',
          type: 'subclass_feature',
          subclass: 'Circle of Wildfire'
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
    },
    {
      id: 'monk-four-elements',
      name: 'Way of the Four Elements',
      description: 'Monks of the Four Elements channel the power of the elements.',
      features: [
        {
          name: 'Disciple of the Elements',
          level: 3,
          description: 'You learn magical disciplines that harness the elements.',
          type: 'subclass_feature',
          subclass: 'Way of the Four Elements'
        },
        {
          name: 'Elemental Attunement',
          level: 3,
          description: 'You can create minor elemental effects.',
          type: 'subclass_feature',
          subclass: 'Way of the Four Elements'
        }
      ]
    },
    {
      id: 'monk-sun-soul',
      name: 'Way of the Sun Soul',
      description: 'Monks of the Sun Soul learn to channel radiant energy.',
      features: [
        {
          name: 'Radiant Sun Bolt',
          level: 3,
          description: 'You can hurl bolts of radiant energy.',
          type: 'subclass_feature',
          subclass: 'Way of the Sun Soul'
        },
        {
          name: 'Searing Arc Strike',
          level: 6,
          description: 'You can channel ki into an arc of radiant fire.',
          type: 'subclass_feature',
          subclass: 'Way of the Sun Soul'
        }
      ]
    },
    {
      id: 'monk-drunken-master',
      name: 'Way of the Drunken Master',
      description: 'Monks of the Drunken Master use unpredictable movements.',
      features: [
        {
          name: 'Drunken Technique',
          level: 3,
          description: 'Your Flurry of Blows grants you additional movement and prevents opportunity attacks.',
          type: 'subclass_feature',
          subclass: 'Way of the Drunken Master'
        },
        {
          name: 'Tipsy Sway',
          level: 6,
          description: 'You can redirect attacks and gain extra mobility.',
          type: 'subclass_feature',
          subclass: 'Way of the Drunken Master'
        }
      ]
    },
    {
      id: 'monk-kensei',
      name: 'Way of the Kensei',
      description: 'Monks of the Kensei train with weapons as extensions of their body.',
      features: [
        {
          name: 'Path of the Kensei',
          level: 3,
          description: 'You gain proficiency with certain weapons and can use them as monk weapons.',
          type: 'subclass_feature',
          subclass: 'Way of the Kensei'
        },
        {
          name: 'Agile Parry',
          level: 3,
          description: 'You can use your monk weapon to deflect attacks.',
          type: 'subclass_feature',
          subclass: 'Way of the Kensei'
        }
      ]
    },
    {
      id: 'monk-mercy',
      name: 'Way of Mercy',
      description: 'Monks of Mercy learn to both heal and harm.',
      features: [
        {
          name: 'Hand of Healing',
          level: 3,
          description: 'You can use your ki to heal creatures.',
          type: 'subclass_feature',
          subclass: 'Way of Mercy'
        },
        {
          name: 'Hand of Harm',
          level: 3,
          description: 'You can use your ki to deal extra necrotic damage.',
          type: 'subclass_feature',
          subclass: 'Way of Mercy'
        }
      ]
    },
    {
      id: 'monk-astral-self',
      name: 'Way of the Astral Self',
      description: 'Monks of the Astral Self manifest their ki as an astral form.',
      features: [
        {
          name: 'Arms of the Astral Self',
          level: 3,
          description: 'You can summon spectral arms to aid you.',
          type: 'subclass_feature',
          subclass: 'Way of the Astral Self'
        },
        {
          name: 'Visage of the Astral Self',
          level: 6,
          description: 'You can summon your astral self\'s visage.',
          type: 'subclass_feature',
          subclass: 'Way of the Astral Self'
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
    },
    {
      id: 'sorcerer-divine-soul',
      name: 'Divine Soul',
      description: 'Your magic comes from a divine source.',
      features: [
        {
          name: 'Divine Magic',
          level: 1,
          description: 'You can learn spells from the cleric spell list.',
          type: 'subclass_feature',
          subclass: 'Divine Soul'
        },
        {
          name: 'Favored by the Gods',
          level: 1,
          description: 'Divine power guards your destiny.',
          type: 'subclass_feature',
          subclass: 'Divine Soul'
        }
      ]
    },
    {
      id: 'sorcerer-shadow',
      name: 'Shadow Magic',
      description: 'Your magic is drawn from the Shadowfell.',
      features: [
        {
          name: 'Eyes of the Dark',
          level: 1,
          description: 'You gain darkvision and can cast darkness.',
          type: 'subclass_feature',
          subclass: 'Shadow Magic'
        },
        {
          name: 'Strength of the Grave',
          level: 1,
          description: 'Your existence is suffused with the energy of death.',
          type: 'subclass_feature',
          subclass: 'Shadow Magic'
        }
      ]
    },
    {
      id: 'sorcerer-storm',
      name: 'Storm Sorcery',
      description: 'Your magic is infused with the power of elemental air.',
      features: [
        {
          name: 'Wind Speaker',
          level: 1,
          description: 'You can speak, read, and write Primordial.',
          type: 'subclass_feature',
          subclass: 'Storm Sorcery'
        },
        {
          name: 'Tempestuous Magic',
          level: 1,
          description: 'You can fly as a bonus action before or after casting a spell.',
          type: 'subclass_feature',
          subclass: 'Storm Sorcery'
        }
      ]
    },
    {
      id: 'sorcerer-aberrant-mind',
      name: 'Aberrant Mind',
      description: 'Your magic comes from an alien influence.',
      features: [
        {
          name: 'Psionic Spells',
          level: 1,
          description: 'You learn additional spells and can cast them psionically.',
          type: 'subclass_feature',
          subclass: 'Aberrant Mind'
        },
        {
          name: 'Telepathic Speech',
          level: 1,
          description: 'You can form a telepathic connection with others.',
          type: 'subclass_feature',
          subclass: 'Aberrant Mind'
        }
      ]
    },
    {
      id: 'sorcerer-clockwork-soul',
      name: 'Clockwork Soul',
      description: 'Your magic comes from the cosmic force of order.',
      features: [
        {
          name: 'Clockwork Magic',
          level: 1,
          description: 'You learn additional spells that represent order.',
          type: 'subclass_feature',
          subclass: 'Clockwork Soul'
        },
        {
          name: 'Restore Balance',
          level: 1,
          description: 'You can nullify advantage or disadvantage.',
          type: 'subclass_feature',
          subclass: 'Clockwork Soul'
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
    },
    {
      id: 'warlock-celestial',
      name: 'The Celestial',
      description: 'Your patron is a powerful being of the Upper Planes.',
      features: [
        {
          name: 'Bonus Cantrips',
          level: 1,
          description: 'You learn the Light and Sacred Flame cantrips.',
          type: 'subclass_feature',
          subclass: 'The Celestial'
        },
        {
          name: 'Healing Light',
          level: 1,
          description: 'You gain the ability to channel celestial energy to heal wounds.',
          type: 'subclass_feature',
          subclass: 'The Celestial'
        }
      ]
    },
    {
      id: 'warlock-hexblade',
      name: 'The Hexblade',
      description: 'You have made your pact with a mysterious entity from the Shadowfell.',
      features: [
        {
          name: 'Hexblade\'s Curse',
          level: 1,
          description: 'You can place a curse on a creature, dealing extra damage to it.',
          type: 'subclass_feature',
          subclass: 'The Hexblade'
        },
        {
          name: 'Hex Warrior',
          level: 1,
          description: 'You gain proficiency with medium armor, shields, and martial weapons.',
          type: 'subclass_feature',
          subclass: 'The Hexblade'
        }
      ]
    },
    {
      id: 'warlock-fathomless',
      name: 'The Fathomless',
      description: 'You have made a pact with a powerful entity of the deep sea.',
      features: [
        {
          name: 'Tentacle of the Deeps',
          level: 1,
          description: 'You can summon a spectral tentacle that strikes at your foes.',
          type: 'subclass_feature',
          subclass: 'The Fathomless'
        },
        {
          name: 'Gift of the Sea',
          level: 1,
          description: 'You gain a swimming speed and can breathe underwater.',
          type: 'subclass_feature',
          subclass: 'The Fathomless'
        }
      ]
    },
    {
      id: 'warlock-genie',
      name: 'The Genie',
      description: 'Your patron is a noble genie who has granted you power.',
      features: [
        {
          name: 'Genie\'s Vessel',
          level: 1,
          description: 'Your patron gifts you a magical vessel that grants you a measure of their power.',
          type: 'subclass_feature',
          subclass: 'The Genie'
        },
        {
          name: 'Genie\'s Wrath',
          level: 1,
          description: 'You can deal extra damage once per turn, with the type determined by your patron.',
          type: 'subclass_feature',
          subclass: 'The Genie'
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
