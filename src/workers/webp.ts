import { WebpEncoderOptions } from '@/lib/codecs/webp/webp_enc';
import { CodecWorker } from '@/types/codec-worker';
import { Pool } from 'slother';

export const webpWorker = Pool.proxy<CodecWorker<WebpEncoderOptions>>(() =>
  import('./webp.worker?worker').then(w => new w.default())
);
