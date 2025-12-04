# Design Document: Shark Image Sprite

## Overview

This design enhances the `SeaCreature` class to render sharks using an actual image sprite instead of geometric shapes. The implementation will load a shark image from a remote URL, cache it for performance, and apply horizontal flipping based on the shark's movement direction. The design maintains backward compatibility with existing fish rendering and includes graceful fallback handling.

## Architecture

The enhancement will be contained within the existing `SeaCreature` class in `src/models.ts`. A new image loading mechanism will be added to handle asynchronous image loading without blocking game initialization. The rendering logic will be updated to conditionally use image rendering for sharks while preserving geometric rendering for fish.

### Key Components

1. **Image Asset Manager**: A simple singleton or module-level mechanism to load and cache the shark image
2. **SeaCreature Rendering**: Enhanced `draw()` method with conditional rendering logic
3. **Canvas Transformation**: Horizontal flip transformation for right-facing sharks

## Components and Interfaces

### Image Loading

```typescript
// Module-level image cache
let sharkImage: HTMLImageElement | null = null;
let sharkImageLoaded: boolean = false;
let sharkImageError: boolean = false;

// Image loading function
function loadSharkImage(): void {
  if (sharkImage) return; // Already loading or loaded
  
  sharkImage = new Image();
  sharkImage.crossOrigin = 'anonymous'; // Enable CORS
  sharkImage.onload = () => {
    sharkImageLoaded = true;
  };
  sharkImage.onerror = () => {
    sharkImageError = true;
    console.warn('Failed to load shark image, using fallback rendering');
  };
  sharkImage.src = 'https://gallery.yopriceville.com/downloadfullsize/send/15086';
}
```

### SeaCreature Class Enhancement

The `SeaCreature.draw()` method will be updated to:

1. Check if the creature type is 'shark'
2. If shark and image is loaded, use image rendering
3. If shark and image failed or not loaded, use fallback geometric rendering
4. If fish, use existing geometric rendering

```typescript
draw(context: CanvasRenderingContext2D): void {
  // For sharks, try to use image rendering
  if (this.type === 'shark' && sharkImageLoaded && sharkImage) {
    this.drawSharkImage(context);
  } else {
    // Fallback to geometric rendering
    this.drawGeometric(context);
  }
}

private drawSharkImage(context: CanvasRenderingContext2D): void {
  context.save();
  
  // Apply horizontal flip for right-facing sharks
  if (this.direction === 'right') {
    context.translate(this.x + this.width, this.y);
    context.scale(-1, 1);
    context.drawImage(sharkImage!, 0, 0, this.width, this.height);
  } else {
    // Left-facing (original orientation)
    context.drawImage(sharkImage!, this.x, this.y, this.width, this.height);
  }
  
  context.restore();
}

private drawGeometric(context: CanvasRenderingContext2D): void {
  // Existing geometric rendering code
  // ... (current implementation)
}
```

## Data Models

No changes to existing data models are required. The `SeaCreature` class already has all necessary properties:
- `type`: Identifies whether it's a shark or fish
- `direction`: Indicates movement direction ('left' or 'right')
- `x, y, width, height`: Position and dimensions for rendering

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Shark image flip matches direction
*For any* shark creature with a loaded image, when the direction is 'left', the canvas should not apply horizontal flip, and when the direction is 'right', the canvas should apply a horizontal flip (scale -1, 1)
**Validates: Requirements 1.2, 1.3, 2.4**

### Property 2: Shark dimensions are preserved
*For any* shark creature at any level, the dimensions passed to the image rendering should match the calculated width and height based on the level formula
**Validates: Requirements 1.4, 2.3**

### Property 3: Fish use geometric rendering
*For any* sea creature of type 'small-fish' or 'large-fish', the rendering should use geometric shapes (ellipse and triangle) rather than image rendering
**Validates: Requirements 2.2**

## Error Handling

### Image Loading Failures

The system will handle image loading failures gracefully:

1. **Network Errors**: If the image fails to load due to network issues, CORS problems, or invalid URL, the `onerror` handler will set `sharkImageError = true`
2. **Fallback Rendering**: When `sharkImageError` is true or `sharkImageLoaded` is false, the system will use the existing geometric shape rendering
3. **No Game Blocking**: Image loading is asynchronous and non-blocking. The game will initialize and run normally even if the image hasn't loaded yet
4. **Console Warning**: A warning will be logged to help developers identify image loading issues

### CORS Considerations

The image will be loaded with `crossOrigin = 'anonymous'` to enable proper canvas rendering. If the remote server doesn't support CORS, the fallback rendering will be used.

## Testing Strategy

### Unit Tests

Unit tests will verify:
- Image loading function creates an HTMLImageElement with correct properties
- Fallback rendering is used when image is not loaded or failed
- Canvas context methods are called correctly for both image and geometric rendering
- Specific examples: left-facing shark, right-facing shark, fallback scenario

### Property-Based Tests

Property-based tests will verify universal properties using **fast-check** (JavaScript/TypeScript property testing library):

- **Property 1**: For any shark with any direction, the flip transformation matches the direction
- **Property 2**: For any shark at any level (5+), dimensions are correctly preserved in rendering
- **Property 3**: For any fish type, geometric rendering is used

Each property-based test will:
- Run a minimum of 100 iterations
- Be tagged with a comment referencing the correctness property: `// Feature: shark-image-sprite, Property X: [property text]`
- Generate random test data (levels, directions, positions) to verify properties hold universally

### Testing Approach

Tests will use a mock canvas context to verify rendering calls without requiring a real DOM environment. The mock will track:
- `drawImage()` calls with parameters
- `save()` and `restore()` calls
- `translate()` and `scale()` transformations
- Geometric drawing calls (ellipse, beginPath, etc.)

## Implementation Notes

### Initialization

The `loadSharkImage()` function should be called early in the game initialization, ideally when the game engine starts or when the first level is loaded. This ensures the image has time to load before sharks appear (level 5+).

### Performance

- The image is loaded once and cached in memory
- No repeated network requests
- Canvas transformations (translate, scale) are lightweight operations
- The `save()` and `restore()` calls ensure transformations don't affect other rendering

### Future Enhancements

This design can be extended to:
- Add image sprites for fish types
- Support animated sprite sheets
- Add multiple shark variations
- Implement a more robust asset loading system
