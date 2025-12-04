/**
 * Core data models and interfaces for the Tip of the Iceberg game
 */

/**
 * Game status enum
 */
export type GameStatus = 'playing' | 'transitioning' | 'won' | 'lost';

/**
 * Represents the state of a character in the game
 */
export interface CharacterState {
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  speed: number;
  currentLevel: number;
}

/**
 * Represents the current input state from keyboard
 */
export interface InputState {
  keys: Map<string, boolean>;
  activeDirection: 'left' | 'right' | null;
  enterPressed: boolean;
}

/**
 * Represents the overall game state
 */
export interface GameState {
  status: GameStatus;
  isRunning: boolean;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  character: GhostCharacter;
  currentLevel: number;
  trapdoor: Trapdoor | null;
  chalice: Chalice | null;
  lastFrameTime: number;
  fireworksParticles: Particle[];
}

/**
 * Rectangle bounds for collision detection
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Iceberg bounds with dynamic width calculation
 */
export interface IcebergBounds {
  leftEdge: number;
  rightEdge: number;
  topY: number;
  bottomY: number;
  getWidthAtY(y: number): { left: number; right: number };
}

/**
 * Level-specific data
 */
export interface LevelData {
  levelNumber: number;
  icebergBounds: IcebergBounds;
  trapdoorPosition: { x: number; y: number };
  chalicePosition?: { x: number; y: number };
  floorY: number;
}

/**
 * Particle for fireworks animation
 */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}

/**
 * Ghost character class representing Kiro
 * Handles position, dimensions, and movement with boundary checking
 */
export class GhostCharacter {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  currentLevel: number;
  facingDirection: 'left' | 'right';
  private canvasWidth: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    velocity: number,
    canvasWidth: number,
    currentLevel: number = 1
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.canvasWidth = canvasWidth;
    this.currentLevel = currentLevel;
    this.facingDirection = 'right'; // Default facing direction (Requirement 1.4)
  }

  /**
   * Move the ghost character in the specified direction
   * Implements boundary checking to keep character within canvas bounds
   * Requirements: 1.3, 2.3, 3.3, 9.1, 9.4
   * 
   * @param direction - The direction to move ('left' or 'right')
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  move(direction: 'left' | 'right', deltaTime: number): void {
    // Update facing direction (Requirements 1.1, 1.2, 2.2)
    this.facingDirection = direction;
    
    const distance = this.velocity * deltaTime;

    if (direction === 'left') {
      // Move left with boundary checking (Requirement 2.3)
      this.x = Math.max(0, this.x - distance);
    } else if (direction === 'right') {
      // Move right with boundary checking (Requirement 3.3)
      this.x = Math.min(this.canvasWidth - this.width, this.x + distance);
    }
    
    // Note: Iceberg boundary checking is handled by CollisionDetector
    // This basic boundary checking prevents moving off canvas entirely
  }

  /**
   * Set the current level for the character
   * 
   * @param level - The level number
   */
  setLevel(level: number): void {
    this.currentLevel = level;
  }

  /**
   * Get bounding box for collision detection
   * 
   * @returns Rectangle bounds
   */
  getBounds(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Draw the ghost character on the canvas
   * 
   * @param context - The canvas rendering context
   */
  draw(context: CanvasRenderingContext2D): void {
    // Simple rectangle representation for now
    // This will be enhanced in the rendering task
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Update the canvas width (useful when canvas is resized)
   * 
   * @param newWidth - The new canvas width
   */
  updateCanvasWidth(newWidth: number): void {
    this.canvasWidth = newWidth;
    // Ensure character stays within new bounds
    this.x = Math.min(this.x, this.canvasWidth - this.width);
  }

  /**
   * Get the current facing direction of the character
   * Requirement 2.3: Expose facing direction through getter method
   * 
   * @returns The current facing direction ('left' or 'right')
   */
  getFacingDirection(): 'left' | 'right' {
    return this.facingDirection;
  }
}

/**
 * Trapdoor class for level transitions
 * Requirements: 7.1, 7.2
 */
export class Trapdoor {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;

  constructor(x: number, y: number, width: number = 80, height: number = 20) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isActive = true;
  }

  /**
   * Get bounding box for collision detection
   * 
   * @returns Rectangle bounds
   */
  getBounds(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Check if character is overlapping the trapdoor
   * Requirement 7.2: Detect when ghost is positioned over trapdoor
   * 
   * @param character - The ghost character
   * @returns true if overlapping
   */
  checkOverlap(character: GhostCharacter): boolean {
    const charBounds = character.getBounds();
    const trapBounds = this.getBounds();

    // Check if character's bottom center is over the trapdoor
    const charCenterX = charBounds.x + charBounds.width / 2;
    const charBottom = charBounds.y + charBounds.height;

    return (
      this.isActive &&
      charCenterX >= trapBounds.x &&
      charCenterX <= trapBounds.x + trapBounds.width &&
      charBottom >= trapBounds.y &&
      charBottom <= trapBounds.y + trapBounds.height
    );
  }
}

/**
 * Chalice class for win condition
 * Requirements: 8.1, 8.2
 */
export class Chalice {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;

  constructor(x: number, y: number, width: number = 40, height: number = 50) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.collected = false;
  }

  /**
   * Get bounding box for collision detection
   * 
   * @returns Rectangle bounds
   */
  getBounds(): Rectangle {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  /**
   * Check if character collides with the chalice
   * Requirement 8.2: Detect when ghost touches chalice
   * 
   * @param character - The ghost character
   * @returns true if colliding
   */
  checkCollision(character: GhostCharacter): boolean {
    if (this.collected) {
      return false;
    }

    const charBounds = character.getBounds();
    const chaliceBounds = this.getBounds();

    // AABB collision detection
    return (
      charBounds.x < chaliceBounds.x + chaliceBounds.width &&
      charBounds.x + charBounds.width > chaliceBounds.x &&
      charBounds.y < chaliceBounds.y + chaliceBounds.height &&
      charBounds.y + charBounds.height > chaliceBounds.y
    );
  }
}
