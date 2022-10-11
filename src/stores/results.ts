import { writable, get } from 'svelte/store';
import { nanoid } from 'nanoid';
import { Type } from '@/constants/types';
import { blobs } from './blobs';

export type Result = {
  id: string;
  source: string;
  filename: string;
  type: Type;
  width: number;
  status: 'pending' | 'success' | 'error';
  blob?: Blob;
  url?: string;
};

const store = writable<Result[]>([]);

export const results$ = {
  subscribe: store.subscribe,
  add(
    inputs: {
      source: string;
      filename: string;
      type: Type;
      width: number;
    }[]
  ) {
    const items: Result[] = inputs.map(input => ({
      ...input,
      id: nanoid(),
      status: 'pending',
    }));

    store.update(state => state.concat(items));

    return items;
  },
  updateResult(id: string, values: Partial<Result>) {
    store.update(items =>
      items.map(item => {
        if (item.id === id) return { ...item, ...values };
        return item;
      })
    );
  },
  remove(id: string) {
    store.update(state => state.filter(r => r.id !== id));
  },
  reset() {
    get(results$).forEach(result => {
      URL.revokeObjectURL(result.url);
      blobs.delete(result.id);
    });

    store.set([]);
  },
};
