import { MimeType } from './types';

export function mimeTypeToExtension(mimeType: string): string {
  switch (mimeType) {
    case 'image/avif':
      return 'avif';
    case 'image/heic':
      return 'heic';
    case 'image/jpeg':
      return 'jpeg';
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return '';
  }
}
