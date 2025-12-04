/**
 * Tests for collision detection system
 * Validates that collision side detection works correctly
 */

import { describe, it, expect } from 'vitest';
import { GhostCharacter, Obstacle } from './models';

describe('Obstacle Collision Detection', () => {
  it('should detect left collision when character approaches from left', () => {
    // Create an obstacle at x=200
    const obstacle = new Obstacle(200, 400, 50, 50);
    
    // Create character approaching from the left (x=170, will overlap by 10 pixels)
    // Character right edge at 210, obstacle left edge at 200, so 10 pixel overlap
    const character = new GhostCharacter(170, 400, 40, 40, 200, 800, 1);
    
    const collision = obstacle.checkCollision(character);
    
    expect(collision.collided).toBe(true);
    expect(collision.side).toBe('left');
  });

  it('should detect right collision when character approaches from right', () => {
    // Create an obstacle at x=200
    const obstacle = new Obstacle(200, 400, 50, 50);
    
    // Create character approaching from the right (x=240, will overlap by 10 pixels)
    // Character left edge at 240, obstacle right edge at 250, so 10 pixel overlap
    const character = new GhostCharacter(240, 400, 40, 40, 200, 800, 1);
    
    const collision = obstacle.checkCollision(character);
    
    expect(collision.collided).toBe(true);
    expect(collision.side).toBe('right');
  });

  it('should detect top collision when character lands from above', () => {
    // Create an obstacle at y=400
    const obstacle = new Obstacle(200, 400, 50, 50);
    
    // Create character falling from above (y=370, will overlap by 10 pixels)
    // Character bottom edge at 410, obstacle top edge at 400, so 10 pixel overlap
    const character = new GhostCharacter(200, 370, 40, 40, 200, 800, 1);
    character.velocityY = 100; // Falling down
    
    const collision = obstacle.checkCollision(character);
    
    expect(collision.collided).toBe(true);
    expect(collision.side).toBe('top');
  });

  it('should detect bottom collision when character jumps into obstacle from below', () => {
    // Create an obstacle at y=400
    const obstacle = new Obstacle(200, 400, 50, 50);
    
    // Create character jumping from below (y=440, will overlap by 10 pixels)
    // Character top edge at 440, obstacle bottom edge at 450, so 10 pixel overlap
    const character = new GhostCharacter(200, 440, 40, 40, 200, 800, 1);
    character.velocityY = -100; // Jumping up
    
    const collision = obstacle.checkCollision(character);
    
    expect(collision.collided).toBe(true);
    expect(collision.side).toBe('bottom');
  });

  it('should not teleport character when hitting obstacle from left', () => {
    // Create an obstacle at x=200
    const obstacle = new Obstacle(200, 400, 50, 50);
    
    // Create character approaching from the left (overlapping by 10 pixels)
    const character = new GhostCharacter(170, 400, 40, 40, 200, 800, 1);
    const initialX = character.x;
    
    const collision = obstacle.checkCollision(character);
    
    // Character should be detected as hitting from the left
    expect(collision.side).toBe('left');
    
    // After resolution, character should be pushed LEFT (not teleported right)
    // Character should end up at obstacle.x - character.width = 200 - 40 = 160
    const expectedX = obstacle.x - character.width;
    
    // Character should move LEFT from initial position (170 -> 160)
    // NOT teleport to the right side (which would be 250)
    expect(expectedX).toBe(160);
    expect(expectedX).toBeLessThan(initialX);
    expect(expectedX).toBeLessThan(obstacle.x);
  });

  it('should not teleport character when hitting obstacle from right', () => {
    // Create an obstacle at x=200
    const obstacle = new Obstacle(200, 400, 50, 50);
    
    // Create character approaching from the right (overlapping by 10 pixels)
    const character = new GhostCharacter(240, 400, 40, 40, 200, 800, 1);
    const initialX = character.x;
    
    const collision = obstacle.checkCollision(character);
    
    // Character should be detected as hitting from the right
    expect(collision.side).toBe('right');
    
    // After resolution, character should be pushed RIGHT (not teleported left)
    // Character should end up at obstacle.x + obstacle.width = 200 + 50 = 250
    const expectedX = obstacle.x + obstacle.width;
    
    // Character should move RIGHT from initial position (240 -> 250)
    // NOT teleport to the left side (which would be 160)
    expect(expectedX).toBe(250);
    expect(expectedX).toBeGreaterThan(initialX);
    expect(expectedX).toBeGreaterThan(obstacle.x + obstacle.width - 1);
  });
});
