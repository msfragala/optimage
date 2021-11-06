import { MozJpegEncoderOptions } from '@/lib/codecs/mozjpeg/mozjpeg_enc';
import { createLazyWorker } from '@/lib/lazy-worker';
import { CodecWorker } from '@/types/codec-worker';

export const mozWorker = createLazyWorker<CodecWorker<MozJpegEncoderOptions>>(
  () => import('./moz.worker?worker')
);
