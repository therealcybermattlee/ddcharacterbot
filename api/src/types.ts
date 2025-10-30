// Cloudflare Workers Environment Types
export interface Env {
  // Cloudflare bindings
  DB: D1Database;
  KV: KVNamespace;
  ASSETS?: R2Bucket;

  // Environment variables
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_REQUESTS: string;
  RATE_LIMIT_WINDOW: string;

  // Secrets (set via wrangler secret put)
  JWT_SECRET: string;

  // Index signature for Hono compatibility
  [key: string]: any;
}

// Authentication types
export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface UserSession {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
  lastActivity: string;
}

// User types
export type UserRole = 'dm' | 'player' | 'observer';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// D&D Character types
export interface Character {
  id: string;
  name: string;
  userId: string;
  campaignId?: string;
  race: string;
  characterClass: string;
  level: number;
  experiencePoints: number;
  
  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  
  // Derived stats
  armorClass: number;
  hitPointsMax: number;
  hitPointsCurrent: number;
  speed: number;
  
  // Character details
  background?: string;
  alignment?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  dmUserId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Rate limiting types
export interface RateLimitInfo {
  count: number;
  resetTime: number;
  windowStart: number;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

// D&D 5e Reference Data Types

// Race types
export interface Race {
  id: string;
  name: string;
  size: string;
  speed: number;
  abilityScoreBonuses: Record<string, number>;
  traits: string[]; // Fixed: Changed from RaceTrait[] to string[] to match database storage
  languages: string[];
  proficiencies: RaceProficiencies;
  source: string;
  isHomebrew: boolean;
}

export interface RaceTrait {
  name: string;
  description: string;
  type: 'feature' | 'resistance' | 'immunity' | 'sense' | 'spell' | 'cantrip';
}

export interface RaceProficiencies {
  skills?: string[];
  tools?: string[];
  weapons?: string[];
  armor?: string[];
}

// Class types
export interface CharacterClass {
  id: string;
  name: string;
  hitDie: number; // Fixed: Changed from string to number to match database INTEGER
  primaryAbility: string[];
  savingThrowProficiencies: string[];
  skillProficiencies: string[];
  skillChoices: number;
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  startingEquipment: StartingEquipment;
  spellcastingAbility?: string;
  source: string;
  isHomebrew: boolean;
  subclasses?: Subclass[];
  features?: ClassFeature[];
}

export interface Subclass {
  id: string;
  name: string;
  description: string;
  features: ClassFeature[];
}

export interface ClassFeature {
  name: string;
  level: number;
  description: string;
  type: 'feature' | 'spell' | 'asi' | 'subclass_feature';
  subclass?: string;
}

export interface StartingEquipment {
  armor?: string[];
  weapons?: string[];
  tools?: string[];
  packs?: string[];
  other?: string[];
  gp?: { count: number; die: string };
}

// Background types
export interface Background {
  id: string;
  name: string;
  description: string;
  skillProficiencies: string[];
  languageChoices: number;
  toolProficiencies: string[];
  startingEquipment: BackgroundEquipment;
  featureName: string;
  featureDescription: string;
  suggestedCharacteristics: BackgroundCharacteristics;
  featChoices?: string[]; // Array of feat IDs that the player can choose from (2024 D&D backgrounds)
  source: string;
  isHomebrew: boolean;
}

export interface BackgroundEquipment {
  items: string[];
  gp: number;
}

export interface BackgroundCharacteristics {
  personalityTraits: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
}

// General feature types
export interface Feature {
  id: string;
  name: string;
  description: string;
  type: string;
  level?: number;
  source: string;
  prerequisites?: string[];
}

// Spell types
export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  atHigherLevels?: string;
  classes: string[];
  source: string;
  isHomebrew: boolean;
}

// Cache types for reference data
export interface CachedReferenceData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Character Sheet types for Sprint 4
export interface CharacterSheet {
  // Basic character info
  character: Character;

  // Calculated ability scores (base + racial bonuses)
  abilityScores: AbilityScores;

  // Ability modifiers
  abilityModifiers: AbilityModifiers;

  // Skills with calculated bonuses
  skills: SkillBonuses;

  // Saving throws with calculated bonuses
  savingThrows: SavingThrowBonuses;

  // Combat statistics
  combat: CombatStats;

  // Spell information (if applicable)
  spellcasting?: SpellcastingInfo;

  // Equipment and inventory
  equipment: EquipmentInfo;

  // Character background and features
  features: CharacterFeatures;
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface AbilityModifiers {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface SkillBonuses {
  acrobatics: SkillBonus;
  animalHandling: SkillBonus;
  arcana: SkillBonus;
  athletics: SkillBonus;
  deception: SkillBonus;
  history: SkillBonus;
  insight: SkillBonus;
  intimidation: SkillBonus;
  investigation: SkillBonus;
  medicine: SkillBonus;
  nature: SkillBonus;
  perception: SkillBonus;
  performance: SkillBonus;
  persuasion: SkillBonus;
  religion: SkillBonus;
  sleightOfHand: SkillBonus;
  stealth: SkillBonus;
  survival: SkillBonus;
}

export interface SkillBonus {
  bonus: number;
  isProficient: boolean;
  abilityModifier: number;
  proficiencyBonus: number;
}

export interface SavingThrowBonuses {
  strength: SavingThrowBonus;
  dexterity: SavingThrowBonus;
  constitution: SavingThrowBonus;
  intelligence: SavingThrowBonus;
  wisdom: SavingThrowBonus;
  charisma: SavingThrowBonus;
}

export interface SavingThrowBonus {
  bonus: number;
  isProficient: boolean;
  abilityModifier: number;
  proficiencyBonus: number;
}

export interface CombatStats {
  armorClass: number;
  initiative: number;
  speed: number;
  hitPointsMax: number;
  hitPointsCurrent: number;
  hitDie: string;
  proficiencyBonus: number;
  passivePerception: number;
}

export interface SpellcastingInfo {
  spellcastingAbility: string;
  spellcastingModifier: number;
  spellSaveDC: number;
  spellAttackBonus: number;
  cantripsKnown?: number;
  spellsKnown?: number;
  spellSlots?: SpellSlots;
}

export interface SpellSlots {
  level1?: number;
  level2?: number;
  level3?: number;
  level4?: number;
  level5?: number;
  level6?: number;
  level7?: number;
  level8?: number;
  level9?: number;
}

export interface EquipmentInfo {
  armor: string[];
  weapons: string[];
  tools: string[];
  other: string[];
  totalWeight?: number;
  carryingCapacity?: number;
}

export interface CharacterFeatures {
  raceFeatures: RaceTrait[];
  classFeatures: ClassFeature[];
  backgroundFeatures: BackgroundFeature[];
}

export interface BackgroundFeature {
  name: string;
  description: string;
  type: string;
}