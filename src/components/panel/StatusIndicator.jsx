import React from 'react';
import { usePanelContext } from './index';

const StatusIndicator = () => {
  const { isLoading, error, status } = usePanelContext();

  if (error) {
    return (
      <div className="flex items-center px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-full text-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        <span>Error: {error}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-100 rounded-full text-sm">
        <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
        <span>{status}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-full text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
      <span>Panel Ready</span>
    </div>
  );
};

export default StatusIndicator;
