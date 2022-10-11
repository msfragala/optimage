import { expose } from 'slother';
import JSZip from 'jszip';
import { Result } from '@/stores/results';

expose({
  async zip(results: Result[]) {
    const zip = new JSZip();
    results.forEach(({ filename, blob }) => zip.file(filename, blob));
    return zip.generateAsync({ type: 'blob' });
  },
});
