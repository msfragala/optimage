import { MimeType } from '@/common/types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_SDK_UPLOADS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SDK_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SDK_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadImage(options: {
  name: string;
  buffer: Buffer;
  type: MimeType;
}) {
  return s3.send(
    new PutObjectCommand({
      Bucket: process.env.UPLOADS_BUCKET,
      Key: options.name,
      Body: options.buffer,
      ContentType: options.type,
    })
  );
}
