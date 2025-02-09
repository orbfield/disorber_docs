import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Folder } from 'lucide-react';
import PropTypes from 'prop-types';
import { useWindowContext } from '../window/index';
import { WindowWrapper } from '../window/wrapper/index';
import { useNavigate } from 'react-router-dom';

/**
 * @typedef {Object} GalleryImage
 * @property {string} thumb - URL of the thumbnail image
 * @property {string} full - URL of the full-size image
 * @property {string} [alt] - Alternative text for the image
 * @property {boolean} [isDirectory] - Whether this image represents a directory
 * @property {string} [directoryId] - ID of the directory if this is a directory preview
 * @property {Array} [thumbnails] - Array of thumbnail images for directory previews
 */

/**
 * Gallery component that displays a grid of images with popup window functionality
 * @param {Object} props
 * @param {GalleryImage[]} [props.images=[]] - Array of image objects to display
 * @returns {JSX.Element} Gallery component
 */
export function Gallery({ images = [] }) {
  const { registerWindow, toggleWindowVisibility, windows } = useWindowContext();
  const [activeWindows, setActiveWindows] = useState(new Set());
  const navigate = useNavigate();

  /**
   * Handles opening a new window or navigating to a directory
   * @param {string} id - Window identifier
   * @param {Object} image - Image object with full URL and directory info
   */
  const handleOpenWindow = (id, image) => {
    if (image.isDirectory) {
      navigate(`/gallery/${image.directoryId}`);
      return;
    }

    const existingWindow = windows[id];
    if (existingWindow && !existingWindow.isVisible) {
      // If window exists but is hidden, just toggle visibility
      toggleWindowVisibility(id);
      return;
    }
    
    if (!activeWindows.has(id)) {
      const width = 400;
      const height = 400;
      // Position in viewport coordinates (WindowWrapper handles scaling)
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
    <div className="p-4 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {images.map((img, idx) => (
          <ImageThumbnail
            key={idx}
            src={img.thumb}
            alt={img.alt || ''}
            isDirectory={img.isDirectory}
            directoryId={img.directoryId}
            thumbnails={img.thumbnails}
            onClick={() => handleOpenWindow(`gallery-window-${idx}`, img)}
          />
        ))}
      </div>
      
      {Array.from(activeWindows).map(id => {
        const idx = parseInt(id.split('-').pop());
        const img = images[idx];
        // Only render window if it's not a directory and has a full image URL
        return !img.isDirectory && img.full ? (
          <GalleryWindow
            key={id}
            id={id}
            imageUrl={img.full}
            toggleVisibility={() => toggleWindowVisibility(id)}
          />
        ) : null;
      })}
    </div>
  );
}

/**
 * Image thumbnail component with hover effects
 * @param {Object} props
 * @param {string} props.src - Source URL of the thumbnail image
 * @param {string} props.alt - Alternative text for the image
 * @param {boolean} [props.isDirectory] - Whether this thumbnail represents a directory
 * @param {string} [props.directoryId] - ID of the directory if this is a directory preview
 * @param {Array} [props.thumbnails] - Array of thumbnail images for directory previews
 * @param {() => void} props.onClick - Click handler for the thumbnail
 * @returns {JSX.Element} ImageThumbnail component
 */
function ImageThumbnail({ src, alt, isDirectory, directoryId, thumbnails, onClick }) {
  if (isDirectory && thumbnails) {
    return (
      <motion.div
        className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-900"
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
      >
        <div className="aspect-square w-full">
          <div className="grid grid-cols-2 gap-2 p-2 h-full">
            {thumbnails.map((thumb, idx) => (
              <div key={idx} className="aspect-square overflow-hidden">
                <img
                  src={thumb.thumb}
                  alt={thumb.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Folder className="w-6 h-6 text-white" />
            <span className="text-white text-lg font-semibold">
              {alt}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

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
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">
            View Full Size
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Gallery window component that displays a full-size image in a draggable window
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the window
 * @param {string} props.imageUrl - URL of the full-size image
 * @param {() => void} props.toggleVisibility - Function to toggle window visibility
 * @returns {JSX.Element} GalleryWindow component
 */
function GalleryWindow({ id, imageUrl, toggleVisibility }) {
  /**
   * Extracts the image filename from a URL
   * @param {string} url - The full image URL
   * @returns {string} The extracted filename or 'Image' if extraction fails
   */
  const getImageName = (url) => {
    try {
      const urlParts = url.split('/');
      return decodeURIComponent(urlParts[urlParts.length - 1]);
    } catch (e) {
      return 'Image';
    }
  };

  return (
    <WindowWrapper
      id={id}
      className="bg-gray-800/70 backdrop-blur-lg border border-cyan-500/20 flex-lg shadow-lg"
    >
      <div 
        data-window-header
        className="flex items-center py-1 px-2 border-b border-gray-700 bg-gray-900 flex-t-lg"
      >
        <div className="flex items-center gap-2 px-2">
          <Layout className="w-4 h-4 text-cyan-500" />
          <h2 className="text-white font-semibold text-sm truncate max-w-[280px]">{getImageName(imageUrl)}</h2>
        </div>
      </div>
      <div className="h-full bg-black/10">
        <img src={imageUrl} alt="" className="w-full h-full object-contain" />
      </div>
    </WindowWrapper>
  );
}

Gallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      thumb: PropTypes.string,
      full: PropTypes.string,
      alt: PropTypes.string,
      isDirectory: PropTypes.bool,
      directoryId: PropTypes.string,
      thumbnails: PropTypes.arrayOf(
        PropTypes.shape({
          thumb: PropTypes.string.isRequired,
          full: PropTypes.string.isRequired,
          alt: PropTypes.string
        })
      )
    })
  )
};

ImageThumbnail.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  isDirectory: PropTypes.bool,
  directoryId: PropTypes.string,
  thumbnails: PropTypes.array,
  onClick: PropTypes.func.isRequired
};

GalleryWindow.propTypes = {
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  toggleVisibility: PropTypes.func.isRequired
};

export default Gallery;
