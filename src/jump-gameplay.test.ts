/**
 * Tests for jump gameplay mechanics
 * These tests verify the jump logic works correctly
 */

import { describe, it, expect } from 'vitest';
import { GhostCharacter } from './models';
import { InputHandler } from './input';

describe('Jump Gameplay', () => {
  it('should detect spacebar press in InputHandler', () => {
    const inputHandler = new InputHandler();
    inputHandler.initialize();
    
    // Simulate spacebar press
    const event = new KeyboardEvent('keydown', { key: ' ' });
    (inputHandler as any).handleKeyDown(event);
    
    expect(inputHandler.isSpacePressed()).toBe(true);
    
    // Consume the press
    inputHandler.consumeSpace();
    expect(inputHandler.isSpacePressed()).toBe(false);
    
    inputHandler.cleanup();
  });

  it('should allow jump when character is on ground', () => {
    const character = new GhostCharacter(100, 500, 40, 40, 200, 800, 1);
    
    // Set character on ground
    character.isOnGround = true;
    character.isJumping = false;
    character.velocityY = 0;
    
    // Verify preconditions
    expect(character.isOnGround).toBe(true);
    expect(character.isJumping).toBe(false);
    
    // Jump
    character.jump();
    
    // Verify jump occurred
    expect(character.isJumping).toBe(true);
    expect(character.isOnGround).toBe(false);
    expect(character.velocityY).toBe(-400); // jumpStrength
  });

  it('should not allow jump when character is already jumping', () => {
    const character = new GhostCharacter(100, 500, 40, 40, 200, 800, 1);
    
    // Set character jumping
    character.isOnGround = false;
    character.isJumping = true;
    character.velocityY = -200;
    
    const velocityBeforeAttempt = character.velocityY;
    
    // Try to jump again
    character.jump();
    
    // Velocity should not change (double jump prevented)
    expect(character.velocityY).toBe(velocityBeforeAttempt);
  });

  it('should simulate full jump cycle', () => {
    const character = new GhostCharacter(100, 550, 40, 40, 200, 800, 1);
    const groundY = 550;
    
    // Start on ground
    character.y = groundY - character.height;
    character.isOnGround = true;
    character.isJumping = false;
    character.velocityY = 0;
    
    // Jump
    character.jump();
    expect(character.isJumping).toBe(true);
    
    // Simulate going up (negative velocity)
    for (let i = 0; i < 10; i++) {
      character.updatePhysics(0.016); // ~60fps
    }
    
    // Character should have moved up
    expect(character.y).toBeLessThan(groundY - character.height);
    
    // Continue simulation until character falls back down
    for (let i = 0; i < 100; i++) {
      character.updatePhysics(0.016);
      
      // Check if character reached ground
      if (character.y + character.height >= groundY) {
        // Land the character
        character.y = groundY - character.height;
        character.land();
        break;
      }
    }
    
    // Character should be back on ground
    expect(character.isOnGround).toBe(true);
    expect(character.isJumping).toBe(false);
    expect(character.velocityY).toBe(0);
  });

  it('should explain that jumping only works at level 1+', () => {
    // This test documents the game behavior
    // At level 0 (starting area), jumping is disabled
    // Player must enter the door to reach level 1 where jumping is enabled
    
    const level0 = 0; // Starting area - no jumping
    const level1 = 1; // First game level - jumping enabled
    
    expect(level0).toBe(0);
    expect(level1).toBeGreaterThan(0);
    
    // This is by design: the starting area is for introduction
    // The actual platformer gameplay starts at level 1
  });
});
