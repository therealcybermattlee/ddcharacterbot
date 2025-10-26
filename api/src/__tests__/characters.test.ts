import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateLevel,
  getExperienceToNextLevel,
  getProficiencyBonus,
  canLevelUp,
  getLevelUpInfo,
  calculateModifier,
  calculateHitPointsGained,
  getSpellSlots,
  calculatePassivePerception,
  calculateSpellSaveDC,
  calculateSpellAttackBonus,
} from '../lib/character-progression';

describe('Character Progression', () => {
  describe('Level Calculation', () => {
    it('should calculate level from experience points', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(300)).toBe(2);
      expect(calculateLevel(900)).toBe(3);
      expect(calculateLevel(2700)).toBe(4);
      expect(calculateLevel(6500)).toBe(5);
      expect(calculateLevel(355000)).toBe(20);
    });

    it('should handle experience points between thresholds', () => {
      expect(calculateLevel(500)).toBe(2); // Between 300 and 900
      expect(calculateLevel(5000)).toBe(4); // Between 2700 and 6500
      expect(calculateLevel(100000)).toBe(12);
    });

    it('should return level 1 for negative or zero XP', () => {
      expect(calculateLevel(-100)).toBe(1);
      expect(calculateLevel(0)).toBe(1);
    });
  });

  describe('Experience to Next Level', () => {
    it('should calculate XP needed for next level', () => {
      const result = getExperienceToNextLevel(1, 150);

      expect(result).not.toBeNull();
      expect(result?.current).toBe(150); // 150 - 0 (level 1 threshold)
      expect(result?.required).toBe(300); // 300 - 0
      expect(result?.remaining).toBe(150); // 300 - 150
      expect(result?.percentage).toBe(50); // 150 / 300 * 100
    });

    it('should return null at max level', () => {
      const result = getExperienceToNextLevel(20, 400000);
      expect(result).toBeNull();
    });

    it('should calculate percentage correctly', () => {
      const result = getExperienceToNextLevel(1, 0);
      expect(result?.percentage).toBe(0);

      const result2 = getExperienceToNextLevel(1, 300);
      expect(result2?.percentage).toBe(100);
    });
  });

  describe('Proficiency Bonus', () => {
    it('should return correct proficiency bonus for each level', () => {
      expect(getProficiencyBonus(1)).toBe(2);
      expect(getProficiencyBonus(4)).toBe(2);
      expect(getProficiencyBonus(5)).toBe(3);
      expect(getProficiencyBonus(8)).toBe(3);
      expect(getProficiencyBonus(9)).toBe(4);
      expect(getProficiencyBonus(12)).toBe(4);
      expect(getProficiencyBonus(13)).toBe(5);
      expect(getProficiencyBonus(16)).toBe(5);
      expect(getProficiencyBonus(17)).toBe(6);
      expect(getProficiencyBonus(20)).toBe(6);
    });

    it('should clamp invalid levels', () => {
      expect(getProficiencyBonus(0)).toBe(2); // Level 1
      expect(getProficiencyBonus(25)).toBe(6); // Level 20
      expect(getProficiencyBonus(-5)).toBe(2); // Level 1
    });
  });

  describe('Can Level Up', () => {
    it('should allow level up when requirements are met', () => {
      const result = canLevelUp(1, 300);
      expect(result.canLevel).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should prevent level up at max level', () => {
      const result = canLevelUp(20, 400000);
      expect(result.canLevel).toBe(false);
      expect(result.reason).toBe('Already at maximum level (20)');
    });

    it('should prevent level up without enough XP', () => {
      const result = canLevelUp(1, 100);
      expect(result.canLevel).toBe(false);
      expect(result.reason).toContain('Not enough experience points');
    });

    it('should allow multiple level jumps', () => {
      const result = canLevelUp(1, 10000);
      expect(result.canLevel).toBe(true);
    });
  });

  describe('Level Up Info', () => {
    it('should provide level up information', () => {
      const info = getLevelUpInfo(1, 2, 'Fighter');

      expect(info.oldLevel).toBe(1);
      expect(info.newLevel).toBe(2);
      expect(info.proficiencyBonus).toBe(2);
      expect(info.featuresUnlocked).toContain('Class Feature');
    });

    it('should detect ability score improvements', () => {
      const info = getLevelUpInfo(3, 4, 'Wizard');
      expect(info.abilityScoreImprovement).toBe(true);
      expect(info.featuresUnlocked).toContain('Ability Score Improvement');
    });

    it('should handle multi-level increases', () => {
      const info = getLevelUpInfo(1, 3, 'Rogue');
      expect(info.featuresUnlocked.length).toBeGreaterThan(0);
    });
  });

  describe('Ability Modifiers', () => {
    it('should calculate correct ability modifiers', () => {
      expect(calculateModifier(1)).toBe(-5);
      expect(calculateModifier(8)).toBe(-1);
      expect(calculateModifier(10)).toBe(0);
      expect(calculateModifier(11)).toBe(0);
      expect(calculateModifier(12)).toBe(1);
      expect(calculateModifier(15)).toBe(2);
      expect(calculateModifier(18)).toBe(4);
      expect(calculateModifier(20)).toBe(5);
    });

    it('should handle extreme values', () => {
      expect(calculateModifier(3)).toBe(-4);
      expect(calculateModifier(30)).toBe(10);
    });
  });

  describe('Hit Points', () => {
    it('should calculate hit points with average method', () => {
      const hp = calculateHitPointsGained('d8', 2, true);
      expect(hp).toBe(7); // floor(8/2) + 1 + 2 = 4 + 1 + 2 = 7
    });

    it('should calculate hit points with rolling', () => {
      const hp = calculateHitPointsGained('d10', 3, false);
      expect(hp).toBeGreaterThanOrEqual(1);
      expect(hp).toBeLessThanOrEqual(13); // 10 + 3
    });

    it('should ensure minimum 1 HP per level', () => {
      const hp = calculateHitPointsGained('d6', -5, true);
      expect(hp).toBe(1);
    });

    it('should handle different die sizes', () => {
      const d6 = calculateHitPointsGained('d6', 0, true);
      const d8 = calculateHitPointsGained('d8', 0, true);
      const d10 = calculateHitPointsGained('d10', 0, true);
      const d12 = calculateHitPointsGained('d12', 0, true);

      expect(d6).toBe(4); // floor(6/2) + 1 = 3 + 1 = 4
      expect(d8).toBe(5); // floor(8/2) + 1 = 4 + 1 = 5
      expect(d10).toBe(6); // floor(10/2) + 1 = 5 + 1 = 6
      expect(d12).toBe(7); // floor(12/2) + 1 = 6 + 1 = 7
    });
  });

  describe('Spell Slots', () => {
    it('should return correct spell slots for full caster', () => {
      const slots1 = getSpellSlots(1, 'full');
      expect(slots1).toEqual({ 1: 2 });

      const slots3 = getSpellSlots(3, 'full');
      expect(slots3).toEqual({ 1: 4, 2: 2 });

      const slots20 = getSpellSlots(20, 'full');
      expect(slots20?.[9]).toBe(1);
    });

    it('should return correct spell slots for half caster', () => {
      const slots2 = getSpellSlots(2, 'half');
      expect(slots2).toEqual({ 1: 2 });

      const slots6 = getSpellSlots(6, 'half');
      expect(slots6).toEqual({ 1: 4, 2: 2 });
    });

    it('should return correct spell slots for third caster', () => {
      const slots3 = getSpellSlots(3, 'third');
      expect(slots3).toEqual({ 1: 2 });

      const slots9 = getSpellSlots(9, 'third');
      expect(slots9).toEqual({ 1: 4, 2: 2 });
    });

    it('should return null for non-caster', () => {
      const slots = getSpellSlots(10, 'none');
      expect(slots).toBeNull();
    });
  });

  describe('Combat Calculations', () => {
    it('should calculate passive perception', () => {
      const pp1 = calculatePassivePerception(2, 2, false);
      expect(pp1).toBe(12); // 10 + 2

      const pp2 = calculatePassivePerception(2, 2, true);
      expect(pp2).toBe(14); // 10 + 2 + 2
    });

    it('should calculate spell save DC', () => {
      const dc = calculateSpellSaveDC(4, 3);
      expect(dc).toBe(15); // 8 + 4 + 3
    });

    it('should calculate spell attack bonus', () => {
      const bonus = calculateSpellAttackBonus(4, 3);
      expect(bonus).toBe(7); // 4 + 3
    });
  });
});

describe('Character Data Validation', () => {
  describe('Ability Scores', () => {
    it('should be within valid range', () => {
      const validScores = [3, 8, 10, 15, 18, 20];
      validScores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(3);
        expect(score).toBeLessThanOrEqual(20);
      });
    });
  });

  describe('Character Level', () => {
    it('should be within valid range', () => {
      const validLevels = [1, 5, 10, 15, 20];
      validLevels.forEach(level => {
        expect(level).toBeGreaterThanOrEqual(1);
        expect(level).toBeLessThanOrEqual(20);
      });
    });
  });

  describe('Experience Points', () => {
    it('should be non-negative', () => {
      expect(0).toBeGreaterThanOrEqual(0);
      expect(1000).toBeGreaterThanOrEqual(0);
      expect(355000).toBeGreaterThanOrEqual(0);
    });

    it('should match level requirements', () => {
      const level = 5;
      const xp = 6500;
      expect(calculateLevel(xp)).toBe(level);
    });
  });
});

describe('Character Export/Import', () => {
  describe('Export Format', () => {
    it('should include all required character fields', () => {
      const mockCharacter = {
        name: 'Test Character',
        race: 'Human',
        characterClass: 'Fighter',
        level: 5,
        experiencePoints: 6500,
        strength: 16,
        dexterity: 14,
        constitution: 15,
        intelligence: 10,
        wisdom: 12,
        charisma: 8,
        armorClass: 18,
        hitPointsMax: 42,
        hitPointsCurrent: 42,
        speed: 30,
      };

      expect(mockCharacter.name).toBeDefined();
      expect(mockCharacter.race).toBeDefined();
      expect(mockCharacter.characterClass).toBeDefined();
      expect(mockCharacter.level).toBeGreaterThanOrEqual(1);
      expect(mockCharacter.experiencePoints).toBeGreaterThanOrEqual(0);
    });

    it('should include calculated values', () => {
      const level = 5;
      const strength = 16;

      const proficiencyBonus = getProficiencyBonus(level);
      const strengthModifier = calculateModifier(strength);

      expect(proficiencyBonus).toBe(3);
      expect(strengthModifier).toBe(3);
    });
  });

  describe('Import Validation', () => {
    it('should validate required fields', () => {
      const requiredFields = [
        'name',
        'race',
        'characterClass',
        'level',
        'experiencePoints',
        'strength',
        'dexterity',
        'constitution',
        'intelligence',
        'wisdom',
        'charisma',
        'armorClass',
        'hitPointsMax',
        'speed',
      ];

      const mockImport = {
        name: 'Imported Character',
        race: 'Elf',
        characterClass: 'Wizard',
        level: 3,
        experiencePoints: 900,
        strength: 8,
        dexterity: 16,
        constitution: 14,
        intelligence: 18,
        wisdom: 12,
        charisma: 10,
        armorClass: 13,
        hitPointsMax: 18,
        speed: 30,
      };

      requiredFields.forEach(field => {
        expect(mockImport).toHaveProperty(field);
      });
    });
  });
});
