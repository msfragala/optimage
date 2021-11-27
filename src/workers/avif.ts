import { AvifEncoderOptions } from '@/lib/codecs/avif/avif_enc';
import { CodecWorker } from '@/types/codec-worker';
import { Pool } from 'slother';

export const avifWorker = Pool.proxy<CodecWorker<AvifEncoderOptions>>(() =>
  import('./avif.worker?worker').then(w => new w.default())
);
