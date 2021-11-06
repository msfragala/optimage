import { bytesToString } from '@/lib/bytes';
import { useStore } from '@/lib/use-store';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { $inputs, Source } from '@/stores/$inputs';
import { useEffect, useState } from 'preact/hooks';
import { CheckmarkIcon } from './icons/CheckmarkIcon';
import { LoadingIcon } from './icons/LoadingIcon';

interface Props {
  class: string;
}

export function FilesList(props: Props) {
  const sources = useStore($inputs, s => Object.values(s.sources));

  if (!sources) return null;

  return (
    <section class={props.class}>
      <ul class="flex flex-col divide-y">
        {sources.map(source => (
          <li key={source.id}>
            <FileItem
              source={source}
              onDelete={() => $inputs.removeSource(source.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function FileItem(props: {
  source: Source;
  onDelete: (event: MouseEvent) => void;
}) {
  const [dimensions, setDimensions] = useState('');
  const size = bytesToString(props.source.file.size);
  const file = props.source.file;
  const ready = props.source.decodingStatus === 'success';
  const imageData = props.source.decoded;

  useEffect(() => {
    if (!imageData) return;
    setDimensions(`${imageData.width}×${imageData.height}`);
  }, [imageData]);

  return (
    <div class="hover:bg-bg-softer w-full flex gap-4 items-center px-12 py-2 rounded my-4">
      {!!ready && <CheckmarkIcon />}
      {!ready && <LoadingIcon animate />}
      <span class="text-md font-semibold">{file.name}</span>
      <span class="text-sm text-text-soft">
        ({[size, dimensions].filter(Boolean).join(' • ')})
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
