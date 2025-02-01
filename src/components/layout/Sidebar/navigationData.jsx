export const createEnhancedNavItems = (sideNavItems) => [
    {
      ...sideNavItems[0], // Home
      isExpanded: false,
      children: []
    },
    {
      ...sideNavItems[1], // Image
      isExpanded: false,
      children: [
        {
          text: 'Image Processing',
          icon: '🖼️',
          children: [
            {
              text: 'Filters',
              icon: '🎨',
              children: []
            },
            {
              text: 'Effects',
              icon: '✨',
              children: []
            }
          ]
        }
      ]
    },
    {
      ...sideNavItems[2], // Gif
      isExpanded: false,
      children: [
        {
          text: 'Animation Tools',
          icon: '🎬',
          children: [
            {
              text: 'Frame Editor',
              icon: '🎞️',
              children: []
            }
          ]
        }
      ]
    },
    {
      ...sideNavItems[3], // Binary
      isExpanded: false,
      children: [
        {
          text: 'Converters',
          icon: '🔄',
          children: []
        },
        {
          text: 'Analyzers',
          icon: '🔍',
          children: []
        }
      ]
    },
    {
      ...sideNavItems[4], // Docs
      isExpanded: false,
      children: [
        {
          text: 'Guides',
          icon: '📚',
          children: []
        },
        {
          text: 'API Reference',
          icon: '📑',
          children: []
        }
      ]
    },
    {
      ...sideNavItems[5], // Settings
      isExpanded: false,
      children: [
        {
          text: 'Preferences',
          icon: '⚙️',
          children: []
        },
        {
          text: 'Theme',
          icon: '🎨',
          children: []
        }
      ]
    }
  ];
  
  export const createInitialTreeData = (enhancedNavItems, activeSection) => [
    ...enhancedNavItems.map(item => ({
      ...item,
      isActive: activeSection === item.id,
    })),
    {
      text: 'Site Modules',
      icon: '📁',
      isExpanded: false,
      children: [
        {
          text: 'Data Analysis',
          icon: '📊',
          isExpanded: false,
          children: [
            {
              text: 'Visualizations',
              icon: '📈',
              children: []
            }
          ]
        },
        {
          text: 'Math Models',
          icon: '🔢',
          children: []
        }
      ]
    }
  ];