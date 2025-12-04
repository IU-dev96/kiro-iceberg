/**
 * Scene rendering system for Tip of the Iceberg game
 * Handles drawing the iceberg background and ghost character
 * Requirements: 1.1, 1.2
 */

import { GhostCharacter } from './models';

/**
 * SceneRenderer class manages all drawing operations for the game
 * Renders the iceberg background and ghost character with proper visual properties
 */
export class SceneRenderer {
  /**
   * Draw the iceberg background scene with gradient and shapes
   * Requirement 1.1: Display the Iceberg Scene as the background
   * 
   * @param context - The canvas rendering context
   */
  drawBackground(context: CanvasRenderingContext2D): void {
    const canvas = context.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Create sky gradient (top to middle)
    const skyGradient = context.createLinearGradient(0, 0, 0, height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB'); // Sky blue
    skyGradient.addColorStop(1, '#B0E0E6'); // Powder blue

    context.fillStyle = skyGradient;
    context.fillRect(0, 0, width, height * 0.6);

    // Create water gradient (middle to bottom)
    const waterGradient = context.createLinearGradient(0, height * 0.6, 0, height);
    waterGradient.addColorStop(0, '#4682B4'); // Steel blue
    waterGradient.addColorStop(1, '#1E3A5F'); // Dark blue

    context.fillStyle = waterGradient;
    context.fillRect(0, height * 0.6, width, height * 0.4);

    // Draw iceberg shape
    this.drawIceberg(context, width, height);
  }

  /**
   * Draw the iceberg shape with geometric forms
   * 
   * @param context - The canvas rendering context
   * @param width - Canvas width
   * @param height - Canvas height
   */
  private drawIceberg(
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const icebergTop = height * 0.5;
    const icebergBottom = height * 0.7;

    // Main iceberg body (above water)
    context.fillStyle = '#E0F2F7';
    context.beginPath();
    context.moveTo(width * 0.3, icebergTop);
    context.lineTo(width * 0.5, icebergTop - height * 0.15);
    context.lineTo(width * 0.7, icebergTop);
    context.lineTo(width * 0.65, icebergBottom);
    context.lineTo(width * 0.35, icebergBottom);
    context.closePath();
    context.fill();

    // Add shading to iceberg
    context.fillStyle = '#B8D8E0';
    context.beginPath();
    context.moveTo(width * 0.5, icebergTop - height * 0.15);
    context.lineTo(width * 0.7, icebergTop);
    context.lineTo(width * 0.65, icebergBottom);
    context.lineTo(width * 0.5, icebergBottom - height * 0.05);
    context.closePath();
    context.fill();

    // Underwater portion (subtle)
    context.fillStyle = 'rgba(176, 224, 230, 0.3)';
    context.beginPath();
    context.moveTo(width * 0.35, icebergBottom);
    context.lineTo(width * 0.65, icebergBottom);
    context.lineTo(width * 0.6, height * 0.85);
    context.lineTo(width * 0.4, height * 0.85);
    context.closePath();
    context.fill();
  }

  /**
   * Draw the ghost character with visual properties
   * Requirement 1.2: Show the Ghost Character with distinct visual appearance
   * 
   * @param context - The canvas rendering context
   * @param character - The ghost character to draw
   */
  drawCharacter(context: CanvasRenderingContext2D, character: GhostCharacter): void {
    // Save context state
    context.save();

    // Draw ghost body (rounded shape)
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.beginPath();
    
    // Top rounded part (head)
    const centerX = character.x + character.width / 2;
    const topY = character.y;
    const radius = character.width / 2;
    
    context.arc(centerX, topY + radius, radius, Math.PI, 0, false);
    
    // Body rectangle
    context.rect(character.x, topY + radius, character.width, character.height - radius);
    
    context.fill();

    // Draw wavy bottom edge
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.beginPath();
    const bottomY = character.y + character.height;
    const waveCount = 3;
    const waveWidth = character.width / waveCount;
    
    context.moveTo(character.x, bottomY - 5);
    for (let i = 0; i < waveCount; i++) {
      const x = character.x + i * waveWidth;
      context.quadraticCurveTo(
        x + waveWidth / 2,
        bottomY + 5,
        x + waveWidth,
        bottomY - 5
      );
    }
    context.lineTo(character.x + character.width, bottomY - 10);
    context.lineTo(character.x, bottomY - 10);
    context.closePath();
    context.fill();

    // Draw eyes
    const eyeRadius = character.width * 0.08;
    const eyeY = character.y + character.height * 0.3;
    const eyeOffset = character.width * 0.25;

    // Left eye
    context.fillStyle = '#000000';
    context.beginPath();
    context.arc(centerX - eyeOffset, eyeY, eyeRadius, 0, Math.PI * 2);
    context.fill();

    // Right eye
    context.beginPath();
    context.arc(centerX + eyeOffset, eyeY, eyeRadius, 0, Math.PI * 2);
    context.fill();

    // Draw subtle glow effect
    context.strokeStyle = 'rgba(200, 220, 255, 0.5)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(centerX, topY + radius, radius + 2, Math.PI, 0, false);
    context.stroke();

    // Restore context state
    context.restore();
  }
}
