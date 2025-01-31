import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWindowContext } from '../index.jsx';

export const WindowWrapper = ({ 
  id,
  children,
  initialPosition = { x: 0, y: 0 },
  className = '',
  dragConstraints = null
}) => {
  const { 
    windows,
    registerWindow,
    updateWindowPosition,
    bringToFront
  } = useWindowContext();

  const windowRef = useRef(null);

  useEffect(() => {
    registerWindow(id, initialPosition);
  }, [id, initialPosition, registerWindow]);

  const windowData = windows[id];
  if (!windowData) return null;

  const checkBounds = (x, y) => {
    const rect = windowRef.current?.getBoundingClientRect();
    if (!rect) return true;

    const isInViewport = 
      x >= -rect.width / 2 &&
      x <= window.innerWidth - rect.width / 2 &&
      y >= -rect.height / 2 &&
      y <= window.innerHeight - rect.height / 2;

    return isInViewport;
  };

  return (
    <motion.div
      ref={windowRef}
      drag
      dragMomentum={false}
      dragConstraints={dragConstraints}
      initial={initialPosition}
      animate={{
        x: windowData.position.x,
        y: windowData.position.y,
        zIndex: windowData.zIndex
      }}
      onDragStart={() => bringToFront(id)}
      onDrag={(_, info) => {
        const newX = windowData.position.x + info.offset.x;
        const newY = windowData.position.y + info.offset.y;
        
        if (!checkBounds(newX, newY)) {
          updateWindowPosition(id, windowData.initialPosition);
        }
      }}
      onDragEnd={(_, info) => {
        const newX = windowData.position.x + info.offset.x;
        const newY = windowData.position.y + info.offset.y;
        
        if (checkBounds(newX, newY)) {
          updateWindowPosition(id, { x: newX, y: newY });
        } else {
          updateWindowPosition(id, windowData.initialPosition);
        }
      }}
      className={`absolute ${className}`}
      style={{
        display: windowData.isVisible ? 'block' : 'none',
        touchAction: 'none'
      }}
    >
      {children}
    </motion.div>
  );
};
