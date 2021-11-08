import { $artifacts } from '@/stores/$artifacts';
import { $inputs, Source } from '@/stores/$inputs';
import { bytesToString } from '../lib/bytes';
import { useStore } from '../lib/use-store';
import { useEffect, useState } from 'preact/hooks';
import { zipWorker } from '@/workers/zip';
import { LoadingIcon } from './icons/LoadingIcon';
import { CheckmarkIcon } from './icons/CheckmarkIcon';
import { AsyncStatus } from '@/types/async-status';
import $ from './Results.module.css';
import { route } from 'preact-router';
import { HOME_ROUTE } from '@/constants/routes';
import { abortable } from '@/lib/abortable';

export function Results() {
  const sources = useStore($inputs, s => Object.values(s.sources));
  const artifacts = useStore($artifacts, s => Object.values(s));
  const pending = artifacts.some(a => a.status === 'pending');
  const [zipUrl, setZipUrl] = useState<string>('');

  useEffect(() => {
    if (artifacts?.length > 0) return;
    route(HOME_ROUTE, true);
  }, [artifacts]);

  useEffect(() => {
    if (pending) return;

    const controller = new AbortController();
    abortable(controller.signal, zipWorker())
      .then(w => w.zip(artifacts))
      .then(url => setZipUrl(url))
      .catch(() => {});

    return () => {
      controller.abort();
    };
  }, [pending]);

  return (
    <section>
      <div class="flex justify-between items-center">
        <h2 class="text-heading-md font-semibold text-pink-300">Results</h2>
        <a
          class="ms-button-primary block h-fit"
          data-disabled={!zipUrl}
          href={zipUrl}
        >
          Download all
        </a>
      </div>
      <table class={$.table}>
        <thead>
          <tr>
            <th class="text-lg py-sm font-semibold text-left">Filenames</th>
            <th class="text-lg py-sm font-semibold text-right">Size</th>
            <th class="text-lg py-sm font-semibold text-right">Delta</th>
          </tr>
        </thead>
        <tbody>
          {sources.map(source => (
            <SourceSection source={source} key={source.id} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function SourceSection(props: { source: Source }) {
  const artifacts = useStore($artifacts, s =>
    Object.values(s).filter(a => a.sourceId === props.source.id)
  );

  return (
    <>
      <tr class="bg-bg-soft">
        <td class="text-pink-0 font-medium">{props.source.file.name}</td>
        <td class="text-pink-0 font-medium text-right">
          {bytesToString(props.source.file.size)}
        </td>
        <td />
      </tr>
      {artifacts.map(artifact => (
        <tr class="hover:bg-bg-softer" key={artifact.id}>
          <td class="py-xs">
            <span class="mr-sm">
              <StatusIcon status={artifact.status} />
            </span>
            <pre class="inline-block">{artifact!.filename}</pre>
          </td>
          <td class="text-right">
            {artifact.blob && bytesToString(artifact.blob.size)}
          </td>
          <td class="text-right">
            {artifact.blob &&
              getDelta(props.source.file.size, artifact.blob.size)}
          </td>
        </tr>
      ))}
    </>
  );
}

function StatusIcon({ status }: { status: AsyncStatus }) {
  if (status === 'success') return <CheckmarkIcon />;
  return <LoadingIcon animate />;
}

function getDelta(original: number, current: number) {
  const delta = Math.trunc(((current - original) / original) * 100);
  if (delta > 0) return `+${delta}%`;
  if (delta < 0) return `${delta}%`;
  return '0%';
}
