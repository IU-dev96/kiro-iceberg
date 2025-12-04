# Implementation Plan

- [x] 1. Add facing direction state to GhostCharacter class
  - Add `facingDirection: 'left' | 'right'` property to GhostCharacter class
  - Initialize `facingDirection` to `'right'` in the constructor
  - Add `getFacingDirection()` getter method
  - _Requirements: 1.4, 2.1, 2.3_

- [ ] 2. Add rotation animation state to GhostCharacter class
  - Add `currentRotationY`, `targetRotationY`, `rotationAnimationProgress`, and `rotationAnimationDuration` properties
  - Initialize rotation properties in constructor (currentRotationY = 0, targetRotationY = 0, progress = 1, duration = 0.15)
  - Add `getRotationY()` getter method
  - _Requirements: 4.5_

- [ ] 3. Update move method to set target rotation
  - Modify the `move()` method to set `targetRotationY` based on direction (0 for right, Math.PI for left)
  - Reset `rotationAnimationProgress` to 0 when target changes
  - Keep existing facing direction update
  - _Requirements: 1.1, 1.2, 2.2, 4.1, 4.4_

- [ ] 4. Implement rotation animation update method
  - Create `update(deltaTime)` method in GhostCharacter
  - Implement cubic ease-out interpolation between current and target rotation
  - Advance animation progress based on deltaTime and duration
  - Clamp progress to [0, 1] range
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5. Update SceneRenderer to apply Y-axis rotation
  - Modify `drawCharacter()` method to get rotation angle from `character.getRotationY()`
  - Apply Y-axis rotation using canvas transformations (translate, scale based on rotation, translate back)
  - Use Math.cos(rotation) for X-axis scaling to create rotation effect
  - Ensure canvas context is saved before and restored after transformations
  - _Requirements: 3.1, 3.4, 4.2_

- [ ] 6. Integrate update method into game loop
  - Call `character.update(deltaTime)` in the game engine's update loop
  - Ensure update is called before rendering each frame
  - _Requirements: 4.1, 4.2, 4.3_

- [ ]* 6.1 Write property test for movement updates facing direction
  - **Property 1: Movement updates facing direction**
  - **Validates: Requirements 1.1, 1.2, 2.2**

- [ ]* 6.2 Write property test for facing direction persistence
  - **Property 2: Facing direction persists when stationary**
  - **Validates: Requirements 1.3**

- [ ]* 6.3 Write property test for rotation animation convergence
  - **Property 3: Rotation animation converges to target**
  - **Validates: Requirements 4.1, 4.3**

- [ ]* 6.4 Write property test for animation progress bounds
  - **Property 4: Animation progress is bounded**
  - **Validates: Requirements 4.2**

- [ ]* 6.5 Write unit test for default facing direction
  - Test that new GhostCharacter instances face right by default
  - Test that getFacingDirection() returns the correct value
  - _Requirements: 1.4, 2.3_

- [ ]* 6.6 Write unit test for canvas state restoration
  - Verify that canvas context state is properly saved and restored after rendering
  - _Requirements: 3.4_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
