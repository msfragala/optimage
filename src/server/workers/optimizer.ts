import sharp, { FormatEnum } from 'sharp';
import { ImageUpload, OutputMimeType } from '@/common/types';
import { uploadImage } from '@/server/lib/aws';

export interface OptimizerPayload {
  file: Buffer;
  filename: string;
  type: OutputMimeType;
  width: number;
}

const formats: Record<OutputMimeType, keyof FormatEnum> = {
  'image/avif': 'avif',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export default async (payload: OptimizerPayload): Promise<ImageUpload> => {
  const format = formats[payload.type];

  let buffer = await sharp(payload.file)
    .resize(payload.width)
    .toFormat(format)
    .toBuffer();

  const response = await uploadImage({
    name: payload.filename,
    type: payload.type,
    buffer,
  });

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error(`Error uploading image: ${payload.filename}`);
  }

  return {
    filename: payload.filename,
    type: payload.type,
    width: payload.width,
    size: buffer.byteLength,
  };
};
