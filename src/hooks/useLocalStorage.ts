'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [isHydrated, setIsHydrated] = useState(false);
  const cachedValue = useRef<{ raw: string | null; parsed: T }>({
    raw: null,
    parsed: initialValue,
  });

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === key) onStoreChange();
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== cachedValue.current.raw) {
        cachedValue.current = {
          raw: item,
          parsed: item ? (JSON.parse(item) as T) : initialValue,
        };
      }
      return cachedValue.current.parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const currentValue = cachedValue.current.parsed;
        const valueToStore =
          value instanceof Function ? value(currentValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(valueToStore),
          }),
        );
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  return [storedValue, setValue, isHydrated];
}
