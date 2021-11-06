import { createLazyWorker } from '@/lib/lazy-worker';

interface ResizeWorker {
  resize(data: ImageData, width: number): Promise<ImageData>;
}

export const resizeWorker = createLazyWorker<ResizeWorker>(
  () => import('./resize.worker?worker')
);
