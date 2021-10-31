import { SUPPORTED_TYPES } from '@/common/constants';
import { useStore } from '../lib/use-store';
import { $form } from '../stores/form';
import { $uploads } from '../stores/uploads';
import { DropZone } from './DropZone';

export function UploadField() {
  const error = useStore($form, s => s.errors.files);
  function onDrop(event: DragEvent, files: File[]) {
    if (error()) $form.setError('files', '');
    $form.addFiles(files);
    files.forEach($uploads.uploadFile);
  }

  function onChange(event: Event) {
    const node = event.target as HTMLInputElement;
    if (!node.files?.length) return;
    if (error()) $form.setError('files', '');
    const files = Array.from(node.files);
    $form.addFiles(files);
    files.forEach($uploads.uploadFile);
  }

  return (
    <div>
      <DropZone
        global
        class="border border-dotted flex pt-48 pb-64"
        dragClass="bg-red-500"
        onDrop={onDrop}
        allowTypes={SUPPORTED_TYPES}
      >
        <div class="m-auto text-lg">
          <picture>
            <source srcset="../assets/upload.webp" type="image/webp" />
            <img
              src="../assets/upload.png"
              alt=""
              class="mx-auto mb-24 w-128"
            />
          </picture>
          Drop images here, or{' '}
          <input
            class="sr-only"
            name="files-input"
            id="files-input"
            type="file"
            multiple
            accept={SUPPORTED_TYPES.join()}
            onChange={onChange}
            aria-describedby="files-input-error"
          />
          <label
            class="ms-file-input-button underline rounded-sm"
            for="files-input"
          >
            browse files
          </label>
        </div>
      </DropZone>
      <p class="ms-input-error mt-8" id="files-input-error">
        {error()}
      </p>
    </div>
  );
}
