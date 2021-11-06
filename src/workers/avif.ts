import { AvifEncoderOptions } from '@/lib/codecs/avif/avif_enc';
import { createLazyWorker } from '@/lib/lazy-worker';
import { CodecWorker } from '@/types/codec-worker';

export const avifWorker = createLazyWorker<CodecWorker<AvifEncoderOptions>>(
  () => import('./avif.worker?worker')
);
