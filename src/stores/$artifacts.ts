import {
  Extension,
  extensionMap,
  ImageType,
  targetTypesMap,
} from '@/constants/mime-types';
import { nanoid } from 'nanoid';
import { immutable } from 'ssws';
import { Source } from './$inputs';
import { encodeImage } from '@/lib/encode-image';
import { removeExtension } from '@/lib/remove-extension';
import { AsyncStatus } from '@/types/async-status';
import { resizeWorker } from '@/workers/resize';

export interface Target {
  type: ImageType;
  width: number;
}

export interface Artifact {
  id: string;
  type: ImageType;
  width: number;
  extension: Extension;
  sourceId: string;
  filename: `${string}.${number}${Extension}`;
  status: AsyncStatus;
  blob?: Blob;
}

const store = immutable<Record<string, Artifact>>({});

export const $artifacts = {
  subscribe: store.subscribe,
  reset() {
    store.update(() => ({}));
  },
  generate(sources: Source[], widths: number[]) {
    store.update(s => {
      sources.forEach(source => {
        const targets = deriveTargets(source.file.type, widths);
        targets.forEach(target => {
          const key = nanoid();
          const ext = extensionMap[target.type];
          s[key] = {
            id: key,
            type: target.type,
            width: target.width,
            sourceId: source.id,
            extension: ext,
            filename: `${removeExtension(source.file.name)}.${
              target.width
            }${ext}`,
            status: 'pending',
          };

          resizeWorker
            .resize({ imageData: source.decoded!, width: target.width })
            .then(resized => encodeImage(resized, target.type))
            .then(blob => {
              store.update(s => {
                s[key].blob = blob;
                s[key].status = 'success';
              });
            })
            .catch(error => {
              store.update(s => {
                console.error(error);
                s[key].status = 'error';
              });
            });
        });
      });
    });
  },
};

function deriveTargets(type: string, widths: number[]): Target[] {
  const types: Set<ImageType> = new Set([
    type as ImageType,
    'image/webp',
    'image/avif',
  ]);

  if (['image/avif', 'image/webp'].includes(type)) {
    types.add('image/png');
  }

  const targets: Target[] = [];

  targetTypesMap[type]?.forEach(type => {
    widths.forEach(width => {
      targets.push({ type, width });
    });
  });

  return targets;
}
