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

  it('should move left without boundary enforcement', () => {
    const ghost = new GhostCharacter(50, 200, 50, 60, 200, 800);
    
    // Move left by 0.1 seconds (should move 20 pixels)
    ghost.move('left', 0.1);
    expect(ghost.x).toBe(30);
    
    // Move left again (boundaries are now checked by game engine)
    ghost.move('left', 0.5); // Moves 100 pixels freely
    expect(ghost.x).toBe(-70);
    
    // Character can move past old boundaries (engine handles this)
    ghost.move('left', 0.1);
    expect(ghost.x).toBe(-90);
  });

  it('should move right without boundary enforcement', () => {
    const ghost = new GhostCharacter(700, 200, 50, 60, 200, 800);
    
    // Move right by 0.1 seconds (should move 20 pixels)
    ghost.move('right', 0.1);
    expect(ghost.x).toBe(720);
    
    // Move right again (boundaries are now checked by game engine)
    ghost.move('right', 0.5); // Moves 100 pixels freely
    expect(ghost.x).toBe(820);
    
    // Character can move past old boundaries (engine handles this)
    ghost.move('right', 0.1);
    expect(ghost.x).toBe(840);
  });

  it('should handle zero delta time', () => {
    const ghost = new GhostCharacter(100, 200, 50, 60, 200, 800);
    
    ghost.move('left', 0);
    expect(ghost.x).toBe(100); // Should not move
    
    ghost.move('right', 0);
    expect(ghost.x).toBe(100); // Should not move
  });
});
