// D&D 5e Weapons Database
// Complete weapon list from PHB

export interface WeaponProperties {
  ammunition?: string // e.g., "(80/320)"
  finesse?: boolean
  heavy?: boolean
  light?: boolean
  loading?: boolean
  reach?: boolean
  special?: boolean
  thrown?: string // e.g., "(20/60)"
  twoHanded?: boolean
  versatile?: string // e.g., "(1d10)"
}

export interface Weapon {
  id: string
  name: string
  category: 'simple' | 'martial'
  type: 'melee' | 'ranged'
  damage: string
  damageType: 'bludgeoning' | 'piercing' | 'slashing'
  weight: number // in pounds
  cost: number // in copper pieces (1 gp = 100 cp, 1 sp = 10 cp)
  properties: WeaponProperties
  description?: string
}

// Simple Melee Weapons
export const SIMPLE_MELEE_WEAPONS: Weapon[] = [
  {
    id: 'club',
    name: 'Club',
    category: 'simple',
    type: 'melee',
    damage: '1d4',
    damageType: 'bludgeoning',
    weight: 2,
    cost: 10, // 1 sp
    properties: { light: true }
  },
  {
    id: 'dagger',
    name: 'Dagger',
    category: 'simple',
    type: 'melee',
    damage: '1d4',
    damageType: 'piercing',
    weight: 1,
    cost: 200, // 2 gp
    properties: { finesse: true, light: true, thrown: '(20/60)' }
  },
  {
    id: 'greatclub',
    name: 'Greatclub',
    category: 'simple',
    type: 'melee',
    damage: '1d8',
    damageType: 'bludgeoning',
    weight: 10,
    cost: 20, // 2 sp
    properties: { twoHanded: true }
  },
  {
    id: 'handaxe',
    name: 'Handaxe',
    category: 'simple',
    type: 'melee',
    damage: '1d6',
    damageType: 'slashing',
    weight: 2,
    cost: 500, // 5 gp
    properties: { light: true, thrown: '(20/60)' }
  },
  {
    id: 'javelin',
    name: 'Javelin',
    category: 'simple',
    type: 'melee',
    damage: '1d6',
    damageType: 'piercing',
    weight: 2,
    cost: 50, // 5 sp
    properties: { thrown: '(30/120)' }
  },
  {
    id: 'light_hammer',
    name: 'Light Hammer',
    category: 'simple',
    type: 'melee',
    damage: '1d4',
    damageType: 'bludgeoning',
    weight: 2,
    cost: 200, // 2 gp
    properties: { light: true, thrown: '(20/60)' }
  },
  {
    id: 'mace',
    name: 'Mace',
    category: 'simple',
    type: 'melee',
    damage: '1d6',
    damageType: 'bludgeoning',
    weight: 4,
    cost: 500, // 5 gp
    properties: {}
  },
  {
    id: 'quarterstaff',
    name: 'Quarterstaff',
    category: 'simple',
    type: 'melee',
    damage: '1d6',
    damageType: 'bludgeoning',
    weight: 4,
    cost: 20, // 2 sp
    properties: { versatile: '(1d8)' }
  },
  {
    id: 'sickle',
    name: 'Sickle',
    category: 'simple',
    type: 'melee',
    damage: '1d4',
    damageType: 'slashing',
    weight: 2,
    cost: 100, // 1 gp
    properties: { light: true }
  },
  {
    id: 'spear',
    name: 'Spear',
    category: 'simple',
    type: 'melee',
    damage: '1d6',
    damageType: 'piercing',
    weight: 3,
    cost: 100, // 1 gp
    properties: { thrown: '(20/60)', versatile: '(1d8)' }
  }
]

// Simple Ranged Weapons
export const SIMPLE_RANGED_WEAPONS: Weapon[] = [
  {
    id: 'light_crossbow',
    name: 'Light Crossbow',
    category: 'simple',
    type: 'ranged',
    damage: '1d8',
    damageType: 'piercing',
    weight: 5,
    cost: 2500, // 25 gp
    properties: { ammunition: '(80/320)', loading: true, twoHanded: true }
  },
  {
    id: 'dart',
    name: 'Dart',
    category: 'simple',
    type: 'ranged',
    damage: '1d4',
    damageType: 'piercing',
    weight: 0.25,
    cost: 5, // 5 cp
    properties: { finesse: true, thrown: '(20/60)' }
  },
  {
    id: 'shortbow',
    name: 'Shortbow',
    category: 'simple',
    type: 'ranged',
    damage: '1d6',
    damageType: 'piercing',
    weight: 2,
    cost: 2500, // 25 gp
    properties: { ammunition: '(80/320)', twoHanded: true }
  },
  {
    id: 'sling',
    name: 'Sling',
    category: 'simple',
    type: 'ranged',
    damage: '1d4',
    damageType: 'bludgeoning',
    weight: 0,
    cost: 10, // 1 sp
    properties: { ammunition: '(30/120)' }
  }
]

// Martial Melee Weapons
export const MARTIAL_MELEE_WEAPONS: Weapon[] = [
  {
    id: 'battleaxe',
    name: 'Battleaxe',
    category: 'martial',
    type: 'melee',
    damage: '1d8',
    damageType: 'slashing',
    weight: 4,
    cost: 1000, // 10 gp
    properties: { versatile: '(1d10)' }
  },
  {
    id: 'flail',
    name: 'Flail',
    category: 'martial',
    type: 'melee',
    damage: '1d8',
    damageType: 'bludgeoning',
    weight: 2,
    cost: 1000, // 10 gp
    properties: {}
  },
  {
    id: 'glaive',
    name: 'Glaive',
    category: 'martial',
    type: 'melee',
    damage: '1d10',
    damageType: 'slashing',
    weight: 6,
    cost: 2000, // 20 gp
    properties: { heavy: true, reach: true, twoHanded: true }
  },
  {
    id: 'greataxe',
    name: 'Greataxe',
    category: 'martial',
    type: 'melee',
    damage: '1d12',
    damageType: 'slashing',
    weight: 7,
    cost: 3000, // 30 gp
    properties: { heavy: true, twoHanded: true }
  },
  {
    id: 'greatsword',
    name: 'Greatsword',
    category: 'martial',
    type: 'melee',
    damage: '2d6',
    damageType: 'slashing',
    weight: 6,
    cost: 5000, // 50 gp
    properties: { heavy: true, twoHanded: true }
  },
  {
    id: 'halberd',
    name: 'Halberd',
    category: 'martial',
    type: 'melee',
    damage: '1d10',
    damageType: 'slashing',
    weight: 6,
    cost: 2000, // 20 gp
    properties: { heavy: true, reach: true, twoHanded: true }
  },
  {
    id: 'lance',
    name: 'Lance',
    category: 'martial',
    type: 'melee',
    damage: '1d12',
    damageType: 'piercing',
    weight: 6,
    cost: 1000, // 10 gp
    properties: { reach: true, special: true },
    description: 'You have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren\'t mounted.'
  },
  {
    id: 'longsword',
    name: 'Longsword',
    category: 'martial',
    type: 'melee',
    damage: '1d8',
    damageType: 'slashing',
    weight: 3,
    cost: 1500, // 15 gp
    properties: { versatile: '(1d10)' }
  },
  {
    id: 'maul',
    name: 'Maul',
    category: 'martial',
    type: 'melee',
    damage: '2d6',
    damageType: 'bludgeoning',
    weight: 10,
    cost: 1000, // 10 gp
    properties: { heavy: true, twoHanded: true }
  },
  {
    id: 'morningstar',
    name: 'Morningstar',
    category: 'martial',
    type: 'melee',
    damage: '1d8',
    damageType: 'piercing',
    weight: 4,
    cost: 1500, // 15 gp
    properties: {}
  },
  {
    id: 'pike',
    name: 'Pike',
    category: 'martial',
    type: 'melee',
    damage: '1d10',
    damageType: 'piercing',
    weight: 18,
    cost: 500, // 5 gp
    properties: { heavy: true, reach: true, twoHanded: true }
  },
  {
    id: 'rapier',
    name: 'Rapier',
    category: 'martial',
    type: 'melee',
    damage: '1d8',
    damageType: 'piercing',
    weight: 2,
    cost: 2500, // 25 gp
    properties: { finesse: true }
  },
  {
    id: 'scimitar',
    name: 'Scimitar',
    category: 'martial',
    type: 'melee',
    damage: '1d6',
    damageType: 'slashing',
    weight: 3,
    cost: 2500, // 25 gp
    properties: { finesse: true, light: true }
  },
  {
    id: 'shortsword',
    name: 'Shortsword',
    category: 'martial',
    type: 'melee',
    damage: '1d6',
    damageType: 'piercing',
    weight: 2,
    cost: 1000, // 10 gp
    properties: { finesse: true, light: true }
  },
  {
    id: 'trident',
    name: 'Trident',
    category: 'martial',
    type: 'melee',
    damage: '1d6',
    damageType: 'piercing',
    weight: 4,
    cost: 500, // 5 gp
    properties: { thrown: '(20/60)', versatile: '(1d8)' }
  },
  {
    id: 'war_pick',
    name: 'War Pick',
    category: 'martial',
    type: 'melee',
    damage: '1d8',
    damageType: 'piercing',
    weight: 2,
    cost: 500, // 5 gp
    properties: {}
  },
  {
    id: 'warhammer',
    name: 'Warhammer',
    category: 'martial',
    type: 'melee',
    damage: '1d8',
    damageType: 'bludgeoning',
    weight: 2,
    cost: 1500, // 15 gp
    properties: { versatile: '(1d10)' }
  },
  {
    id: 'whip',
    name: 'Whip',
    category: 'martial',
    type: 'melee',
    damage: '1d4',
    damageType: 'slashing',
    weight: 3,
    cost: 200, // 2 gp
    properties: { finesse: true, reach: true }
  }
]

// Martial Ranged Weapons
export const MARTIAL_RANGED_WEAPONS: Weapon[] = [
  {
    id: 'blowgun',
    name: 'Blowgun',
    category: 'martial',
    type: 'ranged',
    damage: '1',
    damageType: 'piercing',
    weight: 1,
    cost: 1000, // 10 gp
    properties: { ammunition: '(25/100)', loading: true }
  },
  {
    id: 'hand_crossbow',
    name: 'Hand Crossbow',
    category: 'martial',
    type: 'ranged',
    damage: '1d6',
    damageType: 'piercing',
    weight: 3,
    cost: 7500, // 75 gp
    properties: { ammunition: '(30/120)', light: true, loading: true }
  },
  {
    id: 'heavy_crossbow',
    name: 'Heavy Crossbow',
    category: 'martial',
    type: 'ranged',
    damage: '1d10',
    damageType: 'piercing',
    weight: 18,
    cost: 5000, // 50 gp
    properties: { ammunition: '(100/400)', heavy: true, loading: true, twoHanded: true }
  },
  {
    id: 'longbow',
    name: 'Longbow',
    category: 'martial',
    type: 'ranged',
    damage: '1d8',
    damageType: 'piercing',
    weight: 2,
    cost: 5000, // 50 gp
    properties: { ammunition: '(150/600)', heavy: true, twoHanded: true }
  },
  {
    id: 'net',
    name: 'Net',
    category: 'martial',
    type: 'ranged',
    damage: '—',
    damageType: 'piercing', // placeholder, net doesn't do damage
    weight: 3,
    cost: 100, // 1 gp
    properties: { special: true, thrown: '(5/15)' },
    description: 'A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net.'
  }
]

// Combined lists for easy access
export const ALL_SIMPLE_WEAPONS = [...SIMPLE_MELEE_WEAPONS, ...SIMPLE_RANGED_WEAPONS]
export const ALL_MARTIAL_WEAPONS = [...MARTIAL_MELEE_WEAPONS, ...MARTIAL_RANGED_WEAPONS]
export const ALL_WEAPONS = [...ALL_SIMPLE_WEAPONS, ...ALL_MARTIAL_WEAPONS]

// Helper functions
export function getWeaponById(id: string): Weapon | undefined {
  return ALL_WEAPONS.find(w => w.id === id)
}

export function getWeaponsByCategory(category: 'simple' | 'martial'): Weapon[] {
  return ALL_WEAPONS.filter(w => w.category === category)
}

export function getWeaponsByType(type: 'melee' | 'ranged'): Weapon[] {
  return ALL_WEAPONS.filter(w => w.type === type)
}

export function formatWeaponProperties(properties: WeaponProperties): string {
  const props: string[] = []

  if (properties.ammunition) props.push(`Ammunition ${properties.ammunition}`)
  if (properties.finesse) props.push('Finesse')
  if (properties.heavy) props.push('Heavy')
  if (properties.light) props.push('Light')
  if (properties.loading) props.push('Loading')
  if (properties.reach) props.push('Reach')
  if (properties.special) props.push('Special')
  if (properties.thrown) props.push(`Thrown ${properties.thrown}`)
  if (properties.twoHanded) props.push('Two-handed')
  if (properties.versatile) props.push(`Versatile ${properties.versatile}`)

  return props.join(', ') || '—'
}
