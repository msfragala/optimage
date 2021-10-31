import { createEffect, createSignal, For, Show } from 'solid-js';
import { humanizeBytes } from '../lib/bytes';
import { getImageDimensions } from '../lib/get-image-dimensions';
import { useStore } from '../lib/use-store';
import { $form } from '../stores/form';
import { $uploads } from '../stores/uploads';
import { TrashIcon } from './TrashIcon';

interface FilesListProps {
  class: string;
  heading: string;
}

export function FilesList(props: FilesListProps) {
  const files = useStore($form, s => s.values.files);
  return (
    <Show when={files().length > 0} fallback={null}>
      <section class={props.class}>
        <ul class="flex flex-col divide-y">
          <For each={files()}>
            {file => (
              <li>
                <FileItem file={file} onDelete={() => $form.removeFile(file)} />
              </li>
            )}
          </For>
        </ul>
      </section>
    </Show>
  );
}

function FileItem(props: {
  file: File;
  onDelete: (event: MouseEvent) => void;
}) {
  const status = useStore($uploads, s => s[props.file.name]?.status);
  const [dimensions, setDimensions] = createSignal('');
  const size = humanizeBytes(props.file.size);
  getImageDimensions(props.file).then(setDimensions);
  return (
    <div class="hover:bg-bg-softer w-full flex gap-4 items-center px-12 py-2 rounded my-4">
      <Show
        when={status() === 'success'}
        fallback={<Loader class="ms-animate-loader h-16" />}
      >
        <Done class="h-16" />
      </Show>
      <span class="text-md font-semibold">{props.file.name}</span>
      <span class="text-sm text-text-soft">
        ({[size, dimensions()].filter(Boolean).join(' • ')})
      </span>
      <button
        class="ml-auto ms-button-icon -mr-8"
        onClick={props.onDelete}
        type="button"
      >
        <TrashIcon class="h-16" stroke-width="1" />
      </button>
    </div>
  );
}

function Loader(props: Record<string, any>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function Done(props: Record<string, any>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
