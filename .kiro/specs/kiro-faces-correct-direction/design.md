# Design Document: Kiro Faces Correct Direction

## Overview

This feature adds directional facing to the Kiro ghost character in the Tip of the Iceberg game. The implementation involves two main changes:

1. **State Management**: Add a `facingDirection` property to the `GhostCharacter` class that tracks whether Kiro is facing left or right
2. **Visual Rendering**: Modify the `SceneRenderer.drawCharacter()` method to flip the sprite horizontally when facing left

The design maintains separation of concerns by keeping the facing direction as part of the character's state while delegating the visual transformation to the rendering layer.

## Architecture

The feature follows the existing architecture pattern where:
- **Model Layer** (`GhostCharacter` class): Maintains state and business logic
- **Rendering Layer** (`SceneRenderer` class): Handles visual presentation

### Component Interaction Flow

```
Player Input → GhostCharacter.move(direction) → Update facingDirection
                                                ↓
                                    SceneRenderer.drawCharacter(character)
                                                ↓
                                    Apply horizontal flip if facing left
                                                ↓
                                    Render sprite to canvas
```

## Components and Interfaces

### GhostCharacter Class Modifications

**New Property:**
```typescript
facingDirection: 'left' | 'right'
```

**Modified Constructor:**
- Initialize `facingDirection` to `'right'` by default (Requirement 1.4)

**Modified Method:**
- `move(direction: 'left' | 'right', deltaTime: number)`: Update `facingDirection` when called (Requirement 2.2)

**New Method:**
```typescript
getFacingDirection(): 'left' | 'right'
```
Returns the current facing direction (Requirement 2.3)

### SceneRenderer Class Modifications

**Modified Method:**
- `drawCharacter(context: CanvasRenderingContext2D, character: GhostCharacter)`: Apply canvas transformations based on `character.getFacingDirection()` (Requirements 3.1, 3.2, 3.3, 3.4)

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
  
  constructor(/* existing params */) {
    // ... existing initialization
    this.facingDirection = 'right'; // Default facing direction
  }
  
  move(direction: 'left' | 'right', deltaTime: number): void {
    // Update facing direction
    this.facingDirection = direction;
    // ... existing movement logic
  }
  
  getFacingDirection(): FacingDirection {
    return this.facingDirection;
  }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Movement updates facing direction

*For any* GhostCharacter instance and any movement direction ('left' or 'right'), calling the move method with that direction should update the character's facing direction to match the movement direction.

**Validates: Requirements 1.1, 1.2, 2.2**

### Property 2: Facing direction persists when stationary

*For any* GhostCharacter instance with a current facing direction, if no move method is called, the facing direction should remain unchanged.

**Validates: Requirements 1.3**

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
