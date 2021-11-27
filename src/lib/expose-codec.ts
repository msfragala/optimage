import { expose } from 'slother';
import { CodecWorker } from '../types/codec-worker';

interface Encoder<Options> {
  encode(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options: Options
  ): Uint8Array | null;
}

interface Decoder {
  decode(data: BufferSource): ImageData | null;
}

export function exposeCodec<
  Enc extends EmscriptenWasm.Module & Encoder<O>,
  Dec extends EmscriptenWasm.Module & Decoder,
  O
>({
  encoder,
  decoder,
  encoderDefaults,
}: {
  encoder: EmscriptenWasm.ModuleFactory<Enc>;
  decoder: EmscriptenWasm.ModuleFactory<Dec>;
  encoderDefaults: O;
}) {
  const worker: CodecWorker<O> = {
    async encode({
      source,
      options = {},
    }: {
      source: ImageData;
      options?: Partial<O>;
    }): Promise<Uint8Array | null> {
      const encodeOptions = { ...encoderDefaults, ...options };
      return encoder().then(m => {
        return m.encode(
          source.data,
          source.width,
          source.height,
          encodeOptions
        );
      });
    },
    async decode({ blob }: { blob: File | Blob }): Promise<ImageData | null> {
      const buffer = await blob.arrayBuffer();
      return decoder().then(m => m.decode(buffer));
    },
  };

  expose(worker);
}
