/**
 * Level configuration system for platformer mechanics
 * Requirements: 5.1, 10.1, 10.2, 10.3
 */

/**
 * Level configuration interface
 */
export interface LevelConfig {
  levelNumber: number;
  obstacleCount: number;
  obstacleMinSpacing: number;
  obstacleHeightRange: [number, number];
  obstacleWidthRange: [number, number];
  seaCreatureType: 'small-fish' | 'large-fish' | 'shark';
  seaCreatureCount: number;
  seaCreatureSize: number;
  doorPosition: { x: number; y: number };
  chalicePosition?: { x: number; y: number };
}

/**
 * Physics constants for the game
 */
export const PHYSICS_CONSTANTS = {
  GRAVITY: 800,              // pixels per second squared
  JUMP_STRENGTH: -400,       // initial upward velocity (negative = up)
  TERMINAL_VELOCITY: 600,    // max falling speed
  GROUND_Y: 550,             // y-coordinate of ground (for 600px canvas)
  HORIZONTAL_SPEED: 200      // pixels per second
};

/**
 * Level configurations with progressive difficulty
 * Requirements: 10.1, 10.2, 10.3
 */
export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    levelNumber: 1,
    obstacleCount: 2,
    obstacleMinSpacing: 200,
    obstacleHeightRange: [30, 40],
    obstacleWidthRange: [40, 50],
    seaCreatureType: 'small-fish',
    seaCreatureCount: 2,
    seaCreatureSize: 20,
    doorPosition: { x: 700, y: 470 }
  },
  {
    levelNumber: 2,
    obstacleCount: 3,
    obstacleMinSpacing: 180,
    obstacleHeightRange: [35, 50],
    obstacleWidthRange: [45, 60],
    seaCreatureType: 'small-fish',
    seaCreatureCount: 3,
    seaCreatureSize: 25,
    doorPosition: { x: 700, y: 450 }
  },
  {
    levelNumber: 3,
    obstacleCount: 4,
    obstacleMinSpacing: 160,
    obstacleHeightRange: [40, 60],
    obstacleWidthRange: [50, 70],
    seaCreatureType: 'large-fish',
    seaCreatureCount: 3,
    seaCreatureSize: 40,
    doorPosition: { x: 700, y: 430 }
  },
  {
    levelNumber: 4,
    obstacleCount: 5,
    obstacleMinSpacing: 140,
    obstacleHeightRange: [45, 65],
    obstacleWidthRange: [55, 75],
    seaCreatureType: 'large-fish',
    seaCreatureCount: 4,
    seaCreatureSize: 50,
    doorPosition: { x: 700, y: 410 }
  },
  {
    levelNumber: 5,
    obstacleCount: 6,
    obstacleMinSpacing: 120,
    obstacleHeightRange: [50, 70],
    obstacleWidthRange: [60, 80],
    seaCreatureType: 'shark',
    seaCreatureCount: 4,
    seaCreatureSize: 70,
    doorPosition: { x: 700, y: 390 }
  },
  {
    levelNumber: 6,
    obstacleCount: 7,
    obstacleMinSpacing: 100,
    obstacleHeightRange: [55, 75],
    obstacleWidthRange: [65, 85],
    seaCreatureType: 'shark',
    seaCreatureCount: 5,
    seaCreatureSize: 90,
    doorPosition: { x: 700, y: 370 },
    chalicePosition: { x: 650, y: 500 }
  }
];

/**
 * Get level configuration for a specific level
 * Requirement 5.1
 * 
 * @param level - Level number (1-6)
 * @returns Level configuration
 */
export function getLevelConfig(level: number): LevelConfig {
  // Clamp level to valid range
  const clampedLevel = Math.max(1, Math.min(6, level));
  return LEVEL_CONFIGS[clampedLevel - 1];
}
