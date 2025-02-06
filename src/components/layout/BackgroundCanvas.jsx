import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * BackgroundCanvas component provides a draggable and zoomable canvas with grid background.
 * Supports both mouse and touch interactions.
 */
const BackgroundCanvas = ({ children, showGrid = true, resetKey }) => {
  // Constants
  const GRID_SIZE = 50;
  const GRID_COLOR = 'rgba(255, 255, 255, 0)';
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;
  const ZOOM_FACTOR = 0.9; // < 1 for zoom out, > 1 for zoom in

  // Refs and state
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Helper functions
  const getElementUnderPointer = useCallback((e) => {
    if (e.touches) {
      const touch = e.touches[0];
      return document.elementFromPoint(touch.clientX, touch.clientY);
    }
    return e.target;
  }, []);

  const getPointerPosition = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { clientX, clientY };
  }, []);

  const isOverDraggableWindow = useCallback((element, isTouchEvent) => {
    return !isTouchEvent && element?.closest?.('.window-draggable');
  }, []);

  // Event handlers
  const handleStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const elementUnderPointer = getElementUnderPointer(e);
    if (isOverDraggableWindow(elementUnderPointer, e.touches)) return;
    
    const { clientX, clientY } = getPointerPosition(e);
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  }, [position, getElementUnderPointer, getPointerPosition, isOverDraggableWindow]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const elementUnderPointer = getElementUnderPointer(e);
    if (isOverDraggableWindow(elementUnderPointer, e.touches)) {
      setIsDragging(false);
      return;
    }

    const { clientX, clientY } = getPointerPosition(e);
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  }, [isDragging, dragStart, getElementUnderPointer, getPointerPosition, isOverDraggableWindow]);

  const handleWheel = useCallback((e) => {
    const elementUnderPointer = e.target;
    if (elementUnderPointer?.closest?.('.window-draggable')) return;

    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    const newScale = Math.min(Math.max(scale * zoomFactor, MIN_SCALE), MAX_SCALE);

    const x = mouseX - (mouseX - position.x) * (newScale / scale);
    const y = mouseY - (mouseY - position.y) * (newScale / scale);

    setScale(newScale);
    setPosition({ x, y });
  }, [scale, position]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  }, [resetKey]);

  useEffect(() => {
    const handleTouchMove = (e) => {
      e.preventDefault(); // Prevent scrolling
      handleMouseMove(e);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full overflow-hidden relative select-none ${isDragging ? 'cursor-grabbing animate-grab' : 'cursor-grab animate-release'}`}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      style={{
        pointerEvents: isDragging ? 'all' : 'auto',
        background: `
          repeating-linear-gradient(45deg,
            rgb(17, 24, 39) 0%,
            rgb(31, 41, 55) 12.5%,
            rgb(17, 24, 39) 25%
          ),
          repeating-linear-gradient(-45deg,
            rgb(17, 24, 39) 0%,
            rgb(31, 41, 55) 12.5%,
            rgb(17, 24, 39) 25%
          )
          ${showGrid ? `,
          linear-gradient(to right, ${GRID_COLOR} 1px, transparent 1px),
          linear-gradient(to bottom, ${GRID_COLOR} 1px, transparent 1px)
          ` : ''}
        `,
        backgroundSize: showGrid 
          ? `100% 100%, 100% 100%, ${GRID_SIZE}px ${GRID_SIZE}px, ${GRID_SIZE}px ${GRID_SIZE}px`
          : '100% 100%, 100% 100%',
        backgroundBlendMode: showGrid 
          ? 'overlay, overlay, normal, normal'
          : 'overlay, overlay',
        backgroundPosition: showGrid
          ? `${position.x * 0.1}px ${position.y * 0.1}px, ${position.x}px ${position.y}px, ${position.x}px ${position.y}px`
          : `${position.x * 0.1}px ${position.y * 0.1}px, ${position.x}px ${position.y}px`,
        backgroundAttachment: 'scroll, scroll, scroll',
      }}
    >
      <div
        className="min-h-full"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: 'none',
          willChange: 'transform'
        }}
        data-canvas-scale={scale}
      >
        {children}
      </div>
    </div>
  );
};

export default BackgroundCanvas;
