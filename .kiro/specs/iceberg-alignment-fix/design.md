# Design Document

## Overview

This design addresses the critical misalignment between visual rendering, collision boundaries, and game object placement in the platformer game. The core issue is that the iceberg platform width, obstacle positions, door placement, and boundary detection are not properly synchronized, making the game unplayable.

The solution involves:
1. Extending the iceberg platform width from 1600px to 2400px for better gameplay
2. Updating obstacle generation to place objects within the new playable area
3. Repositioning doors to be reachable within the extended platform
4. Fixing boundary detection to properly trigger drowning when leaving the platform
5. Updating the camera system's maximum scroll to accommodate the wider platform

## Architecture

The fix involves coordinating changes across multiple systems:

- **Renderer (renderer.ts)**: Update iceberg platform drawing to extend to 2400px
- **Level Configuration (levelConfig.ts)**: Update door positions for all levels
- **Level Manager (levelManager.ts)**: Update obstacle generation bounds
- **Game Engine (engine.ts)**: Update boundary detection logic and camera max scroll
- **Constants**: Define new platform width constant for consistency

## Components and Interfaces

### Platform Constants

```typescript
// In levelConfig.ts
export const PLATFORM_CONSTANTS = {
  WIDTH: 2400,              // Total platform width
  OBSTACLE_START: 200,      // Start placing obstacles after this x
  OBSTACLE_END: 2000,       // Stop placing obstacles before this x
  DOOR_START: 2100,         // Earliest door position
  DOOR_END: 2300,           // Latest door position
  GROUND_Y: 550             // Ground level (existing)
};
```

### Renderer Updates

The `drawPlatformerIceberg` method needs to draw a platform that extends to 2400px:

```typescript
private drawPlatformerIceberg(context: CanvasRenderingContext2D, width: number, height: number): void {
  const groundY = PLATFORM_CONSTANTS.GROUND_Y;
  const icebergWidth = PLATFORM_CONSTANTS.WIDTH;
  // ... draw from 0 to 2400
}
```

### Level Configuration Updates

Door positions in `LEVEL_CONFIGS` need to be updated to place doors between x=2100 and x=2300:

```typescript
export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    levelNumber: 1,
    // ...
    doorPosition: { x: 2200, y: 470 }  // Updated from 1400
  },
  // ... update all 6 levels
];
```

### Level Manager Updates

The `generateObstacles` method needs to use the new bounds:

```typescript
generateObstacles(level: number): Obstacle[] {
  const icebergStart = PLATFORM_CONSTANTS.OBSTACLE_START;  // 200
  const icebergEnd = PLATFORM_CONSTANTS.OBSTACLE_END;      // 2000
  // ... generate obstacles within these bounds
}
```

### Engine Updates

The boundary detection in `checkCollisions` needs to use the new platform width:

```typescript
private checkCollisions(): void {
  // ...
  const icebergLeft = 0;
  const icebergRight = PLATFORM_CONSTANTS.WIDTH;  // 2400
  
  // Check if character left iceberg horizontally
  if (this.character.x < icebergLeft || charRight > icebergRight) {
    if (!this.isFalling) {
      this.isFalling = true;
      this.fallingTimer = 0;
    }
  }
}
```

The camera maximum scroll needs to be updated:

```typescript
private updateCamera(): void {
  // ...
  const maxCameraX = PLATFORM_CONSTANTS.WIDTH - this.canvas.width;  // 2400 - 800 = 1600
  this.cameraX = Math.max(0, Math.min(this.cameraX, maxCameraX));
}
```

## Data Models

No new data models are required. Existing models remain unchanged:
- `GhostCharacter`
- `Obstacle`
- `Door`
- `LevelConfig`

## Error Handling

- If platform constants are not properly imported, fall back to hardcoded values with console warnings
- Validate that door positions are within platform bounds during level initialization
- Validate that obstacle positions are within platform bounds during generation

## Testing Strategy

### Unit Tests

1. **Test platform width constant**: Verify PLATFORM_CONSTANTS.WIDTH equals 2400
2. **Test door positions**: Verify all level configs have doors between x=2100 and x=2300
3. **Test obstacle bounds**: Verify obstacles are generated between x=200 and x=2000
4. **Test boundary detection**: Verify falling triggers at x<0 and x>2400

### Manual Testing

1. Start level 1 and verify iceberg platform extends visibly across the screen
2. Move character right and verify obstacles appear on the platform
3. Continue moving right and verify door is reachable
4. Walk off left edge and verify drowning animation triggers
5. Walk off right edge (past door) and verify drowning animation triggers
6. Fall below ground and verify drowning animation triggers
7. Test all 6 levels to ensure consistent behavior


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Obstacle bounds constraint

*For any* level configuration (1-6), all generated obstacles should have x positions between 200 and 2000 (inclusive).

**Validates: Requirements 2.1**

### Property 2: Door position constraint

*For any* level configuration (1-5), the generated door should have an x position between 2100 and 2300 (inclusive).

**Validates: Requirements 3.1**

### Edge Cases

The following edge cases should be explicitly tested:

**Edge Case 1: Left boundary drowning**
When character's x position is less than 0, the falling state should be triggered.
**Validates: Requirements 4.1**

**Edge Case 2: Right boundary drowning**
When character's x position plus width exceeds 2400, the falling state should be triggered.
**Validates: Requirements 4.2**

**Edge Case 3: Bottom boundary drowning**
When character's y position exceeds 650, the falling state should be triggered.
**Validates: Requirements 4.3**

**Edge Case 4: Drowning timeout**
When falling state has been active for 2 seconds, game status should transition to 'lost'.
**Validates: Requirements 4.5**
