<script lang="ts">
  import iconAvif from '@/assets/upload.avif?url';
  import iconWebp from '@/assets/upload.webp?url';
  import iconPng from '@/assets/upload.png?url';
  import { sources$ } from '@/stores/sources';

  const mimeTypes = [
    'image/avif',
    'image/webp',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ];

  let dragging = false;
  function onDragStart(event) {
    event.preventDefault();
    dragging = true;
  }

  function onDragEnd(event) {
    event.preventDefault();
    dragging = false;
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    dragging = false;

    if (!event.dataTransfer) return;

    addSources(event.dataTransfer.files);
  }

  function onChooseFile(event) {
    const element = event.target as HTMLInputElement;
    addSources(element.files);
    element.value = '';
  }

  function addSources(fileList: FileList) {
    const files = Array.from(fileList).filter(file => file.type);
    if (files.length === 0) return;
    sources$.add(files);
  }
</script>

<svelte:body
  on:dragenter={onDragStart}
  on:dragover={onDragStart}
  on:dragleave={onDragEnd}
  on:dragend={onDragEnd}
  on:drop={onDrop} />

<div class="container">
  <picture>
    <source srcset={iconAvif} type="image/avif" />
    <source srcset={iconWebp} type="image/webp" />
    <img src={iconPng} alt="" class="upload-icon" height="128" width="128" />
  </picture>
  <p class="">
    Drop images here, or
    <input
      accept={mimeTypes.join()}
      aria-describedby="files-input-error"
      class="sr-only files-input"
      id="files-input"
      multiple
      type="file"
      on:change={onChooseFile}
    />
    <label class="files-input-label" for="files-input">browse files</label>
  </p>
</div>

<style>
  .container {
    border-radius: 6px;
    border: 1px dotted var(--color-border);
    display: flex;
    flex-direction: column;
    place-items: center;
    padding: 4rem;
    width: 100%;
  }

  .files-input-label {
    text-decoration: underline;
  }

  .files-input:focus-visible + .files-input-label {
    border-radius: 4px;
    outline-width: var(--focus-ring-width);
    outline-color: var(--focus-ring-color);
    outline-style: var(--focus-ring-style);
    outline-offset: 0.25em;
    z-index: 10;
  }

  .upload-icon {
  }
</style>
