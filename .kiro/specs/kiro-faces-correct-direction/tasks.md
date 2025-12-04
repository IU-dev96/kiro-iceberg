# Implementation Plan

- [x] 1. Add facing direction state to GhostCharacter class
  - Add `facingDirection: 'left' | 'right'` property to GhostCharacter class
  - Initialize `facingDirection` to `'right'` in the constructor
  - Add `getFacingDirection()` getter method
  - _Requirements: 1.4, 2.1, 2.3_

- [x] 2. Update move method to track facing direction
  - Modify the `move()` method to set `this.facingDirection = direction` when called
  - Ensure facing direction updates before position changes
  - _Requirements: 1.1, 1.2, 2.2_

- [ ]* 2.1 Write property test for movement updates facing direction
  - **Property 1: Movement updates facing direction**
  - **Validates: Requirements 1.1, 1.2, 2.2**

- [ ]* 2.2 Write property test for facing direction persistence
  - **Property 2: Facing direction persists when stationary**
  - **Validates: Requirements 1.3**

- [ ]* 2.3 Write unit test for default facing direction
  - Test that new GhostCharacter instances face right by default
  - Test that getFacingDirection() returns the correct value
  - _Requirements: 1.4, 2.3_

- [x] 3. Implement sprite flipping in SceneRenderer
  - Modify `drawCharacter()` method to check character's facing direction
  - When facing left, apply horizontal flip using canvas transformations (scale(-1, 1) and translate)
  - When facing right, render normally
  - Ensure canvas context is saved before and restored after transformations
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 3.1 Write unit test for canvas state restoration
  - Verify that canvas context state is properly saved and restored after rendering
  - _Requirements: 3.4_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
