import { expose } from 'slother';
import initResize, { InitOutput, resize } from '@/lib/codecs/resize/resize';

type ResizeMethod = 'triangle' | 'catrom' | 'mitchell' | 'lanczos3';

const resizeMethods: ResizeMethod[] = [
  'triangle',
  'catrom',
  'mitchell',
  'lanczos3',
];

const defaultOptions = {
  method: 'lanczos3',
  fitMethod: 'stretch',
  premultiply: true,
  linearRGB: true,
};

let ready: Promise<InitOutput>;

expose({
  async resize(payload: {
    imageData: ImageData;
    width: number;
  }): Promise<ImageData> {
    if (!ready) ready = initResize();
    await ready;
    const { imageData, width } = payload;
    const height = (imageData.width / imageData.height) * width;

    const result = resize(
      new Uint8Array(imageData.data.buffer),
      imageData.width,
      imageData.height,
      width,
      height,
      resizeMethods.indexOf(defaultOptions.method as ResizeMethod),
      defaultOptions.premultiply,
      defaultOptions.linearRGB
    );

    return new ImageData(result, width, height);
  },
});
