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
          description: 'You can add half your proficiency bonus to any Strength, Dexterity, or Constitution check you make that doesn\'t already use your proficiency bonus. In addition, when you make a running long jump, the distance you can cover increases by a number of feet equal to your Strength modifier.',
          type: 'subclass_feature',
          subclass: 'Champion'
        },
        {
          name: 'Additional Fighting Style',
          level: 10,
          description: 'You can choose a second option from the Fighting Style class feature.',
          type: 'subclass_feature',
          subclass: 'Champion'
        },
        {
          name: 'Superior Critical',
          level: 15,
          description: 'Your weapon attacks score a critical hit on a roll of 18-20.',
          type: 'subclass_feature',
          subclass: 'Champion'
        },
        {
          name: 'Survivor',
          level: 18,
          description: 'At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left. You don\'t gain this benefit if you have 0 hit points.',
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
          description: 'You learn maneuvers that are fueled by special dice called superiority dice. You have four superiority dice, which are d8s. A superiority die is expended when you use it. You regain all expended superiority dice when you finish a short or long rest. You learn three maneuvers of your choice.',
          type: 'subclass_feature',
          subclass: 'Battle Master'
        },
        {
          name: 'Student of War',
          level: 3,
          description: 'You gain proficiency with one type of artisan\'s tools of your choice.',
          type: 'subclass_feature',
          subclass: 'Battle Master'
        },
        {
          name: 'Know Your Enemy',
          level: 7,
          description: 'If you spend at least 1 minute observing or interacting with another creature outside of combat, you can learn certain information about its capabilities compared to your own. The DM tells you if the creature is your equal, superior, or inferior in regard to two of the following characteristics of your choice: Strength score, Dexterity score, Constitution score, Armor Class, current hit points, total class levels (if any), or fighter class levels (if any).',
          type: 'subclass_feature',
          subclass: 'Battle Master'
        },
        {
          name: 'Improved Combat Superiority',
          level: 10,
          description: 'Your superiority dice turn into d10s. At 18th level, they turn into d12s.',
          type: 'subclass_feature',
          subclass: 'Battle Master'
        },
        {
          name: 'Relentless',
          level: 15,
          description: 'When you roll initiative and have no superiority dice remaining, you regain 1 superiority die.',
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
          description: 'You learn to cast spells from the wizard spell list. You learn two cantrips of your choice from the wizard spell list. You learn an additional wizard cantrip of your choice at 10th level.',
          type: 'subclass_feature',
          subclass: 'Eldritch Knight'
        },
        {
          name: 'Weapon Bond',
          level: 3,
          description: 'You learn a ritual that creates a magical bond between yourself and one weapon. Once bonded, you can\'t be disarmed of that weapon unless you are incapacitated. You can summon that weapon as a bonus action, causing it to teleport instantly to your hand. You can bond with up to two weapons.',
          type: 'subclass_feature',
          subclass: 'Eldritch Knight'
        },
        {
          name: 'War Magic',
          level: 7,
          description: 'When you use your action to cast a cantrip, you can make one weapon attack as a bonus action.',
          type: 'subclass_feature',
          subclass: 'Eldritch Knight'
        },
        {
          name: 'Eldritch Strike',
          level: 10,
          description: 'When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.',
          type: 'subclass_feature',
          subclass: 'Eldritch Knight'
        },
        {
          name: 'Arcane Charge',
          level: 15,
          description: 'When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see. You can teleport before or after the additional action.',
          type: 'subclass_feature',
          subclass: 'Eldritch Knight'
        },
        {
          name: 'Improved War Magic',
          level: 18,
          description: 'When you use your action to cast a spell, you can make one weapon attack as a bonus action.',
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
          name: 'Arcane Archer Lore',
          level: 3,
          description: 'You learn either the Druidcraft or Prestidigitation cantrip, and you gain proficiency in either the Arcana or Nature skill.',
          type: 'subclass_feature',
          subclass: 'Arcane Archer'
        },
        {
          name: 'Arcane Shot',
          level: 3,
          description: 'You learn to unleash special magical effects with your arrows. You learn two Arcane Shot options of your choice. Once per turn when you fire an arrow from a shortbow or longbow as part of the Attack action, you can apply one of your Arcane Shot options to that arrow. You have two uses of this ability and regain all expended uses when you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Arcane Archer'
        },
        {
          name: 'Magic Arrow',
          level: 7,
          description: 'Whenever you fire a nonmagical arrow from a shortbow or longbow, you can make it magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. The magic fades from the arrow immediately after it hits or misses its target.',
          type: 'subclass_feature',
          subclass: 'Arcane Archer'
        },
        {
          name: 'Curving Shot',
          level: 7,
          description: 'When you make an attack roll with a magic arrow and miss, you can use a bonus action to reroll the attack roll against a different target within 60 feet of the original target.',
          type: 'subclass_feature',
          subclass: 'Arcane Archer'
        },
        {
          name: 'Ever-Ready Shot',
          level: 15,
          description: 'Your magical archery is always ready. If you roll initiative and have no uses of Arcane Shot remaining, you regain one use of it.',
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
          name: 'Bonus Proficiency',
          level: 3,
          description: 'You gain proficiency in one of the following skills of your choice: Animal Handling, History, Insight, Performance, or Persuasion. Alternatively, you learn one language of your choice.',
          type: 'subclass_feature',
          subclass: 'Cavalier'
        },
        {
          name: 'Born to the Saddle',
          level: 3,
          description: 'You have advantage on saving throws made to avoid falling off your mount. If you fall off your mount and descend no more than 10 feet, you can land on your feet if you\'re not incapacitated. Mounting or dismounting a creature costs you only 5 feet of movement, rather than half your speed.',
          type: 'subclass_feature',
          subclass: 'Cavalier'
        },
        {
          name: 'Unwavering Mark',
          level: 3,
          description: 'When you hit a creature with a melee weapon attack, you can mark the creature until the end of your next turn. A marked creature has disadvantage on any attack roll that doesn\'t target you. If a marked creature deals damage to anyone other than you, you can make a special melee weapon attack against it on your next turn as a bonus action. You can use this ability a number of times equal to your Strength modifier (minimum of once), and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Cavalier'
        },
        {
          name: 'Warding Maneuver',
          level: 7,
          description: 'When you or a creature you can see within 5 feet of you is hit by an attack, you can use your reaction to add 1d8 to the target\'s AC against that attack. If the attack still hits, the target has resistance against the attack\'s damage. You can use this feature a number of times equal to your Constitution modifier (minimum of once), and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Cavalier'
        },
        {
          name: 'Hold the Line',
          level: 10,
          description: 'Creatures provoke an opportunity attack from you when they move 5 feet or more while within your reach, and if you hit a creature with an opportunity attack, the target\'s speed is reduced to 0 until the end of the current turn.',
          type: 'subclass_feature',
          subclass: 'Cavalier'
        },
        {
          name: 'Ferocious Charger',
          level: 15,
          description: 'If you move at least 10 feet in a straight line right before attacking a creature and you hit it with the attack, that target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + your Strength modifier) or be knocked prone. You can use this feature only once on each of your turns.',
          type: 'subclass_feature',
          subclass: 'Cavalier'
        },
        {
          name: 'Vigilant Defender',
          level: 18,
          description: 'You respond to danger with extraordinary vigilance. In combat, you get a special reaction that you can take once on every creature\'s turn, except your turn. You can use this special reaction only to make an opportunity attack, and you can\'t use it on the same turn that you take your normal reaction.',
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
          name: 'Bonus Proficiency',
          level: 3,
          description: 'You gain proficiency in one of the following skills of your choice: History, Insight, Performance, or Persuasion. Alternatively, you learn one language of your choice.',
          type: 'subclass_feature',
          subclass: 'Samurai'
        },
        {
          name: 'Fighting Spirit',
          level: 3,
          description: 'As a bonus action, you can give yourself advantage on weapon attack rolls until the end of the current turn. When you do so, you also gain 5 temporary hit points. The number of temporary hit points increases when you reach certain levels in this class: to 10 at 10th level and to 15 at 15th level. You can use this feature three times, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Samurai'
        },
        {
          name: 'Elegant Courtier',
          level: 7,
          description: 'You gain proficiency in the Wisdom saving throw. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice). In addition, you add your Wisdom modifier to any Charisma (Persuasion) checks you make.',
          type: 'subclass_feature',
          subclass: 'Samurai'
        },
        {
          name: 'Tireless Spirit',
          level: 10,
          description: 'When you roll initiative and have no uses of Fighting Spirit remaining, you regain one use.',
          type: 'subclass_feature',
          subclass: 'Samurai'
        },
        {
          name: 'Rapid Strike',
          level: 15,
          description: 'If you take the Attack action on your turn and have advantage on an attack roll against one of the targets, you can forgo the advantage for that roll to make an additional weapon attack against that target, as part of the same action. You can do so no more than once per turn.',
          type: 'subclass_feature',
          subclass: 'Samurai'
        },
        {
          name: 'Strength Before Death',
          level: 18,
          description: 'If you take damage that reduces you to 0 hit points but doesn\'t kill you outright, you can use your reaction to delay falling unconscious, and you can immediately take an extra turn. While you have 0 hit points, taking damage causes death saving throw failures as normal, and three death saving throw failures can still kill you. When the extra turn ends, you fall unconscious if you still have 0 hit points. Once you use this feature, you can\'t use it again until you finish a long rest.',
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
          description: 'You harbor a wellspring of psionic energy within yourself. This energy is represented by your Psionic Energy dice, which are d6s. You have a number of these dice equal to twice your proficiency bonus. You can use these dice to fuel various psionic powers: Protective Field (reduce damage), Psionic Strike (add force damage), or Telekinetic Movement (move objects or creatures). You regain all expended Psionic Energy dice when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Psi Warrior'
        },
        {
          name: 'Telekinetic Adept',
          level: 7,
          description: 'You have mastered new ways to use your psionic energy. You can cast the Telekinesis spell, requiring no components, and your spellcasting ability is Intelligence. On each of your turns while you concentrate on this spell, including the turn when you cast it, you can make one weapon attack as a bonus action. Once you cast this spell, you can\'t do so again until you finish a long rest, unless you expend a Psionic Energy die to cast it again.',
          type: 'subclass_feature',
          subclass: 'Psi Warrior'
        },
        {
          name: 'Psi-Powered Leap',
          level: 7,
          description: 'As a bonus action, you can propel your body with your mind. You gain a flying speed equal to twice your walking speed until the end of the current turn. Once you take this bonus action, you can\'t do so again until you finish a short or long rest, unless you expend a Psionic Energy die to take it again.',
          type: 'subclass_feature',
          subclass: 'Psi Warrior'
        },
        {
          name: 'Guarded Mind',
          level: 10,
          description: 'The psionic energy flowing through you has bolstered your mind. You have resistance to psychic damage. Moreover, if you start your turn charmed or frightened, you can expend a Psionic Energy die and end every effect on yourself subjecting you to those conditions.',
          type: 'subclass_feature',
          subclass: 'Psi Warrior'
        },
        {
          name: 'Bulwark of Force',
          level: 15,
          description: 'You can shield yourself and others with telekinetic force. As a bonus action, you can choose creatures, which can include you, that you can see within 30 feet of you, up to a number of creatures equal to your Intelligence modifier (minimum of one creature). Each of the chosen creatures is protected by half cover for 1 minute or until you\'re incapacitated. Once you take this bonus action, you can\'t do so again until you finish a long rest, unless you expend a Psionic Energy die to take it again.',
          type: 'subclass_feature',
          subclass: 'Psi Warrior'
        },
        {
          name: 'Telekinetic Master',
          level: 18,
          description: 'Your ability to move creatures and objects with your mind is matched by few. You can cast the Telekinesis spell, requiring no components, and your spellcasting ability for the spell is Intelligence. On each of your turns while you concentrate on the spell, including the turn when you cast it, you can make one attack with a weapon as a bonus action. Once you cast the spell with this feature, you can\'t do so again until you finish a long rest, unless you expend a Psionic Energy die to cast it again.',
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
          name: 'Bonus Proficiencies',
          level: 3,
          description: 'You gain proficiency with smith\'s tools, and you learn to speak, read, and write Giant.',
          type: 'subclass_feature',
          subclass: 'Rune Knight'
        },
        {
          name: 'Rune Carver',
          level: 3,
          description: 'You learn to inscribe runes on your equipment that grant magical benefits. You learn two runes of your choice from the rune options presented below, and you learn an additional rune at 7th, 10th, and 15th level. Whenever you gain a level in this class, you can replace one rune you know with a different one.',
          type: 'subclass_feature',
          subclass: 'Rune Knight'
        },
        {
          name: 'Giant\'s Might',
          level: 3,
          description: 'As a bonus action, you magically gain the following benefits for 1 minute: you become Large if you are smaller, you have advantage on Strength checks and Strength saving throws, and once on each of your turns, one of your attacks with a weapon or unarmed strike can deal an extra 1d6 damage to a target on a hit. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Rune Knight'
        },
        {
          name: 'Runic Shield',
          level: 7,
          description: 'When another creature you can see within 60 feet of you is hit by an attack roll, you can use your reaction to force the attacker to reroll the d20 and use the new roll. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Rune Knight'
        },
        {
          name: 'Great Stature',
          level: 10,
          description: 'The magic of your runes permanently alters you. When you gain this feature, you grow 3d4 inches in height, and the extra damage from your Giant\'s Might feature increases to 1d8.',
          type: 'subclass_feature',
          subclass: 'Rune Knight'
        },
        {
          name: 'Master of Runes',
          level: 15,
          description: 'You can invoke each rune you know from your Rune Carver feature twice, rather than once, and you regain all expended uses when you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Rune Knight'
        },
        {
          name: 'Runic Juggernaut',
          level: 18,
          description: 'You learn how to amplify your rune-powered transformation. As a result, the extra damage from your Giant\'s Might feature increases to 1d10. Moreover, when you use that feature, your size can increase to Huge, and while you are that size, your reach increases by 5 feet.',
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
          description: 'You can use a bonus action to magically manifest an echo of yourself in an unoccupied space you can see within 15 feet of you. The echo is a magical, translucent, gray image of you that lasts until it is destroyed, until you dismiss it, or until you manifest another echo. Your echo has AC 14 + your proficiency bonus, 1 hit point, and immunity to all conditions. When you take the Attack action, you can make any attack from the echo\'s position. You can make opportunity attacks from the echo\'s position.',
          type: 'subclass_feature',
          subclass: 'Echo Knight'
        },
        {
          name: 'Unleash Incarnation',
          level: 3,
          description: 'You can heighten your echo\'s fury. Whenever you take the Attack action, you can make one additional melee attack from the echo\'s position. You can use this feature a number of times equal to your Constitution modifier (minimum of once). You regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Echo Knight'
        },
        {
          name: 'Echo Avatar',
          level: 7,
          description: 'You can temporarily transfer your consciousness to your echo. As an action, you can see through your echo\'s eyes and hear through its ears. During this time, you are deafened and blinded. You can sustain this effect for up to 10 minutes, and you can end it at any time (no action required). While your echo is being used this way, it can be up to 1,000 feet away from you without being destroyed.',
          type: 'subclass_feature',
          subclass: 'Echo Knight'
        },
        {
          name: 'Shadow Martyr',
          level: 10,
          description: 'You can make your echo throw itself in front of an attack directed at another creature. Before the attack roll is made, you can use your reaction to teleport the echo to an unoccupied space within 5 feet of the targeted creature. The attack roll that triggered the reaction is instead made against your echo. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Echo Knight'
        },
        {
          name: 'Reclaim Potential',
          level: 15,
          description: 'When your echo is destroyed by taking damage, you can gain a number of temporary hit points equal to 2d6 + your Constitution modifier, provided you don\'t already have temporary hit points. You can use this feature a number of times equal to your Constitution modifier (minimum of once). You regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Echo Knight'
        },
        {
          name: 'Legion of One',
          level: 18,
          description: 'You can create two echoes with your Manifest Echo feature, and these echoes can coexist. If you try to create a third echo, the previous two echoes are destroyed. Anything you can do from one echo\'s position can be done from the other\'s instead. In addition, when you roll initiative and have no uses of your Unleash Incarnation feature left, you regain one use of that feature.',
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
          description: 'When you use your Second Wind feature, you can choose up to three creatures within 60 feet of you that are allied with you. Each one regains hit points equal to your fighter level, provided that the creature can see or hear you.',
          type: 'subclass_feature',
          subclass: 'Purple Dragon Knight'
        },
        {
          name: 'Royal Envoy',
          level: 7,
          description: 'You gain proficiency in the Persuasion skill. If you are already proficient in it, you gain proficiency in one of the following skills of your choice: Animal Handling, Insight, Intimidation, or Performance. Your proficiency bonus is doubled for any ability check you make that uses Persuasion. You receive this benefit regardless of the skill proficiency you gain from this feature.',
          type: 'subclass_feature',
          subclass: 'Purple Dragon Knight'
        },
        {
          name: 'Inspiring Surge',
          level: 10,
          description: 'When you use your Action Surge feature, you can choose one creature within 60 feet of you that is allied with you. That creature can make one melee or ranged weapon attack with its reaction, provided that it can see or hear you. Starting at 18th level, you can choose two allies within 60 feet of you, rather than one.',
          type: 'subclass_feature',
          subclass: 'Purple Dragon Knight'
        },
        {
          name: 'Bulwark',
          level: 15,
          description: 'You can extend the benefit of your Indomitable feature to an ally. When you decide to use Indomitable to reroll an Intelligence, a Wisdom, or a Charisma saving throw and you aren\'t incapacitated, you can choose one ally within 60 feet of you that also failed its saving throw against the same effect. If that creature can see or hear you, it can reroll its saving throw and must use the new roll.',
          type: 'subclass_feature',
          subclass: 'Purple Dragon Knight'
        }
      ]
    },
    {
      id: 'fighter-brute',
      name: 'Brute (UA)',
      description: '[UA] A simple and straightforward fighter focused on raw physical power and durability.',
      features: [
        {
          name: 'Brute Force',
          level: 3,
          description: 'You deal additional damage with weapon attacks. Whenever you hit with a weapon that you\'re proficient with and deal damage, the weapon\'s damage increases by an amount based on your level in this class: 1d4 at 3rd level, 1d6 at 10th level, and 1d8 at 16th level.',
          type: 'subclass_feature',
          subclass: 'Brute (UA)'
        },
        {
          name: 'Brutish Durability',
          level: 7,
          description: 'Your toughness allows you to shrug off assaults that would devastate others. Whenever you make a saving throw, roll 1d6 and add the die to your saving throw total. If applying this bonus to a death saving throw increases the total to 20 or higher, you gain the benefits of rolling a 20 on the d20.',
          type: 'subclass_feature',
          subclass: 'Brute (UA)'
        },
        {
          name: 'Additional Fighting Style',
          level: 10,
          description: 'You can choose a second option from the Fighting Style class feature.',
          type: 'subclass_feature',
          subclass: 'Brute (UA)'
        },
        {
          name: 'Devastating Critical',
          level: 15,
          description: 'When you score a critical hit with a weapon attack, you gain a bonus to that weapon\'s damage roll equal to your level in this class.',
          type: 'subclass_feature',
          subclass: 'Brute (UA)'
        },
        {
          name: 'Survivor',
          level: 18,
          description: 'At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half of your hit points left. You don\'t gain this benefit if you have 0 hit points.',
          type: 'subclass_feature',
          subclass: 'Brute (UA)'
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
          description: 'When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell\'s level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.',
          type: 'subclass_feature',
          subclass: 'School of Evocation'
        },
        {
          name: 'Potent Cantrip',
          level: 6,
          description: 'When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip\'s damage (if any) but suffers no additional effect from the cantrip.',
          type: 'subclass_feature',
          subclass: 'School of Evocation'
        },
        {
          name: 'Empowered Evocation',
          level: 10,
          description: 'You can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.',
          type: 'subclass_feature',
          subclass: 'School of Evocation'
        },
        {
          name: 'Overchannel',
          level: 14,
          description: 'When you cast a wizard spell of 1st through 5th level that deals damage, you can deal maximum damage with that spell. The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity.',
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
    },
    {
      id: 'wizard-lore-mastery',
      name: 'Lore Mastery (UA)',
      description: '[UA] Masters of arcane lore who can manipulate the fundamental properties of spells.',
      features: [
        {
          name: 'Lore Master',
          level: 2,
          description: 'You can change the damage type of spells and alter saving throws.',
          type: 'subclass_feature',
          subclass: 'Lore Mastery (UA)'
        },
        {
          name: 'Spell Secrets',
          level: 6,
          description: 'You can increase spell save DC or attack bonus.',
          type: 'subclass_feature',
          subclass: 'Lore Mastery (UA)'
        }
      ]
    },
    {
      id: 'wizard-onomancy',
      name: 'Onomancy (UA)',
      description: '[UA] Practitioners of naming magic who wield power through true names.',
      features: [
        {
          name: 'True Names',
          level: 2,
          description: 'You learn the true names of creatures to gain power over them.',
          type: 'subclass_feature',
          subclass: 'Onomancy (UA)'
        },
        {
          name: 'Resonant Utterance',
          level: 6,
          description: 'You can speak a creature\'s true name to enhance your spells.',
          type: 'subclass_feature',
          subclass: 'Onomancy (UA)'
        }
      ]
    },
    {
      id: 'wizard-theurgy',
      name: 'Theurgy (UA)',
      description: '[UA] Wizards who blend arcane and divine magic, gaining access to cleric domains.',
      features: [
        {
          name: 'Divine Inspiration',
          level: 2,
          description: 'You choose a cleric domain and gain access to its spells.',
          type: 'subclass_feature',
          subclass: 'Theurgy (UA)'
        },
        {
          name: 'Channel Arcana',
          level: 2,
          description: 'You can channel divine energy like a cleric.',
          type: 'subclass_feature',
          subclass: 'Theurgy (UA)'
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
        },
        {
          name: 'Supreme Sneak',
          level: 9,
          description: 'You have advantage on Dexterity (Stealth) checks if you move no more than half your speed on the same turn.',
          type: 'subclass_feature',
          subclass: 'Thief'
        },
        {
          name: 'Use Magic Device',
          level: 13,
          description: 'You can ignore all class, race, and level requirements on the use of magic items.',
          type: 'subclass_feature',
          subclass: 'Thief'
        },
        {
          name: 'Thief\'s Reflexes',
          level: 17,
          description: 'You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10.',
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
          description: 'You have advantage on attack rolls against any creature that hasn\'t taken a turn in the combat yet. In addition, any hit you score against a creature that is surprised is a critical hit.',
          type: 'subclass_feature',
          subclass: 'Assassin'
        },
        {
          name: 'Infiltration Expertise',
          level: 9,
          description: 'You can unfailingly create false identities for yourself. You must spend seven days and 25 gp to establish the history, profession, and affiliations for an identity. You can\'t establish an identity that belongs to someone else.',
          type: 'subclass_feature',
          subclass: 'Assassin'
        },
        {
          name: 'Impostor',
          level: 13,
          description: 'You gain the ability to unerringly mimic another person\'s speech, writing, and behavior. You must spend at least three hours studying these three components of the person\'s behavior, listening to speech, examining handwriting, and observing mannerisms.',
          type: 'subclass_feature',
          subclass: 'Assassin'
        },
        {
          name: 'Death Strike',
          level: 17,
          description: 'You become a master of instant death. When you attack and hit a creature that is surprised, it must make a Constitution saving throw (DC 8 + your Dexterity modifier + your proficiency bonus). On a failed save, double the damage of your attack against the creature.',
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
          description: 'You learn to cast spells from the wizard spell list, focusing on enchantment and illusion. You learn three cantrips: Mage Hand and two other cantrips of your choice from the wizard spell list. You learn additional wizard spells of your choice at higher levels.',
          type: 'subclass_feature',
          subclass: 'Arcane Trickster'
        },
        {
          name: 'Mage Hand Legerdemain',
          level: 3,
          description: 'When you cast Mage Hand, you can make the spectral hand invisible, and you can perform the following additional tasks with it: you can stow one object the hand is holding in a container worn or carried by another creature, retrieve an object in a container worn or carried by another creature, or use thieves\' tools to pick locks and disarm traps at range.',
          type: 'subclass_feature',
          subclass: 'Arcane Trickster'
        },
        {
          name: 'Magical Ambush',
          level: 9,
          description: 'If you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw it makes against the spell this turn.',
          type: 'subclass_feature',
          subclass: 'Arcane Trickster'
        },
        {
          name: 'Versatile Trickster',
          level: 13,
          description: 'You gain the ability to distract targets with your Mage Hand. As a bonus action on your turn, you can designate a creature within 5 feet of the spectral hand created by the spell. Doing so gives you advantage on attack rolls against that creature until the end of the turn.',
          type: 'subclass_feature',
          subclass: 'Arcane Trickster'
        },
        {
          name: 'Spell Thief',
          level: 17,
          description: 'You gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster. Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can use your reaction to force the creature to make a saving throw with its spellcasting ability modifier. On a failed save, you negate the spell\'s effect against you, and you steal the knowledge of the spell if it is at least 1st level and of a level you can cast. For the next 8 hours, you know the spell and can cast it using your spell slots. The creature can\'t cast that spell until the 8 hours have passed. Once you use this feature, you can\'t use it again until you finish a long rest.',
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
          description: 'You develop a keen ear for picking out lies. Whenever you make a Wisdom (Insight) check to determine whether a creature is lying, treat a roll of 7 or lower on the d20 as an 8.',
          type: 'subclass_feature',
          subclass: 'Inquisitive'
        },
        {
          name: 'Eye for Detail',
          level: 3,
          description: 'You can use a bonus action to make a Wisdom (Perception) check to spot a hidden creature or object or to make an Intelligence (Investigation) check to uncover or decipher clues.',
          type: 'subclass_feature',
          subclass: 'Inquisitive'
        },
        {
          name: 'Insightful Fighting',
          level: 3,
          description: 'As a bonus action, you can make a Wisdom (Insight) check against a creature you can see that isn\'t incapacitated, contested by the target\'s Charisma (Deception) check. If you succeed, you can use your Sneak Attack against that target even if you don\'t have advantage on the attack roll, but not if you have disadvantage on it. This benefit lasts for 1 minute or until you successfully use this feature against a different target.',
          type: 'subclass_feature',
          subclass: 'Inquisitive'
        },
        {
          name: 'Steady Eye',
          level: 9,
          description: 'You have advantage on any Wisdom (Perception) or Intelligence (Investigation) check if you move no more than half your speed on the same turn.',
          type: 'subclass_feature',
          subclass: 'Inquisitive'
        },
        {
          name: 'Unerring Eye',
          level: 13,
          description: 'Your senses are almost impossible to foil. As an action, you sense the presence of illusions, shapechangers not in their original form, and other magic designed to deceive the senses within 30 feet of you, provided you aren\'t blinded or deafened. You sense that an effect is attempting to trick you, but you gain no insight into what is hidden or into its true nature. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Inquisitive'
        },
        {
          name: 'Eye for Weakness',
          level: 17,
          description: 'You learn to exploit a creature\'s weaknesses by carefully studying its tactics and movement. While your Insightful Fighting feature applies to a creature, your Sneak Attack damage against that creature increases by 3d6.',
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
          description: 'You gain proficiency with the disguise kit, the forgery kit, and one gaming set of your choice. You also learn two languages of your choice. Additionally, you can unerringly mimic the speech patterns and accent of a creature that you hear speak for at least 1 minute, enabling you to pass yourself off as a native speaker of a particular land, provided that you know the language.',
          type: 'subclass_feature',
          subclass: 'Mastermind'
        },
        {
          name: 'Master of Tactics',
          level: 3,
          description: 'You can use the Help action as a bonus action. Additionally, when you use the Help action to aid an ally in attacking a creature, the target of that attack can be within 30 feet of you, rather than within 5 feet of you, if the target can see or hear you.',
          type: 'subclass_feature',
          subclass: 'Mastermind'
        },
        {
          name: 'Insightful Manipulator',
          level: 9,
          description: 'If you spend at least 1 minute observing or interacting with another creature outside combat, you can learn certain information about its capabilities compared to your own. The DM tells you if the creature is your equal, superior, or inferior in regard to two of the following characteristics of your choice: Intelligence score, Wisdom score, Charisma score, or class levels (if any).',
          type: 'subclass_feature',
          subclass: 'Mastermind'
        },
        {
          name: 'Misdirection',
          level: 13,
          description: 'You can sometimes cause another creature to suffer an attack meant for you. When you are targeted by an attack while a creature within 5 feet of you is granting you cover against that attack, you can use your reaction to have the attack target that creature instead of you.',
          type: 'subclass_feature',
          subclass: 'Mastermind'
        },
        {
          name: 'Soul of Deceit',
          level: 17,
          description: 'Your thoughts can\'t be read by telepathy or other means, unless you allow it. You can present false thoughts by succeeding on a Charisma (Deception) check contested by the mind reader\'s Wisdom (Insight) check. Additionally, no matter what you say, magic that would determine if you are telling the truth indicates you are being truthful if you so choose, and you can\'t be compelled to tell the truth by magic.',
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
          description: 'You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn\'t provoke opportunity attacks.',
          type: 'subclass_feature',
          subclass: 'Scout'
        },
        {
          name: 'Survivalist',
          level: 3,
          description: 'You gain proficiency in the Nature and Survival skills if you don\'t already have it. Your proficiency bonus is doubled for any ability check you make that uses either of those proficiencies.',
          type: 'subclass_feature',
          subclass: 'Scout'
        },
        {
          name: 'Superior Mobility',
          level: 9,
          description: 'Your walking speed increases by 10 feet. If you have a climbing or swimming speed, this increase applies to that speed as well.',
          type: 'subclass_feature',
          subclass: 'Scout'
        },
        {
          name: 'Ambush Master',
          level: 13,
          description: 'You excel at leading ambushes and acting first in a fight. You have advantage on initiative rolls. In addition, the first creature you hit during the first round of a combat becomes easier for you and others to strike; attack rolls against that target have advantage until the start of your next turn.',
          type: 'subclass_feature',
          subclass: 'Scout'
        },
        {
          name: 'Sudden Strike',
          level: 17,
          description: 'You can strike with deadly speed. If you take the Attack action on your turn, you can make one additional attack as a bonus action. This attack can benefit from your Sneak Attack even if you have already used it this turn, but you can\'t use your Sneak Attack against the same target more than once in a turn.',
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
          description: 'During your turn, if you make a melee attack against a creature, that creature can\'t make opportunity attacks against you for the rest of your turn.',
          type: 'subclass_feature',
          subclass: 'Swashbuckler'
        },
        {
          name: 'Rakish Audacity',
          level: 3,
          description: 'You add your Charisma modifier to your initiative rolls. In addition, you don\'t need advantage on your attack roll to use your Sneak Attack if no creature other than your target is within 5 feet of you. All the other rules for the Sneak Attack class feature still apply to you.',
          type: 'subclass_feature',
          subclass: 'Swashbuckler'
        },
        {
          name: 'Panache',
          level: 9,
          description: 'You can make a Charisma (Persuasion) check contested by a creature\'s Wisdom (Insight) check. If you succeed and the creature is hostile, it has disadvantage on attack rolls against targets other than you and can\'t make opportunity attacks against targets other than you. If you succeed and the creature isn\'t hostile, it is charmed by you for 1 minute.',
          type: 'subclass_feature',
          subclass: 'Swashbuckler'
        },
        {
          name: 'Elegant Maneuver',
          level: 13,
          description: 'You can use a bonus action on your turn to gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check you make during the same turn.',
          type: 'subclass_feature',
          subclass: 'Swashbuckler'
        },
        {
          name: 'Master Duelist',
          level: 17,
          description: 'If you miss with an attack roll, you can roll it again with advantage. Once you do so, you can\'t use this feature again until you finish a short or long rest.',
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
          description: 'Echoes of those who have died cling to you. Whenever you finish a short or long rest, you can gain one skill or tool proficiency of your choice, as a ghostly presence shares its knowledge with you. You lose this proficiency when you use this feature to choose a different proficiency that you lack.',
          type: 'subclass_feature',
          subclass: 'Phantom'
        },
        {
          name: 'Wails from the Grave',
          level: 3,
          description: 'As you nudge someone closer to the grave, you can channel the power of death to harm someone else as well. Immediately after you deal your Sneak Attack damage to a creature on your turn, you can target a second creature that you can see within 30 feet of the first creature. Roll half the number of Sneak Attack dice for your level (round up), and the second creature takes necrotic damage equal to the roll\'s total, as wails of the dead sound around them for a moment. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Phantom'
        },
        {
          name: 'Tokens of the Departed',
          level: 9,
          description: 'When a life ends in your presence, you\'re able to snatch a token from the departing soul, a sliver of its life essence that takes physical form: as a reaction when a creature you can see dies within 30 feet of you, you can open your free hand and cause a Tiny trinket to appear there, a soul trinket. You can have a maximum number of soul trinkets equal to your proficiency bonus, and you can\'t create one while at your maximum. You can use soul trinkets in the following ways: While a soul trinket is on your person, you have advantage on death saving throws and Constitution saving throws. When you deal Sneak Attack damage on your turn, you can destroy one of your soul trinkets that\'s on your person and then immediately use Wails from the Grave, without expending a use of that feature. As an action, you can destroy one of your soul trinkets, no matter where it\'s located. When you do so, you can ask the spirit associated with the trinket one question. The spirit appears to you and answers in a language it knew in life.',
          type: 'subclass_feature',
          subclass: 'Phantom'
        },
        {
          name: 'Ghost Walk',
          level: 13,
          description: 'You can phase partially into the realm of the dead, becoming like a ghost. As a bonus action, you assume a spectral form. While in this form, you have a flying speed of 10 feet, you can hover, and attack rolls have disadvantage against you. You can also move through creatures and objects as if they were difficult terrain, but you take 1d10 force damage if you end your turn inside a creature or an object. You stay in this form for 10 minutes or until you end it as a bonus action. To use this feature again, you must finish a long rest or destroy one of your soul trinkets as part of the bonus action you use to activate Ghost Walk.',
          type: 'subclass_feature',
          subclass: 'Phantom'
        },
        {
          name: 'Death\'s Friend',
          level: 17,
          description: 'Your association with death has become so close that you gain the following benefits: When you use your Wails from the Grave, you can deal the necrotic damage to both the first and the second creature. You can use Wails from the Grave unlimited times without expending uses of the feature.',
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
          description: 'You harbor a wellspring of psionic energy within yourself. This energy is represented by your Psionic Energy dice, which are each a d6. You have a number of these dice equal to twice your proficiency bonus, and they fuel various psionic powers you have, which are detailed below. Some of your powers expend the Psionic Energy die they use, and you regain all your expended Psionic Energy dice when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Soulknife'
        },
        {
          name: 'Psychic Blades',
          level: 3,
          description: 'You can manifest your psionic power as shimmering blades of psychic energy. Whenever you take the Attack action, you can manifest a psychic blade from your free hand and make the attack with that blade. This magic blade is a simple melee weapon with the finesse and thrown properties. It has a normal range of 60 feet and no long range, and on a hit, it deals psychic damage equal to 1d6 plus the ability modifier you used for the attack roll. The blade vanishes immediately after it hits or misses its target, and it leaves no mark on its target if it deals damage. After you attack with the blade, you can make a melee or ranged weapon attack with a second psychic blade as a bonus action on the same turn, provided your other hand is free to create it. The damage die of this bonus attack is 1d4, instead of 1d6.',
          type: 'subclass_feature',
          subclass: 'Soulknife'
        },
        {
          name: 'Soul Blades',
          level: 9,
          description: 'Your Psychic Blades are now an expression of your psi-suffused soul, giving you these powers that use your Psionic Energy dice: Homing Strikes - If you make an attack roll with your Psychic Blades and miss the target, you can roll one Psionic Energy die and add the number rolled to the attack roll. If this causes the attack to hit, you expend the Psionic Energy die. Psychic Teleportation - As a bonus action, you manifest one of your Psychic Blades, expend one Psionic Energy die and roll it, and throw the blade at an unoccupied space you can see, up to a number of feet away equal to 10 times the number rolled. You then teleport to that space, and the blade vanishes.',
          type: 'subclass_feature',
          subclass: 'Soulknife'
        },
        {
          name: 'Psychic Veil',
          level: 13,
          description: 'You can weave a veil of psychic static to mask yourself. As an action, you can magically become invisible, along with anything you are wearing or carrying, for 1 hour or until you dismiss this effect (no action required). This invisibility ends early immediately after you deal damage to a creature or you force a creature to make a saving throw. Once you use this feature, you can\'t do so again until you finish a long rest, unless you expend a Psionic Energy die to use this feature again.',
          type: 'subclass_feature',
          subclass: 'Soulknife'
        },
        {
          name: 'Rend Mind',
          level: 17,
          description: 'You can sweep your Psychic Blade directly through a creature\'s mind. When you use your Psychic Blades to deal Sneak Attack damage to a creature, you can force that target to make a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Dexterity modifier). If the save fails, the target is stunned for 1 minute. The stunned target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Once you use this feature, you can\'t do so again until you finish a long rest, unless you expend three Psionic Energy dice to use it again.',
          type: 'subclass_feature',
          subclass: 'Soulknife'
        }
      ]
    },
    {
      id: 'rogue-revived',
      name: 'The Revived (UA)',
      description: '[UA] Rogues who have experienced death and returned with undead-like traits.',
      features: [
        {
          name: 'Tokens of Past Lives',
          level: 3,
          description: 'You remember talents from your past lives. When you finish a long rest, you gain one skill or tool proficiency of your choice. You can replace this proficiency with another when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'The Revived (UA)'
        },
        {
          name: 'Revived Nature',
          level: 3,
          description: 'Your brush with death has altered you. You have advantage on saving throws against disease and being poisoned, and you have resistance to poison damage. You don\'t need to eat, drink, or breathe. You don\'t need to sleep, and magic can\'t put you to sleep. You can finish a long rest in 4 hours if you spend those hours in an inactive, motionless state, during which you retain consciousness.',
          type: 'subclass_feature',
          subclass: 'The Revived (UA)'
        },
        {
          name: 'Bolts from the Grave',
          level: 9,
          description: 'You can channel your life force into deadly ethereal bolts. Immediately after you use your Cunning Action, you can make a ranged spell attack against a creature within 30 feet of you, provided you haven\'t used your Sneak Attack this turn. You are proficient with it, and you add your Dexterity modifier to its attack and damage rolls. A hit deals necrotic damage equal to your Sneak Attack. If you hit, you can\'t use your Sneak Attack this turn, unless you use it with a different attack. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'The Revived (UA)'
        },
        {
          name: 'Connect with the Dead',
          level: 13,
          description: 'You can create a link with a spirit through their corpse. When you do so, you cast Speak with Dead without using a spell slot and without material components. The corpse you target doesn\'t need to have a mouth and isn\'t under the 10-day limit of the spell. Intelligence is your spellcasting ability for this spell. Using this feature doesn\'t prevent a corpse from being the target of the spell again. When you use this feature, you can also ask the spirit to possess you, provided the spirit is willing. When you do so, you gain the ability to speak and understand a language the spirit knew in life. This benefit lasts for 1 hour or until you end it as a bonus action. Once you use this feature, you must finish a short or long rest before you can use it again.',
          type: 'subclass_feature',
          subclass: 'The Revived (UA)'
        },
        {
          name: 'Audience with Death',
          level: 17,
          description: 'You have an audience with death itself when you are dying. Whenever you are reduced to 0 hit points but not killed outright, you can choose to have a vision from the realm of death. You see visions of events from your past, future, or the present. The DM chooses the nature of the vision. After the vision, you regain hit points equal to half your hit point maximum, and you stand up if you so choose. Once you use this feature, you can\'t use it again until you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'The Revived (UA)'
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
          description: 'Your healing spells are more effective. Whenever you use a spell of 1st level or higher to restore hit points to a creature, the creature regains additional hit points equal to 2 + the spell\'s level.',
          type: 'subclass_feature',
          subclass: 'Life Domain'
        },
        {
          name: 'Channel Divinity: Preserve Life',
          level: 2,
          description: 'As an action, you present your holy symbol and evoke healing energy that can restore a number of hit points equal to five times your cleric level. Choose any creatures within 30 feet of you, and divide those hit points among them. This feature can restore a creature to no more than half of its hit point maximum.',
          type: 'subclass_feature',
          subclass: 'Life Domain'
        },
        {
          name: 'Blessed Healer',
          level: 6,
          description: 'The healing spells you cast on others heal you as well. When you cast a spell of 1st level or higher that restores hit points to a creature other than you, you regain hit points equal to 2 + the spell\'s level.',
          type: 'subclass_feature',
          subclass: 'Life Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'Life Domain'
        },
        {
          name: 'Supreme Healing',
          level: 17,
          description: 'When you would normally roll one or more dice to restore hit points with a spell, you instead use the highest number possible for each die. For example, instead of restoring 2d6 hit points to a creature, you restore 12.',
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
          description: 'When you use the Attack action, you can make one weapon attack as a bonus action. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'War Domain'
        },
        {
          name: 'Channel Divinity: Guided Strike',
          level: 2,
          description: 'When you make an attack roll, you can use your Channel Divinity to gain a +10 bonus to the roll. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.',
          type: 'subclass_feature',
          subclass: 'War Domain'
        },
        {
          name: 'Channel Divinity: War God\'s Blessing',
          level: 6,
          description: 'When a creature within 30 feet of you makes an attack roll, you can use your reaction to grant that creature a +10 bonus to the roll, using your Channel Divinity. You make this choice after you see the roll, but before the DM says whether the attack hits or misses.',
          type: 'subclass_feature',
          subclass: 'War Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 damage of the same type dealt by the weapon to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'War Domain'
        },
        {
          name: 'Avatar of Battle',
          level: 17,
          description: 'You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.',
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
          description: 'You learn two languages of your choice. You also become proficient in your choice of two of the following skills: Arcana, History, Nature, or Religion. Your proficiency bonus is doubled for any ability check you make that uses either of those skills.',
          type: 'subclass_feature',
          subclass: 'Knowledge Domain'
        },
        {
          name: 'Channel Divinity: Knowledge of the Ages',
          level: 2,
          description: 'You can use your Channel Divinity to tap into a divine well of knowledge. As an action, you choose one skill or tool. For 10 minutes, you have proficiency with the chosen skill or tool.',
          type: 'subclass_feature',
          subclass: 'Knowledge Domain'
        },
        {
          name: 'Channel Divinity: Read Thoughts',
          level: 6,
          description: 'You can use your Channel Divinity to read a creature\'s thoughts. You can then use your access to the creature\'s mind to command it. As an action, choose one creature that you can see within 60 feet of you. That creature must make a Wisdom saving throw. If the creature succeeds on the saving throw, you can\'t use this feature on it again until you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Knowledge Domain'
        },
        {
          name: 'Potent Spellcasting',
          level: 8,
          description: 'You add your Wisdom modifier to the damage you deal with any cleric cantrip.',
          type: 'subclass_feature',
          subclass: 'Knowledge Domain'
        },
        {
          name: 'Visions of the Past',
          level: 17,
          description: 'You can call up visions of the past that relate to an object you hold or your immediate surroundings. You spend at least 1 minute in meditation and prayer, then receive dreamlike, shadowy visions of recent events. You can meditate in this way for a number of minutes equal to your Wisdom score and must maintain concentration during that time, as if you were casting a spell.',
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
          description: 'You gain the light cantrip if you don\'t already know it.',
          type: 'subclass_feature',
          subclass: 'Light Domain'
        },
        {
          name: 'Warding Flare',
          level: 1,
          description: 'When you are attacked by a creature within 30 feet of you that you can see, you can use your reaction to impose disadvantage on the attack roll, causing light to flare before the attacker before it hits or misses. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Light Domain'
        },
        {
          name: 'Channel Divinity: Radiance of the Dawn',
          level: 2,
          description: 'You can use your Channel Divinity to harness sunlight, banishing darkness and dealing radiant damage to your foes. As an action, you present your holy symbol, and any magical darkness within 30 feet of you is dispelled. Additionally, each hostile creature within 30 feet of you must make a Constitution saving throw. A creature takes radiant damage equal to 2d10 + your cleric level on a failed saving throw, and half as much damage on a successful one.',
          type: 'subclass_feature',
          subclass: 'Light Domain'
        },
        {
          name: 'Improved Flare',
          level: 6,
          description: 'You can also use your Warding Flare feature when a creature that you can see within 30 feet of you attacks a creature other than you.',
          type: 'subclass_feature',
          subclass: 'Light Domain'
        },
        {
          name: 'Potent Spellcasting',
          level: 8,
          description: 'You add your Wisdom modifier to the damage you deal with any cleric cantrip.',
          type: 'subclass_feature',
          subclass: 'Light Domain'
        },
        {
          name: 'Corona of Light',
          level: 17,
          description: 'You can use your action to activate an aura of sunlight that lasts for 1 minute or until you dismiss it using another action. You emit bright light in a 60-foot radius and dim light 30 feet beyond that. Your enemies in the bright light have disadvantage on saving throws against any spell that deals fire or radiant damage.',
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
          description: 'You learn one druid cantrip of your choice. You also gain proficiency in one of the following skills of your choice: Animal Handling, Nature, or Survival.',
          type: 'subclass_feature',
          subclass: 'Nature Domain'
        },
        {
          name: 'Bonus Proficiency',
          level: 1,
          description: 'You gain proficiency with heavy armor.',
          type: 'subclass_feature',
          subclass: 'Nature Domain'
        },
        {
          name: 'Channel Divinity: Charm Animals and Plants',
          level: 2,
          description: 'You can use your Channel Divinity to charm animals and plants. As an action, you present your holy symbol and invoke the name of your deity. Each beast or plant creature that can see you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is charmed by you for 1 minute or until it takes damage.',
          type: 'subclass_feature',
          subclass: 'Nature Domain'
        },
        {
          name: 'Dampen Elements',
          level: 6,
          description: 'When you or a creature within 30 feet of you takes acid, cold, fire, lightning, or thunder damage, you can use your reaction to grant resistance to the creature against that instance of the damage.',
          type: 'subclass_feature',
          subclass: 'Nature Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 cold, fire, or lightning damage (your choice) to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'Nature Domain'
        },
        {
          name: 'Master of Nature',
          level: 17,
          description: 'You gain the ability to command animals and plant creatures. While creatures are charmed by your Charm Animals and Plants feature, you can take a bonus action on your turn to verbally command what each of those creatures will do on its next turn.',
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
          description: 'When a creature within 5 feet of you that you can see hits you with an attack, you can use your reaction to cause the creature to make a Dexterity saving throw. The creature takes 2d8 lightning or thunder damage (your choice) on a failed saving throw, and half as much damage on a successful one. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Tempest Domain'
        },
        {
          name: 'Channel Divinity: Destructive Wrath',
          level: 2,
          description: 'You can use your Channel Divinity to wield the power of the storm with unchecked ferocity. When you roll lightning or thunder damage, you can use your Channel Divinity to deal maximum damage, instead of rolling.',
          type: 'subclass_feature',
          subclass: 'Tempest Domain'
        },
        {
          name: 'Thunderbolt Strike',
          level: 6,
          description: 'When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.',
          type: 'subclass_feature',
          subclass: 'Tempest Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 thunder damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'Tempest Domain'
        },
        {
          name: 'Stormborn',
          level: 17,
          description: 'You have a flying speed equal to your current walking speed whenever you are not underground or indoors.',
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
          description: 'You can use your action to touch a willing creature other than yourself to give it advantage on Dexterity (Stealth) checks. This blessing lasts for 1 hour or until you use this feature again.',
          type: 'subclass_feature',
          subclass: 'Trickery Domain'
        },
        {
          name: 'Channel Divinity: Invoke Duplicity',
          level: 2,
          description: 'You can use your Channel Divinity to create an illusory duplicate of yourself. As an action, you create a perfect illusion of yourself that lasts for 1 minute, or until you lose your concentration. The illusion appears in an unoccupied space that you can see within 30 feet of you. You can use your action to move this illusion up to twice your speed and make it gesture, speak, and behave in whatever way you choose.',
          type: 'subclass_feature',
          subclass: 'Trickery Domain'
        },
        {
          name: 'Channel Divinity: Cloak of Shadows',
          level: 6,
          description: 'You can use your Channel Divinity to vanish. As an action, you become invisible until the end of your next turn. You become visible if you attack or cast a spell.',
          type: 'subclass_feature',
          subclass: 'Trickery Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with poison. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 poison damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'Trickery Domain'
        },
        {
          name: 'Improved Duplicity',
          level: 17,
          description: 'You can create up to four duplicates of yourself, instead of one, when you use Invoke Duplicity. As a bonus action on your turn, you can move any number of them up to 30 feet, to a maximum range of 120 feet.',
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
          description: 'You gain proficiency in the Arcana skill, and you gain two cantrips of your choice from the wizard spell list. For you, these cantrips count as cleric cantrips.',
          type: 'subclass_feature',
          subclass: 'Arcana Domain'
        },
        {
          name: 'Channel Divinity: Arcane Abjuration',
          level: 2,
          description: 'As an action, you present your holy symbol, and one celestial, elemental, fey, or fiend of your choice that is within 30 feet of you must make a Wisdom saving throw, provided that the creature can see or hear you. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.',
          type: 'subclass_feature',
          subclass: 'Arcana Domain'
        },
        {
          name: 'Spell Breaker',
          level: 6,
          description: 'When you restore hit points to an ally with a spell of 1st level or higher, you can also end one spell of your choice on that creature. The level of the spell you end must be equal to or lower than the level of the spell slot you use to cast the healing spell.',
          type: 'subclass_feature',
          subclass: 'Arcana Domain'
        },
        {
          name: 'Potent Spellcasting',
          level: 8,
          description: 'You add your Wisdom modifier to the damage you deal with any cleric cantrip.',
          type: 'subclass_feature',
          subclass: 'Arcana Domain'
        },
        {
          name: 'Arcane Mastery',
          level: 17,
          description: 'You choose four spells from the wizard spell list, one from each of the following levels: 6th, 7th, 8th, and 9th. You add them to your list of domain spells. Like your other domain spells, they are always prepared and count as cleric spells for you.',
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
          description: 'At the end of a long rest, you can touch one nonmagical object that is a suit of armor or a simple or martial weapon. Until the end of your next long rest or until you die, the object becomes a magic item, granting a +1 bonus to AC if it\'s armor or a +1 bonus to attack and damage rolls if it\'s a weapon.',
          type: 'subclass_feature',
          subclass: 'Forge Domain'
        },
        {
          name: 'Channel Divinity: Artisan\'s Blessing',
          level: 2,
          description: 'You can use your Channel Divinity to create simple items. You conduct an hour-long ritual that crafts a nonmagical item that must include some metal: a simple or martial weapon, a suit of armor, ten pieces of ammunition, a set of tools, or another metal object. The creation is completed at the end of the hour, coalescing in an unoccupied space of your choice on a surface within 5 feet of you.',
          type: 'subclass_feature',
          subclass: 'Forge Domain'
        },
        {
          name: 'Soul of the Forge',
          level: 6,
          description: 'Your mastery of the forge grants you special abilities. You gain resistance to fire damage. While wearing heavy armor, you gain a +1 bonus to AC.',
          type: 'subclass_feature',
          subclass: 'Forge Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with the fiery power of the forge. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 fire damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'Forge Domain'
        },
        {
          name: 'Saint of Forge and Fire',
          level: 17,
          description: 'Your blessed affinity with fire and metal becomes more powerful. You gain immunity to fire damage. While wearing heavy armor, you have resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.',
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
          description: 'You gain the ability to manipulate the line between life and death. When you would normally roll one or more dice to restore hit points with a spell to a creature at 0 hit points, you instead use the highest number possible for each die. In addition, you learn the spare the dying cantrip, which doesn\'t count against the number of cleric cantrips you know. For you, it has a range of 30 feet, and you can cast it as a bonus action.',
          type: 'subclass_feature',
          subclass: 'Grave Domain'
        },
        {
          name: 'Eyes of the Grave',
          level: 1,
          description: 'You gain the ability to occasionally sense the presence of the undead, whose existence is an insult to the natural cycle of life. As an action, you can open your awareness to magically detect undead. Until the end of your next turn, you know the location of any undead within 60 feet of you that isn\'t behind total cover and that isn\'t protected from divination magic. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Grave Domain'
        },
        {
          name: 'Channel Divinity: Path to the Grave',
          level: 2,
          description: 'You can use your Channel Divinity to mark another creature\'s life force for termination. As an action, you choose one creature you can see within 30 feet of you, cursing it until the end of your next turn. The next time you or an ally of yours hits the cursed creature with an attack, the creature has vulnerability to all of that attack\'s damage, and then the curse ends.',
          type: 'subclass_feature',
          subclass: 'Grave Domain'
        },
        {
          name: 'Sentinel at Death\'s Door',
          level: 6,
          description: 'You gain the ability to impede death\'s progress. As a reaction when you or a creature you can see within 30 feet of you suffers a critical hit, you can turn that hit into a normal hit. Any effects triggered by a critical hit are canceled. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Grave Domain'
        },
        {
          name: 'Potent Spellcasting',
          level: 8,
          description: 'You add your Wisdom modifier to the damage you deal with any cleric cantrip.',
          type: 'subclass_feature',
          subclass: 'Grave Domain'
        },
        {
          name: 'Keeper of Souls',
          level: 17,
          description: 'You can seize a trace of vitality from a parting soul and use it to heal the living. When an enemy you can see dies within 60 feet of you, you or one creature of your choice that is within 60 feet of you regains hit points equal to the enemy\'s number of Hit Dice. You can use this feature only if you aren\'t incapacitated. Once you use it, you can\'t do so again until the start of your next turn.',
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
          description: 'You gain proficiency with heavy armor. You also gain proficiency in the Intimidation or Persuasion skill (your choice).',
          type: 'subclass_feature',
          subclass: 'Order Domain'
        },
        {
          name: 'Voice of Authority',
          level: 1,
          description: 'If you cast a spell with a spell slot of 1st level or higher and target an ally with the spell, that ally can use their reaction immediately after the spell to make one weapon attack against a creature of your choice that you can see.',
          type: 'subclass_feature',
          subclass: 'Order Domain'
        },
        {
          name: 'Channel Divinity: Order\'s Demand',
          level: 2,
          description: 'You can use your Channel Divinity to exert an intimidating presence over others. As an action, you present your holy symbol, and each creature of your choice that can see or hear you within 30 feet of you must succeed on a Wisdom saving throw or be charmed by you until the end of your next turn or until the charmed creature takes any damage. You can also cause any of the charmed creatures to drop what they are holding when they fail the saving throw.',
          type: 'subclass_feature',
          subclass: 'Order Domain'
        },
        {
          name: 'Embodiment of the Law',
          level: 6,
          description: 'You become remarkably adept at channeling magical energy to compel others. If you cast an enchantment spell of 1st level or higher, you can change the spell\'s casting time to 1 bonus action for this casting, provided the spell\'s casting time is normally 1 action. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Order Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 psychic damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'Order Domain'
        },
        {
          name: 'Order\'s Wrath',
          level: 17,
          description: 'Enemies you designate for destruction wilt under the combined efforts of you and your allies. If you deal your Divine Strike damage to a creature on your turn, you can curse that creature until the start of your next turn. The next time one of your allies hits the cursed creature with an attack, the target also takes 2d8 psychic damage, and the curse ends. You can curse a creature in this way only once per turn.',
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
          description: 'You gain proficiency in the Insight, Performance, or Persuasion skill (your choice).',
          type: 'subclass_feature',
          subclass: 'Peace Domain'
        },
        {
          name: 'Emboldening Bond',
          level: 1,
          description: 'You can forge an empowering bond among people who are at peace with one another. As an action, you choose a number of willing creatures within 30 feet of you (this can include yourself) equal to your proficiency bonus. You create a magical bond among them for 10 minutes or until you use this feature again. While any bonded creature is within 30 feet of another, the creature can roll a d4 and add the number rolled to an attack roll, an ability check, or a saving throw it makes. Each creature can add the d4 no more than once per turn. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Peace Domain'
        },
        {
          name: 'Channel Divinity: Balm of Peace',
          level: 2,
          description: 'You can use your Channel Divinity to make your very presence a soothing balm. As an action, you can move up to your speed, without provoking opportunity attacks, and when you move within 5 feet of any other creature during this action, you can restore a number of hit points to that creature equal to 2d6 + your Wisdom modifier (minimum of 1 hit point). A creature can receive this healing only once whenever you take this action.',
          type: 'subclass_feature',
          subclass: 'Peace Domain'
        },
        {
          name: 'Protective Bond',
          level: 6,
          description: 'The bond you forge between people helps them protect each other. When a creature affected by your Emboldening Bond feature is about to take damage, a second bonded creature within 30 feet of the first can use its reaction to teleport to an unoccupied space within 5 feet of the first creature. The second creature then takes all the damage instead.',
          type: 'subclass_feature',
          subclass: 'Peace Domain'
        },
        {
          name: 'Potent Spellcasting',
          level: 8,
          description: 'You add your Wisdom modifier to the damage you deal with any cleric cantrip.',
          type: 'subclass_feature',
          subclass: 'Peace Domain'
        },
        {
          name: 'Expansive Bond',
          level: 17,
          description: 'The benefits of your Emboldening Bond and Protective Bond features now work when the creatures are within 60 feet of each other. Moreover, when a creature uses Protective Bond to take someone else\'s damage, the creature has resistance to that damage.',
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
          description: 'You can see through the deepest gloom. You have darkvision out to a range of 300 feet. In that radius, you can see in dim light as if it were bright light and in darkness as if it were dim light. As an action, you can magically share the darkvision of this feature with willing creatures you can see within 10 feet of you, up to a number of creatures equal to your Wisdom modifier (minimum of one creature). The shared darkvision lasts for 1 hour. Once you share it, you can\'t do so again until you finish a long rest, unless you expend a spell slot of any level to share it again.',
          type: 'subclass_feature',
          subclass: 'Twilight Domain'
        },
        {
          name: 'Vigilant Blessing',
          level: 1,
          description: 'The night has taught you to be vigilant. As an action, you give one creature you touch (including possibly yourself) advantage on the next initiative roll the creature makes. This benefit ends immediately after the roll or if you use this feature again.',
          type: 'subclass_feature',
          subclass: 'Twilight Domain'
        },
        {
          name: 'Channel Divinity: Twilight Sanctuary',
          level: 2,
          description: 'You can use your Channel Divinity to refresh your allies with soothing twilight. As an action, you present your holy symbol, and a sphere of twilight emanates from you. The sphere is centered on you, has a 30-foot radius, and is filled with dim light. The sphere moves with you, and it lasts for 1 minute or until you are incapacitated or die. Whenever a creature (including you) ends its turn in the sphere, you can grant that creature one of these benefits: You grant it temporary hit points equal to 1d6 plus your cleric level, or you end one effect on it causing it to be charmed or frightened.',
          type: 'subclass_feature',
          subclass: 'Twilight Domain'
        },
        {
          name: 'Steps of Night',
          level: 6,
          description: 'You can draw on the mystical power of night to rise into the air. As a bonus action when you are in dim light or darkness, you can magically give yourself a flying speed equal to your walking speed for 1 minute. You can use this bonus action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Twilight Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 radiant damage. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'Twilight Domain'
        },
        {
          name: 'Twilight Shroud',
          level: 17,
          description: 'The twilight that you summon offers a protective embrace: you and your allies have half cover while in the sphere created by your Twilight Sanctuary.',
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
          description: 'You learn one necromancy cantrip of your choice from any spell list. When you cast a necromancy cantrip that normally targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other.',
          type: 'subclass_feature',
          subclass: 'Death Domain'
        },
        {
          name: 'Channel Divinity: Touch of Death',
          level: 2,
          description: 'You can use Channel Divinity to destroy another creature\'s life force by touch. When you hit a creature with a melee attack, you can use Channel Divinity to deal extra necrotic damage to the target. The damage equals 5 + twice your cleric level.',
          type: 'subclass_feature',
          subclass: 'Death Domain'
        },
        {
          name: 'Inescapable Destruction',
          level: 6,
          description: 'Your ability to channel negative energy becomes more potent. Necrotic damage dealt by your cleric spells and Channel Divinity options ignores resistance to necrotic damage.',
          type: 'subclass_feature',
          subclass: 'Death Domain'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with necrotic energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 necrotic damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'Death Domain'
        },
        {
          name: 'Improved Reaper',
          level: 17,
          description: 'When you cast a necromancy spell of 1st through 5th level that targets only one creature, the spell can instead target two creatures within range and within 5 feet of each other. If the spell consumes its material components, you must provide them for each target.',
          type: 'subclass_feature',
          subclass: 'Death Domain'
        }
      ]
    },
    {
      id: 'cleric-city',
      name: 'City Domain (UA)',
      description: '[UA] Clerics who channel the power of civilization and urban environments.',
      features: [
        {
          name: 'Heart of the City',
          level: 1,
          description: 'You gain proficiency with martial weapons and heavy armor. Additionally, you treat urban environments as difficult terrain only when you choose to.',
          type: 'subclass_feature',
          subclass: 'City Domain (UA)'
        },
        {
          name: 'Bonus Proficiencies',
          level: 1,
          description: 'You gain proficiency in one of the following skills of your choice: Insight, Persuasion, or Deception.',
          type: 'subclass_feature',
          subclass: 'City Domain (UA)'
        },
        {
          name: 'Channel Divinity: Spirits of the City',
          level: 2,
          description: 'You can use your Channel Divinity to call upon the spirits of the city for aid. As an action, you present your holy symbol and evoke spectral city guardians. Each hostile creature within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature is restrained for 1 minute. A restrained creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
          type: 'subclass_feature',
          subclass: 'City Domain (UA)'
        },
        {
          name: 'Block Watch',
          level: 6,
          description: 'Your awareness of your surroundings becomes supernaturally keen. You and allies within 10 feet of you have advantage on Wisdom (Perception) checks. At 17th level, the range of this aura increases to 30 feet.',
          type: 'subclass_feature',
          subclass: 'City Domain (UA)'
        },
        {
          name: 'Divine Strike',
          level: 8,
          description: 'You gain the ability to infuse your weapon strikes with divine energy. Once on each of your turns when you hit a creature with a weapon attack, you can cause the attack to deal an extra 1d8 psychic damage to the target. When you reach 14th level, the extra damage increases to 2d8.',
          type: 'subclass_feature',
          subclass: 'City Domain (UA)'
        },
        {
          name: 'Express Transit',
          level: 17,
          description: 'You can use a bonus action to teleport to an unoccupied space you can see within 60 feet. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'City Domain (UA)'
        }
      ]
    },
    {
      id: 'cleric-unity',
      name: 'Unity Domain (UA)',
      description: '[UA] Clerics who foster cooperation and unity among allies.',
      features: [
        {
          name: 'Emboldening Bond',
          level: 1,
          description: 'You can forge an empowering bond among allies. As an action, you choose a number of willing creatures within 30 feet of you (this can include yourself) equal to your proficiency bonus. You create a magical bond among them for 10 minutes. While any bonded creature is within 30 feet of another, the creature can roll a d4 and add the number rolled to an attack roll, ability check, or saving throw it makes. Each creature can add the d4 no more than once per turn.',
          type: 'subclass_feature',
          subclass: 'Unity Domain (UA)'
        },
        {
          name: 'Channel Divinity: Shared Burden',
          level: 2,
          description: 'You can use your Channel Divinity to protect your allies through unity. When a creature you can see within 30 feet of you takes damage, you can use your reaction to choose a number of other willing creatures you can see, up to a number equal to your Wisdom modifier (minimum of one creature). The damage is divided equally among the original target and chosen creatures.',
          type: 'subclass_feature',
          subclass: 'Unity Domain (UA)'
        },
        {
          name: 'Protective Bond',
          level: 6,
          description: 'When a creature affected by your Emboldening Bond is about to take damage, a second bonded creature within 30 feet of the first can use its reaction to teleport to an unoccupied space within 5 feet of the first creature. The second creature then takes all the damage instead.',
          type: 'subclass_feature',
          subclass: 'Unity Domain (UA)'
        },
        {
          name: 'Potent Spellcasting',
          level: 8,
          description: 'You add your Wisdom modifier to the damage you deal with any cleric cantrip.',
          type: 'subclass_feature',
          subclass: 'Unity Domain (UA)'
        },
        {
          name: 'Expansive Bond',
          level: 17,
          description: 'The benefits of your Emboldening Bond and Protective Bond features now work when the creatures are within 60 feet of each other. When a creature uses Protective Bond to take someone else\'s damage, the creature has resistance to that damage.',
          type: 'subclass_feature',
          subclass: 'Unity Domain (UA)'
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
          description: 'You can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.',
          type: 'subclass_feature',
          subclass: 'Path of the Berserker'
        },
        {
          name: 'Mindless Rage',
          level: 6,
          description: 'You can\'t be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.',
          type: 'subclass_feature',
          subclass: 'Path of the Berserker'
        },
        {
          name: 'Intimidating Presence',
          level: 10,
          description: 'You can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you. If the creature succeeds on its saving throw, you can\'t use this feature on that creature again for 24 hours.',
          type: 'subclass_feature',
          subclass: 'Path of the Berserker'
        },
        {
          name: 'Retaliation',
          level: 14,
          description: 'When you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.',
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
          description: 'Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. You gain the ability to cast the beast sense and speak with animals spells, but only as rituals.',
          type: 'subclass_feature',
          subclass: 'Path of the Totem Warrior'
        },
        {
          name: 'Totem Spirit',
          level: 3,
          description: 'You choose a totem animal and gain its feature. You must make or acquire a physical totem object that incorporates fur or feathers, claws, teeth, or bones of the totem animal. You can choose Bear (resistance to all damage except psychic while raging), Eagle (opportunity attacks against you have disadvantage while raging and you can use Dash as a bonus action), Wolf (your allies have advantage on melee attack rolls against creatures within 5 feet of you while you\'re raging), or other totems.',
          type: 'subclass_feature',
          subclass: 'Path of the Totem Warrior'
        },
        {
          name: 'Aspect of the Beast',
          level: 6,
          description: 'You gain a magical benefit based on the totem animal of your choice. You can choose the same animal you selected for Totem Spirit or a different one. Bear: You gain the might of a bear, doubling your carrying capacity and advantage on Strength checks to push, pull, lift, or break objects. Eagle: You can see up to 1 mile away with no difficulty and discern fine details. Dim light doesn\'t impose disadvantage on your Wisdom (Perception) checks. Wolf: You can track creatures while traveling at a fast pace, and you can move stealthily while traveling at a normal pace.',
          type: 'subclass_feature',
          subclass: 'Path of the Totem Warrior'
        },
        {
          name: 'Spirit Walker',
          level: 10,
          description: 'You can cast the commune with nature spell, but only as a ritual. When you do so, a spiritual version of one of the animals you chose for Totem Spirit or Aspect of the Beast appears to you to convey the information you seek.',
          type: 'subclass_feature',
          subclass: 'Path of the Totem Warrior'
        },
        {
          name: 'Totemic Attunement',
          level: 14,
          description: 'You gain a magical benefit based on a totem animal of your choice. You can choose the same animal you selected previously or a different one. Bear: While raging, any creature within 5 feet of you that\'s hostile to you has disadvantage on attack rolls against targets other than you or another character with this feature. Eagle: While raging, you have a flying speed equal to your current walking speed. Wolf: While raging, you can use a bonus action on your turn to knock a Large or smaller creature prone when you hit it with a melee weapon attack.',
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
          description: 'Spectral warriors appear when you enter your rage. While you\'re raging, the first creature you hit with an attack on your turn becomes the target of the warriors, which hinder its attacks. Until the start of your next turn, that target has disadvantage on any attack roll that isn\'t against you, and when the target hits a creature other than you with an attack, that creature has resistance to the damage dealt by the attack.',
          type: 'subclass_feature',
          subclass: 'Path of the Ancestral Guardian'
        },
        {
          name: 'Spirit Shield',
          level: 6,
          description: 'The guardian spirits that aid you can provide supernatural protection to those you defend. If you are raging and another creature you can see within 30 feet of you takes damage, you can use your reaction to reduce that damage by 2d6. When you reach certain levels in this class, you can reduce the damage by more: by 3d6 at 10th level and by 4d6 at 14th level.',
          type: 'subclass_feature',
          subclass: 'Path of the Ancestral Guardian'
        },
        {
          name: 'Consult the Spirits',
          level: 10,
          description: 'You gain the ability to consult with your ancestral spirits. When you do so, you cast the augury or clairvoyance spell, without using a spell slot or material components. Rather than creating a spherical sensor, this use of clairvoyance invisibly summons one of your ancestral spirits to the chosen location. Wisdom is your spellcasting ability for these spells. After you cast either spell in this way, you can\'t use this feature again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Path of the Ancestral Guardian'
        },
        {
          name: 'Vengeful Ancestors',
          level: 14,
          description: 'Your ancestral spirits grow powerful enough to retaliate. When you use your Spirit Shield to reduce the damage of an attack, the attacker takes an amount of force damage equal to the damage that your Spirit Shield prevents.',
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
          description: 'You emanate a stormy, magical aura while you rage. The aura extends 10 feet from you in every direction, but not through total cover. Your aura has an effect that activates when you enter your rage, and you can activate the effect again on each of your turns as a bonus action. Choose desert, sea, or tundra. Desert: When this effect is activated, all other creatures in your aura take 2 fire damage each. Sea: When this effect is activated, you can choose one other creature you can see in your aura. The target must make a Dexterity saving throw (DC 8 + your proficiency bonus + your Constitution modifier), taking 1d6 lightning damage on a failed save. Tundra: When this effect is activated, each creature of your choice in your aura gains 2 temporary hit points.',
          type: 'subclass_feature',
          subclass: 'Path of the Storm Herald'
        },
        {
          name: 'Storm Soul',
          level: 6,
          description: 'The storm grants you benefits even when your aura isn\'t active. Desert: You gain resistance to fire damage, and you don\'t suffer the effects of extreme heat. Sea: You gain resistance to lightning damage, and you can breathe underwater. You also gain a swimming speed of 30 feet. Tundra: You gain resistance to cold damage, and you don\'t suffer the effects of extreme cold.',
          type: 'subclass_feature',
          subclass: 'Path of the Storm Herald'
        },
        {
          name: 'Shielding Storm',
          level: 10,
          description: 'You learn to use your mastery of the storm to protect others. Each creature of your choice has the damage resistance you gained from the Storm Soul feature while the creature is in your Storm Aura.',
          type: 'subclass_feature',
          subclass: 'Path of the Storm Herald'
        },
        {
          name: 'Raging Storm',
          level: 14,
          description: 'The power of the storm you channel grows mightier, lashing out at your foes. Desert: Immediately after a creature in your aura hits you with an attack, you can use your reaction to force that creature to make a Dexterity saving throw. On a failed save, the creature takes fire damage equal to half your barbarian level. Sea: When you hit a creature in your aura with an attack, you can use your reaction to force that creature to make a Strength saving throw. On a failed save, the creature is knocked prone, as if struck by a wave. Tundra: Whenever the effect of your Storm Aura is activated, you can choose one creature you can see in the aura. That creature must succeed on a Strength saving throw, or its speed is reduced to 0 until the start of your next turn, as magical frost covers it.',
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
          description: 'You can channel divine fury into your weapon strikes. While you\'re raging, the first creature you hit on each of your turns with a weapon attack takes extra damage equal to 1d6 + half your barbarian level. The extra damage is necrotic or radiant; you choose the type of damage when you gain this feature.',
          type: 'subclass_feature',
          subclass: 'Path of the Zealot'
        },
        {
          name: 'Warrior of the Gods',
          level: 3,
          description: 'Your soul is marked for endless battle. If a spell, such as raise dead, has the sole effect of restoring you to life (but not undeath), the caster doesn\'t need material components to cast the spell on you.',
          type: 'subclass_feature',
          subclass: 'Path of the Zealot'
        },
        {
          name: 'Fanatical Focus',
          level: 6,
          description: 'The divine power that fuels your rage can protect you. If you fail a saving throw while you\'re raging, you can reroll it, and you must use the new roll. You can use this ability only once per rage.',
          type: 'subclass_feature',
          subclass: 'Path of the Zealot'
        },
        {
          name: 'Zealous Presence',
          level: 10,
          description: 'You learn to channel divine power to inspire zealotry in others. As a bonus action, you unleash a battle cry infused with divine energy. Up to ten other creatures of your choice within 60 feet of you that can hear you gain advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can\'t use it again until you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Path of the Zealot'
        },
        {
          name: 'Rage beyond Death',
          level: 14,
          description: 'The divine power that fuels your rage allows you to shrug off fatal blows. While you\'re raging, having 0 hit points doesn\'t knock you unconscious. You still must make death saving throws, and you suffer the normal effects of taking damage while at 0 hit points. However, if you would die due to failing death saving throws, you don\'t die until your rage ends, and you die then only if you still have 0 hit points.',
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
          description: 'When you enter your rage, you can transform, revealing the bestial power within you. Until the rage ends, you manifest a natural weapon. It counts as a simple melee weapon for you, and you add your Strength modifier to the attack and damage rolls when you attack with it. You choose the weapon\'s form each time you rage: Bite (1d8 piercing damage, heal hit points equal to your proficiency bonus when you hit), Claws (1d6 slashing damage, one extra attack with them as a bonus action), or Tail (1d8 piercing damage, reach of 10 feet, reaction to add 1d8 to AC against one attack).',
          type: 'subclass_feature',
          subclass: 'Path of the Beast'
        },
        {
          name: 'Bestial Soul',
          level: 6,
          description: 'The feral power within you increases, causing the natural weapons of your Form of the Beast to count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. You can also alter your form to help you adapt to your surroundings. When you finish a short or long rest, choose one of the following benefits, which lasts until you finish your next short or long rest: Swimming speed equal to your walking speed and you can breathe underwater, Climbing speed equal to your walking speed and no check needed to climb difficult surfaces or upside down on ceilings, or Jump distance increased by the result of an Athletics check when you jump.',
          type: 'subclass_feature',
          subclass: 'Path of the Beast'
        },
        {
          name: 'Infectious Fury',
          level: 10,
          description: 'When you hit a creature with your natural weapons while you\'re raging, the beast within you can curse your target with rabid fury. The target must succeed on a Wisdom saving throw (DC equal to 8 + your Constitution modifier + your proficiency bonus) or suffer one of the following effects (your choice): The target must use its reaction to make a melee attack against another creature of your choice that you can see, or the target takes 2d12 psychic damage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Path of the Beast'
        },
        {
          name: 'Call the Hunt',
          level: 14,
          description: 'The beast within you grows so powerful that you can spread its ferocity to others and gain resilience from them joining your hunt. When you enter your rage, you can choose a number of other willing creatures you can see within 30 feet of you equal to your Constitution modifier (minimum of one creature). You gain 5 temporary hit points for each creature that accepts this feature. Until the rage ends, the chosen creatures can each use the following benefit once on each of their turns: when the creature hits a target with an attack roll and deals damage to it, the creature can roll a d6 and gain a bonus to the damage equal to the number rolled. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
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
          description: 'As an action, you can open your awareness to the presence of concentrated magic. Until the end of your next turn, you know the location of any spell or magic item within 60 feet of you that isn\'t behind total cover. When you sense a spell, you learn which school of magic it belongs to. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Path of Wild Magic'
        },
        {
          name: 'Wild Surge',
          level: 3,
          description: 'The magical energy roiling inside you sometimes erupts from you. When you enter your rage, roll on the Wild Magic table to determine the magical effect produced. If the effect requires a saving throw, the DC equals 8 + your proficiency bonus + your Constitution modifier.',
          type: 'subclass_feature',
          subclass: 'Path of Wild Magic'
        },
        {
          name: 'Bolstering Magic',
          level: 6,
          description: 'You can harness your wild magic to bolster yourself or a companion. As an action, you can touch one creature (which can be yourself) and confer one of the following benefits of your choice to that creature: For 10 minutes, the creature can roll a d3 whenever making an attack roll or an ability check and add the number rolled to the d20 roll, or roll a d3. The creature can add the number rolled to one damage roll of its choice the next time it hits a target with an attack roll. You can take this action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Path of Wild Magic'
        },
        {
          name: 'Unstable Backlash',
          level: 10,
          description: 'When you are imperiled during your rage, the magic within you can lash out; immediately after you take damage or fail a saving throw while raging, you can use your reaction to roll on the Wild Magic table and immediately produce the effect rolled. This effect replaces your current Wild Surge effect.',
          type: 'subclass_feature',
          subclass: 'Path of Wild Magic'
        },
        {
          name: 'Controlled Surge',
          level: 14,
          description: 'Whenever you roll on the Wild Magic table, you can roll the die twice and choose which of the two effects to unleash. If you roll the same number on both dice, you can ignore the number and choose any effect on the table.',
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
          description: 'You learn how to use your wit to distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of you makes an attack roll, an ability check, or a damage roll, you can use your reaction to expend one of your uses of Bardic Inspiration, rolling a Bardic Inspiration die and subtracting the number rolled from the creature\'s roll. You can choose to use this feature after the creature makes its roll, but before the DM determines whether the attack roll or ability check succeeds or fails, or before the creature deals its damage.',
          type: 'subclass_feature',
          subclass: 'College of Lore'
        },
        {
          name: 'Additional Magical Secrets',
          level: 6,
          description: 'You learn two spells of your choice from any class. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip. The chosen spells count as bard spells for you but don\'t count against the number of bard spells you know.',
          type: 'subclass_feature',
          subclass: 'College of Lore'
        },
        {
          name: 'Peerless Skill',
          level: 14,
          description: 'When you make an ability check, you can expend one use of Bardic Inspiration. Roll a Bardic Inspiration die and add the number rolled to your ability check. You can choose to do so after you roll the die for the ability check, but before the DM tells you whether you succeed or fail.',
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
          description: 'You learn to inspire others in battle. A creature that has a Bardic Inspiration die from you can roll that die and add the number rolled to a weapon damage roll it just made. Alternatively, when an attack roll is made against the creature, it can use its reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, after seeing the roll but before knowing whether it hits or misses.',
          type: 'subclass_feature',
          subclass: 'College of Valor'
        },
        {
          name: 'Extra Attack',
          level: 6,
          description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
          type: 'subclass_feature',
          subclass: 'College of Valor'
        },
        {
          name: 'Battle Magic',
          level: 14,
          description: 'You have mastered the art of weaving spellcasting and weapon use into a single harmonious act. When you use your action to cast a bard spell, you can make one weapon attack as a bonus action.',
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
          description: 'As a bonus action, you can expend one use of your Bardic Inspiration to grant yourself a wondrous appearance. When you do so, choose a number of creatures you can see and that can see you within 60 feet of you, up to a number equal to your Charisma modifier (minimum of one). Each of them gains 5 temporary hit points. When a creature gains these temporary hit points, it can immediately use its reaction to move up to its speed, without provoking opportunity attacks. The number of temporary hit points increases when you reach certain levels in this class, increasing to 8 at 5th level, 11 at 10th level, and 14 at 15th level.',
          type: 'subclass_feature',
          subclass: 'College of Glamour'
        },
        {
          name: 'Enthralling Performance',
          level: 3,
          description: 'If you perform for at least 1 minute, you can attempt to inspire wonder in your audience by singing, reciting a poem, or dancing. At the end of the performance, choose a number of humanoids within 60 feet of you who watched and listened to all of it, up to a number equal to your Charisma modifier (minimum of one). Each target must succeed on a Wisdom saving throw against your spell save DC or be charmed by you. While charmed in this way, the target idolizes you, it speaks glowingly of you to anyone who talks to it, and it hinders anyone who opposes you, although it avoids violence unless it was already inclined to fight on your behalf. This effect ends on a target after 1 hour, if it takes any damage, if you attack it, or if it witnesses you attacking or damaging any of its allies. If a target succeeds on its saving throw, the target has no hint that you tried to charm it. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'College of Glamour'
        },
        {
          name: 'Mantle of Majesty',
          level: 6,
          description: 'You gain the ability to cloak yourself in a fey magic that makes others want to serve you. As a bonus action, you cast command, without expending a spell slot, and you take on an appearance of unearthly beauty for 1 minute or until your concentration ends (as if you were concentrating on a spell). During this time, you can cast command as a bonus action on each of your turns, without expending a spell slot. Any creature charmed by you automatically fails its saving throw against the command you cast with this feature. Once you use this feature, you can\'t use it again until you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'College of Glamour'
        },
        {
          name: 'Unbreakable Majesty',
          level: 14,
          description: 'Your appearance permanently gains an otherworldly aspect that makes you look more lovely and fierce. As a bonus action, you can assume a magically majestic presence for 1 minute or until you are incapacitated. For the duration, whenever any creature tries to attack you for the first time on a turn, the attacker must make a Charisma saving throw against your spell save DC. On a failed save, it can\'t attack you on this turn, and it must choose a new target for its attack or the attack is wasted. On a successful save, it can attack you on this turn, but it has disadvantage on any saving throw it makes against your spells on your next turn. Once you assume this majestic presence, you can\'t do so again until you finish a short or long rest.',
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
          description: 'You gain proficiency with medium armor and the scimitar. If you\'re proficient with a simple or martial melee weapon, you can use it as a spellcasting focus for your bard spells.',
          type: 'subclass_feature',
          subclass: 'College of Swords'
        },
        {
          name: 'Fighting Style',
          level: 3,
          description: 'You adopt a style of fighting as your specialty. Choose one of the following options: Dueling or Two-Weapon Fighting. You can\'t take a Fighting Style option more than once, even if something in the game lets you choose again.',
          type: 'subclass_feature',
          subclass: 'College of Swords'
        },
        {
          name: 'Blade Flourish',
          level: 3,
          description: 'You learn to perform impressive displays of martial prowess and speed. Whenever you take the Attack action on your turn, your walking speed increases by 10 feet until the end of the turn, and if a weapon attack that you make as part of this action hits a creature, you can use one of the following Blade Flourish options of your choice. You can use only one Blade Flourish option per turn. Defensive Flourish: You can expend one use of your Bardic Inspiration to cause the weapon to deal extra damage to the target you hit. The damage equals the number you roll on the Bardic Inspiration die. You also add the number rolled to your AC until the start of your next turn. Slashing Flourish: You can expend one use of your Bardic Inspiration to cause the weapon to deal extra damage to the target you hit and to any other creature of your choice that you can see within 5 feet of you. The damage equals the number you roll on the Bardic Inspiration die. Mobile Flourish: You can expend one use of your Bardic Inspiration to cause the weapon to deal extra damage to the target you hit. The damage equals the number you roll on the Bardic Inspiration die. You can also push the target up to 5 feet away from you, plus a number of feet equal to the number you roll on that die. You can then immediately use your reaction to move up to your walking speed to an unoccupied space within 5 feet of the target.',
          type: 'subclass_feature',
          subclass: 'College of Swords'
        },
        {
          name: 'Extra Attack',
          level: 6,
          description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
          type: 'subclass_feature',
          subclass: 'College of Swords'
        },
        {
          name: 'Master\'s Flourish',
          level: 14,
          description: 'Whenever you use a Blade Flourish option, you can roll a d6 and use it instead of expending a Bardic Inspiration die.',
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
    },
    {
      id: 'bard-satire',
      name: 'College of Satire (UA)',
      description: '[UA] Court jesters and acrobatic performers who use humor and agility.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 3,
          description: 'You gain proficiency with thieves\' tools and Acrobatics or Sleight of Hand.',
          type: 'subclass_feature',
          subclass: 'College of Satire (UA)'
        },
        {
          name: 'Tumbling Fool',
          level: 3,
          description: 'You master acrobatic techniques to evade danger as a bonus action.',
          type: 'subclass_feature',
          subclass: 'College of Satire (UA)'
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
        },
        {
          name: 'Defensive Tactics',
          level: 7,
          description: 'You gain one of the following features: Escape the Horde, Multiattack Defense, or Steel Will.',
          type: 'subclass_feature',
          subclass: 'Hunter'
        },
        {
          name: 'Multiattack',
          level: 11,
          description: 'You gain one of the following features: Volley or Whirlwind Attack.',
          type: 'subclass_feature',
          subclass: 'Hunter'
        },
        {
          name: 'Superior Hunter\'s Defense',
          level: 15,
          description: 'You gain one of the following features: Evasion, Stand Against the Tide, or Uncanny Dodge.',
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
        },
        {
          name: 'Exceptional Training',
          level: 7,
          description: 'On any of your turns when your beast companion doesn\'t attack, you can use a bonus action to command the beast to take the Dash, Disengage, or Help action on its turn.',
          type: 'subclass_feature',
          subclass: 'Beast Master'
        },
        {
          name: 'Bestial Fury',
          level: 11,
          description: 'When you command your beast companion to take the Attack action, the beast can make two attacks, or it can take the Multiattack action if it has that action.',
          type: 'subclass_feature',
          subclass: 'Beast Master'
        },
        {
          name: 'Share Spells',
          level: 15,
          description: 'When you cast a spell targeting yourself, you can also affect your beast companion with the spell if the beast is within 30 feet of you.',
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
        },
        {
          name: 'Iron Mind',
          level: 7,
          description: 'You gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice).',
          type: 'subclass_feature',
          subclass: 'Gloom Stalker'
        },
        {
          name: 'Stalker\'s Flurry',
          level: 11,
          description: 'Once on each of your turns when you miss with a weapon attack, you can make another weapon attack as part of the same action.',
          type: 'subclass_feature',
          subclass: 'Gloom Stalker'
        },
        {
          name: 'Shadowy Dodge',
          level: 15,
          description: 'Whenever a creature makes an attack roll against you and doesn\'t have advantage on the roll, you can use your reaction to impose disadvantage on it. You must use this feature before you know the outcome of the attack roll.',
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
        },
        {
          name: 'Ethereal Step',
          level: 7,
          description: 'You can cast the etherealness spell once without expending a spell slot, though you can only target yourself when you do so. You regain the ability to do so when you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Horizon Walker'
        },
        {
          name: 'Distant Strike',
          level: 11,
          description: 'You gain the ability to pass between the planes in the blink of an eye. When you take the Attack action, you can teleport up to 10 feet before each attack to an unoccupied space you can see. If you attack at least two different creatures with the action, you can make one additional attack with it against a third creature.',
          type: 'subclass_feature',
          subclass: 'Horizon Walker'
        },
        {
          name: 'Spectral Defense',
          level: 15,
          description: 'Your ability to move between planes enables you to slip through the planar boundaries to lessen the harm done to you during battle. When you take damage from an attack, you can use your reaction to give yourself resistance to all of that attack\'s damage on this turn.',
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
        },
        {
          name: 'Supernatural Defense',
          level: 7,
          description: 'Whenever the target of your Slayer\'s Prey forces you to make a saving throw and whenever you make an ability check to escape that target\'s grapple, add 1d6 to your roll.',
          type: 'subclass_feature',
          subclass: 'Monster Slayer'
        },
        {
          name: 'Magic-User\'s Nemesis',
          level: 11,
          description: 'When you see a creature casting a spell or teleporting within 60 feet of you, you can use your reaction to try to magically foil it. The creature must succeed on a Wisdom saving throw against your spell save DC, or its spell or teleport fails and is wasted. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Monster Slayer'
        },
        {
          name: 'Slayer\'s Counter',
          level: 15,
          description: 'If the target of your Slayer\'s Prey forces you to make a saving throw, you can use your reaction to make one weapon attack against the quarry. You make this attack immediately before making the saving throw. If the attack hits, your save automatically succeeds, in addition to the attack\'s normal effects.',
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
        },
        {
          name: 'Beguiling Twist',
          level: 7,
          description: 'When a creature you can see within 120 feet of you succeeds on a saving throw against being charmed or frightened, you can use your reaction to force a different creature you can see within 120 feet of you to make a Wisdom saving throw against your spell save DC. If the save fails, the target is charmed or frightened by you (your choice) for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a successful save.',
          type: 'subclass_feature',
          subclass: 'Fey Wanderer'
        },
        {
          name: 'Fey Reinforcements',
          level: 11,
          description: 'You can cast summon fey without a material component. You can also cast it once without a spell slot, and you regain the ability to do so when you finish a long rest. Whenever you start casting this spell, you can modify it so that it doesn\'t require concentration. If you do so, the spell\'s duration becomes 1 minute for that casting.',
          type: 'subclass_feature',
          subclass: 'Fey Wanderer'
        },
        {
          name: 'Misty Wanderer',
          level: 15,
          description: 'You can cast misty step without expending a spell slot. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a long rest. In addition, whenever you cast misty step, you can bring along one willing creature you can see within 5 feet of you. That creature teleports to an unoccupied space of your choice within 5 feet of your destination space.',
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
        },
        {
          name: 'Writhing Tide',
          level: 7,
          description: 'You can condense part of your swarm into a focused mass that lifts you up. As a bonus action, you gain a flying speed of 10 feet and can hover. This effect lasts for 1 minute or until you are incapacitated. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Swarmkeeper'
        },
        {
          name: 'Mighty Swarm',
          level: 11,
          description: 'Your Gathered Swarm grows mightier in the following ways: The damage of Gathered Swarm increases to 1d8. If a creature fails its saving throw against being moved by Gathered Swarm, you can also cause the swarm to knock the creature prone. When you are moved by Gathered Swarm, it gives you half cover until the start of your next turn.',
          type: 'subclass_feature',
          subclass: 'Swarmkeeper'
        },
        {
          name: 'Swarming Dispersal',
          level: 15,
          description: 'When you take damage, you can use your reaction to give yourself resistance to that damage. You vanish into your swarm and then teleport to an unoccupied space that you can see within 30 feet of you, where you reappear with the swarm. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Swarmkeeper'
        }
      ]
    },
    {
      id: 'ranger-primeval-guardian',
      name: 'Primeval Guardian (UA)',
      description: '[UA] Rangers who can transform into powerful tree-like guardians of nature.',
      features: [
        {
          name: 'Guardian Soul',
          level: 3,
          description: 'You can transform into a powerful guardian form as a bonus action.',
          type: 'subclass_feature',
          subclass: 'Primeval Guardian (UA)'
        },
        {
          name: 'Piercing Thorns',
          level: 3,
          description: 'While in guardian form, you can deal additional damage to nearby creatures.',
          type: 'subclass_feature',
          subclass: 'Primeval Guardian (UA)'
        },
        {
          name: 'Ancient Fortitude',
          level: 7,
          description: 'You gain temporary hit points whenever you assume your Guardian Soul form. You also gain resistance to all damage except psychic damage while in your Guardian Soul form.',
          type: 'subclass_feature',
          subclass: 'Primeval Guardian (UA)'
        },
        {
          name: 'Rooted Defense',
          level: 11,
          description: 'While you are in your Guardian Soul form, your reach increases by 5 feet. Additionally, when a creature you can see within your reach hits you with a melee attack, you can use your reaction to force that creature to make a Strength saving throw (DC 8 + your proficiency bonus + your Wisdom modifier). On a failed save, the creature is knocked prone or moved up to 10 feet away from you (your choice).',
          type: 'subclass_feature',
          subclass: 'Primeval Guardian (UA)'
        },
        {
          name: 'Guardian Aura',
          level: 15,
          description: 'Your Guardian Soul form emanates an aura of protection. While in your Guardian Soul form, you and allies within 10 feet of you gain resistance to all damage except psychic damage.',
          type: 'subclass_feature',
          subclass: 'Primeval Guardian (UA)'
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
        },
        {
          name: 'Aura of Devotion',
          level: 7,
          description: 'You and friendly creatures within 10 feet of you can\'t be charmed while you are conscious. At 18th level, the range of this aura increases to 30 feet.',
          type: 'subclass_feature',
          subclass: 'Oath of Devotion'
        },
        {
          name: 'Purity of Spirit',
          level: 15,
          description: 'You are always under the effects of a protection from evil and good spell.',
          type: 'subclass_feature',
          subclass: 'Oath of Devotion'
        },
        {
          name: 'Holy Nimbus',
          level: 20,
          description: 'As an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that. Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage. In addition, for the duration, you have advantage on saving throws against spells cast by fiends and undead.',
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
        },
        {
          name: 'Relentless Avenger',
          level: 7,
          description: 'When you hit a creature with an opportunity attack, you can move up to half your speed immediately after the attack as part of the same reaction. This movement doesn\'t provoke opportunity attacks.',
          type: 'subclass_feature',
          subclass: 'Oath of Vengeance'
        },
        {
          name: 'Soul of Vengeance',
          level: 15,
          description: 'When a creature under the effect of your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against that creature.',
          type: 'subclass_feature',
          subclass: 'Oath of Vengeance'
        },
        {
          name: 'Avenging Angel',
          level: 20,
          description: 'As an action, you can assume the form of an angelic avenger. For 1 hour, you gain a flying speed of 60 feet, and you emanate an aura of menace in a 30-foot radius. The first time any enemy creature enters the aura or starts its turn there, it must succeed on a Wisdom saving throw or become frightened of you for 1 minute or until it takes damage.',
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
        },
        {
          name: 'Aura of Warding',
          level: 7,
          description: 'You and friendly creatures within 10 feet of you have resistance to damage from spells. At 18th level, the range of this aura increases to 30 feet.',
          type: 'subclass_feature',
          subclass: 'Oath of the Ancients'
        },
        {
          name: 'Undying Sentinel',
          level: 15,
          description: 'When you are reduced to 0 hit points and are not killed outright, you can choose to drop to 1 hit point instead. Once you use this ability, you can\'t use it again until you finish a long rest. Additionally, you suffer none of the drawbacks of old age, and you can\'t be aged magically.',
          type: 'subclass_feature',
          subclass: 'Oath of the Ancients'
        },
        {
          name: 'Elder Champion',
          level: 20,
          description: 'As an action, you can assume the form of an ancient force of nature. For 1 minute, you gain the following benefits: at the start of each of your turns, you regain 10 hit points; whenever you cast a paladin spell with a casting time of 1 action, you can cast it using a bonus action instead; and enemy creatures within 10 feet of you have disadvantage on saving throws against your paladin spells and Channel Divinity options.',
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
        },
        {
          name: 'Aura of Conquest',
          level: 7,
          description: 'You constantly emanate a menacing aura while you\'re not incapacitated. The aura extends 10 feet from you in every direction. If a creature is frightened of you, its speed is reduced to 0 while in the aura, and that creature takes psychic damage equal to half your paladin level if it starts its turn there. At 18th level, the range of this aura increases to 30 feet.',
          type: 'subclass_feature',
          subclass: 'Oath of Conquest'
        },
        {
          name: 'Scornful Rebuke',
          level: 15,
          description: 'When a creature hits you with an attack, that creature takes psychic damage equal to your Charisma modifier (minimum of 1) if you\'re not incapacitated.',
          type: 'subclass_feature',
          subclass: 'Oath of Conquest'
        },
        {
          name: 'Invincible Conqueror',
          level: 20,
          description: 'As an action, you can magically become an avatar of conquest. For 1 minute, you gain the following benefits: you have resistance to all damage; when you take the Attack action, you can make one additional attack as part of that action; and your melee weapon attacks score a critical hit on a roll of 19 or 20.',
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
        },
        {
          name: 'Aura of the Guardian',
          level: 7,
          description: 'You can shield others from harm at the cost of your own health. When a creature within 10 feet of you takes damage, you can use your reaction to magically take that damage instead of that creature taking it. At 18th level, the range of this aura increases to 30 feet.',
          type: 'subclass_feature',
          subclass: 'Oath of Redemption'
        },
        {
          name: 'Protective Spirit',
          level: 15,
          description: 'A holy presence mends your wounds in battle. You regain hit points equal to 1d6 + half your paladin level if you end your turn in combat with fewer than half your hit points remaining and you aren\'t incapacitated.',
          type: 'subclass_feature',
          subclass: 'Oath of Redemption'
        },
        {
          name: 'Emissary of Redemption',
          level: 20,
          description: 'You become an avatar of peace. You gain resistance to all damage dealt by other creatures. Whenever a creature hits you with an attack, it takes radiant damage equal to half the damage you take from the attack.',
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
        },
        {
          name: 'Aura of Alacrity',
          level: 7,
          description: 'You emanate an aura that fills you and your companions with supernatural speed. Your walking speed increases by 10 feet. In addition, if you aren\'t incapacitated, the walking speed of any ally who starts their turn within 10 feet of you increases by 10 feet until the end of that turn. At 18th level, the range of this aura increases to 30 feet.',
          type: 'subclass_feature',
          subclass: 'Oath of Glory'
        },
        {
          name: 'Glorious Defense',
          level: 15,
          description: 'When you or another creature you can see within 10 feet of you is hit by an attack roll, you can use your reaction to grant a bonus to the target\'s AC against that attack, potentially causing it to miss. The bonus equals your Charisma modifier (minimum of +1). If the attack misses, you can make one weapon attack against the attacker as part of this reaction.',
          type: 'subclass_feature',
          subclass: 'Oath of Glory'
        },
        {
          name: 'Living Legend',
          level: 20,
          description: 'As a bonus action, you can empower yourself with the legends of the greatest heroes. For 1 minute, you gain the following benefits: you are blessed with an otherworldly presence, gaining advantage on all Charisma checks; once on each of your turns when you miss with a weapon attack, you can cause that attack to hit instead; and if you fail a saving throw, you can use your reaction to reroll it, and you must use the new roll.',
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
        },
        {
          name: 'Aura of the Sentinel',
          level: 7,
          description: 'You emit an aura of alertness while you aren\'t incapacitated. When you and any creatures of your choice within 10 feet of you roll initiative, you all gain a bonus to initiative equal to your proficiency bonus. At 18th level, the range of this aura increases to 30 feet.',
          type: 'subclass_feature',
          subclass: 'Oath of the Watchers'
        },
        {
          name: 'Vigilant Rebuke',
          level: 15,
          description: 'When you succeed on an Intelligence, a Wisdom, or a Charisma saving throw, you can use your reaction to deal 2d8 + your Charisma modifier force damage to the creature that forced you to make the saving throw.',
          type: 'subclass_feature',
          subclass: 'Oath of the Watchers'
        },
        {
          name: 'Mortal Bulwark',
          level: 20,
          description: 'As a bonus action, you manifest a spark of divine power. For 1 minute, you gain the following benefits: you gain truesight with a range of 120 feet; you have advantage on attack rolls against aberrations, celestials, elementals, fey, and fiends; and when you hit a creature with an attack roll and deal damage to it, you can also force it to make a Charisma saving throw against your spell save DC. On a failed save, the creature is magically banished to its home plane if it isn\'t there already.',
          type: 'subclass_feature',
          subclass: 'Oath of the Watchers'
        }
      ]
    },
    {
      id: 'paladin-treachery',
      name: 'Oath of Treachery (UA)',
      description: '[UA] Evil paladins who embrace betrayal, deception, and self-interest.',
      features: [
        {
          name: 'Channel Divinity: Conjure Duplicate',
          level: 3,
          description: 'You can create an illusory duplicate of yourself to confuse enemies.',
          type: 'subclass_feature',
          subclass: 'Oath of Treachery (UA)'
        },
        {
          name: 'Channel Divinity: Poison Strike',
          level: 3,
          description: 'You can use your Channel Divinity to deal extra poison damage.',
          type: 'subclass_feature',
          subclass: 'Oath of Treachery (UA)'
        },
        {
          name: 'Aura of Treachery',
          level: 7,
          description: 'You emanate an aura of discord. While you\'re not incapacitated, any caster that tries to cast a spell with a range of 5 feet or greater within 10 feet of you must first make a Wisdom saving throw against your spell save DC. On a failed save, the spell slot is expended with no effect. At 18th level, the range of this aura increases to 30 feet.',
          type: 'subclass_feature',
          subclass: 'Oath of Treachery (UA)'
        },
        {
          name: 'Blackguard\'s Escape',
          level: 15,
          description: 'You have the ability to slip away from your foes. Immediately after you are hit by an attack, you can use your reaction to turn invisible and teleport up to 60 feet to a spot you can see. You remain invisible until the end of your next turn or until you attack, deal damage, or force a creature to make a saving throw. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Oath of Treachery (UA)'
        },
        {
          name: 'Icon of Deceit',
          level: 20,
          description: 'As a bonus action, you can become an avatar of deceit. For 1 minute, you gain the following benefits: you are invisible; if you are already invisible when you attack, you deal an extra 2d8 damage with that attack; and as a bonus action, you can conjure a duplicate of yourself in an unoccupied space you can see within 30 feet of you. Each duplicate has 1 hit point and lasts until the end of your next turn.',
          type: 'subclass_feature',
          subclass: 'Oath of Treachery (UA)'
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
        },
        {
          name: 'Land\'s Stride',
          level: 6,
          description: 'Moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.',
          type: 'subclass_feature',
          subclass: 'Circle of the Land'
        },
        {
          name: 'Nature\'s Ward',
          level: 10,
          description: 'You can\'t be charmed or frightened by elementals or fey, and you are immune to poison and disease.',
          type: 'subclass_feature',
          subclass: 'Circle of the Land'
        },
        {
          name: 'Nature\'s Sanctuary',
          level: 14,
          description: 'Creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses.',
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
        },
        {
          name: 'Primal Strike',
          level: 6,
          description: 'Your attacks in beast form count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.',
          type: 'subclass_feature',
          subclass: 'Circle of the Moon'
        },
        {
          name: 'Elemental Wild Shape',
          level: 10,
          description: 'You can expend two uses of Wild Shape at the same time to transform into an air elemental, an earth elemental, a fire elemental, or a water elemental.',
          type: 'subclass_feature',
          subclass: 'Circle of the Moon'
        },
        {
          name: 'Thousand Forms',
          level: 14,
          description: 'You have learned to use magic to alter your physical form in more subtle ways. You can cast the alter self spell at will.',
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
        },
        {
          name: 'Hidden Paths',
          level: 10,
          description: 'You can use the hidden, magical pathways of the Feywild to teleport yourself and allies. As a bonus action, you can teleport up to 60 feet to an unoccupied space you can see. Alternatively, you can use your action to teleport one willing creature you touch up to 30 feet to an unoccupied space you can see.',
          type: 'subclass_feature',
          subclass: 'Circle of Dreams'
        },
        {
          name: 'Walker in Dreams',
          level: 14,
          description: 'You can cast the dream spell without expending a spell slot. You can also cast scrying without expending a spell slot, but the target must be asleep. Once you cast either spell in this way, you can\'t do so again until you finish a long rest.',
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
        },
        {
          name: 'Mighty Summoner',
          level: 6,
          description: 'Beasts and fey that you conjure with your spells are more resilient. Any beast or fey summoned or created by your spells gains two benefits: the creature appears with more hit points than normal (2 extra hit points per Hit Die it has), and the damage from its natural weapons is considered magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.',
          type: 'subclass_feature',
          subclass: 'Circle of the Shepherd'
        },
        {
          name: 'Guardian Spirit',
          level: 10,
          description: 'When you use your Spirit Totem feature, you can choose to grant yourself and allies within the aura temporary hit points equal to 5 + your druid level.',
          type: 'subclass_feature',
          subclass: 'Circle of the Shepherd'
        },
        {
          name: 'Faithful Summons',
          level: 14,
          description: 'When you are reduced to 0 hit points or are incapacitated against your will, you can immediately gain the benefits of conjure animals as if it were cast using a 9th-level spell slot. It summons four beasts of your choice that are challenge rating 2 or lower. The conjured beasts appear within 20 feet of you. If they receive no commands from you, they protect you from harm and attack your foes. The spell lasts for 1 hour or until you dismiss it (no action required). Once you use this feature, you can\'t use it again until you finish a long rest.',
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
        },
        {
          name: 'Fungal Infestation',
          level: 6,
          description: 'Your spores can animate the dead. When a beast or humanoid that is Small or Medium dies within 10 feet of you, you can use your reaction to animate it, causing it to stand up immediately with 1 hit point. The creature uses the zombie stat block. It remains animate for 1 hour, after which time it collapses and dies.',
          type: 'subclass_feature',
          subclass: 'Circle of Spores'
        },
        {
          name: 'Spreading Spores',
          level: 10,
          description: 'You can create a cloud of spores. As a bonus action while your Symbiotic Entity feature is active, you can hurl spores up to 30 feet away, where they swirl in a 10-foot cube for 1 minute. The spores disappear early if you use this feature again, if you dismiss them (no action required), or if your Symbiotic Entity feature is no longer active. Whenever a creature moves into the cube or starts its turn there, that creature takes your Halo of Spores damage, unless the creature succeeds on a Constitution saving throw against your spell save DC.',
          type: 'subclass_feature',
          subclass: 'Circle of Spores'
        },
        {
          name: 'Fungal Body',
          level: 14,
          description: 'The fungal spores in your body alter your form. You can\'t be blinded, deafened, frightened, or poisoned, and any critical hit against you counts as a normal hit instead, unless you are incapacitated.',
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
        },
        {
          name: 'Cosmic Omen',
          level: 6,
          description: 'Whenever you finish a long rest, you can consult your Star Map for omens. When you do so, roll a die. Until you finish your next long rest, you gain access to a special reaction based on whether you rolled an even or an odd number. Weal (even): Whenever a creature you can see within 30 feet of you is about to make an attack roll, a saving throw, or an ability check, you can use your reaction to roll a d6 and add the number rolled to the total. Woe (odd): Whenever a creature you can see within 30 feet of you is about to make an attack roll, a saving throw, or an ability check, you can use your reaction to roll a d6 and subtract the number rolled from the total.',
          type: 'subclass_feature',
          subclass: 'Circle of Stars'
        },
        {
          name: 'Twinkling Constellations',
          level: 10,
          description: 'The constellations of your Starry Form improve. While in your Starry Form, you gain resistance to bludgeoning, piercing, and slashing damage.',
          type: 'subclass_feature',
          subclass: 'Circle of Stars'
        },
        {
          name: 'Full of Stars',
          level: 14,
          description: 'While in your Starry Form, you become partially incorporeal, giving you resistance to bludgeoning, piercing, and slashing damage. Additionally, you can use a bonus action to fly up to your walking speed without expending movement.',
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
        },
        {
          name: 'Cauterizing Flames',
          level: 10,
          description: 'When a Small or larger creature dies within 30 feet of you or your wildfire spirit, a harmless spectral flame springs forth in the dead creature\'s space and flickers there for 1 minute. When a creature you can see enters that space, you can use your reaction to extinguish the spectral flame and either heal the creature or deal fire damage to it. The healing or damage equals 2d10 + your Wisdom modifier. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Circle of Wildfire'
        },
        {
          name: 'Blazing Revival',
          level: 14,
          description: 'When you are reduced to 0 hit points and thereby fall unconscious, you can use your reaction to draw on the spark of the wildfire spirit. You are instead reduced to 1 hit point, and each creature of your choice that is within 30 feet of you takes fire damage equal to 2d10 + your druid level. Once you use this feature, you can\'t use it again until you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Circle of Wildfire'
        }
      ]
    },
    {
      id: 'druid-twilight',
      name: 'Circle of Twilight (UA)',
      description: '[UA] Druids who guard the boundary between life and death, facing undead threats.',
      features: [
        {
          name: 'Harvest\'s Scythe',
          level: 2,
          description: 'You can harvest the life force of creatures you kill to heal yourself.',
          type: 'subclass_feature',
          subclass: 'Circle of Twilight (UA)'
        },
        {
          name: 'Speech Beyond the Grave',
          level: 6,
          description: 'You can cast speak with dead without using a spell slot.',
          type: 'subclass_feature',
          subclass: 'Circle of Twilight (UA)'
        },
        {
          name: 'Watcher at the Threshold',
          level: 10,
          description: 'You gain resistance to necrotic and radiant damage. In addition, while you are not incapacitated, any ally within 30 feet of you has advantage on death saving throws.',
          type: 'subclass_feature',
          subclass: 'Circle of Twilight (UA)'
        },
        {
          name: 'Paths of the Dead',
          level: 14,
          description: 'You can cast etherealness once without expending a spell slot. You regain the ability to do so when you finish a short or long rest. When you cast this spell with this feature, you can target up to six willing creatures, yourself included, within 10 feet of you.',
          type: 'subclass_feature',
          subclass: 'Circle of Twilight (UA)'
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
        },
        {
          name: 'Wholeness of Body',
          level: 6,
          description: 'You can use your action to regain hit points equal to three times your monk level. You must finish a long rest before you can use this feature again.',
          type: 'subclass_feature',
          subclass: 'Way of the Open Hand'
        },
        {
          name: 'Tranquility',
          level: 11,
          description: 'At the end of a long rest, you gain the effect of a sanctuary spell that lasts until the start of your next long rest. The spell can end early as normal. The saving throw DC for the spell equals 8 + your Wisdom modifier + your proficiency bonus.',
          type: 'subclass_feature',
          subclass: 'Way of the Open Hand'
        },
        {
          name: 'Quivering Palm',
          level: 17,
          description: 'You can set up lethal vibrations in someone\'s body. When you hit a creature with an unarmed strike, you can spend 3 ki points to start these imperceptible vibrations, which last for a number of days equal to your monk level. The vibrations are harmless unless you use your action to end them. When you use this action, the creature must make a Constitution saving throw. If it fails, it is reduced to 0 hit points. If it succeeds, it takes 10d10 necrotic damage. You can have only one creature under the effect of this feature at a time.',
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
        },
        {
          name: 'Shadow Step',
          level: 6,
          description: 'You can step from one shadow into another. When you are in dim light or darkness, as a bonus action you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness. You then have advantage on the first melee attack you make before the end of the turn.',
          type: 'subclass_feature',
          subclass: 'Way of Shadow'
        },
        {
          name: 'Cloak of Shadows',
          level: 11,
          description: 'You can use your action to become invisible. You remain invisible until you make an attack, cast a spell, or until the end of your turn.',
          type: 'subclass_feature',
          subclass: 'Way of Shadow'
        },
        {
          name: 'Opportunist',
          level: 17,
          description: 'You can exploit a creature\'s momentary distraction when it is hit by an attack. Whenever a creature within 5 feet of you is hit by an attack made by a creature other than you, you can use your reaction to make a melee attack against that creature.',
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
        },
        {
          name: 'Extra Elemental Discipline',
          level: 6,
          description: 'You learn one additional elemental discipline of your choice. You can use only one elemental discipline per turn.',
          type: 'subclass_feature',
          subclass: 'Way of the Four Elements'
        },
        {
          name: 'Extra Elemental Discipline',
          level: 11,
          description: 'You learn one additional elemental discipline of your choice.',
          type: 'subclass_feature',
          subclass: 'Way of the Four Elements'
        },
        {
          name: 'Extra Elemental Discipline',
          level: 17,
          description: 'You learn one additional elemental discipline of your choice.',
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
        },
        {
          name: 'Searing Sunburst',
          level: 11,
          description: 'You can create an orb of light that erupts into a devastating explosion. As an action, you magically create an orb and hurl it at a point you choose within 150 feet, where it erupts into a sphere of radiant light for a brief but deadly instant. Each creature in that 20-foot-radius sphere must succeed on a Constitution saving throw or take 2d6 radiant damage. A creature doesn\'t need to make the save if the creature is behind total cover that is opaque. You can increase the sphere\'s damage by spending ki points. Each point you spend, to a maximum of 3, increases the damage by 2d6.',
          type: 'subclass_feature',
          subclass: 'Way of the Sun Soul'
        },
        {
          name: 'Sun Shield',
          level: 17,
          description: 'You become wreathed in a luminous, magical aura. You shed bright light in a 30-foot radius and dim light for an additional 30 feet. You can extinguish or restore the light as a bonus action. If a creature hits you with a melee attack while this light shines, you can use your reaction to deal radiant damage to the creature. The radiant damage equals 5 + your Wisdom modifier.',
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
        },
        {
          name: 'Drunkard\'s Luck',
          level: 11,
          description: 'When you make an ability check, an attack roll, or a saving throw and have disadvantage, you can spend 2 ki points to cancel the disadvantage for that roll.',
          type: 'subclass_feature',
          subclass: 'Way of the Drunken Master'
        },
        {
          name: 'Intoxicated Frenzy',
          level: 17,
          description: 'When you use your Flurry of Blows, you can make up to three additional attacks with it (up to a total of five Flurry of Blows attacks), provided that each Flurry of Blows attack targets a different creature this turn.',
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
        },
        {
          name: 'One with the Blade',
          level: 6,
          description: 'Your kensei weapons count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. Additionally, when you hit a target with a kensei weapon, you can spend 1 ki point to cause the weapon to deal extra damage to the target equal to your Martial Arts die.',
          type: 'subclass_feature',
          subclass: 'Way of the Kensei'
        },
        {
          name: 'Sharpen the Blade',
          level: 11,
          description: 'You can use a bonus action to grant one kensei weapon you touch a bonus to attack and damage rolls when you attack with it. The bonus equals your proficiency bonus and lasts for 1 minute or until you use this feature again. This feature has no effect on a magic weapon that already has a bonus to attack and damage rolls.',
          type: 'subclass_feature',
          subclass: 'Way of the Kensei'
        },
        {
          name: 'Unerring Accuracy',
          level: 17,
          description: 'If you miss with an attack roll using a monk weapon on your turn, you can reroll it. You can use this feature only once on each of your turns.',
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
        },
        {
          name: 'Physician\'s Touch',
          level: 6,
          description: 'When you use Hand of Healing on a creature, you can also end one disease or one of the following conditions affecting the creature: blinded, deafened, paralyzed, poisoned, or stunned. When you use Hand of Harm on a creature, you can subject that creature to the poisoned condition until the end of your next turn.',
          type: 'subclass_feature',
          subclass: 'Way of Mercy'
        },
        {
          name: 'Flurry of Healing and Harm',
          level: 11,
          description: 'When you use Flurry of Blows, you can now replace each of the unarmed strikes with a use of your Hand of Healing, without spending ki points for the healing.',
          type: 'subclass_feature',
          subclass: 'Way of Mercy'
        },
        {
          name: 'Hand of Ultimate Mercy',
          level: 17,
          description: 'You can use your action to touch the corpse of a creature that died within the past 24 hours and expend 5 ki points. The creature then returns to life, regaining a number of hit points equal to 4d10 + your Wisdom modifier. If the creature died while subject to any of the following conditions, it revives with them removed: blinded, deafened, paralyzed, poisoned, and stunned. Once you use this feature, you can\'t use it again until you finish a long rest.',
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
        },
        {
          name: 'Body of the Astral Self',
          level: 11,
          description: 'When you have both your astral arms and visage summoned, you can cause the body of your astral self to appear (no action required). This spectral body covers your physical form like a suit of armor, connecting with the arms and visage. You determine its appearance. While the spectral body is present, you gain the following benefits: Deflect Energy (when you take acid, cold, fire, force, lightning, or thunder damage, you can use your reaction to deflect it, reducing the damage by 1d10 + your Wisdom modifier), Empowered Arms (once on each of your turns when you hit a target with the Arms of the Astral Self, you can deal extra damage equal to your Martial Arts die).',
          type: 'subclass_feature',
          subclass: 'Way of the Astral Self'
        },
        {
          name: 'Awakening of the Astral Self',
          level: 17,
          description: 'As a bonus action, you can spend 5 ki points to summon the arms, visage, and body of your astral self and awaken it for 10 minutes. This awakening ends early if you are incapacitated or die. While your astral self is awakened, all your astral self features are active, and you gain the following benefits: Armor of the Spirit (you gain a +2 bonus to Armor Class), Astral Barrage (when you use the Extra Attack feature, you can make three attacks with your astral arms).',
          type: 'subclass_feature',
          subclass: 'Way of the Astral Self'
        }
      ]
    },
    {
      id: 'monk-tranquility',
      name: 'Way of Tranquility (UA)',
      description: '[UA] Monks who seek peace and try to avoid combat through diplomacy and healing.',
      features: [
        {
          name: 'Path of Tranquility',
          level: 3,
          description: 'You can cast sanctuary on yourself without a spell slot or material components.',
          type: 'subclass_feature',
          subclass: 'Way of Tranquility (UA)'
        },
        {
          name: 'Healing Hands',
          level: 3,
          description: 'You gain the ability to heal wounds through touch.',
          type: 'subclass_feature',
          subclass: 'Way of Tranquility (UA)'
        },
        {
          name: 'Emissary of Peace',
          level: 6,
          description: 'You gain proficiency in the Performance or Persuasion skill (your choice). You gain an additional benefit: when you make a Charisma check to calm violent emotions or to counsel peace, you have advantage on the roll.',
          type: 'subclass_feature',
          subclass: 'Way of Tranquility (UA)'
        },
        {
          name: 'Douse the Flames of War',
          level: 11,
          description: 'You can use an action to grant yourself resistance to bludgeoning, piercing, and slashing damage. This resistance lasts for 1 minute or until you are incapacitated or die. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Way of Tranquility (UA)'
        },
        {
          name: 'Anger of a Gentle Soul',
          level: 17,
          description: 'If you have no more than half your hit points remaining, you can use a bonus action to make one unarmed strike against each creature within your reach. You can use this feature once per short or long rest.',
          type: 'subclass_feature',
          subclass: 'Way of Tranquility (UA)'
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
        },
        {
          name: 'Elemental Affinity',
          level: 6,
          description: 'When you cast a spell that deals damage of the type associated with your draconic ancestry, you can add your Charisma modifier to one damage roll of that spell. You can also spend 1 sorcery point to gain resistance to that damage type for 1 hour.',
          type: 'subclass_feature',
          subclass: 'Draconic Bloodline'
        },
        {
          name: 'Dragon Wings',
          level: 14,
          description: 'You gain the ability to sprout a pair of dragon wings from your back, gaining a flying speed equal to your current speed. You can create these wings as a bonus action on your turn. They last until you dismiss them as a bonus action.',
          type: 'subclass_feature',
          subclass: 'Draconic Bloodline'
        },
        {
          name: 'Draconic Presence',
          level: 18,
          description: 'You can channel the dread presence of your dragon ancestor, causing creatures of your choice within 60 feet to become frightened or charmed (your choice) for 1 minute. You can use this feature once, regaining the ability when you finish a short or long rest, or by spending 5 sorcery points.',
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
        },
        {
          name: 'Bend Luck',
          level: 6,
          description: 'You have the ability to twist fate using your wild magic. When another creature you can see makes an attack roll, ability check, or saving throw, you can use your reaction and spend 2 sorcery points to roll 1d4 and apply the number rolled as a bonus or penalty to the creature\'s roll.',
          type: 'subclass_feature',
          subclass: 'Wild Magic'
        },
        {
          name: 'Controlled Chaos',
          level: 14,
          description: 'You gain a modicum of control over the surges of your wild magic. Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.',
          type: 'subclass_feature',
          subclass: 'Wild Magic'
        },
        {
          name: 'Spell Bombardment',
          level: 18,
          description: 'The harmful energy of your spells intensifies. When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again and add that roll to the damage. You can use this feature only once per turn.',
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
          description: 'Divine power guards your destiny. When you fail a saving throw or miss with an attack roll, you can roll 2d4 and add it to the total, possibly changing the outcome. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'Divine Soul'
        },
        {
          name: 'Empowered Healing',
          level: 6,
          description: 'The divine energy coursing through you can empower healing spells. Whenever you or an ally within 5 feet of you rolls dice to determine the number of hit points a spell restores, you can spend 1 sorcery point to reroll any number of those dice once, provided you aren\'t incapacitated.',
          type: 'subclass_feature',
          subclass: 'Divine Soul'
        },
        {
          name: 'Otherworldly Wings',
          level: 14,
          description: 'You can use a bonus action to manifest a pair of spectral wings from your back. While the wings are present, you have a flying speed of 30 feet. The wings last until you\'re incapacitated, you die, or you dismiss them as a bonus action.',
          type: 'subclass_feature',
          subclass: 'Divine Soul'
        },
        {
          name: 'Unearthly Recovery',
          level: 18,
          description: 'You gain the ability to overcome grievous injuries. As a bonus action when you have fewer than half your hit points remaining, you can regain a number of hit points equal to half your hit point maximum. Once you use this feature, you can\'t use it again until you finish a long rest.',
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
          description: 'You gain darkvision out to a range of 120 feet. When you reach 3rd level, you can cast the darkness spell using 2 sorcery points. You can see through any darkness spell you cast using this feature.',
          type: 'subclass_feature',
          subclass: 'Shadow Magic'
        },
        {
          name: 'Strength of the Grave',
          level: 1,
          description: 'Your existence is suffused with the energy of death. When damage reduces you to 0 hit points, you can make a Charisma saving throw (DC 5 + the damage taken). On a success, you instead drop to 1 hit point. You can\'t use this feature if you are reduced to 0 hit points by radiant damage or a critical hit.',
          type: 'subclass_feature',
          subclass: 'Shadow Magic'
        },
        {
          name: 'Hound of Ill Omen',
          level: 6,
          description: 'You can summon a hound of ill omen to target one creature you can see within 120 feet. The hound uses a dire wolf\'s statistics, appears in an unoccupied space within 30 feet of the target, and only the target and you can see it. On its turn, it moves toward the target and attacks only that target. It can move through creatures and objects as if they were difficult terrain, taking 5 force damage if it ends its turn inside an object. At the start of its turn, the hound automatically knows the target\'s location. The hound appears with temporary hit points equal to half your sorcerer level. It can make opportunity attacks, but only against its target. Additionally, while the hound is within 5 feet of the target, the target has disadvantage on saving throws against any spell you cast. The hound disappears if reduced to 0 hit points, if its target is reduced to 0 hit points, or after 5 minutes. To use this feature, you must spend 3 sorcery points.',
          type: 'subclass_feature',
          subclass: 'Shadow Magic'
        },
        {
          name: 'Shadow Walk',
          level: 14,
          description: 'You gain the ability to step from one shadow into another. When you are in dim light or darkness, as a bonus action you can magically teleport up to 120 feet to an unoccupied space you can see that is also in dim light or darkness.',
          type: 'subclass_feature',
          subclass: 'Shadow Magic'
        },
        {
          name: 'Umbral Form',
          level: 18,
          description: 'You can spend 6 sorcery points as a bonus action to magically transform yourself into a shadowy form. In this form, you have resistance to all damage except force and radiant damage, and you can move through other creatures and objects as if they were difficult terrain. You take 5 force damage if you end your turn inside an object. You remain in this form for 1 minute. It ends early if you are incapacitated, if you die, or if you dismiss it as a bonus action.',
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
          description: 'You can speak, read, and write Primordial. Knowing this language allows you to understand and be understood by those who speak its dialects: Aquan, Auran, Ignan, and Terran.',
          type: 'subclass_feature',
          subclass: 'Storm Sorcery'
        },
        {
          name: 'Tempestuous Magic',
          level: 1,
          description: 'You can use a bonus action on your turn to cause whirling gusts of elemental air to briefly surround you, immediately before or after you cast a spell of 1st level or higher. Doing so allows you to fly up to 10 feet without provoking opportunity attacks.',
          type: 'subclass_feature',
          subclass: 'Storm Sorcery'
        },
        {
          name: 'Heart of the Storm',
          level: 6,
          description: 'You gain resistance to lightning and thunder damage. In addition, whenever you start casting a spell of 1st level or higher that deals lightning or thunder damage, stormy magic erupts from you. This eruption causes creatures of your choice that you can see within 10 feet of you to take lightning or thunder damage (your choice) equal to half your sorcerer level.',
          type: 'subclass_feature',
          subclass: 'Storm Sorcery'
        },
        {
          name: 'Storm Guide',
          level: 6,
          description: 'You gain the ability to subtly control the weather around you. If it is raining, you can use an action to cause the rain to stop falling in a 20-foot-radius sphere centered on you. You can end this effect as a bonus action. If it is windy, you can use a bonus action each round to choose the direction that the wind blows in a 100-foot-radius sphere centered on you. The wind blows in that direction until the end of your next turn. This feature doesn\'t alter the speed of the wind.',
          type: 'subclass_feature',
          subclass: 'Storm Sorcery'
        },
        {
          name: 'Storm\'s Fury',
          level: 14,
          description: 'When you are hit by a melee attack, you can use your reaction to deal lightning damage to the attacker. The damage equals your sorcerer level. The attacker must also make a Strength saving throw against your sorcerer spell save DC. On a failed save, the attacker is pushed in a straight line up to 20 feet away from you.',
          type: 'subclass_feature',
          subclass: 'Storm Sorcery'
        },
        {
          name: 'Wind Soul',
          level: 18,
          description: 'You gain immunity to lightning and thunder damage. You also gain a magical flying speed of 60 feet. As an action, you can reduce your flying speed to 30 feet for 1 hour and choose a number of creatures within 30 feet of you equal to 3 + your Charisma modifier. The chosen creatures gain a magical flying speed of 30 feet for 1 hour. Once you reduce your flying speed in this way, you can\'t do so again until you finish a short or long rest.',
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
          description: 'You learn additional spells when you reach certain levels in this class. Each of these spells counts as a sorcerer spell for you, but it doesn\'t count against the number of sorcerer spells you know. Whenever you gain a sorcerer level, you can replace one spell you gained from this feature with another spell of the same level from the divination or enchantment school of magic from either the sorcerer or wizard spell list. When you cast any spell of 1st level or higher from your Psionic Spells feature, you can cast it by expending a spell slot as normal or by spending a number of sorcery points equal to the spell\'s level. If you cast the spell using sorcery points, it requires no verbal or somatic components, and it requires no material components, unless they are consumed by the spell.',
          type: 'subclass_feature',
          subclass: 'Aberrant Mind'
        },
        {
          name: 'Telepathic Speech',
          level: 1,
          description: 'You can form a telepathic connection between your mind and the mind of another. As a bonus action, choose one creature you can see within 30 feet of you. You and the chosen creature can speak telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile). To understand each other, you each must speak mentally in a language the other knows. The telepathic connection lasts for a number of minutes equal to your sorcerer level. It ends early if you are incapacitated or die or if you use this ability to form a connection with a different creature.',
          type: 'subclass_feature',
          subclass: 'Aberrant Mind'
        },
        {
          name: 'Psionic Sorcery',
          level: 6,
          description: 'When you cast any spell of 1st level or higher from your Psionic Spells feature, you can cast it by expending a spell slot as normal or by spending a number of sorcery points equal to the spell\'s level. If you cast the spell using sorcery points, it requires no verbal or somatic components, and it requires no material components, unless they are consumed by the spell.',
          type: 'subclass_feature',
          subclass: 'Aberrant Mind'
        },
        {
          name: 'Psychic Defenses',
          level: 6,
          description: 'You gain resistance to psychic damage, and you have advantage on saving throws against being charmed or frightened.',
          type: 'subclass_feature',
          subclass: 'Aberrant Mind'
        },
        {
          name: 'Revelation in Flesh',
          level: 14,
          description: 'You can unleash the aberrant truth hidden within yourself. As a bonus action, you can spend 1 or more sorcery points to magically transform your body for 10 minutes. For each sorcery point you spend, you can gain one of the following benefits of your choice, the effects of which last until the transformation ends: You can see any invisible creature within 60 feet of you, provided it isn\'t behind total cover. You also see into the Ethereal Plane within 60 feet; You gain a flying speed equal to your walking speed, and you can hover; You gain a swimming speed equal to twice your walking speed, and you can breathe underwater; Your body, along with any equipment you are wearing or carrying, becomes pliable. You can move through any space as narrow as 1 inch without squeezing, and you can spend 5 feet of movement to escape from nonmagical restraints or being grappled.',
          type: 'subclass_feature',
          subclass: 'Aberrant Mind'
        },
        {
          name: 'Warping Implosion',
          level: 18,
          description: 'You can unleash your aberrant power as a space-warping anomaly. As an action, you can teleport to an unoccupied space you can see within 120 feet of you. Immediately after you disappear, each creature within 30 feet of the space you left must make a Strength saving throw. On a failed save, a creature takes 3d10 force damage and is pulled straight toward the space you left, ending in an unoccupied space as close to your former space as possible. On a successful save, the creature takes half as much damage and isn\'t pulled. Once you use this feature, you can\'t do so again until you finish a long rest, unless you spend 5 sorcery points to use it again.',
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
          description: 'You learn additional spells when you reach certain levels in this class. Each of these spells counts as a sorcerer spell for you, but it doesn\'t count against the number of sorcerer spells you know. Whenever you gain a sorcerer level, you can replace one spell you gained from this feature with another spell of the same level from the abjuration or transmutation school of magic from either the sorcerer or wizard spell list.',
          type: 'subclass_feature',
          subclass: 'Clockwork Soul'
        },
        {
          name: 'Restore Balance',
          level: 1,
          description: 'Your connection to the plane of absolute order allows you to equalize chaotic moments. When a creature you can see within 60 feet of you is about to roll a d20 with advantage or disadvantage, you can use your reaction to prevent the roll from being affected by advantage and disadvantage. You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Clockwork Soul'
        },
        {
          name: 'Bastion of Law',
          level: 6,
          description: 'You can tap into the grand equation of existence to imbue a creature with a shimmering shield of order. As an action, you can expend 1 to 5 sorcery points to create a magical ward around yourself or another creature you can see within 30 feet of you. The ward lasts until you finish a long rest or until you use this feature again. The ward is represented by a number of d8s equal to the number of sorcery points spent to create it. When the warded creature takes damage, it can expend a number of those dice, roll them, and reduce the damage taken by the total rolled on those dice.',
          type: 'subclass_feature',
          subclass: 'Clockwork Soul'
        },
        {
          name: 'Trance of Order',
          level: 14,
          description: 'You gain the ability to align your consciousness to the endless calculations of Mechanus. As a bonus action, you can enter this state for 1 minute. For the duration, attack rolls against you can\'t benefit from advantage, and whenever you make an attack roll, an ability check, or a saving throw, you can treat a roll of 9 or lower on the d20 as a 10. Once you use this bonus action, you can\'t use it again until you finish a long rest, unless you spend 5 sorcery points to use it again.',
          type: 'subclass_feature',
          subclass: 'Clockwork Soul'
        },
        {
          name: 'Clockwork Cavalcade',
          level: 18,
          description: 'You summon spirits of order to expunge disorder around you. As an action, you summon the spirits in a 30-foot cube originating from you. The spirits look like modrons or other constructs of your choice. The spirits are intangible and invulnerable, and they create the following effects within the cube before vanishing: The spirits restore up to 100 hit points, divided as you choose among any number of creatures of your choice in the cube; Any damaged objects entirely in the cube are repaired instantly; Every spell of 6th level or lower ends on creatures and objects of your choice in the cube. Once you use this action, you can\'t use it again until you finish a long rest, unless you spend 7 sorcery points to use it again.',
          type: 'subclass_feature',
          subclass: 'Clockwork Soul'
        }
      ]
    },
    {
      id: 'sorcerer-stone',
      name: 'Stone Sorcery (UA)',
      description: '[UA] Your magic comes from the Elemental Plane of Earth, granting durability and martial prowess.',
      features: [
        {
          name: 'Bonus Proficiencies',
          level: 1,
          description: 'You gain proficiency with shields, simple weapons, and martial weapons.',
          type: 'subclass_feature',
          subclass: 'Stone Sorcery (UA)'
        },
        {
          name: 'Stone\'s Durability',
          level: 1,
          description: 'Your hit point maximum increases by 1, and it increases by 1 again whenever you gain a level in this class. As an action, you can gain a base AC of 13 + your Constitution modifier if you aren\'t wearing armor, and your skin assumes a stony appearance. This effect lasts until you end it as a bonus action, you are incapacitated, or you don armor other than a shield.',
          type: 'subclass_feature',
          subclass: 'Stone Sorcery (UA)'
        },
        {
          name: 'Stone Aegis',
          level: 6,
          description: 'You can use a bonus action to grant an aegis to one allied creature you can see within 60 feet. The aegis is a dim, gray aura of protection. Until the start of your next turn, the target has half cover, and if the target is hit by an attack, you can use your reaction to teleport to an unoccupied space you can see within 5 feet of the target. You can then make one melee weapon attack against the attacker if it is within your weapon\'s reach. The aegis ends early if you are incapacitated or you use this feature again.',
          type: 'subclass_feature',
          subclass: 'Stone Sorcery (UA)'
        },
        {
          name: 'Stone\'s Edge',
          level: 14,
          description: 'Once per turn when you deal damage to a creature with a spell, you can deal an extra 1d10 force damage to that creature. In addition, when you take damage from a creature that is within 5 feet of you, you can use your reaction to deal 1d10 force damage to that creature.',
          type: 'subclass_feature',
          subclass: 'Stone Sorcery (UA)'
        },
        {
          name: 'Earth Master\'s Aegis',
          level: 18,
          description: 'When you use your Stone\'s Aegis to protect an ally, you can choose up to three creatures to gain its benefits.',
          type: 'subclass_feature',
          subclass: 'Stone Sorcery (UA)'
        }
      ]
    },
    {
      id: 'sorcerer-phoenix',
      name: 'Phoenix Sorcery (UA)',
      description: '[UA] Your power draws from the immortal flame of a phoenix.',
      features: [
        {
          name: 'Ignite',
          level: 1,
          description: 'At 1st level, you gain the ability to start fires with a touch. As an action, you can magically ignite a flammable object you touch with your hand—an object such as a torch, a piece of tinder, or the hem of drapes.',
          type: 'subclass_feature',
          subclass: 'Phoenix Sorcery (UA)'
        },
        {
          name: 'Mantle of Flame',
          level: 1,
          description: 'Starting at 1st level, you can unleash the phoenix fire that blazes within you. As a bonus action, you magically wreathe yourself in swirling fire, as your eyes glow like hot coals. For 1 minute, you gain the following benefits: You shed bright light in a 30-foot radius and dim light for an additional 30 feet; Any creature takes fire damage equal to your Charisma modifier if it hits you with a melee attack from within 5 feet of you or if it touches you; Whenever you roll fire damage on your turn, the roll gains a bonus equal to your Charisma modifier. Once you use this feature, you can\'t use it again until you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Phoenix Sorcery (UA)'
        },
        {
          name: 'Phoenix Spark',
          level: 6,
          description: 'Starting at 6th level, the fiery energy within you grows restless and vengeful. In the face of defeat, it surges outward to preserve you in a fiery roar. If you are reduced to 0 hit points, you can use your reaction to draw on the spark of the phoenix. You are instead reduced to 1 hit point, and each creature within 10 feet of you takes fire damage equal to half your sorcerer level + your Charisma modifier. If you use this feature while under the effects of your Mantle of Flame, this feature instead deals fire damage equal to your sorcerer level + double your Charisma modifier, and your Mantle of Flame immediately ends. Once you use this feature, you can\'t use it again until you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'Phoenix Sorcery (UA)'
        },
        {
          name: 'Nourishing Fire',
          level: 14,
          description: 'Starting at 14th level, your fire spells soothe and restore you. When you expend a spell slot to cast a spell that includes a fire damage roll, you regain hit points equal to the slot\'s level + your Charisma modifier.',
          type: 'subclass_feature',
          subclass: 'Phoenix Sorcery (UA)'
        },
        {
          name: 'Form of the Phoenix',
          level: 18,
          description: 'At 18th level, you finally master the spark of fire that dances within you. While under the effect of your Mantle of Flame feature, you gain additional benefits: You have a flying speed of 40 feet and can hover; You have resistance to all damage; If you use your Phoenix Spark, that feature deals an extra 20 fire damage to each creature.',
          type: 'subclass_feature',
          subclass: 'Phoenix Sorcery (UA)'
        }
      ]
    },
    {
      id: 'sorcerer-giant-soul',
      name: 'Giant Soul (UA)',
      description: '[UA] Your innate magic comes from the power of giants.',
      features: [
        {
          name: 'Jotun Resilience',
          level: 1,
          description: 'The resilience of giants flows through your body. Your hit point maximum increases by 1, and it increases by 1 again whenever you gain a level in this class. Additionally, you have advantage on Strength saving throws.',
          type: 'subclass_feature',
          subclass: 'Giant Soul (UA)'
        },
        {
          name: 'Mark of the Ordning',
          level: 1,
          description: 'At 1st level, you discover innate magical abilities within yourself that are based on your giant heritage. Select a type of giant from the Mark of the Ordning table. At 1st level, you learn the cantrip associated with your choice. At 3rd level and again at 5th level, you learn the spell associated with your choice and can cast it without expending a spell slot. Once you cast a spell with this feature, you can\'t cast that spell with it again until you finish a long rest. Constitution is your spellcasting ability for these spells.',
          type: 'subclass_feature',
          subclass: 'Giant Soul (UA)'
        },
        {
          name: 'Soul of Lost Ostoria',
          level: 6,
          description: 'Starting at 6th level, you learn to channel the souls of long-dead giants. As a bonus action, you can spend 1 or more sorcery points to transform for 1 minute. For each sorcery point you spend, your size can increase by one category—from Medium to Large, or Large to Huge (up to a maximum of Huge). Once you reach Large size, you can choose to gain the following benefits for each additional sorcery point you spend: You gain advantage on Strength checks; Your speed increases by 5 feet; Your reach increases by 5 feet.',
          type: 'subclass_feature',
          subclass: 'Giant Soul (UA)'
        },
        {
          name: 'Rage of Fallen Ostoria',
          level: 14,
          description: 'Starting at 14th level, you can channel the rage of giants when your recklessness gives you the upper hand in battle. When you use your Tides of Chaos feature, you can immediately make one weapon attack or cast a cantrip as a bonus action.',
          type: 'subclass_feature',
          subclass: 'Giant Soul (UA)'
        },
        {
          name: 'Blessing of the All Father',
          level: 18,
          description: 'At 18th level, your soul swells with the power of giants. You add your Constitution modifier (minimum of 1) to the damage you deal with sorcerer cantrips. In addition, when you use your Soul of Lost Ostoria feature, you can increase your size by up to two categories (from Medium to Huge), and your transformation lasts for 10 minutes instead of 1 minute.',
          type: 'subclass_feature',
          subclass: 'Giant Soul (UA)'
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
          description: 'When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).',
          type: 'subclass_feature',
          subclass: 'The Fiend'
        },
        {
          name: 'Dark One\'s Own Luck',
          level: 6,
          description: 'You can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll\'s effects occur. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'The Fiend'
        },
        {
          name: 'Fiendish Resilience',
          level: 10,
          description: 'You can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.',
          type: 'subclass_feature',
          subclass: 'The Fiend'
        },
        {
          name: 'Hurl Through Hell',
          level: 14,
          description: 'When you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape. At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience. Once you use this feature, you can\'t use it again until you finish a long rest.',
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
          description: 'Your patron bestows upon you the ability to project the beguiling and fearsome presence of the fey. As an action, you can cause each creature in a 10-foot cube originating from you to make a Wisdom saving throw against your warlock spell save DC. The creatures that fail their saving throws are all charmed or frightened by you (your choice) until the end of your next turn. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'The Archfey'
        },
        {
          name: 'Misty Escape',
          level: 6,
          description: 'You can vanish in a puff of mist in response to harm. When you take damage, you can use your reaction to turn invisible and teleport up to 60 feet to an unoccupied space you can see. You remain invisible until the start of your next turn or until you attack or cast a spell. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'The Archfey'
        },
        {
          name: 'Beguiling Defenses',
          level: 10,
          description: 'Your patron teaches you how to turn the mind-affecting magic of your enemies against them. You are immune to being charmed, and when another creature attempts to charm you, you can use your reaction to attempt to turn the charm back on that creature. The creature must succeed on a Wisdom saving throw against your warlock spell save DC or be charmed by you for 1 minute or until the creature takes any damage.',
          type: 'subclass_feature',
          subclass: 'The Archfey'
        },
        {
          name: 'Dark Delirium',
          level: 14,
          description: 'You can plunge a creature into an illusory realm. As an action, choose a creature that you can see within 60 feet of you. It must make a Wisdom saving throw against your warlock spell save DC. On a failed save, it is charmed or frightened by you (your choice) for 1 minute or until your concentration is broken (as if you are concentrating on a spell). This effect ends early if the creature takes any damage. Until this illusion ends, the creature thinks it is lost in a misty realm, the appearance of which you choose. The creature can see and hear only itself, you, and the illusion. You must finish a short or long rest before you can use this feature again.',
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
        },
        {
          name: 'Entropic Ward',
          level: 6,
          description: 'You learn to magically ward yourself against attack and to turn an enemy\'s failed strike into good luck for yourself. When a creature makes an attack roll against you, you can use your reaction to impose disadvantage on that roll. If the attack misses you, your next attack roll against the creature has advantage if you make it before the end of your next turn. Once you use this feature, you can\'t use it again until you finish a short or long rest.',
          type: 'subclass_feature',
          subclass: 'The Great Old One'
        },
        {
          name: 'Thought Shield',
          level: 10,
          description: 'Your thoughts can\'t be read by telepathy or other means unless you allow it. You also have resistance to psychic damage, and whenever a creature deals psychic damage to you, that creature takes the same amount of damage that you do.',
          type: 'subclass_feature',
          subclass: 'The Great Old One'
        },
        {
          name: 'Create Thrall',
          level: 14,
          description: 'You gain the ability to infect a humanoid\'s mind with the alien magic of your patron. You can use your action to touch an incapacitated humanoid. That creature is then charmed by you until a remove curse spell is cast on it, the charmed condition is removed from it, or you use this feature again. You can communicate telepathically with the charmed creature as long as the two of you are on the same plane of existence.',
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
          description: 'You gain the ability to channel celestial energy to heal wounds. You have a pool of d6s equal to 1 + your warlock level. As a bonus action, you can heal one creature you can see within 60 feet of you, spending dice from the pool. Roll the dice you spend, add them together, and restore that many hit points. This pool regains all expended dice when you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'The Celestial'
        },
        {
          name: 'Radiant Soul',
          level: 6,
          description: 'Your link to the Celestial allows you to serve as a conduit for radiant energy. You have resistance to radiant damage, and when you cast a spell that deals radiant or fire damage, you can add your Charisma modifier to one radiant or fire damage roll of that spell against one of its targets.',
          type: 'subclass_feature',
          subclass: 'The Celestial'
        },
        {
          name: 'Celestial Resistance',
          level: 10,
          description: 'You gain temporary hit points whenever you finish a short or long rest. These temporary hit points equal your warlock level + your Charisma modifier. Additionally, choose up to five creatures you can see at the end of the rest. Those creatures each gain temporary hit points equal to half your warlock level + your Charisma modifier.',
          type: 'subclass_feature',
          subclass: 'The Celestial'
        },
        {
          name: 'Searing Vengeance',
          level: 14,
          description: 'The radiant energy you channel allows you to resist death. When you have to make a death saving throw at the start of your turn, you can instead spring back to your feet with a burst of radiant energy. You regain hit points equal to half your hit point maximum, and then you stand up if you so choose. Each creature of your choice that is within 30 feet of you takes radiant damage equal to 2d8 + your Charisma modifier, and it is blinded until the end of the current turn. Once you use this feature, you can\'t use it again until you finish a long rest.',
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
          description: 'You gain proficiency with medium armor, shields, and martial weapons. The influence of your patron also allows you to mystically channel your will through a particular weapon. Whenever you finish a long rest, you can touch one weapon that you are proficient with and that lacks the two-handed property. When you attack with that weapon, you can use your Charisma modifier, instead of Strength or Dexterity, for the attack and damage rolls.',
          type: 'subclass_feature',
          subclass: 'The Hexblade'
        },
        {
          name: 'Accursed Specter',
          level: 6,
          description: 'You can curse the soul of a person you slay, temporarily binding it in your service. When you slay a humanoid, you can cause its spirit to rise from its corpse as a specter. When the specter appears, it gains temporary hit points equal to half your warlock level. Roll initiative for the specter, which has its own turns. The specter remains in your service until the end of your next long rest, at which point it vanishes to the afterlife. Once you bind a specter with this feature, you can\'t use the feature again until you finish a long rest.',
          type: 'subclass_feature',
          subclass: 'The Hexblade'
        },
        {
          name: 'Armor of Hexes',
          level: 10,
          description: 'Your hex grows more powerful. If the target cursed by your Hexblade\'s Curse hits you with an attack roll, you can use your reaction to roll a d6. On a 4 or higher, the attack instead misses you, regardless of its roll.',
          type: 'subclass_feature',
          subclass: 'The Hexblade'
        },
        {
          name: 'Master of Hexes',
          level: 14,
          description: 'You can spread your Hexblade\'s Curse from a slain creature to another creature. When the creature cursed by your Hexblade\'s Curse dies, you can apply the curse to a different creature you can see within 30 feet of you, provided you aren\'t incapacitated. When you apply the curse in this way, you don\'t regain hit points from the death of the previously cursed creature.',
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
          description: 'You gain a swimming speed of 40 feet, and you can breathe underwater.',
          type: 'subclass_feature',
          subclass: 'The Fathomless'
        },
        {
          name: 'Oceanic Soul',
          level: 6,
          description: 'You are now even more at home in the depths. You gain resistance to cold damage. In addition, when you are fully submerged, any creature that is also fully submerged can understand your speech, and you can understand theirs.',
          type: 'subclass_feature',
          subclass: 'The Fathomless'
        },
        {
          name: 'Guardian Coil',
          level: 10,
          description: 'Your Tentacle of the Deeps can defend you and others, interposing itself between them and harm. When you or a creature you can see takes damage while within 10 feet of the tentacle, you can use your reaction to choose one of those creatures and reduce the damage to that creature by 1d8. When you reach certain levels in this class, the damage reduction increases: at 10th level (1d8) and at 17th level (2d8).',
          type: 'subclass_feature',
          subclass: 'The Fathomless'
        },
        {
          name: 'Grasping Tentacles',
          level: 14,
          description: 'You learn the spell Evard\'s Black Tentacles. It counts as a warlock spell for you, but it doesn\'t count against the number of spells you know. You can also cast it once without a spell slot, and you regain the ability to do so when you finish a long rest. Whenever you cast this spell, your patron\'s magic bolsters you, granting you a number of temporary hit points equal to your warlock level. Moreover, damage can\'t break your concentration on this spell.',
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
