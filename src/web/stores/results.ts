import { ImageUpload, OutputMimeType, Resource } from '@/common/types';
import { ConvertPayload } from '@/server/convert';
import { immutable } from 'ssws';
import { Upload } from './uploads';
import { nanoid } from 'nanoid';
import { sendJSON } from '../lib/send-json';

interface Target {
  id: string;
  width: number;
  type: OutputMimeType;
}

interface Result extends Resource<ImageUpload> {
  id: string;
}

type ResultsStore = Record<string, Result[]>;

const store = immutable<ResultsStore>({});

export const $results = {
  subscribe: store.subscribe,
  async startConversions(upload: Upload, widths: number[]) {
    const targets: Target[] = [];

    upload.targets.map(mimeType => {
      widths.map(width => {
        targets.push({
          id: nanoid(),
          type: mimeType,
          width,
        });
      });
    });

    store.update(s => {
      s[upload.original] = targets.map(target => ({
        id: target.id,
        status: 'pending',
      }));
    });

    return targets.map(target => {
      return sendJSON<ConvertPayload>('/api/convert', {
        source: upload.name!,
        id: upload.id!,
        type: target.type,
        width: target.width,
      })
        .then(res => res.json())
        .then((json: ImageUpload) => {
          store.update(s => {
            const resource = s[upload.original].find(t => t.id === target.id);
            if (!resource) return;
            resource.response = json;
            resource.status = 'success';
          });
        })
        .catch(error => {
          console.error(error);
          store.update(s => {
            const resource = s[upload.original].find(t => t.id === target.id);
            if (!resource) return;
            resource.status = 'error';
          });
        });
    });
  },
};
