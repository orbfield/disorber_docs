import React, { useEffect, useState, createContext, useContext } from 'react';
import { WindowWrapper } from '../window/wrapper';

// Create context for Pyodide worker management
const PanelContext = createContext();

export const usePanelContext = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanelContext must be used within a PanelProvider');
  }
  return context;
};

// Provider component for managing Pyodide worker lifecycle
export const PanelProvider = ({ children }) => {
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Create worker and handle initialization
    const pyodideWorker = new Worker(new URL('../../workers/pyodide.worker.js', import.meta.url));

    pyodideWorker.onmessage = (event) => {
      const { type, error } = event.data;
      if (type === 'ready') {
        setIsReady(true);
        setError(null);
      } else if (type === 'error') {
        setError(error);
      }
    };

    setWorker(pyodideWorker);

    // Cleanup worker on unmount
    return () => {
      pyodideWorker.terminate();
    };
  }, []);

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-medium">
          {isReady ? 'Ready' : 'Loading Pyodide...'}
        </div>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );

  return (
    <PanelContext.Provider value={{ worker, error, isReady }}>
      {!isReady && <LoadingIndicator />}
      {children}
    </PanelContext.Provider>
  );
};

// Panel window component for visualization
export const PanelWindow = ({ 
  id, 
  initialPosition = { x: 100, y: 100 },
  title = "Panel Visualization",
  pythonCode,
  className = ""
}) => {
  const { worker, error: contextError, isReady } = usePanelContext();
  const [error, setError] = useState(null);
  const [output, setOutput] = useState(null);
  const targetId = `panel-${id}`;

  useEffect(() => {
    if (!worker || !isReady || !pythonCode) return;

    const messageHandler = (event) => {
      const { type, result, error, id: messageId } = event.data;
      if (messageId !== targetId) return;

      if (type === 'result') {
        const targetDiv = document.getElementById(targetId);
        if (targetDiv && typeof result === 'string' && result.trim().startsWith('<')) {
          targetDiv.innerHTML = result;
          setError(null);
        } else {
          setOutput(result);
          setError(null);
        }
      } else if (type === 'error') {
        setError(error);
      }
    };

    worker.addEventListener('message', messageHandler);

    // Execute Python code in worker
    worker.postMessage({
      type: 'execute',
      code: `
import panel as pn
import numpy as np

target = js.document.getElementById("${targetId}")
if target:
    target.innerHTML = ""

${pythonCode}
      `,
      id: targetId
    });

    return () => {
      worker.removeEventListener('message', messageHandler);
    };
  }, [worker, isReady, pythonCode, targetId]);

  const renderContent = () => {
    if (contextError || error) {
      return (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
          <div className="font-bold">Error:</div>
          <div className="text-sm mt-1">{contextError || error}</div>
        </div>
      );
    }

    if (!isReady) {
      return (
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    return (
      <div 
        id={targetId}
        className="min-h-[200px] min-w-[300px]"
      >
        {output && <pre>{output}</pre>}
      </div>
    );
  };

  return (
    <WindowWrapper
      id={id}
      initialPosition={initialPosition}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <div data-window-header className="p-2 cursor-move bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
        <span>{title}</span>
      </div>
      <div className="p-4">
        {renderContent()}
      </div>
    </WindowWrapper>
  );
};
