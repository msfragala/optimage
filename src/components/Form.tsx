import { FILES_FIELD_ID, WIDTHS_FIELD_ID } from '@/constants/field-names';
import { DOWNLOADS_ROUTE } from '@/constants/routes';
import { $artifacts } from '@/stores/$artifacts';
import { $errors } from '@/stores/$errors';
import { $inputs } from '@/stores/$inputs';
import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useStore } from '../lib/use-store';
import { FilesList } from './FilesList';
import { SizesField } from './SizesField';
import { UploadField } from './UploadField';

export function Form() {
  const sources = useStore($inputs, s => Object.values(s.sources));
  const widths = useStore($inputs, s => s.widths);
  const decodingsReady = sources.every(s => s.decodingStatus === 'success');

  async function onSubmit(event: Event) {
    event.preventDefault();

    let firstErrorId = '';

    if (sources.length === 0) {
      $errors.setError(FILES_FIELD_ID, 'Add images to resize');
      firstErrorId = FILES_FIELD_ID;
    }

    if (widths.length === 0) {
      $errors.setError(WIDTHS_FIELD_ID, 'Add widths to resize your images to');
      firstErrorId = WIDTHS_FIELD_ID;
    }

    if (firstErrorId) {
      document.getElementById(firstErrorId)?.focus();
      return;
    }

    $artifacts.generate(sources, widths);
    route(DOWNLOADS_ROUTE);
  }

  useEffect(() => {
    if (sources.length === 0) return;
    $inputs.reset();
    $artifacts.reset();
  }, []);

  return (
    <form onSubmit={onSubmit} noValidate>
      <SizesField />
      <div class="mt-lg">
        <UploadField />
      </div>
      <button
        type="submit"
        class="ms-button-primary block ml-auto mt-md"
        disabled={!decodingsReady}
      >
        Optimize images
      </button>
      <FilesList class="mt-lg" />
    </form>
  );
}
