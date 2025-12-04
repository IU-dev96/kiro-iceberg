/**
 * Input handling system for keyboard controls
 * Requirements: 2.1, 2.2, 3.1, 3.2, 4.3
 */

/**
 * InputHandler class manages keyboard input state and event listeners
 * Tracks arrow key presses and Enter key, handles simultaneous key press priority
 */
export class InputHandler {
  private keys: Map<string, boolean>;
  private activeDirection: 'left' | 'right' | null;
  private enterPressed: boolean;
  private spacePressed: boolean;
  private keydownHandler: (event: KeyboardEvent) => void;
  private keyupHandler: (event: KeyboardEvent) => void;

  constructor() {
    this.keys = new Map<string, boolean>();
    this.activeDirection = null;
    this.enterPressed = false;
    this.spacePressed = false;
    
    // Bind event handlers to maintain 'this' context
    this.keydownHandler = this.handleKeyDown.bind(this);
    this.keyupHandler = this.handleKeyUp.bind(this);
  }

  /**
   * Initialize the input handler by setting up event listeners
   * Requirements: 2.1, 3.1
   */
  initialize(): void {
    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  /**
   * Clean up event listeners
   */
  cleanup(): void {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
  }

  /**
   * Handle keydown events
   * Requirement 4.3: Process most recent directional input for simultaneous presses
   * Requirement 7.2: Capture Enter key for trapdoor interaction
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;
    
    // Process arrow keys
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      // Prevent default browser behavior (scrolling)
      event.preventDefault();
      
      // If key wasn't already pressed, update active direction
      if (!this.keys.get(key)) {
        this.keys.set(key, true);
        
        // Update active direction to most recent key press (Requirement 4.3)
        if (key === 'ArrowLeft') {
          this.activeDirection = 'left';
        } else if (key === 'ArrowRight') {
          this.activeDirection = 'right';
        }
      }
    }
    
    // Process Enter key (Requirement 7.2)
    if (key === 'Enter') {
      event.preventDefault();
      this.enterPressed = true;
    }

    // Process Spacebar for jumping (Requirement 2.1)
    if (key === ' ' || key === 'Spacebar') {
      event.preventDefault();
      this.spacePressed = true;
    }
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key;
    
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault();
      this.keys.set(key, false);
      
      // Update active direction when a key is released
      if (key === 'ArrowLeft' && this.activeDirection === 'left') {
        // If left was released and right is still pressed, switch to right
        if (this.keys.get('ArrowRight')) {
          this.activeDirection = 'right';
        } else {
          this.activeDirection = null;
        }
      } else if (key === 'ArrowRight' && this.activeDirection === 'right') {
        // If right was released and left is still pressed, switch to left
        if (this.keys.get('ArrowLeft')) {
          this.activeDirection = 'left';
        } else {
          this.activeDirection = null;
        }
      }
    }
    
    // Reset Enter key on release
    if (key === 'Enter') {
      event.preventDefault();
      this.enterPressed = false;
    }

    // Reset Spacebar on release
    if (key === ' ' || key === 'Spacebar') {
      event.preventDefault();
      this.spacePressed = false;
    }
  }

  /**
   * Check if a specific key is currently pressed
   * 
   * @param key - The key to check
   * @returns true if the key is pressed, false otherwise
   */
  isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }

  /**
   * Get the current active direction based on key state
   * Requirements: 2.2, 3.2, 4.3
   * 
   * @returns The active direction ('left', 'right', or null)
   */
  getActiveDirection(): 'left' | 'right' | null {
    return this.activeDirection;
  }

  /**
   * Check if Enter key is currently pressed
   * Requirement 7.2: Detect Enter key for trapdoor interaction
   * 
   * @returns true if Enter is pressed
   */
  isEnterPressed(): boolean {
    return this.enterPressed;
  }

  /**
   * Consume the Enter key press (reset it after use)
   * Useful to prevent multiple triggers from a single press
   */
  consumeEnter(): void {
    this.enterPressed = false;
  }

  /**
   * Check if Spacebar is currently pressed
   * Requirement 2.1: Detect spacebar for jumping
   * 
   * @returns true if Spacebar is pressed
   */
  isSpacePressed(): boolean {
    return this.spacePressed;
  }

  /**
   * Consume the Spacebar press (reset it after use)
   * Useful to prevent multiple triggers from a single press
   */
  consumeSpace(): void {
    this.spacePressed = false;
  }

  /**
   * Update method (placeholder for future frame-based logic if needed)
   */
  update(): void {
    // Currently no per-frame update logic needed
    // Input state is updated via event handlers
  }
}
