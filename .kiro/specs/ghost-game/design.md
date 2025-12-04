# Design Document: Tip of the Iceberg

## Overview

"Tip of the Iceberg" is a browser-based game built using HTML5 Canvas and vanilla JavaScript. The game features Kiro, a ghost character that players control using keyboard arrow keys to move horizontally across an iceberg scene. The architecture follows a simple game loop pattern with clear separation between rendering, input handling, and game state management.

## Architecture

The application uses a component-based architecture with the following layers:

1. **Presentation Layer**: HTML5 Canvas for rendering
2. **Game Logic Layer**: Game state management and physics
3. **Input Layer**: Keyboard event handling
4. **Rendering Layer**: Drawing sprites and backgrounds

The game follows a standard game loop pattern:
```
Initialize → Input → Update → Render → Repeat
```

## Components and Interfaces

### Game Engine
The core game engine manages the game loop and coordinates between components.

**Interface:**
```typescript
interface GameEngine {
  start(): void;
  stop(): void;
  update(deltaTime: number): void;
  render(): void;
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
  move(direction: 'left' | 'right', deltaTime: number): void;
  draw(context: CanvasRenderingContext2D): void;
}
```

### Input Handler
Captures and processes keyboard events.

**Interface:**
```typescript
interface InputHandler {
  isKeyPressed(key: string): boolean;
  update(): void;
  initialize(): void;
  cleanup(): void;
}
```

### Scene Renderer
Manages rendering of the iceberg background and game elements.

**Interface:**
```typescript
interface SceneRenderer {
  drawBackground(context: CanvasRenderingContext2D): void;
  drawCharacter(context: CanvasRenderingContext2D, character: GhostCharacter): void;
}
```

## Data Models

### Game State
```typescript
interface GameState {
  isRunning: boolean;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  character: GhostCharacter;
  lastFrameTime: number;
}
```

### Character State
```typescript
interface CharacterState {
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  speed: number;
}
```

### Input State
```typescript
interface InputState {
  keys: Map<string, boolean>;
  activeDirection: 'left' | 'right' | null;
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

## Error Handling

### Input Errors
- **Invalid key presses**: Non-arrow keys should be ignored without affecting game state
- **Rapid key toggling**: Input handler should debounce or handle rapid state changes gracefully

### Rendering Errors
- **Canvas context unavailable**: Application should fail gracefully with an error message if canvas context cannot be obtained
- **Missing assets**: If background or character sprites fail to load, use fallback colors/shapes

### Boundary Errors
- **Out of bounds positions**: Clamp character position to valid canvas boundaries
- **Invalid dimensions**: Validate canvas and character dimensions on initialization

## Testing Strategy

### Unit Testing
We'll use Vitest for unit tests with full TypeScript support:

- **Initialization tests**: Verify game initializes with correct default state
- **Boundary condition tests**: Test behavior at canvas edges (x=0, x=canvas.width)
- **Input state tests**: Verify input handler correctly tracks key states

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

### Integration Testing
- Test complete game loop cycle: input → update → render
- Verify game starts and stops correctly
- Test keyboard event integration with browser APIs

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

### Visual Design
- Ghost character: Simple sprite or SVG-based design
- Iceberg scene: Gradient background with simple geometric shapes representing ice
- Color palette: Cool blues and whites for iceberg theme

### Browser Compatibility
- Target modern browsers with Canvas API support (Chrome, Firefox, Safari, Edge)
- TypeScript will be compiled to JavaScript for browser execution
- Use standard ES6+ features as compilation target
