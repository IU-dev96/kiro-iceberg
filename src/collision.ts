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
   * Requirements: 8.1, 8.5
   * 
   * @param character - The ghost character
   * @param obstacle - The obstacle
   */
  resolveObstacleCollision(character: GhostCharacter, obstacle: Obstacle): void {
    const collision = obstacle.checkCollision(character);
    
    if (!collision.collided) {
      return;
    }

    const obsBounds = obstacle.getBounds();

    switch (collision.side) {
      case 'top':
        // Character landing on top
        character.y = obsBounds.y - character.height;
        character.land();
        break;
        
      case 'bottom':
        // Character hitting bottom
        character.y = obsBounds.y + obsBounds.height;
        character.velocityY = 0;
        break;
        
      case 'left':
        // Character hitting left side
        character.x = obsBounds.x - character.width;
        break;
        
      case 'right':
        // Character hitting right side
        character.x = obsBounds.x + obsBounds.width;
        break;
    }
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
