// App.jsx
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { SidebarProvider } from './components/layout/SidebarContext';
import { NavProvider } from './components/layout/Sidebar/NavContext';
import { scanMediaDirectory } from './media/mediaScanner';

const DynamicGalleryPage = lazy(() => import('./Pages/DynamicGallery'));

// Add timestamp to loading component for tracking mount/unmount
const Loading = () => {
  console.log(`[${new Date().toISOString()}] Loading component rendered`);
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );
};

const App = () => {
  console.log('[App] Component mounted');
  const [router, setRouter] = useState(null);
  const [mediaTree, setMediaTree] = useState(null);

  useEffect(() => {
    console.log('[App] Starting initialization');
    
    const initApp = async () => {
      try {
        console.log('[App] Scanning media directory...');
        const mediaTreeData = await scanMediaDirectory();
        console.log('[App] Media tree loaded:', mediaTreeData);
        
        // Add a top-level Gallery node to contain media items
        const navigationTree = [{
          id: 'gallery',
          text: 'Gallery',
          icon: 'Image',
          isExpanded: false,
          children: mediaTreeData,
          path: 'gallery'
        }];
        
        setMediaTree(navigationTree);
        
        const routes = [{
          path: "/",
          element: (
            <NavProvider initialTree={navigationTree}>
              <SidebarProvider>
                <Layout />
              </SidebarProvider>
            </NavProvider>
          ),
          children: [{
            path: "/gallery/:path/*",
            element: (
              <Suspense fallback={<Loading />}>
                <DynamicGalleryPage />
              </Suspense>
            )
          }]
        }];

        console.log('[App] Creating router with routes:', routes);
        const newRouter = createHashRouter(routes, {
          future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true
          }
        });
        
        console.log('[App] Router created successfully');
        setRouter(newRouter);
      } catch (error) {
        console.error('[App] Failed to initialize app:', error);
      }
    };

    initApp();
  }, []);

  if (!router || !mediaTree) {
    console.log('[App] Waiting for initialization. Router:', !!router, 'MediaTree:', !!mediaTree);
    return <Loading />;
  }

  console.log('[App] Rendering RouterProvider');
  return <RouterProvider router={router} />;
};

export default App;
