import { For, Show } from 'solid-js';
import { useStore } from '../lib/use-store';
import { $form } from '../stores/form';
import { TagsInput } from './TagsInput';

export function SizesField() {
  const sizes = useStore($form, s => s.values.sizes);
  const error = useStore($form, s => s.errors.sizes);

  function onInput(event: Event) {
    const node = event.target as HTMLInputElement;
    if (!node.value.trim()) {
      $form.setError('sizes', '');
    }
  }

  function validateSize(size: string) {
    let message = '';

    if (size) {
      const number = parseInt(size, 10);
      if (!/^\d+$/.test(size)) message = 'Must be only numbers';
      else if (isNaN(number)) message = 'Must be only numbers';
      else if (number <= 0) message = 'Must be greater than 0';
      else if (number > 3000) message = 'Cannot be greater than 3000';
    }

    $form.setError('sizes', message);
    return !message;
  }

  return (
    <div>
      <label class="ms-input-label mb-4" for="resize-widths-input">
        Resize widths
      </label>
      <TagsInput
        class="ms-input w-full"
        id="resize-widths-input"
        inputMode="numeric"
        onAddTag={tag => $form.addSize(tag)}
        validateTag={validateSize}
        onInput={onInput}
        step="100"
      />
      <p class="ms-input-error mt-8">{error()}</p>
      <Show when={sizes()}>
        <ul class="flex gap-8 mt-8">
          <For each={sortSizes(sizes())}>
            {size => (
              <li class="ms-pill">
                <span>{size}</span>
                <button
                  aria-label={`Remove ${size}`}
                  class="ml-4 hover:text-pink-300"
                  onClick={() => $form.removeSize(size)}
                  type="button"
                >
                  ×
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}

function sortSizes(sizes: string[]) {
  if (sizes.length === 0) return sizes;
  return sizes
    .map(s => parseInt(s, 10))
    .sort((a, b) => a - b)
    .map(n => n.toString());
}
