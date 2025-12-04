/**
 * TimeoutManager class for enforce-gamestart feature
 * Manages the 15-second countdown timer before game start
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

export class TimeoutManager {
  private timeRemaining: number;
  private isActive: boolean;
  private hasTriggered: boolean;
  private readonly timeoutDuration: number;

  /**
   * Create a new TimeoutManager
   * Requirement 1.1: Initialize timer to specified duration
   * 
   * @param timeoutDuration - Duration in seconds before timeout triggers
   */
  constructor(timeoutDuration: number) {
    this.timeoutDuration = timeoutDuration;
    this.timeRemaining = timeoutDuration;
    this.isActive = false;
    this.hasTriggered = false;
  }

  /**
   * Start the timeout timer
   * Requirement 1.2: Begin countdown
   */
  start(): void {
    this.isActive = true;
    this.hasTriggered = false;
  }

  /**
   * Stop the timeout timer
   * Requirement 1.4: Cancel timer when game starts
   */
  stop(): void {
    this.isActive = false;
  }

  /**
   * Reset the timeout timer to initial duration
   * Requirement 4.3: Reinitialize timer on restart
   */
  reset(): void {
    this.timeRemaining = this.timeoutDuration;
    this.isActive = false;
    this.hasTriggered = false;
  }

  /**
   * Update the timer with elapsed time
   * Requirement 1.2: Decrement timer continuously
   * Requirement 1.3: Trigger timeout when timer reaches zero
   * 
   * @param deltaTime - Time elapsed since last update in seconds
   * @returns true if timeout was triggered this update
   */
  update(deltaTime: number): boolean {
    if (!this.isActive || this.hasTriggered) {
      return false;
    }

    // Decrement timer
    this.timeRemaining -= deltaTime;

    // Clamp to minimum of 0 to prevent negative values
    if (this.timeRemaining < 0) {
      this.timeRemaining = 0;
    }

    // Check if timeout triggered
    if (this.timeRemaining <= 0 && !this.hasTriggered) {
      this.hasTriggered = true;
      this.isActive = false;
      return true;
    }

    return false;
  }

  /**
   * Get the remaining time on the timer
   * 
   * @returns Time remaining in seconds
   */
  getTimeRemaining(): number {
    return this.timeRemaining;
  }

  /**
   * Check if timeout has been triggered
   * 
   * @returns true if timeout has triggered
   */
  isTimedOut(): boolean {
    return this.hasTriggered;
  }

  /**
   * Check if timer is currently active
   * 
   * @returns true if timer is counting down
   */
  isTimerActive(): boolean {
    return this.isActive;
  }
}
