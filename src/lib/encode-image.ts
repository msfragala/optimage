import { codecs } from '@/codecs/codecs';
import { ImageType } from '@/constants/mime-types';

export async function encodeImage(
  source: ImageData,
  mimeType: ImageType
): Promise<Blob> {
  let encoder;

  switch (mimeType) {
    case 'image/webp':
      encoder = codecs.webp();
      break;
    case 'image/avif':
      encoder = codecs.avif();
      break;
    case 'image/jpeg':
    case 'image/png':
      encoder = codecs.moz();
      break;
    default:
      throw new Error('Trying to encode an unsupported image type');
  }

  const data = await encoder.then(w => w.encode(source));
  if (!data) throw new Error('Image encoding came back null');
  return new Blob([data], { type: mimeType });
}
