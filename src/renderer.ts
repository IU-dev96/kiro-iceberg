/**
 * Scene rendering system for Tip of the Iceberg game
 * Handles drawing the iceberg background and ghost character
 * Requirements: 1.1, 1.2, 6.1, 6.2, 7.3, 8.3, 8.4, 8.5, 9.2, 9.3
 */

import { GhostCharacter, Trapdoor, Chalice, Particle } from './models';

/**
 * SceneRenderer class manages all drawing operations for the game
 * Renders the iceberg background and ghost character with proper visual properties
 */
export class SceneRenderer {
  private canvasWidth: number;
  private canvasHeight: number;
  private waterLevel: number;
  private ghostImage: HTMLImageElement | null;
  private imageLoaded: boolean;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.waterLevel = canvasHeight * 0.1; // 10% above water
    this.ghostImage = null;
    this.imageLoaded = false;
    
    // Load the Kiro ghost icon
    this.loadGhostImage();
  }

  /**
   * Load the ghost SVG image
   */
  private loadGhostImage(): void {
    this.ghostImage = new Image();
    this.ghostImage.onload = () => {
      this.imageLoaded = true;
    };
    this.ghostImage.onerror = () => {
      console.warn('Failed to load ghost image, will use fallback rendering');
      this.imageLoaded = false;
    };
    this.ghostImage.src = 'https://kiro.dev/icon.svg?fe599162bb293ea0';
  }

  /**
   * Draw the iceberg background scene with gradient and shapes
   * Requirement 1.1: Display the Iceberg Scene as the background
   * Requirement 6.1, 6.2: 10% above water, 90% below
   * 
   * @param context - The canvas rendering context
   * @param level - Current game level
   */
  drawBackground(context: CanvasRenderingContext2D, level: number): void {
    const width = this.canvasWidth;
    const height = this.canvasHeight;

    if (level === 1) {
      // Level 1: Above water
      // Sky gradient
      const skyGradient = context.createLinearGradient(0, 0, 0, this.waterLevel);
      skyGradient.addColorStop(0, '#87CEEB'); // Sky blue
      skyGradient.addColorStop(1, '#B0E0E6'); // Powder blue

      context.fillStyle = skyGradient;
      context.fillRect(0, 0, width, this.waterLevel);

      // Draw iceberg for level 1 (above water)
      this.drawIcebergLevel1(context, width);
    } else {
      // Level 2: Below water
      // Water gradient (darker for underwater)
      const waterGradient = context.createLinearGradient(0, this.waterLevel, 0, height);
      waterGradient.addColorStop(0, '#4682B4'); // Steel blue
      waterGradient.addColorStop(0.5, '#1E3A5F'); // Dark blue
      waterGradient.addColorStop(1, '#0F1F3F'); // Very dark blue

      context.fillStyle = waterGradient;
      context.fillRect(0, 0, width, height);

      // Draw iceberg for level 2 (below water)
      this.drawIcebergLevel2(context, width, height);
    }
  }

  /**
   * Draw iceberg for level 1 (above water, narrower)
   * Requirement 6.1: 10% above water
   * 
   * @param context - The canvas rendering context
   * @param width - Canvas width
   */
  private drawIcebergLevel1(context: CanvasRenderingContext2D, width: number): void {
    const centerX = width / 2;
    const topY = 0;
    const bottomY = this.waterLevel;

    // Main iceberg body (narrower at top)
    context.fillStyle = '#E0F2F7';
    context.beginPath();
    context.moveTo(centerX - width * 0.15, topY); // 30% width at top
    context.lineTo(centerX + width * 0.15, topY);
    context.lineTo(centerX + width * 0.25, bottomY); // 50% width at water
    context.lineTo(centerX - width * 0.25, bottomY);
    context.closePath();
    context.fill();

    // Add shading
    context.fillStyle = '#B8D8E0';
    context.beginPath();
    context.moveTo(centerX, topY);
    context.lineTo(centerX + width * 0.15, topY);
    context.lineTo(centerX + width * 0.25, bottomY);
    context.lineTo(centerX, bottomY);
    context.closePath();
    context.fill();
  }

  /**
   * Draw iceberg for level 2 (below water, wider)
   * Requirement 6.2: 90% below water
   * Requirement 6.3: Wider at lower depths
   * 
   * @param context - The canvas rendering context
   * @param width - Canvas width
   * @param height - Canvas height
   */
  private drawIcebergLevel2(context: CanvasRenderingContext2D, width: number, height: number): void {
    const centerX = width / 2;
    const topY = this.waterLevel;
    const bottomY = height;

    // Main iceberg body (wider at bottom)
    context.fillStyle = 'rgba(224, 242, 247, 0.7)'; // Semi-transparent for underwater
    context.beginPath();
    context.moveTo(centerX - width * 0.25, topY); // 50% width at water level
    context.lineTo(centerX + width * 0.25, topY);
    context.lineTo(centerX + width * 0.4, bottomY); // 80% width at bottom
    context.lineTo(centerX - width * 0.4, bottomY);
    context.closePath();
    context.fill();

    // Add shading
    context.fillStyle = 'rgba(184, 216, 224, 0.5)';
    context.beginPath();
    context.moveTo(centerX, topY);
    context.lineTo(centerX + width * 0.25, topY);
    context.lineTo(centerX + width * 0.4, bottomY);
    context.lineTo(centerX, bottomY);
    context.closePath();
    context.fill();
  }

  /**
   * Draw the ghost character with visual properties
   * Requirement 1.2: Show the Ghost Character with distinct visual appearance
   * Requirements 3.1, 3.2, 3.3, 3.4: Apply horizontal flipping based on facing direction
   * 
   * @param context - The canvas rendering context
   * @param character - The ghost character to draw
   */
  drawCharacter(context: CanvasRenderingContext2D, character: GhostCharacter): void {
    context.save();

    // Apply horizontal flip if facing left (Requirements 3.1, 3.2)
    const facingDirection = character.getFacingDirection();
    if (facingDirection === 'left') {
      // Flip horizontally: translate to character position, scale -1 on x-axis, then offset
      context.translate(character.x + character.width, character.y);
      context.scale(-1, 1);
      context.translate(-character.x, -character.y);
    }

    if (this.imageLoaded && this.ghostImage) {
      // Draw the Kiro ghost icon
      context.drawImage(
        this.ghostImage,
        character.x,
        character.y,
        character.width,
        character.height
      );
    } else {
      // Fallback: Draw simple ghost shape
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
    }

    // Restore canvas context state (Requirement 3.4)
    context.restore();
  }

  /**
   * Draw the trapdoor on the floor
   * Requirement 7.3: Display trapdoor with distinct visual appearance
   * 
   * @param context - The canvas rendering context
   * @param trapdoor - The trapdoor to draw
   */
  drawTrapdoor(context: CanvasRenderingContext2D, trapdoor: Trapdoor): void {
    if (!trapdoor.isActive) {
      return;
    }

    context.save();

    // Draw trapdoor frame
    context.fillStyle = '#8B4513'; // Brown
    context.fillRect(trapdoor.x, trapdoor.y, trapdoor.width, trapdoor.height);

    // Draw hatch lines
    context.strokeStyle = '#654321'; // Dark brown
    context.lineWidth = 2;
    
    // Vertical line in middle
    context.beginPath();
    context.moveTo(trapdoor.x + trapdoor.width / 2, trapdoor.y);
    context.lineTo(trapdoor.x + trapdoor.width / 2, trapdoor.y + trapdoor.height);
    context.stroke();

    // Horizontal lines
    for (let i = 1; i < 3; i++) {
      context.beginPath();
      const y = trapdoor.y + (trapdoor.height / 3) * i;
      context.moveTo(trapdoor.x, y);
      context.lineTo(trapdoor.x + trapdoor.width, y);
      context.stroke();
    }

    // Draw handle
    context.fillStyle = '#FFD700'; // Gold
    const handleX = trapdoor.x + trapdoor.width / 2;
    const handleY = trapdoor.y + trapdoor.height / 2;
    context.beginPath();
    context.arc(handleX, handleY, 4, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  /**
   * Draw the chalice
   * Requirement 8.5: Display chalice with distinct visual appearance
   * 
   * @param context - The canvas rendering context
   * @param chalice - The chalice to draw
   */
  drawChalice(context: CanvasRenderingContext2D, chalice: Chalice): void {
    if (chalice.collected) {
      return;
    }

    context.save();

    const centerX = chalice.x + chalice.width / 2;
    const topY = chalice.y;
    const bottomY = chalice.y + chalice.height;

    // Draw chalice cup (golden)
    context.fillStyle = '#FFD700'; // Gold
    context.beginPath();
    context.moveTo(centerX - chalice.width * 0.4, topY);
    context.lineTo(centerX + chalice.width * 0.4, topY);
    context.lineTo(centerX + chalice.width * 0.3, topY + chalice.height * 0.6);
    context.lineTo(centerX - chalice.width * 0.3, topY + chalice.height * 0.6);
    context.closePath();
    context.fill();

    // Draw stem
    context.fillRect(
      centerX - chalice.width * 0.1,
      topY + chalice.height * 0.6,
      chalice.width * 0.2,
      chalice.height * 0.25
    );

    // Draw base
    context.beginPath();
    context.ellipse(
      centerX,
      bottomY - chalice.height * 0.05,
      chalice.width * 0.35,
      chalice.height * 0.1,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    // Add shine effect
    context.fillStyle = '#FFED4E'; // Lighter gold
    context.beginPath();
    context.ellipse(
      centerX - chalice.width * 0.15,
      topY + chalice.height * 0.2,
      chalice.width * 0.1,
      chalice.height * 0.15,
      0,
      0,
      Math.PI * 2
    );
    context.fill();

    context.restore();
  }

  /**
   * Draw fireworks particles
   * Requirement 8.3: Display fireworks animation
   * 
   * @param context - The canvas rendering context
   * @param particles - Array of particles
   */
  drawFireworks(context: CanvasRenderingContext2D, particles: Particle[]): void {
    context.save();

    for (const particle of particles) {
      const alpha = particle.life / particle.maxLife;
      context.fillStyle = particle.color;
      context.globalAlpha = alpha;
      
      context.beginPath();
      context.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
    context.restore();
  }

  /**
   * Draw win screen
   * Requirement 8.4: Display "You Win" text
   * 
   * @param context - The canvas rendering context
   */
  drawWinScreen(context: CanvasRenderingContext2D): void {
    context.save();

    // Semi-transparent overlay
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // "You Win" text
    context.fillStyle = '#FFD700'; // Gold
    context.font = 'bold 72px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('You Win!', this.canvasWidth / 2, this.canvasHeight / 2);

    // Outline
    context.strokeStyle = '#FFF';
    context.lineWidth = 3;
    context.strokeText('You Win!', this.canvasWidth / 2, this.canvasHeight / 2);

    context.restore();
  }

  /**
   * Draw lose screen
   * Requirement 9.3: Display "Game Over" text
   * 
   * @param context - The canvas rendering context
   */
  drawLoseScreen(context: CanvasRenderingContext2D): void {
    context.save();

    // Semi-transparent overlay
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // "Game Over" text
    context.fillStyle = '#FF4444'; // Red
    context.font = 'bold 72px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Game Over', this.canvasWidth / 2, this.canvasHeight / 2);

    // Subtitle
    context.fillStyle = '#FFF';
    context.font = '24px Arial';
    context.fillText('You drowned!', this.canvasWidth / 2, this.canvasHeight / 2 + 60);

    context.restore();
  }
}
