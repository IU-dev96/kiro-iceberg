# Implementation Plan

- [x] 1. Create TimeoutManager class
  - Implement timer initialization, start, stop, reset, and update methods
  - Add time tracking with delta time support
  - Include timeout trigger detection
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ]* 1.1 Write property test for timer decrement
  - **Property 1: Timer decrements continuously**
  - **Validates: Requirements 1.2**

- [ ]* 1.2 Write property test for timer cancellation
  - **Property 2: Timer cancellation on game start**
  - **Validates: Requirements 1.4, 5.1**

- [x] 2. Create TitanicAnimationSystem class
  - Implement animation stage management (approach, collision, split, sink)
  - Add position tracking for Titanic, iceberg split offset, and ghost sink
  - Implement stage progression with timing
  - Add completion detection
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 2.1 Write property test for animation sequence
  - **Property 3: Animation stages execute in sequence**
  - **Validates: Requirements 3.1**

- [ ]* 2.2 Write unit tests for animation stages
  - Test each animation stage initializes correctly
  - Test stage transitions occur at correct times
  - Test animation completion detection
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Extend GameEngine with timeout support
  - Add TimeoutManager and TitanicAnimationSystem instances
  - Add new game states: 'timeout-animating', 'timeout-gameover'
  - Modify update() to check timeout in level 0
  - Add handleTimeout() method to trigger animation
  - Add restartFromTimeout() method for restart functionality
  - Modify transitionToLevel() to reset timeout when leaving level 0
  - _Requirements: 1.1, 1.3, 4.2, 5.1, 5.2, 5.4_

- [ ]* 3.1 Write property test for input blocking
  - **Property 4: Input blocking during timeout states**
  - **Validates: Requirements 3.3, 5.2**

- [ ]* 3.2 Write property test for timer inactive during gameplay
  - **Property 6: Timer inactive during gameplay**
  - **Validates: Requirements 5.4**

- [ ]* 3.3 Write unit tests for game state transitions
  - Test transition from 'playing' to 'timeout-animating'
  - Test transition from 'timeout-animating' to 'timeout-gameover'
  - Test restart from 'timeout-gameover' back to 'playing'
  - _Requirements: 1.3, 2.5, 4.2_

- [x] 4. Extend InputHandler for restart functionality
  - Ensure Enter key state is properly tracked
  - Add support for Enter key consumption in timeout game over state
  - _Requirements: 4.2_

- [x] 5. Extend SceneRenderer with timeout visuals
  - Implement drawTitanic() method for ship rendering
  - Implement drawSplitIceberg() method for iceberg split animation
  - Implement drawSinkingGhost() method for ghost sinking effect
  - Implement drawTimeoutGameOver() method for game over screen with restart prompt
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.2, 4.1_

- [ ]* 5.1 Write unit tests for rendering methods
  - Test each rendering method is called with correct parameters
  - Test rendering methods don't throw errors
  - Verify game over screen includes restart prompt
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.2, 4.1_

- [x] 6. Integrate timeout rendering in GameEngine
  - Modify render() method to handle 'timeout-animating' state
  - Modify render() method to handle 'timeout-gameover' state
  - Ensure proper rendering of animation stages
  - Ensure proper rendering of game over screen
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.2, 4.1_

- [x] 7. Implement restart functionality
  - Wire up Enter key in 'timeout-gameover' state to call restartFromTimeout()
  - Ensure game resets to initial level 0 state
  - Ensure timer resets to 15 seconds
  - Ensure animation system is fully reset
  - _Requirements: 4.2, 4.3, 4.4_

- [ ]* 7.1 Write property test for timer reset on restart
  - **Property 5: Timer reset on restart**
  - **Validates: Requirements 4.2, 4.3, 5.3**

- [ ]* 7.2 Write unit tests for restart functionality
  - Test Enter key triggers restart from timeout game over
  - Test game state returns to 'playing' after restart
  - Test character position resets correctly
  - Test animation state is cleared
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
