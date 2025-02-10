# Panel Test Window Integration

## Overview

This document outlines the necessary changes made to integrate the PanelTest component with the window system, following the patterns established in the Gallery component.

## Key Changes

### 1. Window State Management

#### Before
```javascript
useEffect(() => {
  registerWindow(windowId, {
    title: "Interactive Sine Wave",
    defaultPosition: { x: 100, y: 100 },
    defaultSize: { width: 800, height: 800 }
  });

  if (windows[windowId] && !windows[windowId].isVisible) {
    toggleWindowVisibility(windowId);
  }
}, [registerWindow, toggleWindowVisibility, windows, windowId]);
```

#### After
```javascript
const [isWindowActive, setIsWindowActive] = useState(false);

const handleOpenWindow = () => {
  const existingWindow = windows[windowId];
  if (existingWindow && !existingWindow.isVisible) {
    toggleWindowVisibility(windowId);
    return;
  }
  
  if (!isWindowActive) {
    const width = 800;
    const height = 800;
    const x = Math.max(0, Math.random() * (window.innerWidth - width));
    const y = Math.max(0, Math.random() * (window.innerHeight - height));
    
    registerWindow(windowId, {
      x, y, width, height,
      onClose: () => setIsWindowActive(false)
    });
    
    setIsWindowActive(true);
  }
};
```

Key improvements:
- Added local window state tracking with `isWindowActive`
- Implemented proper window cleanup with `onClose` handler
- Added dynamic window positioning based on viewport size
- Centralized window management logic in a single function

### 2. Window Styling

#### Before
```jsx
<WindowWrapper 
  id={windowId}
  initialPosition={{ x: 100, y: 100 }}
>
  <div data-window-header className="bg-gray-800 text-white px-4 py-2">
    Interactive Sine Wave
  </div>
```

#### After
```jsx
<WindowWrapper
  id={windowId}
  className="bg-gray-800/70 backdrop-blur-lg border border-cyan-500/20 flex-lg shadow-lg"
>
  <div 
    data-window-header
    className="flex items-center py-1 px-2 border-b border-gray-700 bg-gray-900 flex-t-lg"
  >
    <div className="flex items-center gap-2 px-2">
      <Layout className="w-4 h-4 text-cyan-500" />
      <h2 className="text-white font-semibold text-sm truncate max-w-[280px]">
        Interactive Sine Wave
      </h2>
    </div>
  </div>
```

Key improvements:
- Removed hardcoded position in favor of dynamic positioning
- Added consistent window styling with backdrop blur
- Improved header styling with icon and proper text truncation
- Added proper border and shadow effects

### 3. Content Area Styling

#### Before
```jsx
<div className="p-4 space-y-4" style={{ height: '800px' }}>
  <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 h-full shadow-lg">
    <h3 className="text-xl font-semibold mb-6">Interactive Sine Wave</h3>
```

#### After
```jsx
<div className="h-full bg-black/10">
  <div className="p-4 space-y-4">
```

Key improvements:
- Removed fixed height in favor of dynamic sizing
- Simplified content area structure
- Removed redundant title (already in header)
- Added consistent background styling

## Best Practices

1. **Window State Management**
   - Track window state locally with useState
   - Implement proper cleanup handlers
   - Handle visibility toggling correctly
   - Use dynamic positioning

2. **Styling Consistency**
   - Follow established window styling patterns
   - Use proper backdrop blur effects
   - Implement consistent header styling
   - Maintain proper spacing and layout

3. **Component Structure**
   - Keep window management logic centralized
   - Separate concerns between window and content
   - Follow established patterns from Gallery component
   - Maintain proper prop types and documentation

## Integration Steps

1. Add window state tracking:
   ```javascript
   const [isWindowActive, setIsWindowActive] = useState(false);
   ```

2. Implement window management function:
   ```javascript
   const handleOpenWindow = () => {
     // Check existing window
     // Calculate position
     // Register window
     // Update state
   };
   ```

3. Update window styling:
   ```javascript
   // Add proper className
   // Update header structure
   // Implement consistent styling
   ```

4. Update content area:
   ```javascript
   // Remove fixed heights
   // Simplify structure
   // Maintain proper spacing
   ```

## Common Issues

1. **Window Positioning**
   - Issue: Windows appear at fixed positions
   - Solution: Implement dynamic positioning based on viewport

2. **State Management**
   - Issue: Windows don't track state properly
   - Solution: Add local state tracking with proper cleanup

3. **Styling Inconsistencies**
   - Issue: Window styling doesn't match Gallery
   - Solution: Follow established styling patterns

## Related Documentation

- [Window System](./window-system.md) - Core window system documentation
- [Gallery System Architecture](./gallery-system-architecture.md) - Reference implementation
