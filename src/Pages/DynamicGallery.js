import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Gallery } from '../components/gallery';
import { WindowProvider } from '../components/window';
import { scanMediaDirectory, getMediaUrl } from '../media/mediaScanner';

const RESOLUTIONS = {
  50: 'small',
  300: 'medium',
  1000: 'large'
};

const DynamicGalleryPage = () => {
  const { path = '', '*': rest } = useParams();
  // Remove 'gallery' from the start of the path if it exists
  const cleanPath = path.startsWith('gallery/') ? path.substring(7) : path;
  const fullPath = rest ? `${cleanPath}/${rest}` : cleanPath;
  const [images, setImages] = useState([]);
 
  useEffect(() => {
    const loadImages = async () => {
      console.group('Media Directory Scan');
      console.log('Scanning path:', fullPath);
     
      const tree = await scanMediaDirectory();
      console.log('Full directory tree:', tree);
     
      const mediaFiles = extractMediaFiles(tree, fullPath);
      console.log('Extracted media files:', mediaFiles);
     
      const processedImages = processFiles(mediaFiles);
      console.log('Processed images:', processedImages);
     
      console.groupEnd();
      setImages(processedImages);
    };
   
    loadImages();
  }, [fullPath]);

  const extractMediaFiles = (nodes, targetPath) => {
    const files = nodes.flatMap(node => {
      if (node.path.startsWith(targetPath)) {
        return node.type ? [node] : (node.children ? extractMediaFiles(node.children, targetPath) : []);
      }
      return [];
    });

    console.group('File Extraction');
    console.log('Found files:', files.map(f => f.text).join(', '));
    console.groupEnd();
    return files;
  };

  const processFiles = (files) => {
    const groups = {};
   
    console.group('File Processing');
   
    files.forEach(file => {
      if (!file.text.endsWith('.gif')) return;
     
      // Split filename: "1-0.2-50.gif" -> ["1-0.2", "50"]
      const [baseName, resolution] = file.text.replace('.gif', '').split('-').slice(-2);
      const res = parseInt(resolution);
      
      console.log(`Processing: ${file.text}`, { baseName, resolution });
     
      if (!groups[baseName]) {
        groups[baseName] = {
          variants: {}
        };
      }

      // Determine if this is a standard resolution or custom
      const sizeCategory = RESOLUTIONS[res] || 'custom';
      groups[baseName].variants[sizeCategory] = {
        path: file.path,
        resolution: res
      };
    });

    console.log('Grouped files:', groups);
   
    const processed = Object.entries(groups)
      .filter(([_, versions]) => versions.variants.small) // Ensure thumbnail exists
      .map(([baseName, versions]) => ({
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
      }));

    console.log('Final processed images:', processed);
    console.groupEnd();
    return processed;
  };

  return (
    <WindowProvider>
      <div className="flex flex-col items-center gap-4">
        <Gallery images={images} />
      </div>
    </WindowProvider>
  );
};

export default DynamicGalleryPage;
