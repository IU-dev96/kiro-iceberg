# Design Document: Enforce Game Start

## Overview

The enforce-gamestart feature adds a timeout mechanism to the game's starting area (level 0) that triggers a dramatic animation sequence if the player fails to enter the door within 15 seconds. The animation features the Titanic ship hitting an iceberg, the iceberg splitting in two, and the ghost character sinking to the bottom, culminating in a game over state with restart functionality.

This feature integrates with the existing GameEngine architecture, adding new animation states, timer management, and visual rendering components while maintaining the clean separation between game logic, rendering, and input handling.

## Architecture

The feature will be implemented using the following architectural components:

1. **TimeoutManager**: A new class responsible for tracking the 15-second countdown timer
2. **TitanicAnimationSystem**: A new class managing the multi-stage animation sequence
3. **GameEngine Extensions**: Modifications to support new game states ('timeout-animating', 'timeout-gameover')
4. **SceneRenderer Extensions**: New rendering methods for Titanic, iceberg split, and sinking ghost
5. **InputHandler Extensions**: Support for Enter key restart functionality in timeout game over state

The design follows the existing pattern where:
- GameEngine coordinates all systems and manages state transitions
- Specialized systems (TimeoutManager, TitanicAnimationSystem) handle specific concerns
- SceneRenderer handles all visual output
- InputHandler manages user input

## Components and Interfaces

### TimeoutManager

```typescript
class TimeoutManager {
  private timeRemaining: number;
  private isActive: boolean;
  private hasTriggered: boolean;
  
  constructor(timeoutDuration: number);
  start(): void;
  stop(): void;
  reset(): void;
  update(deltaTime: number): boolean; // Returns true if timeout triggered
  getTimeRemaining(): number;
  isTimedOut(): boolean;
}
```

### TitanicAnimationSystem

```typescript
interface AnimationStage {
  name: 'titanic-approach' | 'collision' | 'iceberg-split' | 'ghost-sink';
  duration: number;
  elapsed: number;
}

class TitanicAnimationSystem {
  private currentStage: AnimationStage | null;
  private stageIndex: number;
  private titanicX: number;
  private titanicY: number;
  private icebergSplitOffset: number;
  private ghostSinkY: number;
  private isComplete: boolean;
  
  constructor(canvasWidth: number, canvasHeight: number);
  start(): void;
  update(deltaTime: number): void;
  isAnimationComplete(): boolean;
  getCurrentStage(): AnimationStage | null;
  
  // Getters for rendering
  getTitanicPosition(): { x: number; y: number };
  getIcebergSplitOffset(): number;
  getGhostSinkY(): number;
}
```

### GameEngine Extensions

New game states:
- `'timeout-animating'`: Playing the Titanic animation sequence
- `'timeout-gameover'`: Animation complete, showing restart prompt

Modified methods:
- `constructor()`: Initialize TimeoutManager and TitanicAnimationSystem
- `update()`: Check timeout in level 0, update animation system
- `render()`: Delegate to renderer for timeout-specific visuals
- `transitionToLevel()`: Reset timeout when transitioning from level 0

New methods:
- `handleTimeout()`: Trigger timeout animation
- `restartFromTimeout()`: Reset game after timeout game over

### SceneRenderer Extensions

New rendering methods:
```typescript
drawTitanic(context: CanvasRenderingContext2D, x: number, y: number): void;
drawSplitIceberg(context: CanvasRenderingContext2D, splitOffset: number): void;
drawSinkingGhost(context: CanvasRenderingContext2D, character: GhostCharacter, sinkY: number): void;
drawTimeoutGameOver(context: CanvasRenderingContext2D): void;
```

## Data Models

### TimeoutState

```typescript
interface TimeoutState {
  timeRemaining: number;
  isActive: boolean;
  hasTriggered: boolean;
}
```

### AnimationState

```typescript
interface AnimationState {
  currentStage: 'titanic-approach' | 'collision' | 'iceberg-split' | 'ghost-sink' | 'complete';
  stageProgress: number; // 0-1
  titanicPosition: { x: number; y: number };
  icebergSplitOffset: number;
  ghostSinkY: number;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Timer decrements continuously

*For any* time period that elapses while the game is in level 0 and not started, the timeout timer should decrease by exactly that amount of time.

**Validates: Requirements 1.2**

### Property 2: Timer cancellation on game start

*For any* remaining time on the timeout timer, when the player enters the door to start the game, the timer should be cancelled and should not trigger the timeout animation.

**Validates: Requirements 1.4, 5.1**

### Property 3: Animation stages execute in sequence

*For any* timeout animation run, all animation stages (titanic-approach, collision, iceberg-split, ghost-sink) should execute in the correct order without skipping any stage.

**Validates: Requirements 3.1**

### Property 4: Input blocking during timeout states

*For any* player input that would normally start gameplay or move the character, when the game is in 'timeout-animating' or 'timeout-gameover' state, that input should be ignored until the game is properly restarted.

**Validates: Requirements 3.3, 5.2**

### Property 5: Timer reset on restart

*For any* game state after timeout game over, when the player presses Enter to restart, the timeout timer should be reinitialized to exactly 15 seconds.

**Validates: Requirements 4.2, 4.3, 5.3**

### Property 6: Timer inactive during gameplay

*For any* game state where the current level is greater than 0 (active gameplay), the timeout timer should remain inactive and not decrement.

**Validates: Requirements 5.4**

## Error Handling

### Timeout Edge Cases

1. **Timer at exactly zero**: When the timer reaches exactly 0.0 seconds, trigger the animation immediately
2. **Negative time values**: Clamp timer to minimum of 0 to prevent negative values
3. **Multiple timeout triggers**: Ensure timeout can only trigger once per game session until reset

### Animation Edge Cases

1. **Animation interruption**: If game is reset during animation, properly clean up animation state
2. **Stage duration overflow**: Ensure each animation stage completes even if frame rate drops
3. **Rendering during transitions**: Handle rendering gracefully during state transitions

### Input Edge Cases

1. **Rapid Enter presses**: Debounce Enter key to prevent multiple restart attempts
2. **Input during animation**: Queue or ignore inputs during animation stages
3. **Simultaneous timeout and door entry**: Prioritize door entry over timeout if both occur in same frame

### State Management

1. **Invalid state transitions**: Validate state transitions to prevent entering timeout states from invalid game states
2. **Timer state persistence**: Ensure timer state is properly reset when transitioning between levels
3. **Animation state cleanup**: Fully reset animation system when restarting or transitioning away from level 0

## Testing Strategy

The enforce-gamestart feature will be tested using both unit tests and property-based tests to ensure comprehensive coverage.

### Unit Testing Approach

Unit tests will verify specific scenarios and edge cases:

1. **Timer initialization**: Verify timer starts at 15 seconds when game loads
2. **Animation stage transitions**: Test each animation stage transition occurs correctly
3. **Game state transitions**: Verify state changes from 'playing' → 'timeout-animating' → 'timeout-gameover'
4. **Restart functionality**: Test Enter key properly resets game from timeout game over
5. **Rendering calls**: Verify correct rendering methods are called for each animation stage
6. **Edge cases**: Test timer at exactly zero, animation completion, input during animation

### Property-Based Testing Approach

Property-based tests will verify universal behaviors across many inputs using **fast-check** (JavaScript/TypeScript property testing library). Each property test will run a minimum of 100 iterations.

1. **Property 1: Timer decrements continuously**
   - Generate random time deltas (0.001 to 1.0 seconds)
   - Verify timer decreases by exactly the delta amount
   - Tag: `**Feature: enforce-gamestart, Property 1: Timer decrements continuously**`

2. **Property 2: Timer cancellation on game start**
   - Generate random timer values (0.1 to 15.0 seconds)
   - Simulate door entry at that time
   - Verify timer is cancelled and timeout doesn't trigger
   - Tag: `**Feature: enforce-gamestart, Property 2: Timer cancellation on game start**`

3. **Property 3: Animation stages execute in sequence**
   - Generate random frame rates (30-120 fps)
   - Run animation to completion
   - Verify all stages executed in correct order
   - Tag: `**Feature: enforce-gamestart, Property 3: Animation stages execute in sequence**`

4. **Property 4: Input blocking during timeout states**
   - Generate random input sequences (arrow keys, space, enter)
   - Apply inputs during 'timeout-animating' and 'timeout-gameover' states
   - Verify character position and game state remain unchanged
   - Tag: `**Feature: enforce-gamestart, Property 4: Input blocking during timeout states**`

5. **Property 5: Timer reset on restart**
   - Generate random game states after timeout
   - Simulate Enter key press
   - Verify timer is exactly 15 seconds after restart
   - Tag: `**Feature: enforce-gamestart, Property 5: Timer reset on restart**`

6. **Property 6: Timer inactive during gameplay**
   - Generate random levels (1-6) and time deltas
   - Update timer during gameplay
   - Verify timer remains at initial value (doesn't decrement)
   - Tag: `**Feature: enforce-gamestart, Property 6: Timer inactive during gameplay**`

### Integration Testing

Integration tests will verify the feature works correctly with existing game systems:

1. **GameEngine integration**: Test timeout system integrates with existing game loop
2. **Renderer integration**: Test new rendering methods work with existing SceneRenderer
3. **Input integration**: Test Enter key handling doesn't conflict with existing input system
4. **Level transition integration**: Test timeout system properly activates/deactivates during level transitions

### Test Configuration

- Property-based tests will use **fast-check** library
- Minimum 100 iterations per property test
- Each property test explicitly tagged with feature name and property number
- Unit tests will use existing Vitest framework
- Tests will be co-located with source files using `.test.ts` suffix

## Implementation Notes

### Animation Timing

The animation sequence should take approximately 5-6 seconds total:
- Titanic approach: 2 seconds
- Collision: 0.5 seconds
- Iceberg split: 1 second
- Ghost sink: 2 seconds

### Visual Design

- **Titanic**: Simple ship silhouette moving from left to right
- **Iceberg split**: Existing iceberg geometry splits with offset animation
- **Ghost sink**: Character sprite moves downward with fade effect
- **Game over screen**: Dark overlay with "Time's Up!" text and "Press ENTER to restart" prompt

### Performance Considerations

- Animation system should not impact frame rate
- Timer updates should use delta time for frame-rate independence
- Rendering should reuse existing canvas context and not create new objects per frame
- Animation state should be lightweight and not allocate memory during updates
