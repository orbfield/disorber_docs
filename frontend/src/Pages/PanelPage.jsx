import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const PanelPage = () => {
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const loadPanel = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/panel-test/');
        const html = await response.text();
        
        // Create a temporary container to parse the HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;

        // Extract scripts
        const scripts = Array.from(tempContainer.getElementsByTagName('script'));
        
        // Extract styles
        const styles = Array.from(tempContainer.getElementsByTagName('style'));
        
        // Append styles to document head
        styles.forEach(style => {
          document.head.appendChild(style.cloneNode(true));
        });

        // Add content to our container
        if (containerRef.current) {
          containerRef.current.innerHTML = tempContainer.innerHTML;
        }

        // Execute scripts in order
        for (const script of scripts) {
          const newScript = document.createElement('script');
          Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.textContent = script.textContent;
          document.body.appendChild(newScript);
        }
      } catch (error) {
        console.error('Failed to load Panel content:', error);
      }
    };

    loadPanel();

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [location.pathname]);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="panel-container" />
    </div>
  );
};

export default PanelPage;
