# Design Document: Kiro Faces Correct Direction

## Overview

This feature adds directional facing with smooth rotation animation to the Kiro ghost character in the Tip of the Iceberg game. The implementation involves three main changes:

1. **State Management**: Add rotation state properties to the `GhostCharacter` class that track current rotation angle, target angle, and animation timing
2. **Animation Logic**: Implement rotation interpolation in the `GhostCharacter.update()` method to smoothly transition between facing directions over 150ms
3. **Visual Rendering**: Modify the `SceneRenderer.drawCharacter()` method to apply Y-axis rotation based on the current rotation angle

The design maintains separation of concerns by keeping the rotation state and animation logic in the character model while delegating the visual transformation to the rendering layer.

## Architecture

The feature follows the existing architecture pattern where:
- **Model Layer** (`GhostCharacter` class): Maintains state and business logic
- **Rendering Layer** (`SceneRenderer` class): Handles visual presentation

### Component Interaction Flow

```
Player Input → GhostCharacter.move(direction) → Set target rotation angle
                                                ↓
                        Game Loop → GhostCharacter.update(deltaTime) → Interpolate rotation
                                                ↓
                                    SceneRenderer.drawCharacter(character)
                                                ↓
                                    Apply Y-axis rotation based on current angle
                                                ↓
                                    Render sprite to canvas
```

## Components and Interfaces

### GhostCharacter Class Modifications

**New Properties:**
```typescript
facingDirection: 'left' | 'right'
currentRotationY: number  // Current Y-axis rotation in radians (0 = right, PI = left)
targetRotationY: number   // Target Y-axis rotation in radians
rotationAnimationProgress: number  // Progress from 0 to 1
rotationAnimationDuration: number  // Duration in seconds (0.15s = 150ms)
```

**Modified Constructor:**
- Initialize `facingDirection` to `'right'` by default (Requirement 1.4)
- Initialize `currentRotationY` to `0` (facing right)
- Initialize `targetRotationY` to `0`
- Initialize `rotationAnimationProgress` to `1` (no animation in progress)
- Set `rotationAnimationDuration` to `0.15` seconds

**Modified Method:**
- `move(direction: 'left' | 'right', deltaTime: number)`: Update `facingDirection` and set `targetRotationY`, reset animation progress (Requirements 2.2, 4.1, 4.4)

**New Methods:**
```typescript
getFacingDirection(): 'left' | 'right'
```
Returns the current facing direction (Requirement 2.3)

```typescript
update(deltaTime: number): void
```
Updates rotation animation, interpolating `currentRotationY` toward `targetRotationY` (Requirements 4.1, 4.2, 4.3)

```typescript
getRotationY(): number
```
Returns the current Y-axis rotation angle for rendering (Requirement 4.2)

### SceneRenderer Class Modifications

**Modified Method:**
- `drawCharacter(context: CanvasRenderingContext2D, character: GhostCharacter)`: Apply Y-axis rotation transformation based on `character.getRotationY()` (Requirements 3.1, 3.4, 4.2)

## Data Models

### Facing Direction Type

```typescript
type FacingDirection = 'left' | 'right';
```

This type represents the two possible horizontal facing directions for Kiro.

### GhostCharacter State Extension

The `GhostCharacter` class will be extended with:

```typescript
class GhostCharacter {
  // ... existing properties
  facingDirection: FacingDirection;
  currentRotationY: number;
  targetRotationY: number;
  rotationAnimationProgress: number;
  rotationAnimationDuration: number;
  
  constructor(/* existing params */) {
    // ... existing initialization
    this.facingDirection = 'right';
    this.currentRotationY = 0; // 0 radians = facing right
    this.targetRotationY = 0;
    this.rotationAnimationProgress = 1; // 1 = animation complete
    this.rotationAnimationDuration = 0.15; // 150ms
  }
  
  move(direction: 'left' | 'right', deltaTime: number): void {
    // Update facing direction and target rotation
    this.facingDirection = direction;
    this.targetRotationY = direction === 'left' ? Math.PI : 0;
    
    // Start new animation from current state (handles rapid direction changes)
    if (this.currentRotationY !== this.targetRotationY) {
      this.rotationAnimationProgress = 0;
    }
    
    // ... existing movement logic
  }
  
  update(deltaTime: number): void {
    // Animate rotation if not complete
    if (this.rotationAnimationProgress < 1) {
      this.rotationAnimationProgress += deltaTime / this.rotationAnimationDuration;
      this.rotationAnimationProgress = Math.min(1, this.rotationAnimationProgress);
      
      // Ease-out interpolation for smooth animation
      const t = this.rotationAnimationProgress;
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
      
      // Interpolate between current and target
      const startRotation = this.currentRotationY;
      this.currentRotationY = startRotation + (this.targetRotationY - startRotation) * eased;
    }
  }
  
  getFacingDirection(): FacingDirection {
    return this.facingDirection;
  }
  
  getRotationY(): number {
    return this.currentRotationY;
  }
}
```

### Animation Algorithm

The rotation animation uses **cubic ease-out** interpolation for a natural feel:
1. When direction changes, `targetRotationY` is set (0 for right, π for left)
2. Each frame, `rotationAnimationProgress` advances based on `deltaTime`
3. Current rotation interpolates from start to target using ease-out curve
4. Animation completes when progress reaches 1.0

This approach handles rapid direction changes by starting new animations from the current rotation state, creating smooth transitions even when interrupted.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Movement updates facing direction

*For any* GhostCharacter instance and any movement direction ('left' or 'right'), calling the move method with that direction should update the character's facing direction to match the movement direction.

**Validates: Requirements 1.1, 1.2, 2.2**

### Property 2: Facing direction persists when stationary

*For any* GhostCharacter instance with a current facing direction, if no move method is called, the facing direction should remain unchanged.

**Validates: Requirements 1.3**

### Property 3: Rotation animation converges to target

*For any* GhostCharacter instance with a target rotation different from current rotation, repeatedly calling update() with positive deltaTime should eventually result in currentRotationY equaling targetRotationY (within floating point tolerance).

**Validates: Requirements 4.1, 4.3**

### Property 4: Animation progress is bounded

*For any* GhostCharacter instance, the rotationAnimationProgress should always be between 0 and 1 inclusive, regardless of deltaTime values passed to update().

**Validates: Requirements 4.2**

## Error Handling

This feature has minimal error handling requirements since:
- The facing direction is constrained by TypeScript types to only valid values ('left' | 'right')
- The move method already validates direction parameters
- Canvas transformation errors are handled by the existing rendering error handling

No additional error handling is needed beyond the existing game engine error management.

## Testing Strategy

### Unit Tests

Unit tests will verify specific behaviors:
- Initial facing direction is 'right' when a GhostCharacter is created (Requirement 1.4)
- The getFacingDirection() method returns the correct value
- Canvas context state is properly saved and restored during rendering

### Property-Based Tests

Property-based tests will verify universal correctness properties using the **fast-check** library for TypeScript. Each property test will run a minimum of 100 iterations to ensure robust validation across random inputs.

**Property Test 1: Movement updates facing direction**
- Generate random GhostCharacter instances with random initial states
- Generate random movement directions ('left' or 'right')
- Call move() with the direction
- Verify getFacingDirection() returns the same direction
- **Tagged as: Feature: kiro-faces-correct-direction, Property 1: Movement updates facing direction**
- **Validates: Requirements 1.1, 1.2, 2.2**

**Property Test 2: Facing direction persists when stationary**
- Generate random GhostCharacter instances with random facing directions
- Record the initial facing direction
- Perform operations that don't involve calling move() (e.g., getBounds(), draw())
- Verify getFacingDirection() still returns the original direction
- **Tagged as: Feature: kiro-faces-correct-direction, Property 2: Facing direction persists when stationary**
- **Validates: Requirements 1.3**

### Integration Tests

Integration tests will verify the feature works correctly within the game engine:
- Verify that player input correctly updates Kiro's facing direction through the full input → engine → character flow
- Verify that the renderer correctly applies transformations based on facing direction

### Testing Approach

The dual testing approach ensures comprehensive coverage:
- **Unit tests** catch specific bugs in initialization and API behavior
- **Property tests** verify the core correctness properties hold across all possible character states and movement sequences
- **Integration tests** ensure the feature works correctly within the broader game system

Together, these tests provide confidence that Kiro will always face the correct direction based on player movement.
