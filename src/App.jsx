// App.jsx
import React, { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import { createHashRouter, RouterProvider } from 'react-router-dom'; 
import { SidebarProvider } from './components/layout/SidebarContext';

// Lazy load modules
const HomePage = lazy(() => import('./modules/Home'));
const ImagesPage = lazy(() => import('./modules/Image'));
const GifPage = lazy(() => import('./modules/Gif'));
const BinaryPage = lazy(() => import('./modules/Binary'));
const DocsPage = lazy(() => import('./modules/Docs'));
const SettingsPage = lazy(() => import('./modules/Settings'));

const Loading = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
  </div>
);

const router = createHashRouter([
  {
    path: "/",
    element: (
      <SidebarProvider>
        <Layout />
      </SidebarProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/image",
        element: (
          <Suspense fallback={<Loading />}>
            <ImagesPage />
          </Suspense>
        ),
      },
      {
        path: "/gif",
        element: (
          <Suspense fallback={<Loading />}>
            <GifPage />
          </Suspense>
        ),
      },
      {
        path: "/binary",
        element: (
          <Suspense fallback={<Loading />}>
            <BinaryPage />
          </Suspense>
        ),
      },
      {
        path: "/docs",
        element: (
          <Suspense fallback={<Loading />}>
            <DocsPage />
          </Suspense>
        ),
      },

      {
        path: "/settings",
        element: (
          <Suspense fallback={<Loading />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
