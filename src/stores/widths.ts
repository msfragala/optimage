import { writable } from 'svelte/store';

const store = writable([400, 800, 1200]);

export const widths$ = {
  subscribe: store.subscribe,
  add(value: number) {
    store.update(state => state.concat(value).sort((a, b) => a - b));
  },
  remove(value: number) {
    store.update(state => state.filter(x => x !== value));
  },
  reset() {
    store.set([]);
  },
};
