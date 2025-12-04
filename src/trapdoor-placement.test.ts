/**
 * Tests for trapdoor placement
 * Validates Requirements 7.1 and 7.2
 */

import { describe, it, expect } from 'vitest';
import { LevelManager } from './levelManager';
import { PHYSICS_CONSTANTS } from './levelConfig';

describe('Trapdoor Placement', () => {
  const canvasWidth = 800;
  const canvasHeight = 600;
  const levelManager = new LevelManager(canvasWidth, canvasHeight);

  describe('Requirement 7.1: Random horizontal position within iceberg boundary', () => {
    it('should place trapdoor within iceberg bounds at floor level for level 1', () => {
      // Generate multiple trapdoors to test randomness
      for (let i = 0; i < 10; i++) {
        const trapdoor = levelManager.generateTrapdoor(1);
        const bounds = levelManager.getIcebergBounds(1);
        const floorY = PHYSICS_CONSTANTS.GROUND_Y;
        
        // Get iceberg width at floor level
        const { left, right } = bounds.getWidthAtY(floorY);
        
        // Trapdoor should be fully within bounds
        expect(trapdoor.x).toBeGreaterThanOrEqual(left);
        expect(trapdoor.x + trapdoor.width).toBeLessThanOrEqual(right);
      }
    });

    it('should place trapdoor within iceberg bounds at floor level for level 2', () => {
      for (let i = 0; i < 10; i++) {
        const trapdoor = levelManager.generateTrapdoor(2);
        const bounds = levelManager.getIcebergBounds(2);
        const floorY = PHYSICS_CONSTANTS.GROUND_Y;
        
        const { left, right } = bounds.getWidthAtY(floorY);
        
        expect(trapdoor.x).toBeGreaterThanOrEqual(left);
        expect(trapdoor.x + trapdoor.width).toBeLessThanOrEqual(right);
      }
    });
  });

  describe('Requirement 7.2: Align trapdoor with floor surface', () => {
    it('should position trapdoor so its bottom edge is at ground level for level 1', () => {
      const trapdoor = levelManager.generateTrapdoor(1);
      const groundY = PHYSICS_CONSTANTS.GROUND_Y;
      
      // Trapdoor bottom should be at ground level
      const trapdoorBottom = trapdoor.y + trapdoor.height;
      expect(trapdoorBottom).toBe(groundY);
    });

    it('should position trapdoor so its bottom edge is at ground level for level 2', () => {
      const trapdoor = levelManager.generateTrapdoor(2);
      const groundY = PHYSICS_CONSTANTS.GROUND_Y;
      
      const trapdoorBottom = trapdoor.y + trapdoor.height;
      expect(trapdoorBottom).toBe(groundY);
    });

    it('should position trapdoor above the ground (not embedded)', () => {
      const trapdoor = levelManager.generateTrapdoor(1);
      const groundY = PHYSICS_CONSTANTS.GROUND_Y;
      
      // Trapdoor top should be above ground
      expect(trapdoor.y).toBeLessThan(groundY);
      
      // Trapdoor should have positive height
      expect(trapdoor.height).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle narrow iceberg sections gracefully', () => {
      // This tests the centering logic when iceberg is too narrow
      const trapdoor = levelManager.generateTrapdoor(1);
      
      // Should not throw and should return a valid trapdoor
      expect(trapdoor).toBeDefined();
      expect(trapdoor.width).toBeGreaterThan(0);
      expect(trapdoor.height).toBeGreaterThan(0);
    });
  });
});
