import { Artifact } from '@/stores/$artifacts';
import { expose } from 'comlink';
import JSZip from 'jszip';

expose({
  async zip(artifacts: Artifact[]) {
    const zip = new JSZip();
    artifacts.forEach(a => zip.file(a.filename, a.blob));
    const blob = await zip.generateAsync({ type: 'blob' });
    return URL.createObjectURL(blob);
  },
});
