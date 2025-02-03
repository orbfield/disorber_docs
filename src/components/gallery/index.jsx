import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from 'lucide-react';
import { useWindowContext } from '../window/index';
import { WindowWrapper } from '../window/wrapper/index';

export function Gallery({ images = [{ thumb: '', full: '', alt: '' }] }) {
  const { registerWindow, toggleWindowVisibility } = useWindowContext();
  const [activeWindows, setActiveWindows] = useState(new Set());

  const handleOpenWindow = (id, imageUrl) => {
    if (!activeWindows.has(id)) {
      const width = 400;
      const height = 400;
      const x = Math.max(0, Math.random() * (window.innerWidth - width));
      const y = Math.max(0, Math.random() * (window.innerHeight - height));
      
      registerWindow(id, {
        x, y, width, height,
        onClose: () => setActiveWindows(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        })
      });
      
      setActiveWindows(prev => new Set([...prev, id]));
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <ImageThumbnail
            key={idx}
            src={img.thumb}
            alt={img.alt || ''}
            onClick={() => handleOpenWindow(`gallery-window-${idx}`, img.full)}
          />
        ))}
      </div>
      
      {Array.from(activeWindows).map(id => {
        const idx = parseInt(id.split('-').pop());
        const img = images[idx];
        return (
          <GalleryWindow
            key={id}
            id={id}
            imageUrl={img.full}
            toggleVisibility={() => toggleWindowVisibility(id)}
          />
        );
      })}
    </div>
  );
}

function ImageThumbnail({ src, alt, onClick }) {
  return (
    <motion.div
      className="relative group cursor-pointer overflow-hidden rounded-lg"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <span className="text-white text-sm">View Full Size</span>
      </div>
    </motion.div>
  );
}

function GalleryWindow({ id, imageUrl, toggleVisibility }) {
  const { bringToFront } = useWindowContext();
  return (
    <WindowWrapper
      id={id}
      className="bg-gray-800/70 backdrop-blur-lg border border-cyan-500/20 flex-lg shadow-lg"
      onClick={() => bringToFront(id)}
    >
      <div 
        className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900 flex-t-lg"
        style={{ cursor: 'move' }}
        onClick={(e) => {
          e.stopPropagation();
          bringToFront(id);
        }}
      >
        <div className="flex items-center gap-2 px-2">
          <Layout className="w-4 h-4 text-cyan-500" />
          <h2 className="text-white font-semibold">Image Preview</h2>
        </div>
        <button
          onClick={toggleVisibility}
          className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center flex-lg hover:bg-gray-700"
        >
          ×
        </button>
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 h-full bg-black/10 border border-cyan-500/10"
        onClick={(e) => {
          e.stopPropagation();
          bringToFront(id);
        }}
      >
        <img src={imageUrl} alt="" className="max-w-full h-auto" />
      </motion.div>
    </WindowWrapper>
  );
}

export default Gallery;
