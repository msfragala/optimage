import { VercelRequest } from '@vercel/node';
import Busboy from 'busboy';
import { FileUpload } from './types';

interface Body {
  fields: Record<string, string>;
  files: FileUpload[];
}

export function multibody(req: VercelRequest): Promise<Body> {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers });
    const body: Body = { fields: {}, files: [] };

    busboy.on('field', (fieldName, value) => {
      body.fields[fieldName] = value?.toString();
    });

    busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
      streamToBuffer(file).then(buffer => {
        body.files.push({
          buffer,
          fileName,
          encoding,
          mimeType: mimeType,
        });
      });
    });

    busboy.on('finish', () => resolve(body));
    busboy.on('error', (error: unknown) => reject(error));
    req.pipe(busboy);
  });
}

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffer: any[] = [];
    stream.on('data', chunk => buffer.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(buffer)));
    stream.on('error', error => reject(error));
  });
}
