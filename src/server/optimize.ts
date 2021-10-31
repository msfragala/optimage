import Piscina from 'piscina';
import sharp, { Metadata } from 'sharp';
import { catchError } from '@/server/lib/middleware';
import { generateId } from '@/server/lib/generate-id';
import { runParallel } from '@/server/lib/run-parallel';
import { OptimizerPayload } from '@/server/workers/optimizer';
import { ImageUpload, OutputMimeType } from '@/common/types';
import { mimeTypeToExtension } from '@/common/mime-to-extension';
import { streamToBuffer } from './lib/stream-to-buffer';
import fetch from 'node-fetch';

const BUCKET_NAME = process.env.UPLOADS_BUCKET;
const BUCKET_URL = `https://${BUCKET_NAME}.s3.amazonaws.com`;

const piscina = new Piscina({
  filename: new URL('./_workers/optimizer.mjs', import.meta.url).href,
  maxThreads: 16,
});

export interface OptimizeBody {
  id: string;
  original: string;
  sizes: number[];
}

export interface OptimizeResponse {
  uploads: ImageUpload[];
  id: string;
}

export default catchError(async (req, res) => {
  const body = req.body as OptimizeBody;

  if (!body.sizes?.length || !body.id || !body.original) {
    res.status(406).end('');
    return;
  }

  const id = await generateId();
  const original = await fetch(`${BUCKET_URL}/${body.original}`);
  const blob = await original.blob();
  const buffer = await blobBuffer(blob);
  const metadata = await sharp(buffer).metadata();
  const mimeTypes = getMimeTypes(blob, metadata);

  const payloads: OptimizerPayload[] = [];
  mimeTypes.forEach(type => {
    const extension = mimeTypeToExtension(type);
    body.sizes.forEach(width => {
      payloads.push({
        file: buffer,
        type,
        width,
        filename: `${id}-${width}.${extension}`,
      });
    });
  });

  const uploads = await runParallel<OptimizerPayload, ImageUpload>(
    piscina,
    payloads
  );

  const response: OptimizeResponse = { id, uploads };
  res.json(response);
});

function getMimeTypes(blob: Blob, metadata: Metadata): OutputMimeType[] {
  const formats: OutputMimeType[] = ['image/avif', 'image/webp'];

  if (blob.type === 'image/png') formats.push('image/png');
  else if (blob.type === 'image/jpeg') formats.push('image/jpeg');
  else if (blob.type === 'image/jpg') formats.push('image/jpeg');
  else if (metadata.hasAlpha) formats.push('image/png');
  else formats.push('image/jpeg');

  return formats;
}

function blobBuffer(blob: Blob): Promise<Buffer> {
  return blob.arrayBuffer().then(ab => Buffer.from(ab));
}
