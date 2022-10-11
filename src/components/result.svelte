<script lang="ts">
  import Checkmark from '@/icons/checkmark.svelte';
  import Error from '@/icons/error.svelte';
  import Loading from '@/icons/loading.svelte';
  import { formatBytes } from '@/lib/format-bytes';
  import { results$, type Result } from '@/stores/results';
  import { type Source } from '@/stores/sources';
  import { fade } from 'svelte/transition';

  export let result: Result;
  export let source: Source;

  function getDelta(original: number, current: number) {
    const delta = Math.trunc(((current - original) / original) * 100);
    if (delta > 0) return `+${delta}%`;
    if (delta < 0) return `${delta}%`;
    return '--';
  }

  function createBlobUrl() {
    if (!result.blob) return;
    results$.updateResult(result.id, {
      url: URL.createObjectURL(result.blob),
    });
  }
</script>

<tr class="row">
  <td class="cell icon-cell">
    <div class="icon-wrapper">
      {#if result.status === 'pending'}
        <Loading />
      {/if}
      {#if result.status === 'success'}
        <Checkmark />
      {/if}
      {#if result.status === 'error'}
        <Error />
      {/if}
    </div>
  </td>
  <td class="cell name-cell">
    <a
      class="link"
      href={result.url ?? '#'}
      target="_blank"
      on:focus={createBlobUrl}
      on:mouseenter={createBlobUrl}>{result.filename}</a
    >
  </td>
  <td class="cell size-cell">
    {#if result.status === 'success'}
      <span in:fade>
        {formatBytes(result.blob.size)}
      </span>
    {/if}
  </td>
  <td class="cell delta-cell">
    {#if result.status === 'success'}
      <span in:fade>
        {getDelta(source.file.size, result.blob.size)}
      </span>
    {/if}
  </td>
</tr>

<style>
  .cell {
    transition: background-color 200ms ease;
    font-family: var(--font-mono);
  }

  .row:hover .cell {
    background-color: #181818;
  }

  .link {
    text-decoration: underline;
    text-underline-offset: 0.125em;
  }
</style>
