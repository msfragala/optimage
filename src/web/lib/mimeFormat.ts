import { Format } from '../../types/format';
import { MimeType } from '../../types/mime-type';

const m2f: Record<string, Format> = {
  'image/avif': 'avif',
  'image/heic': 'heic',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const f2m: Record<string, MimeType> = {
  avif: 'image/avif',
  heic: 'image/heic',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png',
  webp: 'image/webp',
};

export function mimeToFormat(type: MimeType | string): Format | undefined {
  return m2f[type] ?? undefined;
}

export function formatToMime(format: Format): MimeType {
  return f2m[format];
}
