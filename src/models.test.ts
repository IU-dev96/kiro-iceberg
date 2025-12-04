/**
 * Unit tests for core data models
 */
import { describe, it, expect } from 'vitest';
import { GhostCharacter } from './models';

describe('GhostCharacter', () => {
  it('should initialize with correct properties', () => {
    const ghost = new GhostCharacter(100, 200, 50, 60, 200, 800);
    
    expect(ghost.x).toBe(100);
    expect(ghost.y).toBe(200);
    expect(ghost.width).toBe(50);
    expect(ghost.height).toBe(60);
    expect(ghost.velocity).toBe(200);
  });

  it('should move left and respect left boundary', () => {
    const ghost = new GhostCharacter(50, 200, 50, 60, 200, 800);
    
    // Move left by 0.1 seconds (should move 20 pixels)
    ghost.move('left', 0.1);
    expect(ghost.x).toBe(30);
    
    // Move left again to hit boundary
    ghost.move('left', 0.5); // Would move 100 pixels, but boundary at 0
    expect(ghost.x).toBe(0);
    
    // Try to move past boundary
    ghost.move('left', 0.1);
    expect(ghost.x).toBe(0); // Should stay at 0
  });

  it('should move right and respect right boundary', () => {
    const ghost = new GhostCharacter(700, 200, 50, 60, 200, 800);
    
    // Move right by 0.1 seconds (should move 20 pixels)
    ghost.move('right', 0.1);
    expect(ghost.x).toBe(720);
    
    // Move right again to hit boundary (max x = 800 - 50 = 750)
    ghost.move('right', 0.5); // Would move 100 pixels, but boundary at 750
    expect(ghost.x).toBe(750);
    
    // Try to move past boundary
    ghost.move('right', 0.1);
    expect(ghost.x).toBe(750); // Should stay at 750
  });

  it('should handle zero delta time', () => {
    const ghost = new GhostCharacter(100, 200, 50, 60, 200, 800);
    
    ghost.move('left', 0);
    expect(ghost.x).toBe(100); // Should not move
    
    ghost.move('right', 0);
    expect(ghost.x).toBe(100); // Should not move
  });
});
