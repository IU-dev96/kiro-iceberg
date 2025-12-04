/**
 * Collision detection system for Tip of the Iceberg
 * Requirements: 7.2, 8.2, 9.1, 9.4
 */

import { GhostCharacter, Trapdoor, Chalice, IcebergBounds, Obstacle, Door } from './models';

/**
 * CollisionDetector class handles all collision detection logic
 */
export class CollisionDetector {
  /**
   * Check if character is within iceberg boundary
   * Requirement 9.1: Detect when character moves outside bounds
   * Requirement 9.4: Allow normal movement when within bounds
   * 
   * @param character - The ghost character
   * @param bounds - The iceberg bounds for current level
   * @returns true if within bounds
   */
  checkBoundary(character: GhostCharacter, bounds: IcebergBounds): boolean {
    const charBounds = character.getBounds();
    const tolerance = 5; // Small tolerance to prevent instant game over
    
    // Check vertical bounds with tolerance
    if (charBounds.y < bounds.topY - tolerance || 
        charBounds.y + charBounds.height > bounds.bottomY + tolerance) {
      return false;
    }

    // Check horizontal bounds at character's center Y position
    const charCenterY = charBounds.y + charBounds.height / 2;
    const { left, right } = bounds.getWidthAtY(charCenterY);

    // Character must be mostly within bounds (with tolerance)
    return (
      charBounds.x >= left - tolerance &&
      charBounds.x + charBounds.width <= right + tolerance
    );
  }

  /**
   * Check if character is overlapping the trapdoor
   * Requirement 7.2: Detect trapdoor overlap for level transition
   * 
   * @param character - The ghost character
   * @param trapdoor - The trapdoor
   * @returns true if overlapping
   */
  checkTrapdoorOverlap(character: GhostCharacter, trapdoor: Trapdoor): boolean {
    return trapdoor.checkOverlap(character);
  }

  /**
   * Check if character collides with the chalice
   * Requirement 8.2: Detect chalice collision for win condition
   * 
   * @param character - The ghost character
   * @param chalice - The chalice
   * @returns true if colliding
   */
  checkChaliceCollision(character: GhostCharacter, chalice: Chalice): boolean {
    return chalice.checkCollision(character);
  }

  /**
   * Check if character collides with an obstacle from the side
   * Requirements: 3.2, 8.1
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   * @returns Collision result
   */
  checkObstacleCollision(character: GhostCharacter, obstacle: Obstacle) {
    return obstacle.checkCollision(character);
  }

  /**
   * Check if character is landing on top of an obstacle
   * Requirement 8.2
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   * @returns true if landing on top
   */
  checkObstacleTopCollision(character: GhostCharacter, obstacle: Obstacle): boolean {
    const collision = obstacle.checkCollision(character);
    return collision.collided && collision.side === 'top';
  }

  /**
   * Resolve obstacle collision to prevent passing through
   * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   */
  resolveObstacleCollision(character: GhostCharacter, obstacle: Obstacle): void {
    const collision = obstacle.checkCollision(character);
    
    if (!collision.collided || !collision.side) {
      return;
    }

    switch (collision.side) {
      case 'top':
        this.resolveTopCollision(character, obstacle);
        break;
      case 'bottom':
        this.resolveBottomCollision(character, obstacle);
        break;
      case 'left':
        this.resolveLeftCollision(character, obstacle);
        break;
      case 'right':
        this.resolveRightCollision(character, obstacle);
        break;
    }
  }

  /**
   * Resolve left collision - prevent rightward passage through obstacle
   * Requirement 8.1
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   */
  resolveLeftCollision(character: GhostCharacter, obstacle: Obstacle): void {
    const obsBounds = obstacle.getBounds();
    // Push character to the left of the obstacle
    character.x = obsBounds.x - character.width;
  }

  /**
   * Resolve right collision - prevent leftward passage through obstacle
   * Requirement 8.2
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   */
  resolveRightCollision(character: GhostCharacter, obstacle: Obstacle): void {
    const obsBounds = obstacle.getBounds();
    // Push character to the right of the obstacle
    character.x = obsBounds.x + obsBounds.width;
  }

  /**
   * Resolve top collision - handle landing on obstacle tops
   * Requirements 8.3, 8.4
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   */
  resolveTopCollision(character: GhostCharacter, obstacle: Obstacle): void {
    const obsBounds = obstacle.getBounds();
    // Position character on top of obstacle
    character.y = obsBounds.y - character.height;
    // Land on the obstacle (stops falling, allows jumping)
    character.land();
  }

  /**
   * Resolve bottom collision - handle hitting obstacle from below
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   */
  resolveBottomCollision(character: GhostCharacter, obstacle: Obstacle): void {
    const obsBounds = obstacle.getBounds();
    // Push character below the obstacle
    character.y = obsBounds.y + obsBounds.height;
    // Stop upward velocity (bump head)
    character.velocityY = 0;
  }

  /**
   * Check if character is overlapping the door
   * Requirement 4.3: Detect door overlap for level transition
   * 
   * @param character - The ghost character
   * @param door - The door
   * @returns true if overlapping
   */
  checkDoorOverlap(character: GhostCharacter, door: Door): boolean {
    return door.checkOverlap(character);
  }
}
