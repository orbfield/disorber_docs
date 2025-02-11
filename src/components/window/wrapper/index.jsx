import React, { useEffect } from 'react';
import { useWindowContext } from '../index.jsx';
import { useZoom } from '../../canvas/ZoomContext';
import { useScaledDrag, DragProvider } from './DndKit';

/**
 * @typedef {Object} Position
 * @property {number} x - The x coordinate
 * @property {number} y - The y coordinate
 */

/**
 * @typedef {Object} WindowData
 * @property {Position} position - Current window position
 * @property {boolean} isVisible - Window visibility state
 * @property {number} zIndex - Window stack order
 */

/**
 * @typedef {Object} WindowProps
 * @property {string} id - Unique identifier for the window
 * @property {React.ReactNode} children - Window content including header and body
 * @property {Position} initialPosition - Starting position of the window
 * @property {string} [className] - Additional CSS classes
 * @property {Object} [dragConstraints] - Constraints for dragging behavior
 */

// Drag style configurations
const DRAG_STYLES = {
  dragging: 'cursor-move',
  idle: 'cursor-move',
  base: 'absolute window-draggable'
};

/**
 * Splits children into header and content components
 * @param {React.ReactNode} children - Child components to split
 * @returns {[React.ReactElement, React.ReactElement[]]} Tuple of [header, content]
 */
const splitWindowChildren = (children) => {
  const childArray = React.Children.toArray(children);
  const header = childArray.find(child => child.props?.['data-window-header']);
  const content = childArray.filter(child => !child.props?.['data-window-header']);
  return [header, content];
};

/**
 * Internal component that handles the window content and interactions
 * @param {WindowProps & {
 *   windowData: WindowData,
 *   registerWindow: (id: string, position: Position) => void,
 *   updateWindowPosition: (id: string, position: Position) => void,
 *   bringToFront: (id: string) => void,
 *   toggleWindowVisibility: (id: string) => void
 * }} props
 */
const WindowContent = React.memo(({ 
  id,
  children,
  initialPosition,
  className = '',
  dragConstraints,
  windowData,
  registerWindow,
  updateWindowPosition,
  bringToFront,
  toggleWindowVisibility
}) => {
  // Get current zoom scale
  const { scale } = useZoom();

  // Register window with management system on mount
  useEffect(() => {
    registerWindow(id, initialPosition);
  }, [id, initialPosition, registerWindow]);

  // Split children into header and content
  const [header, content] = splitWindowChildren(children);

  // Setup drag handling with scaled coordinates
  const {
    setNodeRef,
    attributes,
    listeners,
    style: dragStyle,
    isDragging: isDraggingDnd,
    transform: dndTransform
  } = useScaledDrag({
    id,
    position: windowData.position
  });

  // Bring window to front when starting drag
  useEffect(() => {
    if (isDraggingDnd) {
      bringToFront(id);
    }
  }, [isDraggingDnd, bringToFront, id]);

  // Compute dynamic styles
  const headerClassName = `${header.props.className || ''} ${
    isDraggingDnd ? DRAG_STYLES.dragging : DRAG_STYLES.idle
  }`;

  const basePosition = {
    x: windowData.position.x,
    y: windowData.position.y
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        display: windowData.isVisible ? 'block' : 'none',
        position: 'absolute',
        transform: `translate3d(${basePosition.x + (dndTransform?.x || 0)}px, ${basePosition.y + (dndTransform?.y || 0)}px, 0)`,
        zIndex: windowData.zIndex,
        touchAction: 'none',
        ...dragStyle
      }}
      className={`${DRAG_STYLES.base} ${className}`}
      onClick={() => bringToFront(id)}
    >
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          {/* Draggable title area */}
          <div {...attributes} {...listeners} className={`flex-1 ${headerClassName}`}>
            {header.props.children}
          </div>
          {/* Controls area */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWindowVisibility(id);
            }}
            className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center flex-lg hover:bg-gray-700"
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="pointer-events-auto">
          {content}
        </div>
      </div>
    </div>
  );
});

// Set display name for debugging
WindowContent.displayName = 'WindowContent';

/**
 * Window wrapper component providing window management capabilities
 * Handles window registration, positioning, and drag interactions
 * @param {WindowProps} props
 */
export const WindowWrapper = (props) => {
  // Move all hooks to the top level
  const { 
    windows,
    registerWindow,
    updateWindowPosition,
    bringToFront,
    toggleWindowVisibility
  } = useWindowContext();
  
  const { scale } = useZoom();

  // Get window data from context
  const windowData = windows[props.id];
  
  // Early return after all hooks have been called
  if (!windowData) return null;

  const handleDragEnd = (event) => {
    if (event.delta) {
      const newPosition = {
        x: windowData.position.x + (event.delta.x),
        y: windowData.position.y + (event.delta.y)
      };
      updateWindowPosition(props.id, newPosition);
    }
  };

  return (
    <DragProvider onDragEnd={handleDragEnd}>
      <WindowContent
        {...props}
        windowData={windowData}
        registerWindow={registerWindow}
        updateWindowPosition={updateWindowPosition}
        bringToFront={bringToFront}
        toggleWindowVisibility={toggleWindowVisibility}
      />
    </DragProvider>
  );
};
