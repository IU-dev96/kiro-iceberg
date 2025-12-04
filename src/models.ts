/**
 * Core data models and interfaces for the Tip of the Iceberg game
 */

/**
 * Sea creature image loading infrastructure
 * Module-level cache for sprite images
 */
let sharkImage: HTMLImageElement | null = null;
let sharkImageLoaded: boolean = false;

let fishImage: HTMLImageElement | null = null;
let fishImageLoaded: boolean = false;

/**
 * Load the shark image sprite
 * This function is idempotent - calling it multiple times is safe
 * Requirements: 1.1, 1.5
 */
export function loadSharkImage(): void {
  if (sharkImage) return; // Already loading or loaded
  
  sharkImage = new Image();
  sharkImage.onload = () => {
    sharkImageLoaded = true;
  };
  sharkImage.onerror = () => {
    console.warn('Failed to load shark image, using fallback rendering');
  };
  // Use local asset to avoid CORS issues
  sharkImage.src = '/assets/shark.png';
}

/**
 * Load the fish image sprite
 * This function is idempotent - calling it multiple times is safe
 */
export function loadFishImage(): void {
  if (fishImage) return; // Already loading or loaded
  
  fishImage = new Image();
  fishImage.onload = () => {
    fishImageLoaded = true;
  };
  fishImage.onerror = () => {
    console.warn('Failed to load fish image, using fallback rendering');
  };
  // Use local asset to avoid CORS issues
  fishImage.src = '/assets/clownfish.png';
}

/**
 * Game status enum
 */
export type GameStatus = 'playing' | 'transitioning' | 'won' | 'lost' | 'timeout-animating' | 'timeout-gameover';

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
 * Extended with jumping physics for platformer mechanics
 */
export class GhostCharacter {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number; // horizontal velocity
  currentLevel: number;
  private canvasWidth: number;

  // Jumping physics properties
  velocityY: number;        // vertical velocity
  isJumping: boolean;       // whether character is in air
  isOnGround: boolean;      // whether character is on a surface
  jumpStrength: number;     // initial upward velocity for jump
  gravity: number;          // downward acceleration

  // Direction and rotation properties
  facingDirection: 'left' | 'right';
  currentRotationY: number;
  targetRotationY: number;
  rotationAnimationProgress: number;
  rotationAnimationDuration: number;

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

    // Initialize jumping physics
    this.velocityY = 0;
    this.isJumping = false;
    this.isOnGround = true;
    this.jumpStrength = -400; // negative = upward
    this.gravity = 800; // pixels per second squared

    // Initialize rotation animation
    this.facingDirection = 'right';
    this.currentRotationY = 0; // 0 radians = facing right
    this.targetRotationY = 0;
    this.rotationAnimationProgress = 1; // 1 = animation complete
    this.rotationAnimationDuration = 0.15; // 150ms
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
    // Update facing direction
    this.facingDirection = direction;
    
    // Set target rotation and start animation
    const newTargetRotation = direction === 'left' ? Math.PI : 0;
    if (this.targetRotationY !== newTargetRotation) {
      this.targetRotationY = newTargetRotation;
      // Start new animation from current state
      this.rotationAnimationProgress = 0;
    }

    const distance = this.velocity * deltaTime;

    if (direction === 'left') {
      // Move left - allow free movement, boundary checking in game engine
      this.x = this.x - distance;
    } else if (direction === 'right') {
      // Move right - allow free movement, boundary checking in game engine
      this.x = this.x + distance;
    }
    
    // Note: Iceberg boundary checking is handled by game engine
    // Character can move freely across the extended platform
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
   * Initiate a jump
   * Requirements: 2.1, 7.1
   * Only works when character is on the ground
   */
  jump(): void {
    if (this.isOnGround && !this.isJumping) {
      this.velocityY = this.jumpStrength;
      this.isJumping = true;
      this.isOnGround = false;
    }
  }

  /**
   * Apply gravity to the character
   * Requirements: 2.2, 7.2
   * Increases downward velocity when airborne
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  applyGravity(deltaTime: number): void {
    if (this.isJumping) {
      this.velocityY += this.gravity * deltaTime;
      // Cap at terminal velocity
      const terminalVelocity = 600;
      this.velocityY = Math.min(this.velocityY, terminalVelocity);
    }
  }

  /**
   * Reset jump state when landing on a surface
   * Requirements: 2.4, 7.4
   */
  land(): void {
    this.velocityY = 0;
    this.isJumping = false;
    this.isOnGround = true;
  }

  /**
   * Update physics - apply gravity and update position
   * Requirements: 2.2, 7.2, 7.3, 11.3
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  updatePhysics(deltaTime: number): void {
    // Apply gravity
    this.applyGravity(deltaTime);

    // Update vertical position
    this.y += this.velocityY * deltaTime;

    // Update rotation animation
    this.updateRotation(deltaTime);
  }

  /**
   * Get current rotation Y value
   * 
   * @returns Current rotation in radians
   */
  getRotationY(): number {
    return this.currentRotationY;
  }

  /**
   * Update only rotation animation (without physics)
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  updateRotationOnly(deltaTime: number): void {
    this.updateRotation(deltaTime);
  }

  /**
   * Update rotation animation
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   */
  private updateRotation(deltaTime: number): void {
    // Animate rotation if not complete
    if (this.rotationAnimationProgress < 1) {
      // Store start rotation before updating progress
      const startRotation = this.currentRotationY;
      
      // Advance animation progress
      this.rotationAnimationProgress += deltaTime / this.rotationAnimationDuration;
      this.rotationAnimationProgress = Math.min(1, this.rotationAnimationProgress);
      
      // Cubic ease-out interpolation for smooth animation
      const t = this.rotationAnimationProgress;
      const eased = 1 - Math.pow(1 - t, 3);
      
      // Interpolate between start and target
      this.currentRotationY = startRotation + (this.targetRotationY - startRotation) * eased;
    }
  }
}

/**
 * SeaCreature class for atmospheric depth indicators
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
 */
export class SeaCreature {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  type: 'small-fish' | 'large-fish' | 'shark';
  direction: 'left' | 'right';

  constructor(level: number, canvasWidth: number, canvasHeight: number) {
    // Determine creature type based on level (Requirements 9.2, 9.3, 9.4)
    if (level <= 2) {
      this.type = 'small-fish';
      this.width = 20 + level * 5; // 25-30px
      this.height = 15 + level * 3; // 18-21px
    } else if (level <= 4) {
      this.type = 'large-fish';
      this.width = 35 + (level - 2) * 7; // 42-49px
      this.height = 25 + (level - 2) * 5; // 30-35px
    } else {
      this.type = 'shark';
      this.width = 60 + (level - 4) * 15; // 75-90px
      this.height = 40 + (level - 4) * 10; // 50-60px
    }

    // Random starting position outside boundaries (Requirement 9.1)
    this.direction = Math.random() > 0.5 ? 'left' : 'right';
    if (this.direction === 'right') {
      this.x = -this.width; // Start off left edge
    } else {
      this.x = canvasWidth; // Start off right edge
    }

    // Random y position
    this.y = Math.random() * (canvasHeight - this.height);

    // Velocity based on creature type
    const baseSpeed = 50 + level * 10;
    this.velocityX = this.direction === 'right' ? baseSpeed : -baseSpeed;
  }

  /**
   * Update sea creature position
   * Requirement 9.5: Animate creatures moving across screen
   * 
   * @param deltaTime - Time elapsed since last frame in seconds
   * @param canvasWidth - Canvas width for wrapping
   */
  update(deltaTime: number, canvasWidth: number): void {
    this.x += this.velocityX * deltaTime;

    // Wrap around when off screen
    if (this.direction === 'right' && this.x > canvasWidth) {
      this.x = -this.width;
    } else if (this.direction === 'left' && this.x + this.width < 0) {
      this.x = canvasWidth;
    }
  }

  /**
   * Draw the sea creature
   * Uses image rendering for creatures (when loaded), geometric shapes otherwise
   * Requirements: 2.1, 2.2
   * 
   * @param context - The canvas rendering context
   */
  draw(context: CanvasRenderingContext2D): void {
    // For sharks, try to use shark image rendering
    if (this.type === 'shark' && sharkImageLoaded && sharkImage) {
      this.drawCreatureImage(context, sharkImage);
    } 
    // For fish, try to use fish image rendering
    else if ((this.type === 'small-fish' || this.type === 'large-fish') && fishImageLoaded && fishImage) {
      this.drawCreatureImage(context, fishImage);
    } 
    // Fallback to geometric rendering
    else {
      this.drawGeometric(context);
    }
  }

  /**
   * Draw sea creature using geometric shapes
   * Used for fish and as fallback for sharks
   * 
   * @param context - The canvas rendering context
   */
  private drawGeometric(context: CanvasRenderingContext2D): void {
    context.save();

    // Set color based on type
    if (this.type === 'small-fish') {
      context.fillStyle = '#4A90E2'; // Light blue
    } else if (this.type === 'large-fish') {
      context.fillStyle = '#2E5C8A'; // Medium blue
    } else {
      context.fillStyle = '#1A3A52'; // Dark blue/gray
    }

    // Draw simple fish/shark shape
    context.beginPath();
    
    if (this.type === 'shark') {
      // Shark - triangular dorsal fin shape
      const centerY = this.y + this.height / 2;
      context.moveTo(this.x, centerY);
      context.lineTo(this.x + this.width * 0.7, centerY - this.height * 0.3);
      context.lineTo(this.x + this.width, centerY);
      context.lineTo(this.x + this.width * 0.7, centerY + this.height * 0.3);
      context.closePath();
    } else {
      // Fish - ellipse shape
      context.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        0,
        0,
        Math.PI * 2
      );
    }
    
    context.fill();

    // Add tail
    context.beginPath();
    if (this.direction === 'right') {
      context.moveTo(this.x, this.y + this.height / 2);
      context.lineTo(this.x - this.width * 0.3, this.y);
      context.lineTo(this.x - this.width * 0.3, this.y + this.height);
    } else {
      context.moveTo(this.x + this.width, this.y + this.height / 2);
      context.lineTo(this.x + this.width * 1.3, this.y);
      context.lineTo(this.x + this.width * 1.3, this.y + this.height);
    }
    context.closePath();
    context.fill();

    context.restore();
  }

  /**
   * Draw sea creature using image sprite with direction-aware flipping
   * Requirements: 1.2, 1.3, 1.4, 2.3, 2.4
   * 
   * @param context - The canvas rendering context
   * @param image - The image to render
   */
  private drawCreatureImage(context: CanvasRenderingContext2D, image: HTMLImageElement): void {
    context.save();
    
    // Apply horizontal flip for right-facing creatures
    if (this.direction === 'right') {
      // Translate to the right edge of where the creature should be
      context.translate(this.x + this.width, this.y);
      // Flip horizontally
      context.scale(-1, 1);
      // Draw at origin (0, 0) since we've already translated
      context.drawImage(image, 0, 0, this.width, this.height);
    } else {
      // Left-facing (original orientation)
      context.drawImage(image, this.x, this.y, this.width, this.height);
    }
    
    context.restore();
  }
}

/**
 * Door class for level transitions in platformer mode
 * Requirements: 4.1, 4.3
 */
export class Door {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;

  constructor(x: number, y: number, width: number = 60, height: number = 80) {
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
   * Check if character is overlapping the door (for interaction)
   * Requirement 4.3: Detect when ghost is near door
   * 
   * @param character - The ghost character
   * @returns true if overlapping
   */
  checkOverlap(character: GhostCharacter): boolean {
    const charBounds = character.getBounds();
    const doorBounds = this.getBounds();

    // Check if character overlaps with door
    return (
      this.isActive &&
      charBounds.x < doorBounds.x + doorBounds.width &&
      charBounds.x + charBounds.width > doorBounds.x &&
      charBounds.y < doorBounds.y + doorBounds.height &&
      charBounds.y + charBounds.height > doorBounds.y
    );
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
 * Collision result interface
 */
export interface CollisionResult {
  collided: boolean;
  side: 'top' | 'bottom' | 'left' | 'right' | null;
}

/**
 * Obstacle class for platformer mechanics
 * Requirements: 3.1, 3.2, 8.1
 */
export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'block' | 'spike';

  constructor(x: number, y: number, width: number, height: number, type: 'block' | 'spike' = 'block') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
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
   * Check collision with character and determine collision side
   * Requirements: 3.2, 8.1, 8.6
   * 
   * @param character - The ghost character
   * @returns Collision result with side information
   */
  checkCollision(character: GhostCharacter): CollisionResult {
    const charBounds = character.getBounds();
    const obsBounds = this.getBounds();

    // AABB collision detection
    const collided = (
      charBounds.x < obsBounds.x + obsBounds.width &&
      charBounds.x + charBounds.width > obsBounds.x &&
      charBounds.y < obsBounds.y + obsBounds.height &&
      charBounds.y + charBounds.height > obsBounds.y
    );

    if (!collided) {
      return { collided: false, side: null };
    }

    // Calculate overlap on each side
    const overlapLeft = (charBounds.x + charBounds.width) - obsBounds.x;
    const overlapRight = (obsBounds.x + obsBounds.width) - charBounds.x;
    const overlapTop = (charBounds.y + charBounds.height) - obsBounds.y;
    const overlapBottom = (obsBounds.y + obsBounds.height) - charBounds.y;

    // Find the minimum overlap (that's the collision side)
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    let side: 'top' | 'bottom' | 'left' | 'right';
    if (minOverlap === overlapLeft) {
      // Character is hitting obstacle from the LEFT side
      side = 'left';
    } else if (minOverlap === overlapRight) {
      // Character is hitting obstacle from the RIGHT side
      side = 'right';
    } else if (minOverlap === overlapTop) {
      // Character is hitting obstacle from the TOP (landing on it)
      side = 'top';
    } else {
      // Character is hitting obstacle from the BOTTOM (jumping into it)
      side = 'bottom';
    }

    return { collided: true, side };
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
