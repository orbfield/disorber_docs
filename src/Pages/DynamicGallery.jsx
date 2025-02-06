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

/**
 * Gets a random 50px thumbnail from a directory's files
 * @param {Array} files - Array of files
 * @returns {Object|null} Random 50px thumbnail file or null
 */
const getRandomThumbnail = (files) => {
  const thumbnails = files.filter(file => {
    const metadata = parseGifFilename(file.text);
    return metadata && metadata.resolution === 50;
  });
  return thumbnails.length > 0 ? thumbnails[Math.floor(Math.random() * thumbnails.length)] : null;
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
      .map(dir => {
        const allFiles = findAllGifFiles([dir]);
        const thumbnail = getRandomThumbnail(allFiles);
        if (!thumbnail) return null;
        
        return {
          ...thumbnail,
          isDirectoryPreview: true,
          directoryId: dir.id,
          directoryName: dir.text
        };
      })
      .filter(Boolean); // Remove nulls
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
  console.log('Grouping files:', files);
  const groups = {};

  files.forEach(file => {
    console.log('Processing file:', file.text);
    const metadata = parseGifFilename(file.text);
    console.log('Parsed metadata:', metadata);
    if (!metadata) {
      console.log('Skipping file - no metadata');
      return;
    }

    const { baseName, resolution } = metadata;
    if (!groups[baseName]) {
      groups[baseName] = { variants: {} };
    }

    const sizeCategory = RESOLUTIONS[resolution] || 'custom';
    console.log('File categorization:', {
      baseName,
      resolution,
      sizeCategory,
      path: file.path
    });
    
    groups[baseName].variants[sizeCategory] = {
      path: file.path,
      resolution
    };
  });

  console.log('Final groups:', groups);
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
  const directoryPreviews = files.filter(f => f.isDirectoryPreview);
  if (directoryPreviews.length > 0) {
    return directoryPreviews.map(file => ({
      thumb: getMediaUrl(file.path),
      full: getMediaUrl(file.path),
      alt: file.directoryName,
      title: file.directoryName,
      isDirectory: true,
      directoryId: file.directoryId
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
        console.log('Loading gallery for path:', fullPath);
        const tree = await scanMediaDirectory();
        console.log('Media tree:', tree);
        const mediaFiles = extractMediaFiles(tree, fullPath);
        console.log('Extracted media files:', mediaFiles);
        const processedImages = processMediaFiles(mediaFiles);
        console.log('Processed images:', processedImages);
        setImages(processedImages);
      } catch (error) {
        console.error('Failed to load gallery images:', error);
        setImages([]);
      }
    };
   
    loadImages();
  }, [fullPath]);

  // Add debug render to show current state
  console.log('Rendering gallery with images:', images);

  return (
    <WindowProvider>
      <div className="flex flex-col items-center gap-4">
        <Gallery images={images} />
      </div>
    </WindowProvider>
  );
};

export default DynamicGalleryPage;
