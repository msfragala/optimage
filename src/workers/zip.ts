import { Artifact } from '@/stores/$artifacts';
import { Pool } from 'slother';

type ZipWorker = {
  zip(artifacts: Artifact[]): Promise<string>;
};

export const zipWorker = Pool.proxy<ZipWorker>(() =>
  import('./zip.worker?worker').then(w => new w.default())
);
