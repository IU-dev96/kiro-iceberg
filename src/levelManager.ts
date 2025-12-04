/**
 * Level Manager for Tip of the Iceberg
 * Manages level data, iceberg bounds, and object placement
 * Requirements: 6.1, 6.2, 6.3, 7.1, 8.1, 9.1
 */

import { IcebergBounds, LevelData, Trapdoor, Chalice } from './models';

/**
 * LevelManager class manages level-specific data and iceberg geometry
 */
export class LevelManager {
  private canvasWidth: number;
  private canvasHeight: number;
  private waterLevel: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    // Water level at 10% from top (Requirement 6.1)
    this.waterLevel = canvasHeight * 0.1;
  }

  /**
   * Get iceberg bounds for a specific level
   * Requirement 6.1, 6.2: 10% above water, 90% below
   * Requirement 6.3: Wider at lower depths
   * 
   * @param level - The level number (1 or 2)
   * @returns IcebergBounds for the level
   */
  getIcebergBounds(level: number): IcebergBounds {
    const topY = level === 1 ? 0 : this.waterLevel;
    const bottomY = level === 1 ? this.waterLevel : this.canvasHeight;

    return {
      leftEdge: 0,
      rightEdge: this.canvasWidth,
      topY,
      bottomY,
      getWidthAtY: (y: number) => this.getWidthAtDepth(y, level)
    };
  }

  /**
   * Calculate iceberg width at a specific depth
   * Requirement 6.3: Iceberg gets wider at lower depths
   * 
   * @param y - The Y coordinate (depth)
   * @param level - The current level
   * @returns Left and right edges at that depth
   */
  private getWidthAtDepth(y: number, level: number): { left: number; right: number } {
    const centerX = this.canvasWidth / 2;
    
    if (level === 1) {
      // Level 1: Above water, narrower at top
      // Width increases from 30% at top to 50% at water level
      const progress = y / this.waterLevel;
      const widthPercent = 0.3 + (progress * 0.2); // 30% to 50%
      const halfWidth = (this.canvasWidth * widthPercent) / 2;
      
      return {
        left: centerX - halfWidth,
        right: centerX + halfWidth
      };
    } else {
      // Level 2: Below water, wider at bottom
      // Width increases from 50% at water level to 80% at bottom
      const depthBelowWater = y - this.waterLevel;
      const totalDepth = this.canvasHeight - this.waterLevel;
      const progress = depthBelowWater / totalDepth;
      const widthPercent = 0.5 + (progress * 0.3); // 50% to 80%
      const halfWidth = (this.canvasWidth * widthPercent) / 2;
      
      return {
        left: centerX - halfWidth,
        right: centerX + halfWidth
      };
    }
  }

  /**
   * Check if character is within iceberg bounds
   * Requirement 9.1: Detect when character moves outside bounds
   * 
   * @param characterX - Character X position
   * @param characterY - Character Y position
   * @param characterWidth - Character width
   * @param characterHeight - Character height
   * @param level - Current level
   * @returns true if within bounds
   */
  isWithinBounds(
    characterX: number,
    characterY: number,
    characterWidth: number,
    characterHeight: number,
    level: number
  ): boolean {
    const bounds = this.getIcebergBounds(level);
    
    // Check vertical bounds
    if (characterY < bounds.topY || characterY + characterHeight > bounds.bottomY) {
      return false;
    }

    // Check horizontal bounds at character's Y position
    const charCenterY = characterY + characterHeight / 2;
    const { left, right } = bounds.getWidthAtY(charCenterY);

    // Character must be fully within bounds
    return characterX >= left && characterX + characterWidth <= right;
  }

  /**
   * Generate a trapdoor at random position on the floor
   * Requirement 7.1: Place trapdoor at random horizontal position
   * 
   * @param level - The level number
   * @returns Trapdoor instance
   */
  generateTrapdoor(level: number): Trapdoor {
    const bounds = this.getIcebergBounds(level);
    const floorY = bounds.bottomY - 30; // Place slightly above bottom
    
    // Get iceberg width at floor level
    const { left, right } = bounds.getWidthAtY(floorY);
    
    // Random position within safe bounds (not too close to edges)
    const safeMargin = 100;
    const minX = left + safeMargin;
    const maxX = right - safeMargin - 80; // 80 is trapdoor width
    
    const randomX = minX + Math.random() * (maxX - minX);
    
    return new Trapdoor(randomX, floorY);
  }

  /**
   * Generate a chalice at random position on level 2
   * Requirement 8.1: Place chalice at random horizontal position
   * 
   * @param level - The level number (should be 2)
   * @returns Chalice instance
   */
  generateChalice(level: number): Chalice {
    if (level !== 2) {
      throw new Error('Chalice only appears on level 2');
    }

    const bounds = this.getIcebergBounds(level);
    
    // Random Y position in the middle section of level 2
    const minY = bounds.topY + 100;
    const maxY = bounds.bottomY - 150;
    const randomY = minY + Math.random() * (maxY - minY);
    
    // Get iceberg width at that Y position
    const { left, right } = bounds.getWidthAtY(randomY);
    
    // Random X position within bounds
    const safeMargin = 80;
    const minX = left + safeMargin;
    const maxX = right - safeMargin - 40; // 40 is chalice width
    
    const randomX = minX + Math.random() * (maxX - minX);
    
    return new Chalice(randomX, randomY);
  }

  /**
   * Get level data for a specific level
   * 
   * @param level - The level number
   * @returns LevelData
   */
  getLevelData(level: number): LevelData {
    const bounds = this.getIcebergBounds(level);
    const floorY = bounds.bottomY - 30;
    
    return {
      levelNumber: level,
      icebergBounds: bounds,
      trapdoorPosition: { x: 0, y: floorY }, // Will be randomized
      chalicePosition: level === 2 ? { x: 0, y: 0 } : undefined, // Will be randomized
      floorY
    };
  }
}
