import { useStore } from '../lib/use-store';
import { $errors } from '../stores/$errors';
import { DropZone } from './DropZone';
import iconAvif from '@/assets/upload.avif?url';
import iconWebp from '@/assets/upload.webp?url';
import iconPng from '@/assets/upload.png?url';
import { FILES_FIELD_ID } from '@/constants/field-names';
import { $inputs } from '@/stores/$inputs';
import { SupportedTypes } from '@/constants/mime-types';

const SUPPORTED_TYPES = [
  'image/avif',
  'image/webp',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

export function UploadField() {
  const error = useStore($errors, s => s[FILES_FIELD_ID]);

  function onDrop(event: DragEvent, files: File[]) {
    files.forEach($inputs.addSource);
  }

  function onChange(event: Event) {
    const node = event.target as HTMLInputElement;
    const files = Array.from(node.files!);
    files.forEach($inputs.addSource);
  }

  return (
    <div>
      <DropZone
        global
        class="border border-dotted flex pt-48 pb-64 px-24 transition-colors"
        dragClass="bg-bg-soft"
        onDrop={onDrop}
        allowTypes={SupportedTypes}
      >
        <div class="m-auto text-lg">
          <picture>
            <source srcset={iconAvif} type="image/avif" />
            <source srcset={iconWebp} type="image/webp" />
            <img
              src={iconPng}
              alt=""
              class="mx-auto mb-24 w-128"
              height="128"
              width="128"
            />
          </picture>
          <p class="text-center">
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
          </p>
        </div>
      </DropZone>
      <p class="ms-input-error mt-8" id="files-input-error">
        {error}
      </p>
    </div>
  );
}
