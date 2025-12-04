# Requirements Document

## Introduction

This feature extends the Tip of the Iceberg game by transforming it into a multi-level platformer with jumping mechanics, obstacles, and progressive level design. Players will navigate through multiple levels, each with its own door to the next level, while jumping over obstacles to reach the final prize.

## Glossary

- **Game System**: The Tip of the Iceberg web-based game application
- **Player**: The user controlling the ghost character
- **Ghost Character**: The playable character that moves and jumps through levels
- **Level**: A distinct game area with its own layout, obstacles, and exit door
- **Door**: An interactive object that allows transition to the next level
- **Obstacle**: A physical barrier that blocks the player's path and must be jumped over
- **Jump**: A vertical movement action triggered by the spacebar
- **Level Banner**: A UI element displaying the current level number
- **Prize**: The chalice collectible located at the final level
- **Collision**: Physical interaction between the ghost character and game objects
- **Sea Creature**: An animated visual element (fish or shark) that appears outside the playable boundaries
- **Difficulty**: The challenge level determined by obstacle complexity and spacing
- **Depth Progression**: Visual and gameplay changes that reflect descending deeper underwater

## Requirements

### Requirement 1

**User Story:** As a player, I want to see which level I'm currently on, so that I can track my progress through the game.

#### Acceptance Criteria

1. WHEN a level starts THEN the Game System SHALL display a level banner showing the current level number
2. WHEN the level banner appears THEN the Game System SHALL position it prominently in the viewport
3. WHEN gameplay begins THEN the Game System SHALL keep the level number visible throughout the level
4. WHEN transitioning between levels THEN the Game System SHALL update the level banner to reflect the new level number

### Requirement 2

**User Story:** As a player, I want to jump using the spacebar, so that I can overcome obstacles in my path.

#### Acceptance Criteria

1. WHEN the player presses the spacebar THEN the Game System SHALL initiate a jump action for the Ghost Character
2. WHILE the Ghost Character is jumping THEN the Game System SHALL apply gravity to create a realistic arc
3. WHEN the Ghost Character is in mid-air THEN the Game System SHALL allow horizontal movement input
4. WHEN the Ghost Character lands on a surface THEN the Game System SHALL reset the jump state to allow another jump
5. WHILE the Ghost Character is already jumping THEN the Game System SHALL prevent additional jump actions until landing

### Requirement 3

**User Story:** As a player, I want to encounter obstacles in each level, so that the game provides challenge and requires skill to navigate.

#### Acceptance Criteria

1. WHEN a level initializes THEN the Game System SHALL place one or more obstacles within the level boundaries
2. WHEN the Ghost Character collides with an obstacle THEN the Game System SHALL prevent forward movement through the obstacle
3. WHEN obstacles are placed THEN the Game System SHALL ensure they can be overcome by jumping
4. WHEN rendering obstacles THEN the Game System SHALL display them with distinct visual appearance
5. WHEN multiple obstacles exist THEN the Game System SHALL space them to allow player navigation

### Requirement 4

**User Story:** As a player, I want each level to have a door to the next level, so that I can progress through the game.

#### Acceptance Criteria

1. WHEN a level initializes THEN the Game System SHALL place a door at a designated exit location
2. WHEN the Ghost Character reaches the door THEN the Game System SHALL provide visual feedback indicating interaction is possible
3. WHEN the player presses the enter key near the door THEN the Game System SHALL transition to the next level
4. WHEN the door is rendered THEN the Game System SHALL display it with a distinct visual appearance
5. WHERE the level is not the final level THEN the Game System SHALL include a door to the next level

### Requirement 5

**User Story:** As a player, I want to navigate through multiple levels, so that I experience progressive gameplay.

#### Acceptance Criteria

1. WHEN the game starts THEN the Game System SHALL initialize at level 1
2. WHEN transitioning to a new level THEN the Game System SHALL reset the Ghost Character position to the level start
3. WHEN a new level loads THEN the Game System SHALL generate appropriate obstacles for that level
4. WHEN advancing levels THEN the Game System SHALL increment the level counter
5. WHEN rendering different levels THEN the Game System SHALL maintain consistent visual style while varying layout

### Requirement 6

**User Story:** As a player, I want to find the prize at the final level, so that I have a clear goal and sense of completion.

#### Acceptance Criteria

1. WHEN the final level initializes THEN the Game System SHALL place the chalice at a designated location
2. WHEN the Ghost Character collects the chalice THEN the Game System SHALL trigger the win condition
3. WHERE the level is not the final level THEN the Game System SHALL not display the chalice
4. WHEN the chalice is rendered THEN the Game System SHALL display it with its existing distinct visual appearance
5. WHEN the player wins THEN the Game System SHALL display the existing win screen with fireworks

### Requirement 7

**User Story:** As a player, I want smooth jumping physics, so that the game feels responsive and natural.

#### Acceptance Criteria

1. WHEN a jump is initiated THEN the Game System SHALL apply an upward velocity to the Ghost Character
2. WHILE the Ghost Character is airborne THEN the Game System SHALL apply downward acceleration (gravity)
3. WHEN the Ghost Character reaches maximum jump height THEN the Game System SHALL begin descent
4. WHEN the Ghost Character collides with the ground THEN the Game System SHALL stop vertical movement
5. WHEN horizontal input is provided during a jump THEN the Game System SHALL maintain the same horizontal movement speed as ground movement

### Requirement 8

**User Story:** As a player, I want obstacles to have collision detection, so that I must successfully jump over them.

#### Acceptance Criteria

1. WHEN the Ghost Character touches an obstacle from the side THEN the Game System SHALL prevent horizontal movement through the obstacle
2. WHEN the Ghost Character lands on top of an obstacle THEN the Game System SHALL treat the obstacle top as a solid surface
3. WHEN the Ghost Character jumps over an obstacle THEN the Game System SHALL allow passage without collision
4. WHEN checking collisions THEN the Game System SHALL evaluate obstacle boundaries accurately
5. WHEN a collision occurs THEN the Game System SHALL resolve it without allowing the Ghost Character to pass through

### Requirement 9

**User Story:** As a player, I want to see sea creatures outside the boundaries that grow larger as I descend, so that I feel the increasing depth and danger.

#### Acceptance Criteria

1. WHEN a level renders THEN the Game System SHALL display sea creatures swimming outside the playable iceberg boundaries
2. WHEN the level number is low (1-2) THEN the Game System SHALL display small fish as sea creatures
3. WHEN the level number is medium (3-4) THEN the Game System SHALL display larger fish as sea creatures
4. WHEN the level number is high (5+) THEN the Game System SHALL display sharks as sea creatures
5. WHEN sea creatures are displayed THEN the Game System SHALL animate them moving across the screen
6. WHEN rendering sea creatures THEN the Game System SHALL scale their size based on the current level depth

### Requirement 10

**User Story:** As a player, I want each level to become progressively harder, so that the game remains challenging and engaging.

#### Acceptance Criteria

1. WHEN a level initializes THEN the Game System SHALL increase obstacle count based on level number
2. WHEN placing obstacles at higher levels THEN the Game System SHALL reduce spacing between obstacles
3. WHEN generating obstacles at higher levels THEN the Game System SHALL increase obstacle height or width
4. WHEN the level number increases THEN the Game System SHALL require more precise jumping and movement
5. WHEN difficulty scales THEN the Game System SHALL ensure all obstacles remain possible to overcome

### Requirement 11

**User Story:** As a developer, I want the jumping mechanic to integrate with existing movement, so that the codebase remains maintainable.

#### Acceptance Criteria

1. WHEN implementing jump mechanics THEN the Game System SHALL extend the existing GhostCharacter model
2. WHEN handling input THEN the Game System SHALL extend the existing InputHandler to support spacebar
3. WHEN updating physics THEN the Game System SHALL integrate with the existing game loop
4. WHEN rendering THEN the Game System SHALL use the existing SceneRenderer architecture
5. WHEN detecting collisions THEN the Game System SHALL extend the existing CollisionDetector
