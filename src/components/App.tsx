import { useStore } from '@/lib/use-store';
import { $artifacts } from '@/stores/$artifacts';
import { Form } from './Form';
import { Results } from './Results';

export function App() {
  const hasArtifacts = useStore($artifacts, s => Object.keys(s).length > 0);

  return (
    <div class="w-full min-h-full max-w-screen-sm mx-auto px-24 md:px-32 py-24 pb-88">
      <h1 class="text-heading-xl font-semibold w-fit mx-auto mt-lg mb-xl">
        Optimage
      </h1>
      {!hasArtifacts && <Form />}
      {hasArtifacts && <Results />}
    </div>
  );
}
