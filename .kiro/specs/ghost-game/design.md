# Design Document: Tip of the Iceberg

## Overview

"Tip of the Iceberg" is a browser-based multi-level adventure game built using HTML5 Canvas and vanilla JavaScript. The game features Kiro, a ghost character that players control using keyboard arrow keys to move horizontally across an iceberg scene. Players must navigate through two levels by finding a trapdoor, collect a chalice to win, while avoiding drowning by staying within the iceberg boundaries. The iceberg is realistically proportioned with 10% above water and 90% below. The architecture follows a game loop pattern with clear separation between rendering, input handling, collision detection, and game state management.

## Architecture

The application uses a component-based architecture with the following layers:

1. **Presentation Layer**: HTML5 Canvas for rendering
2. **Game Logic Layer**: Game state management, level progression, and collision detection
3. **Input Layer**: Keyboard event handling (arrow keys and Enter)
4. **Rendering Layer**: Drawing sprites, backgrounds, game objects, and UI elements
5. **Collision Detection Layer**: Boundary checking, trapdoor detection, and chalice collection

The game follows a standard game loop pattern with state management:
```
Initialize → Input → Update (Collision Detection) → Render → Check Win/Lose → Repeat
```

### Game States
The game operates in multiple states:
- **Playing**: Normal gameplay on a level
- **Transitioning**: Moving between levels through trapdoor
- **Won**: Player collected the chalice
- **Lost**: Player moved outside iceberg boundaries

## Components and Interfaces

### Game Engine
The core game engine manages the game loop, game state, and coordinates between components.

**Interface:**
```typescript
interface GameEngine {
  start(): void;
  stop(): void;
  update(deltaTime: number): void;
  render(): void;
  checkCollisions(): void;
  transitionToLevel(level: number): void;
  triggerWin(): void;
  triggerLose(): void;
}
```

### Ghost Character
Represents Kiro with position, velocity, and rendering properties.

**Interface:**
```typescript
interface GhostCharacter {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  currentLevel: number;
  move(direction: 'left' | 'right', deltaTime: number): void;
  setLevel(level: number): void;
  getBounds(): Rectangle;
}
```

### Input Handler
Captures and processes keyboard events including Enter key.

**Interface:**
```typescript
interface InputHandler {
  isKeyPressed(key: string): boolean;
  getActiveDirection(): 'left' | 'right' | null;
  isEnterPressed(): boolean;
  update(): void;
  initialize(): void;
  cleanup(): void;
}
```

### Scene Renderer
Manages rendering of the iceberg background, game elements, and UI.

**Interface:**
```typescript
interface SceneRenderer {
  drawBackground(context: CanvasRenderingContext2D, level: number): void;
  drawCharacter(context: CanvasRenderingContext2D, character: GhostCharacter): void;
  drawTrapdoor(context: CanvasRenderingContext2D, trapdoor: Trapdoor): void;
  drawChalice(context: CanvasRenderingContext2D, chalice: Chalice): void;
  drawWinScreen(context: CanvasRenderingContext2D): void;
  drawLoseScreen(context: CanvasRenderingContext2D): void;
  drawFireworks(context: CanvasRenderingContext2D, particles: Particle[]): void;
}
```

### Trapdoor
Represents the interactive trapdoor element.

**Interface:**
```typescript
interface Trapdoor {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  getBounds(): Rectangle;
  checkOverlap(character: GhostCharacter): boolean;
}
```

### Chalice
Represents the collectible win item.

**Interface:**
```typescript
interface Chalice {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  getBounds(): Rectangle;
  checkCollision(character: GhostCharacter): boolean;
}
```

### Level Manager
Manages level-specific data and iceberg boundaries.

**Interface:**
```typescript
interface LevelManager {
  currentLevel: number;
  getIcebergBounds(level: number): IcebergBounds;
  isWithinBounds(character: GhostCharacter, level: number): boolean;
  generateTrapdoor(level: number): Trapdoor;
  generateChalice(level: number): Chalice;
}
```

### Collision Detector
Handles all collision detection logic.

**Interface:**
```typescript
interface CollisionDetector {
  checkBoundary(character: GhostCharacter, bounds: IcebergBounds): boolean;
  checkTrapdoorOverlap(character: GhostCharacter, trapdoor: Trapdoor): boolean;
  checkChaliceCollision(character: GhostCharacter, chalice: Chalice): boolean;
}
```

## Data Models

### Game State
```typescript
interface GameState {
  status: 'playing' | 'transitioning' | 'won' | 'lost';
  isRunning: boolean;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  character: GhostCharacter;
  currentLevel: number;
  trapdoor: Trapdoor | null;
  chalice: Chalice | null;
  lastFrameTime: number;
  fireworksParticles: Particle[];
}
```

### Character State
```typescript
interface CharacterState {
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  speed: number;
  currentLevel: number;
}
```

### Input State
```typescript
interface InputState {
  keys: Map<string, boolean>;
  activeDirection: 'left' | 'right' | null;
  enterPressed: boolean;
}
```

### Level Data
```typescript
interface LevelData {
  levelNumber: number;
  icebergBounds: IcebergBounds;
  trapdoorPosition: { x: number; y: number };
  chalicePosition?: { x: number; y: number };
  floorY: number;
}
```

### Iceberg Bounds
```typescript
interface IcebergBounds {
  leftEdge: number;
  rightEdge: number;
  topY: number;
  bottomY: number;
  // Function to get width at a specific Y position (iceberg gets wider below water)
  getWidthAtY(y: number): { left: number; right: number };
}
```

### Rectangle
```typescript
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### Particle (for fireworks)
```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Ghost renders with correct visual properties
*For any* render call, the ghost character should be drawn with its defined dimensions and position on the canvas
**Validates: Requirements 1.2**

### Property 2: Continuous leftward movement
*For any* game state where the left arrow key is held down, the ghost character's x position should continuously decrease over time until reaching the left boundary
**Validates: Requirements 2.2**

### Property 3: Left boundary constraint
*For any* game state where the ghost character is at the left boundary (x ≤ 0), attempting to move left should not decrease the x position further, maintaining the ghost within canvas bounds
**Validates: Requirements 2.3, 1.3**

### Property 4: Continuous rightward movement
*For any* game state where the right arrow key is held down, the ghost character's x position should continuously increase over time until reaching the right boundary
**Validates: Requirements 3.2**

### Property 5: Right boundary constraint
*For any* game state where the ghost character is at the right boundary (x ≥ canvas.width - ghost.width), attempting to move right should not increase the x position further, maintaining the ghost within canvas bounds
**Validates: Requirements 3.3, 1.3**

### Property 6: Input priority handling
*For any* combination of simultaneous left and right arrow key presses, the system should process only one directional input consistently based on the most recent key press
**Validates: Requirements 4.3**

### Property 7: Iceberg width increases with depth
*For any* two depths Y1 and Y2 where Y1 < Y2 (Y2 is deeper), the iceberg width at Y2 should be greater than or equal to the width at Y1
**Validates: Requirements 6.3**

### Property 8: Trapdoor triggers level transition
*For any* game state where the ghost character is positioned over the trapdoor and Enter is pressed, the current level should increment by one
**Validates: Requirements 7.2**

### Property 9: Chalice collision triggers win
*For any* game state where the ghost character's bounds overlap with the chalice bounds, the game status should transition to won
**Validates: Requirements 8.2**

### Property 10: Out of bounds triggers lose condition
*For any* game state where the ghost character's position is outside the iceberg boundary for the current level, the game status should transition to lost
**Validates: Requirements 9.1**

### Property 11: In-bounds allows normal movement
*For any* game state where the ghost character is within the iceberg boundary, movement commands should update the character position normally (not blocked)
**Validates: Requirements 9.4**

## Error Handling

### Input Errors
- **Invalid key presses**: Non-arrow and non-Enter keys should be ignored without affecting game state
- **Rapid key toggling**: Input handler should debounce or handle rapid state changes gracefully
- **Enter pressed without trapdoor overlap**: Should be ignored, no level transition

### Rendering Errors
- **Canvas context unavailable**: Application should fail gracefully with an error message if canvas context cannot be obtained
- **Missing assets**: If background or character sprites fail to load, use fallback colors/shapes
- **Fireworks rendering failure**: Game should still display win text even if particle effects fail

### Boundary Errors
- **Out of bounds positions**: Trigger lose condition when character moves outside iceberg boundaries
- **Invalid dimensions**: Validate canvas and character dimensions on initialization
- **Invalid level transitions**: Prevent transitioning beyond level 2 or below level 1

### Collision Detection Errors
- **Overlapping game objects**: Ensure trapdoor and chalice don't spawn at same position
- **Invalid spawn positions**: Validate that trapdoor and chalice spawn within iceberg bounds
- **Floating point precision**: Use appropriate epsilon values for collision detection

### Game State Errors
- **Multiple simultaneous end conditions**: Prioritize win over lose if both triggered in same frame
- **State transition during transition**: Prevent state changes while transitioning between levels
- **Restart from end state**: Provide mechanism to reset game after win/lose

## Testing Strategy

### Unit Testing
We'll use Vitest for unit tests with full TypeScript support:

- **Initialization tests**: Verify game initializes with correct default state, trapdoor and chalice placement
- **Boundary condition tests**: Test behavior at iceberg edges for both levels
- **Input state tests**: Verify input handler correctly tracks key states including Enter key
- **Collision detection tests**: Test trapdoor overlap, chalice collision, and boundary checking
- **Level transition tests**: Verify level changes work correctly
- **Game state tests**: Test win and lose condition triggers
- **Iceberg geometry tests**: Verify 10/90 proportion and width increase with depth

### Property-Based Testing
We'll use fast-check for property-based testing in TypeScript. Each property-based test should run a minimum of 100 iterations.

Each property-based test must be tagged with a comment explicitly referencing the correctness property from this design document using the format: `**Feature: ghost-game, Property {number}: {property_text}**`

Property-based tests will verify:

1. **Property 1 (Ghost renders with correct visual properties)**: Generate random valid positions and verify ghost is drawn with correct dimensions
2. **Property 2 (Continuous leftward movement)**: Generate random starting positions and time deltas, verify x decreases when moving left
3. **Property 3 (Left boundary constraint)**: Generate positions near/at left boundary, verify x never goes below 0
4. **Property 4 (Continuous rightward movement)**: Generate random starting positions and time deltas, verify x increases when moving right
5. **Property 5 (Right boundary constraint)**: Generate positions near/at right boundary, verify x never exceeds canvas width minus ghost width
6. **Property 6 (Input priority handling)**: Generate random sequences of simultaneous key presses, verify consistent handling
7. **Property 7 (Iceberg width increases with depth)**: Generate random depth pairs, verify width increases monotonically
8. **Property 8 (Trapdoor triggers level transition)**: Generate random positions over trapdoor, verify Enter key triggers transition
9. **Property 9 (Chalice collision triggers win)**: Generate random overlapping positions, verify win condition
10. **Property 10 (Out of bounds triggers lose)**: Generate random out-of-bounds positions, verify lose condition
11. **Property 11 (In-bounds allows movement)**: Generate random in-bounds positions, verify movement is not blocked

### Integration Testing
- Test complete game loop cycle: input → collision detection → update → render
- Verify game starts and stops correctly
- Test keyboard event integration with browser APIs
- Test full gameplay: level 1 → trapdoor → level 2 → chalice → win
- Test lose condition: move outside bounds → game over
- Test win screen with fireworks animation
- Test lose screen display

## Implementation Notes

### Technology Stack
- **HTML5 Canvas**: For rendering graphics
- **TypeScript**: For game logic with type safety
- **CSS**: For page layout and styling
- **fast-check**: For property-based testing
- **Vitest**: For unit testing (with TypeScript support)

### Performance Considerations
- Use `requestAnimationFrame` for smooth 60 FPS rendering
- Calculate delta time between frames for frame-rate independent movement
- Minimize canvas redraws by clearing only necessary areas
- Optimize particle system for fireworks (limit particle count)
- Cache iceberg boundary calculations per level

### Visual Design
- **Ghost character**: Simple sprite with rounded head, wavy bottom, eyes
- **Iceberg scene**: 
  - Gradient background (sky and water)
  - Geometric iceberg shape with 10% above water, 90% below
  - Wider at deeper levels for realistic appearance
  - Two distinct levels with different floor positions
- **Trapdoor**: Rectangular hatch with distinct color/pattern on floor
- **Chalice**: Golden cup sprite or geometric representation
- **Fireworks**: Particle system with colorful expanding particles
- **UI Text**: Large, readable "You Win" and "Game Over" messages
- **Color palette**: Cool blues and whites for iceberg, gold for chalice, vibrant colors for fireworks

### Game Mechanics Details

#### Level Design
- **Level 1**: Upper section of iceberg (10% above water)
  - Floor at approximately 60% of canvas height
  - Trapdoor randomly placed on floor within iceberg bounds
  - Narrower iceberg width
  
- **Level 2**: Lower section of iceberg (90% below water)
  - Floor at approximately 90% of canvas height
  - Chalice randomly placed within iceberg bounds
  - Wider iceberg width
  - Darker blue tint for underwater atmosphere

#### Collision Detection
- **Boundary checking**: Use point-in-polygon or width-at-depth function
- **Trapdoor overlap**: Check if ghost center or bottom is over trapdoor
- **Chalice collision**: Use bounding box intersection (AABB)
- **Continuous checking**: Perform collision checks every frame

#### Random Placement
- **Trapdoor**: Random X within safe bounds (not too close to edges)
- **Chalice**: Random X and Y within level 2 iceberg bounds
- **Seed**: Use Math.random() or allow seeded random for testing

#### Fireworks Animation
- **Particle count**: 50-100 particles per burst
- **Multiple bursts**: 3-5 bursts at different positions
- **Particle physics**: Gravity, velocity, fade over time
- **Duration**: 3-5 seconds total animation

### Browser Compatibility
- Target modern browsers with Canvas API support (Chrome, Firefox, Safari, Edge)
- TypeScript will be compiled to JavaScript for browser execution
- Use standard ES6+ features as compilation target
- Test on multiple screen sizes and resolutions
