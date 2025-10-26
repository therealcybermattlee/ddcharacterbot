/**
 * Character Progression System
 *
 * Handles D&D 5e character leveling, experience points, and feature unlocks.
 * Implements official D&D 5e progression rules.
 */

/**
 * D&D 5e Experience Point Thresholds
 * Source: Player's Handbook
 */
export const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

/**
 * Proficiency Bonus by Level
 * Source: Player's Handbook
 */
export const PROFICIENCY_BONUS: Record<number, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

/**
 * Calculate level from experience points
 */
export function calculateLevel(experiencePoints: number): number {
  for (let level = 20; level >= 1; level--) {
    if (experiencePoints >= LEVEL_THRESHOLDS[level]) {
      return level;
    }
  }
  return 1;
}

/**
 * Get experience points needed for next level
 */
export function getExperienceToNextLevel(
  currentLevel: number,
  currentXP: number
): {
  current: number;
  required: number;
  remaining: number;
  percentage: number;
} | null {
  if (currentLevel >= 20) {
    return null; // Already at max level
  }

  const nextLevel = currentLevel + 1;
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = LEVEL_THRESHOLDS[nextLevel];

  const current = currentXP - currentThreshold;
  const required = nextThreshold - currentThreshold;
  const remaining = nextThreshold - currentXP;
  const percentage = Math.round((current / required) * 100);

  return {
    current,
    required,
    remaining,
    percentage,
  };
}

/**
 * Get proficiency bonus for level
 */
export function getProficiencyBonus(level: number): number {
  return PROFICIENCY_BONUS[Math.min(20, Math.max(1, level))];
}

/**
 * Calculate ability modifier from ability score
 */
export function calculateModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

/**
 * Level up information
 */
export interface LevelUpInfo {
  newLevel: number;
  oldLevel: number;
  proficiencyBonus: number;
  featuresUnlocked: string[];
  abilityScoreImprovement: boolean;
}

/**
 * Get level up information
 */
export function getLevelUpInfo(
  oldLevel: number,
  newLevel: number,
  characterClass: string
): LevelUpInfo {
  const featuresUnlocked: string[] = [];
  const abilityScoreImprovement = newLevel % 4 === 0; // ASI at levels 4, 8, 12, 16, 19 (Fighter gets more)

  // Add class features based on level
  // This is a simplified version - in production, you'd query the classes table
  const classFeatures: Record<number, string[]> = {
    2: ['Class Feature'],
    3: ['Subclass Choice'],
    4: abilityScoreImprovement ? ['Ability Score Improvement'] : [],
    5: ['Extra Attack / 3rd Level Spells'],
    6: ['Class Feature'],
    7: ['Class Feature'],
    8: abilityScoreImprovement ? ['Ability Score Improvement'] : [],
    9: ['5th Level Spells'],
    10: ['Class Feature'],
    11: ['Class Feature'],
    12: abilityScoreImprovement ? ['Ability Score Improvement'] : [],
    13: ['7th Level Spells'],
    14: ['Class Feature'],
    15: ['Class Feature'],
    16: abilityScoreImprovement ? ['Ability Score Improvement'] : [],
    17: ['9th Level Spells'],
    18: ['Class Feature'],
    19: abilityScoreImprovement ? ['Ability Score Improvement'] : [],
    20: ['Capstone Feature'],
  };

  for (let level = oldLevel + 1; level <= newLevel; level++) {
    if (classFeatures[level]) {
      featuresUnlocked.push(...classFeatures[level]);
    }
  }

  return {
    newLevel,
    oldLevel,
    proficiencyBonus: getProficiencyBonus(newLevel),
    featuresUnlocked,
    abilityScoreImprovement,
  };
}

/**
 * Validate level up
 */
export function canLevelUp(
  currentLevel: number,
  experiencePoints: number
): { canLevel: boolean; reason?: string } {
  if (currentLevel >= 20) {
    return { canLevel: false, reason: 'Already at maximum level (20)' };
  }

  const requiredXP = LEVEL_THRESHOLDS[currentLevel + 1];
  if (experiencePoints < requiredXP) {
    return {
      canLevel: false,
      reason: `Not enough experience points (need ${requiredXP}, have ${experiencePoints})`,
    };
  }

  return { canLevel: true };
}

/**
 * Calculate hit points gained on level up
 */
export function calculateHitPointsGained(
  hitDie: string,
  constitutionModifier: number,
  useAverage: boolean = true
): number {
  // Hit die format: "d8", "d10", etc.
  const dieSize = parseInt(hitDie.substring(1));

  // RAW: You can roll the hit die or take the average (rounded up)
  const hitPoints = useAverage
    ? Math.floor(dieSize / 2) + 1 + constitutionModifier
    : Math.floor(Math.random() * dieSize) + 1 + constitutionModifier;

  // Minimum 1 HP per level
  return Math.max(1, hitPoints);
}

/**
 * Spell slots per level (for full casters)
 * Source: Player's Handbook
 */
export const SPELL_SLOTS_FULL_CASTER: Record<
  number,
  Record<number, number>
> = {
  1: { 1: 2 },
  2: { 1: 3 },
  3: { 1: 4, 2: 2 },
  4: { 1: 4, 2: 3 },
  5: { 1: 4, 2: 3, 3: 2 },
  6: { 1: 4, 2: 3, 3: 3 },
  7: { 1: 4, 2: 3, 3: 3, 4: 1 },
  8: { 1: 4, 2: 3, 3: 3, 4: 2 },
  9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
  18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
  19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
  20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
};

/**
 * Get spell slots for a character level
 */
export function getSpellSlots(
  level: number,
  spellcasterType: 'full' | 'half' | 'third' | 'none' = 'none'
): Record<number, number> | null {
  if (spellcasterType === 'none') {
    return null;
  }

  // Adjust level for half and third casters
  let effectiveLevel = level;
  if (spellcasterType === 'half') {
    effectiveLevel = Math.ceil(level / 2);
  } else if (spellcasterType === 'third') {
    effectiveLevel = Math.ceil(level / 3);
  }

  effectiveLevel = Math.min(20, Math.max(1, effectiveLevel));

  return SPELL_SLOTS_FULL_CASTER[effectiveLevel] || {};
}

/**
 * Calculate passive perception
 */
export function calculatePassivePerception(
  wisdomModifier: number,
  proficiencyBonus: number,
  isProficient: boolean
): number {
  const base = 10 + wisdomModifier;
  return isProficient ? base + proficiencyBonus : base;
}

/**
 * Calculate initiative modifier
 */
export function calculateInitiative(dexterityModifier: number): number {
  return dexterityModifier;
}

/**
 * Calculate spell save DC
 */
export function calculateSpellSaveDC(
  spellcastingModifier: number,
  proficiencyBonus: number
): number {
  return 8 + spellcastingModifier + proficiencyBonus;
}

/**
 * Calculate spell attack bonus
 */
export function calculateSpellAttackBonus(
  spellcastingModifier: number,
  proficiencyBonus: number
): number {
  return spellcastingModifier + proficiencyBonus;
}
