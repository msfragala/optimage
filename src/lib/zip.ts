import { Result } from '@/stores/results';
import ZipWorker from './zip.worker?url';
import { Pool } from 'slother';

type ZipWorker = {
  zip(artifacts: Result[]): Promise<Blob>;
};

export const zipWorker = Pool.proxy<ZipWorker>(() => new ZipWorker());
