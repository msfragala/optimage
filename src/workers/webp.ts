import { WebpEncoderOptions } from '@/lib/codecs/webp/webp_enc';
import { createLazyWorker } from '@/lib/lazy-worker';
import { CodecWorker } from '@/types/codec-worker';

export const webpWorker = createLazyWorker<CodecWorker<WebpEncoderOptions>>(
  () => import('./webp.worker?worker')
);
