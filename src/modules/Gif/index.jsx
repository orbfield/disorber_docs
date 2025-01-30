import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
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
const ImageDisplayWindow = ({ image, onClose }) => {
  const { registerWindow } = useWindowManagement();
  const windowId = 'image-display';

  useEffect(() => {
    registerWindow(windowId, null, WINDOW_TYPES.DISPLAY);
  }, [registerWindow]);

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
          className="relative w-full h-full rounded-lg overflow-hidden bg-black/50 border border-cyan-500/10"
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-contain"
          />
        </motion.div>
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
  const [selectedImage, setSelectedImage] = useState(null);

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
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </motion.div>

      {/* Full-size Display Window */}
      {selectedImage && (
        <ImageDisplayWindow
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
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
