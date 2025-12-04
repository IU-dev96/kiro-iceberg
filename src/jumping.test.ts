/**
 * Tests for jumping mechanics
 */

import { describe, it, expect } from 'vitest';
import { GhostCharacter } from './models';

describe('Jumping Mechanics', () => {
  it('should allow character to jump when on ground', () => {
    const character = new GhostCharacter(100, 500, 40, 40, 200, 800, 1);
    
    // Character starts on ground
    expect(character.isOnGround).toBe(true);
    expect(character.isJumping).toBe(false);
    expect(character.velocityY).toBe(0);
    
    // Jump
    character.jump();
    
    // Character should now be jumping with upward velocity
    expect(character.isJumping).toBe(true);
    expect(character.isOnGround).toBe(false);
    expect(character.velocityY).toBeLessThan(0); // Negative = upward
  });

  it('should not allow double jump', () => {
    const character = new GhostCharacter(100, 500, 40, 40, 200, 800, 1);
    
    // First jump
    character.jump();
    const firstVelocity = character.velocityY;
    
    // Try to jump again while in air
    character.jump();
    
    // Velocity should not change (double jump prevented)
    expect(character.velocityY).toBe(firstVelocity);
  });

  it('should apply gravity when jumping', () => {
    const character = new GhostCharacter(100, 500, 40, 40, 200, 800, 1);
    
    // Jump
    character.jump();
    const initialVelocity = character.velocityY;
    
    // Apply gravity for 0.1 seconds
    character.applyGravity(0.1);
    
    // Velocity should increase (become less negative / more positive)
    expect(character.velocityY).toBeGreaterThan(initialVelocity);
  });

  it('should reset jump state when landing', () => {
    const character = new GhostCharacter(100, 500, 40, 40, 200, 800, 1);
    
    // Jump
    character.jump();
    expect(character.isJumping).toBe(true);
    expect(character.isOnGround).toBe(false);
    
    // Land
    character.land();
    
    // Should be back on ground
    expect(character.isJumping).toBe(false);
    expect(character.isOnGround).toBe(true);
    expect(character.velocityY).toBe(0);
  });

  it('should update vertical position based on velocity', () => {
    const character = new GhostCharacter(100, 500, 40, 40, 200, 800, 1);
    const initialY = character.y;
    
    // Jump
    character.jump();
    
    // Update physics for 0.1 seconds
    character.updatePhysics(0.1);
    
    // Character should have moved upward (y decreased)
    expect(character.y).toBeLessThan(initialY);
  });
});
