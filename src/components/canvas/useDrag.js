import { useState, useCallback } from 'react';

/**
 * A hook that provides drag functionality with mouse and touch support.
 * 
 * @param {Object} options - Hook options
 * @param {Function} [options.shouldStartDrag] - Optional function to determine if drag should start
 * @returns {Object} Drag state and handlers
 */
export const useDrag = ({ shouldStartDrag } = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    if (shouldStartDrag && !shouldStartDrag(e)) {
      return;
    }

    setIsDragging(true);
    setStartPosition({ x: position.x, y: position.y });
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [position, shouldStartDrag]);

  const onTouchStart = useCallback((e) => {
    if (shouldStartDrag && !shouldStartDrag(e)) {
      return;
    }

    const touch = e.touches[0];
    setIsDragging(true);
    setStartPosition({ x: position.x, y: position.y });
    setDragStart({ x: touch.clientX, y: touch.clientY });
  }, [position, shouldStartDrag]);

  const onMouseMove = useCallback((e, scale = 1) => {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setPosition({
      x: startPosition.x + (clientX - dragStart.x) / scale,
      y: startPosition.y + (clientY - dragStart.y) / scale,
    });
  }, [isDragging, startPosition, dragStart]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    position,
    setPosition,
    handlers: {
      onMouseDown,
      onTouchStart,
      onMouseMove,
      onMouseUp,
    },
  };
};
