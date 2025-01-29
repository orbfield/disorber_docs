// App.jsx
import React, { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SidebarProvider } from './components/layout/SidebarContext';

// Lazy load modules
const HomePage = lazy(() => import('./modules/Home'));
const FunctionsPage = lazy(() => import('./modules/Functions'));
const BinaryPage = lazy(() => import('./modules/Binary'));
const PatternsPage = lazy(() => import('./modules/Patterns'));
const LearningPage = lazy(() => import('./modules/Learning'));
const PracticePage = lazy(() => import('./modules/Practice'));
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
        path: "/functions",
        element: (
          <Suspense fallback={<Loading />}>
            <FunctionsPage />
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
        path: "/patterns",
        element: (
          <Suspense fallback={<Loading />}>
            <PatternsPage />
          </Suspense>
        ),
      },
      {
        path: "/learning",
        element: (
          <Suspense fallback={<Loading />}>
            <LearningPage />
          </Suspense>
        ),
      },
      {
        path: "/practice",
        element: (
          <Suspense fallback={<Loading />}>
            <PracticePage />
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
