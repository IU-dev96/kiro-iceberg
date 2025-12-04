/**
 * Tests for initial character positioning and boundary checking
 */

import { describe, it, expect } from 'vitest';
import { GhostCharacter } from './models';
import { LevelManager } from './levelManager';
import { CollisionDetector } from './collision';

describe('Initial Character Position', () => {
  const canvasWidth = 800;
  const canvasHeight = 600;

  it('should have character in valid position for level 1', () => {
    const levelManager = new LevelManager(canvasWidth, canvasHeight);
    const collisionDetector = new CollisionDetector();
    
    // Simulate initial character position (same as in engine.ts)
    const level1Height = canvasHeight * 0.1;
    const characterHeight = Math.min(40, level1Height * 0.6);
    const characterWidth = 35;
    
    const character = new GhostCharacter(
      canvasWidth / 2 - characterWidth / 2,
      level1Height * 0.2,
      characterWidth,
      characterHeight,
      200,
      canvasWidth,
      1
    );
    
    // Check that character is within bounds
    const bounds = levelManager.getIcebergBounds(1);
    const isWithinBounds = collisionDetector.checkBoundary(character, bounds);
    
    expect(isWithinBounds).toBe(true);
  });

  it('should have character positioned within iceberg width at starting Y', () => {
    const levelManager = new LevelManager(canvasWidth, canvasHeight);
    
    const level1Height = canvasHeight * 0.1;
    const characterHeight = Math.min(40, level1Height * 0.6);
    const characterWidth = 35;
    
    const character = new GhostCharacter(
      canvasWidth / 2 - characterWidth / 2,
      level1Height * 0.2,
      characterWidth,
      characterHeight,
      200,
      canvasWidth,
      1
    );
    
    // Get iceberg bounds at character's center Y
    const bounds = levelManager.getIcebergBounds(1);
    const charCenterY = character.y + character.height / 2;
    const { left, right } = bounds.getWidthAtY(charCenterY);
    
    console.log('Character X:', character.x, 'Width:', character.width);
    console.log('Character Y:', character.y, 'Center Y:', charCenterY);
    console.log('Iceberg bounds at Y:', { left, right });
    console.log('Character right edge:', character.x + character.width);
    
    // Character should be fully within horizontal bounds
    expect(character.x).toBeGreaterThanOrEqual(left);
    expect(character.x + character.width).toBeLessThanOrEqual(right);
  });

  it('should have character positioned within vertical bounds', () => {
    const levelManager = new LevelManager(canvasWidth, canvasHeight);
    
    const level1Height = canvasHeight * 0.1;
    const characterHeight = Math.min(40, level1Height * 0.6);
    const characterWidth = 35;
    
    const character = new GhostCharacter(
      canvasWidth / 2 - characterWidth / 2,
      level1Height * 0.2,
      characterWidth,
      characterHeight,
      200,
      canvasWidth,
      1
    );
    
    const bounds = levelManager.getIcebergBounds(1);
    
    console.log('Character Y:', character.y, 'Height:', character.height);
    console.log('Character bottom:', character.y + character.height);
    console.log('Bounds:', { topY: bounds.topY, bottomY: bounds.bottomY });
    
    // Character should be within vertical bounds
    expect(character.y).toBeGreaterThanOrEqual(bounds.topY);
    expect(character.y + character.height).toBeLessThanOrEqual(bounds.bottomY);
  });

  it('should have valid iceberg bounds for level 1', () => {
    const levelManager = new LevelManager(canvasWidth, canvasHeight);
    const bounds = levelManager.getIcebergBounds(1);
    
    expect(bounds.topY).toBe(0);
    expect(bounds.bottomY).toBe(canvasHeight * 0.1); // Water level
    
    // Check width at various points
    const topWidth = bounds.getWidthAtY(0);
    const bottomWidth = bounds.getWidthAtY(bounds.bottomY);
    
    console.log('Top width:', topWidth);
    console.log('Bottom width:', bottomWidth);
    
    // Width should increase with depth
    expect(bottomWidth.right - bottomWidth.left).toBeGreaterThan(topWidth.right - topWidth.left);
  });
});
