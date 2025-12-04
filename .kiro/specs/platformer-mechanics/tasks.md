# Implementation Plan

- [x] 1. Extend GhostCharacter model with jumping physics
  - Add vertical velocity, jump state, and gravity properties to GhostCharacter class
  - Implement jump() method to initiate jumps
  - Implement applyGravity() method for physics updates
  - Implement land() method to reset jump state
  - Implement updatePhysics() method to update position based on velocities
  - _Requirements: 2.1, 2.2, 2.4, 7.1, 7.2, 7.4, 11.1_

- [ ]* 1.1 Write property test for jump initiation
  - **Property 1: Jump initiation sets upward velocity**
  - **Validates: Requirements 2.1, 7.1**

- [ ]* 1.2 Write property test for gravity application
  - **Property 2: Gravity applies during airborne state**
  - **Validates: Requirements 2.2, 7.2**

- [ ]* 1.3 Write property test for landing state reset
  - **Property 4: Landing resets jump state**
  - **Validates: Requirements 2.4**

- [ ]* 1.4 Write property test for double jump prevention
  - **Property 5: Double jump prevention**
  - **Validates: Requirements 2.5**

- [x] 2. Extend InputHandler to support spacebar
  - Add spacePressed property to InputHandler
  - Update handleKeyDown to capture spacebar presses
  - Update handleKeyUp to reset spacebar state
  - Implement isSpacePressed() method
  - Implement consumeSpace() method
  - _Requirements: 2.1, 11.2_

- [x] 3. Create Obstacle class
  - Implement Obstacle class with position, dimensions, and type properties
  - Implement getBounds() method for collision detection
  - Implement checkCollision() method that returns collision side and penetration depth
  - _Requirements: 3.1, 8.6_

- [x] 4. Create Door class
  - Implement Door class with position and dimensions
  - Implement getBounds() method
  - Implement checkOverlap() method to detect character proximity
  - _Requirements: 4.1, 4.3_

- [ ]* 4.1 Write property test for door interaction
  - **Property 11: Door interaction triggers level transition**
  - **Validates: Requirements 4.3**

- [x] 5. Create SeaCreature class
  - Implement SeaCreature class with position, size, type, and velocity
  - Implement constructor that determines creature type based on level
  - Implement update() method for horizontal movement and screen wrapping
  - Implement draw() method to render fish or shark sprites
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ]* 5.1 Write property test for sea creature positioning
  - **Property 21: Sea creatures exist outside boundaries**
  - **Validates: Requirements 9.1**

- [ ]* 5.2 Write property test for sea creature animation
  - **Property 22: Sea creatures animate over time**
  - **Validates: Requirements 9.5**

- [ ]* 5.3 Write property test for sea creature size scaling
  - **Property 23: Sea creature size scales with depth**
  - **Validates: Requirements 9.6**

- [ ] 6. Create PhysicsSystem class
  - Implement PhysicsSystem with gravity and terminal velocity constants
  - Implement applyGravity() method
  - Implement resolveCollision() method that handles all collision sides
  - Implement checkGroundCollision() method
  - Implement checkObstacleCollisions() method that checks all obstacles and resolves collisions
  - Ensure collision resolution prevents character from passing through or falling through obstacles
  - _Requirements: 2.2, 7.2, 7.4, 8.1, 8.2, 8.3, 8.4, 8.7, 11.3_

- [ ]* 6.1 Write property test for ground collision
  - **Property 18: Ground collision stops vertical movement**
  - **Validates: Requirements 7.4**

- [x] 7. Create level configuration system
  - Define LEVEL_CONFIGS array with difficulty scaling for 6 levels
  - Define PHYSICS_CONSTANTS object
  - Create getLevelConfig() helper function
  - _Requirements: 5.1, 10.1, 10.2, 10.3_

- [ ]* 7.1 Write property test for obstacle count scaling
  - **Property 24: Obstacle count increases with level**
  - **Validates: Requirements 10.1**

- [ ]* 7.2 Write property test for obstacle spacing scaling
  - **Property 25: Obstacle spacing decreases with level**
  - **Validates: Requirements 10.2**

- [ ]* 7.3 Write property test for obstacle size scaling
  - **Property 26: Obstacle size increases with level**
  - **Validates: Requirements 10.3**

- [x] 8. Extend LevelManager to generate obstacles and doors
  - Add generateObstacles() method that creates obstacles based on level config
  - Add generateDoor() method that places door at level exit
  - Ensure obstacle spacing meets minimum requirements
  - Validate all obstacles are within bounds and jumpable
  - Update generateChalice() to only spawn on level 6
  - _Requirements: 3.1, 3.3, 3.5, 4.1, 4.5, 5.3, 6.1, 6.3_

- [ ]* 8.1 Write property test for obstacles within bounds
  - **Property 6: Obstacles exist within level bounds**
  - **Validates: Requirements 3.1**

- [ ]* 8.2 Write property test for jumpable obstacles
  - **Property 8: All obstacles are jumpable**
  - **Validates: Requirements 3.3, 10.5**

- [ ]* 8.3 Write property test for obstacle spacing
  - **Property 9: Obstacle spacing allows navigation**
  - **Validates: Requirements 3.5**

- [ ]* 8.4 Write property test for door presence
  - **Property 10: Non-final levels have doors**
  - **Validates: Requirements 4.1, 4.5**

- [ ]* 8.5 Write property test for chalice on final level only
  - **Property 16: Chalice only on final level**
  - **Validates: Requirements 6.3**

- [x] 8.6 Update generateObstacles to prevent door overlap
  - Modify generateObstacles() method to consider door position when placing obstacles
  - Define restricted zone around door position (doorX - clearance to doorX + doorWidth + clearance)
  - Calculate available space for obstacles (startX to doorX - clearance)
  - Distribute obstacles within available space while maintaining minimum spacing
  - Validate each obstacle position to ensure no overlap with door bounding box
  - Ensure minimum clearance distance (100 pixels) is maintained from door
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ]* 8.7 Write property test for obstacle-door non-overlap
  - **Property 28: Obstacles do not overlap with door**
  - **Validates: Requirements 12.1, 12.3**

- [ ]* 8.8 Write property test for door clearance
  - **Property 29: Door maintains minimum clearance from obstacles**
  - **Validates: Requirements 12.2, 12.4**

- [ ] 9. Extend CollisionDetector for solid obstacle collisions
  - Add checkObstacleCollision() method that detects collision side (left, right, top, bottom)
  - Add resolveLeftCollision() method to prevent rightward passage through obstacles
  - Add resolveRightCollision() method to prevent leftward passage through obstacles
  - Add resolveTopCollision() method to handle landing on obstacle tops
  - Add resolveBottomCollision() method to handle hitting obstacle from below
  - Implement collision resolution that adjusts character position to eliminate overlap
  - Ensure character can stand on obstacle tops without falling through
  - Update existing collision methods to work with new physics
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 11.5_

- [ ]* 9.1 Write property test for left collision prevention
  - **Property 7: Left obstacle collision prevents rightward passage**
  - **Validates: Requirements 8.1**

- [ ]* 9.2 Write property test for right collision prevention
  - **Property 7a: Right obstacle collision prevents leftward passage**
  - **Validates: Requirements 8.2**

- [ ]* 9.3 Write property test for top collision (landing)
  - **Property 19: Obstacle tops are solid surfaces**
  - **Validates: Requirements 8.3, 8.4**

- [ ]* 9.4 Write property test for no fall-through on obstacle tops
  - **Property 19a: Character cannot fall through obstacle tops**
  - **Validates: Requirements 8.4**

- [ ]* 9.5 Write property test for successful jump passage
  - **Property 20: Successful jumps allow passage**
  - **Validates: Requirements 8.5**

- [ ]* 9.6 Write property test for collision resolution
  - **Property 20a: Collision resolution prevents overlap**
  - **Validates: Requirements 8.6, 8.7**

- [x] 10. Extend SceneRenderer to draw obstacles, doors, and sea creatures
  - Add drawObstacle() method with distinct visual styling
  - Add drawDoor() method with visual feedback for interaction
  - Add drawSeaCreature() method for fish and shark sprites
  - Add drawLevelBanner() method to display level number
  - Update drawBackground() to render sea creatures
  - _Requirements: 1.1, 1.2, 3.4, 4.2, 4.4, 9.1, 11.4_

- [ ]* 10.1 Write property test for level banner persistence
  - **Property 27: Level banner persists during gameplay**
  - **Validates: Requirements 1.3**

- [ ] 11. Update GameEngine to integrate jumping and solid obstacle collisions
  - Add obstacles array and door to game state
  - Add seaCreatures array to game state
  - Update initializeLevel() to generate obstacles, door, and sea creatures
  - Update update() method to call character.updatePhysics()
  - Update update() method to handle spacebar input for jumping
  - Update update() method to animate sea creatures
  - Update checkCollisions() to check all obstacle collisions (left, right, top, bottom)
  - Update checkCollisions() to resolve collisions and prevent passing through obstacles
  - Update checkCollisions() to check door interaction
  - Update transitionToLevel() to handle 6 levels
  - Ensure character can stand on obstacle tops without falling through
  - _Requirements: 2.1, 2.3, 4.3, 5.2, 5.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.7, 11.3_

- [ ]* 11.1 Write property test for horizontal movement during jump
  - **Property 3: Horizontal movement works while jumping**
  - **Validates: Requirements 2.3, 7.5**

- [ ]* 11.2 Write property test for level transition position reset
  - **Property 12: Level transitions reset character position**
  - **Validates: Requirements 5.2**

- [ ]* 11.3 Write property test for level counter increment
  - **Property 14: Level counter increments on advance**
  - **Validates: Requirements 5.4**

- [ ]* 11.4 Write property test for level obstacle configuration
  - **Property 13: Level obstacles match configuration**
  - **Validates: Requirements 5.3**

- [x] 12. Update GameEngine render method
  - Update render() to draw obstacles before character
  - Update render() to draw door
  - Update render() to draw level banner
  - Ensure sea creatures are drawn in background layer
  - _Requirements: 1.1, 1.3, 3.4, 4.4, 9.1_

- [x] 13. Implement maximum jump height detection
  - Add logic in updatePhysics() to detect when velocityY reaches 0
  - Ensure descent begins after reaching maximum height
  - _Requirements: 7.3_

- [ ]* 13.1 Write property test for maximum jump height
  - **Property 17: Maximum jump height triggers descent**
  - **Validates: Requirements 7.3**

- [x] 14. Update win condition for level 6
  - Modify chalice collection check to verify level 6
  - Ensure win screen displays correctly
  - _Requirements: 6.2, 6.5_

- [ ]* 14.1 Write property test for chalice collection win trigger
  - **Property 15: Chalice collection triggers win**
  - **Validates: Requirements 6.2**

- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Add visual polish and refinements
  - Fine-tune jump arc feel (adjust gravity and jump strength)
  - Add visual feedback for door interaction (glow, prompt)
  - Improve obstacle visual variety
  - Enhance sea creature animations (swimming motion)
  - Polish level banner styling
  - _Requirements: 1.2, 4.2_

- [x] 17. Final testing and bug fixes
  - Test full game progression from level 1 to 6
  - Verify all obstacles are beatable
  - Check collision edge cases
  - Validate difficulty curve feels appropriate
  - Test win condition on level 6
  - _Requirements: All_
