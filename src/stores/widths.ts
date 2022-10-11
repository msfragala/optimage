import { writable } from 'svelte/store';

let initialValue = [400, 800, 1200];

const storedValue = JSON.parse(localStorage.getItem('widths'));

if (Array.isArray(storedValue) && storedValue.every(n => Number.isInteger(n))) {
  initialValue = storedValue;
}

const store = writable(initialValue);

export const widths$ = {
  subscribe: store.subscribe,
  add(value: number) {
    store.update(state => {
      const next = state.concat(value).sort((a, b) => a - b);
      localStorage.setItem('widths', JSON.stringify(next));
      return next;
    });
  },
  remove(value: number) {
    store.update(state => {
      const next = state.filter(x => x !== value);
      localStorage.setItem('widths', JSON.stringify(next));
      return next;
    });
  },
  reset() {
    store.set([]);
  },
};
