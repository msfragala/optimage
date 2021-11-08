import { decodeImage } from '@/lib/decode-image';
import { AsyncStatus } from '@/types/async-status';
import { nanoid } from 'nanoid';
import { immutable } from 'ssws';

export interface Source {
  id: string;
  file: File;
  decoded?: ImageData;
  decodingStatus: AsyncStatus;
}

interface InputsStore {
  widths: number[];
  sources: Record<string, Source>;
}

const store = immutable<InputsStore>({
  sources: {},
  widths: [400, 800, 1200],
});

export const $inputs = {
  subscribe: store.subscribe,
  addWidth(width: number) {
    store.update(s => {
      s.widths.push(width);
    });
  },
  removeWidth(width: number) {
    store.update(s => {
      s.widths = s.widths.filter(w => w !== width);
    });
  },
  addSource(file: File) {
    const id = nanoid();
    store.update(s => {
      s.sources[id] = {
        id,
        file,
        decodingStatus: 'idle',
      };
    });

    decodeImage(file)
      .then(data => {
        store.update(s => {
          s.sources[id].decoded = data;
          s.sources[id].decodingStatus = 'success';
        });
      })
      .catch(error => {
        console.error(error);
        store.update(s => {
          s.sources[id].decodingStatus = 'error';
        });
      });
  },
  removeSource(id: string) {
    store.update(s => {
      delete s.sources[id];
    });
  },
  reset() {
    store.update(s => {
      s.sources = {};
      s.widths = [400, 800, 1200];
    });
  },
};
