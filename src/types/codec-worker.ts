export type CodecWorker<O> = {
  encode(payload: {
    source: ImageData;
    options?: Partial<O>;
  }): Promise<Uint8Array | null>;
  decode(payload: { blob: File | Blob }): Promise<ImageData | null>;
};
