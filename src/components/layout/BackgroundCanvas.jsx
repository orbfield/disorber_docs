import React, { useState, useRef, useEffect } from 'react';

const BackgroundCanvas = ({ children, showGrid = true, resetKey }) => {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Debug state changes
  useEffect(() => {
    console.log('Drag state:', { isDragging, position, dragStart });
  }, [isDragging, position, dragStart]);

  const handleStart = React.useCallback((e) => {
    // Don't start dragging if we clicked on a window
    if (e.target.closest('.window-draggable')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  }, [position]);

  // Handle zoom with mouse wheel
  const handleWheel = React.useCallback((e) => {
    if (e.target.closest('.window-draggable')) {
      return;
    }

    e.preventDefault();
    const delta = e.deltaY;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom factor based on wheel delta
    const zoomFactor = delta > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.1), 5);

    // Calculate new position to zoom towards mouse
    const x = mouseX - (mouseX - position.x) * (newScale / scale);
    const y = mouseY - (mouseY - position.y) * (newScale / scale);

    setScale(newScale);
    setPosition({ x, y });
  }, [scale, position]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Reset position and scale when resetKey changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  }, [resetKey]);

  const handleMouseMove = React.useCallback((e) => {
    if (!isDragging) return;

    // Don't drag if we're over a window
    if (e.target.closest('.window-draggable')) {
      setIsDragging(false);
      return;
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, [handleMouseMove, handleMouseUp]);

  const gridSize = 50;
  const gridColor = 'rgba(255, 255, 255, 0)';

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
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          ` : ''}
        `,
        backgroundSize: showGrid 
          ? `100% 100%, 100% 100%, ${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px`
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
