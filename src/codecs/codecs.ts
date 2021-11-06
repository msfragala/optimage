import type { AvifEncoderOptions } from '@/codecs/avif/avif_enc';
import type { MozJpegEncoderOptions } from '@/codecs/mozjpeg/mozjpeg_enc';
import type { WebpEncoderOptions } from '@/codecs/webp/webp_enc';
import { createLazyWorker } from '@/lib/lazy-worker';
import { Remote, wrap } from 'comlink';

interface CodecWorker<O> {
  encode(source: ImageData, options?: Partial<O>): Promise<Uint8Array | null>;
  decode(blob: File | Blob): Promise<ImageData | null>;
}

type WebpWorker = CodecWorker<WebpEncoderOptions>;
type AvifWorker = CodecWorker<AvifEncoderOptions>;
type MozWorker = CodecWorker<MozJpegEncoderOptions>;

export const codecs = {
  webp: createLazyWorker<WebpWorker>(() => import('./webp.worker?worker')),
  avif: createLazyWorker<AvifWorker>(() => import('./avif.worker?worker')),
  moz: createLazyWorker<MozWorker>(() => import('./moz.worker?worker')),
};
