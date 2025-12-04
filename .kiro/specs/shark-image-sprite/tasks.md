# Implementation Plan

- [x] 1. Add image loading infrastructure to models.ts
  - Add module-level variables for shark image state (sharkImage, sharkImageLoaded, sharkImageError)
  - Implement loadSharkImage() function with CORS support and error handling
  - Add image onload and onerror handlers
  - _Requirements: 1.1, 1.5_

- [x] 2. Refactor SeaCreature draw method for conditional rendering
  - Extract existing geometric rendering into private drawGeometric() method
  - Update main draw() method to check creature type and image state
  - Preserve all existing geometric rendering for fish types
  - _Requirements: 2.1, 2.2_

- [x] 3. Implement shark image rendering with direction-aware flipping
  - Create private drawSharkImage() method in SeaCreature class
  - Implement canvas transformation for right-facing sharks (translate + scale)
  - Implement direct rendering for left-facing sharks
  - Use save/restore to isolate transformations
  - _Requirements: 1.2, 1.3, 1.4, 2.3, 2.4_

- [ ]* 3.1 Write property test for shark flip transformation
  - **Property 1: Shark image flip matches direction**
  - **Validates: Requirements 1.2, 1.3, 2.4**

- [ ]* 3.2 Write property test for dimension preservation
  - **Property 2: Shark dimensions are preserved**
  - **Validates: Requirements 1.4, 2.3**

- [ ]* 3.3 Write property test for fish geometric rendering
  - **Property 3: Fish use geometric rendering**
  - **Validates: Requirements 2.2**

- [ ]* 3.4 Write unit tests for image rendering
  - Test fallback rendering when image not loaded
  - Test fallback rendering when image load fails
  - Test left-facing shark rendering
  - Test right-facing shark rendering
  - _Requirements: 1.2, 1.3, 1.5, 2.1_

- [x] 4. Initialize image loading in game startup
  - Call loadSharkImage() during game initialization
  - Ensure non-blocking behavior
  - _Requirements: 1.1, 2.5_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
