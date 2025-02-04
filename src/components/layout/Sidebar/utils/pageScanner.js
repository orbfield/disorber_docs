const defaultIcons = {
  home: 'Home',
  image: 'Image',
  gallery: 'Gallery',
  binary: 'Binary',
  docs: 'BookOpen',
  settings: 'Settings'
};

export const scanPagesDirectory = async () => {
  const pageContext = require.context('../../../../Pages', true, /index\.(js|jsx|ts|tsx)$/);
  const paths = pageContext.keys();
  
  const tree = [];
  const processedDirs = new Set();

  // First pass: process Home if it exists
  paths.forEach(path => {
    const parts = path.replace(/^\.\//, '').split('/');
    parts.pop(); // Remove 'index.jsx'
    
    if (parts[0]?.toLowerCase() === 'home') {
      tree.push({
        id: 'home',
        text: 'Home',
        icon: defaultIcons['home'],
        isExpanded: false,
        children: []
      });
      processedDirs.add('home');
    }
  });

  // Second pass: process all other paths
  paths.forEach(path => {
    const parts = path.replace(/^\.\//, '').split('/');
    parts.pop(); // Remove 'index.jsx'
    
    let currentLevel = tree;
    let currentPath = '';

    parts.forEach(part => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      
      // Skip if it's Home or already processed
      if (part.toLowerCase() === 'home' || processedDirs.has(currentPath)) {
        return;
      }
      
      processedDirs.add(currentPath);
      
      const existingNode = currentLevel.find(node => node.id === part.toLowerCase());
      if (!existingNode) {
        const newNode = {
          id: currentPath.toLowerCase().replace(/\s+/g, '-'),
          text: part.charAt(0).toUpperCase() + part.slice(1),
          icon: defaultIcons[part.toLowerCase()] || 'Folder',
          isExpanded: false,
          children: [],
          path: currentPath.toLowerCase().replace(/\s+/g, '-')
        };
        currentLevel.push(newNode);
        currentLevel = newNode.children;
      } else {
        currentLevel = existingNode.children;
      }
    });
  });

  return tree;
};

export const getPageComponent = async (pagePath) => {
  try {
    const module = await import(`../../../../Pages/${pagePath}/index`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load page component: ${pagePath}`, error);
    return null;
  }
};
