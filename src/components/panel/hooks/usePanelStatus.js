import { usePanelContext } from '../index';

export const usePanelStatus = () => {
  const { isLoading, error, status } = usePanelContext();

  return {
    isReady: !isLoading && !error,
    isLoading,
    error,
    status,
    buttonProps: {
      disabled: isLoading || !!error,
      title: error 
        ? `Panel error: ${error}`
        : isLoading 
        ? status 
        : undefined
    }
  };
};
