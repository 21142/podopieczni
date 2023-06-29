import Router from 'next/router';
import { useEffect, useState } from 'react';

export const usePageLoading = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const toggleLoading = () => setIsPageLoading(true);
    const stopLoading = () => setIsPageLoading(false);

    Router.events.on('routeChangeStart', toggleLoading);
    Router.events.on('routeChangeComplete', stopLoading);
    Router.events.on('routeChangeError', stopLoading);

    return () => {
      Router.events.off('routeChangeStart', toggleLoading);
      Router.events.off('routeChangeComplete', stopLoading);
      Router.events.off('routeChangeError', stopLoading);
    };
  }, []);

  return { isPageLoading };
};
