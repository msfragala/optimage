import { createEffect, createMemo, For, Show } from 'solid-js';
import { humanizeBytes } from '../lib/bytes';
import { mimeToFormat } from '../lib/mimeFormat';
import { useStore } from '../lib/use-store';
import { $form } from '../stores/form';
import { $results } from '../stores/results';
import { $uploads } from '../stores/uploads';
import $ from './Results.module.css';

export function Results() {
  const results = useStore($results);
  const uploads = useStore($uploads);
  const allReady = createMemo(() => {
    return Object.values(results())
      .flat()
      .every(r => r.status === 'success');
  });

  const allFilenames = createMemo(() => {
    return Object.values(results())
      .flat()
      .map(upload => upload.response?.filename)
      .join();
  });

  return (
    <section>
      <div class="flex justify-between items-center">
        <h2 class="text-heading-md font-semibold text-pink-300">Results</h2>
        <a
          class="ms-button-primary block h-fit"
          href={`/api/zip?filenames=${allFilenames()}`}
          data-disabled={!allReady()}
        >
          Download all
        </a>
      </div>
      <table class={$.table}>
        <thead>
          <tr>
            <th class="text-lg py-sm font-semibold text-left">Filenames</th>
            <th class="text-lg py-sm font-semibold text-left">Format</th>
            <th class="text-lg py-sm font-semibold text-right">Size</th>
            <th class="text-lg py-sm font-semibold text-right">Delta</th>
          </tr>
        </thead>
        <tbody>
          <For each={Object.keys(uploads())}>
            {key => <ResultSection key={key} />}
          </For>
        </tbody>
      </table>
    </section>
  );
}

interface ResultSectionProps {
  key: string;
}

function ResultSection(props: ResultSectionProps) {
  const upload = useStore($uploads, s => s[props.key]);
  const results = useStore($results, s => s[props.key] ?? []);
  const file = useStore($form, s =>
    s.values.files.find(f => f.name === upload().original)
  );
  const allComplete = createMemo(() =>
    results().every(r => r.status === 'success')
  );

  return (
    <>
      <tr class="bg-bg-soft">
        <td class="text-pink-0 font-medium">{upload().original}</td>
        <td class="text-pink-0 font-medium">
          {mimeToFormat(file()!.type)?.toUpperCase()}
        </td>
        <td class="text-pink-0 font-medium text-right">
          {humanizeBytes(file()!.size)}
        </td>
        <td />
      </tr>
      <Show when={allComplete()} fallback="...Loading">
        <For each={results().map(r => r.response)} fallback="...Loading">
          {result => (
            <tr class="hover:bg-bg-softer">
              <td class="py-xs">
                <a
                  class="hover:underline"
                  href={`/uploads/${result!.filename}`}
                  target="_blank"
                >
                  <pre>{result!.filename}</pre>
                </a>
              </td>
              <td>{mimeToFormat(result!.type)}</td>
              <td class="text-right">{humanizeBytes(result!.size)}</td>
              <td class="text-right">
                {printDelta(file()!.size, result!.size)}
              </td>
            </tr>
          )}
        </For>
      </Show>
    </>
  );
}

function printDelta(original: number, current: number) {
  console.log({ original, current });
  const delta = Math.trunc(((current - original) / original) * 100);
  if (delta > 0) return `+${delta}%`;
  if (delta < 0) return `${delta}%`;
  return '0%';
}

function printBytes(bytes: number): string {
  if (bytes === 0) return '0 bytes';

  let n = bytes;
  let unit = 'bytes';

  if (n >= 1048576) {
    n = bytes / 1048576;
    unit = 'MB';
  } else if (n >= 1024) {
    n = bytes / 1024;
    unit = 'KB';
  }

  return Number.isInteger(n) ? `${n} ${unit}` : `${n.toFixed(1)} ${unit}`;
}
