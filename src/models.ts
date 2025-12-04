/**
 * Core data models and interfaces for the Tip of the Iceberg game
 */

/**
 * Represents the state of a character in the game
 */
export interface CharacterState {
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  speed: number;
}

/**
 * Represents the current input state from keyboard
 */
export interface InputState {
  keys: Map<string, boolean>;
  activeDirection: 'left' | 'right' | null;
}

/**
 * Represents the overall game state
 */
export interface GameState {
  isRunning: boolean;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  character: GhostCharacter;
  lastFrameTime: number;
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
  private canvasWidth: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    velocity: number,
    canvasWidth: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
    this.canvasWidth = canvasWidth;
  }

  /**
   * Move the ghost character in the specified direction
   * Implements boundary checking to keep character within canvas bounds
   * Requirements: 1.3, 2.3, 3.3
   * 
   * @param direction - The direction to move ('left' or 'right')
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  move(direction: 'left' | 'right', deltaTime: number): void {
    const distance = this.velocity * deltaTime;

    if (direction === 'left') {
      // Move left with boundary checking (Requirement 2.3)
      this.x = Math.max(0, this.x - distance);
    } else if (direction === 'right') {
      // Move right with boundary checking (Requirement 3.3)
      this.x = Math.min(this.canvasWidth - this.width, this.x + distance);
    }
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
}
