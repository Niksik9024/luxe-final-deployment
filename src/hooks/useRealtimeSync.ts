'use client';

import { useEffect, useCallback } from 'react';

type RealtimeSyncCallback = (event: { key: string | null }) => void;

/**
 * A custom hook that listens for localStorage changes and triggers a callback.
 * This enables real-time data synchronization across different tabs and within the same tab.
 */
export function useRealtimeSync(callback: RealtimeSyncCallback) {
  useEffect(() => {
    // Handler for the native 'storage' event (for other tabs)
    const handleStorageChange = (event: StorageEvent) => {
      callback(event);
    };

    // Handler for the custom 'custom-storage' event (for the current tab)
    const handleCustomStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback({ key: customEvent.detail.key });
    };

    // Add both event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('custom-storage', handleCustomStorageChange);

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('custom-storage', handleCustomStorageChange);
    };
  }, [callback]);
}
