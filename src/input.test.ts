/**
 * Unit tests for InputHandler
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { InputHandler } from './input';

describe('InputHandler', () => {
  let inputHandler: InputHandler;

  beforeEach(() => {
    inputHandler = new InputHandler();
    inputHandler.initialize();
  });

  afterEach(() => {
    inputHandler.cleanup();
  });

  it('should initialize with no keys pressed', () => {
    expect(inputHandler.isKeyPressed('ArrowLeft')).toBe(false);
    expect(inputHandler.isKeyPressed('ArrowRight')).toBe(false);
    expect(inputHandler.getActiveDirection()).toBe(null);
  });

  it('should track left arrow key press', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);

    expect(inputHandler.isKeyPressed('ArrowLeft')).toBe(true);
    expect(inputHandler.getActiveDirection()).toBe('left');
  });

  it('should track right arrow key press', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(event);

    expect(inputHandler.isKeyPressed('ArrowRight')).toBe(true);
    expect(inputHandler.getActiveDirection()).toBe('right');
  });

  it('should track key release', () => {
    // Press left arrow
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(inputHandler.isKeyPressed('ArrowLeft')).toBe(true);

    // Release left arrow
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    expect(inputHandler.isKeyPressed('ArrowLeft')).toBe(false);
    expect(inputHandler.getActiveDirection()).toBe(null);
  });

  it('should handle simultaneous key presses with priority to most recent', () => {
    // Press left arrow first
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(inputHandler.getActiveDirection()).toBe('left');

    // Press right arrow while left is held (most recent takes priority)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(inputHandler.getActiveDirection()).toBe('right');
    expect(inputHandler.isKeyPressed('ArrowLeft')).toBe(true);
    expect(inputHandler.isKeyPressed('ArrowRight')).toBe(true);
  });

  it('should switch to other key when active key is released during simultaneous press', () => {
    // Press left arrow
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    // Press right arrow (becomes active)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(inputHandler.getActiveDirection()).toBe('right');

    // Release right arrow (should switch back to left)
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    expect(inputHandler.getActiveDirection()).toBe('left');
    expect(inputHandler.isKeyPressed('ArrowLeft')).toBe(true);
    expect(inputHandler.isKeyPressed('ArrowRight')).toBe(false);
  });

  it('should ignore non-arrow keys', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));

    expect(inputHandler.getActiveDirection()).toBe(null);
  });

  it('should not change direction on repeated keydown of same key', () => {
    // Press left arrow
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(inputHandler.getActiveDirection()).toBe('left');

    // Press left arrow again (simulating key repeat)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(inputHandler.getActiveDirection()).toBe('left');
  });
});
