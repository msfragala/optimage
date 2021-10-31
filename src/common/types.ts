export type MimeType =
  | 'image/avif'
  | 'image/heic'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'image/webp';

export type OutputMimeType = Exclude<MimeType, 'image/heic'>;

export interface ImageUpload {
  filename: string;
  type: MimeType;
  size: number;
  width: number;
}

export type ResourceStatus = 'idle' | 'pending' | 'success' | 'error';

export interface Resource<T> {
  status: ResourceStatus;
  response?: T;
}
