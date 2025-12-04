# Implementation Plan: Sparkle Trail Effect

- [x] 1. Create SparkleSystem class with core particle management
  - Implement SparkleSystem class in new file `src/sparkles.ts`
  - Add particle array, configuration constants, and time accumulator
  - Implement constructor to initialize system state
  - _Requirements: 1.1, 1.2, 5.1_

- [x] 1.1 Write property test for sparkle generation on movement
  - **Property 1: Movement triggers sparkle generation**
  - **Validates: Requirements 1.1**

- [x] 1.2 Write property test for no sparkles when stationary
  - **Property 2: Stationary character produces no sparkles**
  - **Validates: Requirements 1.2**

- [x] 2. Implement sparkle generation logic
  - Implement `generateSparkle()` method to create new sparkle particles
  - Assign random colors from palette to new sparkles
  - Position sparkles within character bounds
  - Assign random velocity vectors for drift effect
  - Assign lifetime and size to sparkles
  - _Requirements: 1.3, 1.4, 4.1_

- [x] 2.1 Write property test for sparkle colors from palette
  - **Property 3: Sparkle colors are from palette**
  - **Validates: Requirements 1.3, 3.1**

- [x] 2.2 Write property test for sparkles within character bounds
  - **Property 4: Sparkles spawn within character bounds**
  - **Validates: Requirements 1.4**

- [x] 2.3 Write property test for sparkles having velocity
  - **Property 11: Sparkles have velocity assigned**
  - **Validates: Requirements 4.1**

- [x] 2.4 Write property test for sparkles having valid lifetime
  - **Property 6: All sparkles have valid lifetime**
  - **Validates: Requirements 2.1**

- [x] 3. Implement sparkle update logic
  - Implement `update()` method that takes character, deltaTime, and isMoving flag
  - Implement time accumulator for consistent generation rate
  - Call `generateSparkle()` at appropriate intervals when character is moving
  - Implement `updateParticles()` to update position and lifetime of all sparkles
  - Apply velocity to sparkle positions using deltaTime
  - Decrease sparkle lifetime over time
  - Implement `removeExpiredParticles()` to clean up dead sparkles
  - _Requirements: 1.5, 2.2, 2.3, 2.5, 4.2, 5.3_

- [x] 3.1 Write property test for consistent generation rate
  - **Property 5: Consistent generation rate during movement**
  - **Validates: Requirements 1.5, 6.2**

- [x] 3.2 Write property test for opacity decreasing over time
  - **Property 7: Opacity decreases over time**
  - **Validates: Requirements 2.2**

- [x] 3.3 Write property test for expired sparkles removed
  - **Property 8: Expired sparkles are removed**
  - **Validates: Requirements 2.3, 5.4**

- [x] 3.4 Write property test for position updates following velocity
  - **Property 12: Position updates follow velocity**
  - **Validates: Requirements 4.2**

- [x] 3.5 Write property test for all sparkles being updated
  - **Property 10: All sparkles are updated**
  - **Validates: Requirements 2.5**

- [x] 3.6 Write property test for frame-rate independence
  - **Property 13: Frame-rate independence**
  - **Validates: Requirements 5.3**

- [x] 4. Implement particle limit enforcement
  - Add maximum particle count check in `update()` method
  - Implement oldest-first removal when at capacity
  - Track sparkle creation time or use array order for age determination
  - _Requirements: 6.3, 6.4_

- [x] 4.1 Write property test for maximum particle limit
  - **Property 15: Maximum particle limit enforced**
  - **Validates: Requirements 6.3**

- [x] 4.2 Write property test for oldest sparkles removed at capacity
  - **Property 16: Oldest sparkles removed at capacity**
  - **Validates: Requirements 6.4**

- [x] 5. Add sparkle rendering to SceneRenderer
  - Add `drawSparkles()` method to SceneRenderer class in `src/renderer.ts`
  - Render sparkles as circles with appropriate color and opacity
  - Calculate opacity from sparkle life/maxLife ratio
  - Add subtle glow effect for visual polish
  - _Requirements: 2.4, 3.2_

- [x] 5.1 Write property test for newer sparkles having higher opacity
  - **Property 9: Newer sparkles have higher opacity**
  - **Validates: Requirements 2.4**

- [x] 6. Integrate SparkleSystem with GameEngine
  - Import SparkleSystem in `src/engine.ts`
  - Instantiate SparkleSystem in GameEngine constructor
  - Call `sparkleSystem.update()` in game loop with movement detection
  - Detect movement from InputHandler's active direction
  - Pass sparkles to renderer in render method
  - Call `drawSparkles()` before drawing character for proper layering
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 6.1 Write property test for generation rate within bounds
  - **Property 14: Generation rate within bounds**
  - **Validates: Requirements 6.1**

- [x] 7. Add sparkle system cleanup on level transitions
  - Clear sparkles when transitioning between levels
  - Add method to SparkleSystem to clear all particles
  - Call clear method in GameEngine's `transitionToLevel()` method
  - _Requirements: 5.4_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
