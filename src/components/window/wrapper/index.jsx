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
      dragElastic={0}
      dragTransition={{ power: 0 }}
      style={{
        display: windowData.isVisible ? 'block' : 'none',
        touchAction: 'none'
      }}
      initial={{ 
        x: windowData.position.x,
        y: windowData.position.y,
        scale: 0.95,
        opacity: 0
      }}
      animate={{ 
        x: windowData.position.x,
        y: windowData.position.y,
        scale: 1,
        opacity: 1,
        zIndex: windowData.zIndex
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        opacity: { duration: 0.1 }
      }}
      onDragStart={(e) => {
        e.stopPropagation();
        bringToFront(id);
      }}
      onDragEnd={(e, info) => {
        e.stopPropagation();
        const newX = windowData.position.x + info.offset.x;
        const newY = windowData.position.y + info.offset.y;
        updateWindowPosition(id, { x: newX, y: newY });
      }}
      className={`absolute window-draggable ${className}`}
    >
      {children}
    </motion.div>
  );
};