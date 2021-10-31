import { Format, MimeType } from './types';

export function formatToMime(format: Format | string): MimeType | undefined {
  switch (format) {
    case 'avif':
      return 'image/avif';
    case 'heic':
      return 'image/heic';
    case 'jpeg':
      return 'image/jpeg';
    case 'jpg':
      return 'image/jpg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return;
  }
}
