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
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.7
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   * @param collisionSide - The side of collision
   */
  resolveCollision(character: GhostCharacter, obstacle: Obstacle, collisionSide: string): void {
    const obsBounds = obstacle.getBounds();

    switch (collisionSide) {
      case 'top':
        // Character landing on top of obstacle (Requirements 8.3, 8.4)
        character.y = obsBounds.y - character.height;
        character.land();
        break;
        
      case 'bottom':
        // Character hitting bottom of obstacle
        character.y = obsBounds.y + obsBounds.height;
        character.velocityY = 0;
        break;
        
      case 'left':
        // Character hitting left side of obstacle - prevent rightward passage (Requirement 8.1)
        character.x = obsBounds.x - character.width;
        break;
        
      case 'right':
        // Character hitting right side of obstacle - prevent leftward passage (Requirement 8.2)
        character.x = obsBounds.x + obsBounds.width;
        break;
    }
  }

  /**
   * Check and resolve collisions with all obstacles
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.7
   * 
   * @param character - The ghost character
   * @param obstacles - Array of obstacles to check
   */
  checkObstacleCollisions(character: GhostCharacter, obstacles: Obstacle[]): void {
    // Track if character is on any obstacle top
    let onObstacleTop = false;

    for (const obstacle of obstacles) {
      const collision = obstacle.checkCollision(character);
      
      if (collision.collided && collision.side) {
        // Resolve the collision
        this.resolveCollision(character, obstacle, collision.side);
        
        // Track if standing on top
        if (collision.side === 'top') {
          onObstacleTop = true;
        }
      }
    }

    // Check if character walked off an obstacle
    // Only do this if they're not on an obstacle top AND they're marked as on ground
    // This handles the case where character walks off the edge of an obstacle
    if (!onObstacleTop && character.isOnGround && obstacles.length > 0) {
      const charBottom = character.y + character.height;
      let stillOnObstacle = false;
      
      // Check if character is still standing on any obstacle
      for (const obstacle of obstacles) {
        const obsBounds = obstacle.getBounds();
        const charCenterX = character.x + character.width / 2;
        
        // Check if character's center is over this obstacle's top surface
        if (charCenterX >= obsBounds.x && 
            charCenterX <= obsBounds.x + obsBounds.width &&
            Math.abs(charBottom - obsBounds.y) < 5) {
          stillOnObstacle = true;
          break;
        }
      }
      
      // If not on any obstacle, check if they're on the actual ground
      // If not on ground either, they should start falling
      const groundY = 550; // PHYSICS_CONSTANTS.GROUND_Y
      const onActualGround = charBottom >= groundY - 5;
      
      if (!stillOnObstacle && !onActualGround) {
        // Character walked off an obstacle and is not on ground - start falling
        character.isOnGround = false;
        character.isJumping = true;
      }
    }
  }
}
