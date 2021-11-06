import { WIDTHS_FIELD_ID } from '@/constants/field-names';
import { $errors } from '@/stores/$errors';
import { $inputs } from '@/stores/$inputs';
import { useStore } from '../lib/use-store';
import { TagsInput } from './TagsInput';

const FIELD = WIDTHS_FIELD_ID;

export function SizesField() {
  const widths = useStore($inputs, s => s.widths);
  const error = useStore($errors, s => s[FIELD] ?? '');

  function onInput(event: Event) {
    const node = event.target as HTMLInputElement;
    if (!node.value.trim()) {
      $errors.removeError(FIELD);
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

    if (message) $errors.setError(FIELD, message);
    else $errors.removeError(FIELD);

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
        onAddTag={tag => $inputs.addWidth(parseInt(tag, 10))}
        validateTag={validateSize}
        onInput={onInput}
        step="100"
      />
      <p class="ms-input-error mt-8">{error}</p>
      {widths?.length && (
        <ul class="flex gap-8 mt-8">
          {sortSizes(widths).map(size => (
            <li class="ms-pill" key={size}>
              <span>{size}</span>
              <button
                aria-label={`Remove ${size}`}
                class="ml-4 hover:text-pink-300"
                onClick={() => $inputs.removeWidth(size)}
                type="button"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function sortSizes(sizes: number[]) {
  if (sizes.length === 0) return sizes;
  return sizes.sort((a, b) => a - b);
}
