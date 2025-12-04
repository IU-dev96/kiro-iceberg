# Requirements Document

## Introduction

This spec addresses critical alignment issues in the platformer game where the visual iceberg platform, collision boundaries, game objects (obstacles and doors), and drowning detection are misaligned. Players cannot reach the door, obstacles appear outside the platform, and the drowning mechanic is not functioning correctly.

## Glossary

- **Iceberg Platform**: The visual ice platform that the ghost character walks on
- **Playable Area**: The horizontal space where the character can move (0 to 2400 pixels)
- **Ground Level**: The y-coordinate where the character stands (550 pixels)
- **Boundary Detection**: System that detects when character leaves the playable area
- **Camera System**: Scrolling viewport that follows the character
- **Game Objects**: Obstacles, doors, and other interactive elements

## Requirements

### Requirement 1

**User Story:** As a player, I want the visual iceberg platform to match the playable area, so that I can see where I can safely move.

#### Acceptance Criteria

1. WHEN the game renders the iceberg platform THEN the system SHALL draw the platform from x=0 to x=2400
2. WHEN the character moves horizontally THEN the system SHALL keep the character visible on the ice platform
3. WHEN the camera scrolls THEN the system SHALL show the iceberg platform extending across the full playable width

### Requirement 2

**User Story:** As a player, I want obstacles to be positioned within the reachable iceberg platform, so that I can interact with them during gameplay.

#### Acceptance Criteria

1. WHEN obstacles are generated THEN the system SHALL place all obstacles between x=200 and x=2000
2. WHEN obstacles are rendered THEN the system SHALL show obstacles on top of the visible iceberg platform
3. WHEN the character approaches obstacles THEN the system SHALL allow collision detection and jumping over them

### Requirement 3

**User Story:** As a player, I want the door to be positioned within the reachable iceberg platform, so that I can complete levels.

#### Acceptance Criteria

1. WHEN a door is generated THEN the system SHALL place the door between x=2100 and x=2300
2. WHEN the door is rendered THEN the system SHALL show the door on the iceberg platform surface
3. WHEN the character reaches the door THEN the system SHALL allow interaction to progress to the next level

### Requirement 4

**User Story:** As a player, I want to fall into the water and drown when I leave the iceberg boundaries, so that the game provides appropriate consequences for mistakes.

#### Acceptance Criteria

1. WHEN the character's left edge moves left of x=0 THEN the system SHALL trigger the falling and drowning animation
2. WHEN the character's right edge moves right of x=2400 THEN the system SHALL trigger the falling and drowning animation
3. WHEN the character falls below y=650 THEN the system SHALL trigger the falling and drowning animation
4. WHEN the falling animation plays THEN the system SHALL show the character sinking with water ripple effects
5. WHEN the drowning animation completes after 2 seconds THEN the system SHALL trigger the game over state


