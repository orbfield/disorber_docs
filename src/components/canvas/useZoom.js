import { useState, useCallback } from 'react';

/**
 * A hook that provides zoom functionality with mouse wheel support.
 * 
 * @param {Object} options - Hook options
 * @param {Function} [options.onZoom] - Optional callback function called when zoom changes
 * @returns {Object} Zoom state and handlers
 */
export const useZoom = ({ onZoom } = {}) => {
  const [scale, setScale] = useState(1);
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;
  const ZOOM_SENSITIVITY = 0.0005;

  const handleWheel = useCallback((e, position, canvasRef) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const wheelDelta = e.deltaY;
    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, scale * (1 - wheelDelta * ZOOM_SENSITIVITY))
    );

    const scaleChange = newScale - scale;
    const newPosition = {
      x: position.x - (x - position.x) * (scaleChange / scale),
      y: position.y - (y - position.y) * (scaleChange / scale),
    };

    setScale(newScale);

    if (onZoom) {
      onZoom({ scale: newScale, position: newPosition });
    }
  }, [scale, onZoom]);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  return {
    scale,
    handleWheel,
    resetZoom,
  };
};
