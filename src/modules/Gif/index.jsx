import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { WindowManagementProvider } from '../../components/window/WindowManagement';

// Import images
import thumb02 from '../../media/hilbert-bell/top/1-0.2-thumb.gif';
import full02 from '../../media/hilbert-bell/top/1-0.2-1000.gif';
import thumb04 from '../../media/hilbert-bell/top/1-0.4-thumb.gif';
import full04 from '../../media/hilbert-bell/top/1-0.4-1000.gif';
import thumb06 from '../../media/hilbert-bell/top/1-0.6-thumb.gif';
import full06 from '../../media/hilbert-bell/top/1-0.6-1000.gif';
import thumb08 from '../../media/hilbert-bell/top/1-0.8-thumb.gif';
import full08 from '../../media/hilbert-bell/top/1-0.8-1000.gif';
import thumb09 from '../../media/hilbert-bell/top/1-0.9-thumb.gif';
import full09 from '../../media/hilbert-bell/top/1-0.9-1000.gif';

import WindowWrapper from '../../components/window/WindowWrapper';
import { useWindowManagement } from '../../components/window/WindowManagement';
import { WINDOW_TYPES } from '../../components/window/windowConstants';

// Thumbnail component
const ImageThumbnail = ({ src, alt, onClick }) => (
  <motion.div
    className="relative group cursor-pointer overflow-hidden rounded-lg"
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    style={{ cursor: 'pointer' }}
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

// Full-size image display window
const ImageDisplayWindow = ({ image, windowId, onClose }) => {
  const { registerWindow } = useWindowManagement();

  useEffect(() => {
    // Register window immediately with default dimensions
    registerWindow(windowId, {
      width: 800,
      height: 600
    }, 'workspace');

    // Then adjust size after image loads
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const maxWidth = Math.min(1200, window.innerWidth * 0.8);
      const maxHeight = Math.min(800, window.innerHeight * 0.8);
      
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      
      // Scale down if needed while maintaining aspect ratio
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      // Update window dimensions
      registerWindow(windowId, {
        width: Math.round(width) + 48,
        height: Math.round(height) + 96
      }, 'workspace');
    };
    
    img.src = image.src;
  }, [registerWindow, windowId, image.src]);

  return (
    <WindowWrapper
      id={windowId}
      title={image.title || 'Image View'}
      icon={ImageIcon}
      onClose={onClose}
    >
      <div className="h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 rounded-lg overflow-hidden bg-black/50 border border-cyan-500/10 flex items-center justify-center h-full cursor-move"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="max-w-full max-h-full object-contain select-none rounded-lg"
          />
        </motion.div>
        <div className="text-center mt-2">
          <span className="text-xs text-cyan-400/50">disorber.com</span>
        </div>
      </div>
    </WindowWrapper>
  );
};

// Image data
const images = [
  {
    src: full02,
    thumbSrc: thumb02,
    alt: "Hilbert Bell Animation (0.2 parameter)",
    title: "Hilbert Bell - 0.2"
  },
  {
    src: full04,
    thumbSrc: thumb04,
    alt: "Hilbert Bell Animation (0.4 parameter)",
    title: "Hilbert Bell - 0.4"
  },
  {
    src: full06,
    thumbSrc: thumb06,
    alt: "Hilbert Bell Animation (0.6 parameter)",
    title: "Hilbert Bell - 0.6"
  },
  {
    src: full08,
    thumbSrc: thumb08,
    alt: "Hilbert Bell Animation (0.8 parameter)",
    title: "Hilbert Bell - 0.8"
  },
  {
    src: full09,
    thumbSrc: thumb09,
    alt: "Hilbert Bell Animation (0.9 parameter)",
    title: "Hilbert Bell - 0.9"
  }
];

// Main Gallery component
const Gallery = () => {
  const [openWindows, setOpenWindows] = useState(new Map());

  const handleImageClick = (image, index) => {
    const windowId = `image-display-${index}`;
    setOpenWindows(prev => new Map(prev).set(windowId, image));
  };

  const handleCloseWindow = (windowId) => {
    setOpenWindows(prev => {
      const next = new Map(prev);
      next.delete(windowId);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
          Gallery
        </h1>
        
        {/* Thumbnail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <ImageThumbnail
              key={index}
              src={image.thumbSrc}
              alt={image.alt}
              onClick={() => handleImageClick(image, index)}
            />
          ))}
        </div>
      </motion.div>

      {/* Full-size Display Windows */}
      {Array.from(openWindows.entries()).map(([windowId, image]) => (
        <ImageDisplayWindow
          key={windowId}
          windowId={windowId}
          image={image}
          onClose={() => handleCloseWindow(windowId)}
        />
      ))}
    </div>
  );
};

// Wrap Gallery with WindowManagementProvider
const GalleryWithProvider = () => (
  <WindowManagementProvider>
    <Gallery />
  </WindowManagementProvider>
);

export default GalleryWithProvider;
