import { catchError } from '@/server/lib/middleware';
import fetch from 'node-fetch';
import Zip from 'jszip';
import { generateId } from '@/server/lib/generate-id';
import sharp from 'sharp';

const BUCKET_NAME = process.env.UPLOADS_BUCKET;
const BUCKET_URL = `https://${BUCKET_NAME}.s3.amazonaws.com`;

export default catchError(async (req, res) => {
  const id = await generateId();
  const param = (req.query.filenames as string) ?? '';
  const filenames = param?.split(',');
  const zip = new Zip();

  filenames.forEach(filename => {
    const url = `${BUCKET_URL}/${filename}`;
    zip.file(
      filename,
      fetch(url).then(res => res.arrayBuffer())
    );
  });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${id}.zip"`);

  zip
    .generateNodeStream({ streamFiles: true })
    .pipe(res)
    .on('finish', () => res.end());
});

fetch;
