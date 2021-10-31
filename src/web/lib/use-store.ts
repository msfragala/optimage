import { Accessor, createSignal } from 'solid-js';
import { get, Readable } from 'ssws';

export function useStore<T>(store: Readable<T>): Accessor<T>;
export function useStore<T, S>(
  store: Readable<T>,
  selector: (state: T) => S
): Accessor<S>;
export function useStore<T, S>(
  store: Readable<T>,
  selector?: (state: T) => S
): Accessor<T | S> {
  if (selector) {
    const initial = selector(get(store));
    const [state, setState] = createSignal<S>(initial);
    store.subscribe(s => {
      setState(() => selector(s));
    });
    return state;
  } else {
    const initial = get(store);
    const [state, setState] = createSignal<T>(initial);
    store.subscribe(s => {
      setState(() => s);
    });
    return state;
  }
}
