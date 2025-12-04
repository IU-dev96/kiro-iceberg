# Requirements Document

## Introduction

This document specifies the requirements for "Tip of the Iceberg", a web-based interactive game featuring Kiro, a little ghost character that responds to user keyboard input. The game is set on an iceberg scene where players navigate through multiple levels by finding trapdoors, collecting a chalice to win, while avoiding drowning by staying within the iceberg boundaries.

## Glossary

- **Ghost Character**: The player-controlled sprite named Kiro that moves horizontally across the screen
- **Game Canvas**: The visual area where the Ghost Character is rendered and moves within the Iceberg Scene
- **Iceberg Scene**: The visual background depicting an iceberg environment where gameplay takes place, with 10% above water and 90% below water
- **Keyboard Input Handler**: The system component that captures and processes arrow key presses and Enter key
- **Game Loop**: The continuous execution cycle that updates the Ghost Character position and renders the Game Canvas
- **Web Application**: The browser-based interface that hosts the game
- **Trapdoor**: A horizontal interactive element on the floor that allows the Ghost Character to descend to the next level
- **Chalice**: A collectible item on the second level that triggers the win condition when touched by the Ghost Character
- **Game Level**: A distinct vertical section of the Iceberg Scene where gameplay occurs
- **Iceberg Boundary**: The physical edges of the iceberg structure that define the safe playable area
- **Win Condition**: The game state achieved when the Ghost Character collects the Chalice
- **Lose Condition**: The game state triggered when the Ghost Character moves outside the Iceberg Boundary

## Requirements

### Requirement 1

**User Story:** As a player, I want to see a ghost character on an iceberg scene, so that I have a visual representation of what I'm controlling in an engaging environment.

#### Acceptance Criteria

1. WHEN the Web Application loads THEN the system SHALL display the Iceberg Scene as the background on the Game Canvas
2. WHEN the Game Canvas is rendered THEN the system SHALL show the Ghost Character with a distinct visual appearance on top of the Iceberg Scene
3. WHEN the Web Application is running THEN the system SHALL maintain the Ghost Character visible within the Game Canvas boundaries

### Requirement 2

**User Story:** As a player, I want to move the ghost left using the left arrow key, so that I can control the ghost's position.

#### Acceptance Criteria

1. WHEN the player presses the left arrow key THEN the system SHALL move the Ghost Character leftward by a fixed distance
2. WHILE the left arrow key is held down THEN the system SHALL continuously move the Ghost Character leftward
3. WHEN the Ghost Character reaches the left boundary of the Game Canvas THEN the system SHALL prevent further leftward movement

### Requirement 3

**User Story:** As a player, I want to move the ghost right using the right arrow key, so that I can control the ghost's position.

#### Acceptance Criteria

1. WHEN the player presses the right arrow key THEN the system SHALL move the Ghost Character rightward by a fixed distance
2. WHILE the right arrow key is held down THEN the system SHALL continuously move the Ghost Character rightward
3. WHEN the Ghost Character reaches the right boundary of the Game Canvas THEN the system SHALL prevent further rightward movement

### Requirement 4

**User Story:** As a player, I want smooth and responsive controls, so that the game feels natural to play.

#### Acceptance Criteria

1. WHEN keyboard input is received THEN the system SHALL update the Ghost Character position within 16 milliseconds
2. WHEN the Game Loop executes THEN the system SHALL render frames at a consistent rate
3. WHEN multiple keys are pressed simultaneously THEN the system SHALL process the most recent directional input

### Requirement 5

**User Story:** As a player, I want the game to work in my web browser, so that I can play without installing additional software.

#### Acceptance Criteria

1. WHEN the player opens the Web Application in a modern browser THEN the system SHALL load and display the game
2. WHEN the Web Application initializes THEN the system SHALL set up the Game Canvas using HTML5 canvas or equivalent web technology
3. WHEN the game is running THEN the system SHALL function without requiring browser plugins or extensions

### Requirement 6

**User Story:** As a player, I want to see a realistic iceberg with most of its mass underwater, so that the game environment feels authentic.

#### Acceptance Criteria

1. WHEN the Iceberg Scene is rendered THEN the system SHALL display 10% of the iceberg structure above the water level
2. WHEN the Iceberg Scene is rendered THEN the system SHALL display 90% of the iceberg structure below the water level
3. WHEN the Game Canvas is rendered THEN the system SHALL show the iceberg wider at lower depths than at the surface

### Requirement 7

**User Story:** As a player, I want to find and use a trapdoor to descend to the next level, so that I can progress through the game.

#### Acceptance Criteria

1. WHEN the first Game Level is initialized THEN the system SHALL place a Trapdoor at a random horizontal position on the floor within the Iceberg Boundary
2. WHEN the Trapdoor is placed THEN the system SHALL align the Trapdoor with the floor surface
3. WHEN the Ghost Character is positioned over the Trapdoor and the player presses Enter THEN the system SHALL move the Ghost Character to the next Game Level
4. WHEN the Trapdoor is rendered THEN the system SHALL display it with a distinct visual appearance on the floor
5. WHEN the Ghost Character descends through the Trapdoor THEN the system SHALL update the Game Level to the next level

### Requirement 8

**User Story:** As a player, I want to collect a chalice on the second level to win the game, so that I have a clear objective.

#### Acceptance Criteria

1. WHEN the second Game Level is initialized THEN the system SHALL place a Chalice at a random horizontal position
2. WHEN the Ghost Character touches the Chalice THEN the system SHALL trigger the Win Condition
3. WHEN the Win Condition is triggered THEN the system SHALL display fireworks animation on the Game Canvas
4. WHEN the Win Condition is triggered THEN the system SHALL display "You Win" text on the Game Canvas
5. WHEN the Chalice is rendered THEN the system SHALL display it with a distinct visual appearance

### Requirement 9

**User Story:** As a player, I want to lose the game if I step outside the iceberg boundaries, so that the game has challenge and consequences.

#### Acceptance Criteria

1. WHEN the Ghost Character moves outside the Iceberg Boundary THEN the system SHALL trigger the Lose Condition
2. WHEN the Lose Condition is triggered THEN the system SHALL display a drowning animation or visual feedback
3. WHEN the Lose Condition is triggered THEN the system SHALL display "Game Over" text on the Game Canvas
4. WHEN the Ghost Character is within the Iceberg Boundary THEN the system SHALL allow normal movement
5. WHEN a Game Level is active THEN the system SHALL continuously check if the Ghost Character position is within the Iceberg Boundary
