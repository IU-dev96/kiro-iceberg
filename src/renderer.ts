/**
 * Scene rendering system for Tip of the Iceberg game
 * Handles drawing the iceberg background and ghost character
 * Requirements: 1.1, 1.2, 6.1, 6.2, 7.3, 8.3, 8.4, 8.5, 9.2, 9.3
 */

import { GhostCharacter, Trapdoor, Chalice, Particle, Obstacle, Door, SeaCreature } from './models';

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
  drawBackground(context: CanvasRenderingContext2D, _level: number): void {
    const width = this.canvasWidth;
    const height = this.canvasHeight;

    // Water gradient (underwater for all levels)
    const waterGradient = context.createLinearGradient(0, 0, 0, height);
    waterGradient.addColorStop(0, '#4682B4'); // Steel blue
    waterGradient.addColorStop(0.5, '#1E3A5F'); // Dark blue
    waterGradient.addColorStop(1, '#0F1F3F'); // Very dark blue

    context.fillStyle = waterGradient;
    context.fillRect(0, 0, width * 4, height); // Draw water 4x wide for scrolling

    // Draw wide iceberg platform for all game levels (1-6)
    this.drawIcebergLevel2(context, width, height);
  }

  /**
   * Draw starting area (level 0) with narrow iceberg at top
   */
  drawStartingArea(context: CanvasRenderingContext2D): void {
    const width = this.canvasWidth;
    const height = this.canvasHeight;

    // Sky gradient
    const skyGradient = context.createLinearGradient(0, 0, 0, this.waterLevel);
    skyGradient.addColorStop(0, '#87CEEB'); // Sky blue
    skyGradient.addColorStop(1, '#B0E0E6'); // Powder blue

    context.fillStyle = skyGradient;
    context.fillRect(0, 0, width, this.waterLevel);

    // Water gradient
    const waterGradient = context.createLinearGradient(0, this.waterLevel, 0, height);
    waterGradient.addColorStop(0, '#4682B4'); // Steel blue
    waterGradient.addColorStop(0.5, '#1E3A5F'); // Dark blue
    waterGradient.addColorStop(1, '#0F1F3F'); // Very dark blue

    context.fillStyle = waterGradient;
    context.fillRect(0, this.waterLevel, width, height - this.waterLevel);

    // Draw narrow iceberg at top
    this.drawIcebergLevel1(context, width);
    this.drawIcebergLevel2Original(context, width, height);
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
  private drawIcebergLevel2(context: CanvasRenderingContext2D, _width: number, height: number): void {
    const topY = this.waterLevel;
    const bottomY = height;
    const platformWidth = 1200;

    // Main iceberg body - trapezoid from 0 to 1200 at bottom
    context.fillStyle = 'rgba(224, 242, 247, 0.7)';
    context.beginPath();
    context.moveTo(200, topY); // Narrower at top (200px to 1000px = 800px wide)
    context.lineTo(1000, topY);
    context.lineTo(platformWidth, bottomY); // Wider at bottom (0 to 1200 = 1200px wide)
    context.lineTo(0, bottomY);
    context.closePath();
    context.fill();

    // Add shading on right side
    context.fillStyle = 'rgba(184, 216, 224, 0.5)';
    context.beginPath();
    context.moveTo(600, topY); // Middle of top edge
    context.lineTo(1000, topY);
    context.lineTo(platformWidth, bottomY);
    context.lineTo(600, bottomY);
    context.closePath();
    context.fill();
  }

  /**
   * Draw original narrow iceberg for starting area
   */
  private drawIcebergLevel2Original(context: CanvasRenderingContext2D, width: number, height: number): void {
    const centerX = width / 2;
    const topY = this.waterLevel;
    const bottomY = height;

    // Main iceberg body (narrow trapezoid)
    context.fillStyle = 'rgba(224, 242, 247, 0.7)';
    context.beginPath();
    context.moveTo(centerX - width * 0.25, topY);
    context.lineTo(centerX + width * 0.25, topY);
    context.lineTo(centerX + width * 0.4, bottomY);
    context.lineTo(centerX - width * 0.4, bottomY);
    context.closePath();
    context.fill();

    // Add shading on right side (the split/shadow effect)
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
   * Apply Y-axis rotation based on animation state
   * 
   * @param context - The canvas rendering context
   * @param character - The ghost character to draw
   */
  drawCharacter(context: CanvasRenderingContext2D, character: GhostCharacter): void {
    context.save();

    // Apply Y-axis rotation for smooth direction change animation
    const rotationY = character.getRotationY();
    const centerX = character.x + character.width / 2;
    const centerY = character.y + character.height / 2;
    
    // Translate to center, apply rotation via X-axis scaling, translate back
    context.translate(centerX, centerY);
    context.scale(Math.cos(rotationY), 1); // Y-axis rotation effect
    context.translate(-centerX, -centerY);

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

    // Restore canvas context state
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

  /**
   * Draw an obstacle
   * Requirement 3.4: Display obstacles with distinct visual appearance
   * 
   * @param context - The canvas rendering context
   * @param obstacle - The obstacle to draw
   */
  drawObstacle(context: CanvasRenderingContext2D, obstacle: Obstacle): void {
    context.save();

    // Draw obstacle body
    context.fillStyle = '#8B7355'; // Brown/tan color
    context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Add border
    context.strokeStyle = '#654321';
    context.lineWidth = 2;
    context.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Add texture lines
    context.strokeStyle = '#A0826D';
    context.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      const y = obstacle.y + (obstacle.height / 3) * i;
      context.beginPath();
      context.moveTo(obstacle.x, y);
      context.lineTo(obstacle.x + obstacle.width, y);
      context.stroke();
    }

    context.restore();
  }

  /**
   * Draw a door
   * Requirements: 4.2, 4.4: Display door with distinct visual appearance
   * 
   * @param context - The canvas rendering context
   * @param door - The door to draw
   * @param showPrompt - Whether to show interaction prompt
   */
  drawDoor(context: CanvasRenderingContext2D, door: Door, showPrompt: boolean = false): void {
    if (!door.isActive) {
      return;
    }

    context.save();

    // Draw door frame
    context.fillStyle = '#8B4513'; // Saddle brown
    context.fillRect(door.x, door.y, door.width, door.height);

    // Draw door panels
    context.strokeStyle = '#654321';
    context.lineWidth = 3;
    
    // Vertical center line
    context.beginPath();
    context.moveTo(door.x + door.width / 2, door.y + 5);
    context.lineTo(door.x + door.width / 2, door.y + door.height - 5);
    context.stroke();

    // Horizontal line
    context.beginPath();
    context.moveTo(door.x + 5, door.y + door.height / 2);
    context.lineTo(door.x + door.width - 5, door.y + door.height / 2);
    context.stroke();

    // Draw door knob
    context.fillStyle = '#FFD700'; // Gold
    context.beginPath();
    context.arc(door.x + door.width * 0.7, door.y + door.height / 2, 5, 0, Math.PI * 2);
    context.fill();

    // Show interaction prompt if near
    if (showPrompt) {
      context.fillStyle = 'rgba(255, 255, 255, 0.9)';
      context.font = '14px Arial';
      context.textAlign = 'center';
      context.fillText('Press ENTER', door.x + door.width / 2, door.y - 10);
    }

    context.restore();
  }

  /**
   * Draw sea creatures
   * Requirement 9.1: Display sea creatures outside boundaries
   * 
   * @param context - The canvas rendering context
   * @param seaCreatures - Array of sea creatures
   */
  drawSeaCreatures(context: CanvasRenderingContext2D, seaCreatures: SeaCreature[]): void {
    for (const creature of seaCreatures) {
      creature.draw(context);
    }
  }

  /**
   * Draw level banner
   * Requirements: 1.1, 1.2: Display level number prominently
   * 
   * @param context - The canvas rendering context
   * @param level - Current level number
   */
  drawLevelBanner(context: CanvasRenderingContext2D, level: number): void {
    context.save();

    // Draw banner background
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(10, 10, 120, 40);

    // Draw border
    context.strokeStyle = '#FFD700';
    context.lineWidth = 2;
    context.strokeRect(10, 10, 120, 40);

    // Draw level text
    context.fillStyle = '#FFFFFF';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`Level ${level}`, 70, 30);

    context.restore();
  }

  /**
   * Draw ground line
   * Helper method to visualize the ground
   * 
   * @param context - The canvas rendering context
   * @param groundY - Y coordinate of ground
   */
  drawGround(context: CanvasRenderingContext2D, groundY: number): void {
    context.save();
    
    const platformWidth = 1200; // Platform width: 1200px
    
    context.strokeStyle = '#654321';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(0, groundY);
    context.lineTo(platformWidth, groundY);
    context.stroke();

    context.restore();
  }

  /**
   * Draw the Titanic ship
   * Requirement 2.1: Display Titanic moving toward iceberg
   * Requirement 2.2: Render Titanic with four chimneys
   * 
   * @param context - The canvas rendering context
   * @param x - X position of the Titanic
   * @param y - Y position of the Titanic
   */
  drawTitanic(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.save();

    // Draw ship hull (wider to accommodate chimneys with space)
    context.fillStyle = '#2C3E50'; // Dark gray
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 180, y);
    context.lineTo(x + 170, y + 40);
    context.lineTo(x + 10, y + 40);
    context.closePath();
    context.fill();

    // Draw ship superstructure (wider)
    context.fillStyle = '#34495E';
    context.fillRect(x + 30, y - 30, 120, 30);

    // Draw four smokestacks (chimneys) with space on both sides - Requirement 2.2
    context.fillStyle = '#E74C3C'; // Red
    const chimneyWidth = 12;
    const chimneyHeight = 20;
    const chimneySpacing = 22;
    const startX = x + 50; // More space from left edge
    
    for (let i = 0; i < 4; i++) {
      context.fillRect(startX + i * chimneySpacing, y - 50, chimneyWidth, chimneyHeight);
    }

    // Draw smoke from all four chimneys
    context.fillStyle = 'rgba(100, 100, 100, 0.5)';
    context.beginPath();
    for (let i = 0; i < 4; i++) {
      context.arc(startX + i * chimneySpacing + chimneyWidth / 2, y - 55, 6, 0, Math.PI * 2);
    }
    context.fill();

    context.restore();
  }

  /**
   * Draw explosion effect at collision point
   * Requirement 2.2: Visual effect when Titanic hits iceberg
   * 
   * @param context - The canvas rendering context
   * @param x - X position of explosion center
   * @param y - Y position of explosion center
   */
  drawExplosion(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.save();

    // Draw multiple explosion circles with varying sizes and colors
    const explosionColors = [
      { color: '#FF6B35', radius: 40, alpha: 0.8 },
      { color: '#FFA500', radius: 30, alpha: 0.7 },
      { color: '#FFD700', radius: 20, alpha: 0.6 },
      { color: '#FFFF00', radius: 10, alpha: 0.5 }
    ];

    explosionColors.forEach(({ color, radius, alpha }) => {
      context.fillStyle = color;
      context.globalAlpha = alpha;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    });

    // Draw explosion particles/debris
    context.globalAlpha = 0.9;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 50;
      const particleX = x + Math.cos(angle) * distance;
      const particleY = y + Math.sin(angle) * distance;
      
      context.fillStyle = i % 2 === 0 ? '#FF6B35' : '#FFD700';
      context.beginPath();
      context.arc(particleX, particleY, 5, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  }

  /**
   * Draw split iceberg
   * Requirement 2.3: Display iceberg splitting into two pieces
   * 
   * @param context - The canvas rendering context
   * @param splitOffset - How far apart the iceberg pieces are
   */
  drawSplitIceberg(context: CanvasRenderingContext2D, splitOffset: number): void {
    const width = this.canvasWidth;
    const centerX = width / 2;
    const topY = 0;
    const bottomY = this.waterLevel;

    context.save();

    // Left half of iceberg
    context.fillStyle = '#E0F2F7';
    context.beginPath();
    context.moveTo(centerX - width * 0.15 - splitOffset, topY);
    context.lineTo(centerX - splitOffset, topY);
    context.lineTo(centerX - splitOffset, bottomY);
    context.lineTo(centerX - width * 0.25 - splitOffset, bottomY);
    context.closePath();
    context.fill();

    // Right half of iceberg
    context.fillStyle = '#E0F2F7';
    context.beginPath();
    context.moveTo(centerX + splitOffset, topY);
    context.lineTo(centerX + width * 0.15 + splitOffset, topY);
    context.lineTo(centerX + width * 0.25 + splitOffset, bottomY);
    context.lineTo(centerX + splitOffset, bottomY);
    context.closePath();
    context.fill();

    // Add shading to both halves
    context.fillStyle = '#B8D8E0';
    
    // Left half shading
    context.beginPath();
    context.moveTo(centerX - splitOffset, topY);
    context.lineTo(centerX - splitOffset / 2, topY);
    context.lineTo(centerX - splitOffset / 2, bottomY);
    context.lineTo(centerX - splitOffset, bottomY);
    context.closePath();
    context.fill();

    // Right half shading
    context.beginPath();
    context.moveTo(centerX + splitOffset / 2, topY);
    context.lineTo(centerX + splitOffset, topY);
    context.lineTo(centerX + splitOffset, bottomY);
    context.lineTo(centerX + splitOffset / 2, bottomY);
    context.closePath();
    context.fill();

    context.restore();
  }

  /**
   * Draw sinking ghost
   * Requirement 2.4: Display ghost sinking to bottom
   * 
   * @param context - The canvas rendering context
   * @param character - The ghost character
   * @param sinkY - Additional Y offset for sinking animation
   */
  drawSinkingGhost(context: CanvasRenderingContext2D, character: GhostCharacter, sinkY: number): void {
    context.save();

    // Calculate fade based on sink progress
    const sinkProgress = sinkY / this.canvasHeight;
    const alpha = 1 - sinkProgress * 0.7; // Fade to 30% opacity

    context.globalAlpha = alpha;

    // Draw character at original position + sink offset
    const originalY = character.y;
    character.y = originalY + sinkY;
    this.drawCharacter(context, character);
    character.y = originalY; // Restore original position

    context.restore();
  }

  /**
   * Draw countdown timer
   * Requirement 1.2: Display remaining time before timeout
   * 
   * @param context - The canvas rendering context
   * @param timeRemaining - Time remaining in seconds
   */
  drawCountdown(context: CanvasRenderingContext2D, timeRemaining: number): void {
    context.save();

    // Format time as seconds with one decimal place
    const displayTime = Math.max(0, timeRemaining).toFixed(1);
    
    // Determine color based on urgency
    let textColor = '#FFFFFF'; // White
    let backgroundColor = 'rgba(0, 0, 0, 0.6)';
    
    if (timeRemaining <= 2) {
      textColor = '#FF4444'; // Red for urgent
      backgroundColor = 'rgba(255, 68, 68, 0.2)';
    } else if (timeRemaining <= 3) {
      textColor = '#FFA500'; // Orange for warning
      backgroundColor = 'rgba(255, 165, 0, 0.2)';
    }

    // Draw background box - positioned at top right
    const boxWidth = 200;
    const boxHeight = 60;
    const boxX = this.canvasWidth - boxWidth - 20; // 20px from right edge
    const boxY = 20;

    context.fillStyle = backgroundColor;
    context.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Draw border
    context.strokeStyle = textColor;
    context.lineWidth = 2;
    context.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Draw countdown text
    context.fillStyle = textColor;
    context.font = 'bold 36px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(displayTime, boxX + boxWidth / 2, boxY + boxHeight / 2);

    // Draw label
    context.font = '12px Arial';
    context.fillStyle = '#CCCCCC';
    context.fillText('Titanic arrives in', boxX + boxWidth / 2, boxY + 12);

    context.restore();
  }

  /**
   * Draw timeout game over screen
   * Requirements: 3.2, 4.1: Display game over with restart prompt
   * 
   * @param context - The canvas rendering context
   */
  drawTimeoutGameOver(context: CanvasRenderingContext2D): void {
    context.save();

    // Semi-transparent overlay
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // "Time's Up!" text
    context.fillStyle = '#FF6B6B'; // Red
    context.font = 'bold 72px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText("Time's Up!", this.canvasWidth / 2, this.canvasHeight / 2 - 40);

    // Outline
    context.strokeStyle = '#FFF';
    context.lineWidth = 3;
    context.strokeText("Time's Up!", this.canvasWidth / 2, this.canvasHeight / 2 - 40);

    // Restart prompt
    context.fillStyle = '#FFFFFF';
    context.font = '28px Arial';
    context.fillText('Press ENTER to restart', this.canvasWidth / 2, this.canvasHeight / 2 + 40);

    context.restore();
  }
}

