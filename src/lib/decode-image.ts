import { codecs } from '@/codecs/codecs';

const supportsImageDecoder = 'ImageDecoder' in self;

export async function decodeImage(blob: File | Blob): Promise<ImageData> {
  let source: ImageBitmap | HTMLImageElement | VideoFrame;
  const native = await canDecodeNatively(blob.type);

  switch (blob.type) {
    case 'image/webp': {
      const data = await codecs.webp().then(w => w.decode(blob));
      if (!data) throw new Error('Unable to decode WebP image');
      return data;
    }
    case 'image/avif': {
      const data = await codecs.avif().then(w => w.decode(blob));
      if (!data) throw new Error('Unable to decode AVIF image');
      return data;
    }
  }

  if (native) {
    source = await decodeToVideoFrame(blob);
  } else if ('createImageBitmap' in self) {
    source = await createImageBitmap(blob);
  } else {
    source = await createImageFromFile(blob);
  }

  return drawImageData(source);
}

async function canDecodeNatively(type: string): Promise<boolean> {
  if (!supportsImageDecoder) return false;

  try {
    return ImageDecoder.isTypeSupported(type);
  } catch (err) {
    return false;
  }
}

async function decodeToVideoFrame(file: File | Blob): Promise<VideoFrame> {
  if (!supportsImageDecoder) {
    throw new Error('Cannot decode file via unsupported ImageDecoder API');
  }

  const decoder = new ImageDecoder({
    type: file.type,
    data: new Response(file).body!,
  });

  const result = await decoder.decode();
  return result.image;
}

async function createImageFromFile(
  file: File | Blob
): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);

  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(Error('Image loading error'));
    });

    if (img.decode) {
      // Nice off-thread way supported in Safari/Chrome.
      // Safari throws on decode if the source is SVG.
      // https://bugs.webkit.org/show_bug.cgi?id=188347
      await img.decode().catch(() => null);
    }

    // Always await loaded, as we may have bailed due to the Safari bug above.
    await loaded;
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawImageData(source: ImageBitmap | HTMLImageElement | VideoFrame) {
  let width: number;
  let height: number;

  if ('displayWidth' in source) {
    width = source.displayWidth;
    height = source.displayHeight;
  } else {
    width = source.width;
    height = source.height;
  }

  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Unable to create canvas');

  ctx.drawImage(source, 0, 0, width, height, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}
