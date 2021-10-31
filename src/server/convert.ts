import { mimeTypeToExtension } from '@/common/mime-to-extension';
import { ImageUpload, OutputMimeType } from '@/common/types';
import fetch from 'node-fetch';
import sharp, { FormatEnum } from 'sharp';
import { uploadImage } from './lib/aws';
import { catchError } from './lib/middleware';

const BUCKET_NAME = process.env.UPLOADS_BUCKET;
const BUCKET_URL = `https://${BUCKET_NAME}.s3.amazonaws.com`;

export interface ConvertPayload {
  id: string;
  source: string;
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

export default catchError(async (req, res) => {
  const body = req.body as ConvertPayload;
  const original = await fetch(`${BUCKET_URL}/${body.source}`);
  const buffer = await original.buffer();
  const extension = mimeTypeToExtension(body.type);
  const filename = `${body.id}-${body.width}.${extension}`;
  const format = formats[body.type];
  const result = await sharp(buffer)
    .resize(body.width)
    .toFormat(format)
    .toBuffer();

  const response = await uploadImage({
    name: filename,
    type: body.type,
    buffer: result,
  });

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error(`Error uploading image: ${filename}`);
  }

  const upload: ImageUpload = {
    filename,
    type: body.type,
    width: body.width,
    size: result.byteLength,
  };

  res.json(upload);
});
