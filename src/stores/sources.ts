import { writable } from 'svelte/store';
import { nanoid } from 'nanoid';
import { processSource } from '@/lib/process-source';

export type Source = {
  id: string;
  file: File;
};

const store = writable<Source[]>([]);

export const sources$ = {
  subscribe: store.subscribe,
  add(files: File[]) {
    store.update(state => {
      const next = Array.from(state);

      files.forEach(file => {
        if (state.some(s => compareFile(s.file, file))) return;
        const source = { id: nanoid(), file };
        next.push(source);
        processSource(source);
      });

      return next;
    });
  },
  remove(id: string) {
    store.update(state => state.filter(f => f.id !== id));
  },
  reset() {
    store.set([]);
  },
};

function compareFile(a, b) {
  return (
    a.name === b.name &&
    a.lastModified === b.lastModified &&
    a.size === b.size &&
    a.type === b.type
  );
}
