import React, { useState, useRef, useEffect } from 'react';

const BackgroundCanvas = ({ children, showGrid = true }) => {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Debug state changes
  useEffect(() => {
    console.log('Drag state:', { isDragging, position, dragStart });
  }, [isDragging, position, dragStart]);

  const handleStart = React.useCallback((e) => {
    // Allow dragging to start anywhere within the canvas container
    const canvasElement = canvasRef.current;
    if (canvasElement && canvasElement.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      setIsDragging(true);
      setDragStart({
        x: clientX - position.x,
        y: clientY - position.y
      });
    }
  }, [position]);

  // Prevent all default scroll behavior
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    const canvas = canvasRef.current;
    
    if (canvas) {
      canvas.addEventListener('wheel', preventDefault, { passive: false });
      return () => canvas.removeEventListener('wheel', preventDefault);
    }
  }, []);

  const handleMouseMove = React.useCallback((e) => {
    if (isDragging) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPosition({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, position]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

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
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing relative"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      style={{
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
          transform: `translate(${position.x}px, ${position.y}px)`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default BackgroundCanvas;
