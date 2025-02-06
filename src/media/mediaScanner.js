const defaultIcons = {
  image: 'Image',
  video: 'Video',
  gif: 'Play',
  folder: 'Folder'
};

const getFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    case 'mp4':
    case 'webm':
      return 'video';
    case 'gif':
      return 'gif';
    default:
      return 'unknown';
  }
};

export const scanMediaDirectory = async () => {
  const mediaContext = require.context('./', true, /\.(jpg|jpeg|png|gif|mp4|webm)$/);
  const paths = mediaContext.keys();

  const tree = [];
  const processedDirs = new Set();

  paths.forEach(path => {
    const parts = path.replace(/^\.\//, '').split('/');
    const filename = parts.pop(); // Remove the actual file name
    
    let currentLevel = tree;
    let currentPath = '';

    // Process directories
    parts.forEach(part => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      // Find existing node at current level
      const existingNode = currentLevel.find(node => node.id === part.toLowerCase());

      if (existingNode) {
        // If node exists, just update current level to its children
        currentLevel = existingNode.children;
      } else {
        // If node doesn't exist, create it
        const newNode = {
          id: part.toLowerCase(),
          text: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
          icon: defaultIcons.folder,
          isExpanded: false,
          children: [],
          path: currentPath.toLowerCase().replace(/\s+/g, '-')
        };
        currentLevel.push(newNode);
        currentLevel = newNode.children;
        processedDirs.add(currentPath);
      }
    });

    // Add the file as a leaf node
    if (filename) {
      const fileType = getFileType(filename);
      currentLevel.push({
        id: `${currentPath}/${filename}`.toLowerCase().replace(/\s+/g, '-'),
        text: filename,
        icon: defaultIcons[fileType] || defaultIcons.folder,
        path: `${currentPath}/${filename}`.toLowerCase().replace(/\s+/g, '-'),
        type: fileType
      });
    }
  });

  return tree;
};

export const getMediaUrl = (mediaPath) => {
  try {
    return require(`./${mediaPath}`);
  } catch (error) {
    return null;
  }
};
