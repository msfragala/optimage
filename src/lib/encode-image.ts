import { ImageType } from '@/constants/mime-types';
import { avifWorker } from '@/workers/avif';
import { mozWorker } from '@/workers/moz';
import { webpWorker } from '@/workers/webp';

export async function encodeImage(
  source: ImageData,
  mimeType: ImageType
): Promise<Blob> {
  let encoder;

  switch (mimeType) {
    case 'image/webp':
      encoder = webpWorker();
      break;
    case 'image/avif':
      encoder = avifWorker();
      break;
    case 'image/jpeg':
    case 'image/png':
      encoder = mozWorker();
      break;
    default:
      throw new Error('Trying to encode an unsupported image type');
  }

  const data = await encoder.then(w => w.encode(source));
  if (!data) throw new Error('Image encoding came back null');
  return new Blob([data], { type: mimeType });
}
