import encoder from '@/codecs/avif/avif_enc';
import decoder from '@/codecs/avif/avif_dec';
import { exposeCodec } from '@/lib/expose-codec';

exposeCodec({
  encoder,
  decoder,
  encoderDefaults: {
    cqLevel: 33,
    cqAlphaLevel: -1,
    denoiseLevel: 0,
    tileColsLog2: 0,
    tileRowsLog2: 0,
    speed: 6,
    subsample: 1,
    chromaDeltaQ: false,
    sharpness: 0,
    tune: 0,
  },
});
