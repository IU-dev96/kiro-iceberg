/**
 * Physics system for platformer mechanics
 * Requirements: 2.2, 7.2, 7.4, 8.1, 8.2, 11.3
 */

import { GhostCharacter, Obstacle } from './models';

/**
 * PhysicsSystem class manages gravity and collision resolution
 */
export class PhysicsSystem {
  gravity: number;
  terminalVelocity: number;

  constructor() {
    this.gravity = 800; // pixels per second squared
    this.terminalVelocity = 600; // max falling speed
  }

  /**
   * Apply gravity to character
   * Requirements: 2.2, 7.2
   * 
   * @param character - The ghost character
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  applyGravity(character: GhostCharacter, deltaTime: number): void {
    character.applyGravity(deltaTime);
  }

  /**
   * Check if character is colliding with ground
   * Requirement 7.4
   * 
   * @param character - The ghost character
   * @param groundY - Y coordinate of the ground
   * @returns true if character is on ground
   */
  checkGroundCollision(character: GhostCharacter, groundY: number): boolean {
    const charBottom = character.y + character.height;
    
    if (charBottom >= groundY && character.velocityY >= 0) {
      // Character is on or below ground
      character.y = groundY - character.height;
      character.land();
      return true;
    }
    
    return false;
  }

  /**
   * Resolve collision between character and obstacle
   * Requirements: 8.1, 8.2
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   */
  resolveCollision(character: GhostCharacter, obstacle: Obstacle): void {
    const collision = obstacle.checkCollision(character);
    
    if (!collision.collided) {
      return;
    }

    const obsBounds = obstacle.getBounds();

    switch (collision.side) {
      case 'top':
        // Character landing on top of obstacle (Requirement 8.2)
        character.y = obsBounds.y - character.height;
        character.land();
        break;
        
      case 'bottom':
        // Character hitting bottom of obstacle
        character.y = obsBounds.y + obsBounds.height;
        character.velocityY = 0;
        break;
        
      case 'left':
        // Character hitting left side of obstacle (Requirement 8.1)
        character.x = obsBounds.x - character.width;
        break;
        
      case 'right':
        // Character hitting right side of obstacle (Requirement 8.1)
        character.x = obsBounds.x + obsBounds.width;
        break;
    }
  }
}
