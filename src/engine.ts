/**
 * Game engine and game loop for Tip of the Iceberg
 * Requirements: 4.2, 5.1, 5.2, 7.1, 7.2, 7.4, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.5
 */

import { GhostCharacter, GameStatus, Trapdoor, Chalice } from './models';
import { InputHandler } from './input';
import { SceneRenderer } from './renderer';
import { LevelManager } from './levelManager';
import { CollisionDetector } from './collision';
import { FireworksSystem } from './fireworks';

/**
 * GameEngine class manages the game loop and coordinates all game systems
 * Handles initialization, updates, rendering, and game state
 */
export class GameEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private character: GhostCharacter;
  private inputHandler: InputHandler;
  private renderer: SceneRenderer;
  private levelManager: LevelManager;
  private collisionDetector: CollisionDetector;
  private fireworksSystem: FireworksSystem;
  
  private gameStatus: GameStatus;
  private isRunning: boolean;
  private currentLevel: number;
  private trapdoor: Trapdoor | null;
  private chalice: Chalice | null;
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

    // Initialize game systems
    this.inputHandler = new InputHandler();
    this.renderer = new SceneRenderer(canvas.width, canvas.height);
    this.levelManager = new LevelManager(canvas.width, canvas.height);
    this.collisionDetector = new CollisionDetector();
    this.fireworksSystem = new FireworksSystem(canvas.width, canvas.height);

    // Initialize game state
    this.gameStatus = 'playing';
    this.isRunning = false;
    this.currentLevel = 1;
    this.trapdoor = null;
    this.chalice = null;
    this.lastFrameTime = 0;
    this.animationFrameId = null;

    // Initialize character for level 1
    // Level 1 is only 10% of canvas height (60 pixels for 600px canvas)
    // Character needs to fit within this space
    const level1Height = canvas.height * 0.1;
    const characterHeight = Math.min(40, level1Height * 0.6); // Max 40px or 60% of level height
    const characterWidth = 35;
    
    this.character = new GhostCharacter(
      canvas.width / 2 - characterWidth / 2,  // Center horizontally
      level1Height * 0.2,                      // Start at 20% down level 1
      characterWidth,                          // Width
      characterHeight,                         // Height
      200,                                     // Velocity (pixels per second)
      canvas.width,
      1                                        // Start at level 1
    );

    // Initialize level 1
    this.initializeLevel(1);
  }

  /**
   * Initialize a specific level
   * Requirement 7.1: Place trapdoor at random position
   * Requirement 8.1: Place chalice at random position on level 2
   * 
   * @param level - The level number to initialize
   */
  private initializeLevel(level: number): void {
    this.currentLevel = level;
    this.character.setLevel(level);

    if (level === 1) {
      // Level 1: Create trapdoor
      this.trapdoor = this.levelManager.generateTrapdoor(level);
      this.chalice = null;
      
      // Position character in middle of level 1 where iceberg is wider
      // Level 1 goes from 0 to waterLevel (10% of canvas)
      const level1Height = this.canvas.height * 0.1;
      this.character.x = this.canvas.width / 2 - this.character.width / 2;
      this.character.y = level1Height * 0.2; // 20% down level 1
    } else if (level === 2) {
      // Level 2: Create chalice, no trapdoor
      this.trapdoor = null;
      this.chalice = this.levelManager.generateChalice(level);
      
      // Position character at top of level 2 (just below water level)
      const waterLevel = this.canvas.height * 0.1;
      this.character.x = this.canvas.width / 2 - this.character.width / 2;
      this.character.y = waterLevel + 10; // Just below water level
    }
  }

  /**
   * Transition to the next level
   * Requirement 7.4: Update game level when descending through trapdoor
   * 
   * @param level - The level number to transition to
   */
  private transitionToLevel(level: number): void {
    this.gameStatus = 'transitioning';
    
    // Small delay for transition effect
    setTimeout(() => {
      this.initializeLevel(level);
      this.gameStatus = 'playing';
    }, 300);
  }

  /**
   * Trigger win condition
   * Requirement 8.2, 8.3, 8.4: Trigger win state and fireworks
   */
  private triggerWin(): void {
    this.gameStatus = 'won';
    this.fireworksSystem.initialize();
  }

  /**
   * Trigger lose condition
   * Requirement 9.1, 9.2, 9.3: Trigger lose state
   */
  private triggerLose(): void {
    this.gameStatus = 'lost';
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
   * Integrates input handling, collision detection, and state updates
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  update(deltaTime: number): void {
    // Update input handler
    this.inputHandler.update();

    // Only update gameplay if in playing state
    if (this.gameStatus === 'playing') {
      // Handle character movement
      const direction = this.inputHandler.getActiveDirection();
      if (direction) {
        this.character.move(direction, deltaTime);
      }

      // Check collisions
      this.checkCollisions();
    } else if (this.gameStatus === 'won') {
      // Update fireworks
      this.fireworksSystem.update(deltaTime);
    }
  }

  /**
   * Check all collisions
   * Requirements: 7.2, 8.2, 9.1, 9.5
   */
  private checkCollisions(): void {
    // Check boundary (Requirement 9.1, 9.5)
    const bounds = this.levelManager.getIcebergBounds(this.currentLevel);
    const withinBounds = this.collisionDetector.checkBoundary(this.character, bounds);
    
    if (!withinBounds) {
      this.triggerLose();
      return;
    }

    // Check trapdoor (Requirement 7.2)
    if (this.trapdoor && this.currentLevel === 1) {
      const onTrapdoor = this.collisionDetector.checkTrapdoorOverlap(
        this.character,
        this.trapdoor
      );
      
      if (onTrapdoor && this.inputHandler.isEnterPressed()) {
        this.inputHandler.consumeEnter();
        this.transitionToLevel(2);
      }
    }

    // Check chalice (Requirement 8.2)
    if (this.chalice && this.currentLevel === 2) {
      const touchedChalice = this.collisionDetector.checkChaliceCollision(
        this.character,
        this.chalice
      );
      
      if (touchedChalice) {
        this.chalice.collected = true;
        this.triggerWin();
      }
    }
  }

  /**
   * Render the game scene
   * Integrates rendering of all game elements
   */
  render(): void {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background for current level
    this.renderer.drawBackground(this.context, this.currentLevel);

    // Draw game objects
    if (this.trapdoor && this.currentLevel === 1) {
      this.renderer.drawTrapdoor(this.context, this.trapdoor);
    }

    if (this.chalice && this.currentLevel === 2) {
      this.renderer.drawChalice(this.context, this.chalice);
    }

    // Draw character
    this.renderer.drawCharacter(this.context, this.character);

    // Draw UI overlays
    if (this.gameStatus === 'won') {
      this.renderer.drawFireworks(this.context, this.fireworksSystem.getParticles());
      this.renderer.drawWinScreen(this.context);
    } else if (this.gameStatus === 'lost') {
      this.renderer.drawLoseScreen(this.context);
    }
  }

  /**
   * Get the current game state (useful for testing)
   */
  getState() {
    return {
      status: this.gameStatus,
      isRunning: this.isRunning,
      currentLevel: this.currentLevel,
      character: this.character,
      trapdoor: this.trapdoor,
      chalice: this.chalice,
      canvas: this.canvas,
      context: this.context,
      lastFrameTime: this.lastFrameTime
    };
  }
}
