# Design Document: Sparkle Trail Effect

## Overview

The sparkle trail effect adds visual feedback when Kiro (the ghost character) moves through the game. This feature implements a particle system that generates colorful sparkles at the character's position during movement, with particles that fade and drift away over time. The system integrates with the existing game architecture, using the established game loop and rendering patterns.

## Architecture

The sparkle system follows the existing game architecture pattern:

1. **SparkleSystem Class**: A dedicated particle system manager (similar to FireworksSystem) that handles sparkle creation, updates, and lifecycle management
2. **Integration with GameEngine**: The game engine will instantiate and update the sparkle system during the game loop
3. **Integration with SceneRenderer**: The renderer will draw sparkles as part of the normal rendering pipeline
4. **Movement Detection**: The system detects movement by checking the character's velocity or input state

### Component Interaction Flow

```
GameEngine.update()
  ├─> InputHandler.update()
  ├─> Character.move()
  ├─> SparkleSystem.update(character, deltaTime)
  │     ├─> Detect if character is moving
  │     ├─> Generate new sparkles if moving
  │     ├─> Update existing sparkle positions
  │     └─> Remove expired sparkles
  └─> GameEngine.render()
        └─> SceneRenderer.drawSparkles(sparkles)
```

## Components and Interfaces

### SparkleParticle Interface

Extends the existing `Particle` interface with sparkle-specific properties:

```typescript
interface SparkleParticle extends Particle {
  x: number;           // Current X position
  y: number;           // Current Y position
  vx: number;          // Horizontal velocity (drift)
  vy: number;          // Vertical velocity (drift)
  color: string;       // Particle color
  life: number;        // Current lifetime (0-1)
  maxLife: number;     // Maximum lifetime in seconds
  size: number;        // Particle size in pixels
}
```

### SparkleSystem Class

```typescript
class SparkleSystem {
  private particles: SparkleParticle[];
  private generationRate: number;        // Particles per second
  private timeSinceLastSparkle: number;  // Accumulator for generation timing
  private maxParticles: number;          // Maximum active particles
  private colorPalette: string[];        // Available colors
  
  constructor();
  update(character: GhostCharacter, deltaTime: number, isMoving: boolean): void;
  getParticles(): SparkleParticle[];
  private generateSparkle(character: GhostCharacter): void;
  private updateParticles(deltaTime: number): void;
  private removeExpiredParticles(): void;
}
```

### SceneRenderer Extension

Add a new method to the existing `SceneRenderer` class:

```typescript
drawSparkles(context: CanvasRenderingContext2D, sparkles: SparkleParticle[]): void
```

### GameEngine Integration

The `GameEngine` class will:
- Instantiate `SparkleSystem` in the constructor
- Call `sparkleSystem.update()` during the game loop update phase
- Pass sparkles to the renderer during the render phase

## Data Models

### Sparkle Generation Parameters

```typescript
const SPARKLE_CONFIG = {
  GENERATION_RATE: 20,           // Particles per second when moving
  MAX_PARTICLES: 100,            // Maximum active particles
  PARTICLE_LIFETIME: 0.8,        // Seconds before particle expires
  PARTICLE_SIZE_MIN: 2,          // Minimum particle size in pixels
  PARTICLE_SIZE_MAX: 5,          // Maximum particle size in pixels
  DRIFT_SPEED_MIN: -20,          // Minimum drift velocity (pixels/sec)
  DRIFT_SPEED_MAX: 20,           // Maximum drift velocity (pixels/sec)
  COLOR_PALETTE: [
    '#FF6B9D',  // Pink
    '#C44569',  // Dark pink
    '#FFA07A',  // Light salmon
    '#FFD700',  // Gold
    '#87CEEB',  // Sky blue
    '#9B59B6',  // Purple
    '#3498DB',  // Blue
    '#2ECC71',  // Green
  ]
};
```

### Movement Detection

Movement is detected by checking if the character has non-zero horizontal velocity or if directional input is active:

```typescript
function isCharacterMoving(character: GhostCharacter, inputHandler: InputHandler): boolean {
  return inputHandler.getActiveDirection() !== null;
}
```

## Correc
tness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property 1: Movement triggers sparkle generation**
*For any* game state where the character is moving horizontally, calling the sparkle system update should result in new sparkles being generated at the character's position
**Validates: Requirements 1.1**

**Property 2: Stationary character produces no sparkles**
*For any* game state where the character is stationary (no directional input), calling the sparkle system update should not generate new sparkles
**Validates: Requirements 1.2**

**Property 3: Sparkle colors are from palette**
*For any* sparkle generated by the system, its color should be a member of the predefined color palette
**Validates: Requirements 1.3, 3.1**

**Property 4: Sparkles spawn within character bounds**
*For any* sparkle generated by the system, its initial position should be within the character's bounding box (x, y, width, height)
**Validates: Requirements 1.4**

**Property 5: Consistent generation rate during movement**
*For any* continuous movement period, the number of sparkles generated should be proportional to the elapsed time multiplied by the generation rate (within reasonable tolerance)
**Validates: Requirements 1.5, 6.2**

**Property 6: All sparkles have valid lifetime**
*For any* sparkle in the system, it should have a lifetime value greater than 0 and less than or equal to its maximum lifetime
**Validates: Requirements 2.1**

**Property 7: Opacity decreases over time**
*For any* sparkle, advancing time should result in decreased opacity (life/maxLife ratio decreases)
**Validates: Requirements 2.2**

**Property 8: Expired sparkles are removed**
*For any* sparkle whose lifetime has expired (life <= 0), it should be removed from the active particle collection
**Validates: Requirements 2.3, 5.4**

**Property 9: Newer sparkles have higher opacity**
*For any* two sparkles where one was created before the other, the newer sparkle should have higher opacity (life/maxLife ratio) than the older one
**Validates: Requirements 2.4**

**Property 10: All sparkles are updated**
*For any* collection of active sparkles, calling update should modify the state (position or lifetime) of all sparkles
**Validates: Requirements 2.5**

**Property 11: Sparkles have velocity assigned**
*For any* sparkle generated by the system, it should have non-zero velocity components (vx and vy)
**Validates: Requirements 4.1**

**Property 12: Position updates follow velocity**
*For any* sparkle with known velocity, advancing time by deltaTime should change its position by approximately velocity * deltaTime
**Validates: Requirements 4.2**

**Property 13: Frame-rate independence**
*For any* sparkle system state, updating with one large time step should produce similar results to updating with multiple smaller time steps that sum to the same duration
**Validates: Requirements 5.3**

**Property 14: Generation rate within bounds**
*For any* extended movement period, the average sparkle generation rate should be between 10 and 30 particles per second
**Validates: Requirements 6.1**

**Property 15: Maximum particle limit enforced**
*For any* system state, the number of active sparkles should never exceed the configured maximum particle count
**Validates: Requirements 6.3**

**Property 16: Oldest sparkles removed at capacity**
*For any* system at maximum capacity, generating a new sparkle should result in the oldest sparkle being removed
**Validates: Requirements 6.4**

## Error Handling

### Invalid State Handling

1. **Null/Undefined Character**: If the character reference is null or undefined, the sparkle system should skip generation and continue updating existing particles
2. **Invalid Delta Time**: If deltaTime is negative or excessively large (> 1 second), clamp it to reasonable bounds (0 to 0.1 seconds)
3. **Empty Color Palette**: If the color palette is empty, use a default fallback color (#FFFFFF)

### Performance Safeguards

1. **Particle Limit**: Enforce maximum particle count to prevent performance degradation
2. **Efficient Removal**: Use reverse iteration when removing expired particles to avoid index shifting issues
3. **Generation Throttling**: Use time accumulator pattern to ensure consistent generation rate regardless of frame rate

### Edge Cases

1. **Rapid Direction Changes**: Sparkles should continue generating smoothly even when the character rapidly changes direction
2. **Level Transitions**: Clear all sparkles when transitioning between levels to avoid visual artifacts
3. **Game Pause**: When the game is paused or in non-playing states, sparkle updates should be skipped

## Testing Strategy

### Unit Testing

Unit tests will verify specific behaviors and edge cases:

1. **Sparkle Generation Tests**
   - Test that sparkles are generated when character is moving
   - Test that no sparkles are generated when character is stationary
   - Test that sparkles are positioned within character bounds
   - Test that sparkle colors are from the palette

2. **Sparkle Lifecycle Tests**
   - Test that sparkles have valid lifetime on creation
   - Test that sparkle lifetime decreases over time
   - Test that expired sparkles are removed
   - Test that opacity decreases as lifetime decreases

3. **Particle Limit Tests**
   - Test that particle count never exceeds maximum
   - Test that oldest particles are removed when at capacity
   - Test that system handles edge case of max particles = 0

4. **Integration Tests**
   - Test sparkle system integration with game engine
   - Test sparkle rendering integration with scene renderer
   - Test movement detection from input handler

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs using a PBT library (fast-check for TypeScript):

1. **Property Tests for Generation**
   - Property 1: Movement triggers sparkle generation
   - Property 2: Stationary character produces no sparkles
   - Property 3: Sparkle colors are from palette
   - Property 4: Sparkles spawn within character bounds
   - Property 5: Consistent generation rate during movement

2. **Property Tests for Lifecycle**
   - Property 6: All sparkles have valid lifetime
   - Property 7: Opacity decreases over time
   - Property 8: Expired sparkles are removed
   - Property 9: Newer sparkles have higher opacity
   - Property 10: All sparkles are updated

3. **Property Tests for Physics**
   - Property 11: Sparkles have velocity assigned
   - Property 12: Position updates follow velocity
   - Property 13: Frame-rate independence

4. **Property Tests for Limits**
   - Property 14: Generation rate within bounds
   - Property 15: Maximum particle limit enforced
   - Property 16: Oldest sparkles removed at capacity

Each property-based test will:
- Run a minimum of 100 iterations with randomly generated inputs
- Be tagged with a comment referencing the specific correctness property from this design document
- Use the format: `**Feature: sparkle-trail, Property {number}: {property_text}**`

### Testing Tools

- **Unit Testing Framework**: Vitest (already used in the project)
- **Property-Based Testing Library**: fast-check
- **Test Coverage**: Aim for >90% code coverage for the SparkleSystem class
- **Performance Testing**: Verify that 100 active sparkles maintain 60 FPS

## Implementation Notes

### Rendering Order

Sparkles should be rendered after the background and sea creatures but before the character, so they appear behind Kiro. This creates a trailing effect rather than sparkles appearing in front of the character.

### Visual Polish

1. **Sparkle Shape**: Render sparkles as small circles with a subtle glow effect
2. **Size Variation**: Vary sparkle size slightly (2-5 pixels) for visual interest
3. **Fade Curve**: Use non-linear fade (e.g., quadratic) for more natural appearance
4. **Color Distribution**: Ensure good color variety by tracking recently used colors

### Performance Optimization

1. **Object Pooling**: Consider implementing object pooling for sparkle particles if garbage collection becomes an issue
2. **Batch Rendering**: Render all sparkles in a single pass to minimize context state changes
3. **Culling**: Skip rendering sparkles that are outside the visible canvas area

### Configuration Tuning

The sparkle configuration values (generation rate, lifetime, drift speed) should be tuned through playtesting to achieve the desired visual effect without being distracting. The current values are starting points that may need adjustment.
