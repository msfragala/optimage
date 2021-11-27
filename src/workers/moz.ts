import { MozJpegEncoderOptions } from '@/lib/codecs/mozjpeg/mozjpeg_enc';
import { CodecWorker } from '@/types/codec-worker';
import { Pool } from 'slother';

export const mozWorker = Pool.proxy<CodecWorker<MozJpegEncoderOptions>>(() =>
  import('./moz.worker?worker').then(w => new w.default())
);
