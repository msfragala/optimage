import { SUPPORTED_TYPES } from '@/common/constants';
import { mimeTypeToExtension } from '@/common/mime-to-extension';
import { MimeType, OutputMimeType } from '@/common/types';
import sharp, { Metadata } from 'sharp';
import { uploadImage } from './lib/aws';
import { generateId } from './lib/generate-id';
import { catchError } from './lib/middleware';
import { multibody } from './lib/multibody';

export interface UploadResponse {
  id: string;
  name: string;
  originalName: string;
  targets: OutputMimeType[];
}

export default catchError(async (req, res) => {
  const body = await multibody(req);
  const file = body.files[0];

  if (!file || !SUPPORTED_TYPES.includes(file.mimeType as MimeType)) {
    res.status(406).end('');
    return;
  }

  const id = await generateId();
  const extension = mimeTypeToExtension(file.mimeType);
  const name = `aaa/${id}-original.${extension}`;
  const metadata = await sharp(file.buffer).metadata();

  await uploadImage({
    type: file.mimeType as MimeType,
    buffer: file.buffer,
    name,
  });

  const response: UploadResponse = {
    id,
    name,
    originalName: file.fileName,
    targets: getMimeTypes(file.mimeType, metadata),
  };

  res.json(response);
});

function getMimeTypes(type: string, metadata: Metadata): OutputMimeType[] {
  const formats: OutputMimeType[] = ['image/avif', 'image/webp'];

  if (type === 'image/png') formats.push('image/png');
  else if (type === 'image/jpeg') formats.push('image/jpeg');
  else if (type === 'image/jpg') formats.push('image/jpeg');
  else if (metadata.hasAlpha) formats.push('image/png');
  else formats.push('image/jpeg');

  return formats;
}
