# Gallery Window Interaction Documentation

This document outlines the flow and dependencies for the gallery window system, focusing on window opening, dragging, and zoom functionality.

## Component Flow

1. **DynamicGalleryPage** (`src/Pages/DynamicGallery.jsx`)
   - Entry point for the gallery system
   - Wraps gallery content in `WindowProvider` for window management
   - Processes and prepares image data for the Gallery component

2. **Gallery Component** (`src/components/gallery/index.jsx`)
   - Displays grid of image thumbnails
   - Handles window creation and management
   - Key functions:
     - `handleOpenWindow`: Creates new windows with random positions
     - `GalleryWindow`: Renders individual image windows

## Window Management

### Window Creation Flow
1. User clicks thumbnail in gallery grid
2. `handleOpenWindow` is called with unique window ID
3. Window position is calculated based on:
   - Random x,y coordinates within viewport
   - Current canvas scale (for zoom adjustment)
4. Window is registered via `registerWindow` from WindowContext
5. Window becomes active and visible

### Window Component Structure (`src/components/window/wrapper/index.jsx`)
- `WindowWrapper`: Main container component
- `WindowContent`: Handles window rendering and interactions
- Features:
  - Automatic window registration
  - Position management
  - Z-index handling for window stacking
  - Drag interaction setup

## Drag Implementation

### DndKit Integration (`src/components/window/wrapper/DndKit.jsx`)

The application uses `@dnd-kit/core` for advanced drag and drop functionality, with custom scaling support:

#### Window Drag Implementation
The drag system uses DndKit's built-in scaling capabilities through modifiers to handle zoom-aware dragging:

```javascript
// DndKit context with zoom scaling
<DndContext 
  onDragEnd={onDragEnd}
  modifiers={[
    ({ transform }) => ({
      ...transform,
      x: transform.x / scale,
      y: transform.y / scale,
    })
  ]}
>
  <div ref={setNodeRef}>
    {/* Header with separated drag and control areas */}
    <div className="flex items-center justify-between w-full">
      {/* Title area - Draggable */}
      <div {...attributes} {...listeners} className={headerClassName}>
        {title}
      </div>
      {/* Controls area - Independent interaction */}
      <button onClick={onClose} className="window-control">
        ×
      </button>
    </div>
    
    {/* Content - Protected from drag events */}
    <div className="pointer-events-auto">
      {content}
    </div>
  </div>
</DndContext>
```

Key Features:
- Native scale-aware dragging through DndKit's modifier system
- Real-time cursor following during drag operations
- Proper scaling of final positions on drag end
- Separated drag and control areas in window header
  - Title area handles dragging
  - Control area (close button) operates independently
- Protected content area for normal interaction

Components:
1. **DragProvider**
   - Wraps content in DndKit context
   - Provides zoom scaling through modifiers
   - Handles scaled position updates on drag end

2. **useScaledDrag Hook**
   - Provides basic draggable functionality
   - Returns:
     - `setNodeRef`: Reference setter for draggable element
     - `attributes`: DnD attributes
     - `listeners`: Mouse/touch event listeners
     - `style`: Applied styles
     - `isDragging`: Current drag state
     - `transform`: DndKit transform values

### Base Drag Hook (`src/components/canvas/useDrag.js`)

The base `useDrag` hook provides fundamental drag functionality with mouse and touch support:

### Key Features
- Position tracking
- Start position memory
- Scale-aware movement
- Touch device support

### Main Functions
```javascript
{
  isDragging,    // Current drag state
  position,      // Current position
  setPosition,   // Position updater
  handlers: {
    onMouseDown,   // Drag initiation
    onTouchStart,  // Touch initiation
    onMouseMove,   // Movement handling
    onMouseUp      // Drag completion
  }
}
```

## Zoom Implementation

### Zoom Context (`src/components/canvas/ZoomContext.jsx`)
Provides zoom state and calculations across the application:

```javascript
const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_SENSITIVITY = 0.0005;
```

### Key Features
- Scale boundaries (0.1x to 5x)
- Position-aware zooming
- Smooth scale transitions

### Zoom Hook (`src/components/canvas/useZoom.js`)
Provides zoom functionality with mouse wheel support:
- Scale management
- Wheel event handling
- Position recalculation
- Zoom reset capability

## Dependencies and Integration

### Required Components
- WindowProvider
- ZoomProvider
- DragProvider

### Key Context Providers
1. **WindowContext**
   - Window state management
   - Position tracking
   - Visibility control

2. **ZoomContext**
   - Scale state
   - Zoom calculations
   - Boundary enforcement

### Integration Points
1. **Window Wrapper**
   - Connects drag functionality
   - Applies zoom scaling
   - Manages window state

2. **Gallery Windows**
   - Utilize window wrapper
   - Handle image display
   - Manage window lifecycle

## Usage Example

```jsx
// Creating a new window
const handleOpenWindow = (id, image) => {
  if (!activeWindows.has(id)) {
    const width = 400;
    const height = 400;
    const canvasScale = document.querySelector('[data-canvas-scale]')
      ?.dataset.canvasScale || 1;
    
    const x = Math.max(0, (Math.random() * (window.innerWidth - width)) 
      / parseFloat(canvasScale));
    const y = Math.max(0, (Math.random() * (window.innerHeight - height)) 
      / parseFloat(canvasScale));
    
    registerWindow(id, {
      x, y, width, height,
      onClose: () => setActiveWindows(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      })
    });
    
    setActiveWindows(prev => new Set([...prev, id]));
  }
};
```

## Best Practices

1. **Window Management**
   - Always use unique window IDs
   - Clean up windows on component unmount
   - Handle window state updates atomically
   - Maintain window positions for reopening

2. **Drag Operations**
   - Scale-aware dragging through DndKit modifiers
   - Real-time cursor following
   - Proper scaling of final positions
   - Separate drag and control areas
     - Apply drag handlers only to title area
     - Keep controls independent and accessible
   - Protected content area interaction
   - Touch event handling

3. **Zoom Operations**
   - Respect min/max scale limits
   - Position-aware zoom calculations
   - Scale-aware position updates

4. **Window Header Structure**
   - Separate drag and control areas clearly
   - Title area should handle dragging
   - Controls should be independent of drag
   - Maintain consistent interaction zones
