# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Create TypeScript configuration with appropriate compiler options
  - Set up Vitest for testing with TypeScript support
  - Install fast-check for property-based testing
  - Create HTML file with canvas element
  - Set up basic CSS for page layout
  - _Requirements: 5.1, 5.2_

- [x] 2. Implement core data models and interfaces
  - Define TypeScript interfaces for GameState, CharacterState, and InputState
  - Create GhostCharacter class with position, dimensions, and movement methods
  - Implement boundary checking logic in character movement
  - _Requirements: 1.3, 2.3, 3.3_

- [ ]* 2.1 Write property test for boundary constraints
  - **Property 3: Left boundary constraint**
  - **Property 5: Right boundary constraint**
  - **Validates: Requirements 2.3, 3.3, 1.3**

- [x] 3. Implement input handling system
  - Create InputHandler class to track keyboard state
  - Set up event listeners for keydown and keyup events
  - Implement logic to track left and right arrow key states
  - Handle simultaneous key press priority
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.3_

- [ ]* 3.1 Write property test for input priority handling
  - **Property 6: Input priority handling**
  - **Validates: Requirements 4.3**

- [x] 4. Implement scene rendering system
  - Create SceneRenderer class for drawing operations
  - Implement iceberg background rendering with gradient and shapes
  - Implement ghost character rendering with visual properties
  - Ensure character is drawn with correct dimensions and position
  - _Requirements: 1.1, 1.2_

- [ ]* 4.1 Write property test for ghost rendering
  - **Property 1: Ghost renders with correct visual properties**
  - **Validates: Requirements 1.2**

- [x] 5. Implement game engine and game loop
  - Create GameEngine class to manage game loop
  - Implement initialization logic to set up canvas and game state
  - Use requestAnimationFrame for smooth rendering
  - Calculate delta time for frame-rate independent movement
  - Integrate input handling, state updates, and rendering
  - _Requirements: 4.2, 5.1, 5.2_

- [x] 6. Implement character movement logic
  - Integrate input state with character movement
  - Implement continuous leftward movement when left arrow is held
  - Implement continuous rightward movement when right arrow is held
  - Apply delta time to movement for consistent speed across frame rates
  - Ensure boundary constraints are enforced during movement
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

- [ ]* 6.1 Write property test for continuous leftward movement
  - **Property 2: Continuous leftward movement**
  - **Validates: Requirements 2.2**

- [ ]* 6.2 Write property test for continuous rightward movement
  - **Property 4: Continuous rightward movement**
  - **Validates: Requirements 3.2**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Wire everything together and create entry point
  - Create main application entry point that initializes the game
  - Connect HTML canvas to game engine
  - Add start/stop controls if needed
  - Ensure game starts automatically on page load
  - _Requirements: 5.1, 5.2, 5.3_

- [ ]* 8.1 Write unit tests for game initialization
  - Test that game initializes with correct default state
  - Test that canvas context is properly obtained
  - Verify initial character position is valid
  - _Requirements: 5.1, 5.2_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## New Features - Multi-level Gameplay

- [ ] 10. Update data models for multi-level gameplay
  - Add game status enum ('playing', 'transitioning', 'won', 'lost') to GameState
  - Add currentLevel property to GameState and GhostCharacter
  - Create Trapdoor class with position, dimensions, and overlap detection
  - Create Chalice class with position, dimensions, and collision detection
  - Create Particle interface for fireworks animation
  - Create IcebergBounds interface with dynamic width calculation
  - Create LevelData interface for level-specific information
  - _Requirements: 6.1, 6.2, 6.3, 7.1, 8.1, 9.1_

- [ ] 11. Implement Level Manager
  - Create LevelManager class to manage level data
  - Implement getIcebergBounds() to return bounds for each level
  - Implement iceberg width calculation (10% above water, 90% below, wider at depth)
  - Implement generateTrapdoor() to create trapdoor at random position on floor
  - Implement generateChalice() to create chalice at random position on level 2
  - Implement isWithinBounds() to check if character is inside iceberg
  - _Requirements: 6.1, 6.2, 6.3, 7.1, 8.1, 9.1_

- [ ]* 11.1 Write property test for iceberg width increases with depth
  - **Property 7: Iceberg width increases with depth**
  - **Validates: Requirements 6.3**

- [ ] 12. Update input handler for Enter key
  - Add Enter key tracking to InputHandler
  - Implement isEnterPressed() method
  - Update event handlers to capture Enter key state
  - _Requirements: 7.2_

- [ ] 13. Implement collision detection system
  - Create CollisionDetector class
  - Implement checkBoundary() for iceberg boundary checking
  - Implement checkTrapdoorOverlap() for trapdoor detection
  - Implement checkChaliceCollision() for chalice collection
  - Add getBounds() helper methods to game objects
  - _Requirements: 7.2, 8.2, 9.1, 9.4_

- [ ]* 13.1 Write property test for trapdoor triggers level transition
  - **Property 8: Trapdoor triggers level transition**
  - **Validates: Requirements 7.2**

- [ ]* 13.2 Write property test for chalice collision triggers win
  - **Property 9: Chalice collision triggers win**
  - **Validates: Requirements 8.2**

- [ ]* 13.3 Write property test for out of bounds triggers lose
  - **Property 10: Out of bounds triggers lose condition**
  - **Validates: Requirements 9.1**

- [ ]* 13.4 Write property test for in-bounds allows movement
  - **Property 11: In-bounds allows normal movement**
  - **Validates: Requirements 9.4**

- [ ] 14. Update scene renderer for new elements
  - Update drawBackground() to render iceberg with correct proportions (10/90 split)
  - Implement drawTrapdoor() to render trapdoor on floor
  - Implement drawChalice() to render chalice with distinct appearance
  - Implement drawWinScreen() to display "You Win" text
  - Implement drawLoseScreen() to display "Game Over" text
  - Implement drawFireworks() to render particle effects
  - Update rendering to support multiple levels with different visual styles
  - _Requirements: 6.1, 6.2, 7.3, 8.3, 8.4, 8.5, 9.2, 9.3_

- [ ] 15. Implement fireworks particle system
  - Create particle generation logic for fireworks
  - Implement particle physics (velocity, gravity, fade)
  - Create multiple bursts at different positions
  - Update particles each frame
  - Remove dead particles
  - _Requirements: 8.3_

- [ ] 16. Update game engine for level progression
  - Add level management to GameEngine
  - Implement transitionToLevel() method
  - Update initialization to create level 1 with trapdoor
  - Update checkCollisions() to detect trapdoor overlap and Enter key
  - Handle level transition from level 1 to level 2
  - Initialize chalice on level 2
  - _Requirements: 7.1, 7.2, 7.4, 8.1_

- [ ] 17. Implement win condition logic
  - Add win condition checking to game loop
  - Trigger win state when ghost touches chalice
  - Initialize fireworks particles on win
  - Update game state to 'won'
  - Stop normal gameplay when won
  - _Requirements: 8.2, 8.3, 8.4_

- [ ] 18. Implement lose condition logic
  - Add boundary checking to game loop
  - Trigger lose state when ghost moves outside iceberg bounds
  - Update game state to 'lost'
  - Stop normal gameplay when lost
  - Display game over screen
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [ ] 19. Update character movement for iceberg boundaries
  - Modify GhostCharacter to use iceberg bounds instead of canvas bounds
  - Update boundary checking to use level-specific iceberg width
  - Ensure character can't move outside iceberg shape
  - _Requirements: 9.1, 9.4_

- [ ] 20. Checkpoint - Test new features
  - Ensure all tests pass
  - Manually test level 1 gameplay
  - Manually test trapdoor interaction
  - Manually test level 2 gameplay
  - Manually test chalice collection and win screen
  - Manually test boundary violations and lose screen
  - Ask the user if questions arise

- [ ] 21. Polish and refinements
  - Adjust visual styling for better appearance
  - Fine-tune collision detection tolerances
  - Optimize fireworks particle count for performance
  - Add visual feedback for trapdoor activation
  - Ensure smooth level transitions
  - Test on different screen sizes
  - _Requirements: All_

- [ ]* 21.1 Write unit tests for level transitions
  - Test level initialization
  - Test trapdoor and chalice placement
  - Test game state transitions
  - _Requirements: 7.1, 7.2, 8.1_

- [ ]* 21.2 Write unit tests for win/lose conditions
  - Test win condition trigger
  - Test lose condition trigger
  - Test game state after win/lose
  - _Requirements: 8.2, 9.1_

- [ ] 22. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
