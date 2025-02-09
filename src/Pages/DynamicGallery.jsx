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
/**
 * Finds all GIF files in a directory and its subdirectories
 * @param {Array} nodes - Directory tree nodes
 * @returns {Array} All GIF files found
 */
const findAllGifFiles = (nodes) => {
  return nodes.flatMap(node => {
    if (node.type === 'gif') return [node];
    if (node.children) return findAllGifFiles(node.children);
    return [];
  });
};

/**
 * Checks if a directory contains subdirectories
 * @param {Object} node - Directory node
 * @returns {boolean} True if directory has subdirectories
 */
const hasSubdirectories = (node) => {
  return node.children?.some(child => !child.type) || false;
};

// Configuration for gallery directory previews
const PREVIEW_CONFIG = {
  thumbnailsPerDirectory: 4  // Number of thumbnails to show per directory preview
};

/**
 * Gets random 50px thumbnails from a directory's files
 * @param {Array} files - Array of files
 * @param {number} count - Number of thumbnails to return
 * @returns {Array} Array of random thumbnail files
 */
const getRandomThumbnails = (files, count) => {
  const thumbnails = files.filter(file => {
    const metadata = parseGifFilename(file.text);
    return metadata && metadata.resolution === 50;
  });

  // If we don't have enough thumbnails, return all we have
  if (thumbnails.length <= count) {
    return thumbnails;
  }

  // Randomly select unique thumbnails
  const selected = new Set();
  const result = [];
  while (result.length < count && result.length < thumbnails.length) {
    const randomIndex = Math.floor(Math.random() * thumbnails.length);
    const thumbnail = thumbnails[randomIndex];
    if (!selected.has(thumbnail.path)) {
      selected.add(thumbnail.path);
      result.push(thumbnail);
    }
  }
  return result;
};

/**
 * Extracts media files based on directory level
 * @param {Array} nodes - Directory tree nodes
 * @param {string} targetPath - Target path to filter files
 * @returns {Array} Filtered media files and directory previews
 */
const extractMediaFiles = (nodes, targetPath) => {
  // For root or intermediate directories, return directory previews
  if (!targetPath || hasSubdirectories(nodes.find(n => n.id === targetPath) || { children: [] })) {
    return nodes
      .filter(node => !node.type && node.children) // Only directories
      .flatMap(dir => {
        // If we're in a specific directory (not root) and it has only one subdirectory
        if (targetPath && dir.children.length === 1 && !dir.children[0].type) {
          const subdir = dir.children[0];
          const allFiles = findAllGifFiles([subdir]);
          const thumbnails = getRandomThumbnails(allFiles, PREVIEW_CONFIG.thumbnailsPerDirectory);
          if (thumbnails.length === 0) return [];
          
          return [{
            thumbnails: thumbnails.map(thumbnail => ({
              thumb: getMediaUrl(thumbnail.path),
              full: getMediaUrl(thumbnail.path),
              alt: thumbnail.alt || `${subdir.text} preview`
            })),
            directoryId: `${targetPath}/${subdir.id.split('/').pop()}`,
            directoryName: subdir.text,
            isDirectory: true,
            alt: subdir.text
          }];
        }
        
        // Otherwise process directory normally
        const allFiles = findAllGifFiles([dir]);
        const thumbnails = getRandomThumbnails(allFiles, PREVIEW_CONFIG.thumbnailsPerDirectory);
        if (thumbnails.length === 0) return [];
        
        return [{
          thumbnails: thumbnails.map(thumbnail => ({
            thumb: getMediaUrl(thumbnail.path),
            full: getMediaUrl(thumbnail.path),
            alt: thumbnail.alt || `${dir.text} preview`
          })),
          directoryId: targetPath ? `${targetPath}/${dir.id.split('/').pop()}` : dir.id,
          directoryName: dir.text,
          isDirectory: true,
          alt: dir.text
        }];
      }); // flatMap automatically removes empty arrays
  }
  
  // For leaf directories, return all files
  return nodes.flatMap(node => {
    const nodeMatches = node.id === targetPath || 
                       (node.path && node.path.startsWith(targetPath + '/'));
    
    if (nodeMatches) {
      if (node.type === 'gif') return [node];
      if (node.children) return extractMediaFiles(node.children, targetPath);
    }
    
    if (node.children) return extractMediaFiles(node.children, targetPath);
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
  
  // Remove .gif extension
  const name = filename.replace('.gif', '');
  
  // Extract resolution (last number after last dash)
  const lastDashIndex = name.lastIndexOf('-');
  if (lastDashIndex === -1) return null;
  
  const resolution = parseInt(name.substring(lastDashIndex + 1));
  const baseName = name.substring(0, lastDashIndex);
  
  if (isNaN(resolution)) return null;
  
  return {
    baseName,
    resolution
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
    if (!metadata) {
      return;
    }

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
  // Handle directory previews
  const directoryPreviews = files.filter(f => f.isDirectory);
  if (directoryPreviews.length > 0) {
    return directoryPreviews.map(dir => ({
      thumb: dir.thumbnails[0]?.thumb, // Use first thumbnail as preview
      thumbnails: dir.thumbnails,
      alt: dir.alt,
      isDirectory: true,
      directoryId: dir.directoryId
    }));
  }

  // Handle leaf directory files
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
  const { '*': pathParam = '' } = useParams();
  // Remove 'root' and any leading/trailing slashes
  const fullPath = pathParam
    .replace(/^root\/?/, '')  // Remove 'root/' prefix if present
    .replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
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
