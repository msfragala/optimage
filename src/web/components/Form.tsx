import { ImageUpload } from '@/common/types';
import { ConvertPayload } from '@/server/convert';
import { OptimizeBody } from '@/server/optimize';
import { createMemo } from 'solid-js';
import { sendJSON } from '../lib/send-json';
import { useStore } from '../lib/use-store';
import { $form } from '../stores/form';
import { $results } from '../stores/results';
import { $uploads, Upload } from '../stores/uploads';
import { FilesList } from './FilesList';
import { SizesField } from './SizesField';
import { UploadField } from './UploadField';

export function Form() {
  const files = useStore($form, s => s.values.files);
  const sizes = useStore($form, s => s.values.sizes);
  const uploads = useStore($uploads, s => Object.values(s));
  const uploadsComplete = createMemo(() =>
    uploads().every(u => u.status === 'success')
  );

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();

    let firstErrorId = '';

    if (uploads().length === 0) {
      $form.setError('files', 'Add images to resize');
      firstErrorId = 'files-input';
    }

    if (sizes().length === 0) {
      $form.setError('sizes', 'Add widths to resize your images to');
      firstErrorId = 'sizes-input';
    }

    if (firstErrorId) {
      document.getElementById(firstErrorId)?.focus();
      return;
    }

    if (!uploadsComplete()) {
      return;
    }

    $form.setSubmissionState('pending');

    const widths = sizes().map(n => parseInt(n, 10));
    const requests = uploads().map(upload => {
      return $results.startConversions(upload, widths);
    });

    await Promise.all(requests.flat());
    $form.setSubmissionState('success');
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <SizesField />
      <div class="mt-lg">
        <UploadField />
      </div>
      <button
        type="submit"
        class="ms-button-primary block ml-auto mt-md"
        disabled={!uploadsComplete()}
      >
        Optimize images
      </button>
      <FilesList class="mt-lg" heading="Images ready for optimizing" />
    </form>
  );
}

// function send(upload: Upload, sizes: string[]) {
//   if (upload.status !== 'success') return;

//   const body: OptimizeBody = {
//     sizes: sizes.map(s => parseInt(s, 10)),
//     original: upload.name,
//     id: upload.id,
//   };

//   const request = new Request('/api/optimize', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });

//   return fetch(request)
//     .then(res => res.json())
//     .then(json => {
//       $results.addUploads(upload.id, json.uploads);
//     })
//     .catch(error => {
//       console.error(error);
//       $results.setStatus(upload.id, 'error');
//     });
// }
