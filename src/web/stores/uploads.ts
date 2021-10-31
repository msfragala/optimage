import { OutputMimeType } from '@/common/types';
import { UploadResponse } from '@/server/upload';
import { immutable } from 'ssws';

export interface Upload {
  status: 'pending' | 'success' | 'error';
  original: string;
  targets: OutputMimeType[];
  id?: string;
  name?: string;
}

interface UploadsStore {
  [key: string]: Upload;
}

const store = immutable<UploadsStore>({});

export const $uploads = {
  subscribe: store.subscribe,
  async uploadFile(file: File) {
    const body = new FormData();
    body.append('image', file);

    store.update(s => {
      s[file.name] = {
        status: 'pending',
        original: file.name,
        targets: [],
      };
    });

    fetch('/api/upload', {
      method: 'POST',
      body,
    })
      .then(res => res.json())
      .then((json: UploadResponse) => {
        store.update(s => {
          s[file.name].status = 'success';
          s[file.name].id = json.id;
          s[file.name].name = json.name;
          s[file.name].targets = json.targets;
        });
      })
      .catch(error => {
        console.error(error);
        store.update(s => {
          s[file.name].status = 'error';
        });
      });
  },
};
