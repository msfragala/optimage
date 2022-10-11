import { Squoll } from 'squoll';

import avif_dec from 'squoll/codecs/avif_dec.wasm?url';
import avif_enc from 'squoll/codecs/avif_enc.wasm?url';
import mozjpeg_dec from 'squoll/codecs/mozjpeg_dec.wasm?url';
import mozjpeg_enc from 'squoll/codecs/mozjpeg_enc.wasm?url';
import resize_bg from 'squoll/codecs/resize_bg.wasm?url';
import oxipng_bg from 'squoll/codecs/oxipng_bg.wasm?url';
import png_bg from 'squoll/codecs/png_bg.wasm?url';
import webp_dec from 'squoll/codecs/webp_dec.wasm?url';
import webp_enc from 'squoll/codecs/webp_enc.wasm?url';
import SquollWorker from 'squoll/worker?worker';

export const squoll = new Squoll({
  worker: async () => new SquollWorker(),
  wasmBinaries: {
    avif_dec,
    avif_enc,
    mozjpeg_dec,
    mozjpeg_enc,
    webp_dec,
    webp_enc,
    oxipng_bg,
    png_bg,
    resize_bg,
  },
});
