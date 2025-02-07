import { useState, useCallback } from 'react';

/**
 * Custom hook for handling zoom functionality
 * @param {Object} options - Hook options
 * @param {number} options.minScale - Minimum zoom scale
 * @param {number} options.maxScale - Maximum zoom scale
 * @param {number} options.zoomFactor - Factor to zoom by on each step
 * @param {Function} options.onZoom - Callback when zoom changes
 * @returns {Object} Zoom state and handlers
 */
export const useZoom = ({
  minScale = 0.1,
  maxScale = 5,
  zoomFactor = 0.9,
  onZoom
} = {}) => {
  const [scale, setScale] = useState(1);

  const handleWheel = useCallback((e, position, containerRef) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newZoomFactor = e.deltaY > 0 ? zoomFactor : 1 / zoomFactor;
    
    setScale(prevScale => {
      const newScale = Math.min(Math.max(prevScale * newZoomFactor, minScale), maxScale);
      
      // Calculate new position to zoom towards mouse pointer
      const x = mouseX - (mouseX - position.x) * (newScale / prevScale);
      const y = mouseY - (mouseY - position.y) * (newScale / prevScale);
      
      onZoom?.({ scale: newScale, position: { x, y } });
      return newScale;
    });

    return null;
  }, [minScale, maxScale, zoomFactor, onZoom]); // Removed scale dependency

  const resetZoom = useCallback(() => {
    setScale(1);
    onZoom?.({ scale: 1, position: { x: 0, y: 0 } });
  }, [onZoom]);

  return {
    scale,
    handleWheel,
    resetZoom,
    setScale
  };
};
