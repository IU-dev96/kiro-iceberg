# Design Document: Platformer Mechanics

## Overview

This design extends the Tip of the Iceberg game with platformer mechanics including jumping, obstacles, multiple levels with progressive difficulty, and atmospheric depth indicators (sea creatures). The design maintains the existing architecture while adding new physics systems, collision detection, and visual elements.

The game will feature 6 levels total, with the chalice appearing at level 6. Each level becomes progressively harder with more obstacles, tighter spacing, and larger obstacles. Sea creatures (fish and sharks) animate outside the iceberg boundaries, growing larger as the player descends deeper.

## Architecture

### Component Structure

The platformer mechanics integrate with the existing game architecture:

```
GameEngine (existing)
├── InputHandler (extended) - Add spacebar support
├── GhostCharacter (extended) - Add jumping physics
├── SceneRenderer (extended) - Add obstacles, doors, sea creatures, level banner
├── LevelManager (extended) - Generate obstacles and doors per level
├── CollisionDetector (extended) - Add obstacle collision detection
└── New Components:
    ├── Obstacle - Represents physical barriers
    ├── Door - Represents level exit
    ├── SeaCreature - Animated background elements
    └── PhysicsSystem - Manages gravity and jumping
```

### Game Flow

1. **Level Initialization**: Generate obstacles, door, and sea creatures based on level number
2. **Input Processing**: Handle arrow keys + spacebar for movement and jumping
3. **Physics Update**: Apply gravity, handle jumping, update positions
4. **Collision Detection**: Check character vs obstacles, door, chalice, boundaries
5. **Rendering**: Draw background, sea creatures, iceberg, obstacles, door, character, UI
6. **Level Transition**: When entering door, advance to next level
7. **Win Condition**: Collecting chalice on level 6 triggers win state

## Components and Interfaces

### Extended GhostCharacter

```typescript
class GhostCharacter {
  // Existing properties
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number; // horizontal velocity
  currentLevel: number;
  
  // New properties for jumping
  velocityY: number;        // vertical velocity
  isJumping: boolean;       // whether character is in air
  isOnGround: boolean;      // whether character is on a surface
  jumpStrength: number;     // initial upward velocity for jump
  gravity: number;          // downward acceleration
  
  // New methods
  jump(): void;                           // Initiate jump
  applyGravity(deltaTime: number): void;  // Apply gravity each frame
  land(): void;                           // Reset jump state when landing
  updatePhysics(deltaTime: number): void; // Update position based on velocities
}
```

### Extended InputHandler

```typescript
class InputHandler {
  // Existing properties
  private keys: Map<string, boolean>;
  private activeDirection: 'left' | 'right' | null;
  private enterPressed: boolean;
  
  // New properties
  private spacePressed: boolean;
  
  // New methods
  isSpacePressed(): boolean;  // Check if spacebar is pressed
  consumeSpace(): void;       // Consume spacebar press
}
```

### Obstacle Class

```typescript
class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'block' | 'spike';  // Visual variation
  
  constructor(x: number, y: number, width: number, height: number, type: string);
  getBounds(): Rectangle;
  checkCollision(character: GhostCharacter): CollisionResult;
}

interface CollisionResult {
  collided: boolean;
  side: 'top' | 'bottom' | 'left' | 'right' | null;
  penetrationDepth: number;  // How far character has penetrated into obstacle
}
```

### Door Class

```typescript
class Door {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  
  constructor(x: number, y: number);
  getBounds(): Rectangle;
  checkOverlap(character: GhostCharacter): boolean;
}
```

### SeaCreature Class

```typescript
class SeaCreature {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  type: 'small-fish' | 'large-fish' | 'shark';
  direction: 'left' | 'right';
  
  constructor(level: number, canvasWidth: number, canvasHeight: number);
  update(deltaTime: number, canvasWidth: number): void;  // Move across screen
  draw(context: CanvasRenderingContext2D): void;
}
```

### PhysicsSystem

```typescript
class PhysicsSystem {
  gravity: number;
  terminalVelocity: number;
  
  applyGravity(character: GhostCharacter, deltaTime: number): void;
  resolveCollision(character: GhostCharacter, obstacle: Obstacle, collisionSide: string): void;
  checkGroundCollision(character: GhostCharacter, groundY: number): boolean;
  checkObstacleCollisions(character: GhostCharacter, obstacles: Obstacle[]): void;
}
```

### Collision Resolution Algorithm

The collision system uses a multi-step approach:

1. **Detection Phase**: Check AABB (Axis-Aligned Bounding Box) overlap between character and each obstacle
2. **Side Determination**: Calculate which side of the obstacle the character is colliding with based on penetration depth
3. **Resolution Phase**: Adjust character position to eliminate overlap:
   - **Left collision**: Set character.x = obstacle.x - character.width (push character left)
   - **Right collision**: Set character.x = obstacle.x + obstacle.width (push character right)
   - **Top collision**: Set character.y = obstacle.y - character.height, set velocityY = 0, set isOnGround = true (land on top)
   - **Bottom collision**: Set character.y = obstacle.y + obstacle.height, set velocityY = 0 (bump head)
4. **State Update**: Update character's isOnGround and isJumping flags based on collision type

### Obstacle Placement Algorithm

To prevent obstacles from overlapping with doors (Requirement 12), the `generateObstacles` function in `LevelManager` uses a restricted zone approach:

1. **Define Restricted Zone**: The door's x-position defines a restricted zone where obstacles cannot be placed
   - Restricted zone extends from `doorX - clearance` to `doorX + doorWidth + clearance`
   - Minimum clearance of 100 pixels ensures door accessibility
2. **Calculate Available Space**: Obstacles are placed in the horizontal space from level start to the restricted zone
   - Available space: `startX` to `doorX - clearance`
3. **Distribute Obstacles**: Obstacles are evenly distributed within the available space
   - Calculate spacing based on obstacle count and available width
   - Ensure minimum spacing requirements are met
4. **Validation**: Each obstacle position is validated to ensure:
   - No overlap with door bounding box
   - Minimum clearance distance maintained
   - Obstacle remains within level boundaries

This approach ensures the door remains accessible and visible without obstruction while maintaining the level's difficulty progression.

## Data Models

### Level Configuration

```typescript
interface LevelConfig {
  levelNumber: number;
  obstacleCount: number;
  obstacleMinSpacing: number;
  obstacleHeightRange: [number, number];
  obstacleWidthRange: [number, number];
  seaCreatureType: 'small-fish' | 'large-fish' | 'shark';
  seaCreatureCount: number;
  seaCreatureSize: number;
  doorPosition: { x: number; y: number };
  chalicePosition?: { x: number; y: number };
}
```

### Difficulty Scaling

Level difficulty scales according to:

```typescript
const LEVEL_CONFIGS: LevelConfig[] = [
  {
    levelNumber: 1,
    obstacleCount: 2,
    obstacleMinSpacing: 200,
    obstacleHeightRange: [30, 40],
    obstacleWidthRange: [40, 50],
    seaCreatureType: 'small-fish',
    seaCreatureCount: 2,
    seaCreatureSize: 20
  },
  {
    levelNumber: 2,
    obstacleCount: 3,
    obstacleMinSpacing: 180,
    obstacleHeightRange: [35, 50],
    obstacleWidthRange: [45, 60],
    seaCreatureType: 'small-fish',
    seaCreatureCount: 3,
    seaCreatureSize: 25
  },
  {
    levelNumber: 3,
    obstacleCount: 4,
    obstacleMinSpacing: 160,
    obstacleHeightRange: [40, 60],
    obstacleWidthRange: [50, 70],
    seaCreatureType: 'large-fish',
    seaCreatureCount: 3,
    seaCreatureSize: 40
  },
  {
    levelNumber: 4,
    obstacleCount: 5,
    obstacleMinSpacing: 140,
    obstacleHeightRange: [45, 65],
    obstacleWidthRange: [55, 75],
    seaCreatureType: 'large-fish',
    seaCreatureCount: 4,
    seaCreatureSize: 50
  },
  {
    levelNumber: 5,
    obstacleCount: 6,
    obstacleMinSpacing: 120,
    obstacleHeightRange: [50, 70],
    obstacleWidthRange: [60, 80],
    seaCreatureType: 'shark',
    seaCreatureCount: 4,
    seaCreatureSize: 70
  },
  {
    levelNumber: 6,
    obstacleCount: 7,
    obstacleMinSpacing: 100,
    obstacleHeightRange: [55, 75],
    obstacleWidthRange: [65, 85],
    seaCreatureType: 'shark',
    seaCreatureCount: 5,
    seaCreatureSize: 90
  }
];
```

### Physics Constants

```typescript
const PHYSICS_CONSTANTS = {
  GRAVITY: 800,              // pixels per second squared
  JUMP_STRENGTH: -400,       // initial upward velocity (negative = up)
  TERMINAL_VELOCITY: 600,    // max falling speed
  GROUND_Y: 550,             // y-coordinate of ground (for 600px canvas)
  HORIZONTAL_SPEED: 200      // pixels per second
};
```

## Correctne
ss Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Jump initiation sets upward velocity

*For any* game state where the character is on the ground, pressing spacebar should set the character's vertical velocity to a negative value (upward).

**Validates: Requirements 2.1, 7.1**

### Property 2: Gravity applies during airborne state

*For any* character in mid-air (isJumping = true), each physics update should increase the vertical velocity (make it more positive/downward).

**Validates: Requirements 2.2, 7.2**

### Property 3: Horizontal movement works while jumping

*For any* character in mid-air, providing horizontal input should move the character horizontally at the same speed as ground movement.

**Validates: Requirements 2.3, 7.5**

### Property 4: Landing resets jump state

*For any* character that collides with the ground while airborne, the jump state should reset (isJumping = false, isOnGround = true) and allow another jump.

**Validates: Requirements 2.4**

### Property 5: Double jump prevention

*For any* character already in jumping state (isJumping = true), attempting to jump again should be rejected until landing.

**Validates: Requirements 2.5**

### Property 6: Obstacles exist within level bounds

*For any* initialized level, all generated obstacles should have positions within the level boundaries.

**Validates: Requirements 3.1**

### Property 7: Left obstacle collision prevents rightward passage

*For any* character colliding with an obstacle from the left side, the character's right edge (x + width) should not exceed the obstacle's left edge (obstacle.x).

**Validates: Requirements 8.1**

### Property 7a: Right obstacle collision prevents leftward passage

*For any* character colliding with an obstacle from the right side, the character's left edge (x) should not be less than the obstacle's right edge (obstacle.x + obstacle.width).

**Validates: Requirements 8.2**

### Property 8: All obstacles are jumpable

*For any* generated obstacle, there should exist a valid jump trajectory (given the character's jump strength and horizontal speed) that clears the obstacle.

**Validates: Requirements 3.3, 10.5**

### Property 9: Obstacle spacing allows navigation

*For any* set of obstacles in a level, the spacing between consecutive obstacles should meet or exceed the minimum spacing defined for that level.

**Validates: Requirements 3.5**

### Property 10: Non-final levels have doors

*For any* level number less than 6, the level should contain a door object.

**Validates: Requirements 4.1, 4.5**

### Property 11: Door interaction triggers level transition

*For any* character positioned near a door (within interaction range), pressing enter should increment the level counter and transition to the next level.

**Validates: Requirements 4.3**

### Property 12: Level transitions reset character position

*For any* level transition, the character's position should be reset to the starting position of the new level.

**Validates: Requirements 5.2**

### Property 13: Level obstacles match configuration

*For any* level, the number and properties of generated obstacles should match the level's configuration (obstacle count, size ranges).

**Validates: Requirements 5.3**

### Property 14: Level counter increments on advance

*For any* level transition (excluding game over), the level counter should increase by exactly 1.

**Validates: Requirements 5.4**

### Property 15: Chalice collection triggers win

*For any* character that collides with the chalice, the game status should change to 'won'.

**Validates: Requirements 6.2**

### Property 16: Chalice only on final level

*For any* level number less than 6, the chalice object should be null or not exist.

**Validates: Requirements 6.3**

### Property 17: Maximum jump height triggers descent

*For any* jumping character, when vertical velocity reaches 0 (maximum height), the next physics update should make velocity positive (descending).

**Validates: Requirements 7.3**

### Property 18: Ground collision stops vertical movement

*For any* character colliding with the ground from above, the vertical velocity should become 0.

**Validates: Requirements 7.4**

### Property 19: Obstacle tops are solid surfaces

*For any* character landing on top of an obstacle, the character should stop falling (velocityY = 0), be positioned at the obstacle's top surface (character.y + character.height = obstacle.y), and be able to jump again (isOnGround = true).

**Validates: Requirements 8.3, 8.4**

### Property 19a: Character cannot fall through obstacle tops

*For any* character standing on top of an obstacle (character bottom at obstacle top), applying gravity should not cause the character to penetrate below the obstacle's top surface.

**Validates: Requirements 8.4**

### Property 20: Successful jumps allow passage

*For any* character whose bottom edge is above an obstacle's top edge while passing over it, no collision should be detected.

**Validates: Requirements 8.5**

### Property 20a: Collision resolution prevents overlap

*For any* character-obstacle collision, after resolution the character's bounding box should not overlap with the obstacle's bounding box.

**Validates: Requirements 8.6, 8.7**

### Property 21: Sea creatures exist outside boundaries

*For any* level, sea creatures should be positioned outside the playable iceberg boundaries (left or right of iceberg edges).

**Validates: Requirements 9.1**

### Property 22: Sea creatures animate over time

*For any* sea creature, its x-position should change between consecutive frames (indicating movement).

**Validates: Requirements 9.5**

### Property 23: Sea creature size scales with depth

*For any* two levels where level A < level B, the sea creature size at level B should be greater than or equal to the size at level A.

**Validates: Requirements 9.6**

### Property 24: Obstacle count increases with level

*For any* two levels where level A < level B, the obstacle count at level B should be greater than or equal to the count at level A.

**Validates: Requirements 10.1**

### Property 25: Obstacle spacing decreases with level

*For any* two levels where level A < level B, the minimum obstacle spacing at level B should be less than or equal to the spacing at level A.

**Validates: Requirements 10.2**

### Property 26: Obstacle size increases with level

*For any* two levels where level A < level B, the maximum obstacle dimensions at level B should be greater than or equal to the dimensions at level A.

**Validates: Requirements 10.3**

### Property 27: Level banner persists during gameplay

*For any* game state during active play, the level banner should remain visible (rendered) throughout the level.

**Validates: Requirements 1.3**

### Property 28: Obstacles do not overlap with door

*For any* level with obstacles and a door, no obstacle's bounding box should overlap with the door's bounding box.

**Validates: Requirements 12.1, 12.3**

### Property 29: Door maintains minimum clearance from obstacles

*For any* level with obstacles and a door, all obstacles should maintain a minimum clearance distance from the door position.

**Validates: Requirements 12.2, 12.4**

## Error Handling

### Jump Input Errors
- **Invalid jump state**: Attempting to jump while already jumping should be silently ignored
- **No ground contact**: Jump should only work when isOnGround = true

### Collision Errors
- **Overlapping spawns**: Ensure character and obstacles don't spawn overlapping
- **Stuck in geometry**: If character gets stuck in obstacle, resolve by moving to nearest valid position

### Level Transition Errors
- **Invalid level number**: Clamp level number to valid range [1, 6]
- **Missing door**: If door doesn't exist, log error but don't crash

### Physics Errors
- **Extreme velocities**: Cap velocities at terminal velocity to prevent physics glitches
- **NaN values**: Validate all physics calculations, default to 0 if NaN detected

### Rendering Errors
- **Missing sprites**: Fall back to colored rectangles if sprite rendering fails
- **Off-screen elements**: Cull elements outside viewport for performance

## Testing Strategy

### Unit Testing

Unit tests will cover specific examples and edge cases:

- **Jump mechanics**: Test jump initiation, landing, double-jump prevention
- **Collision detection**: Test AABB collision for various positions
- **Level generation**: Test obstacle placement, door creation, chalice spawning
- **Input handling**: Test spacebar detection, key combinations
- **Physics calculations**: Test gravity application, velocity updates
- **Sea creature spawning**: Test creature type selection based on level

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** (JavaScript/TypeScript PBT library):

- **Minimum 100 iterations** per property test to ensure thorough coverage
- Each property test will be tagged with: `**Feature: platformer-mechanics, Property {number}: {property_text}**`
- Tests will generate random game states, levels, positions, and inputs
- Properties will validate invariants hold across all generated test cases

**Key property tests**:
- Gravity always increases downward velocity when airborne
- All generated obstacles are within bounds and jumpable
- Level difficulty metrics (count, spacing, size) scale monotonically
- Collision detection prevents passing through solid objects
- Jump state transitions maintain consistency (ground ↔ air)
- Sea creature positions remain outside playable area
- Level transitions preserve game state integrity

### Integration Testing

Integration tests will verify component interactions:

- **Full jump cycle**: Input → physics → collision → rendering
- **Level progression**: Door interaction → transition → new level setup
- **Win condition**: Chalice collection → fireworks → win screen
- **Obstacle navigation**: Movement + jumping over multiple obstacles
- **Sea creature animation**: Spawning → movement → wrapping/respawning

### Test Data Generators

Custom generators for property-based testing:

```typescript
// Generate valid game states
const gameStateGen = fc.record({
  level: fc.integer({ min: 1, max: 6 }),
  characterX: fc.integer({ min: 0, max: 800 }),
  characterY: fc.integer({ min: 0, max: 600 }),
  isJumping: fc.boolean(),
  velocityY: fc.float({ min: -500, max: 500 })
});

// Generate obstacle configurations
const obstacleGen = fc.record({
  x: fc.integer({ min: 100, max: 700 }),
  y: fc.integer({ min: 400, max: 550 }),
  width: fc.integer({ min: 40, max: 85 }),
  height: fc.integer({ min: 30, max: 75 })
});

// Generate level numbers
const levelGen = fc.integer({ min: 1, max: 6 });
```

## Implementation Notes

### Performance Considerations

- **Collision detection**: Use spatial partitioning if obstacle count exceeds 10
- **Sea creature animation**: Limit to 5 creatures max per level
- **Rendering**: Use canvas layers for static background elements
- **Physics updates**: Fixed timestep for consistent behavior

### Accessibility

- **Keyboard-only controls**: All functionality accessible via keyboard
- **Visual feedback**: Clear indicators for interactive elements (door, chalice)
- **Difficulty curve**: Gradual increase to accommodate different skill levels

### Browser Compatibility

- **Canvas API**: Standard HTML5 canvas, supported in all modern browsers
- **RequestAnimationFrame**: For smooth 60fps rendering
- **Keyboard events**: Standard KeyboardEvent API

### Future Enhancements

- **Configurable difficulty**: Allow players to adjust difficulty settings
- **Additional obstacle types**: Moving platforms, disappearing blocks
- **Power-ups**: Temporary abilities like double-jump or invincibility
- **Level editor**: Allow players to create custom levels
- **Leaderboard**: Track completion times and scores
