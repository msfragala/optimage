import encoder from '@/lib/codecs/mozjpeg/mozjpeg_enc';
import decoder from '@/lib/codecs/mozjpeg/mozjpeg_dec';
import { exposeCodec } from '@/lib/expose-codec';

exposeCodec({
  encoder,
  decoder,
  encoderDefaults: {
    quality: 75,
    baseline: false,
    arithmetic: false,
    progressive: true,
    optimize_coding: true,
    smoothing: 0,
    color_space: 3,
    quant_table: 3,
    trellis_multipass: false,
    trellis_opt_zero: false,
    trellis_opt_table: false,
    trellis_loops: 1,
    auto_subsample: true,
    chroma_subsample: 2,
    separate_chroma_quality: false,
    chroma_quality: 75,
  },
});
