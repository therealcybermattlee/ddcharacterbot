import React, { useState, useEffect, useMemo } from 'react'
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '../../ui'
import { WizardStepProps } from '../../../types/wizard'
import { useCharacterCreation } from '../../../contexts/CharacterCreationContext'
import { getAbilityModifier, type AbilityName } from '../../../types/dnd5e'

// Equipment Item Interface
interface EquipmentItem {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'shield' | 'tool' | 'gear' | 'ammunition'
  description?: string
  quantity: number
  weight?: number
  value?: number // in copper pieces
  properties?: string[]
  damage?: string
  armorClass?: number
}

// Spell Interface
interface Spell {
  id: string
  name: string
  level: number
  school: 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation'
  castingTime: string
  range: string
  components: ('V' | 'S' | 'M')[]
  materialComponent?: string
  duration: string
  description: string
  classes: string[]
  ritual?: boolean
  concentration?: boolean
}

// Equipment Pack Interface
interface EquipmentPack {
  id: string
  name: string
  description: string
  items: EquipmentItem[]
  totalWeight: number
  totalValue: number
}

// Class Equipment Choices Interface
interface ClassEquipmentChoices {
  choices: Array<{
    description: string
    options: EquipmentItem[][]
  }>
  equipmentPack: EquipmentPack
  additionalEquipment?: EquipmentItem[]
}

// Spellcasting Class Info
interface SpellcastingClassInfo {
  spellcastingAbility: AbilityName
  cantripsKnown: number
  spellsKnown?: number
  canPrepareSpells: boolean
  spellSlots: { level: number; slots: number }[]
  ritualCasting?: boolean
  spellcastingFocus?: string
  spellbook?: boolean
  availableSpells: string[] // spell IDs
}

// Equipment Packs Data
const EQUIPMENT_PACKS: Record<string, EquipmentPack> = {
  burglar: {
    id: 'burglar',
    name: "Burglar's Pack",
    description: "Includes a backpack, bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days rations, a tinderbox, a waterskin, and 50 feet of hempen rope.",
    totalWeight: 46.5,
    totalValue: 1600,
    items: [
      { id: 'backpack', name: 'Backpack', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'ball_bearings', name: 'Ball Bearings (bag of 1,000)', type: 'gear', quantity: 1, weight: 2, value: 100 },
      { id: 'string_10ft', name: 'String (10 feet)', type: 'gear', quantity: 1, weight: 0, value: 1 },
      { id: 'bell', name: 'Bell', type: 'gear', quantity: 1, weight: 0, value: 100 },
      { id: 'candle', name: 'Candle', type: 'gear', quantity: 5, weight: 0, value: 1 },
      { id: 'crowbar', name: 'Crowbar', type: 'tool', quantity: 1, weight: 5, value: 200 },
      { id: 'hammer', name: 'Hammer', type: 'tool', quantity: 1, weight: 3, value: 200 },
      { id: 'piton', name: 'Piton', type: 'gear', quantity: 10, weight: 2.5, value: 50 },
      { id: 'hooded_lantern', name: 'Hooded Lantern', type: 'gear', quantity: 1, weight: 2, value: 500 },
      { id: 'oil_flask', name: 'Oil Flask', type: 'gear', quantity: 2, weight: 2, value: 10 },
      { id: 'rations', name: 'Rations (5 days)', type: 'gear', quantity: 1, weight: 10, value: 1000 },
      { id: 'tinderbox', name: 'Tinderbox', type: 'gear', quantity: 1, weight: 1, value: 50 },
      { id: 'waterskin', name: 'Waterskin', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'rope_hempen', name: 'Hempen Rope (50 feet)', type: 'gear', quantity: 1, weight: 10, value: 200 }
    ]
  },
  diplomat: {
    id: 'diplomat',
    name: "Diplomat's Pack",
    description: "Includes a chest, 2 cases for maps and scrolls, a set of fine clothes, a bottle of ink, an ink pen, a lamp, 2 flasks of oil, 5 sheets of paper, a vial of perfume, sealing wax, and soap.",
    totalWeight: 39,
    totalValue: 3900,
    items: [
      { id: 'chest', name: 'Chest', type: 'gear', quantity: 1, weight: 25, value: 500 },
      { id: 'map_case', name: 'Map or Scroll Case', type: 'gear', quantity: 2, weight: 1, value: 100 },
      { id: 'fine_clothes', name: 'Fine Clothes', type: 'gear', quantity: 1, weight: 6, value: 1500 },
      { id: 'ink', name: 'Ink (1 ounce bottle)', type: 'gear', quantity: 1, weight: 0, value: 1000 },
      { id: 'ink_pen', name: 'Ink Pen', type: 'gear', quantity: 1, weight: 0, value: 2 },
      { id: 'lamp', name: 'Lamp', type: 'gear', quantity: 1, weight: 1, value: 50 },
      { id: 'oil_flask', name: 'Oil Flask', type: 'gear', quantity: 2, weight: 2, value: 10 },
      { id: 'paper', name: 'Paper (5 sheets)', type: 'gear', quantity: 1, weight: 0, value: 100 },
      { id: 'perfume', name: 'Perfume (vial)', type: 'gear', quantity: 1, weight: 0, value: 500 },
      { id: 'sealing_wax', name: 'Sealing Wax', type: 'gear', quantity: 1, weight: 0, value: 50 },
      { id: 'soap', name: 'Soap', type: 'gear', quantity: 1, weight: 0, value: 2 }
    ]
  },
  dungeoneer: {
    id: 'dungeoneer',
    name: "Dungeoneer's Pack",
    description: "Includes a backpack, a crowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, a waterskin, and 50 feet of hempen rope.",
    totalWeight: 61.5,
    totalValue: 1200,
    items: [
      { id: 'backpack', name: 'Backpack', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'crowbar', name: 'Crowbar', type: 'tool', quantity: 1, weight: 5, value: 200 },
      { id: 'hammer', name: 'Hammer', type: 'tool', quantity: 1, weight: 3, value: 200 },
      { id: 'piton', name: 'Piton', type: 'gear', quantity: 10, weight: 2.5, value: 50 },
      { id: 'torch', name: 'Torch', type: 'gear', quantity: 10, weight: 10, value: 10 },
      { id: 'tinderbox', name: 'Tinderbox', type: 'gear', quantity: 1, weight: 1, value: 50 },
      { id: 'rations', name: 'Rations (10 days)', type: 'gear', quantity: 1, weight: 20, value: 2000 },
      { id: 'waterskin', name: 'Waterskin', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'rope_hempen', name: 'Hempen Rope (50 feet)', type: 'gear', quantity: 1, weight: 10, value: 200 }
    ]
  },
  entertainer: {
    id: 'entertainer',
    name: "Entertainer's Pack",
    description: "Includes a backpack, a bedroll, 2 costumes, 5 candles, 5 days of rations, a waterskin, and a disguise kit.",
    totalWeight: 40,
    totalValue: 4000,
    items: [
      { id: 'backpack', name: 'Backpack', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'bedroll', name: 'Bedroll', type: 'gear', quantity: 1, weight: 7, value: 100 },
      { id: 'costume', name: 'Costume', type: 'gear', quantity: 2, weight: 8, value: 500 },
      { id: 'candle', name: 'Candle', type: 'gear', quantity: 5, weight: 0, value: 1 },
      { id: 'rations', name: 'Rations (5 days)', type: 'gear', quantity: 1, weight: 10, value: 1000 },
      { id: 'waterskin', name: 'Waterskin', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'disguise_kit', name: 'Disguise Kit', type: 'tool', quantity: 1, weight: 3, value: 2500 }
    ]
  },
  explorer: {
    id: 'explorer',
    name: "Explorer's Pack",
    description: "Includes a backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, a waterskin, and 50 feet of hempen rope.",
    totalWeight: 59,
    totalValue: 1000,
    items: [
      { id: 'backpack', name: 'Backpack', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'bedroll', name: 'Bedroll', type: 'gear', quantity: 1, weight: 7, value: 100 },
      { id: 'mess_kit', name: 'Mess Kit', type: 'gear', quantity: 1, weight: 1, value: 20 },
      { id: 'tinderbox', name: 'Tinderbox', type: 'gear', quantity: 1, weight: 1, value: 50 },
      { id: 'torch', name: 'Torch', type: 'gear', quantity: 10, weight: 10, value: 10 },
      { id: 'rations', name: 'Rations (10 days)', type: 'gear', quantity: 1, weight: 20, value: 2000 },
      { id: 'waterskin', name: 'Waterskin', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'rope_hempen', name: 'Hempen Rope (50 feet)', type: 'gear', quantity: 1, weight: 10, value: 200 }
    ]
  },
  priest: {
    id: 'priest',
    name: "Priest's Pack",
    description: "Includes a backpack, a blanket, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, vestments, 2 days of rations, and a waterskin.",
    totalWeight: 24,
    totalValue: 1900,
    items: [
      { id: 'backpack', name: 'Backpack', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'blanket', name: 'Blanket', type: 'gear', quantity: 1, weight: 3, value: 50 },
      { id: 'candle', name: 'Candle', type: 'gear', quantity: 10, weight: 0, value: 1 },
      { id: 'tinderbox', name: 'Tinderbox', type: 'gear', quantity: 1, weight: 1, value: 50 },
      { id: 'alms_box', name: 'Alms Box', type: 'gear', quantity: 1, weight: 1, value: 0 },
      { id: 'incense', name: 'Incense (2 blocks)', type: 'gear', quantity: 1, weight: 0, value: 0 },
      { id: 'censer', name: 'Censer', type: 'gear', quantity: 1, weight: 0, value: 500 },
      { id: 'vestments', name: 'Vestments', type: 'gear', quantity: 1, weight: 4, value: 0 },
      { id: 'rations', name: 'Rations (2 days)', type: 'gear', quantity: 1, weight: 4, value: 400 },
      { id: 'waterskin', name: 'Waterskin', type: 'gear', quantity: 1, weight: 5, value: 200 }
    ]
  },
  scholar: {
    id: 'scholar',
    name: "Scholar's Pack",
    description: "Includes a backpack, a book of lore, a bottle of ink, an ink pen, 10 sheets of parchment, a little bag of sand, and a small knife.",
    totalWeight: 10,
    totalValue: 4000,
    items: [
      { id: 'backpack', name: 'Backpack', type: 'gear', quantity: 1, weight: 5, value: 200 },
      { id: 'book_lore', name: 'Book of Lore', type: 'gear', quantity: 1, weight: 5, value: 2500 },
      { id: 'ink', name: 'Ink (1 ounce bottle)', type: 'gear', quantity: 1, weight: 0, value: 1000 },
      { id: 'ink_pen', name: 'Ink Pen', type: 'gear', quantity: 1, weight: 0, value: 2 },
      { id: 'parchment', name: 'Parchment (10 sheets)', type: 'gear', quantity: 1, weight: 0, value: 100 },
      { id: 'sand_bag', name: 'Little Bag of Sand', type: 'gear', quantity: 1, weight: 0, value: 0 },
      { id: 'knife_small', name: 'Small Knife', type: 'weapon', quantity: 1, weight: 0.5, value: 1000, damage: '1d4 slashing', properties: ['finesse', 'light', 'thrown'] }
    ]
  }
}

// Class Equipment and Spellcasting Data
const CLASS_EQUIPMENT_DATA: Record<string, ClassEquipmentChoices> = {
  fighter: {
    choices: [
      {
        description: "Choose armor:",
        options: [
          [{ id: 'chain_mail', name: 'Chain Mail', type: 'armor', quantity: 1, weight: 55, value: 7500, armorClass: 16, description: 'Heavy armor. AC 16. Stealth disadvantage.' }],
          [{ id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11, description: 'Light armor. AC 11 + Dex modifier.' }, { id: 'shield', name: 'Shield', type: 'shield', quantity: 1, weight: 6, value: 1000, armorClass: 2, description: '+2 AC. Requires one hand.' }]
        ]
      },
      {
        description: "Choose weapons:",
        options: [
          [{ id: 'longsword', name: 'Longsword', type: 'weapon', quantity: 1, weight: 3, value: 1500, damage: '1d8 slashing', properties: ['versatile'] }, { id: 'shield', name: 'Shield', type: 'shield', quantity: 1, weight: 6, value: 1000, armorClass: 2 }],
          [{ id: 'battleaxe', name: 'Battleaxe', type: 'weapon', quantity: 1, weight: 4, value: 1000, damage: '1d8 slashing', properties: ['versatile'] }, { id: 'handaxe', name: 'Handaxe', type: 'weapon', quantity: 1, weight: 2, value: 500, damage: '1d6 slashing', properties: ['light', 'thrown'] }]
        ]
      },
      {
        description: "Choose ranged weapon:",
        options: [
          [{ id: 'light_crossbow', name: 'Light Crossbow', type: 'weapon', quantity: 1, weight: 5, value: 2500, damage: '1d8 piercing', properties: ['ammunition', 'loading', 'two-handed'] }, { id: 'crossbow_bolts', name: 'Crossbow Bolts', type: 'ammunition', quantity: 20, weight: 1.5, value: 100 }],
          [{ id: 'handaxe', name: 'Handaxe', type: 'weapon', quantity: 2, weight: 4, value: 1000, damage: '1d6 slashing', properties: ['light', 'thrown'] }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.dungeoneer
  },
  wizard: {
    choices: [
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'quarterstaff', name: 'Quarterstaff', type: 'weapon', quantity: 1, weight: 4, value: 20, damage: '1d6 bludgeoning', properties: ['versatile'] }],
          [{ id: 'dagger', name: 'Dagger', type: 'weapon', quantity: 1, weight: 1, value: 200, damage: '1d4 piercing', properties: ['finesse', 'light', 'thrown'] }]
        ]
      },
      {
        description: "Choose spellcasting focus:",
        options: [
          [{ id: 'component_pouch', name: 'Component Pouch', type: 'gear', quantity: 1, weight: 2, value: 2500, description: 'A spellcasting focus for wizards.' }],
          [{ id: 'arcane_focus', name: 'Arcane Focus', type: 'gear', quantity: 1, weight: 1, value: 2000, description: 'A spellcasting focus for wizards.' }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.scholar,
    additionalEquipment: [
      { id: 'spellbook', name: 'Spellbook', type: 'gear', quantity: 1, weight: 3, value: 5000, description: 'Contains 6 1st-level wizard spells of your choice.' }
    ]
  },
  cleric: {
    choices: [
      {
        description: "Choose armor:",
        options: [
          [{ id: 'scale_mail', name: 'Scale Mail', type: 'armor', quantity: 1, weight: 45, value: 5000, armorClass: 14, description: 'Medium armor. AC 14 + Dex modifier (max 2). Stealth disadvantage.' }],
          [{ id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11 }, { id: 'shield', name: 'Shield', type: 'shield', quantity: 1, weight: 6, value: 1000, armorClass: 2 }]
        ]
      },
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'warhammer', name: 'Warhammer', type: 'weapon', quantity: 1, weight: 2, value: 1500, damage: '1d8 bludgeoning', properties: ['versatile'] }],
          [{ id: 'mace', name: 'Mace', type: 'weapon', quantity: 1, weight: 4, value: 500, damage: '1d6 bludgeoning' }]
        ]
      },
      {
        description: "Choose ranged weapon:",
        options: [
          [{ id: 'light_crossbow', name: 'Light Crossbow', type: 'weapon', quantity: 1, weight: 5, value: 2500, damage: '1d8 piercing' }, { id: 'crossbow_bolts', name: 'Crossbow Bolts', type: 'ammunition', quantity: 20, weight: 1.5, value: 100 }],
          [{ id: 'javelin', name: 'Javelin', type: 'weapon', quantity: 5, weight: 10, value: 250, damage: '1d6 piercing', properties: ['thrown'] }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.priest,
    additionalEquipment: [
      { id: 'shield', name: 'Shield', type: 'shield', quantity: 1, weight: 6, value: 1000, armorClass: 2 },
      { id: 'holy_symbol', name: 'Holy Symbol', type: 'gear', quantity: 1, weight: 1, value: 500, description: 'A spellcasting focus for clerics.' }
    ]
  },
  rogue: {
    choices: [
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'rapier', name: 'Rapier', type: 'weapon', quantity: 1, weight: 2, value: 2500, damage: '1d8 piercing', properties: ['finesse'] }],
          [{ id: 'shortsword', name: 'Shortsword', type: 'weapon', quantity: 1, weight: 2, value: 1000, damage: '1d6 piercing', properties: ['finesse', 'light'] }]
        ]
      },
      {
        description: "Choose ranged weapon:",
        options: [
          [{ id: 'shortbow', name: 'Shortbow', type: 'weapon', quantity: 1, weight: 2, value: 2500, damage: '1d6 piercing', properties: ['ammunition', 'two-handed'] }, { id: 'arrow', name: 'Arrows', type: 'ammunition', quantity: 20, weight: 1, value: 100 }],
          [{ id: 'shortsword', name: 'Shortsword', type: 'weapon', quantity: 1, weight: 2, value: 1000, damage: '1d6 piercing', properties: ['finesse', 'light'] }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.burglar,
    additionalEquipment: [
      { id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11 },
      { id: 'dagger', name: 'Dagger', type: 'weapon', quantity: 2, weight: 2, value: 400, damage: '1d4 piercing', properties: ['finesse', 'light', 'thrown'] },
      { id: 'thieves_tools', name: "Thieves' Tools", type: 'tool', quantity: 1, weight: 1, value: 2500, description: 'Proficiency with these tools lets you add your proficiency bonus to any ability checks you make to disarm traps or open locks.' }
    ]
  }
}

// Spellcasting Class Information
const SPELLCASTING_CLASSES: Record<string, SpellcastingClassInfo> = {
  wizard: {
    spellcastingAbility: 'intelligence',
    cantripsKnown: 3,
    spellsKnown: 6, // in spellbook at 1st level
    canPrepareSpells: true,
    spellSlots: [{ level: 1, slots: 2 }],
    spellbook: true,
    spellcastingFocus: 'Arcane Focus or Component Pouch',
    ritualCasting: true,
    availableSpells: ['wizard']
  },
  cleric: {
    spellcastingAbility: 'wisdom',
    cantripsKnown: 3,
    canPrepareSpells: true,
    spellSlots: [{ level: 1, slots: 2 }],
    spellcastingFocus: 'Holy Symbol',
    ritualCasting: true,
    availableSpells: ['cleric']
  },
  sorcerer: {
    spellcastingAbility: 'charisma',
    cantripsKnown: 4,
    spellsKnown: 2,
    canPrepareSpells: false,
    spellSlots: [{ level: 1, slots: 2 }],
    spellcastingFocus: 'Arcane Focus or Component Pouch',
    availableSpells: ['sorcerer']
  },
  warlock: {
    spellcastingAbility: 'charisma',
    cantripsKnown: 2,
    spellsKnown: 2,
    canPrepareSpells: false,
    spellSlots: [{ level: 1, slots: 1 }], // Pact Magic - short rest recovery
    spellcastingFocus: 'Arcane Focus or Component Pouch',
    availableSpells: ['warlock']
  }
}

// Sample Spells by Class
const SPELLS_BY_CLASS: Record<string, Spell[]> = {
  wizard: [
    // Cantrips
    { id: 'fire_bolt', name: 'Fire Bolt', level: 0, school: 'Evocation', castingTime: '1 action', range: '120 feet', components: ['V', 'S'], duration: 'Instantaneous', description: 'You hurl a mote of fire at a creature or object within range. Make a ranged spell attack. On a hit, the target takes 1d10 fire damage.', classes: ['wizard'] },
    { id: 'mage_hand', name: 'Mage Hand', level: 0, school: 'Conjuration', castingTime: '1 action', range: '30 feet', components: ['V', 'S'], duration: '1 minute', description: 'A spectral, floating hand appears at a point you choose within range.', classes: ['wizard'] },
    { id: 'prestidigitation', name: 'Prestidigitation', level: 0, school: 'Transmutation', castingTime: '1 action', range: '10 feet', components: ['V', 'S'], duration: 'Up to 1 hour', description: 'This spell is a minor magical trick that novice spellcasters use for practice.', classes: ['wizard'] },
    { id: 'light', name: 'Light', level: 0, school: 'Evocation', castingTime: '1 action', range: 'Touch', components: ['V', 'M'], materialComponent: 'a firefly or phosphorescent moss', duration: '1 hour', description: 'You touch one object that is no larger than 10 feet in any dimension.', classes: ['wizard'] },
    // 1st Level
    { id: 'magic_missile', name: 'Magic Missile', level: 1, school: 'Evocation', castingTime: '1 action', range: '120 feet', components: ['V', 'S'], duration: 'Instantaneous', description: 'You create three glowing darts of magical force.', classes: ['wizard'] },
    { id: 'shield', name: 'Shield', level: 1, school: 'Abjuration', castingTime: '1 reaction', range: 'Self', components: ['V', 'S'], duration: '1 round', description: 'An invisible barrier of magical force appears and protects you.', classes: ['wizard'] },
    { id: 'detect_magic', name: 'Detect Magic', level: 1, school: 'Divination', castingTime: '1 action', range: 'Self', components: ['V', 'S'], duration: 'Concentration, up to 10 minutes', concentration: true, ritual: true, description: 'For the duration, you sense the presence of magic within 30 feet of you.', classes: ['wizard'] },
    { id: 'sleep', name: 'Sleep', level: 1, school: 'Enchantment', castingTime: '1 action', range: '90 feet', components: ['V', 'S', 'M'], materialComponent: 'a pinch of fine sand, rose petals, or a cricket', duration: '1 minute', description: 'This spell sends creatures into a magical slumber.', classes: ['wizard'] },
    { id: 'burning_hands', name: 'Burning Hands', level: 1, school: 'Evocation', castingTime: '1 action', range: 'Self (15-foot cone)', components: ['V', 'S'], duration: 'Instantaneous', description: 'A thin sheet of flames shoots forth from your outstretched fingertips.', classes: ['wizard'] },
    { id: 'charm_person', name: 'Charm Person', level: 1, school: 'Enchantment', castingTime: '1 action', range: '30 feet', components: ['V', 'S'], duration: 'Concentration, up to 1 hour', concentration: true, description: 'You attempt to charm a humanoid you can see within range.', classes: ['wizard'] }
  ],
  cleric: [
    // Cantrips
    { id: 'sacred_flame', name: 'Sacred Flame', level: 0, school: 'Evocation', castingTime: '1 action', range: '60 feet', components: ['V', 'S'], duration: 'Instantaneous', description: 'Flame-like radiance descends on a creature that you can see within range.', classes: ['cleric'] },
    { id: 'guidance', name: 'Guidance', level: 0, school: 'Divination', castingTime: '1 action', range: 'Touch', components: ['V', 'S'], duration: 'Concentration, up to 1 minute', concentration: true, description: 'You touch one willing creature.', classes: ['cleric'] },
    { id: 'thaumaturgy', name: 'Thaumaturgy', level: 0, school: 'Transmutation', castingTime: '1 action', range: '30 feet', components: ['V'], duration: 'Up to 1 minute', description: 'You manifest a minor wonder, a sign of supernatural power, within range.', classes: ['cleric'] },
    { id: 'spare_the_dying', name: 'Spare the Dying', level: 0, school: 'Necromancy', castingTime: '1 action', range: 'Touch', components: ['V', 'S'], duration: 'Instantaneous', description: 'You touch a living creature that has 0 hit points.', classes: ['cleric'] },
    // 1st Level
    { id: 'cure_wounds', name: 'Cure Wounds', level: 1, school: 'Evocation', castingTime: '1 action', range: 'Touch', components: ['V', 'S'], duration: 'Instantaneous', description: 'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.', classes: ['cleric'] },
    { id: 'healing_word', name: 'Healing Word', level: 1, school: 'Evocation', castingTime: '1 bonus action', range: '60 feet', components: ['V'], duration: 'Instantaneous', description: 'A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier.', classes: ['cleric'] },
    { id: 'bless', name: 'Bless', level: 1, school: 'Enchantment', castingTime: '1 action', range: '30 feet', components: ['V', 'S', 'M'], materialComponent: 'a sprinkling of holy water', duration: 'Concentration, up to 1 minute', concentration: true, description: 'You bless up to three creatures of your choice within range.', classes: ['cleric'] },
    { id: 'command', name: 'Command', level: 1, school: 'Enchantment', castingTime: '1 action', range: '60 feet', components: ['V'], duration: '1 round', description: 'You speak a one-word command to a creature you can see within range.', classes: ['cleric'] },
    { id: 'detect_magic', name: 'Detect Magic', level: 1, school: 'Divination', castingTime: '1 action', range: 'Self', components: ['V', 'S'], duration: 'Concentration, up to 10 minutes', concentration: true, ritual: true, description: 'For the duration, you sense the presence of magic within 30 feet of you.', classes: ['cleric'] },
    { id: 'inflict_wounds', name: 'Inflict Wounds', level: 1, school: 'Necromancy', castingTime: '1 action', range: 'Touch', components: ['V', 'S'], duration: 'Instantaneous', description: 'Make a melee spell attack against a creature you can reach.', classes: ['cleric'] }
  ]
}

export function EquipmentSpellsStep({ data, onChange, onValidationChange }: WizardStepProps) {
  const { characterData } = useCharacterCreation()
  const [selectedEquipmentChoices, setSelectedEquipmentChoices] = useState<Record<number, number>>({})
  const [selectedSpells, setSelectedSpells] = useState<{
    cantrips: Set<string>
    knownSpells: Set<string>
    preparedSpells?: Set<string>
  }>({ cantrips: new Set(), knownSpells: new Set(), preparedSpells: new Set() })
  const [backgroundData, setBackgroundData] = useState<any>(null)

  const currentData = data || {
    equipment: [],
    spells: [],
    equipmentChoices: {},
    spellChoices: {
      cantrips: [],
      knownSpells: [],
      preparedSpells: []
    }
  }

  // Fetch background data when background changes
  useEffect(() => {
    const fetchBackgroundData = async () => {
      if (characterData.background) {
        try {
          const response = await fetch(`https://dnd-character-manager-api-dev.cybermattlee-llc.workers.dev/api/backgrounds`)
          const result = await response.json()
          if (result.success) {
            const background = result.data.backgrounds.find((bg: any) => bg.id === characterData.background)
            setBackgroundData(background)
          }
        } catch (error) {
          console.error('Failed to fetch background data:', error)
        }
      }
    }

    fetchBackgroundData()
  }, [characterData.background])

  // Get current class data
  const classData = CLASS_EQUIPMENT_DATA[characterData.class?.toLowerCase()]
  const spellcastingInfo = SPELLCASTING_CLASSES[characterData.class?.toLowerCase()]
  const isSpellcaster = !!spellcastingInfo

  // Get spell lists for current class
  const availableSpells = useMemo(() => {
    if (!isSpellcaster) return { cantrips: [], spells: [] }
    
    const classSpells = SPELLS_BY_CLASS[characterData.class?.toLowerCase()] || []
    return {
      cantrips: classSpells.filter(spell => spell.level === 0),
      spells: classSpells.filter(spell => spell.level === 1)
    }
  }, [isSpellcaster, characterData.class])

  // Calculate final equipment list
  const finalEquipment = useMemo(() => {
    const equipment: EquipmentItem[] = []

    // Add background equipment
    if (backgroundData?.startingEquipment?.items) {
      backgroundData.startingEquipment.items.forEach((itemName: string) => {
        equipment.push({
          id: itemName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
          name: itemName,
          type: 'gear' as const,
          quantity: 1,
          weight: 1, // Default weight for background items
          value: 0, // Background items are free
          description: `Background equipment from ${backgroundData.name}`
        })
      })
    }

    if (!classData) return equipment

    // Add equipment pack items
    equipment.push(...classData.equipmentPack.items)

    // Add additional equipment
    if (classData.additionalEquipment) {
      equipment.push(...classData.additionalEquipment)
    }

    // Add equipment from choices
    classData.choices.forEach((choice, choiceIndex) => {
      const selectedOption = selectedEquipmentChoices[choiceIndex]
      if (selectedOption !== undefined && choice.options[selectedOption]) {
        equipment.push(...choice.options[selectedOption])
      }
    })

    return equipment
  }, [classData, selectedEquipmentChoices, backgroundData])

  // Calculate total encumbrance
  const totalWeight = finalEquipment.reduce((total, item) => total + (item.weight || 0) * item.quantity, 0)
  const strengthScore = characterData.stats?.strength || 10
  const carryingCapacity = strengthScore * 15 // in pounds
  const encumberedAt = carryingCapacity / 3 * 2 // heavily encumbered at 2/3 capacity
  
  // Handle equipment choice selection
  const handleEquipmentChoice = (choiceIndex: number, optionIndex: number) => {
    const newChoices = { ...selectedEquipmentChoices, [choiceIndex]: optionIndex }
    setSelectedEquipmentChoices(newChoices)
  }

  // Handle spell selection
  const handleSpellSelection = (spell: Spell, type: 'cantrip' | 'known') => {
    const newSelected = { ...selectedSpells }
    
    if (type === 'cantrip') {
      if (newSelected.cantrips.has(spell.id)) {
        newSelected.cantrips.delete(spell.id)
      } else if (newSelected.cantrips.size < (spellcastingInfo?.cantripsKnown || 0)) {
        newSelected.cantrips.add(spell.id)
      }
    } else {
      if (newSelected.knownSpells.has(spell.id)) {
        newSelected.knownSpells.delete(spell.id)
      } else if (newSelected.knownSpells.size < (spellcastingInfo?.spellsKnown || 0)) {
        newSelected.knownSpells.add(spell.id)
      }
    }
    
    setSelectedSpells(newSelected)
  }

  // Calculate prepared spells for classes that prepare spells
  const preparedSpellsLimit = useMemo(() => {
    if (!spellcastingInfo || !spellcastingInfo.canPrepareSpells) return 0
    
    const abilityModifier = getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10)
    const level = characterData.level || 1
    
    return Math.max(1, abilityModifier + level)
  }, [spellcastingInfo, characterData.stats, characterData.level])

  // Update parent component when data changes
  useEffect(() => {
    const spellsArray = [
      ...Array.from(selectedSpells.cantrips).map(id => {
        const spell = availableSpells.cantrips.find(s => s.id === id)!
        return {
          id: spell.id,
          name: spell.name,
          level: spell.level,
          school: spell.school,
          castingTime: spell.castingTime,
          range: spell.range,
          components: spell.components,
          duration: spell.duration,
          description: spell.description,
          prepared: true // Cantrips are always prepared
        }
      }),
      ...Array.from(selectedSpells.knownSpells).map(id => {
        const spell = availableSpells.spells.find(s => s.id === id)!
        return {
          id: spell.id,
          name: spell.name,
          level: spell.level,
          school: spell.school,
          castingTime: spell.castingTime,
          range: spell.range,
          components: spell.components,
          duration: spell.duration,
          description: spell.description,
          prepared: !spellcastingInfo?.canPrepareSpells || selectedSpells.preparedSpells?.has(spell.id)
        }
      })
    ]

    const equipmentArray = finalEquipment.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      quantity: item.quantity,
      weight: item.weight,
      value: item.value
    }))

    const newData = {
      equipment: equipmentArray,
      spells: spellsArray,
      equipmentChoices: selectedEquipmentChoices,
      spellChoices: {
        cantrips: Array.from(selectedSpells.cantrips),
        knownSpells: Array.from(selectedSpells.knownSpells),
        preparedSpells: Array.from(selectedSpells.preparedSpells || new Set())
      }
    }

    onChange(newData)

    // Validation
    const errors: string[] = []
    
    // Check equipment choices
    if (classData) {
      classData.choices.forEach((choice, index) => {
        if (selectedEquipmentChoices[index] === undefined) {
          errors.push(`Make a selection for: ${choice.description}`)
        }
      })
    }

    // Check spell choices for spellcasters
    if (isSpellcaster && spellcastingInfo) {
      if (selectedSpells.cantrips.size < spellcastingInfo.cantripsKnown) {
        errors.push(`Select ${spellcastingInfo.cantripsKnown} cantrips (${selectedSpells.cantrips.size} selected)`)
      }
      
      if (spellcastingInfo.spellsKnown && selectedSpells.knownSpells.size < spellcastingInfo.spellsKnown) {
        errors.push(`Select ${spellcastingInfo.spellsKnown} spells (${selectedSpells.knownSpells.size} selected)`)
      }
    }

    onValidationChange(errors.length === 0, errors)
  }, [finalEquipment, selectedSpells, selectedEquipmentChoices, availableSpells, classData, isSpellcaster, spellcastingInfo, onChange, onValidationChange])

  if (!characterData.class) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Class Selected</h3>
          <p className="text-sm text-muted-foreground">Please select a class in the previous step to configure equipment and spells.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Equipment & Spells</h2>
        <p className="text-muted-foreground">
          Configure your starting equipment and spells based on your {characterData.class} class and {characterData.background || 'selected'} background.
        </p>
      </div>

      {/* Equipment Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-amber-800">Starting Equipment</h3>
          <Badge variant="outline" className="border-amber-300 text-amber-800">
            {finalEquipment.length} items • {totalWeight.toFixed(1)} lbs
          </Badge>
        </div>

        {/* Background Equipment */}
        {backgroundData?.startingEquipment?.items && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-800">
                <span>Background Equipment ({backgroundData.name})</span>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {backgroundData.startingEquipment.items.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Equipment provided by your {backgroundData.name} background.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {backgroundData.startingEquipment.items.map((itemName: string, index: number) => (
                  <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-blue-900">{itemName}</div>
                      <div className="text-xs text-blue-600">Background item</div>
                    </div>
                  </div>
                ))}
              </div>

              {backgroundData.startingEquipment.money && (
                <div className="pt-3 border-t border-blue-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700 font-medium">Starting Money</span>
                    <span className="text-blue-900 font-semibold">{backgroundData.startingEquipment.money}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Equipment Pack */}
        {classData && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-amber-800">
                <span>{classData.equipmentPack.name}</span>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  {classData.equipmentPack.items.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {classData.equipmentPack.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {classData.equipmentPack.items.map((item, index) => (
                  <div key={index} className="p-2 border border-amber-200 bg-amber-50 rounded text-sm">
                    <div className="font-medium text-amber-900">{item.name}</div>
                    {item.quantity > 1 && (
                      <div className="text-xs text-amber-700">Quantity: {item.quantity}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Equipment Choices */}
        {classData && classData.choices.map((choice, choiceIndex) => (
          <Card key={choiceIndex} className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">{choice.description}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {choice.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  type="button"
                  onClick={() => handleEquipmentChoice(choiceIndex, optionIndex)}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    selectedEquipmentChoices[choiceIndex] === optionIndex
                      ? 'border-amber-400 bg-amber-50 text-amber-900'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
                  }`}
                >
                  <div className="space-y-2">
                    {option.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          )}
                          {item.damage && (
                            <div className="text-xs font-mono text-blue-600">{item.damage}</div>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          {item.quantity > 1 && <div>×{item.quantity}</div>}
                          {item.weight && <div>{item.weight} lb</div>}
                          {item.armorClass && <div>AC {item.armorClass}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Additional Equipment */}
        {classData && classData.additionalEquipment && classData.additionalEquipment.length > 0 && (
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">Additional Class Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classData.additionalEquipment.map((item, index) => (
                  <div key={index} className="p-3 border border-amber-200 bg-amber-50 rounded">
                    <div className="font-medium text-amber-900">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-amber-700 mt-1">{item.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Encumbrance */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Carrying Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Weight:</span>
                <span className="font-medium">{totalWeight.toFixed(1)} lbs</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Carrying Capacity:</span>
                <span>{carryingCapacity} lbs (STR {strengthScore})</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    totalWeight > carryingCapacity ? 'bg-red-500' :
                    totalWeight > encumberedAt ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalWeight / carryingCapacity) * 100)}%` }}
                />
              </div>
              {totalWeight > carryingCapacity && (
                <p className="text-xs text-red-600">Overloaded! Movement speed reduced.</p>
              )}
              {totalWeight > encumberedAt && totalWeight <= carryingCapacity && (
                <p className="text-xs text-yellow-600">Heavily encumbered. Movement speed reduced.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spells Section */}
      {isSpellcaster && spellcastingInfo && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-purple-800">Spellcasting</h3>
            <Badge variant="outline" className="border-purple-300 text-purple-800">
              {selectedSpells.cantrips.size + selectedSpells.knownSpells.size} spells selected
            </Badge>
          </div>

          {/* Spellcasting Info */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Spellcasting Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Spellcasting Ability</div>
                <div className="text-sm text-muted-foreground capitalize">{spellcastingInfo.spellcastingAbility}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Spellcasting Focus</div>
                <div className="text-sm text-muted-foreground">{spellcastingInfo.spellcastingFocus}</div>
              </div>
              <div>
                <div className="text-sm font-medium">1st Level Spell Slots</div>
                <div className="text-sm text-muted-foreground">{spellcastingInfo.spellSlots[0]?.slots || 0}</div>
              </div>
              {spellcastingInfo.canPrepareSpells && (
                <div>
                  <div className="text-sm font-medium">Spells You Can Prepare</div>
                  <div className="text-sm text-muted-foreground">{preparedSpellsLimit}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cantrips */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-purple-800">
                <span>Cantrips (Level 0)</span>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  {selectedSpells.cantrips.size}/{spellcastingInfo.cantripsKnown} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Cantrips are always known and prepared. They don't use spell slots and can be cast at will.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableSpells.cantrips.map((spell) => {
                  const isSelected = selectedSpells.cantrips.has(spell.id)
                  const canSelect = isSelected || selectedSpells.cantrips.size < spellcastingInfo.cantripsKnown
                  
                  return (
                    <button
                      key={spell.id}
                      type="button"
                      onClick={() => handleSpellSelection(spell, 'cantrip')}
                      disabled={!canSelect}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        isSelected
                          ? 'border-purple-400 bg-purple-50 text-purple-900'
                          : canSelect
                          ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{spell.name}</div>
                          <div className="text-xs text-muted-foreground">{spell.school}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {spell.castingTime} • {spell.range}
                          </div>
                        </div>
                        <div className={`w-4 h-4 border-2 rounded transition-all ${
                          isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {spell.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 1st Level Spells */}
          {spellcastingInfo.spellsKnown && spellcastingInfo.spellsKnown > 0 && (
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-purple-800">
                  <span>1st Level Spells</span>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {selectedSpells.knownSpells.size}/{spellcastingInfo.spellsKnown} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {spellcastingInfo.canPrepareSpells 
                    ? `Select spells to add to your spellbook. You can prepare ${preparedSpellsLimit} spells from those you know.`
                    : 'Select the spells you know. Known spells are always available to cast when you have spell slots.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableSpells.spells.map((spell) => {
                    const isSelected = selectedSpells.knownSpells.has(spell.id)
                    const canSelect = isSelected || selectedSpells.knownSpells.size < spellcastingInfo.spellsKnown!
                    
                    return (
                      <button
                        key={spell.id}
                        type="button"
                        onClick={() => handleSpellSelection(spell, 'known')}
                        disabled={!canSelect}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          isSelected
                            ? 'border-purple-400 bg-purple-50 text-purple-900'
                            : canSelect
                            ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{spell.name}</div>
                            <div className="text-xs text-muted-foreground">{spell.school}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {spell.castingTime} • {spell.range} • {spell.duration}
                            </div>
                            {spell.concentration && (
                              <Badge size="sm" variant="outline" className="mt-1 text-xs">Concentration</Badge>
                            )}
                            {spell.ritual && (
                              <Badge size="sm" variant="outline" className="mt-1 ml-1 text-xs">Ritual</Badge>
                            )}
                          </div>
                          <div className={`w-4 h-4 border-2 rounded transition-all ${
                            isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {spell.description}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Character Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Equipment Items</div>
              <div className="text-lg font-semibold text-amber-700">{finalEquipment.length}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Total Weight</div>
              <div className="text-lg font-semibold text-amber-700">{totalWeight.toFixed(1)} lbs</div>
            </div>
            {isSpellcaster && (
              <>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Cantrips Known</div>
                  <div className="text-lg font-semibold text-purple-700">{selectedSpells.cantrips.size}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Spells Known</div>
                  <div className="text-lg font-semibold text-purple-700">{selectedSpells.knownSpells.size}</div>
                </div>
              </>
            )}
          </div>
          
          {isSpellcaster && spellcastingInfo && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Spellcasting Ability</div>
                  <div className="font-medium capitalize">
                    {spellcastingInfo.spellcastingAbility} ({getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10) >= 0 ? '+' : ''}{getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10)})
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Spell Attack Bonus</div>
                  <div className="font-medium">
                    +{(characterData.proficiencyBonus || 2) + getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Spell Save DC</div>
                  <div className="font-medium">
                    {8 + (characterData.proficiencyBonus || 2) + getAbilityModifier(characterData.stats?.[spellcastingInfo.spellcastingAbility] || 10)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}