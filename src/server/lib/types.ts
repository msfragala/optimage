export interface FileUpload {
  buffer: Buffer;
  fileName: string;
  encoding: string;
  mimeType: string;
}

export type WorkerResponse<T> = Promise<{ payload: T } | { error: string }>;
