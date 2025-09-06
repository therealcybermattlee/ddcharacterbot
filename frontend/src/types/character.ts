export interface Character {
  id: string
  name: string
  race: string
  class: string
  level: number
  background: string
  alignment: string
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  hitPoints: {
    current: number
    maximum: number
    temporary: number
  }
  armorClass: number
  proficiencyBonus: number
  savingThrows: Record<string, number>
  skills: Record<string, number>
  equipment: Equipment[]
  spells?: Spell[]
  notes?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Equipment {
  id: string
  name: string
  type: string
  description?: string
  quantity: number
  weight?: number
  value?: number
}

export interface Spell {
  id: string
  name: string
  level: number
  school: string
  castingTime: string
  range: string
  components: string[]
  duration: string
  description: string
  prepared?: boolean
}