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
