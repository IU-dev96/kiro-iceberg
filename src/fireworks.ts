/**
 * Fireworks particle system for win screen
 * Requirement 8.3: Display fireworks animation
 */

import { Particle } from './models';

/**
 * FireworksSystem class manages particle generation and updates
 */
export class FireworksSystem {
  private particles: Particle[];
  private canvasWidth: number;
  private canvasHeight: number;
  private burstCount: number;
  private nextBurstTime: number;
  private elapsedTime: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.particles = [];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.burstCount = 0;
    this.nextBurstTime = 0;
    this.elapsedTime = 0;
  }

  /**
   * Initialize fireworks with multiple bursts
   */
  initialize(): void {
    this.particles = [];
    this.burstCount = 0;
    this.nextBurstTime = 0;
    this.elapsedTime = 0;
  }

  /**
   * Create a burst of particles at a specific location
   * 
   * @param x - X position
   * @param y - Y position
   * @param particleCount - Number of particles in burst
   */
  private createBurst(x: number, y: number, particleCount: number = 50): void {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 100 + Math.random() * 100; // pixels per second
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: 1
      });
    }
  }

  /**
   * Update particles for the current frame
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  update(deltaTime: number): void {
    this.elapsedTime += deltaTime;

    // Create new bursts periodically (5 bursts total)
    if (this.burstCount < 5 && this.elapsedTime >= this.nextBurstTime) {
      const x = this.canvasWidth * (0.2 + Math.random() * 0.6);
      const y = this.canvasHeight * (0.2 + Math.random() * 0.4);
      this.createBurst(x, y);
      this.burstCount++;
      this.nextBurstTime = this.elapsedTime + 0.5; // Next burst in 0.5 seconds
    }

    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      
      // Apply gravity
      particle.vy += 200 * deltaTime; // Gravity acceleration
      
      // Fade out
      particle.life -= deltaTime * 0.8;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Get all active particles
   * 
   * @returns Array of particles
   */
  getParticles(): Particle[] {
    return this.particles;
  }

  /**
   * Check if fireworks are still active
   * 
   * @returns true if there are active particles or more bursts to come
   */
  isActive(): boolean {
    return this.particles.length > 0 || this.burstCount < 5;
  }
}
