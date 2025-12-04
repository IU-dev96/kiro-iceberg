# Requirements Document

## Introduction

This feature enhances the visual feedback of the Tip of the Iceberg game by making the Kiro ghost character face the direction of movement. Currently, Kiro always faces the same direction regardless of whether the player moves left or right. This feature will flip the character sprite horizontally based on the movement direction, providing better visual feedback and a more polished game experience.

## Glossary

- **Kiro**: The ghost character controlled by the player in the Tip of the Iceberg game
- **Character Sprite**: The visual representation of Kiro rendered on the game canvas
- **Movement Direction**: The horizontal direction (left or right) that Kiro is currently moving
- **Sprite Flipping**: The technique of horizontally mirroring a character image to face the opposite direction
- **Rendering Context**: The HTML5 Canvas 2D rendering context used to draw game graphics
- **GhostCharacter**: The class representing Kiro's state and behavior in the game code
- **Rotation Animation**: A smooth visual transition that interpolates the character's facing angle over time
- **Animation Duration**: The time period over which the rotation animation completes, measured in milliseconds

## Requirements

### Requirement 1

**User Story:** As a player, I want Kiro to face the direction I'm moving, so that the character's orientation provides visual feedback about my input.

#### Acceptance Criteria

1. WHEN the player moves Kiro to the left, THE GhostCharacter SHALL render facing left
2. WHEN the player moves Kiro to the right, THE GhostCharacter SHALL render facing right
3. WHEN Kiro is stationary, THE GhostCharacter SHALL maintain the last facing direction
4. WHEN the game starts, THE GhostCharacter SHALL face right by default

### Requirement 2

**User Story:** As a developer, I want the facing direction to be tracked as part of the character state, so that the rendering system can access this information consistently.

#### Acceptance Criteria

1. THE GhostCharacter SHALL store the current facing direction as part of its state
2. WHEN the move method is called with a direction parameter, THE GhostCharacter SHALL update its facing direction to match the movement direction
3. THE GhostCharacter SHALL expose the facing direction through a getter method

### Requirement 3

**User Story:** As a developer, I want the sprite flipping to be handled in the rendering layer, so that visual presentation is separated from game logic.

#### Acceptance Criteria

1. WHEN rendering Kiro, THE SceneRenderer SHALL apply horizontal flipping based on the facing direction
2. WHEN the facing direction is left, THE SceneRenderer SHALL flip the sprite horizontally using canvas transformations
3. WHEN the facing direction is right, THE SceneRenderer SHALL render the sprite in its default orientation
4. THE SceneRenderer SHALL restore the canvas context state after applying transformations

### Requirement 4

**User Story:** As a player, I want Kiro's direction change to be animated smoothly, so that the visual transition feels polished and natural.

#### Acceptance Criteria

1. WHEN Kiro changes facing direction, THE GhostCharacter SHALL animate the rotation over a duration of 150 milliseconds
2. WHILE the rotation animation is in progress, THE SceneRenderer SHALL render Kiro at intermediate rotation angles
3. WHEN the rotation animation completes, THE GhostCharacter SHALL be fully facing the new direction
4. WHEN Kiro changes direction multiple times rapidly, THE System SHALL interrupt the current animation and start a new animation from the current rotation state
5. THE GhostCharacter SHALL track the current rotation angle and target rotation angle as part of its state
