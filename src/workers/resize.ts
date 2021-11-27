import { Pool } from 'slother';

type ResizeWorker = {
  resize(payload: { imageData: ImageData; width: number }): Promise<ImageData>;
};

export const resizeWorker = Pool.proxy<ResizeWorker>(() =>
  import('./resize.worker?worker').then(w => new w.default())
);
