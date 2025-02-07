import { useState, useCallback } from 'react';

/**
 * Custom hook for handling drag functionality with scale support
 * @param {Object} options - Hook options
 * @param {Function} options.onDragStart - Callback when drag starts
 * @param {Function} options.onDragEnd - Callback when drag ends
 * @param {Function} options.shouldStartDrag - Function to determine if drag should start
 * @returns {Object} Drag state and handlers
 */
export const useDrag = ({ onDragStart, onDragEnd, shouldStartDrag } = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const getPointerPosition = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { clientX, clientY };
  }, []);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (shouldStartDrag && !shouldStartDrag(e)) return;

    const { clientX, clientY } = getPointerPosition(e);
    setIsDragging(() => true);
    setDragStart(prevDragStart => ({
      x: clientX - position.x,
      y: clientY - position.y
    }));

    onDragStart?.(e);
  }, [getPointerPosition, shouldStartDrag, onDragStart, position]);

  const handleMove = useCallback((e, scale = 1) => {
    if (!isDragging) return;

    if (shouldStartDrag && !shouldStartDrag(e)) {
      setIsDragging(() => false);
      return;
    }

    const { clientX, clientY } = getPointerPosition(e);
    
    // Store raw movement in world space
    setPosition(prevPosition => ({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    }));
  }, [isDragging, dragStart, getPointerPosition, shouldStartDrag]);

  const handleEnd = useCallback((e) => {
    if (isDragging) {
      setIsDragging(() => false);
      onDragEnd?.(e);
    }
  }, [isDragging, onDragEnd]);

  return {
    isDragging,
    position,
    handlers: {
      onMouseDown: handleStart,
      onTouchStart: handleStart,
      onMouseMove: handleMove,
      onTouchMove: handleMove,
      onMouseUp: handleEnd,
      onTouchEnd: handleEnd
    },
    setPosition
  };
};
