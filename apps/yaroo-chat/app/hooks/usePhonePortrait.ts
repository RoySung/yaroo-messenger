import { useSyncExternalStore } from 'react';

export const PHONE_PORTRAIT_QUERY = '(max-width: 767px) and (orientation: portrait)';

const getServerSnapshot = () => false;

const getSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia(PHONE_PORTRAIT_QUERY).matches;

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia(PHONE_PORTRAIT_QUERY);

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onStoreChange);
    return () => mediaQuery.removeEventListener('change', onStoreChange);
  }

  mediaQuery.addListener(onStoreChange);
  return () => mediaQuery.removeListener(onStoreChange);
};

export const usePhonePortrait = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
