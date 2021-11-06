import { useEffect, useState } from 'preact/hooks';
import { get, Readable } from 'ssws';

export function useStore<T>(store: Readable<T>): T;
export function useStore<T, S>(
  store: Readable<T>,
  selector: (state: T) => S
): S;
export function useStore<T, S>(
  store: Readable<T>,
  selector?: (state: T) => S
): T | S {
  const [state, setState] = useState(() => {
    const s = get(store);
    return selector ? selector(s) : s;
  });

  useEffect(() => {
    return store.subscribe(s => {
      const next = selector ? selector(s) : s;
      setState(next);
    });
  }, [selector, store]);

  return state;
}
