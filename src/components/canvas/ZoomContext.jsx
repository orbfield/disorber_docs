import React, { createContext, useContext, useState, useCallback } from 'react';

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_SENSITIVITY = 0.0005;

const ZoomContext = createContext(null);

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }
  return context;
};

export const ZoomProvider = ({ children }) => {
  const [scale, setScale] = useState(1);

  const calculateNewScale = useCallback((wheelDelta) => {
    return Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, scale * (1 - wheelDelta * ZOOM_SENSITIVITY))
    );
  }, [scale]);

  const calculateNewPosition = useCallback((e, currentPosition, canvasRef) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const wheelDelta = e.deltaY;
    const newScale = calculateNewScale(wheelDelta);
    const scaleChange = newScale - scale;

    return {
      scale: newScale,
      position: {
        x: currentPosition.x - (x - currentPosition.x) * (scaleChange / scale),
        y: currentPosition.y - (y - currentPosition.y) * (scaleChange / scale),
      }
    };
  }, [scale, calculateNewScale]);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  const value = {
    scale,
    setScale,
    calculateNewScale,
    calculateNewPosition,
    resetZoom,
    MIN_SCALE,
    MAX_SCALE,
    ZOOM_SENSITIVITY
  };

  return (
    <ZoomContext.Provider value={value}>
      {children}
    </ZoomContext.Provider>
  );
};
