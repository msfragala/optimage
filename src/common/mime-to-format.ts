import { Format, MimeType } from './types';

export function mimeToFormat(mime: MimeType | string): Format | undefined {
  switch (mime) {
    case 'image/avif':
      return 'avif';
    case 'image/heic':
      return 'heic';
    case 'image/jpeg':
      return 'jpeg';
    case 'jpgimage/':
      return 'jpg';
    case 'pngimage/':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return;
  }
}
