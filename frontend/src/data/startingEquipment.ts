// D&D 5e Starting Equipment Choices by Class
// Comprehensive equipment selection system for all classes

// Equipment Item Interface
export interface EquipmentItem {
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

// Weapon Selector Interface - for "choose any weapon from category"
export interface WeaponSelector {
  category: 'simple' | 'martial'
  type?: 'melee' | 'ranged' // optional filter
  count: number // how many weapons to select
  includeShield?: boolean // if true, can also choose a shield with the weapon
}

// Equipment Choice Interface
export interface EquipmentChoice {
  description: string
  options: EquipmentItem[][]
  weaponSelector?: WeaponSelector // if present, user chooses from all weapons in category
}

// Equipment Pack Interface
export interface EquipmentPack {
  id: string
  name: string
  description: string
  items: EquipmentItem[]
  totalWeight: number
  totalValue: number
}

// Class Equipment Configuration
export interface ClassEquipmentConfig {
  choices: EquipmentChoice[]
  equipmentPack: EquipmentPack
  additionalEquipment?: EquipmentItem[]
}

// Equipment Packs Data
export const EQUIPMENT_PACKS: Record<string, EquipmentPack> = {
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

// Comprehensive class equipment configurations for all D&D 5e classes
export const CLASS_STARTING_EQUIPMENT: Record<string, ClassEquipmentConfig> = {
  barbarian: {
    choices: [
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'greataxe', name: 'Greataxe', type: 'weapon', quantity: 1, weight: 7, value: 3000, damage: '1d12 slashing', properties: ['heavy', 'two-handed'] }],
          [{ id: 'battleaxe', name: 'Battleaxe', type: 'weapon', quantity: 1, weight: 4, value: 1000, damage: '1d8 slashing', properties: ['versatile'] }]
        ]
      },
      {
        description: "Choose ranged weapon:",
        options: [
          [{ id: 'handaxe', name: 'Handaxe', type: 'weapon', quantity: 2, weight: 4, value: 1000, damage: '1d6 slashing', properties: ['light', 'thrown'] }],
          [{ id: 'javelin', name: 'Javelin', type: 'weapon', quantity: 4, weight: 8, value: 1000, damage: '1d6 piercing', properties: ['thrown'] }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.explorer,
    additionalEquipment: [
      { id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11, description: 'Light armor. AC 11 + Dex modifier.' },
      { id: 'javelin', name: 'Javelin', type: 'weapon', quantity: 4, weight: 8, value: 1000, damage: '1d6 piercing', properties: ['thrown'] }
    ]
  },

  bard: {
    choices: [
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'rapier', name: 'Rapier', type: 'weapon', quantity: 1, weight: 2, value: 2500, damage: '1d8 piercing', properties: ['finesse'] }],
          [{ id: 'longsword', name: 'Longsword', type: 'weapon', quantity: 1, weight: 3, value: 1500, damage: '1d8 slashing', properties: ['versatile'] }],
          [{ id: 'shortsword', name: 'Shortsword', type: 'weapon', quantity: 1, weight: 2, value: 1000, damage: '1d6 piercing', properties: ['finesse', 'light'] }]
        ]
      },
      {
        description: "Choose equipment pack:",
        options: [
          [{ id: 'diplomat_pack', name: "Diplomat's Pack", type: 'gear', quantity: 1, weight: 39, value: 3900, description: "A complete set of diplomatic supplies." }],
          [{ id: 'entertainer_pack', name: "Entertainer's Pack", type: 'gear', quantity: 1, weight: 40, value: 4000, description: "Equipment for performers." }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.entertainer,
    additionalEquipment: [
      { id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11 },
      { id: 'dagger', name: 'Dagger', type: 'weapon', quantity: 1, weight: 1, value: 200, damage: '1d4 piercing', properties: ['finesse', 'light', 'thrown'] },
      { id: 'musical_instrument', name: 'Musical Instrument', type: 'tool', quantity: 1, weight: 3, value: 3000, description: 'A musical instrument of your choice.' }
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

  druid: {
    choices: [
      {
        description: "Choose shield:",
        options: [
          [{ id: 'shield', name: 'Shield', type: 'shield', quantity: 1, weight: 6, value: 1000, armorClass: 2, description: '+2 AC. Made of non-metal materials.' }],
          [{ id: 'scimitar', name: 'Scimitar', type: 'weapon', quantity: 1, weight: 3, value: 2500, damage: '1d6 slashing', properties: ['finesse', 'light'] }]
        ]
      },
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'scimitar', name: 'Scimitar', type: 'weapon', quantity: 1, weight: 3, value: 2500, damage: '1d6 slashing', properties: ['finesse', 'light'] }],
          [{ id: 'shortsword', name: 'Shortsword', type: 'weapon', quantity: 1, weight: 2, value: 1000, damage: '1d6 piercing', properties: ['finesse', 'light'] }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.explorer,
    additionalEquipment: [
      { id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11, description: 'Made of studded leather. Non-metal.' },
      { id: 'druidcraft_focus', name: 'Druidcraft Focus', type: 'gear', quantity: 1, weight: 1, value: 0, description: 'A druidcraft focus made of natural materials.' },
      { id: 'javelin', name: 'Javelin', type: 'weapon', quantity: 2, weight: 4, value: 100, damage: '1d6 piercing', properties: ['thrown'] }
    ]
  },

  fighter: {
    choices: [
      {
        description: "(a) chain mail or (b) leather armor, longbow, and 20 arrows",
        options: [
          [{ id: 'chain_mail', name: 'Chain Mail', type: 'armor', quantity: 1, weight: 55, value: 7500, armorClass: 16, description: 'Heavy armor. AC 16. Stealth disadvantage.' }],
          [{ id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11, description: 'Light armor. AC 11 + Dex modifier.' }, { id: 'longbow', name: 'Longbow', type: 'weapon', quantity: 1, weight: 2, value: 5000, damage: '1d8 piercing', properties: ['ammunition', 'heavy', 'two-handed'] }, { id: 'arrows', name: 'Arrows', type: 'ammunition', quantity: 20, weight: 1, value: 100 }]
        ]
      },
      {
        description: "(a) a martial weapon and a shield or (b) two martial weapons",
        options: [],
        weaponSelector: {
          category: 'martial',
          count: 1,
          includeShield: true
        }
      },
      {
        description: "(a) a light crossbow and 20 bolts or (b) two handaxes",
        options: [
          [{ id: 'light_crossbow', name: 'Light Crossbow', type: 'weapon', quantity: 1, weight: 5, value: 2500, damage: '1d8 piercing', properties: ['ammunition', 'loading', 'two-handed'] }, { id: 'crossbow_bolts', name: 'Crossbow Bolts', type: 'ammunition', quantity: 20, weight: 1.5, value: 100 }],
          [{ id: 'handaxe', name: 'Handaxe', type: 'weapon', quantity: 2, weight: 4, value: 1000, damage: '1d6 slashing', properties: ['light', 'thrown'] }]
        ]
      },
      {
        description: "(a) a dungeoneer's pack or (b) an explorer's pack",
        options: [
          [{ id: 'dungeoneer_pack', name: "Dungeoneer's Pack", type: 'gear', quantity: 1, weight: 61.5, value: 1200, description: "Complete dungeoneering supplies." }],
          [{ id: 'explorer_pack', name: "Explorer's Pack", type: 'gear', quantity: 1, weight: 59, value: 1000, description: "Basic exploration gear." }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.dungeoneer,
    additionalEquipment: []
  },

  monk: {
    choices: [
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'shortsword', name: 'Shortsword', type: 'weapon', quantity: 1, weight: 2, value: 1000, damage: '1d6 piercing', properties: ['finesse', 'light'] }],
          [{ id: 'club', name: 'Club', type: 'weapon', quantity: 1, weight: 2, value: 10, damage: '1d4 bludgeoning', properties: ['light'] }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.dungeoneer,
    additionalEquipment: [
      { id: 'dart', name: 'Dart', type: 'weapon', quantity: 10, weight: 2.5, value: 50, damage: '1d4 piercing', properties: ['finesse', 'thrown'] }
    ]
  },

  paladin: {
    choices: [
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'longsword', name: 'Longsword', type: 'weapon', quantity: 1, weight: 3, value: 1500, damage: '1d8 slashing', properties: ['versatile'] }, { id: 'shield', name: 'Shield', type: 'shield', quantity: 1, weight: 6, value: 1000, armorClass: 2 }],
          [{ id: 'warhammer', name: 'Warhammer', type: 'weapon', quantity: 1, weight: 2, value: 1500, damage: '1d8 bludgeoning', properties: ['versatile'] }, { id: 'shield', name: 'Shield', type: 'shield', quantity: 1, weight: 6, value: 1000, armorClass: 2 }]
        ]
      },
      {
        description: "Choose ranged weapon:",
        options: [
          [{ id: 'javelin', name: 'Javelin', type: 'weapon', quantity: 5, weight: 10, value: 250, damage: '1d6 piercing', properties: ['thrown'] }],
          [{ id: 'light_crossbow', name: 'Light Crossbow', type: 'weapon', quantity: 1, weight: 5, value: 2500, damage: '1d8 piercing' }, { id: 'crossbow_bolts', name: 'Crossbow Bolts', type: 'ammunition', quantity: 20, weight: 1.5, value: 100 }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.explorer,
    additionalEquipment: [
      { id: 'chain_mail', name: 'Chain Mail', type: 'armor', quantity: 1, weight: 55, value: 7500, armorClass: 16, description: 'Heavy armor. AC 16. Stealth disadvantage.' },
      { id: 'holy_symbol', name: 'Holy Symbol', type: 'gear', quantity: 1, weight: 1, value: 500, description: 'A spellcasting focus for paladins.' }
    ]
  },

  ranger: {
    choices: [
      {
        description: "Choose armor:",
        options: [
          [{ id: 'scale_mail', name: 'Scale Mail', type: 'armor', quantity: 1, weight: 45, value: 5000, armorClass: 14, description: 'Medium armor. AC 14 + Dex modifier (max 2). Stealth disadvantage.' }],
          [{ id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11 }]
        ]
      },
      {
        description: "Choose weapons:",
        options: [
          [{ id: 'shortsword', name: 'Shortsword', type: 'weapon', quantity: 2, weight: 4, value: 2000, damage: '1d6 piercing', properties: ['finesse', 'light'] }],
          [{ id: 'longsword', name: 'Longsword', type: 'weapon', quantity: 1, weight: 3, value: 1500, damage: '1d8 slashing', properties: ['versatile'] }, { id: 'shield', name: 'Shield', type: 'shield', quantity: 1, weight: 6, value: 1000, armorClass: 2 }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.explorer,
    additionalEquipment: [
      { id: 'longbow', name: 'Longbow', type: 'weapon', quantity: 1, weight: 2, value: 5000, damage: '1d8 piercing', properties: ['ammunition', 'heavy', 'two-handed'] },
      { id: 'arrows', name: 'Arrows', type: 'ammunition', quantity: 20, weight: 1, value: 100 }
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
          [{ id: 'shortbow', name: 'Shortbow', type: 'weapon', quantity: 1, weight: 2, value: 2500, damage: '1d6 piercing', properties: ['ammunition', 'two-handed'] }, { id: 'arrows', name: 'Arrows', type: 'ammunition', quantity: 20, weight: 1, value: 100 }],
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
  },

  sorcerer: {
    choices: [
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'light_crossbow', name: 'Light Crossbow', type: 'weapon', quantity: 1, weight: 5, value: 2500, damage: '1d8 piercing' }, { id: 'crossbow_bolts', name: 'Crossbow Bolts', type: 'ammunition', quantity: 20, weight: 1.5, value: 100 }],
          [{ id: 'dart', name: 'Dart', type: 'weapon', quantity: 3, weight: 0.75, value: 15, damage: '1d4 piercing', properties: ['finesse', 'thrown'] }]
        ]
      },
      {
        description: "Choose spellcasting focus:",
        options: [
          [{ id: 'component_pouch', name: 'Component Pouch', type: 'gear', quantity: 1, weight: 2, value: 2500, description: 'A spellcasting focus for sorcerers.' }],
          [{ id: 'arcane_focus', name: 'Arcane Focus', type: 'gear', quantity: 1, weight: 1, value: 2000, description: 'A spellcasting focus for sorcerers.' }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.dungeoneer,
    additionalEquipment: [
      { id: 'dagger', name: 'Dagger', type: 'weapon', quantity: 2, weight: 2, value: 400, damage: '1d4 piercing', properties: ['finesse', 'light', 'thrown'] }
    ]
  },

  warlock: {
    choices: [
      {
        description: "Choose weapon:",
        options: [
          [{ id: 'light_crossbow', name: 'Light Crossbow', type: 'weapon', quantity: 1, weight: 5, value: 2500, damage: '1d8 piercing' }, { id: 'crossbow_bolts', name: 'Crossbow Bolts', type: 'ammunition', quantity: 20, weight: 1.5, value: 100 }],
          [{ id: 'shortsword', name: 'Shortsword', type: 'weapon', quantity: 1, weight: 2, value: 1000, damage: '1d6 piercing', properties: ['finesse', 'light'] }]
        ]
      },
      {
        description: "Choose spellcasting focus:",
        options: [
          [{ id: 'component_pouch', name: 'Component Pouch', type: 'gear', quantity: 1, weight: 2, value: 2500, description: 'A spellcasting focus for warlocks.' }],
          [{ id: 'arcane_focus', name: 'Arcane Focus', type: 'gear', quantity: 1, weight: 1, value: 2000, description: 'A spellcasting focus for warlocks.' }]
        ]
      }
    ],
    equipmentPack: EQUIPMENT_PACKS.dungeoneer,
    additionalEquipment: [
      { id: 'leather_armor', name: 'Leather Armor', type: 'armor', quantity: 1, weight: 10, value: 1000, armorClass: 11 },
      { id: 'dagger', name: 'Dagger', type: 'weapon', quantity: 2, weight: 2, value: 400, damage: '1d4 piercing', properties: ['finesse', 'light', 'thrown'] }
    ]
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
  }
}

// Helper function to get starting equipment for a class
export function getClassStartingEquipment(className: string): ClassEquipmentConfig | null {
  const classKey = className.toLowerCase()
  return CLASS_STARTING_EQUIPMENT[classKey] || null
}

// Helper function to get all available equipment packs
export function getAvailableEquipmentPacks(): EquipmentPack[] {
  return Object.values(EQUIPMENT_PACKS)
}

// Helper function to convert API starting equipment to EquipmentItem format
export function convertApiEquipmentToItems(apiEquipment: any[]): EquipmentItem[] {
  return apiEquipment.map(item => ({
    id: item.id || item.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
    name: item.name || 'Unknown Item',
    type: item.type || 'gear',
    quantity: item.quantity || 1,
    weight: item.weight || 0,
    value: item.value || 0,
    description: item.description,
    damage: item.damage,
    armorClass: item.armorClass,
    properties: item.properties || []
  }))
}