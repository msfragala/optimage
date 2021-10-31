import { Show } from 'solid-js';
import { useStore } from '../lib/use-store';
import { $form } from '../stores/form';
import { Form } from './Form';
import { Results } from './Results';

export function App() {
  const submissionState = useStore($form, s => s.submissionState);

  return (
    <div class="w-full min-h-full max-w-screen-sm mx-auto px-24 md:px-32 py-24 pb-88">
      <h1 class="text-heading-xl font-semibold w-fit mx-auto mt-lg mb-xl">
        Optimage
      </h1>
      <Show when={submissionState() !== 'idle'} fallback={<Form />}>
        <Results />
      </Show>
    </div>
  );
}
