export interface DiceRoll {
  roll: number
  total: number
  modifier: number
  description: string
}

export interface MultiDiceRoll {
  rolls: number[]
  total: number
  modifier: number
  description: string
}

/**
 * Roll a single die with specified number of sides
 */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

/**
 * Roll multiple dice and return individual results
 */
export function rollDice(sides: number, count: number = 1): number[] {
  const rolls: number[] = []
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides))
  }
  return rolls
}

/**
 * Roll a d20 (most common D&D roll)
 */
export function rollD20(): number {
  return rollDie(20)
}

/**
 * Roll an ability check with modifier
 */
export function rollAbilityCheck(modifier: number, description: string = 'Ability Check'): DiceRoll {
  const roll = rollD20()
  return {
    roll,
    total: roll + modifier,
    modifier,
    description
  }
}

/**
 * Roll a saving throw with proficiency
 */
export function rollSavingThrow(
  abilityModifier: number,
  proficiencyBonus: number,
  isProficient: boolean,
  abilityName: string
): DiceRoll {
  const roll = rollD20()
  const modifier = abilityModifier + (isProficient ? proficiencyBonus : 0)

  return {
    roll,
    total: roll + modifier,
    modifier,
    description: `${abilityName} Saving Throw${isProficient ? ' (Proficient)' : ''}`
  }
}

/**
 * Roll a skill check with proficiency and expertise
 */
export function rollSkillCheck(
  abilityModifier: number,
  proficiencyBonus: number,
  skillProficiency: 'none' | 'proficient' | 'expertise',
  skillName: string
): DiceRoll {
  const roll = rollD20()
  let modifier = abilityModifier

  if (skillProficiency === 'proficient') {
    modifier += proficiencyBonus
  } else if (skillProficiency === 'expertise') {
    modifier += proficiencyBonus * 2
  }

  return {
    roll,
    total: roll + modifier,
    modifier,
    description: `${skillName} Check${skillProficiency !== 'none' ? ` (${skillProficiency})` : ''}`
  }
}

/**
 * Roll attack with attack bonus
 */
export function rollAttack(attackBonus: number, weaponName: string): DiceRoll {
  const roll = rollD20()
  return {
    roll,
    total: roll + attackBonus,
    modifier: attackBonus,
    description: `${weaponName} Attack`
  }
}

/**
 * Roll damage dice
 */
export function rollDamage(
  damageDice: string, // e.g., "1d8", "2d6+3"
  weaponName: string
): MultiDiceRoll {
  // Parse damage dice string (e.g., "1d8+3", "2d6")
  const match = damageDice.match(/(\d+)d(\d+)(?:\+(\d+))?/)

  if (!match) {
    throw new Error(`Invalid damage dice format: ${damageDice}`)
  }

  const count = parseInt(match[1])
  const sides = parseInt(match[2])
  const bonus = parseInt(match[3] || '0')

  const rolls = rollDice(sides, count)
  const diceTotal = rolls.reduce((sum, roll) => sum + roll, 0)

  return {
    rolls,
    total: diceTotal + bonus,
    modifier: bonus,
    description: `${weaponName} Damage (${damageDice})`
  }
}

/**
 * Roll initiative
 */
export function rollInitiative(dexterityModifier: number): DiceRoll {
  const roll = rollD20()
  return {
    roll,
    total: roll + dexterityModifier,
    modifier: dexterityModifier,
    description: 'Initiative'
  }
}

/**
 * Roll hit dice for healing
 */
export function rollHitDie(hitDieSize: number, constitutionModifier: number): DiceRoll {
  const roll = rollDie(hitDieSize)
  return {
    roll,
    total: Math.max(1, roll + constitutionModifier), // Minimum 1 HP recovered
    modifier: constitutionModifier,
    description: `Hit Die (d${hitDieSize}) Recovery`
  }
}

/**
 * Format dice roll result for display
 */
export function formatRollResult(rollResult: DiceRoll): string {
  if (rollResult.modifier === 0) {
    return `${rollResult.roll} = ${rollResult.total}`
  }

  const modifierStr = rollResult.modifier >= 0 ? `+${rollResult.modifier}` : `${rollResult.modifier}`
  return `${rollResult.roll} ${modifierStr} = ${rollResult.total}`
}

/**
 * Format multi-dice roll result for display
 */
export function formatMultiRollResult(rollResult: MultiDiceRoll): string {
  const rollsStr = rollResult.rolls.join(' + ')

  if (rollResult.modifier === 0) {
    return `${rollsStr} = ${rollResult.total}`
  }

  const modifierStr = rollResult.modifier >= 0 ? ` + ${rollResult.modifier}` : ` - ${Math.abs(rollResult.modifier)}`
  return `${rollsStr}${modifierStr} = ${rollResult.total}`
}

/**
 * Calculate ability modifier from ability score
 */
export function getAbilityModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2)
}

/**
 * Format ability modifier for display
 */
export function formatAbilityModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`
}