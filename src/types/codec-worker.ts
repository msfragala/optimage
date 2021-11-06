export interface CodecWorker<O> {
  encode(source: ImageData, options?: Partial<O>): Promise<Uint8Array | null>;
  decode(blob: File | Blob): Promise<ImageData | null>;
}

export interface EncoderWorkerPayload {
  source: ImageData;
}

export interface DecoderWorkerPayload {
  blob: File | Blob;
}
