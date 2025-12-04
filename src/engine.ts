/**
 * Game engine and game loop for Tip of the Iceberg
 * Requirements: 4.2, 5.1, 5.2
 */

import { GhostCharacter } from './models';
import { InputHandler } from './input';
import { SceneRenderer } from './renderer';

/**
 * GameEngine class manages the game loop and coordinates all game systems
 * Handles initialization, updates, and rendering
 */
export class GameEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private character: GhostCharacter;
  private inputHandler: InputHandler;
  private renderer: SceneRenderer;
  private isRunning: boolean;
  private lastFrameTime: number;
  private animationFrameId: number | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Get canvas context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas 2D context');
    }
    this.context = ctx;

    // Initialize game components
    this.character = new GhostCharacter(
      canvas.width / 2 - 25, // Center horizontally
      canvas.height * 0.4,    // Position on iceberg
      50,                      // Width
      60,                      // Height
      200,                     // Velocity (pixels per second)
      canvas.width
    );

    this.inputHandler = new InputHandler();
    this.renderer = new SceneRenderer();
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.animationFrameId = null;
  }

  /**
   * Start the game engine
   * Requirement 5.1: Load and display the game
   * Requirement 5.2: Set up the Game Canvas
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.inputHandler.initialize();
    this.lastFrameTime = performance.now();
    this.gameLoop(this.lastFrameTime);
  }

  /**
   * Stop the game engine
   */
  stop(): void {
    this.isRunning = false;
    this.inputHandler.cleanup();
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main game loop using requestAnimationFrame
   * Requirement 4.2: Render frames at a consistent rate
   * 
   * @param currentTime - Current timestamp from requestAnimationFrame
   */
  private gameLoop(currentTime: number): void {
    if (!this.isRunning) {
      return;
    }

    // Calculate delta time in seconds
    // Requirement: Frame-rate independent movement
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    // Update game state
    this.update(deltaTime);

    // Render the scene
    this.render();

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * Update game state
   * Integrates input handling and state updates
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  update(deltaTime: number): void {
    // Update input handler (if needed)
    this.inputHandler.update();

    // Get active direction from input
    const direction = this.inputHandler.getActiveDirection();

    // Move character based on input
    if (direction) {
      this.character.move(direction, deltaTime);
    }
  }

  /**
   * Render the game scene
   * Integrates rendering of background and character
   */
  render(): void {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.renderer.drawBackground(this.context);

    // Draw character
    this.renderer.drawCharacter(this.context, this.character);
  }

  /**
   * Get the current game state (useful for testing)
   */
  getState() {
    return {
      isRunning: this.isRunning,
      character: this.character,
      canvas: this.canvas,
      context: this.context,
      lastFrameTime: this.lastFrameTime
    };
  }
}
