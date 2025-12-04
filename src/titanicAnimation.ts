/**
 * TitanicAnimationSystem class for enforce-gamestart feature
 * Manages the multi-stage timeout animation sequence
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

export type AnimationStageName = 'titanic-approach' | 'collision' | 'iceberg-split' | 'ghost-sink';

export interface AnimationStage {
  name: AnimationStageName;
  duration: number;
  elapsed: number;
}

export class TitanicAnimationSystem {
  private stages: AnimationStage[];
  private currentStageIndex: number;
  private titanicX: number;
  private titanicY: number;
  private icebergSplitOffset: number;
  private ghostSinkY: number;
  private isComplete: boolean;
  private canvasWidth: number;
  private canvasHeight: number;

  /**
   * Create a new TitanicAnimationSystem
   * 
   * @param canvasWidth - Width of the game canvas
   * @param canvasHeight - Height of the game canvas
   */
  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Initialize animation stages with durations
    // Requirement 2.1, 2.2, 2.3, 2.4: Define all animation stages
    this.stages = [
      { name: 'titanic-approach', duration: 2.0, elapsed: 0 },
      { name: 'collision', duration: 0.5, elapsed: 0 },
      { name: 'iceberg-split', duration: 1.0, elapsed: 0 },
      { name: 'ghost-sink', duration: 2.0, elapsed: 0 }
    ];

    this.currentStageIndex = -1;
    this.titanicX = -200; // Start off-screen left
    this.titanicY = canvasHeight * 0.1; // At water level
    this.icebergSplitOffset = 0;
    this.ghostSinkY = 0;
    this.isComplete = false;
  }

  /**
   * Start the animation sequence
   * Requirement 2.1: Begin Titanic approach animation
   */
  start(): void {
    this.currentStageIndex = 0;
    this.isComplete = false;
    
    // Reset all stage elapsed times
    for (const stage of this.stages) {
      stage.elapsed = 0;
    }

    // Reset animation positions
    this.titanicX = -200;
    this.titanicY = this.canvasHeight * 0.1;
    this.icebergSplitOffset = 0;
    this.ghostSinkY = 0;
  }

  /**
   * Update the animation with elapsed time
   * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
   * 
   * @param deltaTime - Time elapsed since last update in seconds
   */
  update(deltaTime: number): void {
    if (this.isComplete || this.currentStageIndex < 0) {
      return;
    }

    const currentStage = this.stages[this.currentStageIndex];
    currentStage.elapsed += deltaTime;

    // Update animation based on current stage
    switch (currentStage.name) {
      case 'titanic-approach':
        // Requirement 2.1: Titanic moves toward iceberg
        const approachProgress = currentStage.elapsed / currentStage.duration;
        this.titanicX = -200 + (this.canvasWidth / 2 - 100) * Math.min(approachProgress, 1);
        break;

      case 'collision':
        // Requirement 2.2: Collision animation (shake effect with continued slow movement)
        const collisionProgress = currentStage.elapsed / currentStage.duration;
        const shake = Math.sin(collisionProgress * Math.PI * 10) * 5;
        
        // Continue moving left to right but at much slower speed during collision
        const startX = this.canvasWidth / 2 - 100;
        const endX = this.canvasWidth / 2 - 80; // Move only 20 pixels during collision
        const baseX = startX + (endX - startX) * Math.min(collisionProgress, 1);
        
        this.titanicX = baseX + shake;
        break;

      case 'iceberg-split':
        // Requirement 2.3: Iceberg splits apart
        const splitProgress = currentStage.elapsed / currentStage.duration;
        this.icebergSplitOffset = 50 * Math.min(splitProgress, 1);
        break;

      case 'ghost-sink':
        // Requirement 2.4: Ghost sinks to bottom
        const sinkProgress = currentStage.elapsed / currentStage.duration;
        this.ghostSinkY = this.canvasHeight * Math.min(sinkProgress, 1);
        break;
    }

    // Check if current stage is complete
    if (currentStage.elapsed >= currentStage.duration) {
      this.currentStageIndex++;

      // Check if all stages are complete
      // Requirement 2.5: Transition to game over when animation completes
      if (this.currentStageIndex >= this.stages.length) {
        this.isComplete = true;
      }
    }
  }

  /**
   * Check if animation is complete
   * Requirement 2.5: Detect when all stages have finished
   * 
   * @returns true if animation has completed all stages
   */
  isAnimationComplete(): boolean {
    return this.isComplete;
  }

  /**
   * Get the current animation stage
   * 
   * @returns Current stage or null if not started/complete
   */
  getCurrentStage(): AnimationStage | null {
    if (this.currentStageIndex < 0 || this.currentStageIndex >= this.stages.length) {
      return null;
    }
    return this.stages[this.currentStageIndex];
  }

  /**
   * Get Titanic position for rendering
   * 
   * @returns Titanic x and y coordinates
   */
  getTitanicPosition(): { x: number; y: number } {
    return { x: this.titanicX, y: this.titanicY };
  }

  /**
   * Get iceberg split offset for rendering
   * 
   * @returns Split offset in pixels
   */
  getIcebergSplitOffset(): number {
    return this.icebergSplitOffset;
  }

  /**
   * Get ghost sink Y position for rendering
   * 
   * @returns Ghost sink Y coordinate
   */
  getGhostSinkY(): number {
    return this.ghostSinkY;
  }

  /**
   * Reset the animation system
   */
  reset(): void {
    this.currentStageIndex = -1;
    this.isComplete = false;
    
    for (const stage of this.stages) {
      stage.elapsed = 0;
    }

    this.titanicX = -200;
    this.titanicY = this.canvasHeight * 0.1;
    this.icebergSplitOffset = 0;
    this.ghostSinkY = 0;
  }
}
