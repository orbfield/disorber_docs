import React, { lazy, Suspense, useState, useEffect } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { SidebarProvider } from './components/layout/SidebarContext';
import { NavProvider } from './components/layout/Sidebar/NavContext';
import { scanMediaDirectory } from './media/mediaScanner';

const DynamicGalleryPage = lazy(() => import('./Pages/DynamicGallery'));
const PyodideTestPage = lazy(() => import('./components/PyodideTest'));

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );
};

const App = () => {
  const [router, setRouter] = useState(null);
  const [mediaTree, setMediaTree] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        const mediaTreeData = await scanMediaDirectory();
        
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
          children: [
            {
              path: "/gallery/*",
              element: (
                <Suspense fallback={<Loading />}>
                  <DynamicGalleryPage />
                </Suspense>
              )
            },
            {
              path: "/pyodide-test",
              element: (
                <Suspense fallback={<Loading />}>
                  <PyodideTestPage />
                </Suspense>
              )
            }
          ]
        }];

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
        
        setRouter(newRouter);
      } catch (error) {
        throw error;
      }
    };
    initApp();
  }, []);

  if (!router || !mediaTree) {
    return <Loading />;
  }
  return <RouterProvider router={router} />;
};

export default App;