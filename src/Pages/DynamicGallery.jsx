import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Gallery } from '../components/gallery';
import { WindowProvider } from '../components/window';
import { scanMediaDirectory, getMediaUrl } from '../media/mediaScanner';
import { RESOLUTIONS } from '../config/imageResolutions';

/**
 * Extracts media files from a directory tree based on a target path
 * @param {Array} nodes - Directory tree nodes
 * @param {string} targetPath - Target path to filter files
 * @returns {Array} Filtered media files
 */
const extractMediaFiles = (nodes, targetPath) => {
  return nodes.flatMap(node => {
    if (node.path.startsWith(targetPath)) {
      return node.type ? [node] : (node.children ? extractMediaFiles(node.children, targetPath) : []);
    }
    return [];
  });
};

/**
 * Extracts metadata from a GIF filename
 * @param {string} filename - Format: "name-resolution.gif" (e.g., "1-0.2-50.gif")
 * @returns {{ baseName: string, resolution: number } | null}
 */
const parseGifFilename = (filename) => {
  if (!filename.endsWith('.gif')) return null;
  const [baseName, resolution] = filename.replace('.gif', '').split('-').slice(-2);
  return {
    baseName,
    resolution: parseInt(resolution)
  };
};

/**
 * Groups GIF files by base name with their resolution variants
 * @param {Array} files - Array of media file objects
 * @returns {Object} Grouped files by base name with resolution variants
 */
const groupFilesByVariants = (files) => {
  const groups = {};

  files.forEach(file => {
    const metadata = parseGifFilename(file.text);
    if (!metadata) return;

    const { baseName, resolution } = metadata;
    if (!groups[baseName]) {
      groups[baseName] = { variants: {} };
    }

    const sizeCategory = RESOLUTIONS[resolution] || 'custom';
    groups[baseName].variants[sizeCategory] = {
      path: file.path,
      resolution
    };
  });

  return groups;
};

/**
 * Creates a gallery image object from variants
 * @param {string} baseName - Base name of the image
 * @param {Object} versions - Object containing image variants
 * @returns {Object} Gallery-compatible image object
 */
const createGalleryImage = (baseName, versions) => ({
  thumb: getMediaUrl(versions.variants.small.path),
  full: getMediaUrl(versions.variants.medium.path),
  fullRes: versions.variants.custom 
    ? getMediaUrl(versions.variants.custom.path)
    : getMediaUrl(versions.variants.large.path),
  alt: `${baseName.replace(/-/g, ' ')} animation`,
  title: baseName.replace(/-/g, ' '),
  resolutions: Object.fromEntries(
    Object.entries(versions.variants)
      .map(([size, data]) => [size, data.resolution])
  )
});

/**
 * Processes media files into gallery-compatible format
 * @param {Array} files - Array of media file objects
 * @returns {Array} Processed image objects for gallery display
 */
const processMediaFiles = (files) => {
  const imageGroups = groupFilesByVariants(files);
  
  return Object.entries(imageGroups)
    .filter(([_, versions]) => versions.variants.small) // Ensure thumbnail exists
    .map(([baseName, versions]) => createGalleryImage(baseName, versions));
};

/**
 * Dynamic Gallery Page Component
 * Displays a gallery of images based on the current URL path
 */
const DynamicGalleryPage = () => {
  const { path = '', '*': rest } = useParams();
  const cleanPath = path.startsWith('gallery/') ? path.substring(7) : path;
  const fullPath = rest ? `${cleanPath}/${rest}` : cleanPath;
  const [images, setImages] = useState([]);
 
  useEffect(() => {
    const loadImages = async () => {
      try {
        const tree = await scanMediaDirectory();
        const mediaFiles = extractMediaFiles(tree, fullPath);
        const processedImages = processMediaFiles(mediaFiles);
        setImages(processedImages);
      } catch (error) {
        console.error('Failed to load gallery images:', error);
        setImages([]);
      }
    };
   
    loadImages();
  }, [fullPath]);

  return (
    <WindowProvider>
      <div className="flex flex-col items-center gap-4">
        <Gallery images={images} />
      </div>
    </WindowProvider>
  );
};

export default DynamicGalleryPage;
