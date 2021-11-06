import { createLazyWorker } from '@/lib/lazy-worker';
import { Artifact } from '@/stores/$artifacts';

interface ZipWorker {
  zip(artifacts: Artifact[]): Promise<string>;
}

export const zipWorker = createLazyWorker<ZipWorker>(
  () => import('./zip.worker?worker')
);
