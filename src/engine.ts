/**
 * Game engine and game loop for Tip of the Iceberg
 * Requirements: 4.2, 5.1, 5.2, 7.1, 7.2, 7.4, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2, 9.3, 9.5
 */

import { GhostCharacter, GameStatus, Trapdoor, Chalice, Obstacle, Door, SeaCreature } from './models';
import { InputHandler } from './input';
import { SceneRenderer } from './renderer';
import { LevelManager } from './levelManager';
import { CollisionDetector } from './collision';
import { FireworksSystem } from './fireworks';
import { PhysicsSystem } from './physics';
import { PHYSICS_CONSTANTS } from './levelConfig';
import { TimeoutManager } from './timeoutManager';
import { TitanicAnimationSystem } from './titanicAnimation';

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
  private physicsSystem: PhysicsSystem;
  private timeoutManager: TimeoutManager;
  private titanicAnimationSystem: TitanicAnimationSystem;
  
  private gameStatus: GameStatus;
  private isRunning: boolean;
  private currentLevel: number;
  private trapdoor: Trapdoor | null;
  private chalice: Chalice | null;
  private obstacles: Obstacle[];
  private door: Door | null;
  private seaCreatures: SeaCreature[];
  private lastFrameTime: number;
  private animationFrameId: number | null;
  
  // Camera system for scrolling
  private cameraX: number;
  private cameraY: number;
  
  // Falling/drowning state
  private isFalling: boolean;
  private fallingTimer: number;

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
    this.physicsSystem = new PhysicsSystem();
    this.timeoutManager = new TimeoutManager(5); // 5 second timeout
    this.titanicAnimationSystem = new TitanicAnimationSystem(canvas.width, canvas.height);

    // Initialize game state
    this.gameStatus = 'playing';
    this.isRunning = false;
    this.currentLevel = 0; // Start at level 0 (starting area)
    this.trapdoor = null;
    this.chalice = null;
    this.obstacles = [];
    this.door = null;
    this.seaCreatures = [];
    this.lastFrameTime = 0;
    this.animationFrameId = null;
    
    // Initialize camera
    this.cameraX = 0;
    this.cameraY = 0;
    
    // Initialize falling state
    this.isFalling = false;
    this.fallingTimer = 0;

    // Initialize character for starting area (top of iceberg)
    const characterHeight = 40;
    const characterWidth = 35;
    const waterLevel = canvas.height * 0.1;
    const startX = canvas.width / 2 - characterWidth / 2;
    const startY = waterLevel * 0.5 - characterHeight; // Middle of above-water area
    
    this.character = new GhostCharacter(
      startX,
      startY,
      characterWidth,
      characterHeight,
      PHYSICS_CONSTANTS.HORIZONTAL_SPEED,
      canvas.width,
      0
    );

    // Initialize starting area (level 0)
    this.initializeLevel(0);
  }

  /**
   * Initialize a specific level
   * Requirements: 3.1, 4.1, 5.2, 5.3, 6.1, 9.1
   * 
   * @param level - The level number to initialize (0 = starting area, 1-6 = game levels)
   */
  private initializeLevel(level: number): void {
    this.currentLevel = level;
    this.character.setLevel(level);

    if (level === 0) {
      // Level 0: Starting area at top of iceberg
      this.obstacles = [];
      this.chalice = null;
      
      // Create entrance door to start the game
      const waterLevel = this.canvas.height * 0.1;
      const randomOffset = -120 + Math.random() * (70 - (-120)); // Random between -120 and 70
      const doorX = this.canvas.width / 2 + randomOffset;
      const doorY = waterLevel - 80; // Position door higher up
      this.door = new Door(doorX, doorY, 60, 80);
      
      // Generate a few sea creatures for atmosphere
      this.seaCreatures = [];
      for (let i = 0; i < 3; i++) {
        this.seaCreatures.push(new SeaCreature(1, this.canvas.width, this.canvas.height));
      }

      // Position character at top of iceberg (lower so fully visible)
      this.character.x = this.canvas.width / 2 - this.character.width / 2;
      this.character.y = waterLevel - this.character.height; // Lower position
      this.character.velocityY = 0;
      this.character.isJumping = false;
      this.character.isOnGround = true;

      // Start timeout timer for level 0
      // Requirement 1.1: Initialize and start timeout timer
      this.timeoutManager.start();
    } else {
      // Levels 1-6: Platformer gameplay
      // Generate obstacles for this level (Requirement 3.1, 5.3)
      this.obstacles = this.levelManager.generateObstacles(level);

      // Generate door for level transition (Requirement 4.1)
      this.door = this.levelManager.generateDoor(level);

      // Generate chalice on level 6 (Requirement 6.1)
      this.chalice = this.levelManager.generateChalice(level);

      // Generate sea creatures (Requirement 9.1)
      this.seaCreatures = [];
      for (let i = 0; i < (level + 1); i++) {
        this.seaCreatures.push(new SeaCreature(level, this.canvas.width, this.canvas.height));
      }

      // Reset character position to start of level (Requirement 5.2)
      this.character.x = 50;
      this.character.y = PHYSICS_CONSTANTS.GROUND_Y - this.character.height;
      this.character.velocityY = 0;
      this.character.isJumping = false;
      this.character.isOnGround = true;
    }

    // Keep old trapdoor for backwards compatibility (not used in platformer mode)
    this.trapdoor = null;
  }

  /**
   * Transition to the next level
   * Requirements: 4.3, 5.2, 5.4
   * 
   * @param level - The level number to transition to
   */
  private transitionToLevel(level: number): void {
    // Clamp level to valid range [1, 6]
    const nextLevel = Math.max(1, Math.min(6, level));
    
    // Stop timeout timer when leaving level 0
    // Requirement 5.1: Cancel timer when game starts
    if (this.currentLevel === 0 && nextLevel > 0) {
      this.timeoutManager.stop();
    }
    
    this.gameStatus = 'transitioning';
    
    // Small delay for transition effect
    setTimeout(() => {
      this.initializeLevel(nextLevel);
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
   * Handle timeout trigger
   * Requirements: 1.3, 2.1: Start timeout animation sequence
   */
  private handleTimeout(): void {
    this.gameStatus = 'timeout-animating';
    this.titanicAnimationSystem.start();
  }

  /**
   * Restart game after timeout
   * Requirements: 4.2, 4.3, 4.4: Reset game to initial state
   */
  private restartFromTimeout(): void {
    this.gameStatus = 'playing';
    this.timeoutManager.reset();
    this.titanicAnimationSystem.reset();
    this.initializeLevel(0);
    this.timeoutManager.start();
  }

  /**
   * Update camera to follow character
   */
  private updateCamera(): void {
    if (this.currentLevel === 0) {
      // No camera movement in starting area
      this.cameraX = 0;
      this.cameraY = 0;
      return;
    }

    // Horizontal camera follow - keep character centered
    const targetX = this.character.x - this.canvas.width / 2 + this.character.width / 2;
    const smoothing = 0.15;
    this.cameraX += (targetX - this.cameraX) * smoothing;
    
    // Clamp camera to prevent showing beyond level bounds
    const platformWidth = 1200; // Platform width
    const maxCameraX = platformWidth - this.canvas.width; // 400px max (1200 - 800)
    this.cameraX = Math.max(0, Math.min(this.cameraX, maxCameraX));

    // Vertical camera - keep ground visible
    this.cameraY = 0;
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
   * Requirements: 2.1, 2.3, 7.5, 11.3
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  update(deltaTime: number): void {
    // Update input handler
    this.inputHandler.update();

    // Handle falling state - ghost sinks into water
    if (this.isFalling) {
      this.fallingTimer += deltaTime;
      
      // Make ghost sink down into water
      this.character.y += 200 * deltaTime; // Sink at 200 pixels per second
      
      // Rotate slightly while sinking for effect
      this.character.updateRotationOnly(deltaTime);
      
      // After 2 seconds of sinking, trigger game over
      if (this.fallingTimer > 2.0) {
        this.isFalling = false;
        this.triggerLose();
      }
      return;
    }

    // Only update gameplay if in playing state
    if (this.gameStatus === 'playing') {
      if (this.currentLevel === 0) {
        // Starting area: Simple movement only
        const direction = this.inputHandler.getActiveDirection();
        if (direction) {
          this.character.move(direction, deltaTime);
        }

        // Update rotation animation (without physics/gravity)
        this.character.updateRotationOnly(deltaTime);

        // Update sea creatures
        for (const creature of this.seaCreatures) {
          creature.update(deltaTime, this.canvas.width);
        }

        // Update timeout timer
        // Requirement 1.2, 1.3: Update timer and check for timeout
        const timedOut = this.timeoutManager.update(deltaTime);
        if (timedOut) {
          this.handleTimeout();
          return;
        }

        // Check if character left the starting area (fell off edges)
        const icebergLeft = this.canvas.width * 0.25;
        const icebergRight = this.canvas.width * 0.75;
        
        if (this.character.x < icebergLeft || this.character.x + this.character.width > icebergRight) {
          if (!this.isFalling) {
            this.isFalling = true;
            this.fallingTimer = 0;
          }
        }

        // Check door interaction to start game
        if (this.door) {
          const nearDoor = this.collisionDetector.checkDoorOverlap(this.character, this.door);
          if (nearDoor && this.inputHandler.isEnterPressed()) {
            this.inputHandler.consumeEnter();
            this.transitionToLevel(1); // Start at level 1
          }
        }
      } else {
        // Game levels: Full platformer mechanics
        // Handle jumping (Requirement 2.1)
        if (this.inputHandler.isSpacePressed() && this.character.isOnGround) {
          this.character.jump();
          this.inputHandler.consumeSpace();
        }

        // Handle horizontal movement (Requirements 2.3, 7.5)
        const direction = this.inputHandler.getActiveDirection();
        if (direction) {
          this.character.move(direction, deltaTime);
        }

        // Update physics (Requirement 11.3)
        this.character.updatePhysics(deltaTime);

        // Check ground collision
        this.physicsSystem.checkGroundCollision(this.character, PHYSICS_CONSTANTS.GROUND_Y);

        // Check collisions (obstacles)
        this.checkCollisions();

        // Update camera to follow character
        this.updateCamera();

        // Update sea creatures
        for (const creature of this.seaCreatures) {
          creature.update(deltaTime, this.canvas.width);
        }
      }
    } else if (this.gameStatus === 'won') {
      // Update fireworks
      this.fireworksSystem.update(deltaTime);
    } else if (this.gameStatus === 'timeout-animating') {
      // Update timeout animation
      // Requirement 2.1, 2.2, 2.3, 2.4: Update animation stages
      this.titanicAnimationSystem.update(deltaTime);

      // Check if animation is complete
      // Requirement 2.5: Transition to game over when animation completes
      if (this.titanicAnimationSystem.isAnimationComplete()) {
        this.gameStatus = 'timeout-gameover';
      }
    } else if (this.gameStatus === 'timeout-gameover') {
      // Handle restart input
      // Requirement 4.2: Check for Enter key to restart
      if (this.inputHandler.isEnterPressed()) {
        this.inputHandler.consumeEnter();
        this.restartFromTimeout();
      }
    }
  }

  /**
   * Check all collisions
   * Requirements: 3.2, 4.3, 6.2, 8.1, 8.2, 8.3, 8.4, 8.7
   */
  private checkCollisions(): void {
    // Check all obstacle collisions with solid collision resolution
    // Requirements: 8.1, 8.2, 8.3, 8.4, 8.7
    this.physicsSystem.checkObstacleCollisions(this.character, this.obstacles);

    // Check door interaction (Requirement 4.3)
    if (this.door) {
      const nearDoor = this.collisionDetector.checkDoorOverlap(this.character, this.door);
      
      if (nearDoor && this.inputHandler.isEnterPressed()) {
        this.inputHandler.consumeEnter();
        this.transitionToLevel(this.currentLevel + 1);
      }
    }

    // Check chalice collection (Requirement 6.2)
    if (this.chalice && !this.chalice.collected) {
      const touchedChalice = this.collisionDetector.checkChaliceCollision(
        this.character,
        this.chalice
      );
      
      if (touchedChalice) {
        this.chalice.collected = true;
        this.triggerWin();
      }
    }

    // Check iceberg boundaries - the playable area
    const icebergLeft = 0;
    const icebergRight = 1200; // Platform width
    const charRight = this.character.x + this.character.width;

    // Check if character left iceberg horizontally (fell into water)
    if (this.character.x < icebergLeft || charRight > icebergRight) {
      if (!this.isFalling) {
        this.isFalling = true;
        this.fallingTimer = 0;
      }
    }

    // Check if character fell below ground (fell into water)
    if (this.character.y > PHYSICS_CONSTANTS.GROUND_Y + 100 && !this.isFalling) {
      this.isFalling = true;
      this.fallingTimer = 0;
    }
  }

  /**
   * Render the game scene
   * Integrates rendering of all game elements
   * Requirements: 1.1, 1.3, 3.4, 4.4, 9.1
   */
  render(): void {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.currentLevel === 0) {
      // Starting area: Draw narrow iceberg at top
      this.renderer.drawStartingArea(this.context);
      
      // Draw sea creatures in background
      this.renderer.drawSeaCreatures(this.context, this.seaCreatures);

      // Draw entrance door
      if (this.door) {
        const nearDoor = this.door.checkOverlap(this.character);
        this.renderer.drawDoor(this.context, this.door, nearDoor);
      }

      // Draw character
      this.renderer.drawCharacter(this.context, this.character);

      // Draw countdown timer
      // Requirement 1.2: Display remaining time
      const timeRemaining = this.timeoutManager.getTimeRemaining();
      this.renderer.drawCountdown(this.context, timeRemaining);

      // Draw welcome text at bottom
      this.context.save();
      const bannerY = this.canvas.height - 120;
      this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.context.fillRect(this.canvas.width / 2 - 200, bannerY, 400, 80);
      this.context.strokeStyle = '#FFD700';
      this.context.lineWidth = 2;
      this.context.strokeRect(this.canvas.width / 2 - 200, bannerY, 400, 80);
      
      this.context.fillStyle = '#FFFFFF';
      this.context.font = 'bold 28px Arial';
      this.context.textAlign = 'center';
      this.context.fillText('Tip of the Iceberg', this.canvas.width / 2, bannerY + 30);
      this.context.font = '18px Arial';
      this.context.fillText('Enter the door to begin', this.canvas.width / 2, bannerY + 60);
      this.context.restore();
    } else {
      // Game levels: Normal platformer view with camera
      this.context.save();
      
      // Apply camera transformation
      this.context.translate(-this.cameraX, -this.cameraY);

      // Draw background for current level
      this.renderer.drawBackground(this.context, this.currentLevel);

      // Draw sea creatures in background (Requirement 9.1)
      this.renderer.drawSeaCreatures(this.context, this.seaCreatures);

      // Draw ground line
      this.renderer.drawGround(this.context, PHYSICS_CONSTANTS.GROUND_Y);

      // Draw obstacles (Requirement 3.4)
      for (const obstacle of this.obstacles) {
        this.renderer.drawObstacle(this.context, obstacle);
      }

      // Draw door (Requirement 4.4)
      if (this.door) {
        const nearDoor = this.door.checkOverlap(this.character);
        this.renderer.drawDoor(this.context, this.door, nearDoor);
      }

      // Draw chalice
      if (this.chalice) {
        this.renderer.drawChalice(this.context, this.chalice);
      }

      // Draw character
      this.renderer.drawCharacter(this.context, this.character);

      // Restore camera transformation
      this.context.restore();

      // Draw level banner (Requirements 1.1, 1.3) - UI stays fixed
      this.renderer.drawLevelBanner(this.context, this.currentLevel);
    }

    // Draw water effect when falling/sinking
    if (this.isFalling) {
      this.context.save();
      
      // Draw water splash/ripple effect around character
      const splashAlpha = Math.max(0, 1 - this.fallingTimer / 2); // Fade out over 2 seconds
      this.context.fillStyle = `rgba(70, 130, 180, ${splashAlpha * 0.5})`;
      
      // Draw ripples
      for (let i = 0; i < 3; i++) {
        const rippleRadius = 30 + (this.fallingTimer * 50) + (i * 20);
        this.context.beginPath();
        this.context.arc(
          this.character.x + this.character.width / 2 - (this.currentLevel > 0 ? this.cameraX : 0),
          this.character.y + this.character.height / 2,
          rippleRadius,
          0,
          Math.PI * 2
        );
        this.context.strokeStyle = `rgba(100, 150, 200, ${splashAlpha * 0.3})`;
        this.context.lineWidth = 3;
        this.context.stroke();
      }
      
      this.context.restore();
    }

    // Draw UI overlays
    if (this.gameStatus === 'won') {
      this.renderer.drawFireworks(this.context, this.fireworksSystem.getParticles());
      this.renderer.drawWinScreen(this.context);
    } else if (this.gameStatus === 'lost') {
      this.renderer.drawLoseScreen(this.context);
    } else if (this.gameStatus === 'timeout-animating') {
      // Render timeout animation
      // Requirements: 2.1, 2.2, 2.3, 2.4
      this.renderTimeoutAnimation();
    } else if (this.gameStatus === 'timeout-gameover') {
      // Render timeout game over screen
      // Requirements: 3.2, 4.1
      this.renderer.drawTimeoutGameOver(this.context);
    }
  }

  /**
   * Render the timeout animation based on current stage
   * Requirements: 2.1, 2.2, 2.3, 2.4
   */
  private renderTimeoutAnimation(): void {
    const currentStage = this.titanicAnimationSystem.getCurrentStage();
    
    if (!currentStage) {
      return;
    }

    // Draw base scene - use starting area background (level 0)
    this.renderer.drawStartingArea(this.context);
    this.renderer.drawSeaCreatures(this.context, this.seaCreatures);

    // Draw animation elements based on stage
    const titanicPos = this.titanicAnimationSystem.getTitanicPosition();
    const splitOffset = this.titanicAnimationSystem.getIcebergSplitOffset();
    const ghostSinkY = this.titanicAnimationSystem.getGhostSinkY();

    switch (currentStage.name) {
      case 'titanic-approach':
        // Requirement 2.1: Draw Titanic approaching
        this.renderer.drawTitanic(this.context, titanicPos.x, titanicPos.y);
        break;

      case 'collision':
        // Requirement 2.2: Draw Titanic colliding with explosion effect
        this.renderer.drawTitanic(this.context, titanicPos.x, titanicPos.y);
        this.renderer.drawExplosion(this.context, titanicPos.x + 50, titanicPos.y);
        break;

      case 'iceberg-split':
        // Requirement 2.3: Draw split iceberg
        this.renderer.drawTitanic(this.context, titanicPos.x, titanicPos.y);
        this.renderer.drawSplitIceberg(this.context, splitOffset);
        this.renderer.drawCharacter(this.context, this.character);
        return; // Skip normal character drawing

      case 'ghost-sink':
        // Requirement 2.4: Draw sinking ghost
        this.renderer.drawSplitIceberg(this.context, splitOffset);
        this.renderer.drawSinkingGhost(this.context, this.character, ghostSinkY);
        return; // Skip normal character drawing
    }

    // Draw character normally for approach/collision stages
    this.renderer.drawCharacter(this.context, this.character);
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
