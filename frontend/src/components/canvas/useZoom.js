import { useCallback } from 'react';
import { useZoom as useZoomContext } from './ZoomContext';

/**
 * A hook that provides zoom functionality with mouse wheel support.
 * 
 * @param {Object} options - Hook options
 * @param {Function} [options.onZoom] - Optional callback function called when zoom changes
 * @returns {Object} Zoom state and handlers
 */
export const useZoom = ({ onZoom } = {}) => {
  const { scale, setScale, calculateNewPosition, resetZoom } = useZoomContext();

  const handleWheel = useCallback((e, position, canvasRef) => {
    const { scale: newScale, position: newPosition } = calculateNewPosition(e, position, canvasRef);
    
    setScale(newScale);

    if (onZoom) {
      onZoom({ scale: newScale, position: newPosition });
    }
  }, [calculateNewPosition, setScale, onZoom]);

  return {
    scale,
    handleWheel,
    resetZoom,
  };
};
