import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

const listeners = new Set<() => void>();

// In-memory fallback for when localStorage is unavailable (e.g. blocked by the
// browser), so settings still work for the current session
const memory = new Map<string, string>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function parseItem<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * State persisted in localStorage. Renders `fallback` on the server and during
 * hydration, then switches to the stored value. Also syncs across tabs.
 */
export function useLocalStorage<T>(key: string, fallback: T): [T, SetValue<T>] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readItem(key),
    () => null,
  );

  const value = useMemo(() => parseItem(raw, fallback), [raw, fallback]);

  const setValue = useCallback<SetValue<T>>(
    action => {
      const previous = parseItem(readItem(key), fallback);
      const next =
        typeof action === 'function'
          ? (action as (prev: T) => T)(previous)
          : action;

      const serialized = JSON.stringify(next);

      try {
        localStorage.setItem(key, serialized);
      } catch {
        memory.set(key, serialized);
      }

      listeners.forEach(listener => listener());
    },
    [key, fallback],
  );

  return [value, setValue];
}
