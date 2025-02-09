import React, { useRef, useEffect, useCallback } from 'react';
import { useDrag } from './useDrag';
import { useZoom } from './useZoom';
import { ZoomProvider } from './ZoomContext';

/**
 * A React component that provides a draggable and zoomable canvas with an optional grid background.
 * Supports both mouse and touch interactions for panning and zooming.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered within the canvas
 * @param {boolean} [props.showGrid=true] - Whether to display the background grid
 * @param {any} props.resetKey - Key to trigger canvas reset (position and scale)
 * @returns {JSX.Element} A draggable and zoomable canvas component
 */
const CanvasContent = ({ children, showGrid = true, resetKey }) => {
  const GRID_SIZE = 50;
  const GRID_COLOR = 'rgba(255, 255, 255, 0)';
  const canvasRef = useRef(null);

  const shouldStartDrag = useCallback((e) => {
    const element = e.touches ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : e.target;
    return !element?.closest?.('.window-draggable');
  }, []);

  const { isDragging, position, handlers, setPosition } = useDrag({
    shouldStartDrag
  });

  const { scale, handleWheel, resetZoom } = useZoom({
    onZoom: useCallback(({ scale: newScale, position: newPosition }) => {
      setPosition(newPosition);
    }, [])
  });

  const wheelHandler = useCallback((e) => {
    const element = e.target;
    if (element?.closest?.('.window-draggable')) return;
    e.preventDefault();
    handleWheel(e, position, canvasRef);
  }, [handleWheel, position]);

  // Handle wheel events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', wheelHandler, { passive: false });
      return () => canvas.removeEventListener('wheel', wheelHandler);
    }
  }, [wheelHandler]);

  // Handle reset
  useEffect(() => {
    setPosition(() => ({ x: 0, y: 0 }));
    resetZoom();
  }, [resetKey, resetZoom]);

  // Handle move events with scale
  useEffect(() => {
    if (!isDragging) return;

    const moveHandler = (e) => {
      e.preventDefault();

      if (shouldStartDrag && !shouldStartDrag(e)) {
        return;
      }

      handlers.onMouseMove(e, scale);
    };

    const endHandler = () => {
      handlers.onMouseUp();
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('touchmove', moveHandler, { passive: false });
    window.addEventListener('mouseup', endHandler);
    window.addEventListener('touchend', endHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('mouseup', endHandler);
      window.removeEventListener('touchend', endHandler);
    };
  }, [isDragging, shouldStartDrag, handlers, scale]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full overflow-hidden relative select-none ${isDragging ? 'cursor-grabbing animate-grab' : 'cursor-grab animate-release'}`}
      onMouseDown={handlers.onMouseDown}
      onTouchStart={handlers.onTouchStart}
      style={{
        pointerEvents: isDragging ? 'all' : 'auto',
        background: `
          repeating-linear-gradient(45deg,
            rgb(146, 146, 145) 0%,
            rgb(50, 50, 50) 12.5%,
            rgb(114, 114, 114) 25%
          ),
          repeating-linear-gradient(-45deg,
            rgb(31, 41, 55) 0%,
            rgb(49, 63, 83) 12.5%,
            rgb(58, 70, 88) 25%
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

const BackgroundCanvas = (props) => {
  return (
    <ZoomProvider>
      <CanvasContent {...props} />
    </ZoomProvider>
  );
};

export default BackgroundCanvas;
