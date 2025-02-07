# Window System Documentation

## Overview

The window system provides a flexible, draggable window interface for displaying content. It supports:
- Dynamic window creation and management
- Drag and drop functionality with DndKit integration
- Z-index management for proper window stacking
- Window state persistence
- Scale-aware dragging for zoom functionality

## Core Components

### 1. Window Context (`src/components/window/index.jsx`)

Provides window management functionality across the application.

#### Context Values
```typescript
interface WindowContextValue {
  windows: Record<string, WindowState>;
  registerWindow: (id: string, config: WindowConfig) => void;
  unregisterWindow: (id: string) => void;
  toggleWindowVisibility: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
}
```

### 2. WindowWrapper (`src/components/window/wrapper/index.jsx`)

The main container component for windows.

#### Props
```typescript
interface WindowWrapperProps {
  id: string;                // Unique window identifier
  className?: string;        // Additional CSS classes
  children: ReactNode;       // Window content
  style?: CSSProperties;     // Additional styles
}
```

### 3. DndKit Integration (`src/components/window/wrapper/DndKit.jsx`)

Handles drag and drop functionality with scale awareness.

#### Key Features
- Scale-aware dragging through modifiers
- Real-time cursor following
- Proper scaling of final positions
- Separated drag and control areas

## Window State Management

### Window Registration
```javascript
const registerWindow = (id, config) => {
  const { x, y, width, height, onClose } = config;
  setWindows(prev => ({
    ...prev,
    [id]: {
      id,
      x,
      y,
      width,
      height,
      isVisible: true,
      onClose
    }
  }));
};
```

### Position Updates
```javascript
const updateWindowPosition = (id, x, y) => {
  setWindows(prev => ({
    ...prev,
    [id]: {
      ...prev[id],
      x,
      y
    }
  }));
};
```

## Drag Implementation

### Base Drag Hook (`src/components/canvas/useDrag.js`)

Provides fundamental drag functionality:

```javascript
const useDrag = (initialPosition) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const startPosition = useRef({ x: 0, y: 0 });
  
  return {
    isDragging,
    position,
    setPosition,
    handlers: {
      onMouseDown,
      onTouchStart,
      onMouseMove,
      onMouseUp
    }
  };
};
```

### DndKit Integration

```javascript
const DragProvider = ({ children, scale }) => (
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
    {children}
  </DndContext>
);
```

## Window Position Management

### Position Hook (`src/components/window/hooks/useWindowPosition.jsx`)

Manages window positioning with scale awareness:

```javascript
const useWindowPosition = (id) => {
  const { updateWindowPosition } = useWindowContext();
  const { scale } = useZoomContext();
  
  const handlePositionChange = useCallback((x, y) => {
    updateWindowPosition(id, x / scale, y / scale);
  }, [id, scale, updateWindowPosition]);
  
  return { handlePositionChange };
};
```

## Best Practices

### 1. Window Creation
- Generate unique window IDs
- Calculate initial position within viewport
- Consider scale factor for positioning
- Set appropriate initial dimensions

### 2. Drag Operations
- Use DndKit modifiers for scale-aware dragging
- Implement real-time cursor following
- Handle touch events for mobile support
- Maintain proper z-index stacking

### 3. Window Structure
```jsx
<WindowWrapper id={id}>
  <div data-window-header>
    {/* Draggable header area */}
  </div>
  <div data-window-content>
    {/* Protected content area */}
  </div>
</WindowWrapper>
```

### 4. Performance Considerations
- Clean up unused windows
- Optimize drag calculations
- Handle window state updates efficiently
- Implement proper unmount cleanup

## Error Handling

### Common Issues
1. Position Calculation
   - Handle boundary conditions
   - Validate position updates
   - Consider scale factor

2. Drag Events
   - Handle interrupted drags
   - Clean up event listeners
   - Manage touch/mouse conflicts

## Integration Example

```jsx
function GalleryWindow({ id, imageUrl }) {
  return (
    <WindowWrapper
      id={id}
      className="bg-gray-800/70 backdrop-blur-lg"
    >
      <div data-window-header>
        <h2>{getImageName(imageUrl)}</h2>
      </div>
      <div className="h-full">
        <img 
          src={imageUrl} 
          alt="" 
          className="w-full h-full object-contain" 
        />
      </div>
    </WindowWrapper>
  );
}
```