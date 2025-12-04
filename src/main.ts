/**
 * Main entry point for Tip of the Iceberg game
 * Requirements: 5.1, 5.2, 5.3
 */

import { GameEngine } from './engine';

/**
 * Initialize and start the game
 * Requirement 5.1: Load and display the game when player opens the Web Application
 * Requirement 5.2: Set up the Game Canvas using HTML5 canvas
 * Requirement 5.3: Function without requiring browser plugins
 */
function initGame(): void {
  // Get canvas element
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  try {
    // Create and start game engine
    const game = new GameEngine(canvas);
    game.start();
    
    console.log('Tip of the Iceberg - Game started successfully!');
    
    // Make game accessible globally for debugging (optional)
    (window as any).game = game;
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

// Start game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  // DOM already loaded
  initGame();
}
