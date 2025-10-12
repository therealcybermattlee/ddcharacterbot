// D&D 5e Spell Data - Comprehensive Spell List
// Source: D&D 5e System Reference Document (SRD)

export interface Spell {
  id: string
  name: string
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
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
  source: string
}

// Complete D&D 5e Spell List
export const SPELLS: Spell[] = [
  // ===== CANTRIPS (Level 0) =====

  // Acid Splash
  {
    id: 'acid_splash',
    name: 'Acid Splash',
    level: 0,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'You hurl a bubble of acid. Choose one creature within range, or choose two creatures within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage. This spell\'s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Blade Ward
  {
    id: 'blade_ward',
    name: 'Blade Ward',
    level: 0,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S'],
    duration: '1 round',
    description: 'You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    source: 'PHB'
  },

  // Chill Touch
  {
    id: 'chill_touch',
    name: 'Chill Touch',
    level: 0,
    school: 'Necromancy',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S'],
    duration: '1 round',
    description: 'You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can\'t regain hit points until the start of your next turn. Until then, the hand clings to the target. If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn. This spell\'s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).',
    classes: ['sorcerer', 'warlock', 'wizard'],
    source: 'PHB'
  },

  // Dancing Lights
  {
    id: 'dancing_lights',
    name: 'Dancing Lights',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a bit of phosphorus or wychwood, or a glowworm',
    duration: 'Concentration, up to 1 minute',
    description: 'You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius.',
    classes: ['bard', 'sorcerer', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Druidcraft
  {
    id: 'druidcraft',
    name: 'Druidcraft',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'Whispering to the spirits of nature, you create one of the following effects within range: You create a tiny, harmless sensory effect that predicts what the weather will be at your location for the next 24 hours. You instantly make a flower blossom, a seed pod open, or a leaf bud bloom. You create an instantaneous, harmless sensory effect, such as falling leaves, a puff of wind, the sound of a small animal, or the faint odor of skunk. You instantly light or snuff out a candle, a torch, or a small campfire.',
    classes: ['druid'],
    source: 'PHB'
  },

  // Eldritch Blast
  {
    id: 'eldritch_blast',
    name: 'Eldritch Blast',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage. The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.',
    classes: ['warlock'],
    source: 'PHB'
  },

  // Fire Bolt
  {
    id: 'fire_bolt',
    name: 'Fire Bolt',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn\'t being worn or carried. This spell\'s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Friends
  {
    id: 'friends',
    name: 'Friends',
    level: 0,
    school: 'Enchantment',
    castingTime: '1 action',
    range: 'Self',
    components: ['S', 'M'],
    materialComponent: 'a small amount of makeup applied to the face as this spell is cast',
    duration: 'Concentration, up to 1 minute',
    description: 'For the duration, you have advantage on all Charisma checks directed at one creature of your choice that isn\'t hostile toward you. When the spell ends, the creature realizes that you used magic to influence its mood and becomes hostile toward you.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Guidance
  {
    id: 'guidance',
    name: 'Guidance',
    level: 0,
    school: 'Divination',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S'],
    duration: 'Concentration, up to 1 minute',
    description: 'You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.',
    classes: ['cleric', 'druid'],
    concentration: true,
    source: 'PHB'
  },

  // Light
  {
    id: 'light',
    name: 'Light',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'M'],
    materialComponent: 'a firefly or phosphorescent moss',
    duration: '1 hour',
    description: 'You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action.',
    classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Mage Hand
  {
    id: 'mage_hand',
    name: 'Mage Hand',
    level: 0,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S'],
    duration: '1 minute',
    description: 'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it as an action. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again. You can use your action to control the hand. You can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. The hand can\'t attack, activate magic items, or carry more than 10 pounds.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    source: 'PHB'
  },

  // Mending
  {
    id: 'mending',
    name: 'Mending',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 minute',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'two lodestones',
    duration: 'Instantaneous',
    description: 'This spell repairs a single break or tear in an object you touch, such as a broken chain link, two halves of a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no larger than 1 foot in any dimension, you mend it, leaving no trace of the former damage.',
    classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Message
  {
    id: 'message',
    name: 'Message',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a short piece of copper wire',
    duration: '1 round',
    description: 'You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear. You can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier.',
    classes: ['bard', 'sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Minor Illusion
  {
    id: 'minor_illusion',
    name: 'Minor Illusion',
    level: 0,
    school: 'Illusion',
    castingTime: '1 action',
    range: '30 feet',
    components: ['S', 'M'],
    materialComponent: 'a bit of fleece',
    duration: '1 minute',
    description: 'You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again. If you create a sound, its volume can range from a whisper to a scream. If you create an image of an object—such as a chair, muddy footprints, or a small chest—it must be no larger than a 5-foot cube. The image can\'t create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    source: 'PHB'
  },

  // Poison Spray
  {
    id: 'poison_spray',
    name: 'Poison Spray',
    level: 0,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '10 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage. This spell\'s damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).',
    classes: ['druid', 'sorcerer', 'warlock', 'wizard'],
    source: 'PHB'
  },

  // Prestidigitation
  {
    id: 'prestidigitation',
    name: 'Prestidigitation',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '10 feet',
    components: ['V', 'S'],
    duration: 'Up to 1 hour',
    description: 'This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range: You create an instantaneous, harmless sensory effect; You instantly light or snuff out a candle, torch, or small campfire; You instantly clean or soil an object; You chill, warm, or flavor up to 1 cubic foot of nonliving material; You make a color, small mark, or symbol appear on an object or surface; You create a nonmagical trinket or illusory image that fits in your hand.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    source: 'PHB'
  },

  // Produce Flame
  {
    id: 'produce_flame',
    name: 'Produce Flame',
    level: 0,
    school: 'Conjuration',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S'],
    duration: '10 minutes',
    description: 'A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again. You can also attack with the flame, ending the spell. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage. This spell\'s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).',
    classes: ['druid'],
    source: 'PHB'
  },

  // Ray of Frost
  {
    id: 'ray_of_frost',
    name: 'Ray of Frost',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn. The spell\'s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Resistance
  {
    id: 'resistance',
    name: 'Resistance',
    level: 0,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'a miniature cloak',
    duration: 'Concentration, up to 1 minute',
    description: 'You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends.',
    classes: ['cleric', 'druid'],
    concentration: true,
    source: 'PHB'
  },

  // Sacred Flame
  {
    id: 'sacred_flame',
    name: 'Sacred Flame',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw. The spell\'s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).',
    classes: ['cleric'],
    source: 'PHB'
  },

  // Shillelagh
  {
    id: 'shillelagh',
    name: 'Shillelagh',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 bonus action',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'mistletoe, a shamrock leaf, and a club or quarterstaff',
    duration: '1 minute',
    description: 'The wood of a club or quarterstaff you are holding is imbued with nature\'s power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon\'s damage die becomes a d8. The weapon also becomes magical, if it isn\'t already. The spell ends if you cast it again or if you let go of the weapon.',
    classes: ['druid'],
    source: 'PHB'
  },

  // Shocking Grasp
  {
    id: 'shocking_grasp',
    name: 'Shocking Grasp',
    level: 0,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can\'t take reactions until the start of its next turn. The spell\'s damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Spare the Dying
  {
    id: 'spare_the_dying',
    name: 'Spare the Dying',
    level: 0,
    school: 'Necromancy',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.',
    classes: ['cleric'],
    source: 'PHB'
  },

  // Thaumaturgy
  {
    id: 'thaumaturgy',
    name: 'Thaumaturgy',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V'],
    duration: 'Up to 1 minute',
    description: 'You manifest a minor wonder, a sign of supernatural power, within range. You create one of the following magical effects within range: Your voice booms up to three times as loud as normal; You cause flames to flicker, brighten, dim, or change color; You cause harmless tremors in the ground; You create an instantaneous sound; You instantly cause an unlocked door or window to fly open or slam shut; You alter the appearance of your eyes.',
    classes: ['cleric'],
    source: 'PHB'
  },

  // Thorn Whip
  {
    id: 'thorn_whip',
    name: 'Thorn Whip',
    level: 0,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'the stem of a plant with thorns',
    duration: 'Instantaneous',
    description: 'You create a long, vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target. If the attack hits, the creature takes 1d6 piercing damage, and if the creature is Large or smaller, you pull the creature up to 10 feet closer to you. This spell\'s damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).',
    classes: ['druid'],
    source: 'PHB'
  },

  // True Strike
  {
    id: 'true_strike',
    name: 'True Strike',
    level: 0,
    school: 'Divination',
    castingTime: '1 action',
    range: '30 feet',
    components: ['S'],
    duration: 'Concentration, up to 1 round',
    description: 'You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target\'s defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn\'t ended.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Vicious Mockery
  {
    id: 'vicious_mockery',
    name: 'Vicious Mockery',
    level: 0,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V'],
    duration: 'Instantaneous',
    description: 'You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn. This spell\'s damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).',
    classes: ['bard'],
    source: 'PHB'
  },

  // ===== 1ST LEVEL SPELLS =====

  // Alarm
  {
    id: 'alarm',
    name: 'Alarm',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 minute',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a tiny bell and a piece of fine silver wire',
    duration: '8 hours',
    description: 'You set an alarm against unwanted intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot cube. Until the spell ends, an alarm alerts you whenever a Tiny or larger creature touches or enters the warded area. When you cast the spell, you can designate creatures that won\'t set off the alarm. You also choose whether the alarm is mental or audible.',
    classes: ['ranger', 'wizard'],
    ritual: true,
    source: 'PHB'
  },

  // Animal Friendship
  {
    id: 'animal_friendship',
    name: 'Animal Friendship',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a morsel of food',
    duration: '24 hours',
    description: 'This spell lets you convince a beast that you mean it no harm. Choose a beast that you can see within range. It must see and hear you. If the beast\'s Intelligence is 4 or higher, the spell fails. Otherwise, the beast must succeed on a Wisdom saving throw or be charmed by you for the spell\'s duration. If you or one of your companions harms the target, the spell ends.',
    classes: ['bard', 'druid', 'ranger'],
    source: 'PHB'
  },

  // Armor of Agathys
  {
    id: 'armor_of_agathys',
    name: 'Armor of Agathys',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S', 'M'],
    materialComponent: 'a cup of water',
    duration: '1 hour',
    description: 'A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st.',
    classes: ['warlock'],
    source: 'PHB'
  },

  // Arms of Hadar
  {
    id: 'arms_of_hadar',
    name: 'Arms of Hadar',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: 'Self (10-foot radius)',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'You invoke the power of Hadar, the Dark Hunger. Tendrils of dark energy erupt from you and batter all creatures within 10 feet of you. Each creature in that area must make a Strength saving throw. On a failed save, a target takes 2d6 necrotic damage and can\'t take reactions until its next turn. On a successful save, the creature takes half damage, but suffers no other effect. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.',
    classes: ['warlock'],
    source: 'PHB'
  },

  // Bane
  {
    id: 'bane',
    name: 'Bane',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a drop of blood',
    duration: 'Concentration, up to 1 minute',
    description: 'Up to three creatures of your choice that you can see within range must make Charisma saving throws. Whenever a target that fails this saving throw makes an attack roll or a saving throw before the spell ends, the target must roll a d4 and subtract the number rolled from the attack roll or saving throw. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.',
    classes: ['bard', 'cleric'],
    concentration: true,
    source: 'PHB'
  },

  // Bless
  {
    id: 'bless',
    name: 'Bless',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a sprinkling of holy water',
    duration: 'Concentration, up to 1 minute',
    description: 'You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.',
    classes: ['cleric', 'paladin'],
    concentration: true,
    source: 'PHB'
  },

  // Burning Hands
  {
    id: 'burning_hands',
    name: 'Burning Hands',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Self (15-foot cone)',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one. The fire ignites any flammable objects in the area that aren\'t being worn or carried. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Charm Person
  {
    id: 'charm_person',
    name: 'Charm Person',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S'],
    duration: 'Concentration, up to 1 hour',
    description: 'You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.',
    classes: ['bard', 'druid', 'sorcerer', 'warlock', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Color Spray
  {
    id: 'color_spray',
    name: 'Color Spray',
    level: 1,
    school: 'Illusion',
    castingTime: '1 action',
    range: 'Self (15-foot cone)',
    components: ['V', 'S', 'M'],
    materialComponent: 'a pinch of powder or sand that is colored red, yellow, and blue',
    duration: 'Instantaneous',
    description: 'A dazzling array of flashing, colored light springs from your hand. Roll 6d10; the total is how many hit points of creatures this spell can affect. Creatures in a 15-foot cone originating from you are affected in ascending order of their current hit points (ignoring unconscious creatures and creatures that can\'t see). Starting with the creature that has the lowest current hit points, each creature affected by this spell is blinded until the spell ends. Subtract each creature\'s hit points from the total before moving on to the creature with the next lowest hit points. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d10 for each slot level above 1st.',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Command
  {
    id: 'command',
    name: 'Command',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V'],
    duration: '1 round',
    description: 'You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn\'t understand your language, or if your command is directly harmful to it. Some typical commands and their effects: Approach, Drop, Flee, Grovel, Halt. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st.',
    classes: ['cleric', 'paladin'],
    source: 'PHB'
  },

  // Comprehend Languages
  {
    id: 'comprehend_languages',
    name: 'Comprehend Languages',
    level: 1,
    school: 'Divination',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S', 'M'],
    materialComponent: 'a pinch of soot and salt',
    duration: '1 hour',
    description: 'For the duration, you understand the literal meaning of any spoken language that you hear. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text. This spell doesn\'t decode secret messages in a text or a glyph, such as an arcane sigil, that isn\'t part of a written language.',
    classes: ['bard', 'sorcerer', 'warlock', 'wizard'],
    ritual: true,
    source: 'PHB'
  },

  // Create or Destroy Water
  {
    id: 'create_or_destroy_water',
    name: 'Create or Destroy Water',
    level: 1,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a drop of water if creating water or a few grains of sand if destroying it',
    duration: 'Instantaneous',
    description: 'You either create or destroy water. Create Water: You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot cube within range, extinguishing exposed flames in the area. Destroy Water: You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot cube within range. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, you create or destroy 10 additional gallons of water for each slot level above 1st.',
    classes: ['cleric', 'druid'],
    source: 'PHB'
  },

  // Cure Wounds
  {
    id: 'cure_wounds',
    name: 'Cure Wounds',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.',
    classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger'],
    source: 'PHB'
  },

  // Detect Evil and Good
  {
    id: 'detect_evil_and_good',
    name: 'Detect Evil and Good',
    level: 1,
    school: 'Divination',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S'],
    duration: 'Concentration, up to 10 minutes',
    description: 'For the duration, you know if there is an aberration, celestial, elemental, fey, fiend, or undead within 30 feet of you, as well as where the creature is located. Similarly, you know if there is a place or object within 30 feet of you that has been magically consecrated or desecrated. The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.',
    classes: ['cleric', 'paladin'],
    concentration: true,
    source: 'PHB'
  },

  // Detect Magic
  {
    id: 'detect_magic',
    name: 'Detect Magic',
    level: 1,
    school: 'Divination',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S'],
    duration: 'Concentration, up to 10 minutes',
    description: 'For the duration, you sense the presence of magic within 30 feet of you. If you sense magic in this way, you can use your action to see a faint aura around any visible creature or object in the area that bears magic, and you learn its school of magic, if any. The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.',
    classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'wizard'],
    concentration: true,
    ritual: true,
    source: 'PHB'
  },

  // Detect Poison and Disease
  {
    id: 'detect_poison_and_disease',
    name: 'Detect Poison and Disease',
    level: 1,
    school: 'Divination',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S', 'M'],
    materialComponent: 'a yew leaf',
    duration: 'Concentration, up to 10 minutes',
    description: 'For the duration, you can sense the presence and location of poisons, poisonous creatures, and diseases within 30 feet of you. You also identify the kind of poison, poisonous creature, or disease in each case. The spell can penetrate most barriers, but it is blocked by 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood or dirt.',
    classes: ['cleric', 'druid', 'paladin', 'ranger'],
    concentration: true,
    ritual: true,
    source: 'PHB'
  },

  // Disguise Self
  {
    id: 'disguise_self',
    name: 'Disguise Self',
    level: 1,
    school: 'Illusion',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S'],
    duration: '1 hour',
    description: 'You make yourself—including your clothing, armor, weapons, and other belongings on your person—look different until the spell ends or until you use your action to dismiss it. You can seem 1 foot shorter or taller and can appear thin, fat, or in between. You can\'t change your body type, so you must adopt a form that has the same basic arrangement of limbs. Otherwise, the extent of the illusion is up to you. The changes wrought by this spell fail to hold up to physical inspection.',
    classes: ['bard', 'sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Dissonant Whispers
  {
    id: 'dissonant_whispers',
    name: 'Dissonant Whispers',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V'],
    duration: 'Instantaneous',
    description: 'You whisper a discordant melody that only one creature of your choice within range can hear, wracking it with terrible pain. The target must make a Wisdom saving throw. On a failed save, it takes 3d6 psychic damage and must immediately use its reaction, if available, to move as far as its speed allows away from you. The creature doesn\'t move into obviously dangerous ground. On a successful save, the target takes half as much damage and doesn\'t have to move away. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.',
    classes: ['bard'],
    source: 'PHB'
  },

  // Entangle
  {
    id: 'entangle',
    name: 'Entangle',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '90 feet',
    components: ['V', 'S'],
    duration: 'Concentration, up to 1 minute',
    description: 'Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.',
    classes: ['druid'],
    concentration: true,
    source: 'PHB'
  },

  // Expeditious Retreat
  {
    id: 'expeditious_retreat',
    name: 'Expeditious Retreat',
    level: 1,
    school: 'Transmutation',
    castingTime: '1 bonus action',
    range: 'Self',
    components: ['V', 'S'],
    duration: 'Concentration, up to 10 minutes',
    description: 'This spell allows you to move at an incredible pace. When you cast this spell, and then as a bonus action on each of your turns until the spell ends, you can take the Dash action.',
    classes: ['sorcerer', 'warlock', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Faerie Fire
  {
    id: 'faerie_fire',
    name: 'Faerie Fire',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V'],
    duration: 'Concentration, up to 1 minute',
    description: 'Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius. Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can\'t benefit from being invisible.',
    classes: ['bard', 'druid'],
    concentration: true,
    source: 'PHB'
  },

  // False Life
  {
    id: 'false_life',
    name: 'False Life',
    level: 1,
    school: 'Necromancy',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S', 'M'],
    materialComponent: 'a small amount of alcohol or distilled spirits',
    duration: '1 hour',
    description: 'Bolstering yourself with a necromantic facsimile of life, you gain 1d4 + 4 temporary hit points for the duration. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, you gain 5 additional temporary hit points for each slot level above 1st.',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Feather Fall
  {
    id: 'feather_fall',
    name: 'Feather Fall',
    level: 1,
    school: 'Transmutation',
    castingTime: '1 reaction',
    range: '60 feet',
    components: ['V', 'M'],
    materialComponent: 'a small feather or piece of down',
    duration: '1 minute',
    description: 'Choose up to five falling creatures within range. A falling creature\'s rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature.',
    classes: ['bard', 'sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Find Familiar
  {
    id: 'find_familiar',
    name: 'Find Familiar',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 hour',
    range: '10 feet',
    components: ['V', 'S', 'M'],
    materialComponent: '10 gp worth of charcoal, incense, and herbs that must be consumed by fire in a brass brazier',
    duration: 'Instantaneous',
    description: 'You gain the service of a familiar, a spirit that takes an animal form you choose: bat, cat, crab, frog (toad), hawk, lizard, octopus, owl, poisonous snake, fish (quipper), rat, raven, sea horse, spider, or weasel. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form, though it is a celestial, fey, or fiend (your choice) instead of a beast.',
    classes: ['wizard'],
    ritual: true,
    source: 'PHB'
  },

  // Fog Cloud
  {
    id: 'fog_cloud',
    name: 'Fog Cloud',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S'],
    duration: 'Concentration, up to 1 hour',
    description: 'You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.',
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Goodberry
  {
    id: 'goodberry',
    name: 'Goodberry',
    level: 1,
    school: 'Transmutation',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'a sprig of mistletoe',
    duration: 'Instantaneous',
    description: 'Up to ten berries appear in your hand and are infused with magic for the duration. A creature can use its action to eat one berry. Eating a berry restores 1 hit point, and the berry provides enough nourishment to sustain a creature for one day. The berries lose their potency if they have not been consumed within 24 hours of the casting of this spell.',
    classes: ['druid', 'ranger'],
    source: 'PHB'
  },

  // Grease
  {
    id: 'grease',
    name: 'Grease',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a bit of pork rind or butter',
    duration: '1 minute',
    description: 'Slick grease covers the ground in a 10-foot square centered on a point within range and turns it into difficult terrain for the duration. When the grease appears, each creature standing in its area must succeed on a Dexterity saving throw or fall prone. A creature that enters the area or ends its turn there must also succeed on a Dexterity saving throw or fall prone.',
    classes: ['wizard'],
    source: 'PHB'
  },

  // Guiding Bolt
  {
    id: 'guiding_bolt',
    name: 'Guiding Bolt',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S'],
    duration: '1 round',
    description: 'A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.',
    classes: ['cleric'],
    source: 'PHB'
  },

  // Healing Word
  {
    id: 'healing_word',
    name: 'Healing Word',
    level: 1,
    school: 'Evocation',
    castingTime: '1 bonus action',
    range: '60 feet',
    components: ['V'],
    duration: 'Instantaneous',
    description: 'A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.',
    classes: ['bard', 'cleric', 'druid'],
    source: 'PHB'
  },

  // Hellish Rebuke
  {
    id: 'hellish_rebuke',
    name: 'Hellish Rebuke',
    level: 1,
    school: 'Evocation',
    castingTime: '1 reaction',
    range: '60 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.',
    classes: ['warlock'],
    source: 'PHB'
  },

  // Hex
  {
    id: 'hex',
    name: 'Hex',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 bonus action',
    range: '90 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'the petrified eye of a newt',
    duration: 'Concentration, up to 1 hour',
    description: 'You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack. Also, choose one ability when you cast the spell. The target has disadvantage on ability checks made with the chosen ability. If the target drops to 0 hit points before this spell ends, you can use a bonus action on a subsequent turn of yours to curse a new creature. At Higher Levels: When you cast this spell using a spell slot of 3rd or 4th level, you can maintain your concentration on the spell for up to 8 hours. When you use a spell slot of 5th level or higher, you can maintain your concentration on the spell for up to 24 hours.',
    classes: ['warlock'],
    concentration: true,
    source: 'PHB'
  },

  // Identify
  {
    id: 'identify',
    name: 'Identify',
    level: 1,
    school: 'Divination',
    castingTime: '1 minute',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'a pearl worth at least 100 gp and an owl feather',
    duration: 'Instantaneous',
    description: 'You choose one object that you must touch throughout the casting of the spell. If it is a magic item or some other magic-imbued object, you learn its properties and how to use them, whether it requires attunement to use, and how many charges it has, if any. You learn whether any spells are affecting the item and what they are. If the item was created by a spell, you learn which spell created it.',
    classes: ['bard', 'wizard'],
    ritual: true,
    source: 'PHB'
  },

  // Illusory Script
  {
    id: 'illusory_script',
    name: 'Illusory Script',
    level: 1,
    school: 'Illusion',
    castingTime: '1 minute',
    range: 'Touch',
    components: ['S', 'M'],
    materialComponent: 'a lead-based ink worth at least 10 gp, which the spell consumes',
    duration: '10 days',
    description: 'You write on parchment, paper, or some other suitable writing material and imbue it with a potent illusion that lasts for the duration. To you and any creatures you designate when you cast the spell, the writing appears normal, written in your hand, and conveys whatever meaning you intended when you wrote the text. To all others, the writing appears as if it were written in an unknown or magical script that is unintelligible.',
    classes: ['bard', 'warlock', 'wizard'],
    ritual: true,
    source: 'PHB'
  },

  // Inflict Wounds
  {
    id: 'inflict_wounds',
    name: 'Inflict Wounds',
    level: 1,
    school: 'Necromancy',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.',
    classes: ['cleric'],
    source: 'PHB'
  },

  // Jump
  {
    id: 'jump',
    name: 'Jump',
    level: 1,
    school: 'Transmutation',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'a grasshopper\'s hind leg',
    duration: '1 minute',
    description: 'You touch a creature. The creature\'s jump distance is tripled until the spell ends.',
    classes: ['druid', 'ranger', 'sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Longstrider
  {
    id: 'longstrider',
    name: 'Longstrider',
    level: 1,
    school: 'Transmutation',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'a pinch of dirt',
    duration: '1 hour',
    description: 'You touch a creature. The target\'s speed increases by 10 feet until the spell ends. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.',
    classes: ['bard', 'druid', 'ranger', 'wizard'],
    source: 'PHB'
  },

  // Mage Armor
  {
    id: 'mage_armor',
    name: 'Mage Armor',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'a piece of cured leather',
    duration: '8 hours',
    description: 'You touch a willing creature who isn\'t wearing armor, and a protective magical force surrounds it until the spell ends. The target\'s base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Magic Missile
  {
    id: 'magic_missile',
    name: 'Magic Missile',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '120 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Protection from Evil and Good
  {
    id: 'protection_from_evil_and_good',
    name: 'Protection from Evil and Good',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 action',
    range: 'Touch',
    components: ['V', 'S', 'M'],
    materialComponent: 'holy water or powdered silver and iron, which the spell consumes',
    duration: 'Concentration, up to 10 minutes',
    description: 'Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead. The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can\'t be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect.',
    classes: ['cleric', 'paladin', 'warlock', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Purify Food and Drink
  {
    id: 'purify_food_and_drink',
    name: 'Purify Food and Drink',
    level: 1,
    school: 'Transmutation',
    castingTime: '1 action',
    range: '10 feet',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'All nonmagical food and drink within a 5-foot-radius sphere centered on a point of your choice within range is purified and rendered free of poison and disease.',
    classes: ['cleric', 'druid', 'paladin'],
    ritual: true,
    source: 'PHB'
  },

  // Sanctuary
  {
    id: 'sanctuary',
    name: 'Sanctuary',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 bonus action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a small silver mirror',
    duration: '1 minute',
    description: 'You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn\'t protect the warded creature from area effects, such as the explosion of a fireball. If the warded creature makes an attack or casts a spell that affects an enemy creature, this spell ends.',
    classes: ['cleric'],
    source: 'PHB'
  },

  // Shield
  {
    id: 'shield',
    name: 'Shield',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 reaction',
    range: 'Self',
    components: ['V', 'S'],
    duration: '1 round',
    description: 'An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.',
    classes: ['sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Shield of Faith
  {
    id: 'shield_of_faith',
    name: 'Shield of Faith',
    level: 1,
    school: 'Abjuration',
    castingTime: '1 bonus action',
    range: '60 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a small parchment with a bit of holy text written on it',
    duration: 'Concentration, up to 10 minutes',
    description: 'A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.',
    classes: ['cleric', 'paladin'],
    concentration: true,
    source: 'PHB'
  },

  // Silent Image
  {
    id: 'silent_image',
    name: 'Silent Image',
    level: 1,
    school: 'Illusion',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a bit of fleece',
    duration: 'Concentration, up to 10 minutes',
    description: 'You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot cube. The image appears at a spot within range and lasts for the duration. The image is purely visual; it isn\'t accompanied by sound, smell, or other sensory effects. You can use your action to cause the image to move to any spot within range. As the image changes location, you can alter its appearance so that its movements appear natural for the image.',
    classes: ['bard', 'sorcerer', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Sleep
  {
    id: 'sleep',
    name: 'Sleep',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '90 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a pinch of fine sand, rose petals, or a cricket',
    duration: '1 minute',
    description: 'This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures). Starting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st.',
    classes: ['bard', 'sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Speak with Animals
  {
    id: 'speak_with_animals',
    name: 'Speak with Animals',
    level: 1,
    school: 'Divination',
    castingTime: '1 action',
    range: 'Self',
    components: ['V', 'S'],
    duration: '10 minutes',
    description: 'You gain the ability to comprehend and verbally communicate with beasts for the duration. The knowledge and awareness of many beasts is limited by their intelligence, but at minimum, beasts can give you information about nearby locations and monsters, including whatever they can perceive or have perceived within the past day. You might be able to persuade a beast to perform a small favor for you, at the GM\'s discretion.',
    classes: ['bard', 'druid', 'ranger'],
    ritual: true,
    source: 'PHB'
  },

  // Tasha's Hideous Laughter
  {
    id: 'tashas_hideous_laughter',
    name: 'Tasha\'s Hideous Laughter',
    level: 1,
    school: 'Enchantment',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'tiny tarts and a feather that is waved in the air',
    duration: 'Concentration, up to 1 minute',
    description: 'A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn\'t affected. At the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it\'s triggered by damage. On a success, the spell ends.',
    classes: ['bard', 'wizard'],
    concentration: true,
    source: 'PHB'
  },

  // Thunderwave
  {
    id: 'thunderwave',
    name: 'Thunderwave',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: 'Self (15-foot cube)',
    components: ['V', 'S'],
    duration: 'Instantaneous',
    description: 'A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn\'t pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell\'s effect, and the spell emits a thunderous boom audible out to 300 feet. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.',
    classes: ['bard', 'druid', 'sorcerer', 'wizard'],
    source: 'PHB'
  },

  // Unseen Servant
  {
    id: 'unseen_servant',
    name: 'Unseen Servant',
    level: 1,
    school: 'Conjuration',
    castingTime: '1 action',
    range: '60 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a piece of string and a bit of wood',
    duration: '1 hour',
    description: 'This spell creates an invisible, mindless, shapeless force that performs simple tasks at your command until the spell ends. The servant springs into existence in an unoccupied space on the ground within range. It has AC 10, 1 hit point, and a Strength of 2, and it can\'t attack. If it drops to 0 hit points, the spell ends. Once on each of your turns as a bonus action, you can mentally command the servant to move up to 15 feet and interact with an object. The servant can perform simple tasks that a human servant could do, such as fetching things, cleaning, mending, folding clothes, lighting fires, serving food, and pouring wine.',
    classes: ['bard', 'warlock', 'wizard'],
    ritual: true,
    source: 'PHB'
  },

  // Witch Bolt
  {
    id: 'witch_bolt',
    name: 'Witch Bolt',
    level: 1,
    school: 'Evocation',
    castingTime: '1 action',
    range: '30 feet',
    components: ['V', 'S', 'M'],
    materialComponent: 'a twig from a tree that has been struck by lightning',
    duration: 'Concentration, up to 1 minute',
    description: 'A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell\'s range or if it has total cover from you. At Higher Levels: When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.',
    classes: ['sorcerer', 'warlock', 'wizard'],
    concentration: true,
    source: 'PHB'
  }
]

// Helper Functions

/**
 * Get all spells available to a specific class at a given level
 */
export function getSpellsByClass(className: string, level?: number): Spell[] {
  const normalizedClass = className.toLowerCase()
  let spells = SPELLS.filter(spell =>
    spell.classes.includes(normalizedClass)
  )

  if (level !== undefined) {
    spells = spells.filter(spell => spell.level === level)
  }

  return spells
}

/**
 * Get all cantrips for a specific class
 */
export function getCantripsByClass(className: string): Spell[] {
  return getSpellsByClass(className, 0)
}

/**
 * Get all spells of a specific level
 */
export function getSpellsByLevel(level: number): Spell[] {
  return SPELLS.filter(spell => spell.level === level)
}

/**
 * Get all spells from a specific school of magic
 */
export function getSpellsBySchool(school: string): Spell[] {
  return SPELLS.filter(spell =>
    spell.school.toLowerCase() === school.toLowerCase()
  )
}

/**
 * Search spells by name or description
 */
export function searchSpells(query: string): Spell[] {
  const lowerQuery = query.toLowerCase()
  return SPELLS.filter(spell =>
    spell.name.toLowerCase().includes(lowerQuery) ||
    spell.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get ritual spells available to a class
 */
export function getRitualSpellsByClass(className: string): Spell[] {
  return getSpellsByClass(className).filter(spell => spell.ritual === true)
}

/**
 * Get concentration spells available to a class
 */
export function getConcentrationSpellsByClass(className: string): Spell[] {
  return getSpellsByClass(className).filter(spell => spell.concentration === true)
}

/**
 * Get spell by ID
 */
export function getSpellById(spellId: string): Spell | undefined {
  return SPELLS.find(spell => spell.id === spellId)
}

/**
 * Get all available spell schools
 */
export function getSpellSchools(): string[] {
  return Array.from(new Set(SPELLS.map(spell => spell.school)))
}

/**
 * Get spell count statistics
 */
export function getSpellStats() {
  return {
    total: SPELLS.length,
    byLevel: {
      0: SPELLS.filter(s => s.level === 0).length,
      1: SPELLS.filter(s => s.level === 1).length,
      2: SPELLS.filter(s => s.level === 2).length,
      3: SPELLS.filter(s => s.level === 3).length,
      4: SPELLS.filter(s => s.level === 4).length,
      5: SPELLS.filter(s => s.level === 5).length,
      6: SPELLS.filter(s => s.level === 6).length,
      7: SPELLS.filter(s => s.level === 7).length,
      8: SPELLS.filter(s => s.level === 8).length,
      9: SPELLS.filter(s => s.level === 9).length,
    },
    byClass: {
      bard: getSpellsByClass('bard').length,
      cleric: getSpellsByClass('cleric').length,
      druid: getSpellsByClass('druid').length,
      paladin: getSpellsByClass('paladin').length,
      ranger: getSpellsByClass('ranger').length,
      sorcerer: getSpellsByClass('sorcerer').length,
      warlock: getSpellsByClass('warlock').length,
      wizard: getSpellsByClass('wizard').length,
    }
  }
}
