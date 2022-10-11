<script>
  import { maxSizes, maxWidth, minWidth } from '@/constants/sizes';
  import { widths$ } from '@/stores/widths';
  import { fade } from 'svelte/transition';

  let error;

  function onKeydown(event) {
    if (!['Enter', ' ', ','].includes(event.key)) return;

    event.preventDefault();
    const value = event.target.valueAsNumber;

    if (isNaN(value)) {
      error = '';
    } else if ($widths$.includes(value)) {
      error = '';
      event.target.value = '';
    } else if (value < 0) {
      error = 'Images canʼt be resized to a negative width (ಠ.ಠ)';
    } else if (value === 0) {
      error = 'Images canʼt be resized to zero (ㆆ_ㆆ)';
    } else if (value >= maxWidth) {
      error = 'Please use a width less than 6000px';
    } else if ($widths$.length >= maxSizes) {
      error = 'Donʼt be greedy, ten sizes is enough';
    } else {
      widths$.add(value);
      event.target.value = '';
      error = '';
    }
  }

  function onInput(event) {
    if (event.target.value === '') {
      error = '';
    }
  }
</script>

<div>
  <label class="input-label" for="sizes-input">Resize Widths</label>
  <p class="input-hint" id="sizes-input-hint">
    Add one or multiple widths that images should be resized to
  </p>
  <input
    aria-describedby="sizes-input-hint sizes-input-error"
    class="input"
    type="number"
    pattern="/d,"
    id="sizes-input"
    min={minWidth}
    max={maxWidth}
    on:keydown={onKeydown}
    on:input={onInput}
  />
  <ul class="sizes-list">
    {#each $widths$ as width}
      <li class="sizes-item">
        <p>{width}</p>
        <button
          aria-label={`Delete ${width}px`}
          class="delete-button"
          on:click={() => widths$.remove(width)}
          type="button"
        >
          &times;
        </button>
      </li>
    {/each}
  </ul>
  {#if error}
    <p
      class="error-message"
      id="sizes-input-error"
      transition:fade={{ duration: 100 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      &nbsp
      {error}
    </p>
  {/if}
</div>

<style>
  .input {
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    height: 2.25rem;
    width: 100%;
    padding-inline: 0.75em;
    margin-block-start: 6px;
    font-size: 1rem;
  }

  .input-hint {
    font-size: 0.8rem;
    color: var(--color-text-soft);
    margin-block-start: 2px;
  }

  .input-label {
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    font-weight: 500;
  }

  .sizes-list {
    display: flex;
    gap: 0.5rem;
    margin-block-start: 8px;
  }

  .sizes-item {
    display: flex;
    cursor: default;
    background-color: var(--color-bg-soft);
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    gap: 0.25rem;
  }

  .delete-button {
    background: none;
    border: none;
    color: currentColor;
    font-size: 1em;
  }

  .sizes-item:focus-within {
    outline-width: var(--focus-ring-width);
    outline-color: var(--focus-ring-color);
    outline-style: var(--focus-ring-style);
    outline-offset: var(--focus-ring-offset);
  }

  .delete-button:focus-visible {
    outline: 0 !important;
  }

  .error-message {
    font-size: 0.8rem;
    padding-block-start: 8px;
    color: #ff7777;
    display: flex;
    align-items: center;
  }

  .error-message svg {
    height: 1.2em;
  }
</style>
