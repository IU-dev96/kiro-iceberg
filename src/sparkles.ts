/**
 * Sparkle particle system for character movement trail effect
 * Requirements: 1.1, 1.2, 5.1
 */

import { GhostCharacter } from './models';

/**
 * Sparkle particle interface extending base Particle
 */
export interface SparkleParticle {
  x: number;           // Current X position
  y: number;           // Current Y position
  vx: number;          // Horizontal velocity (drift)
  vy: number;          // Vertical velocity (drift)
  color: string;       // Particle color
  life: number;        // Current lifetime (0-1)
  maxLife: number;     // Maximum lifetime in seconds
  size: number;        // Particle size in pixels
}

/**
 * Sparkle configuration constants
 */
const SPARKLE_CONFIG = {
  GENERATION_RATE: 20,           // Particles per second when moving
  MAX_PARTICLES: 100,            // Maximum active particles
  PARTICLE_LIFETIME: 0.8,        // Seconds before particle expires
  PARTICLE_SIZE_MIN: 2,          // Minimum particle size in pixels
  PARTICLE_SIZE_MAX: 5,          // Maximum particle size in pixels
  DRIFT_SPEED_MIN: -20,          // Minimum drift velocity (pixels/sec)
  DRIFT_SPEED_MAX: 20,           // Maximum drift velocity (pixels/sec)
  COLOR_PALETTE: [
    '#FF6B9D',  // Pink
    '#C44569',  // Dark pink
    '#FFA07A',  // Light salmon
    '#FFD700',  // Gold
    '#87CEEB',  // Sky blue
    '#9B59B6',  // Purple
    '#3498DB',  // Blue
    '#2ECC71',  // Green
  ]
};

/**
 * SparkleSystem class manages sparkle particle generation and updates
 * Requirements: 1.1, 1.2, 5.1
 */
export class SparkleSystem {
  private particles: SparkleParticle[];
  private generationRate: number;
  private timeSinceLastSparkle: number;
  private maxParticles: number;
  private colorPalette: string[];

  constructor() {
    this.particles = [];
    this.generationRate = SPARKLE_CONFIG.GENERATION_RATE;
    this.timeSinceLastSparkle = 0;
    this.maxParticles = SPARKLE_CONFIG.MAX_PARTICLES;
    this.colorPalette = SPARKLE_CONFIG.COLOR_PALETTE;
  }

  /**
   * Update sparkle system for current frame
   * Requirements: 1.1, 1.2, 1.5, 2.2, 2.3, 2.5, 4.2, 5.3
   * 
   * @param character - The ghost character
   * @param deltaTime - Time elapsed since last frame in seconds
   * @param isMoving - Whether the character is currently moving
   */
  update(character: GhostCharacter, deltaTime: number, isMoving: boolean): void {
    // Clamp deltaTime to reasonable bounds for stability
    const clampedDeltaTime = Math.max(0, Math.min(deltaTime, 0.1));

    // Generate new sparkles if character is moving
    if (isMoving) {
      this.timeSinceLastSparkle += clampedDeltaTime;
      const interval = 1 / this.generationRate;

      while (this.timeSinceLastSparkle >= interval) {
        this.generateSparkle(character);
        this.timeSinceLastSparkle -= interval;
      }
    } else {
      // Reset accumulator when not moving
      this.timeSinceLastSparkle = 0;
    }

    // Update all existing particles
    this.updateParticles(clampedDeltaTime);

    // Remove expired particles
    this.removeExpiredParticles();
  }

  /**
   * Generate a new sparkle particle at character position
   * Requirements: 1.3, 1.4, 4.1
   * 
   * @param character - The ghost character
   */
  private generateSparkle(character: GhostCharacter): void {
    // Enforce maximum particle limit
    if (this.particles.length >= this.maxParticles) {
      // Remove oldest particle (first in array)
      this.particles.shift();
    }

    // Random position within character bounds
    const x = character.x + Math.random() * character.width;
    const y = character.y + Math.random() * character.height;

    // Random velocity for drift effect
    const vx = SPARKLE_CONFIG.DRIFT_SPEED_MIN + 
               Math.random() * (SPARKLE_CONFIG.DRIFT_SPEED_MAX - SPARKLE_CONFIG.DRIFT_SPEED_MIN);
    const vy = SPARKLE_CONFIG.DRIFT_SPEED_MIN + 
               Math.random() * (SPARKLE_CONFIG.DRIFT_SPEED_MAX - SPARKLE_CONFIG.DRIFT_SPEED_MIN);

    // Random color from palette
    const color = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];

    // Random size
    const size = SPARKLE_CONFIG.PARTICLE_SIZE_MIN + 
                 Math.random() * (SPARKLE_CONFIG.PARTICLE_SIZE_MAX - SPARKLE_CONFIG.PARTICLE_SIZE_MIN);

    // Create sparkle particle
    const sparkle: SparkleParticle = {
      x,
      y,
      vx,
      vy,
      color,
      life: SPARKLE_CONFIG.PARTICLE_LIFETIME,
      maxLife: SPARKLE_CONFIG.PARTICLE_LIFETIME,
      size
    };

    this.particles.push(sparkle);
  }

  /**
   * Update all particle positions and lifetimes
   * Requirements: 2.2, 2.5, 4.2, 5.3
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  private updateParticles(deltaTime: number): void {
    for (const particle of this.particles) {
      // Update position based on velocity
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Decrease lifetime
      particle.life -= deltaTime;
    }
  }

  /**
   * Remove expired particles from the system
   * Requirements: 2.3, 5.4
   */
  private removeExpiredParticles(): void {
    // Use reverse iteration to safely remove while iterating
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Get all active sparkle particles
   * 
   * @returns Array of sparkle particles
   */
  getParticles(): SparkleParticle[] {
    return this.particles;
  }

  /**
   * Clear all sparkles (useful for level transitions)
   * Requirement 5.4
   */
  clear(): void {
    this.particles = [];
    this.timeSinceLastSparkle = 0;
  }
}
