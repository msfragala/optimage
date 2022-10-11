<script lang="ts">
  import { sources$ } from '@/stores/sources';
  import { results$ } from '@/stores/results';
  import { sort, sortResults, sortSources } from '@/lib/sort';
  import Result from './result.svelte';
  import { formatBytes } from '@/lib/format-bytes';
  import { fade } from 'svelte/transition';
  import { zipWorker } from '@/lib/zip';
  import { nanoid } from 'nanoid';

  function clearAll() {
    document.scrollingElement.scrollTo(0, 0);
    sources$.reset();
    results$.reset();
  }

  function downloadImages(event: Event) {
    event.preventDefault();
    const images = $results$;

    zipWorker
      .zip($results$)
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Optimage ${Date.now()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error(error);
      });
  }
</script>

{#if $sources$.length > 0}
  <div class="buttons">
    <button class="ms-button-secondary" type="button" on:click={clearAll}>
      Clear
    </button>
    <button
      class="download-button ms-button-primary"
      type="button"
      on:click={downloadImages}
      disabled={$results$.length > 0 && $results$.some(r => !r.blob)}
    >
      Download images
    </button>
  </div>
  <table class="table" in:fade>
    <thead>
      <tr>
        <th class="th" />
        <th class="th">File name</th>
        <th class="th">Size</th>
        <th class="th">Delta</th>
      </tr>
    </thead>
    <tbody>
      {#each sort($sources$, sortSources) as source}
        <tr class="source-row">
          <td class="source-cell" />
          <td class="source-cell">{source.file.name}</td>
          <td class="source-cell">{formatBytes(source.file.size)}</td>
          <td class="source-cell" />
        </tr>
        {#each $results$
          .filter(r => r.source === source.id)
          .sort(sortResults) as result}
          <Result {result} {source} />
        {/each}
      {/each}
    </tbody>
  </table>
{/if}

<style>
  .buttons {
    background-color: var(--color-bg);
    display: flex;
    justify-content: space-between;
    margin-block: 16px;
    padding-block: 0.5rem;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 4px;
  }

  .table :global(:is(th, td)) {
    white-space: nowrap;
    padding: 8px 4px;
  }

  .table :global(tr > *:nth-child(1)) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding-inline-start: 1rem;
  }

  .table :global(tr > *:nth-child(2)) {
    max-width: 100%;
    white-space: normal;
    line-height: 1.25;
  }

  .table :global(tr > *:nth-child(3)) {
    text-align: right;
  }

  .table :global(tr > *:nth-child(4)) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-inline-end: 1rem;
    text-align: right;
  }

  .source-cell {
    background-color: #242424;
    font-weight: 600;
    padding-block: 6px;
  }

  .th {
    font-size: 1.1rem;
    text-align: left;
    padding-block: 4px;
  }
</style>
