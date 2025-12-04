# Implementation Plan

- [x] 1. Add platform constants to level configuration
  - Create PLATFORM_CONSTANTS object in levelConfig.ts with WIDTH=2400, OBSTACLE_START=200, OBSTACLE_END=2000, DOOR_START=2100, DOOR_END=2300
  - Export constants for use across the codebase
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 2. Update level configurations with new door positions
  - Update all 6 level configs in LEVEL_CONFIGS array
  - Change doorPosition.x values to be between 2100-2300
  - Maintain existing doorPosition.y values
  - _Requirements: 3.1_

- [ ]* 2.1 Write property test for door positions
  - **Property 2: Door position constraint**
  - **Validates: Requirements 3.1**

- [x] 3. Update renderer to draw extended iceberg platform
  - Modify drawPlatformerIceberg method in renderer.ts
  - Use PLATFORM_CONSTANTS.WIDTH (2400) instead of hardcoded 1600
  - Ensure platform visual extends from x=0 to x=2400
  - _Requirements: 1.1, 1.3_

- [x] 4. Update obstacle generation bounds
  - Modify generateObstacles method in levelManager.ts
  - Use PLATFORM_CONSTANTS.OBSTACLE_START and OBSTACLE_END
  - Update icebergStart to 200 and icebergEnd to 2000
  - _Requirements: 2.1_

- [ ]* 4.1 Write property test for obstacle bounds
  - **Property 1: Obstacle bounds constraint**
  - **Validates: Requirements 2.1**

- [x] 5. Update boundary detection in game engine
  - Modify checkCollisions method in engine.ts
  - Use PLATFORM_CONSTANTS.WIDTH for right boundary check
  - Update icebergRight to 2400
  - Ensure falling triggers when character.x < 0 or charRight > 2400
  - _Requirements: 4.1, 4.2_

- [ ]* 5.1 Write edge case tests for boundary detection
  - Test left boundary (x < 0) triggers falling
  - Test right boundary (x > 2400) triggers falling
  - Test bottom boundary (y > 650) triggers falling
  - Test drowning timeout (2 seconds) triggers game over
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.5**

- [x] 6. Update camera maximum scroll
  - Modify updateCamera method in engine.ts
  - Calculate maxCameraX as PLATFORM_CONSTANTS.WIDTH - canvas.width
  - Should result in maxCameraX = 1600 (2400 - 800)
  - _Requirements: 1.3_

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
